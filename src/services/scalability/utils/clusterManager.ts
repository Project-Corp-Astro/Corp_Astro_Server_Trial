// src/services/scalability/utils/clusterManager.ts

import * as cluster from 'cluster';
import os from 'os';
import logger from '../../../utils/logger';
import { ScalabilityConfig } from '../config/scalabilityConfig';

// Type augmentation for older Node.js versions compatibility
interface ClusterExtension {
  isPrimary?: boolean;
  isMaster?: boolean;
  isWorker?: boolean;
  fork(): cluster.Worker;
  on(event: string, callback: (...args: any[]) => void): void;
}

// Cast cluster to include both old and new properties
const clusterExt = cluster as unknown as ClusterExtension;

/**
 * Cluster Manager for horizontal scaling across CPU cores
 */
class ClusterManager {
  private static instance: ClusterManager;
  private workers: Map<number, cluster.Worker> = new Map<number, cluster.Worker>();
  private isEnabled: boolean = ScalabilityConfig.CLUSTER_ENABLED;
  private workerCount: number = ScalabilityConfig.CLUSTER_WORKERS;
  private metrics = {
    totalWorkers: 0,
    activeWorkers: 0,
    restarts: 0,
    lastRestart: null as Date | null,
  };

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    // Set default worker count if not specified
    if (!this.workerCount || this.workerCount <= 0) {
      this.workerCount = os.cpus().length;
    }
  }

  /**
   * Get singleton instance
   * @returns ClusterManager instance
   */
  public static getInstance(): ClusterManager {
    if (!ClusterManager.instance) {
      ClusterManager.instance = new ClusterManager();
    }
    return ClusterManager.instance;
  }

  /**
   * Check if this is the primary process
   * @returns True if primary process
   */
  public isPrimaryProcess(): boolean {
    if (!this.isEnabled) {
      return true;
    }
    
    // For Node.js 16+, use isPrimary, for older versions use isMaster
    return !!(clusterExt.isPrimary || clusterExt.isMaster);
  }

  /**
   * Initialize cluster
   */
  public initialize(): void {
    if (!this.isEnabled) {
      logger.info('Cluster mode is disabled. Running in single process mode.');
      return;
    }

    if (this.isPrimaryProcess()) {
      logger.info(`Starting cluster with ${this.workerCount} workers`);
      
      // Setup event listeners for primary process
      clusterExt.on('fork', (worker) => {
        logger.info(`Worker ${worker.id} started`);
        this.workers.set(worker.id, worker);
        this.metrics.totalWorkers++;
        this.metrics.activeWorkers++;
      });
      
      // Fork workers
      for (let i = 0; i < this.workerCount; i++) {
        this.forkWorker();
      }
      
      // Set up worker monitoring
      this.setupWorkerMonitoring();
    } else {
      logger.info(`Worker ${process.pid} started`);
    }
  }

  /**
   * Fork a new worker
   */
  private forkWorker(): cluster.Worker {
    const worker = clusterExt.fork();
    
    // Add worker-specific environment variables
    if (worker.process && typeof worker.process === 'object') {
      (worker.process as any).env = (worker.process as any).env || {};
      (worker.process as any).env.WORKER_ID = worker.id.toString();
    }
    
    return worker;
  }

  /**
   * Set up monitoring for workers
   */
  private setupWorkerMonitoring(): void {
    // Handle worker exit
    clusterExt.on('exit', (worker, code, signal) => {
      this.metrics.activeWorkers--;
      logger.warn(`Worker ${worker.id} died with code ${code} and signal ${signal}`);
      
      // Remove from workers map
      this.workers.delete(worker.id);
      
      // Restart worker
      if (this.isEnabled) {
        logger.info(`Restarting worker ${worker.id}`);
        this.forkWorker();
        this.metrics.restarts++;
        this.metrics.lastRestart = new Date();
      }
    });
    
    // Handle worker online
    clusterExt.on('online', (worker) => {
      logger.info(`Worker ${worker.id} is online`);
    });
    
    // Handle worker disconnect
    clusterExt.on('disconnect', (worker) => {
      logger.warn(`Worker ${worker.id} disconnected`);
    });
    
    // Set up health check interval
    setInterval(() => {
      this.checkWorkersHealth();
    }, ScalabilityConfig.WORKER_HEALTH_CHECK_INTERVAL);
  }

  /**
   * Check health of all workers
   */
  private checkWorkersHealth(): void {
    if (!this.isPrimaryProcess()) {
      return;
    }
    
    for (const [id, worker] of this.workers.entries()) {
      // In a real implementation, you would send a health check message to the worker
      // and expect a response within a certain timeframe
      // For now, we'll just check if the worker is connected
      if (!worker.isConnected()) {
        logger.warn(`Worker ${id} is not responding, restarting...`);
        this.restartWorker(worker);
      }
      
      // Example of how to check custom health metrics
      // This would require implementing a messaging system between primary and workers
      // const workerHealth = (worker as any).health;
      // if (workerHealth && workerHealth.memoryUsage > 90) {
      //   logger.warn(`Worker ${id} has high memory usage (${workerHealth.memoryUsage}%), restarting...`);
      //   this.restartWorker(worker);
      // }
    }
  }

  /**
   * Restart a specific worker
   * @param worker Worker to restart
   */
  private restartWorker(worker: cluster.Worker): void {
    try {
      // Disconnect worker gracefully
      worker.disconnect();
      
      // Set a timeout to force kill if it doesn't exit gracefully
      const forceKillTimeout = setTimeout(() => {
        if (worker.isConnected()) {
          logger.warn(`Force killing worker ${worker.id}`);
          worker.kill('SIGKILL');
        }
      }, ScalabilityConfig.WORKER_FORCE_KILL_TIMEOUT);
      
      // Clear timeout if worker exits gracefully
      worker.once('exit', () => {
        clearTimeout(forceKillTimeout);
      });
      
      // Update metrics
      this.metrics.restarts++;
      this.metrics.lastRestart = new Date();
    } catch (error) {
      logger.error(`Error restarting worker ${worker.id}:`, error);
    }
  }

  /**
   * Scale workers up or down based on load
   * @param targetCount Target number of workers
   */
  public scaleWorkers(targetCount: number): void {
    if (!this.isPrimaryProcess() || !this.isEnabled) {
      return;
    }
    
    const currentCount = this.workers.size;
    
    if (targetCount > currentCount) {
      // Scale up
      const workersToAdd = targetCount - currentCount;
      logger.info(`Scaling up by adding ${workersToAdd} workers`);
      
      for (let i = 0; i < workersToAdd; i++) {
        this.forkWorker();
      }
    } else if (targetCount < currentCount) {
      // Scale down
      const workersToRemove = currentCount - targetCount;
      logger.info(`Scaling down by removing ${workersToRemove} workers`);
      
      // Get workers sorted by memory usage (if we had that info)
      // For now, just get the last N workers
      const workerIds = Array.from(this.workers.keys()).slice(-workersToRemove);
      
      for (const id of workerIds) {
        const worker = this.workers.get(id);
        if (worker) {
          this.restartWorker(worker);
        }
      }
    }
  }

  /**
   * Get cluster metrics
   * @returns Cluster metrics
   */
  public getMetrics(): any {
    return {
      ...this.metrics,
      currentWorkers: this.workers.size,
      enabled: this.isEnabled,
      targetWorkers: this.workerCount,
    };
  }

  /**
   * Check if cluster mode is enabled
   * @returns True if cluster mode is enabled
   */
  public isClusterMode(): boolean {
    return this.isEnabled;
  }

  /**
   * Check if this is a worker process
   * @returns True if worker process
   */
  public isWorkerProcess(): boolean {
    if (!this.isEnabled) {
      return false;
    }
    
    // For Node.js 16+, use isWorker, for older versions use !isMaster
    return !!(clusterExt.isWorker || !clusterExt.isMaster);
  }
}

export default ClusterManager.getInstance();
