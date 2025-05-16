// src/services/scalability/utils/monitoring.ts

import os from 'os';
import { EventEmitter } from 'events';
import { redisClient } from '../../../config/redis.config';
import logger from '../../../utils/logger';
import { ScalabilityConfig } from '../config/scalabilityConfig';

// Define system metrics interface
export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  requestRate: number;
  errorRate: number;
  responseTime: number;
  queueLength: number;
  dbConnectionPoolUsage: number;
  cacheHitRate: number;
}

// Define system health interface
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  metrics: SystemMetrics;
  lastUpdated: Date;
}

// Create an event emitter for system events
const systemEvents = new EventEmitter();

/**
 * Collect current system metrics
 * @returns Current system metrics
 */
const collectSystemMetrics = async (): Promise<SystemMetrics> => {
  try {
    // Get CPU usage (average load over 1 minute)
    const cpuLoad = os.loadavg()[0];
    const cpuCount = os.cpus().length;
    const cpuUsage = Math.min(100, (cpuLoad / cpuCount) * 100);
    
    // Get memory usage
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;
    
    // Get active connections (mocked for now)
    const activeConnections = await redisClient.get('metrics:active_connections')
      .then(val => parseInt(val || '0', 10));
    
    // Get request rate (mocked for now)
    const requestRate = await redisClient.get('metrics:request_rate')
      .then(val => parseInt(val || '0', 10));
    
    // Get error rate (mocked for now)
    const errorRate = await redisClient.get('metrics:error_rate')
      .then(val => parseInt(val || '0', 10));
    
    // Get response time (mocked for now)
    const responseTime = await redisClient.get('metrics:response_time')
      .then(val => parseInt(val || '0', 10));
    
    // Get queue length (mocked for now)
    const queueLength = await redisClient.get('metrics:queue_length')
      .then(val => parseInt(val || '0', 10));
    
    // Get DB connection pool usage (mocked for now)
    const dbConnectionPoolUsage = await redisClient.get('metrics:db_connection_pool_usage')
      .then(val => parseInt(val || '0', 10));
    
    // Get cache hit rate (mocked for now)
    const cacheHitRate = await redisClient.get('metrics:cache_hit_rate')
      .then(val => parseInt(val || '0', 10));
    
    return {
      cpuUsage,
      memoryUsage,
      activeConnections,
      requestRate,
      errorRate,
      responseTime,
      queueLength,
      dbConnectionPoolUsage,
      cacheHitRate,
    };
  } catch (error) {
    logger.error('Error collecting system metrics:', error);
    
    // Return default metrics in case of error
    return {
      cpuUsage: 0,
      memoryUsage: 0,
      activeConnections: 0,
      requestRate: 0,
      errorRate: 0,
      responseTime: 0,
      queueLength: 0,
      dbConnectionPoolUsage: 0,
      cacheHitRate: 0,
    };
  }
};

/**
 * Determine system health status based on metrics
 * @param metrics System metrics
 * @returns System health status
 */
const determineHealthStatus = (metrics: SystemMetrics): 'healthy' | 'degraded' | 'critical' => {
  // Define thresholds
  const criticalThresholds = {
    cpuUsage: 90,
    memoryUsage: 90,
    errorRate: 10,
    responseTime: 5000,
  };
  
  const degradedThresholds = {
    cpuUsage: 70,
    memoryUsage: 70,
    errorRate: 5,
    responseTime: 2000,
  };
  
  // Check for critical conditions
  if (
    metrics.cpuUsage >= criticalThresholds.cpuUsage ||
    metrics.memoryUsage >= criticalThresholds.memoryUsage ||
    metrics.errorRate >= criticalThresholds.errorRate ||
    metrics.responseTime >= criticalThresholds.responseTime
  ) {
    return 'critical';
  }
  
  // Check for degraded conditions
  if (
    metrics.cpuUsage >= degradedThresholds.cpuUsage ||
    metrics.memoryUsage >= degradedThresholds.memoryUsage ||
    metrics.errorRate >= degradedThresholds.errorRate ||
    metrics.responseTime >= degradedThresholds.responseTime
  ) {
    return 'degraded';
  }
  
  // Otherwise, system is healthy
  return 'healthy';
};

/**
 * Update system health
 */
const updateSystemHealth = async (): Promise<void> => {
  try {
    // Collect current metrics
    const metrics = await collectSystemMetrics();
    
    // Determine health status
    const status = determineHealthStatus(metrics);
    
    // Create system health object
    const systemHealth: SystemHealth = {
      status,
      metrics,
      lastUpdated: new Date(),
    };
    
    // Store in Redis
    await redisClient.set('system:health', JSON.stringify(systemHealth));
    
    // Store in history (for trending)
    const timestamp = Math.floor(Date.now() / (5 * 60 * 1000)); // 5-minute buckets
    await redisClient.hSet('metrics:history', timestamp.toString(), JSON.stringify(metrics));
    
    // Emit events based on status
    if (status === 'critical') {
      systemEvents.emit('system:critical', metrics);
    } else if (status === 'degraded') {
      systemEvents.emit('system:degraded', metrics);
    } else {
      systemEvents.emit('system:healthy', metrics);
    }
    
    // Clean up old history (keep 24 hours = 288 5-minute buckets)
    const cutoff = Math.floor(Date.now() / (5 * 60 * 1000)) - 288;
    const keys = await redisClient.hKeys('metrics:history');
    
    for (const key of keys) {
      if (parseInt(key, 10) < cutoff) {
        await redisClient.hDel('metrics:history', key);
      }
    }
  } catch (error) {
    logger.error('Error updating system health:', error);
  }
};

/**
 * Setup automatic scaling based on system metrics
 */
const setupAutoScaling = (): void => {
  // Listen for system events
  systemEvents.on('system:critical', (metrics) => {
    logger.warn('System in CRITICAL state - activating emergency measures', metrics);
    
    try {
      // Implement emergency measures here
      // 1. Increase cache TTL to reduce database load
      // 2. Activate circuit breakers for non-essential endpoints
      // 3. Scale up resources if possible
    } catch (error) {
      logger.error('Error implementing emergency measures:', error);
    }
  });
  
  // Handle degraded state
  systemEvents.on('system:degraded', (metrics) => {
    logger.warn('System in DEGRADED state - activating optimizations', metrics);
    
    try {
      // Implement optimizations here
      // 1. Increase cache usage
      // 2. Reduce non-essential background tasks
    } catch (error) {
      logger.error('Error implementing optimizations:', error);
    }
  });
  
  // Handle recovery
  systemEvents.on('system:healthy', (metrics) => {
    logger.info('System in HEALTHY state - normal operation', metrics);
    
    try {
      // Return to normal operation
      // 1. Reset cache TTLs
      // 2. Resume normal background tasks
    } catch (error) {
      logger.error('Error returning to normal operation:', error);
    }
  });
};

/**
 * Setup scalability monitoring
 * @param interval Monitoring interval in milliseconds
 */
const setupScalabilityMonitoring = (interval: number = 60000): void => {
  logger.info(`Setting up scalability monitoring with interval: ${interval}ms`);
  
  // Set up periodic health checks
  setInterval(() => {
    updateSystemHealth().catch(error => {
      logger.error('Error during health check:', error);
    });
  }, interval);
  
  // Set up auto-scaling
  setupAutoScaling();
  
  // Initialize with first health check
  updateSystemHealth().catch(error => {
    logger.error('Error during initial health check:', error);
  });
  
  logger.info('Scalability monitoring initialized');
};

export default {
  setupScalabilityMonitoring,
  systemEvents,
};
