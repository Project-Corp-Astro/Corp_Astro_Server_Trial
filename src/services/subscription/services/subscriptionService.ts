// src/services/subscription/services/subscriptionService.ts

import { Op } from 'sequelize';
import logger from '../../../utils/logger';
import UserSubscription from '../models/UserSubscription';
import SubscriptionTier from '../models/SubscriptionTier';
import { SubscriptionTiers } from '../../../config/constants';
import { getCache, setCacheWithExpiry } from '../../../utils/redisHelper';

/**
 * Service for handling subscription-related operations
 */
class SubscriptionService {
  /**
   * Check if a user has an active subscription
   * @param userId User ID to check
   * @returns Boolean indicating if the user has an active subscription
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      // Check cache first
      const cacheKey = `subscription:active:${userId}`;
      const cachedResult = await getCache<boolean>(cacheKey);
      
      if (cachedResult !== null) {
        return cachedResult;
      }
      
      // Query database
      const now = new Date();
      const subscription = await UserSubscription.findOne({
        where: {
          user_id: userId,
          end_date: { [Op.gt]: now },
          payment_status: 'completed',
        },
      });
      
      const result = !!subscription;
      
      // Cache result for 1 hour
      await setCacheWithExpiry(cacheKey, result, 3600);
      
      return result;
    } catch (error) {
      logger.error(`Error checking active subscription for user ${userId}:`, error);
      return false;
    }
  }
  
  /**
   * Get a user's current subscription tier
   * @param userId User ID to check
   * @returns Subscription tier code or 'free' if no active subscription
   */
  async getUserSubscriptionTier(userId: string): Promise<string> {
    try {
      // Check cache first
      const cacheKey = `subscription:tier:${userId}`;
      const cachedTier = await getCache<string>(cacheKey);
      
      if (cachedTier) {
        return cachedTier;
      }
      
      // Query database
      const now = new Date();
      const subscription = await UserSubscription.findOne({
        where: {
          user_id: userId,
          end_date: { [Op.gt]: now },
          payment_status: 'completed',
        },
        include: [
          {
            model: SubscriptionTier,
            as: 'subscriptionTier',
            where: { active: true },
          },
        ],
      });
      
      let tier = SubscriptionTiers.FREE;
      
      if (subscription) {
        // Get the subscription tier details
        const tierDetails = await SubscriptionTier.findByPk(subscription.subscription_tier_id);
        if (tierDetails) {
          tier = tierDetails.tier_code;
        }
      }
      
      // Cache result for 1 hour
      await setCacheWithExpiry(cacheKey, tier, 3600);
      
      return tier;
    } catch (error) {
      logger.error(`Error getting subscription tier for user ${userId}:`, error);
      return SubscriptionTiers.FREE;
    }
  }
  
  /**
   * Check if a user has access to a specific content type
   * @param userId User ID to check
   * @param contentType Type of content to check access for
   * @returns Boolean indicating if the user has access
   */
  async hasContentAccess(userId: string, contentType: string): Promise<boolean> {
    try {
      const tier = await this.getUserSubscriptionTier(userId);
      
      // Define content access by tier
      const contentAccess = {
        [SubscriptionTiers.FREE]: [
          'name_analysis',
          'tagline_analysis',
          'color_analysis',
        ],
        [SubscriptionTiers.BASIC]: [
          'name_analysis',
          'tagline_analysis',
          'color_analysis',
          'daily_horoscope',
          'monthly_report',
        ],
        [SubscriptionTiers.PREMIUM]: [
          'name_analysis',
          'tagline_analysis',
          'color_analysis',
          'daily_horoscope',
          'monthly_report',
          'business_insight',
          'compatibility_analysis',
          'astro_ratan_chat',
        ],
      };
      
      return contentAccess[tier]?.includes(contentType) || false;
    } catch (error) {
      logger.error(`Error checking content access for user ${userId} and content ${contentType}:`, error);
      
      // Default to free tier access
      return ['name_analysis', 'tagline_analysis', 'color_analysis'].includes(contentType);
    }
  }
  
  /**
   * Create or update a user subscription
   * @param userId User ID
   * @param tierCode Subscription tier code
   * @param paymentMethod Payment method used
   * @param transactionId Optional transaction ID
   * @returns The created or updated subscription
   */
  async createOrUpdateSubscription(
    userId: string,
    tierCode: string,
    paymentMethod: string,
    transactionId?: string
  ): Promise<UserSubscription> {
    try {
      // Find the subscription tier
      const tier = await SubscriptionTier.findOne({
        where: { tier_code: tierCode, active: true },
      });
      
      if (!tier) {
        throw new Error(`Subscription tier ${tierCode} not found or inactive`);
      }
      
      // Calculate subscription period based on billing cycle
      const startDate = new Date();
      const endDate = new Date(startDate);
      
      switch (tier.billing_cycle) {
        case 'monthly':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'quarterly':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case 'yearly':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }
      
      // Check for existing active subscription
      const existingSubscription = await UserSubscription.findOne({
        where: {
          user_id: userId,
          end_date: { [Op.gt]: new Date() },
        },
      });
      
      let subscription: UserSubscription;
      
      if (existingSubscription) {
        // Update existing subscription
        existingSubscription.subscription_tier_id = tier.id;
        existingSubscription.end_date = endDate;
        existingSubscription.payment_method = paymentMethod;
        existingSubscription.payment_status = 'completed';
        
        if (transactionId) {
          existingSubscription.transaction_id = transactionId;
        }
        
        await existingSubscription.save();
        subscription = existingSubscription;
      } else {
        // Create new subscription
        subscription = await UserSubscription.create({
          user_id: userId,
          subscription_tier_id: tier.id,
          start_date: startDate,
          end_date: endDate,
          auto_renew: true,
          payment_status: 'completed',
          payment_method: paymentMethod,
          transaction_id: transactionId,
        });
      }
      
      // Clear cache
      const cacheKeys = [
        `subscription:active:${userId}`,
        `subscription:tier:${userId}`,
      ];
      
      for (const key of cacheKeys) {
        await this.clearCache(key);
      }
      
      return subscription;
    } catch (error) {
      logger.error(`Error creating/updating subscription for user ${userId}:`, error);
      throw error;
    }
  }
  
  /**
   * Cancel a user's subscription
   * @param userId User ID
   * @returns Boolean indicating success
   */
  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      // Find active subscription
      const subscription = await UserSubscription.findOne({
        where: {
          user_id: userId,
          end_date: { [Op.gt]: new Date() },
        },
      });
      
      if (!subscription) {
        return false;
      }
      
      // Disable auto-renew
      subscription.auto_renew = false;
      await subscription.save();
      
      // Clear cache
      const cacheKeys = [
        `subscription:active:${userId}`,
        `subscription:tier:${userId}`,
      ];
      
      for (const key of cacheKeys) {
        await this.clearCache(key);
      }
      
      return true;
    } catch (error) {
      logger.error(`Error canceling subscription for user ${userId}:`, error);
      return false;
    }
  }
  
  /**
   * Clear cache for a specific key
   * @param key Cache key to clear
   */
  private async clearCache(key: string): Promise<void> {
    try {
      await setCacheWithExpiry(key, null, 1);
    } catch (error) {
      logger.error(`Error clearing cache for key ${key}:`, error);
    }
  }
}

export default new SubscriptionService();
