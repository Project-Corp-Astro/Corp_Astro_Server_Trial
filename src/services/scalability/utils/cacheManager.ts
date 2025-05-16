// src/services/scalability/utils/cacheManager.ts

import { redisClient } from '../../../config/redis.config';
import logger from '../../../utils/logger';
import { ScalabilityConfig } from '../config/scalabilityConfig';

/**
 * Cache manager for optimizing data access and reducing database load
 */
class CacheManager {
  private static instance: CacheManager;
  private metrics = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    keyCount: 0,
    memoryUsage: 0,
  };

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of CacheManager
   */
  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Initialize the cache manager
   */
  public initialize(): void {
    this.startMetricsCollection();
    logger.info('Cache manager initialized');
  }

  /**
   * Get a value from cache
   * @param key Cache key
   * @returns Cached value or null if not found
   */
  public async get<T>(key: string): Promise<T | null> {
    try {
      const cachedData = await redisClient.get(key);
      
      if (cachedData) {
        // Increment hit counter
        await redisClient.incr('stats:cache:hits');
        this.metrics.hits++;
        
        return JSON.parse(cachedData) as T;
      }
      
      // Increment miss counter
      await redisClient.incr('stats:cache:misses');
      this.metrics.misses++;
      
      return null;
    } catch (error) {
      logger.error(`Error getting cache for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set a value in cache with expiration
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time to live in seconds
   */
  public async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const defaultTtl = this.getDefaultTtl(key);
      const finalTtl = ttl || defaultTtl;
      
      await redisClient.set(key, JSON.stringify(value), { EX: finalTtl });
    } catch (error) {
      logger.error(`Error setting cache for key ${key}:`, error);
    }
  }

  /**
   * Delete a value from cache
   * @param key Cache key
   */
  public async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error(`Error deleting cache for key ${key}:`, error);
    }
  }

  /**
   * Clear cache keys matching a pattern
   * @param pattern Pattern to match (e.g., 'user:*')
   */
  public async clearPattern(pattern: string): Promise<void> {
    try {
      // Use SCAN to find keys matching the pattern
      let cursor = 0;
      do {
        const result = await redisClient.scan(cursor, { MATCH: pattern, COUNT: 100 });
        cursor = result.cursor;
        
        // Delete found keys
        if (result.keys.length > 0) {
          await redisClient.del(result.keys);
          logger.info(`Cleared ${result.keys.length} cache keys matching pattern: ${pattern}`);
        }
      } while (cursor !== 0);
    } catch (error) {
      logger.error(`Error clearing cache pattern ${pattern}:`, error);
    }
  }

  /**
   * Get default TTL based on key type
   * @param key Cache key
   * @returns TTL in seconds
   */
  private getDefaultTtl(key: string): number {
    if (key.startsWith('content:')) {
      return ScalabilityConfig.CACHE_CONTENT_TTL;
    } else if (key.startsWith('user:')) {
      return ScalabilityConfig.CACHE_USER_TTL;
    } else {
      return ScalabilityConfig.CACHE_DEFAULT_TTL;
    }
  }

  /**
   * Start collecting cache metrics
   */
  private startMetricsCollection(): void {
    // Collect metrics every 30 seconds
    setInterval(async () => {
      try {
        // Get cache statistics
        const [hits, misses, keyCount, memoryUsage] = await Promise.all([
          redisClient.get('stats:cache:hits').then(val => parseInt(val || '0', 10)),
          redisClient.get('stats:cache:misses').then(val => parseInt(val || '0', 10)),
          redisClient.dbSize(),
          redisClient.info('memory').then(info => {
            const match = info.match(/used_memory:(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
          }),
        ]);
        
        // Update metrics
        this.metrics.hits = hits;
        this.metrics.misses = misses;
        this.metrics.hitRate = hits + misses > 0 ? (hits / (hits + misses)) * 100 : 0;
        this.metrics.keyCount = keyCount;
        this.metrics.memoryUsage = memoryUsage;
        
        // Log metrics periodically (every 5 minutes)
        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() % fiveMinutes < 30000) {
          logger.info('Cache metrics:', {
            hitRate: `${this.metrics.hitRate.toFixed(2)}%`,
            keyCount: this.metrics.keyCount,
            memoryUsage: `${(this.metrics.memoryUsage / (1024 * 1024)).toFixed(2)} MB`,
          });
        }
        
        // Implement adaptive caching strategy
        this.adaptCachingStrategy();
      } catch (error) {
        logger.error('Error collecting cache metrics:', error);
      }
    }, 30000);
  }

  /**
   * Adapt caching strategy based on system load and cache effectiveness
   */
  private async adaptCachingStrategy(): Promise<void> {
    try {
      // Get system health
      const systemHealth = global.systemHealth;
      
      if (!systemHealth) {
        return;
      }
      
      // If system is under high load, increase cache TTLs
      if (systemHealth.status === 'critical' || systemHealth.status === 'degraded') {
        // Increase TTLs by 2x during high load
        await redisClient.set('cache:ttl:multiplier', '2');
        logger.info('Increased cache TTLs due to high system load');
      } else {
        // Reset to normal TTLs
        await redisClient.set('cache:ttl:multiplier', '1');
      }
      
      // If cache hit rate is low, implement prefetching for popular content
      if (this.metrics.hitRate < 50 && systemHealth.status !== 'critical') {
        await this.prefetchPopularContent();
      }
      
      // If memory usage is high, implement cache eviction for least used items
      if (this.metrics.memoryUsage > 500 * 1024 * 1024) { // Over 500MB
        await this.evictLeastUsedItems();
      }
    } catch (error) {
      logger.error('Error adapting cache strategy:', error);
    }
  }

  /**
   * Prefetch popular content to improve cache hit rate
   */
  private async prefetchPopularContent(): Promise<void> {
    try {
      // Get list of popular content IDs (from analytics)
      const popularContentIds = await redisClient.zRange('analytics:popular:content', 0, 19);
      
      if (popularContentIds.length === 0) {
        return;
      }
      
      logger.info(`Prefetching ${popularContentIds.length} popular content items`);
      
      // In a real implementation, you would fetch this content from the database
      // and cache it with appropriate TTLs
    } catch (error) {
      logger.error('Error prefetching popular content:', error);
    }
  }

  /**
   * Evict least used items from cache to free up memory
   */
  private async evictLeastUsedItems(): Promise<void> {
    try {
      // Get least accessed keys
      const leastAccessedKeys = await redisClient.zRange('cache:access:frequency', 0, 99);
      
      if (leastAccessedKeys.length === 0) {
        return;
      }
      
      // Delete these keys
      await redisClient.del(leastAccessedKeys);
      
      // Remove from access frequency tracking
      if (leastAccessedKeys.length > 0) {
        await redisClient.zRem('cache:access:frequency', leastAccessedKeys);
      }
      
      logger.info(`Evicted ${leastAccessedKeys.length} least used items from cache`);
    } catch (error) {
      logger.error('Error evicting least used cache items:', error);
    }
  }

  /**
   * Get current cache metrics
   */
  public getCacheMetrics() {
    return { ...this.metrics };
  }
}

export default CacheManager.getInstance();
