// src/services/subscription/utils/seedSubscriptionTiers.ts

import logger from '../../../utils/logger';
import SubscriptionTier from '../models/SubscriptionTier';
import { SubscriptionTiers } from '../../../config/constants';

/**
 * Default subscription tiers data
 */
const defaultTiers = [
  {
    tier_name: 'Free',
    tier_code: SubscriptionTiers.FREE,
    price: 0,
    currency: 'USD',
    billing_cycle: 'monthly' as const,
    features: [
      'Name number analysis',
      'Tagline analysis',
      'Company brand color analysis',
      'Basic astrological information'
    ],
    active: true,
  },
  {
    tier_name: 'Basic Subscription',
    tier_code: SubscriptionTiers.BASIC,
    price: 9.99,
    currency: 'USD',
    billing_cycle: 'monthly' as const,
    features: [
      'All Free tier features',
      'Personalized daily horoscopes',
      'Do\'s and don\'ts based on planetary positions',
      'Monthly astrological reports',
      'Business compatibility insights'
    ],
    active: true,
  },
  {
    tier_name: 'Premium',
    tier_code: SubscriptionTiers.PREMIUM,
    price: 29.99,
    currency: 'USD',
    billing_cycle: 'monthly' as const,
    features: [
      'All Basic tier features',
      'Detailed business insights',
      'Compatibility analysis with business partners',
      'Astro Ratan chat access',
      'Priority customer support',
      'Appointments with human astrology specialists'
    ],
    active: true,
  }
];

/**
 * Seed default subscription tiers
 */
export const seedSubscriptionTiers = async (): Promise<void> => {
  try {
    logger.info('Seeding subscription tiers...');
    
    for (const tierData of defaultTiers) {
      // Check if tier already exists
      const existingTier = await SubscriptionTier.findOne({
        where: { tier_code: tierData.tier_code },
      });
      
      if (existingTier) {
        logger.info(`Subscription tier ${tierData.tier_code} already exists, updating...`);
        await existingTier.update(tierData);
      } else {
        logger.info(`Creating subscription tier ${tierData.tier_code}...`);
        await SubscriptionTier.create(tierData);
      }
    }
    
    logger.info('Subscription tiers seeded successfully');
  } catch (error) {
    logger.error('Error seeding subscription tiers:', error);
    throw error;
  }
};

export default seedSubscriptionTiers;
