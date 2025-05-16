// src/services/performance/utils/memoryManager.ts

import { EventEmitter } from 'events';
import { promisify } from 'util';
import { exec } from 'child_process';
import logger from '../../../utils/logger';

const execAsync = promisify(exec);

/**
 * Memory manager for monitoring and optimizing server memory usage
 */
export class MemoryManager extends EventEmitter {
  private memoryUsageThreshold: number;
  private checkIntervalMs: number;
  private isMonitoring: boolean;
  private intervalId: NodeJS.Timeout | null;
  private lastGcTime: number;
  private gcCooldownMs: number;

  /**
   * Create a new memory manager instance
   * @param memoryUsageThreshold Memory usage threshold in percentage (0-100)
   * @param checkIntervalMs Check interval in milliseconds
   * @param gcCooldownMs Garbage collection cooldown in milliseconds
   */
  constructor(
    memoryUsageThreshold: number = 80,
    checkIntervalMs: number = 60000,
    gcCooldownMs: number = 300000
  ) {
    super();
    this.memoryUsageThreshold = memoryUsageThreshold;
    this.checkIntervalMs = checkIntervalMs;
    this.isMonitoring = false;
    this.intervalId = null;
    this.lastGcTime = 0;
    this.gcCooldownMs = gcCooldownMs;
  }

  /**
   * Start memory monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.intervalId = setInterval(() => this.checkMemoryUsage(), this.checkIntervalMs);
    logger.info('Memory monitoring started');
  }

  /**
   * Stop memory monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring || !this.intervalId) {
      return;
    }

    clearInterval(this.intervalId);
    this.isMonitoring = false;
    this.intervalId = null;
    logger.info('Memory monitoring stopped');
  }

  /**
   * Check current memory usage
   */
  async checkMemoryUsage(): Promise<void> {
    try {
      const memoryInfo = await this.getMemoryInfo();
      const memoryUsagePercent = memoryInfo.usedPercent;

      // Log memory usage
      if (memoryUsagePercent > this.memoryUsageThreshold) {
        logger.warn(`High memory usage: ${memoryUsagePercent.toFixed(2)}%`);
        this.emit('high-memory', memoryInfo);
        
        // Try to free memory if threshold exceeded
        await this.tryFreeMemory();
      } else {
        logger.debug(`Memory usage: ${memoryUsagePercent.toFixed(2)}%`);
      }
    } catch (error) {
      logger.error(`Error checking memory usage: ${error}`);
    }
  }

  /**
   * Get current memory information
   * @returns Memory information
   */
  async getMemoryInfo(): Promise<{
    total: number;
    used: number;
    free: number;
    usedPercent: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    rss: number;
  }> {
    // Get system memory info
    let systemTotal = 0;
    let systemFree = 0;
    
    try {
      if (process.platform === 'linux') {
        const { stdout } = await execAsync('free -b');
        const lines = stdout.trim().split('\n');
        const memInfo = lines[1].split(/\s+/);
        systemTotal = parseInt(memInfo[1], 10);
        systemFree = parseInt(memInfo[3], 10);
      } else if (process.platform === 'darwin') {
        const { stdout: totalStdout } = await execAsync('sysctl -n hw.memsize');
        systemTotal = parseInt(totalStdout.trim(), 10);
        
        const { stdout: freeStdout } = await execAsync('vm_stat | grep "Pages free:"');
        const pagesFree = parseInt(freeStdout.trim().split(/\s+/)[2], 10);
        const pageSize = 4096; // Default page size on macOS
        systemFree = pagesFree * pageSize;
      } else if (process.platform === 'win32') {
        const { stdout } = await execAsync('wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /Value');
        const lines = stdout.trim().split('\n');
        const freeMemory = lines.find(line => line.includes('FreePhysicalMemory'));
        const totalMemory = lines.find(line => line.includes('TotalVisibleMemorySize'));
        
        if (freeMemory && totalMemory) {
          systemFree = parseInt(freeMemory.split('=')[1], 10) * 1024;
          systemTotal = parseInt(totalMemory.split('=')[1], 10) * 1024;
        }
      }
    } catch (error) {
      logger.error(`Error getting system memory info: ${error}`);
    }
    
    // Get Node.js memory usage
    const memoryUsage = process.memoryUsage();
    
    // Calculate memory usage
    const systemUsed = systemTotal - systemFree;
    const systemUsedPercent = (systemUsed / systemTotal) * 100;
    
    return {
      total: systemTotal,
      used: systemUsed,
      free: systemFree,
      usedPercent: systemUsedPercent,
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed,
      external: memoryUsage.external,
      rss: memoryUsage.rss,
    };
  }

  /**
   * Try to free memory by triggering garbage collection
   */
  async tryFreeMemory(): Promise<void> {
    const now = Date.now();
    
    // Check if GC cooldown has passed
    if (now - this.lastGcTime < this.gcCooldownMs) {
      logger.debug('Skipping memory cleanup due to cooldown');
      return;
    }
    
    logger.info('Attempting to free memory...');
    
    // Update last GC time
    this.lastGcTime = now;
    
    // Emit event for memory cleanup
    this.emit('cleanup');
    
    // Force garbage collection if --expose-gc flag is set
    if (global.gc) {
      logger.info('Running garbage collection');
      global.gc();
    } else {
      logger.info('Manual garbage collection not available. Start Node.js with --expose-gc flag to enable it.');
    }
    
    // Clear module cache for non-essential modules
    this.clearModuleCache();
    
    // Log memory usage after cleanup
    const memoryInfo = await this.getMemoryInfo();
    logger.info(`Memory usage after cleanup: ${memoryInfo.usedPercent.toFixed(2)}%`);
  }

  /**
   * Clear module cache for non-essential modules
   */
  private clearModuleCache(): void {
    const nonEssentialModules = Object.keys(require.cache).filter(modulePath => {
      // Keep essential modules
      return !modulePath.includes('node_modules') &&
             !modulePath.includes('config') &&
             !modulePath.includes('utils') &&
             !modulePath.includes('models') &&
             !modulePath.includes('performance');
    });
    
    // Clear cache for non-essential modules
    nonEssentialModules.forEach(modulePath => {
      delete require.cache[modulePath];
    });
    
    logger.debug(`Cleared module cache for ${nonEssentialModules.length} non-essential modules`);
  }

  /**
   * Get memory usage statistics
   * @returns Memory usage statistics
   */
  getMemoryStats(): {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  } {
    const memoryUsage = process.memoryUsage();
    return {
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      external: memoryUsage.external,
      rss: memoryUsage.rss,
    };
  }
}

// Export singleton instance
export const memoryManager = new MemoryManager();
