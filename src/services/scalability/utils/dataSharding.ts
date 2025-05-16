// src/services/scalability/utils/dataSharding.ts

import { redisClient } from '../../../config/redis.config';
import logger from '../../../utils/logger';
import { ScalabilityConfig } from '../config/scalabilityConfig';

/**
 * Sharding strategies
 */
export enum ShardingStrategy {
  USER_ID = 'user_id',
  DATE_RANGE = 'date_range',
  CONTENT_TYPE = 'content_type',
  GEOGRAPHY = 'geography',
}

/**
 * Data Sharding Manager for horizontal data partitioning
 */
class DataShardingManager {
  private static instance: DataShardingManager;
  private strategy: ShardingStrategy = ShardingStrategy.USER_ID;
  private shardCount: number = 4; // Default number of shards
  private metrics = {
    shardsPerNode: {} as Record<string, number>,
    dataPerShard: {} as Record<string, number>,
    queriesPerShard: {} as Record<string, number>,
  };

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of DataShardingManager
   */
  public static getInstance(): DataShardingManager {
    if (!DataShardingManager.instance) {
      DataShardingManager.instance = new DataShardingManager();
    }
    return DataShardingManager.instance;
  }

  /**
   * Initialize the data sharding manager
   */
  public initialize(): void {
    this.startMetricsCollection();
    logger.info(`Data sharding initialized with ${this.strategy} strategy and ${this.shardCount} shards`);
  }

  /**
   * Set the sharding strategy
   * @param strategy Strategy to use
   */
  public setStrategy(strategy: ShardingStrategy): void {
    this.strategy = strategy;
    logger.info(`Sharding strategy set to ${strategy}`);
  }

  /**
   * Set the number of shards
   * @param count Number of shards
   */
  public setShardCount(count: number): void {
    this.shardCount = count;
    logger.info(`Shard count set to ${count}`);
  }

  /**
   * Get the shard ID for a given key
   * @param key Key to shard
   * @returns Shard ID
   */
  public getShardId(key: string | number | Date, context?: Record<string, any>): string {
    switch (this.strategy) {
      case ShardingStrategy.USER_ID:
        return this.getUserIdShard(key);
      case ShardingStrategy.DATE_RANGE:
        return this.getDateRangeShard(key);
      case ShardingStrategy.CONTENT_TYPE:
        return this.getContentTypeShard(key, context);
      case ShardingStrategy.GEOGRAPHY:
        return this.getGeographyShard(key, context);
      default:
        return this.getUserIdShard(key);
    }
  }

  /**
   * Get shard ID based on user ID
   * @param key User ID
   * @returns Shard ID
   */
  private getUserIdShard(key: string | number | Date): string {
    // Convert key to string if it's not already
    const userId = key.toString();
    
    // Use consistent hashing to determine shard
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    
    // Use absolute value and modulo to get shard index
    const shardIndex = Math.abs(hash) % this.shardCount;
    
    return `shard-${shardIndex}`;
  }

  /**
   * Get shard ID based on date range
   * @param key Date or timestamp
   * @returns Shard ID
   */
  private getDateRangeShard(key: string | number | Date): string {
    // Convert key to Date if it's not already
    const date = key instanceof Date ? key : new Date(key);
    
    // Use year and month to determine shard
    // This creates a new shard for each month
    const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    // Map year-month to a shard index using modulo
    let hash = 0;
    for (let i = 0; i < yearMonth.length; i++) {
      hash = ((hash << 5) - hash) + yearMonth.charCodeAt(i);
      hash |= 0;
    }
    
    const shardIndex = Math.abs(hash) % this.shardCount;
    
    return `shard-${shardIndex}`;
  }

  /**
   * Get shard ID based on content type
   * @param key Content ID
   * @param context Additional context including content type
   * @returns Shard ID
   */
  private getContentTypeShard(key: string | number | Date, context?: Record<string, any>): string {
    if (!context || !context.contentType) {
      // Fall back to user ID sharding if content type is not provided
      return this.getUserIdShard(key);
    }
    
    // Map content type to a specific shard
    const contentTypeMap: Record<string, number> = {
      'daily_horoscope': 0,
      'monthly_report': 1,
      'business_insight': 2,
      'compatibility': 3,
    };
    
    const shardIndex = contentTypeMap[context.contentType] !== undefined ? 
      contentTypeMap[context.contentType] : 
      Math.abs(context.contentType.hashCode()) % this.shardCount;
    
    return `shard-${shardIndex}`;
  }

  /**
   * Get shard ID based on geography
   * @param key User ID or content ID
   * @param context Additional context including location
   * @returns Shard ID
   */
  private getGeographyShard(key: string | number | Date, context?: Record<string, any>): string {
    if (!context || !context.location) {
      // Fall back to user ID sharding if location is not provided
      return this.getUserIdShard(key);
    }
    
    // Map regions to specific shards
    const regionMap: Record<string, number> = {
      'north_america': 0,
      'europe': 1,
      'asia_pacific': 2,
      'other': 3,
    };
    
    const shardIndex = regionMap[context.location] !== undefined ? 
      regionMap[context.location] : 
      Math.abs(context.location.hashCode()) % this.shardCount;
    
    return `shard-${shardIndex}`;
  }

  /**
   * Get connection details for a specific shard
   * @param shardId Shard ID
   * @returns Connection details
   */
  public getShardConnection(shardId: string): Record<string, any> {
    // In a real implementation, this would return actual connection details
    // for the specified shard, such as host, port, username, password, etc.
    
    // For this example, we'll return mock connection details
    const shardIndex = parseInt(shardId.split('-')[1], 10);
    
    return {
      host: `db-${shardIndex}.example.com`,
      port: 5432,
      database: `corp_astro_${shardId}`,
      username: 'app_user',
      password: '********',
    };
  }

  /**
   * Start collecting sharding metrics
   */
  private startMetricsCollection(): void {
    // Collect metrics every 30 seconds
    setInterval(() => {
      try {
        // In a real implementation, you would collect metrics from each shard
        
        // Log metrics periodically (every 5 minutes)
        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() % fiveMinutes < 30000) {
          logger.info('Data sharding metrics:', {
            strategy: this.strategy,
            shardCount: this.shardCount,
            shardsPerNode: this.metrics.shardsPerNode,
            dataPerShard: this.metrics.dataPerShard,
          });
        }
        
        // Adapt strategy based on current conditions
        this.adaptStrategy();
      } catch (error) {
        logger.error('Error collecting data sharding metrics:', error);
      }
    }, 30000);
  }

  /**
   * Adapt sharding strategy based on current conditions
   */
  private adaptStrategy(): void {
    try {
      // Get system health
      const systemHealth = global.systemHealth;
      
      if (!systemHealth) {
        return;
      }
      
      // Check if we need to rebalance shards
      const needsRebalancing = this.checkShardBalance();
      
      if (needsRebalancing) {
        logger.info('Shard imbalance detected, initiating rebalancing...');
        this.rebalanceShards();
      }
      
      // Adapt strategy based on system growth
      this.evaluateShardGrowth();
    } catch (error) {
      logger.error('Error adapting sharding strategy:', error);
    }
  }

  /**
   * Check if shards are balanced
   * @returns True if rebalancing is needed
   */
  private checkShardBalance(): boolean {
    // In a real implementation, this would check data distribution across shards
    // and determine if rebalancing is needed
    
    // For this example, we'll randomly decide to rebalance 5% of the time
    return Math.random() < 0.05;
  }

  /**
   * Rebalance shards to ensure even data distribution
   */
  private rebalanceShards(): void {
    // In a real implementation, this would move data between shards
    // to ensure even distribution
    
    logger.info('Rebalancing shards...');
    
    // Simulate rebalancing process
    setTimeout(() => {
      logger.info('Shard rebalancing completed');
    }, 5000);
  }

  /**
   * Evaluate shard growth and adjust shard count if needed
   */
  private evaluateShardGrowth(): void {
    // In a real implementation, this would analyze data growth trends
    // and determine if more shards are needed
    
    // For this example, we'll check if any shard has more than 1GB of data
    const maxDataPerShard = Math.max(...Object.values(this.metrics.dataPerShard));
    
    if (maxDataPerShard > 1024 * 1024 * 1024) { // 1GB
      // Increase shard count
      const newShardCount = this.shardCount + 1;
      logger.info(`Increasing shard count from ${this.shardCount} to ${newShardCount} due to data growth`);
      this.setShardCount(newShardCount);
    }
  }

  /**
   * Get current sharding metrics
   */
  public getShardingMetrics() {
    return { ...this.metrics };
  }
}

// Add hashCode method to String prototype for hashing
declare global {
  interface String {
    hashCode(): number;
  }
}

String.prototype.hashCode = function(): number {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    hash = ((hash << 5) - hash) + this.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return hash;
};

export default DataShardingManager.getInstance();
