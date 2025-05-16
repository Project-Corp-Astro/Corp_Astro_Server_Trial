// src/services/performance/middleware/compression.ts

import express from 'express';
import compression from 'compression';
import logger from '../../../utils/logger';

/**
 * Set up response compression middleware for the Express application
 * This reduces the size of the response body to improve transfer speed
 * 
 * @param app Express application instance
 */
export const setupCompression = (app: express.Application): void => {
  // Only compress responses larger than 1KB
  const shouldCompress = (req: express.Request, res: express.Response) => {
    if (req.headers['x-no-compression']) {
      // Don't compress responses with this request header
      return false;
    }
    
    // Compress based on the default compression filter
    return compression.filter(req, res);
  };
  
  // Apply compression middleware with custom options
  app.use(compression({
    // Compression level (0-9, where 9 is maximum compression)
    level: 6,
    // Only compress responses above 1KB
    threshold: 1024,
    // Use custom compression filter
    filter: shouldCompress,
    // Don't compress binary files that are already compressed
    // like images, videos, PDFs, etc.
    // This is a list of MIME types that should not be compressed
    // The default list includes common image, audio, video formats
  }));
  
  logger.info('✅ Response compression middleware applied');
};
