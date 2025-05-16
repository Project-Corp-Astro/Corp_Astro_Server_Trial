// src/services/performance/index.ts

import express from 'express';
import { applyRateLimiting } from './middleware/rateLimiter';
import { setupCompression } from './middleware/compression';
import { setupCaching } from './middleware/caching';
import { setupResponseTime } from './middleware/responseTime';
import { setupHttpOptimizations } from './middleware/httpOptimizations';

/**
 * Apply performance optimizations to the Express application
 * @param app Express application instance
 */
export const applyPerformanceOptimizations = (app: express.Application): void => {
  // Apply rate limiting to prevent abuse
  applyRateLimiting(app);
  
  // Apply response compression
  setupCompression(app);
  
  // Apply caching headers and middleware
  setupCaching(app);
  
  // Add response time tracking for monitoring
  setupResponseTime(app);
  
  // Apply HTTP optimizations (keepalive, etc.)
  setupHttpOptimizations(app);
};

export * from './utils/cacheManager';
export * from './utils/queryOptimizer';
export * from './utils/memoryManager';
export * from './utils/asyncHandler';
