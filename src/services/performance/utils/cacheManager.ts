// src/services/performance/utils/cacheManager.ts

import { redisClient } from '../../../config/redis.config';
import logger from '../../../utils/logger';

/**
 * Enhanced cache manager that provides a centralized caching service
 * with advanced features like multi-level caching, cache invalidation,
 * and cache warming
 */
class CacheManager {
  /**
   * Get data from cache
   * @param key Cache key
   * @returns Cached data or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      if (data) {
        return JSON.parse(data) as T;
      }
      return null;
    } catch (error) {
      logger.error(`Error getting cache for key "${key}": ${error}`);
      return null;
    }
  }

  /**
   * Set data to cache with expiration
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Time to live in seconds (default: 10 minutes)
   */
  async set(key: string, data: any, ttl: number = 600): Promise<void> {
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(data));
      logger.debug(`Cache SET for key: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      logger.error(`Error setting cache for key "${key}": ${error}`);
    }
  }

  /**
   * Delete data from cache
   * @param key Cache key
   */
  async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);
      logger.debug(`Cache DELETED for key: ${key}`);
    } catch (error) {
      logger.error(`Error deleting cache for key "${key}": ${error}`);
    }
  }

  /**
   * Get data from cache or compute it if not found
   * @param key Cache key
   * @param fn Function to compute data if not in cache
   * @param ttl Time to live in seconds (default: 10 minutes)
   * @returns Cached or computed data
   */
  async getOrSet<T>(key: string, fn: () => Promise<T>, ttl: number = 600): Promise<T> {
    try {
      // Try to get from cache first
      const cachedData = await this.get<T>(key);
      if (cachedData !== null) {
        logger.debug(`Cache HIT for key: ${key}`);
        return cachedData;
      }

      // If not in cache, compute the data
      logger.debug(`Cache MISS for key: ${key}`);
      const data = await fn();
      
      // Store in cache for future requests
      await this.set(key, data, ttl);
      
      return data;
    } catch (error) {
      logger.error(`Error in getOrSet for key "${key}": ${error}`);
      // If there's an error with caching, still try to compute the data
      return fn();
    }
  }

  /**
   * Delete multiple cache keys by pattern
   * @param pattern Key pattern to match (e.g., "user:*")
   */
  async deleteByPattern(pattern: string): Promise<void> {
    try {
      // Use SCAN to find keys matching the pattern
      let cursor = 0;
      do {
        const result = await redisClient.scan(cursor, { MATCH: pattern, COUNT: 100 });
        cursor = result.cursor;
        
        // Delete the found keys
        if (result.keys.length > 0) {
          await redisClient.del(result.keys);
          logger.debug(`Deleted ${result.keys.length} keys matching pattern: ${pattern}`);
        }
      } while (cursor !== 0);
    } catch (error) {
      logger.error(`Error deleting cache by pattern "${pattern}": ${error}`);
    }
  }

  /**
   * Invalidate cache for a specific entity
   * @param entityType Entity type (e.g., "user", "content", "subscription")
   * @param entityId Entity ID
   */
  async invalidateEntity(entityType: string, entityId: string): Promise<void> {
    await this.deleteByPattern(`${entityType}:${entityId}:*`);
    logger.info(`Invalidated cache for ${entityType} with ID ${entityId}`);
  }

  /**
   * Warm up cache for frequently accessed data
   * @param key Cache key
   * @param fn Function to compute data
   * @param ttl Time to live in seconds
   */
  async warmUp<T>(key: string, fn: () => Promise<T>, ttl: number = 600): Promise<void> {
    try {
      logger.info(`Warming up cache for key: ${key}`);
      const data = await fn();
      await this.set(key, data, ttl);
    } catch (error) {
      logger.error(`Error warming up cache for key "${key}": ${error}`);
    }
  }

  /**
   * Set cache with hash fields
   * @param key Cache key
   * @param fields Hash fields to set
   * @param ttl Time to live in seconds (default: 10 minutes)
   */
  async hSet(key: string, fields: Record<string, any>, ttl: number = 600): Promise<void> {
    try {
      // Convert all values to strings
      const stringFields: Record<string, string> = {};
      for (const [field, value] of Object.entries(fields)) {
        stringFields[field] = typeof value === 'string' ? value : JSON.stringify(value);
      }
      
      // Set the hash fields
      await redisClient.hSet(key, stringFields);
      
      // Set expiration
      await redisClient.expire(key, ttl);
      
      logger.debug(`Hash SET for key: ${key} with ${Object.keys(fields).length} fields (TTL: ${ttl}s)`);
    } catch (error) {
      logger.error(`Error setting hash cache for key "${key}": ${error}`);
    }
  }

  /**
   * Get hash field from cache
   * @param key Cache key
   * @param field Hash field to get
   * @returns Cached field value or null if not found
   */
  async hGet<T>(key: string, field: string): Promise<T | null> {
    try {
      const data = await redisClient.hGet(key, field);
      if (data) {
        try {
          return JSON.parse(data) as T;
        } catch {
          // If not valid JSON, return as is
          return data as unknown as T;
        }
      }
      return null;
    } catch (error) {
      logger.error(`Error getting hash field "${field}" for key "${key}": ${error}`);
      return null;
    }
  }

  /**
   * Get all hash fields from cache
   * @param key Cache key
   * @returns All cached hash fields or empty object if not found
   */
  async hGetAll<T>(key: string): Promise<Record<string, T>> {
    try {
      const data = await redisClient.hGetAll(key);
      if (data && Object.keys(data).length > 0) {
        const result: Record<string, T> = {};
        for (const [field, value] of Object.entries(data)) {
          try {
            result[field] = JSON.parse(value) as T;
          } catch {
            // If not valid JSON, return as is
            result[field] = value as unknown as T;
          }
        }
        return result;
      }
      return {} as Record<string, T>;
    } catch (error) {
      logger.error(`Error getting all hash fields for key "${key}": ${error}`);
      return {} as Record<string, T>;
    }
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();
