// src/services/subscription/constants/tiers.ts

/**
 * Subscription tier types
 */
export enum SubscriptionTierType {
  FREE = 'free',
  SUBSCRIPTION = 'subscription',
  PREMIUM = 'premium',
}

/**
 * Billing cycle types
 */
export enum BillingCycleType {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  BIANNUAL = 'biannual',
  ANNUAL = 'annual',
}

/**
 * Feature access by tier
 */
export const TierFeatures = {
  [SubscriptionTierType.FREE]: {
    nameNumberAnalysis: true,
    taglineAnalysis: true,
    brandColorAnalysis: true,
    dailyHoroscope: false,
    monthlyReport: false,
    astroRatanChat: false,
    humanAstrologerAccess: false,
    businessCompatibility: false,
    maxBusinessProfiles: 1,
    maxSavedReports: 5,
    adFree: false,
  },
  [SubscriptionTierType.SUBSCRIPTION]: {
    nameNumberAnalysis: true,
    taglineAnalysis: true,
    brandColorAnalysis: true,
    dailyHoroscope: true,
    monthlyReport: true,
    astroRatanChat: true,
    humanAstrologerAccess: false,
    businessCompatibility: true,
    maxBusinessProfiles: 3,
    maxSavedReports: 20,
    adFree: true,
  },
  [SubscriptionTierType.PREMIUM]: {
    nameNumberAnalysis: true,
    taglineAnalysis: true,
    brandColorAnalysis: true,
    dailyHoroscope: true,
    monthlyReport: true,
    astroRatanChat: true,
    humanAstrologerAccess: true,
    businessCompatibility: true,
    maxBusinessProfiles: 10,
    maxSavedReports: 100,
    adFree: true,
  },
};

/**
 * Default pricing for tiers (in INR)
 */
export const DefaultPricing = {
  [SubscriptionTierType.FREE]: {
    monthly: 0,
    quarterly: 0,
    biannual: 0,
    annual: 0,
  },
  [SubscriptionTierType.SUBSCRIPTION]: {
    monthly: 499,
    quarterly: 1299,
    biannual: 2499,
    annual: 4499,
  },
  [SubscriptionTierType.PREMIUM]: {
    monthly: 1999,
    quarterly: 5499,
    biannual: 9999,
    annual: 17999,
  },
};
