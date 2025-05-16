// src/services/performance/utils/queryOptimizer.ts

import { Model, FindOptions, Sequelize, Op } from 'sequelize';
import logger from '../../../utils/logger';
import { cacheManager } from './cacheManager';

/**
 * Query optimizer for Sequelize ORM
 * Provides optimized query methods with built-in caching and performance tracking
 */
export class QueryOptimizer {
  /**
   * Find records with optimized query and caching
   * @param model Sequelize model
   * @param options Find options
   * @param cacheKey Cache key (if null, caching is disabled)
   * @param cacheTTL Cache TTL in seconds
   * @returns Found records
   */
  static async findAll<T extends Model>(
    model: any,
    options: FindOptions,
    cacheKey: string | null = null,
    cacheTTL: number = 300
  ): Promise<T[]> {
    const startTime = Date.now();
    const modelName = model.name;
    
    try {
      // Use cache if cache key is provided
      if (cacheKey) {
        return await cacheManager.getOrSet<T[]>(
          cacheKey,
          async () => {
            logger.debug(`Cache miss for ${modelName}.findAll, executing query`);
            return await model.findAll(options);
          },
          cacheTTL
        );
      }
      
      // Execute query without caching
      return await model.findAll(options);
    } catch (error) {
      logger.error(`Error in optimized findAll for ${modelName}: ${error}`);
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      if (duration > 500) {
        logger.warn(`Slow query detected: ${modelName}.findAll took ${duration}ms`);
        this.analyzeQuery(model, options);
      } else {
        logger.debug(`Query ${modelName}.findAll took ${duration}ms`);
      }
    }
  }
  
  /**
   * Find one record with optimized query and caching
   * @param model Sequelize model
   * @param options Find options
   * @param cacheKey Cache key (if null, caching is disabled)
   * @param cacheTTL Cache TTL in seconds
   * @returns Found record or null
   */
  static async findOne<T extends Model>(
    model: any,
    options: FindOptions,
    cacheKey: string | null = null,
    cacheTTL: number = 300
  ): Promise<T | null> {
    const startTime = Date.now();
    const modelName = model.name;
    
    try {
      // Use cache if cache key is provided
      if (cacheKey) {
        return await cacheManager.getOrSet<T | null>(
          cacheKey,
          async () => {
            logger.debug(`Cache miss for ${modelName}.findOne, executing query`);
            return await model.findOne(options);
          },
          cacheTTL
        );
      }
      
      // Execute query without caching
      return await model.findOne(options);
    } catch (error) {
      logger.error(`Error in optimized findOne for ${modelName}: ${error}`);
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      if (duration > 200) {
        logger.warn(`Slow query detected: ${modelName}.findOne took ${duration}ms`);
        this.analyzeQuery(model, options);
      } else {
        logger.debug(`Query ${modelName}.findOne took ${duration}ms`);
      }
    }
  }
  
  /**
   * Find records by primary key with optimized query and caching
   * @param model Sequelize model
   * @param id Primary key value
   * @param options Find options
   * @param cacheKey Cache key (if null, caching is disabled)
   * @param cacheTTL Cache TTL in seconds
   * @returns Found record or null
   */
  static async findByPk<T extends Model>(
    model: any,
    id: string | number,
    options: FindOptions = {},
    cacheKey: string | null = null,
    cacheTTL: number = 300
  ): Promise<T | null> {
    const startTime = Date.now();
    const modelName = model.name;
    
    try {
      // Use cache if cache key is provided
      if (cacheKey) {
        return await cacheManager.getOrSet<T | null>(
          cacheKey,
          async () => {
            logger.debug(`Cache miss for ${modelName}.findByPk, executing query`);
            return await model.findByPk(id, options);
          },
          cacheTTL
        );
      }
      
      // Execute query without caching
      return await model.findByPk(id, options);
    } catch (error) {
      logger.error(`Error in optimized findByPk for ${modelName}: ${error}`);
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      if (duration > 100) {
        logger.warn(`Slow query detected: ${modelName}.findByPk took ${duration}ms`);
        this.analyzeQuery(model, { ...options, where: { id } });
      } else {
        logger.debug(`Query ${modelName}.findByPk took ${duration}ms`);
      }
    }
  }
  
  /**
   * Count records with optimized query and caching
   * @param model Sequelize model
   * @param options Find options
   * @param cacheKey Cache key (if null, caching is disabled)
   * @param cacheTTL Cache TTL in seconds
   * @returns Count of records
   */
  static async count(
    model: any,
    options: FindOptions = {},
    cacheKey: string | null = null,
    cacheTTL: number = 300
  ): Promise<number> {
    const startTime = Date.now();
    const modelName = model.name;
    
    try {
      // Use cache if cache key is provided
      if (cacheKey) {
        return await cacheManager.getOrSet<number>(
          cacheKey,
          async () => {
            logger.debug(`Cache miss for ${modelName}.count, executing query`);
            return await model.count(options);
          },
          cacheTTL
        );
      }
      
      // Execute query without caching
      return await model.count(options);
    } catch (error) {
      logger.error(`Error in optimized count for ${modelName}: ${error}`);
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      if (duration > 200) {
        logger.warn(`Slow query detected: ${modelName}.count took ${duration}ms`);
        this.analyzeQuery(model, options);
      } else {
        logger.debug(`Query ${modelName}.count took ${duration}ms`);
      }
    }
  }
  
  /**
   * Analyze query for potential optimizations
   * @param model Sequelize model
   * @param options Find options
   */
  private static analyzeQuery(model: any, options: FindOptions): void {
    const modelName = model.name;
    const warnings: string[] = [];
    
    // Check if query has a where clause
    if (!options.where) {
      warnings.push('Query has no WHERE clause, which may result in a full table scan');
    }
    
    // Check if query has a limit
    if (!options.limit && !options.where) {
      warnings.push('Query has no LIMIT clause, which may return too many rows');
    }
    
    // Check if query includes too many associations
    if (options.include && Array.isArray(options.include) && options.include.length > 3) {
      warnings.push(`Query includes ${options.include.length} associations, which may cause performance issues`);
    }
    
    // Check for potential N+1 query issues
    if (options.include && Array.isArray(options.include)) {
      const includesWithoutLimit = options.include.filter((include: any) => 
        include.separate && (!include.limit || include.limit > 10)
      );
      if (includesWithoutLimit.length > 0) {
        warnings.push('Query has separate includes without proper limits, which may cause N+1 query issues');
      }
    }
    
    // Check for complex where conditions
    if (options.where) {
      const whereKeys = Object.keys(options.where);
      if (whereKeys.includes(Op.or as any) || whereKeys.includes(Op.and as any)) {
        const complexCondition = whereKeys.includes(Op.or as any) ? 'OR' : 'AND';
        warnings.push(`Query uses complex ${complexCondition} conditions, which may not use indexes efficiently`);
      }
    }
    
    // Log warnings if any
    if (warnings.length > 0) {
      logger.warn(`Query optimization suggestions for ${modelName}:`);
      warnings.forEach(warning => logger.warn(`- ${warning}`));
    }
  }
  
  /**
   * Build an optimized cache key for a query
   * @param model Sequelize model
   * @param queryType Query type (findAll, findOne, findByPk, count)
   * @param options Find options
   * @returns Cache key
   */
  static buildCacheKey(model: any, queryType: string, options: any): string {
    const modelName = model.name;
    const optionsHash = JSON.stringify(options);
    return `db:${modelName}:${queryType}:${Buffer.from(optionsHash).toString('base64')}`;
  }
  
  /**
   * Invalidate cache for a model
   * @param model Sequelize model
   */
  static async invalidateModelCache(model: any): Promise<void> {
    const modelName = model.name;
    await cacheManager.deleteByPattern(`db:${modelName}:*`);
    logger.info(`Invalidated cache for model ${modelName}`);
  }
}

/**
 * Decorator for caching Sequelize model methods
 * @param ttl Cache TTL in seconds
 * @returns Method decorator
 */
export function CacheQuery(ttl: number = 300) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const className = this.constructor.name;
      const cacheKey = `method:${className}:${propertyKey}:${JSON.stringify(args)}`;
      
      return await cacheManager.getOrSet(
        cacheKey,
        async () => originalMethod.apply(this, args),
        ttl
      );
    };
    
    return descriptor;
  };
}
