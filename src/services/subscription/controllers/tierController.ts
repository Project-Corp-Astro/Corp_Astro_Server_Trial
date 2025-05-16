// src/services/subscription/controllers/tierController.ts

import { Request, Response } from 'express';
import tierService from '../services/tierService';
import { SubscriptionTierType } from '../constants/tiers';
import logger from '../../../utils/logger';

/**
 * Get all available subscription tiers with details
 */
export const getAllTiers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tiers = await tierService.getAllTiers();
    res.status(200).json({
      success: true,
      data: tiers,
    });
  } catch (error: any) {
    logger.error('Error getting all tiers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription tiers',
      error: error.message,
    });
  }
};

/**
 * Get details for a specific subscription tier
 */
export const getTierDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tierType } = req.params;
    
    // Validate tier type
    if (!Object.values(SubscriptionTierType).includes(tierType as SubscriptionTierType)) {
      res.status(400).json({
        success: false,
        message: 'Invalid tier type',
        validTiers: Object.values(SubscriptionTierType),
      });
      return;
    }
    
    const tierDetails = await tierService.getTierDetails(tierType as SubscriptionTierType);
    res.status(200).json({
      success: true,
      data: tierDetails,
    });
  } catch (error: any) {
    logger.error('Error getting tier details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tier details',
      error: error.message,
    });
  }
};

/**
 * Get the current user's subscription tier
 */
export const getCurrentUserTier = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.user_id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }
    
    const userTier = await tierService.getUserTier(userId);
    const tierFeatures = tierService.getTierFeatures(userTier);
    
    res.status(200).json({
      success: true,
      data: {
        tier: userTier,
        features: tierFeatures,
      },
    });
  } catch (error: any) {
    logger.error('Error getting user tier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user tier',
      error: error.message,
    });
  }
};

/**
 * Check if the current user has access to a specific feature
 */
export const checkFeatureAccess = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.user_id;
    const { featureName } = req.params;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }
    
    // Get premium tier features to validate feature name
    const premiumFeatures = tierService.getTierFeatures(SubscriptionTierType.PREMIUM);
    
    if (!Object.keys(premiumFeatures).includes(featureName)) {
      res.status(400).json({
        success: false,
        message: 'Invalid feature name',
        validFeatures: Object.keys(premiumFeatures),
      });
      return;
    }
    
    const hasAccess = await tierService.hasFeatureAccess(userId, featureName as any);
    
    res.status(200).json({
      success: true,
      data: {
        feature: featureName,
        hasAccess,
      },
    });
  } catch (error: any) {
    logger.error('Error checking feature access:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check feature access',
      error: error.message,
    });
  }
};

/**
 * Compare all subscription tiers side by side
 */
export const compareTiers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tiers = await tierService.getAllTiers();
    
    // Format the response for easier comparison
    const comparison = {
      tiers: tiers.map(tier => ({
        name: tier.tier,
        pricing: tier.plan ? {
          monthly: tier.plan.monthly_price,
          quarterly: tier.plan.quarterly_price,
          biannual: tier.plan.biannual_price,
          annual: tier.plan.annual_price,
        } : null,
        features: tier.features,
      })),
    };
    
    res.status(200).json({
      success: true,
      data: comparison,
    });
  } catch (error: any) {
    logger.error('Error comparing tiers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compare subscription tiers',
      error: error.message,
    });
  }
};
