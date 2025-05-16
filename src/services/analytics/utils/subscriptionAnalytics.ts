import { AnalyticsEvent, UserJourney, FeatureUsage } from '../models';
import { trackEvent } from './analyticsService';
import { EventCategory, EventAction } from './eventSchema';
import { sequelize, Op, safeLiteral, safeCol, safeFn } from './sequelizeHelpers';

/**
 * Subscription analytics utilities for Corp Astro
 * These functions help track and analyze subscription-related metrics
 * to optimize conversion and retention
 */

interface SubscriptionTierDetails {
  name: 'free' | 'basic' | 'pro' | 'enterprise';
  price: number;
  features: string[];
}

// Subscription tier definitions
const SUBSCRIPTION_TIERS: Record<string, SubscriptionTierDetails> = {
  free: {
    name: 'free',
    price: 0,
    features: ['name_analysis', 'tagline_analysis', 'color_analysis']
  },
  basic: {
    name: 'basic',
    price: 9.99,
    features: ['daily_horoscope', 'basic_business_forecast', 'email_support']
  },
  pro: {
    name: 'pro',
    price: 19.99,
    features: ['daily_horoscope', 'weekly_horoscope', 'advanced_business_forecast', 'team_compatibility', 'priority_support']
  },
  enterprise: {
    name: 'enterprise',
    price: 49.99,
    features: ['daily_horoscope', 'weekly_horoscope', 'advanced_business_forecast', 'team_compatibility', 'strategic_planning', 'investment_timing', 'dedicated_consultant']
  }
};

/**
 * Track subscription page view
 * @param userId User ID
 * @param referrer Referrer page
 * @param experimentVariant A/B test variant if applicable
 */
export async function trackSubscriptionPageView(
  userId: string,
  referrer?: string,
  experimentVariant?: string
): Promise<void> {
  await trackEvent(
    'subscription_page_viewed',
    EventCategory.SUBSCRIPTION,
    EventAction.VIEW,
    {
      referrer,
      experiment_variant: experimentVariant
    },
    userId
  );
}

/**
 * Track subscription tier selection
 * @param userId User ID
 * @param tier Selected tier
 * @param previousTier Previous tier if upgrading/downgrading
 * @param experimentVariant A/B test variant if applicable
 */
export async function trackSubscriptionSelection(
  userId: string,
  tier: 'basic' | 'pro' | 'enterprise',
  previousTier?: 'free' | 'basic' | 'pro' | 'enterprise',
  experimentVariant?: string
): Promise<void> {
  await trackEvent(
    'subscription_tier_selected',
    EventCategory.SUBSCRIPTION,
    EventAction.CLICK,
    {
      selected_tier: tier,
      previous_tier: previousTier || 'none',
      tier_price: SUBSCRIPTION_TIERS[tier].price,
      experiment_variant: experimentVariant
    },
    userId
  );
}

/**
 * Track payment process initiation
 * @param userId User ID
 * @param tier Selected tier
 * @param paymentMethod Payment method
 * @param isAnnual Whether annual billing was selected
 */
export async function trackPaymentInitiation(
  userId: string,
  tier: 'basic' | 'pro' | 'enterprise',
  paymentMethod: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'other',
  isAnnual: boolean
): Promise<void> {
  await trackEvent(
    'payment_initiated',
    EventCategory.SUBSCRIPTION,
    EventAction.SUBMIT,
    {
      tier,
      payment_method: paymentMethod,
      is_annual: isAnnual,
      amount: isAnnual ? SUBSCRIPTION_TIERS[tier].price * 12 * 0.8 : SUBSCRIPTION_TIERS[tier].price // 20% discount for annual
    },
    userId
  );
}

/**
 * Track payment completion
 * @param userId User ID
 * @param tier Selected tier
 * @param paymentMethod Payment method used
 * @param isAnnual Whether annual billing was selected
 * @param transactionId Transaction ID
 * @param success Whether payment was successful
 */
export async function trackPaymentCompletion(
  userId: string,
  tier: 'basic' | 'pro' | 'enterprise',
  paymentMethod: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'other',
  isAnnual: boolean,
  transactionId: string,
  success: boolean
): Promise<void> {
  await trackEvent(
    success ? 'payment_succeeded' : 'payment_failed',
    EventCategory.SUBSCRIPTION,
    success ? EventAction.SUCCESS : EventAction.ERROR,
    {
      tier,
      payment_method: paymentMethod,
      is_annual: isAnnual,
      transaction_id: transactionId,
      amount: isAnnual ? SUBSCRIPTION_TIERS[tier].price * 12 * 0.8 : SUBSCRIPTION_TIERS[tier].price // 20% discount for annual
    },
    userId
  );
}

/**
 * Track subscription cancellation
 * @param userId User ID
 * @param tier Cancelled tier
 * @param reason Cancellation reason
 * @param feedback Additional feedback
 * @param daysActive Number of days the subscription was active
 */
export async function trackSubscriptionCancellation(
  userId: string,
  tier: 'basic' | 'pro' | 'enterprise',
  reason: 'too_expensive' | 'not_useful' | 'missing_features' | 'technical_issues' | 'found_alternative' | 'other',
  feedback?: string,
  daysActive?: number
): Promise<void> {
  await trackEvent(
    'subscription_cancelled',
    EventCategory.SUBSCRIPTION,
    EventAction.DELETE,
    {
      cancelled_tier: tier,
      cancellation_reason: reason,
      feedback: feedback ? feedback.substring(0, 500) : undefined, // Limit feedback length
      days_active: daysActive
    },
    userId
  );
}

/**
 * Track feature access based on subscription tier
 * @param userId User ID
 * @param featureName Feature being accessed
 * @param tier User's subscription tier
 * @param accessGranted Whether access was granted
 */
export async function trackFeatureAccess(
  userId: string,
  featureName: string,
  tier: 'free' | 'basic' | 'pro' | 'enterprise',
  accessGranted: boolean
): Promise<void> {
  await trackEvent(
    accessGranted ? 'feature_accessed' : 'feature_access_denied',
    EventCategory.SUBSCRIPTION,
    accessGranted ? EventAction.VIEW : EventAction.ERROR,
    {
      feature_name: featureName,
      subscription_tier: tier,
      has_access: accessGranted
    },
    userId
  );
}

/**
 * Get subscription funnel metrics
 * @param startDate Start date for analysis
 * @param endDate End date for analysis
 */
export async function getSubscriptionFunnelMetrics(
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>> {
  try {
    // Define the funnel stages
    const funnelStages = [
      'subscription_page_viewed',
      'subscription_tier_selected',
      'payment_initiated',
      'payment_succeeded'
    ];
    
    // Get counts for each stage
    const funnelData = await Promise.all(
      funnelStages.map(async (stage) => {
        const count = await AnalyticsEvent.count({
          where: {
            event_name: stage,
            client_timestamp: {
              [Op.between]: [startDate, endDate]
            }
          }
        });
        
        return { stage, count };
      })
    );
    
    // Calculate conversion rates between stages
    const funnelWithRates = funnelData.map((stage, index) => {
      if (index === 0) {
        return {
          ...stage,
          conversion_rate: 100,
          drop_off_rate: 0
        };
      }
      
      const previousStage = funnelData[index - 1];
      const conversionRate = previousStage.count > 0 
        ? (stage.count / previousStage.count) * 100 
        : 0;
      
      return {
        ...stage,
        conversion_rate: parseFloat(conversionRate.toFixed(2)),
        drop_off_rate: parseFloat((100 - conversionRate).toFixed(2))
      };
    });
    
    // Get conversion rates by tier
    const conversionByTier = await Promise.all(
      ['basic', 'pro', 'enterprise'].map(async (tier) => {
        const selections = await AnalyticsEvent.count({
          where: {
            event_name: 'subscription_tier_selected',
            'properties.selected_tier': tier,
            client_timestamp: {
              [Op.between]: [startDate, endDate]
            }
          }
        });
        
        const conversions = await AnalyticsEvent.count({
          where: {
            event_name: 'payment_succeeded',
            'properties.tier': tier,
            client_timestamp: {
              [Op.between]: [startDate, endDate]
            }
          }
        });
        
        return {
          tier,
          selections,
          conversions,
          conversion_rate: selections > 0 ? parseFloat(((conversions / selections) * 100).toFixed(2)) : 0
        };
      })
    );
    
    // Get payment method distribution
    const paymentMethods = await AnalyticsEvent.findAll({
      where: {
        event_name: 'payment_succeeded',
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [safeLiteral('properties->\'payment_method\''), 'method'],
        [safeFn('COUNT', safeCol('event_id')), 'count']
      ],
      group: [safeLiteral('properties->\'payment_method\'')]
    });
    
    // Get annual vs monthly distribution
    const billingCycles = await AnalyticsEvent.findAll({
      where: {
        event_name: 'payment_succeeded',
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [safeLiteral('properties->\'is_annual\''), 'is_annual'],
        [safeFn('COUNT', safeCol('event_id')), 'count']
      ],
      group: [safeLiteral('properties->\'is_annual\'')]
    });
    
    // Format billing cycle data
    const billingCycleData = {
      annual: 0,
      monthly: 0
    };
    
    billingCycles.forEach((item: any) => {
      if (item.get('is_annual') === 'true') {
        billingCycleData.annual = parseInt(item.get('count'));
      } else {
        billingCycleData.monthly = parseInt(item.get('count'));
      }
    });
    
    return {
      funnel: funnelWithRates,
      conversion_by_tier: conversionByTier,
      payment_methods: paymentMethods,
      billing_cycles: billingCycleData
    };
  } catch (error) {
    console.error('Error getting subscription funnel metrics:', error);
    return {};
  }
}

/**
 * Get feature usage by subscription tier
 * @param startDate Start date for analysis
 * @param endDate End date for analysis
 */
export async function getFeatureUsageByTier(
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>> {
  try {
    // Get feature usage counts by tier
    const featureUsageByTier = await FeatureUsage.findAll({
      where: {
        last_used_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        'feature_name',
        [safeLiteral('usage_data->\'subscription_tier\''), 'tier'],
        [safeFn('SUM', safeCol('usage_count')), 'total_usage'],
        [safeFn('COUNT', safeFn('DISTINCT', safeCol('user_id'))), 'unique_users']
      ],
      group: ['feature_name', safeLiteral('usage_data->\'subscription_tier\'')]
    });
    
    // Get feature access denial counts
    const accessDenials = await AnalyticsEvent.findAll({
      where: {
        event_name: 'feature_access_denied',
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [safeLiteral('properties->\'feature_name\''), 'feature_name'],
        [safeLiteral('properties->\'subscription_tier\''), 'tier'],
        [safeFn('COUNT', safeCol('event_id')), 'denial_count'],
        [safeFn('COUNT', safeFn('DISTINCT', safeCol('user_id'))), 'unique_users']
      ],
      group: [
        safeLiteral('properties->\'feature_name\''),
        safeLiteral('properties->\'subscription_tier\'')
      ]
    });
    
    // Get most valuable features (those that lead to upgrades)
    const upgradeEvents = await AnalyticsEvent.findAll({
      where: {
        event_name: 'subscription_tier_selected',
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        },
        'properties.previous_tier': {
          [Op.ne]: 'none'
        }
      },
      attributes: [
        [safeLiteral('properties->\'upgrade_reason\''), 'feature'],
        [safeFn('COUNT', safeCol('event_id')), 'count']
      ],
      group: [safeLiteral('properties->\'upgrade_reason\'')],
      order: [[safeLiteral('count'), 'DESC']],
      limit: 5
    });
    
    return {
      feature_usage_by_tier: featureUsageByTier,
      access_denials: accessDenials,
      upgrade_drivers: upgradeEvents
    };
  } catch (error) {
    console.error('Error getting feature usage by tier:', error);
    return {};
  }
}

/**
 * Get subscription retention metrics
 * @param cohortMonths Number of months to analyze
 */
export async function getSubscriptionRetentionMetrics(
  cohortMonths: number = 6
): Promise<Record<string, any>> {
  try {
    const now = new Date();
    const cohorts: Record<string, any>[] = [];
    
    // Generate cohort data for each month
    for (let i = 0; i < cohortMonths; i++) {
      const cohortStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const cohortEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const cohortLabel = `${cohortStart.toLocaleString('default', { month: 'short' })} ${cohortStart.getFullYear()}`;
      
      // Get new subscribers in this cohort
      const newSubscribers = await AnalyticsEvent.count({
        where: {
          event_name: 'payment_succeeded',
          client_timestamp: {
            [Op.between]: [cohortStart, cohortEnd]
          }
        },
        distinct: true,
        col: 'user_id'
      });
      
      if (newSubscribers === 0) continue;
      
      // Calculate retention for each month after subscription
      const retentionData: Record<string, number> = {
        month_0: 100 // Initial month is always 100%
      };
      
      for (let month = 1; month <= Math.min(cohortMonths, i + 1); month++) {
        const retentionStart = new Date(cohortStart);
        retentionStart.setMonth(retentionStart.getMonth() + month);
        const retentionEnd = new Date(retentionStart);
        retentionEnd.setMonth(retentionEnd.getMonth() + 1);
        
        // Get active subscribers from the cohort in this month
        const activeSubscribers = await AnalyticsEvent.count({
          where: {
            event_name: {
              [Op.notIn]: ['subscription_cancelled']
            },
            user_id: {
              [Op.in]: safeLiteral(`(
                SELECT user_id FROM analytics_events 
                WHERE event_name = 'payment_succeeded' 
                AND client_timestamp BETWEEN '${cohortStart.toISOString()}' AND '${cohortEnd.toISOString()}'
              )`)
            },
            client_timestamp: {
              [Op.between]: [retentionStart, retentionEnd]
            }
          },
          distinct: true,
          col: 'user_id'
        });
        
        retentionData[`month_${month}`] = parseFloat(((activeSubscribers / newSubscribers) * 100).toFixed(1));
      }
      
      cohorts.push({
        cohort: cohortLabel,
        subscribers: newSubscribers,
        ...retentionData
      });
    }
    
    // Calculate average retention rates
    const avgRetention: Record<string, number> = {};
    const months = Math.min(cohortMonths, 6); // Limit to 6 months for average calculation
    
    for (let month = 0; month <= months; month++) {
      const monthKey = `month_${month}`;
      const validCohorts = cohorts.filter(cohort => cohort[monthKey] !== undefined);
      
      if (validCohorts.length > 0) {
        const sum = validCohorts.reduce((acc, cohort) => acc + cohort[monthKey], 0);
        avgRetention[monthKey] = parseFloat((sum / validCohorts.length).toFixed(1));
      }
    }
    
    return {
      cohorts,
      average_retention: avgRetention
    };
  } catch (error) {
    console.error('Error getting subscription retention metrics:', error);
    return {};
  }
}

/**
 * Check if a user has access to a feature based on their subscription tier
 * @param featureName Feature to check access for
 * @param userTier User's subscription tier
 */
export function hasFeatureAccess(
  featureName: string,
  userTier: 'free' | 'basic' | 'pro' | 'enterprise'
): boolean {
  const tier = SUBSCRIPTION_TIERS[userTier];
  if (!tier) return false;
  
  return tier.features.includes(featureName);
}

/**
 * Get comprehensive subscription analytics data
 * This function combines data from multiple subscription analytics functions
 * to provide a complete overview of subscription performance
 * @param startDate Optional start date for filtering data
 * @param endDate Optional end date for filtering data
 */
export async function getSubscriptionAnalytics(
  startDate?: Date,
  endDate?: Date
): Promise<Record<string, any>> {
  try {
    // Use default dates if not provided
    const end = endDate || new Date();
    const start = startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days
    
    // Get subscription metrics
    const funnelMetrics = await getSubscriptionFunnelMetrics(start, end);
    const retentionMetrics = await getSubscriptionRetentionMetrics(6);
    
    // Get subscription metrics by tier
    const subscriptionsByTier = await AnalyticsEvent.findAll({
      where: {
        event_name: 'subscription_created',
        created_at: {
          [Op.between]: [start, end]
        }
      },
      attributes: [
        [safeLiteral("properties->>'tier'"), 'tier'],
        [safeFn('COUNT', safeCol('event_id')), 'count']
      ],
      group: [safeLiteral("properties->>'tier'")]
    });
    
    // Format tier data
    const tierData: Record<string, number> = {};
    subscriptionsByTier.forEach(item => {
      tierData[item.get('tier') as string] = parseInt(item.get('count') as string);
    });
    
    return {
      funnel: funnelMetrics.funnel || [],
      conversion_by_tier: funnelMetrics.conversion_by_tier || {},
      payment_methods: funnelMetrics.payment_methods || {},
      billing_cycles: funnelMetrics.billing_cycles || {},
      retention: retentionMetrics.average_retention || {},
      cohorts: retentionMetrics.cohorts || [],
      subscriptions_by_tier: tierData
    };
  } catch (error) {
    console.error('Error getting subscription analytics:', error);
    return {};
  }
}
