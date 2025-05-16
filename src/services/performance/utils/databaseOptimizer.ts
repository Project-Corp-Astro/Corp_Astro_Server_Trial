// src/services/performance/utils/databaseOptimizer.ts

import { Sequelize, Model, ModelStatic, Transaction, Op } from 'sequelize';
import logger from '../../../utils/logger';
import { cacheManager } from './cacheManager';

/**
 * Database optimizer for improving database performance
 * Provides utilities for query optimization, connection pooling,
 * and transaction management
 */
export class DatabaseOptimizer {
  private static sequelize: Sequelize | null = null;
  
  /**
   * Initialize the database optimizer with a Sequelize instance
   * @param sequelizeInstance Sequelize instance
   */
  static initialize(sequelizeInstance: Sequelize): void {
    this.sequelize = sequelizeInstance;
    this.optimizeConnectionPool();
    logger.info('Database optimizer initialized');
  }
  
  /**
   * Optimize database connection pool settings
   * Note: This logs recommendations but doesn't modify the pool directly
   * as the pool configuration is read-only after initialization.
   */
  private static optimizeConnectionPool(): void {
    if (!this.sequelize) {
      logger.warn('Cannot optimize connection pool: Sequelize instance not initialized');
      return;
    }
    
    // Log recommended pool settings based on environment
    if (process.env.NODE_ENV === 'production') {
      logger.info('Recommended production pool settings:', {
        max: 25,
        min: 5,
        idle: 10000,
        acquire: 60000,
        evict: 1000
      });
    } else {
      logger.info('Recommended development pool settings:', {
        max: 10,
        min: 2,
        idle: 10000,
        acquire: 30000,
        evict: 1000
      });
    }
    
    // Log current pool settings if available
    try {
      const connectionManager = this.sequelize.connectionManager as any;
      if (connectionManager && connectionManager.pool) {
        logger.info('Current pool settings:', connectionManager.pool.options);
      }
    } catch (error) {
      logger.debug('Could not retrieve current pool settings');
    }
    
    logger.info('Note: To change pool settings, update the Sequelize configuration before initializing the connection');
  }
  
  /**
   * Execute a query with automatic retries and timeout
   * @param queryFn Query function to execute
   * @param options Options for query execution
   * @returns Query result
   */
  static async executeQuery<T>(
    queryFn: () => Promise<T>,
    options: {
      retries?: number;
      timeout?: number;
      cacheKey?: string;
      cacheTTL?: number;
    } = {}
  ): Promise<T> {
    const { 
      retries = 3, 
      timeout = 30000, 
      cacheKey = null, 
      cacheTTL = 300 
    } = options;
    
    // If cache key is provided, try to get from cache
    if (cacheKey) {
      const cachedResult = await cacheManager.get<T>(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }
    }
    
    let lastError: Error | null = null;
    
    // Try to execute the query with retries
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Create a promise that will reject after the timeout
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`Query timed out after ${timeout}ms`)), timeout);
        });
        
        // Execute the query with timeout
        const result = await Promise.race([queryFn(), timeoutPromise]) as T;
        
        // If successful and cache key is provided, cache the result
        if (cacheKey) {
          await cacheManager.set(cacheKey, result, cacheTTL);
        }
        
        return result;
      } catch (error: any) {
        lastError = error;
        
        // Log the error
        logger.warn(`Query attempt ${attempt}/${retries} failed: ${error.message}`);
        
        // If this is a connection error or timeout, retry
        const isRetryable = 
          error.name === 'SequelizeConnectionError' ||
          error.name === 'SequelizeConnectionTimedOutError' ||
          error.name === 'SequelizeTimeoutError' ||
          error.message.includes('timed out');
        
        if (!isRetryable || attempt === retries) {
          break;
        }
        
        // Wait before retrying (exponential backoff)
        const backoffTime = Math.min(100 * Math.pow(2, attempt), 2000);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
    
    // If all retries failed, throw the last error
    throw lastError || new Error('Query failed after retries');
  }
  
  /**
   * Execute a query in a transaction
   * @param queryFn Query function to execute
   * @param options Transaction options
   * @returns Query result
   */
  static async executeInTransaction<T>(
    queryFn: (transaction: Transaction) => Promise<T>,
    options: {
      isolationLevel?: Transaction.ISOLATION_LEVELS;
      timeout?: number;
    } = {}
  ): Promise<T> {
    if (!this.sequelize) {
      throw new Error('Sequelize instance not initialized');
    }
    
    const { 
      isolationLevel = Transaction.ISOLATION_LEVELS.READ_COMMITTED, 
      timeout = 30000 
    } = options;
    
    // Create a transaction
    const transaction = await this.sequelize.transaction({
      isolationLevel,
      ...timeout && { timeout }
    });
    
    try {
      // Execute the query in the transaction
      const result = await queryFn(transaction);
      
      // Commit the transaction
      await transaction.commit();
      
      return result;
    } catch (error) {
      // Rollback the transaction on error
      await transaction.rollback();
      throw error;
    }
  }
  
  /**
   * Bulk insert data with optimized performance
   * @param model Model to insert into
   * @param data Data to insert
   * @param options Bulk insert options
   * @returns Inserted records
   */
  static async bulkInsert<M extends Model>(
    model: ModelStatic<M>,
    data: any[],
    options: {
      batchSize?: number;
      transaction?: Transaction;
      ignoreDuplicates?: boolean;
    } = {}
  ): Promise<M[]> {
    const { 
      batchSize = 1000, 
      transaction = null, 
      ignoreDuplicates = false 
    } = options;
    
    // If data is empty, return empty array
    if (!data.length) {
      return [];
    }
    
    // If data is small enough, insert in one batch
    if (data.length <= batchSize) {
      return await model.bulkCreate(data, {
        transaction,
        ignoreDuplicates,
      });
    }
    
    // Otherwise, insert in batches
    const results: M[] = [];
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      const batchResults = await model.bulkCreate(batch, {
        transaction,
        ignoreDuplicates,
      });
      
      results.push(...batchResults);
      
      logger.debug(`Inserted batch ${i / batchSize + 1}/${Math.ceil(data.length / batchSize)}`);
    }
    
    return results;
  }
  
  /**
   * Execute a raw SQL query with optimized performance
   * @param sql SQL query
   * @param replacements Query replacements
   * @param options Query options
   * @returns Query result
   */
  static async executeRawQuery(
    sql: string,
    replacements: any = {},
    options: {
      type?: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
      transaction?: Transaction;
      cacheKey?: string;
      cacheTTL?: number;
    } = {}
  ): Promise<any> {
    if (!this.sequelize) {
      throw new Error('Sequelize instance not initialized');
    }
    
    const { 
      type = 'SELECT', 
      transaction = null, 
      cacheKey = null, 
      cacheTTL = 300 
    } = options;
    
    // If cache key is provided and query is SELECT, try to get from cache
    if (cacheKey && type === 'SELECT') {
      const cachedResult = await cacheManager.get(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }
    }
    
    // Execute the query
    const result = await this.sequelize.query(sql, {
      replacements,
      type: type as any, // Using type assertion to avoid TypeScript errors
      transaction,
    });
    
    // If cache key is provided and query is SELECT, cache the result
    if (cacheKey && type === 'SELECT') {
      await cacheManager.set(cacheKey, result, cacheTTL);
    }
    
    return result;
  }
  
  /**
   * Check database health
   * @returns Database health status
   */
  static async checkHealth(): Promise<{
    status: 'healthy' | 'unhealthy';
    responseTime: number;
    error?: string;
  }> {
    if (!this.sequelize) {
      return {
        status: 'unhealthy',
        responseTime: 0,
        error: 'Sequelize instance not initialized',
      };
    }
    
    const startTime = Date.now();
    
    try {
      // Execute a simple query to check database health
      await this.sequelize.query('SELECT 1');
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        responseTime,
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'unhealthy',
        responseTime,
        error: error.message,
      };
    }
  }
  
  /**
   * Get database statistics
   * @returns Database statistics
   */
  static async getStatistics(): Promise<{
    connectionPoolSize: number;
    activeConnections: number;
    idleConnections: number;
    waitingConnections: number;
  }> {
    if (!this.sequelize) {
      throw new Error('Sequelize instance not initialized');
    }
    
    // Get connection pool statistics
    // Get connection pool statistics from Sequelize
    // Using any type assertion since the pool structure might vary by Sequelize version
    const connectionManager = this.sequelize.connectionManager as any;
    const pool = connectionManager.pool;
    
    return {
      connectionPoolSize: pool?.size || 0,
      activeConnections: pool ? (pool.size - pool.available) : 0,
      idleConnections: pool?.available || 0,
      waitingConnections: pool?.pending || 0,
    };
  }
}

export default DatabaseOptimizer;
