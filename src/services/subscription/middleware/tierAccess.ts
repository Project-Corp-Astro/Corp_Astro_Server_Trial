// src/services/subscription/middleware/tierAccess.ts

import { Request, Response, NextFunction } from 'express';
import UserSubscription from '../models/UserSubscription ';
import SubscriptionPlan from '../models/subscription';
import { SubscriptionTierType, TierFeatures } from '../constants/tiers';
import logger from '../../../utils/logger';

/**
 * Interface for extending Express Request
 */
declare global {
  namespace Express {
    interface Request {
      userTier?: SubscriptionTierType;
      tierFeatures?: typeof TierFeatures[keyof typeof TierFeatures];
    }
  }
}

/**
 * Middleware to check user's subscription tier
 * Adds userTier and tierFeatures to the request object
 */
export const checkUserTier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.user_id;
    
    if (!userId) {
      req.userTier = SubscriptionTierType.FREE;
      req.tierFeatures = TierFeatures[SubscriptionTierType.FREE];
      return next();
    }

    // Find active subscription for the user
    const subscription = await UserSubscription.findOne({
      where: {
        user_id: userId,
        status: 'ACTIVE',
      },
      include: [
        {
          model: SubscriptionPlan,
          as: 'plan',
          attributes: ['tier_type'],
        },
      ],
    });

    // Set tier type and features based on subscription
    if (subscription && subscription.get('plan')) {
      const plan = subscription.get('plan') as SubscriptionPlan;
      req.userTier = plan.tier_type;
      req.tierFeatures = TierFeatures[plan.tier_type];
    } else {
      // Default to free tier if no active subscription
      req.userTier = SubscriptionTierType.FREE;
      req.tierFeatures = TierFeatures[SubscriptionTierType.FREE];
    }

    next();
  } catch (error) {
    logger.error('Error checking user tier:', error);
    // Default to free tier on error
    req.userTier = SubscriptionTierType.FREE;
    req.tierFeatures = TierFeatures[SubscriptionTierType.FREE];
    next();
  }
};

/**
 * Middleware to require minimum subscription tier
 * @param requiredTier Minimum tier required to access the route
 */
export const requireTier = (requiredTier: SubscriptionTierType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // First ensure tier is checked
    if (!req.userTier) {
      checkUserTier(req, res, () => checkTierAccess(req, res, next, requiredTier));
    } else {
      checkTierAccess(req, res, next, requiredTier);
    }
  };
};

/**
 * Helper function to check if user has required tier access
 */
const checkTierAccess = (req: Request, res: Response, next: NextFunction, requiredTier: SubscriptionTierType): void => {
  const tierOrder = {
    [SubscriptionTierType.FREE]: 0,
    [SubscriptionTierType.SUBSCRIPTION]: 1,
    [SubscriptionTierType.PREMIUM]: 2,
  };

  const userTierLevel = tierOrder[req.userTier || SubscriptionTierType.FREE];
  const requiredTierLevel = tierOrder[requiredTier];

  if (userTierLevel >= requiredTierLevel) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: `This feature requires a ${requiredTier} subscription`,
      currentTier: req.userTier,
      requiredTier: requiredTier,
    });
  }
};

/**
 * Middleware to check if user has access to a specific feature
 * @param featureName Name of the feature to check access for
 */
export const checkFeatureAccess = (featureName: keyof typeof TierFeatures[SubscriptionTierType.PREMIUM]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // First ensure tier is checked
    if (!req.userTier || !req.tierFeatures) {
      checkUserTier(req, res, () => checkFeaturePermission(req, res, next, featureName));
    } else {
      checkFeaturePermission(req, res, next, featureName);
    }
  };
};

/**
 * Helper function to check if user has access to a specific feature
 */
const checkFeaturePermission = (
  req: Request, 
  res: Response, 
  next: NextFunction, 
  featureName: keyof typeof TierFeatures[SubscriptionTierType.PREMIUM]
): void => {
  if (req.tierFeatures && req.tierFeatures[featureName]) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: `Your current subscription does not include access to ${featureName}`,
      currentTier: req.userTier,
      requiredFeature: featureName,
    });
  }
};
