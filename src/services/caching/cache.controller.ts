import { redisClient } from '../../config/redis.config';
import logger from '../../utils/logger';  // Adjust path if needed

// Get data from cache or call the DB if not available
export const getCache = async (key: string): Promise<any | null> => {
  try {
    const cache = await redisClient.get(key);
    if (cache) {
      return JSON.parse(cache);  // Parse JSON data from cache
    }
    return null; // Cache miss
  } catch (error) {
    logger.error(`Error fetching from cache for key "${key}": ${error}`);
    return null;
  }
};

// Set data to Redis with optional expiration (TTL in seconds)
export const setCache = async (key: string, data: any, ttl: number = 600): Promise<void> => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
    // Use debug level or remove this log if too noisy
    logger.debug(`[CacheService] Cache SET for key: ${key}`);
  } catch (error) {
    logger.error(`Error setting cache for key "${key}": ${error}`);
  }
};

// Delete data from Redis cache
export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
    // Use debug level or remove this log if too noisy
    logger.debug(`[CacheService] Cache DELETED for key: ${key}`);
  } catch (error) {
    logger.error(`Error deleting cache for key "${key}": ${error}`);
  }
};
