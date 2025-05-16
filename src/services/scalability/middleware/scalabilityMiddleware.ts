// src/services/scalability/middleware/scalabilityMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import compression from 'compression';
import { redisClient } from '../../../config/redis.config';
import RedisStore from 'rate-limit-redis';
import logger from '../../../utils/logger';
import { ScalabilityConfig } from '../config/scalabilityConfig';

/**
 * Rate limiter middleware using Redis for distributed rate limiting
 */
export const createRateLimiter = () => {
  return rateLimit({
    store: new RedisStore({
      // @ts-ignore - Type definitions mismatch with latest Redis client
      sendCommand: (...args: any[]) => redisClient.sendCommand(args),
      prefix: 'ratelimit:',
    }),
    windowMs: ScalabilityConfig.RATE_LIMIT_WINDOW_MS,
    max: ScalabilityConfig.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 429,
      message: 'Too many requests, please try again later.',
    },
    keyGenerator: (req: Request) => {
      // Use IP address as default
      let key = req.ip;
      
      // If authenticated, use user ID for more precise rate limiting
      if (req.user?.id) {
        key = req.user.id;
      }
      
      return `${key}:${req.method}:${req.baseUrl}`;
    },
    skip: (req: Request) => {
      // Skip rate limiting for health checks and static assets
      return req.path.startsWith('/health') || 
             req.path.startsWith('/static') ||
             req.path.startsWith('/public');
    },
  });
};

/**
 * Speed limiter middleware to gradually slow down responses for clients making too many requests
 */
export const createSpeedLimiter = () => {
  return slowDown({
    // @ts-ignore - Type definitions mismatch with latest Redis client
    store: new RedisStore({
      sendCommand: (...args: any[]) => redisClient.sendCommand(args),
      prefix: 'speedlimit:',
    }),
    windowMs: ScalabilityConfig.SPEED_LIMIT_WINDOW_MS,
    delayAfter: ScalabilityConfig.SPEED_LIMIT_DELAY_AFTER,
    delayMs: ScalabilityConfig.SPEED_LIMIT_DELAY_MS,
    maxDelayMs: ScalabilityConfig.SPEED_LIMIT_MAX_DELAY_MS,
    keyGenerator: (req: Request) => {
      // Use IP address as default
      let key = req.ip;
      
      // If authenticated, use user ID for more precise speed limiting
      if (req.user?.id) {
        key = req.user.id;
      }
      
      return `${key}:${req.method}:${req.baseUrl}`;
    },
    skip: (req: Request) => {
      // Skip speed limiting for health checks and static assets
      return req.path.startsWith('/health') || 
             req.path.startsWith('/static') ||
             req.path.startsWith('/public');
    },
  });
};

/**
 * Circuit breaker middleware to prevent cascading failures
 */
export const circuitBreaker = (req: Request, res: Response, next: NextFunction) => {
  // Check if the system is in a healthy state
  // Using type assertion for global variables
  const systemHealth = (global as any).systemHealth;
  if (systemHealth && systemHealth.status === 'critical') {
    // Only allow critical endpoints during system degradation
    if (req.path.startsWith('/health') || req.path.startsWith('/status')) {
      next();
    } else {
      logger.warn(`Circuit breaker activated for ${req.method} ${req.path}`);
      res.status(503).json({
        status: 503,
        message: 'Service temporarily unavailable. Please try again later.',
      });
    }
  } else {
    next();
  }
};

/**
 * Middleware to prioritize requests based on subscription tier
 */
export const requestPrioritization = (req: Request, res: Response, next: NextFunction) => {
  // Add X-Request-Priority header based on user's subscription tier
  if (req.user?.subscription_tier) {
    switch (req.user.subscription_tier) {
      case 'premium':
        req.headers['x-request-priority'] = 'high';
        break;
      case 'basic':
        req.headers['x-request-priority'] = 'medium';
        break;
      default:
        req.headers['x-request-priority'] = 'low';
    }
  }
  
  next();
};

/**
 * Apply all scalability middleware to an Express application
 */
export const applyScalabilityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Enable compression for all responses
  compression()(req, res, () => {
    // Apply circuit breaker
    circuitBreaker(req, res, () => {
      // Apply request prioritization
      requestPrioritization(req, res, () => {
        // Continue to next middleware
        next();
      });
    });
  });
};

/**
 * Apply route-specific rate limiting
 * @param routeType Type of route for specific rate limiting settings
 */
export const applyRouteLimits = (routeType: 'standard' | 'api' | 'content' | 'auth') => {
  const rateLimiter = createRateLimiter();
  const speedLimiter = createSpeedLimiter();
  
  return [rateLimiter, speedLimiter];
};
