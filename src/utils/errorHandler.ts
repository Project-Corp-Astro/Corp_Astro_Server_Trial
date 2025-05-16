// src/utils/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import logger from './logger';
import { AppErrorOptions } from '../types/common';

/**
 * Custom application error class
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  /**
   * Create a new AppError
   * @param options Error options
   */
  constructor(options: AppErrorOptions) {
    super(options.message);
    this.statusCode = options.statusCode || 500;
    this.isOperational = options.isOperational !== undefined ? options.isOperational : true;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
    
    // If a stack was provided, use it
    if (options.stack) {
      this.stack = options.stack;
    }
  }
}

/**
 * Global error handling middleware
 * @param err Error object
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default status code and error message
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;
  
  // Check if error is an AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }
  
  // Log error
  if (isOperational) {
    logger.warn(`Operational error: ${message}`, {
      statusCode,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  } else {
    logger.error(`Unhandled error: ${err.message}`, {
      error: err,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  }
  
  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

/**
 * Async error handler wrapper
 * @param fn Async function to wrap
 * @returns Express middleware function
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not found error handler
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const err = new AppError({
    message: `Cannot find ${req.method} ${req.originalUrl} on this server`,
    statusCode: 404,
    isOperational: true,
  });
  next(err);
};

/**
 * Handle uncaught exceptions and unhandled rejections
 */
export const setupErrorHandlers = (): void => {
  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', {
      error: err.message,
      stack: err.stack,
    });
    // Exit process
    process.exit(1);
  });

  // Handle unhandled rejections
  process.on('unhandledRejection', (err: Error) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...', {
      error: err.message,
      stack: err.stack,
    });
    // Exit process
    process.exit(1);
  });
};
