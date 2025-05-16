// src/services/performance/middleware/responseTime.ts

import express from 'express';
import responseTime from 'response-time';
import logger from '../../../utils/logger';

/**
 * Set up response time tracking middleware for the Express application
 * This helps monitor API performance and identify slow endpoints
 * 
 * @param app Express application instance
 */
export const setupResponseTime = (app: express.Application): void => {
  // Define thresholds for response time (in ms)
  const WARN_THRESHOLD = 1000; // 1 second
  const ERROR_THRESHOLD = 3000; // 3 seconds
  
  // Apply response time middleware
  app.use(responseTime((req: express.Request, res: express.Response, time: number) => {
    const path = req.originalUrl;
    const method = req.method;
    const statusCode = res.statusCode;
    
    // Log response time based on thresholds
    if (time > ERROR_THRESHOLD) {
      logger.error(`🐢 Slow response: ${method} ${path} - ${time.toFixed(2)}ms - Status: ${statusCode}`);
    } else if (time > WARN_THRESHOLD) {
      logger.warn(`⚠️ Slow response: ${method} ${path} - ${time.toFixed(2)}ms - Status: ${statusCode}`);
    } else {
      logger.debug(`Response time: ${method} ${path} - ${time.toFixed(2)}ms - Status: ${statusCode}`);
    }
    
    // Add response time header
    res.set('X-Response-Time', `${time.toFixed(2)}ms`);
    
    // Store metrics for high-level analysis
    // This could be extended to store metrics in a time-series database
    // or send to a monitoring service
    const metricKey = `metrics:response_time:${method}:${path.split('?')[0].replace(/\//g, ':')}`;
    try {
      const redisClient = req.app.get('redisClient');
      if (redisClient) {
        // Store the response time in a list for statistical analysis
        redisClient.rPush(metricKey, time.toString())
          .then(() => redisClient.lTrim(metricKey, -100, -1)) // Keep only the last 100 entries
          .catch((err: Error) => logger.error(`Error storing response time metric: ${err}`));
      }
    } catch (error) {
      // Silently fail if Redis is not available
      logger.debug(`Could not store response time metrics: ${error}`);
    }
  }));
  
  logger.info('✅ Response time monitoring middleware applied');
};
