// src/types/redis.ts

/**
 * Redis cache item
 */
export interface CacheItem<T = any> {
  value: T;
  expiresAt?: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Redis cache operations
 */
export interface RedisCacheOperations {
  /**
   * Get a value from cache
   * @param key Cache key
   * @returns Cached value or null if not found
   */
  get<T = any>(key: string): Promise<T | null>;
  
  /**
   * Set a value in cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time to live in seconds
   * @returns Success status
   */
  set<T = any>(key: string, value: T, ttl?: number): Promise<boolean>;
  
  /**
   * Delete a value from cache
   * @param key Cache key
   * @returns Number of keys deleted
   */
  del(key: string | string[]): Promise<number>;
  
  /**
   * Check if a key exists
   * @param key Cache key
   * @returns True if key exists
   */
  exists(key: string): Promise<boolean>;
  
  /**
   * Get or set a value in cache
   * @param key Cache key
   * @param callback Function to generate value if not in cache
   * @param ttl Time to live in seconds
   * @returns Cached or generated value
   */
  getOrSet<T = any>(key: string, callback: () => Promise<T>, ttl?: number): Promise<T>;
  
  /**
   * Set expiration time for a key
   * @param key Cache key
   * @param ttl Time to live in seconds
   * @returns Success status
   */
  expire(key: string, ttl: number): Promise<boolean>;
  
  /**
   * Get multiple values from cache
   * @param keys Cache keys
   * @returns Array of cached values
   */
  mget<T = any>(keys: string[]): Promise<(T | null)[]>;
  
  /**
   * Set multiple values in cache
   * @param keyValues Object with key-value pairs
   * @param ttl Time to live in seconds
   * @returns Success status
   */
  mset(keyValues: Record<string, any>, ttl?: number): Promise<boolean>;
  
  /**
   * Increment a value in cache
   * @param key Cache key
   * @param increment Increment value
   * @returns New value
   */
  incr(key: string, increment?: number): Promise<number>;
  
  /**
   * Decrement a value in cache
   * @param key Cache key
   * @param decrement Decrement value
   * @returns New value
   */
  decr(key: string, decrement?: number): Promise<number>;
  
  /**
   * Add a value to a sorted set
   * @param key Cache key
   * @param score Score
   * @param member Member
   * @returns Number of elements added
   */
  zAdd(key: string, score: number, member: string): Promise<number>;
  
  /**
   * Get members of a sorted set with scores
   * @param key Cache key
   * @param min Minimum score
   * @param max Maximum score
   * @returns Array of members with scores
   */
  zRangeByScore(key: string, min: number, max: number): Promise<string[]>;
  
  /**
   * Remove members from a sorted set
   * @param key Cache key
   * @param members Members to remove
   * @returns Number of members removed
   */
  zRem(key: string, members: string | string[]): Promise<number>;
  
  /**
   * Disconnect from Redis
   */
  disconnect(): Promise<void>;
}
