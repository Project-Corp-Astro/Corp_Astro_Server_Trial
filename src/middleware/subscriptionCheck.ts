// src/middleware/subscriptionCheck.ts

import { Request, Response, NextFunction } from 'express';
import subscriptionService from '../services/subscription/services/subscriptionService';
import logger from '../utils/logger';

/**
 * Middleware to check if a user has access to a specific content type based on their subscription tier
 * @param contentType Content type to check access for
 */
export const checkContentAccess = (contentType: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }
      
      const hasAccess = await subscriptionService.hasContentAccess(userId, contentType);
      
      if (hasAccess) {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: 'Subscription upgrade required to access this content',
          upgradeRequired: true,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error checking content access: ${errorMessage}`);
      
      // Allow access in case of error to prevent blocking legitimate users
      next();
    }
  };
};

export default {
  checkContentAccess,
};
