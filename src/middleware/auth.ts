// src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to check if user is authenticated
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication error', { error });
    res.status(401).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};

/**
 * Middleware to check if user is admin
 */
// Alias for isAuthenticated to maintain compatibility with existing code
export const authenticate = isAuthenticated;

/**
 * Middleware to check if user is admin
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Not authenticated.',
      });
      return;
    }

    if (req.user.user_role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('Authorization error', { error });
    res.status(403).json({
      success: false,
      message: 'Access denied.',
    });
  }
};
