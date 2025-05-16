// src/services/subscription/services/tierService.ts

import UserSubscription from '../models/UserSubscription ';
import SubscriptionPlan from '../models/subscription';
import { SubscriptionTierType, TierFeatures } from '../constants/tiers';
import logger from '../../../utils/logger';

/**
 * Service for handling subscription tier-related operations
 */
class TierService {
  /**
   * Get a user's current subscription tier
   * @param userId User ID to check
   * @returns The user's subscription tier type
   */
  async getUserTier(userId: string): Promise<SubscriptionTierType> {
    try {
      if (!userId) {
        return SubscriptionTierType.FREE;
      }

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

      if (subscription && subscription.get('plan')) {
        const plan = subscription.get('plan') as SubscriptionPlan;
        return plan.tier_type;
      }

      return SubscriptionTierType.FREE;
    } catch (error) {
      logger.error('Error getting user tier:', error);
      return SubscriptionTierType.FREE;
    }
  }

  /**
   * Get features available for a specific tier
   * @param tierType Subscription tier type
   * @returns Features available for the tier
   */
  getTierFeatures(tierType: SubscriptionTierType) {
    return TierFeatures[tierType];
  }

  /**
   * Check if a user has access to a specific feature
   * @param userId User ID to check
   * @param featureName Feature name to check access for
   * @returns Whether the user has access to the feature
   */
  async hasFeatureAccess(
    userId: string,
    featureName: keyof typeof TierFeatures[SubscriptionTierType.PREMIUM]
  ): Promise<boolean> {
    try {
      const userTier = await this.getUserTier(userId);
      const tierFeatures = this.getTierFeatures(userTier);
      
      return !!tierFeatures[featureName];
    } catch (error) {
      logger.error('Error checking feature access:', error);
      return false;
    }
  }

  /**
   * Check if a user has a specific tier or higher
   * @param userId User ID to check
   * @param requiredTier Minimum tier required
   * @returns Whether the user has the required tier or higher
   */
  async hasTierAccess(userId: string, requiredTier: SubscriptionTierType): Promise<boolean> {
    try {
      const userTier = await this.getUserTier(userId);
      
      const tierOrder = {
        [SubscriptionTierType.FREE]: 0,
        [SubscriptionTierType.SUBSCRIPTION]: 1,
        [SubscriptionTierType.PREMIUM]: 2,
      };

      return tierOrder[userTier] >= tierOrder[requiredTier];
    } catch (error) {
      logger.error('Error checking tier access:', error);
      return false;
    }
  }

  /**
   * Get subscription tier details including features and limits
   * @param tierType Subscription tier type
   * @returns Tier details
   */
  async getTierDetails(tierType: SubscriptionTierType) {
    try {
      const plan = await SubscriptionPlan.findOne({
        where: {
          tier_type: tierType,
          is_active: true,
        },
      });

      return {
        tier: tierType,
        plan: plan || null,
        features: this.getTierFeatures(tierType),
      };
    } catch (error) {
      logger.error('Error getting tier details:', error);
      return {
        tier: tierType,
        plan: null,
        features: this.getTierFeatures(tierType),
      };
    }
  }

  /**
   * Get all available subscription tiers with details
   * @returns Array of tier details
   */
  async getAllTiers() {
    try {
      const plans = await SubscriptionPlan.findAll({
        where: {
          is_active: true,
        },
      });

      return Object.values(SubscriptionTierType).map(tierType => {
        const plan = plans.find(p => p.tier_type === tierType);
        return {
          tier: tierType,
          plan: plan || null,
          features: this.getTierFeatures(tierType),
        };
      });
    } catch (error) {
      logger.error('Error getting all tiers:', error);
      return Object.values(SubscriptionTierType).map(tierType => ({
        tier: tierType,
        plan: null,
        features: this.getTierFeatures(tierType),
      }));
    }
  }
}

export default new TierService();
