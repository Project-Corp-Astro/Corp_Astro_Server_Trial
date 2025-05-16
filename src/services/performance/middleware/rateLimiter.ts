// src/services/performance/middleware/rateLimiter.ts

import express from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../../../config/redis.config';
import logger from '../../../utils/logger';

/**
 * Apply rate limiting middleware to the Express application
 * This helps prevent abuse and DoS attacks by limiting the number of requests
 * a client can make in a given time period
 * 
 * @param app Express application instance
 */
/**
 * Create a rate limiter middleware for a specific endpoint
 * @param endpoint Endpoint name for tracking
 * @param limit Maximum number of requests per minute
 * @returns Rate limiter middleware
 */
export const rateLimiter = (endpoint: string, limit: number = 100) => {
  return rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: limit, // limit each IP to specified number of requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: `Too many requests to ${endpoint}, please try again later.`,
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      prefix: `ratelimit:${endpoint}:`
    }),
    handler: (req, res, next, options) => {
      logger.warn(`Rate limit exceeded for endpoint ${endpoint} from IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: options.message,
      });
    },
  });
};

/**
 * Apply rate limiting middleware to the Express application
 * This helps prevent abuse and DoS attacks by limiting the number of requests
 * a client can make in a given time period
 * 
 * @param app Express application instance
 */
export const applyRateLimiting = (app: express.Application): void => {
  // Define different rate limits for different types of routes
  
  // Standard API rate limit (100 requests per minute)
  const standardLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests, please try again later.',
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
    handler: (req, res, next, options) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: options.message,
      });
    },
  });
  
  // Higher limit for content generation endpoints (30 requests per minute)
  const contentLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many content generation requests, please try again later.',
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
    handler: (req, res, next, options) => {
      logger.warn(`Content rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: options.message,
      });
    },
  });
  
  // Authentication rate limit (5 requests per minute)
  const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many authentication attempts, please try again later.',
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
    handler: (req, res, next, options) => {
      logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: options.message,
      });
    },
  });
  
  // Apply rate limiters to specific routes
  app.use('/api/usermanagement/login', authLimiter);
  app.use('/api/usermanagement/register', authLimiter);
  app.use('/api/content/horoscope', contentLimiter);
  app.use('/api/content/report', contentLimiter);
  app.use('/api/content/business', contentLimiter);
  
  // Apply standard limiter to all other routes
  app.use('/api', standardLimiter);
  
  logger.info('✅ Rate limiting middleware applied');
};
