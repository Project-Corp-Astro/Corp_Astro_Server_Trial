// src/services/performance/utils/asyncHandler.ts

import { Request, Response, NextFunction } from 'express';
import logger from '../../../utils/logger';

/**
 * Async handler for Express route handlers
 * Eliminates the need for try/catch blocks in each controller
 * Automatically catches errors and passes them to the error middleware
 * 
 * @param fn Express route handler function
 * @returns Wrapped route handler with error handling
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Start performance measurement
      const startTime = process.hrtime();
      
      // Execute the handler function
      const result = await fn(req, res, next);
      
      // End performance measurement
      const endTime = process.hrtime(startTime);
      const executionTime = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2);
      
      // Log execution time for slow handlers
      if (parseFloat(executionTime) > 500) {
        logger.warn(`Slow handler execution: ${req.method} ${req.originalUrl} took ${executionTime}ms`);
      }
      
      // If the handler didn't send a response, pass to next middleware
      if (!res.headersSent && result !== undefined) {
        res.json(result);
      }
    } catch (error: any) {
      // Log the error
      logger.error(`Error in route handler: ${req.method} ${req.originalUrl} - ${error.message}`);
      logger.error(error.stack);
      
      // Send appropriate error response
      if (!res.headersSent) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        
        res.status(statusCode).json({
          success: false,
          message,
          error: process.env.NODE_ENV === 'production' ? undefined : {
            stack: error.stack,
            name: error.name
          }
        });
      }
      
      // Pass to error handling middleware
      next(error);
    }
  };
};

/**
 * Custom error class with status code
 */
export class AppError extends Error {
  statusCode: number;
  
  /**
   * Create a new application error
   * @param message Error message
   * @param statusCode HTTP status code
   */
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If headers already sent, let Express handle it
  if (res.headersSent) {
    return next(err);
  }
  
  // Determine status code
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  
  // Log error
  if (statusCode >= 500) {
    logger.error(`[${statusCode}] ${err.message}`);
    logger.error(err.stack);
  } else {
    logger.warn(`[${statusCode}] ${err.message}`);
  }
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? undefined : {
      stack: err.stack,
      name: err.name
    }
  });
};
