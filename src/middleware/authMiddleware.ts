/**
 * Authentication middleware for the Corp Astro application
 * Provides JWT authentication and role-based authorization
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'corp-astro-secret-key';

// Extended Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 * Extracts and verifies the JWT from the Authorization header
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        logger.warn('JWT verification failed', { error: err.message });
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      req.user = user;
      next();
    });
  } else {
    logger.warn('No authorization header provided');
    res.status(401).json({ message: 'Authentication required' });
  }
};

/**
 * Middleware to check if the authenticated user has admin role
 * Must be used after authenticateJWT middleware
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    logger.warn('Unauthorized admin access attempt', { userId: req.user?.user_id });
    res.status(403).json({ message: 'Admin access required' });
  }
};

/**
 * Middleware to check if the authenticated user is the owner of the requested resource
 * or has admin privileges
 * @param idParam - The parameter name in the request that contains the resource owner's ID
 */
export const isOwnerOrAdmin = (idParam: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const resourceOwnerId = req.params[idParam];
    
    if (req.user.role === 'admin' || req.user.user_id === resourceOwnerId) {
      next();
    } else {
      logger.warn('Unauthorized resource access attempt', { 
        userId: req.user.user_id,
        resourceId: resourceOwnerId
      });
      res.status(403).json({ message: 'Unauthorized access' });
    }
  };
};

/**
 * Middleware to check if the user has a specific subscription level
 * @param requiredLevel - The minimum subscription level required (free, basic, premium)
 */
export const hasSubscriptionLevel = (requiredLevel: 'free' | 'subscription' | 'premium') => {
  const levelValue = { free: 0, subscription: 1, premium: 2 };
  
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userLevel = req.user.subscriptionLevel || 'free';
    
    if (levelValue[userLevel] >= levelValue[requiredLevel]) {
      next();
    } else {
      logger.warn('Insufficient subscription level', {
        userId: req.user.user_id,
        currentLevel: userLevel,
        requiredLevel
      });
      res.status(403).json({
        message: `${requiredLevel.charAt(0).toUpperCase() + requiredLevel.slice(1)} subscription required`,
        currentLevel: userLevel,
        requiredLevel
      });
    }
  };
};
