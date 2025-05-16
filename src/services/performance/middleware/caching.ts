// src/services/performance/middleware/caching.ts

import express from 'express';
import { redisClient } from '../../../config/redis.config';
import logger from '../../../utils/logger';

/**
 * Set up HTTP caching middleware for the Express application
 * This improves performance by setting appropriate cache headers
 * and implementing Redis-based response caching for specific routes
 * 
 * @param app Express application instance
 */
export const setupCaching = (app: express.Application): void => {
  // Set cache-control headers middleware
  const setCacheHeaders = (duration: number) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      // Skip caching for authenticated requests or POST/PUT/DELETE methods
      if (req.method !== 'GET' || req.headers.authorization) {
        res.set('Cache-Control', 'no-store');
        return next();
      }
      
      // Set cache headers
      res.set('Cache-Control', `public, max-age=${duration}`);
      next();
    };
  };
  
  // Redis-based response caching middleware
  const cacheResponse = (duration: number) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      // Skip caching for authenticated requests or non-GET methods
      if (req.method !== 'GET' || req.headers.authorization) {
        return next();
      }
      
      // Create a cache key based on the URL and query parameters
      const cacheKey = `cache:${req.originalUrl}`;
      
      try {
        // Try to get cached response
        const cachedResponse = await redisClient.get(cacheKey);
        
        if (cachedResponse) {
          // Parse the cached response
          const { statusCode, contentType, body } = JSON.parse(cachedResponse);
          
          // Send the cached response
          res.status(statusCode).contentType(contentType).send(body);
          return;
        }
        
        // If no cached response, capture the response
        const originalSend = res.send;
        
        // Override the send method to cache the response before sending
        res.send = function(body: any): express.Response {
          // Only cache successful responses
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const responseToCache = {
              statusCode: res.statusCode,
              contentType: res.get('Content-Type'),
              body,
            };
            
            // Store in Redis with expiration
            redisClient.setEx(cacheKey, duration, JSON.stringify(responseToCache))
              .catch(err => logger.error(`Error caching response: ${err}`));
          }
          
          // Call the original send method
          return originalSend.call(this, body);
        };
        
        next();
      } catch (error) {
        logger.error(`Caching middleware error: ${error}`);
        next();
      }
    };
  };
  
  // Apply caching to specific routes
  
  // Static content (1 day cache)
  app.use('/api/content/templates', setCacheHeaders(86400));
  
  // Subscription plans (1 hour cache)
  app.use('/api/subscription/tiers/all', setCacheHeaders(3600));
  app.use('/api/subscription/tiers/details', setCacheHeaders(3600));
  app.use('/api/subscription/tiers/compare', setCacheHeaders(3600));
  
  // Numerology analysis (1 day cache)
  app.use('/api/numerology', setCacheHeaders(86400));
  
  // Redis response caching for expensive operations
  app.use('/api/content/templates', cacheResponse(3600)); // 1 hour
  app.use('/api/subscription/tiers/all', cacheResponse(3600)); // 1 hour
  app.use('/api/subscription/tiers/compare', cacheResponse(3600)); // 1 hour
  app.use('/api/numerology', cacheResponse(86400)); // 1 day
  
  logger.info('✅ HTTP caching middleware applied');
};
