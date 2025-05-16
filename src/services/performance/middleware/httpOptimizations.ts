// src/services/performance/middleware/httpOptimizations.ts

import express from 'express';
import helmet from 'helmet';
import logger from '../../../utils/logger';

/**
 * Set up HTTP optimizations for the Express application
 * This includes security headers, connection handling, and other optimizations
 * 
 * @param app Express application instance
 */
export const setupHttpOptimizations = (app: express.Application): void => {
  // Apply Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Needed for Swagger UI
        styleSrc: ["'self'", "'unsafe-inline'"], // Needed for Swagger UI
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    // Enable HSTS with preload
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    // Prevent browsers from incorrectly detecting non-scripts as scripts
    noSniff: true,
    // Disable X-Powered-By header to hide Express
    hidePoweredBy: true,
  }));
  
  // Enable Keep-Alive connections
  app.use((req, res, next) => {
    // Set keep-alive header
    res.set('Connection', 'keep-alive');
    // Keep connections alive for 5 seconds
    res.set('Keep-Alive', 'timeout=5');
    next();
  });
  
  // Add ETag support for conditional requests
  app.set('etag', 'strong');
  
  // Enable trust proxy if behind a reverse proxy
  app.set('trust proxy', true);
  
  // Increase request body size limit for JSON payloads (10MB)
  app.use(express.json({ limit: '10mb' }));
  
  // Increase request body size limit for URL-encoded payloads (10MB)
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  logger.info('✅ HTTP optimizations applied');
};
