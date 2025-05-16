// src/services/subscription/utils/seedSubscriptionPlans.ts

import SubscriptionPlan from '../models/subscription';
import { SubscriptionTierType, TierFeatures, DefaultPricing } from '../constants/tiers';
import logger from '../../../utils/logger';

/**
 * Seeds the default subscription plans for the three tiers
 */
export const seedSubscriptionPlans = async (): Promise<void> => {
  try {
    logger.info('Seeding subscription plans...');

    // Define the default plans
    const defaultPlans = [
      {
        plan_name: 'Free Plan',
        plan_description: 'Basic access to Corp Astro with limited features',
        tier_type: SubscriptionTierType.FREE,
        monthly_price: DefaultPricing[SubscriptionTierType.FREE].monthly,
        quarterly_price: DefaultPricing[SubscriptionTierType.FREE].quarterly,
        biannual_price: DefaultPricing[SubscriptionTierType.FREE].biannual,
        annual_price: DefaultPricing[SubscriptionTierType.FREE].annual,
        currency: 'INR',
        features: TierFeatures[SubscriptionTierType.FREE],
        is_active: true,
      },
      {
        plan_name: 'Subscription Plan',
        plan_description: 'Enhanced access to Corp Astro with personalized content and business insights',
        tier_type: SubscriptionTierType.SUBSCRIPTION,
        monthly_price: DefaultPricing[SubscriptionTierType.SUBSCRIPTION].monthly,
        quarterly_price: DefaultPricing[SubscriptionTierType.SUBSCRIPTION].quarterly,
        biannual_price: DefaultPricing[SubscriptionTierType.SUBSCRIPTION].biannual,
        annual_price: DefaultPricing[SubscriptionTierType.SUBSCRIPTION].annual,
        currency: 'INR',
        features: TierFeatures[SubscriptionTierType.SUBSCRIPTION],
        is_active: true,
      },
      {
        plan_name: 'Premium Plan',
        plan_description: 'Full access to Corp Astro with human astrologer consultations and advanced business insights',
        tier_type: SubscriptionTierType.PREMIUM,
        monthly_price: DefaultPricing[SubscriptionTierType.PREMIUM].monthly,
        quarterly_price: DefaultPricing[SubscriptionTierType.PREMIUM].quarterly,
        biannual_price: DefaultPricing[SubscriptionTierType.PREMIUM].biannual,
        annual_price: DefaultPricing[SubscriptionTierType.PREMIUM].annual,
        currency: 'INR',
        features: TierFeatures[SubscriptionTierType.PREMIUM],
        is_active: true,
      },
    ];

    // For each default plan, check if it exists and create or update it
    for (const planData of defaultPlans) {
      const existingPlan = await SubscriptionPlan.findOne({
        where: {
          tier_type: planData.tier_type,
        },
      });

      if (existingPlan) {
        logger.info(`Updating existing plan for tier: ${planData.tier_type}`);
        await existingPlan.update(planData);
      } else {
        logger.info(`Creating new plan for tier: ${planData.tier_type}`);
        await SubscriptionPlan.create(planData);
      }
    }

    logger.info('Subscription plans seeded successfully');
  } catch (error) {
    logger.error('Error seeding subscription plans:', error);
    throw error;
  }
};

export default seedSubscriptionPlans;
