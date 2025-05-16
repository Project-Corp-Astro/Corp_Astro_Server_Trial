// src/utils/redisHelper.ts

import { redisClient } from '../config/redis.config';
import logger from './logger';

/**
 * Set a value in Redis cache with expiration
 * @param key Cache key
 * @param value Value to cache (will be JSON stringified)
 * @param expirationSeconds Expiration time in seconds
 */
export const setCacheWithExpiry = async (
  key: string,
  value: any,
  expirationSeconds: number
): Promise<void> => {
  try {
    await redisClient.set(key, JSON.stringify(value), { EX: expirationSeconds });
  } catch (error) {
    logger.error(`Error setting cache for key ${key}:`, error);
  }
};

/**
 * Get a value from Redis cache
 * @param key Cache key
 * @returns Parsed value or null if not found
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return JSON.parse(cachedData) as T;
    }
    return null;
  } catch (error) {
    logger.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
};

/**
 * Delete a value from Redis cache
 * @param key Cache key
 */
export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error(`Error deleting cache for key ${key}:`, error);
  }
};

export default {
  setCacheWithExpiry,
  getCache,
  deleteCache,
};
