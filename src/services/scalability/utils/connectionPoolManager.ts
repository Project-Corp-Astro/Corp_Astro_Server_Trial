// src/services/scalability/utils/connectionPoolManager.ts

import { Sequelize } from 'sequelize';
import logger from '../../../utils/logger';
import { ScalabilityConfig } from '../config/scalabilityConfig';
import { redisClient } from '../../../config/redis.config';

/**
 * Connection Pool Manager for database connections
 * Handles connection pooling, scaling, and monitoring
 */
class ConnectionPoolManager {
  private static instance: ConnectionPoolManager;
  private sequelize: Sequelize;
  private metrics = {
    activeConnections: 0,
    maxConnections: 0,
    waitingRequests: 0,
    connectionTime: 0,
    queryTime: 0,
  };

  /**
   * Private constructor for singleton pattern
   * @param sequelize Sequelize instance
   */
  private constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  /**
   * Get singleton instance
   * @param sequelize Sequelize instance
   * @returns ConnectionPoolManager instance
   */
  public static getInstance(sequelize?: Sequelize): ConnectionPoolManager {
    if (!ConnectionPoolManager.instance && sequelize) {
      ConnectionPoolManager.instance = new ConnectionPoolManager(sequelize);
    } else if (!ConnectionPoolManager.instance) {
      throw new Error('ConnectionPoolManager not initialized. Provide Sequelize instance.');
    }
    return ConnectionPoolManager.instance;
  }

  /**
   * Configure connection pool
   */
  public configurePool(): void {
    // Create pool configuration
    const config = {
      pool: {
        max: ScalabilityConfig.DB_POOL_MAX,
        min: ScalabilityConfig.DB_POOL_MIN,
        idle: ScalabilityConfig.DB_POOL_IDLE,
        acquire: ScalabilityConfig.DB_POOL_ACQUIRE,
      },
    };

    // Apply configuration to the Sequelize instance
    // We need to cast to any because the TypeScript definitions don't include all options
    (this.sequelize as any).options = {
      ...(this.sequelize as any).options,
      ...config
    };
    
    logger.info('Database connection pool configured', {
      min: ScalabilityConfig.DB_POOL_MIN,
      max: ScalabilityConfig.DB_POOL_MAX,
      idle: ScalabilityConfig.DB_POOL_IDLE,
      acquire: ScalabilityConfig.DB_POOL_ACQUIRE,
    });
  }

  /**
   * Start monitoring connection pool
   */
  public startMonitoring(): void {
    // Set up monitoring interval
    setInterval(() => {
      this.collectMetrics();
    }, ScalabilityConfig.DB_POOL_MONITOR_INTERVAL);
    
    logger.info('Database connection pool monitoring started');
  }

  /**
   * Collect connection pool metrics
   */
  private async collectMetrics(): Promise<void> {
    try {
      // Get pool stats from Sequelize
      // Note: This is implementation-specific and may need to be adjusted
      // based on the actual Sequelize version and implementation
      const pool = (this.sequelize as any).connectionManager.pool;
      
      if (pool) {
        this.metrics = {
          activeConnections: pool.size,
          maxConnections: pool.max,
          waitingRequests: pool.pending,
          connectionTime: pool.stats?.connectionTime || 0,
          queryTime: pool.stats?.queryTime || 0,
        };
        
        // Store metrics in Redis for monitoring
        await redisClient.hSet('metrics:db:pool', {
          activeConnections: this.metrics.activeConnections,
          maxConnections: this.metrics.maxConnections,
          waitingRequests: this.metrics.waitingRequests,
          connectionTime: this.metrics.connectionTime,
          queryTime: this.metrics.queryTime,
          timestamp: Date.now(),
        });
        
        // Check if pool is under pressure
        this.checkPoolPressure();
      }
    } catch (error) {
      logger.error('Error collecting connection pool metrics:', error);
    }
  }

  /**
   * Check if connection pool is under pressure and adjust if needed
   */
  private checkPoolPressure(): void {
    try {
      const { activeConnections, maxConnections, waitingRequests } = this.metrics;
      
      // Calculate usage percentage
      const usagePercentage = (activeConnections / maxConnections) * 100;
      
      // Check if pool is under high pressure
      if (usagePercentage > ScalabilityConfig.DB_POOL_SCALE_THRESHOLD && waitingRequests > 0) {
        // Scale up pool
        this.scalePool(true);
      } 
      // Check if pool is under low pressure
      else if (usagePercentage < ScalabilityConfig.DB_POOL_SCALE_DOWN_THRESHOLD && waitingRequests === 0) {
        // Scale down pool
        this.scalePool(false);
      }
    } catch (error) {
      logger.error('Error checking connection pool pressure:', error);
    }
  }

  /**
   * Scale connection pool up or down
   * @param scaleUp True to scale up, false to scale down
   */
  private scalePool(scaleUp: boolean): void {
    try {
      // Get current pool configuration
      const currentMax = (this.sequelize as any).connectionManager.pool.max;
      
      // Calculate new max connections
      let newMax = currentMax;
      
      if (scaleUp) {
        // Scale up by 25% but don't exceed the absolute maximum
        newMax = Math.min(
          Math.ceil(currentMax * 1.25),
          ScalabilityConfig.DB_POOL_ABSOLUTE_MAX
        );
      } else {
        // Scale down by 25% but don't go below the minimum
        newMax = Math.max(
          Math.floor(currentMax * 0.75),
          ScalabilityConfig.DB_POOL_MIN
        );
      }
      
      // Only update if the value has changed
      if (newMax !== currentMax) {
        // Update pool configuration
        (this.sequelize as any).connectionManager.pool.max = newMax;
        
        logger.info(`Connection pool ${scaleUp ? 'scaled up' : 'scaled down'}`, {
          previousMax: currentMax,
          newMax,
        });
      }
    } catch (error) {
      logger.error(`Error scaling connection pool ${scaleUp ? 'up' : 'down'}:`, error);
    }
  }

  /**
   * Get connection pool metrics
   * @returns Connection pool metrics
   */
  public getMetrics(): any {
    return this.metrics;
  }
}

// Export a function to get or create the instance
export default {
  getInstance: (sequelize?: Sequelize) => ConnectionPoolManager.getInstance(sequelize),
};
