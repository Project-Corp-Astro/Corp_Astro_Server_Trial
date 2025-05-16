import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message: string;
  keyGenerator?: (req: Request) => string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

/**
 * Simple in-memory rate limiting middleware for Express
 * This is used to limit the number of requests a client can make in a given time window
 * For production, consider using a more robust solution like redis-based rate limiting
 */
export const rateLimit = (options: RateLimitOptions) => {
  const store: RateLimitStore = {};
  const windowMs = options.windowMs || 60 * 1000; // Default: 1 minute
  const max = options.max || 100; // Default: 100 requests per window
  const message = options.message || 'Too many requests, please try again later.';
  
  // Default key generator uses IP address
  const keyGenerator = options.keyGenerator || ((req: Request) => {
    return req.ip || 
      (req.headers['x-forwarded-for'] as string) || 
      req.socket.remoteAddress || 
      'unknown';
  });

  // Clean up expired entries periodically
  const cleanup = () => {
    const now = Date.now();
    Object.keys(store).forEach(key => {
      if (store[key].resetTime <= now) {
        delete store[key];
      }
    });
  };
  
  // Run cleanup every minute
  setInterval(cleanup, 60 * 1000);

  // Return middleware function
  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();
    
    // Initialize or reset if window has passed
    if (!store[key] || store[key].resetTime <= now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs
      };
      return next();
    }
    
    // Increment count
    store[key].count += 1;
    
    // Check if over limit
    if (store[key].count > max) {
      const resetTime = store[key].resetTime;
      const retryAfter = Math.ceil((resetTime - now) / 1000);
      
      // Set headers
      res.set('Retry-After', String(retryAfter));
      res.set('X-RateLimit-Limit', String(max));
      res.set('X-RateLimit-Remaining', '0');
      res.set('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)));
      
      // Log rate limit hit
      logger.warn('Rate limit exceeded', { 
        ip: key, 
        path: req.path, 
        method: req.method,
        userAgent: req.headers['user-agent']
      });
      
      // Return error response
      return res.status(429).json({
        error: message,
        retryAfter
      });
    }
    
    // Set rate limit headers
    res.set('X-RateLimit-Limit', String(max));
    res.set('X-RateLimit-Remaining', String(max - store[key].count));
    res.set('X-RateLimit-Reset', String(Math.ceil(store[key].resetTime / 1000)));
    
    next();
  };
};
