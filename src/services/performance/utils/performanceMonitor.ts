// src/services/performance/utils/performanceMonitor.ts

import { EventEmitter } from 'events';
import { redisClient } from '../../../config/redis.config';
import logger from '../../../utils/logger';
import os from 'os';
import { memoryManager } from './memoryManager';

/**
 * Performance metrics types
 */
export enum MetricType {
  RESPONSE_TIME = 'response_time',
  CPU_USAGE = 'cpu_usage',
  MEMORY_USAGE = 'memory_usage',
  DATABASE_QUERY = 'database_query',
  CACHE_HIT_RATE = 'cache_hit_rate',
  API_CALLS = 'api_calls',
  ERROR_RATE = 'error_rate',
  CONTENT_GENERATION = 'content_generation',
}

/**
 * Performance metric data
 */
export interface MetricData {
  type: MetricType;
  value: number;
  timestamp: number;
  tags: Record<string, string>;
}

/**
 * Performance monitor for tracking application performance metrics
 */
export class PerformanceMonitor extends EventEmitter {
  private static instance: PerformanceMonitor;
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private metricsBuffer: MetricData[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly bufferSize: number = 100;
  private readonly flushIntervalMs: number = 10000; // 10 seconds
  private readonly monitoringIntervalMs: number = 60000; // 1 minute
  
  /**
   * Get singleton instance
   */
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    super();
    this.setupFlushInterval();
  }
  
  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) {
      return;
    }
    
    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => this.collectSystemMetrics(), this.monitoringIntervalMs);
    logger.info('Performance monitoring started');
  }
  
  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring || !this.monitoringInterval) {
      return;
    }
    
    clearInterval(this.monitoringInterval);
    this.isMonitoring = false;
    this.monitoringInterval = null;
    logger.info('Performance monitoring stopped');
  }
  
  /**
   * Set up interval for flushing metrics buffer
   */
  private setupFlushInterval(): void {
    this.flushInterval = setInterval(() => this.flushMetrics(), this.flushIntervalMs);
  }
  
  /**
   * Collect system metrics
   */
  private async collectSystemMetrics(): Promise<void> {
    try {
      // Collect CPU usage
      const cpuUsage = await this.getCpuUsage();
      this.recordMetric({
        type: MetricType.CPU_USAGE,
        value: cpuUsage,
        timestamp: Date.now(),
        tags: { host: os.hostname() }
      });
      
      // Collect memory usage
      const memoryStats = memoryManager.getMemoryStats();
      const memoryUsage = (memoryStats.heapUsed / memoryStats.heapTotal) * 100;
      this.recordMetric({
        type: MetricType.MEMORY_USAGE,
        value: memoryUsage,
        timestamp: Date.now(),
        tags: { host: os.hostname() }
      });
      
      // Collect cache hit rate
      const cacheHitRate = await this.getCacheHitRate();
      this.recordMetric({
        type: MetricType.CACHE_HIT_RATE,
        value: cacheHitRate,
        timestamp: Date.now(),
        tags: { host: os.hostname() }
      });
      
      // Collect error rate
      const errorRate = await this.getErrorRate();
      this.recordMetric({
        type: MetricType.ERROR_RATE,
        value: errorRate,
        timestamp: Date.now(),
        tags: { host: os.hostname() }
      });
      
      // Emit system metrics event
      this.emit('system-metrics', {
        cpuUsage,
        memoryUsage,
        cacheHitRate,
        errorRate,
        timestamp: Date.now()
      });
    } catch (error) {
      logger.error(`Error collecting system metrics: ${error}`);
    }
  }
  
  /**
   * Get CPU usage
   * @returns CPU usage percentage
   */
  private async getCpuUsage(): Promise<number> {
    return new Promise((resolve) => {
      const startUsage = process.cpuUsage();
      
      // Measure CPU usage over 100ms
      setTimeout(() => {
        const endUsage = process.cpuUsage(startUsage);
        const userCpuUsage = endUsage.user / 1000; // microseconds to milliseconds
        const systemCpuUsage = endUsage.system / 1000; // microseconds to milliseconds
        const totalCpuUsage = userCpuUsage + systemCpuUsage;
        
        // Convert to percentage (based on 100ms measurement)
        const cpuUsagePercent = (totalCpuUsage / 100) * 100;
        resolve(Math.min(cpuUsagePercent, 100)); // Cap at 100%
      }, 100);
    });
  }
  
  /**
   * Get cache hit rate
   * @returns Cache hit rate percentage
   */
  private async getCacheHitRate(): Promise<number> {
    try {
      const cacheHits = await redisClient.get('metrics:cache:hits') || '0';
      const cacheMisses = await redisClient.get('metrics:cache:misses') || '0';
      
      const hits = parseInt(cacheHits, 10);
      const misses = parseInt(cacheMisses, 10);
      
      if (hits + misses === 0) {
        return 0;
      }
      
      return (hits / (hits + misses)) * 100;
    } catch (error) {
      logger.error(`Error getting cache hit rate: ${error}`);
      return 0;
    }
  }
  
  /**
   * Get error rate
   * @returns Error rate percentage
   */
  private async getErrorRate(): Promise<number> {
    try {
      const totalRequests = await redisClient.get('metrics:requests:total') || '0';
      const errorRequests = await redisClient.get('metrics:requests:error') || '0';
      
      const total = parseInt(totalRequests, 10);
      const errors = parseInt(errorRequests, 10);
      
      if (total === 0) {
        return 0;
      }
      
      return (errors / total) * 100;
    } catch (error) {
      logger.error(`Error getting error rate: ${error}`);
      return 0;
    }
  }
  
  /**
   * Record a performance metric
   * @param metric Metric data
   */
  recordMetric(metric: MetricData): void {
    // Add metric to buffer
    this.metricsBuffer.push(metric);
    
    // If buffer is full, flush immediately
    if (this.metricsBuffer.length >= this.bufferSize) {
      this.flushMetrics();
    }
    
    // Emit metric event
    this.emit('metric', metric);
  }
  
  /**
   * Record response time metric
   * @param path Request path
   * @param method HTTP method
   * @param statusCode HTTP status code
   * @param responseTime Response time in milliseconds
   */
  recordResponseTime(path: string, method: string, statusCode: number, responseTime: number): void {
    this.recordMetric({
      type: MetricType.RESPONSE_TIME,
      value: responseTime,
      timestamp: Date.now(),
      tags: {
        path,
        method,
        statusCode: statusCode.toString(),
        host: os.hostname()
      }
    });
    
    // Increment total requests counter
    this.incrementCounter('metrics:requests:total');
    
    // Increment error requests counter if status code >= 500
    if (statusCode >= 500) {
      this.incrementCounter('metrics:requests:error');
    }
  }
  
  /**
   * Record database query metric
   * @param queryType Query type
   * @param model Model name
   * @param duration Query duration in milliseconds
   */
  recordDatabaseQuery(queryType: string, model: string, duration: number): void {
    this.recordMetric({
      type: MetricType.DATABASE_QUERY,
      value: duration,
      timestamp: Date.now(),
      tags: {
        queryType,
        model,
        host: os.hostname()
      }
    });
  }
  
  /**
   * Record content generation metric
   * @param contentType Content type
   * @param duration Generation duration in milliseconds
   * @param fromCache Whether content was from cache
   */
  recordContentGeneration(contentType: string, duration: number, fromCache: boolean): void {
    this.recordMetric({
      type: MetricType.CONTENT_GENERATION,
      value: duration,
      timestamp: Date.now(),
      tags: {
        contentType,
        fromCache: fromCache.toString(),
        host: os.hostname()
      }
    });
    
    // Update cache hit/miss counters
    if (fromCache) {
      this.incrementCounter('metrics:cache:hits');
    } else {
      this.incrementCounter('metrics:cache:misses');
    }
  }
  
  /**
   * Increment a counter in Redis
   * @param key Counter key
   */
  private async incrementCounter(key: string): Promise<void> {
    try {
      await redisClient.incr(key);
    } catch (error) {
      logger.error(`Error incrementing counter ${key}: ${error}`);
    }
  }
  
  /**
   * Flush metrics buffer to persistent storage
   */
  private async flushMetrics(): Promise<void> {
    if (this.metricsBuffer.length === 0) {
      return;
    }
    
    try {
      const metrics = [...this.metricsBuffer];
      this.metricsBuffer = [];
      
      // Store metrics in Redis
      for (const metric of metrics) {
        const key = `metrics:${metric.type}:${Date.now()}`;
        await redisClient.setEx(key, 86400, JSON.stringify(metric)); // Store for 1 day
        
        // Add to time series for aggregation
        const timeSeriesKey = `timeseries:${metric.type}:${Object.values(metric.tags).join(':')}`;
        await redisClient.zAdd(timeSeriesKey, [{ score: metric.timestamp, value: metric.value.toString() }]);
        
        // Set expiration for time series
        await redisClient.expire(timeSeriesKey, 604800); // 7 days
      }
      
      logger.debug(`Flushed ${metrics.length} metrics to storage`);
    } catch (error) {
      logger.error(`Error flushing metrics: ${error}`);
      
      // Put metrics back in buffer
      this.metricsBuffer = [...this.metricsBuffer, ...this.metricsBuffer];
      
      // Cap buffer size to avoid memory issues
      if (this.metricsBuffer.length > this.bufferSize * 2) {
        this.metricsBuffer = this.metricsBuffer.slice(-this.bufferSize);
        logger.warn(`Metrics buffer overflow, discarded oldest metrics`);
      }
    }
  }
  
  /**
   * Get metrics for a specific type and time range
   * @param type Metric type
   * @param startTime Start timestamp
   * @param endTime End timestamp
   * @param tags Tags to filter by
   * @returns Metrics data
   */
  async getMetrics(
    type: MetricType,
    startTime: number,
    endTime: number,
    tags: Record<string, string> = {}
  ): Promise<MetricData[]> {
    try {
      // Build tag string for key matching
      const tagString = Object.values(tags).length > 0 
        ? `:${Object.values(tags).join(':')}` 
        : '*';
      
      // Get matching time series keys
      const timeSeriesKey = `timeseries:${type}${tagString}`;
      const keys = await redisClient.keys(timeSeriesKey);
      
      const results: MetricData[] = [];
      
      // Get data for each key
      for (const key of keys) {
        const data = await redisClient.zRangeByScore(key, startTime, endTime);
        
        // Parse tags from key
        const keyParts = key.split(':');
        const parsedTags: Record<string, string> = {};
        
        // Skip type and 'timeseries' parts
        for (let i = 2; i < keyParts.length; i++) {
          parsedTags[`tag${i-2}`] = keyParts[i];
        }
        
        // Add data to results
        for (const item of data) {
          const [timestamp, value] = item.split(':');
          
          results.push({
            type,
            value: parseFloat(value),
            timestamp: parseInt(timestamp, 10),
            tags: parsedTags
          });
        }
      }
      
      return results.sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      logger.error(`Error getting metrics: ${error}`);
      return [];
    }
  }
  
  /**
   * Get aggregated metrics
   * @param type Metric type
   * @param startTime Start timestamp
   * @param endTime End timestamp
   * @param aggregation Aggregation function
   * @param interval Interval in milliseconds
   * @returns Aggregated metrics
   */
  async getAggregatedMetrics(
    type: MetricType,
    startTime: number,
    endTime: number,
    aggregation: 'avg' | 'min' | 'max' | 'sum' | 'count' = 'avg',
    interval: number = 60000 // 1 minute
  ): Promise<Array<{ timestamp: number; value: number }>> {
    try {
      // Get raw metrics
      const metrics = await this.getMetrics(type, startTime, endTime);
      
      // Group metrics by interval
      const groupedMetrics: Record<number, number[]> = {};
      
      for (const metric of metrics) {
        // Calculate interval timestamp
        const intervalTimestamp = Math.floor(metric.timestamp / interval) * interval;
        
        if (!groupedMetrics[intervalTimestamp]) {
          groupedMetrics[intervalTimestamp] = [];
        }
        
        groupedMetrics[intervalTimestamp].push(metric.value);
      }
      
      // Aggregate metrics
      const result: Array<{ timestamp: number; value: number }> = [];
      
      for (const [timestamp, values] of Object.entries(groupedMetrics)) {
        let aggregatedValue: number;
        
        switch (aggregation) {
          case 'min':
            aggregatedValue = Math.min(...values);
            break;
          case 'max':
            aggregatedValue = Math.max(...values);
            break;
          case 'sum':
            aggregatedValue = values.reduce((sum, value) => sum + value, 0);
            break;
          case 'count':
            aggregatedValue = values.length;
            break;
          case 'avg':
          default:
            aggregatedValue = values.reduce((sum, value) => sum + value, 0) / values.length;
            break;
        }
        
        result.push({
          timestamp: parseInt(timestamp, 10),
          value: aggregatedValue
        });
      }
      
      return result.sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      logger.error(`Error getting aggregated metrics: ${error}`);
      return [];
    }
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();
