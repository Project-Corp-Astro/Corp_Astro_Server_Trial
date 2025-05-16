// src/services/subscription/controllers/subscriptionController.ts

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import subscriptionService from '../services/subscriptionService';
import logger from '../../../utils/logger';
import { SubscriptionTiers } from '../../../config/constants';
import SubscriptionTier from '../models/SubscriptionTier';

/**
 * Controller for handling subscription-related API endpoints
 */
class SubscriptionController {
  /**
   * Get all available subscription tiers
   * @param req Express request
   * @param res Express response
   */
  async getSubscriptionTiers(req: Request, res: Response): Promise<void> {
    try {
      const tiers = await SubscriptionTier.findAll({
        where: { active: true },
        attributes: ['id', 'tier_name', 'tier_code', 'price', 'currency', 'billing_cycle', 'features'],
        order: [['price', 'ASC']],
      });
      
      res.status(200).json({
        success: true,
        data: tiers,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Error fetching subscription tiers:', errorMessage);
      res.status(500).json({
        success: false,
        message: 'Error fetching subscription tiers',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      });
    }
  }
  
  /**
   * Get a user's current subscription
   * @param req Express request
   * @param res Express response
   */
  async getUserSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }
      
      const tier = await subscriptionService.getUserSubscriptionTier(userId);
      const hasActiveSubscription = tier !== SubscriptionTiers.FREE;
      
      // Get tier details if subscription is active
      let tierDetails = null as SubscriptionTier | null;
      
      if (hasActiveSubscription) {
        tierDetails = await SubscriptionTier.findOne({
          where: { tier_code: tier, active: true },
          attributes: ['tier_name', 'tier_code', 'price', 'currency', 'billing_cycle', 'features'],
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          hasActiveSubscription,
          tier,
          tierDetails,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error fetching user subscription:`, errorMessage);
      res.status(500).json({
        success: false,
        message: 'Error fetching user subscription',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      });
    }
  }
  
  /**
   * Subscribe to a tier
   * @param req Express request
   * @param res Express response
   */
  async subscribe(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array(),
        });
        return;
      }
      
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }
      
      const { tierCode, paymentMethod, transactionId } = req.body;
      
      // Validate tier exists
      const tier = await SubscriptionTier.findOne({
        where: { tier_code: tierCode, active: true },
      });
      
      if (!tier) {
        res.status(404).json({
          success: false,
          message: 'Subscription tier not found or inactive',
        });
        return;
      }
      
      // Create or update subscription
      const subscription = await subscriptionService.createOrUpdateSubscription(
        userId,
        tierCode,
        paymentMethod,
        transactionId
      );
      
      res.status(200).json({
        success: true,
        message: 'Subscription created successfully',
        data: {
          subscription: {
            tier: tierCode,
            startDate: subscription.start_date,
            endDate: subscription.end_date,
            autoRenew: subscription.auto_renew,
          },
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error creating subscription:`, errorMessage);
      res.status(500).json({
        success: false,
        message: 'Error creating subscription',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      });
    }
  }
  
  /**
   * Cancel a subscription
   * @param req Express request
   * @param res Express response
   */
  async cancelSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }
      
      const success = await subscriptionService.cancelSubscription(userId);
      
      if (success) {
        res.status(200).json({
          success: true,
          message: 'Subscription canceled successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'No active subscription found',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error canceling subscription:`, errorMessage);
      res.status(500).json({
        success: false,
        message: 'Error canceling subscription',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      });
    }
  }
  
  /**
   * Check if a user has access to a specific content type
   * @param req Express request
   * @param res Express response
   */
  async checkContentAccess(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array(),
        });
        return;
      }
      
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }
      
      const { contentType } = req.params;
      
      const hasAccess = await subscriptionService.hasContentAccess(userId, contentType);
      
      res.status(200).json({
        success: true,
        data: {
          hasAccess,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error checking content access:`, errorMessage);
      res.status(500).json({
        success: false,
        message: 'Error checking content access',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      });
    }
  }
}

export default new SubscriptionController();
