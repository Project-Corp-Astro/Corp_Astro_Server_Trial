// src/middleware/roleCheck.ts

import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Middleware to check if user has admin role
 */
export const checkAdminRole = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.role !== 'admin') {
      logger.warn('Unauthorized access attempt to admin route', {
        userId: req.user.id,
        role: req.user.role,
        path: req.path
      });
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    next();
  } catch (error) {
    logger.error('Role check error', { error });
    return res.status(500).json({
      success: false,
      message: 'Internal server error during role verification'
    });
  }
};

/**
 * Middleware to check if user has any of the specified roles
 */
export const checkRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!roles.includes(req.user.role)) {
        logger.warn('Unauthorized access attempt', {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRoles: roles,
          path: req.path
        });
        
        return res.status(403).json({
          success: false,
          message: `Access denied. Required roles: ${roles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      logger.error('Role check error', { error });
      return res.status(500).json({
        success: false,
        message: 'Internal server error during role verification'
      });
    }
  };
};
