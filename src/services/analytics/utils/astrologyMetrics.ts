import { trackEvent, trackFeatureUsage } from './analyticsService';
import { EventCategory, EventAction } from './eventSchema';
import { FeatureUsage, AnalyticsEvent } from '../models';
import { sequelize, Op, safeLiteral, safeCol, safeFn } from './sequelizeHelpers';

/**
 * Astrology-specific analytics tracking utilities
 * These functions are specialized for tracking astrology-related events and metrics
 * in the Corp Astro application
 */

/**
 * Track chart generation events
 * @param userId User ID
 * @param chartType Type of chart (natal, transit, synastry, etc.)
 * @param businessId Business ID if applicable
 * @param generationTime Time taken to generate the chart in ms
 * @param chartData Additional chart data
 */
export async function trackChartGeneration(
  userId: string,
  chartType: 'natal' | 'transit' | 'synastry' | 'composite' | 'progressed' | 'dasha',
  businessId?: string,
  generationTime?: number,
  chartData?: Record<string, any>
): Promise<void> {
  await trackEvent(
    'chart_generated',
    EventCategory.ASTROLOGY,
    EventAction.GENERATE,
    {
      chart_type: chartType,
      business_id: businessId,
      generation_time: generationTime,
      chart_data: chartData
    },
    userId
  );
  
  // Also track as feature usage
  await trackFeatureUsage(
    `${chartType}_chart`,
    'chart',
    userId,
    generationTime ? Math.floor(generationTime / 1000) : undefined, // Convert ms to seconds
    'success',
    { business_id: businessId }
  );
}

/**
 * Track horoscope view events
 * @param userId User ID
 * @param horoscopeType Type of horoscope (daily, weekly, monthly)
 * @param subscriptionTier User's subscription tier
 * @param contentId Content ID of the horoscope
 */
export async function trackHoroscopeView(
  userId: string,
  horoscopeType: 'daily' | 'weekly' | 'monthly',
  subscriptionTier: 'free' | 'basic' | 'pro' | 'enterprise',
  contentId?: string
): Promise<void> {
  await trackEvent(
    'horoscope_viewed',
    EventCategory.CONTENT,
    EventAction.VIEW,
    {
      horoscope_type: horoscopeType,
      subscription_tier: subscriptionTier,
      content_id: contentId
    },
    userId
  );
  
  // Also track as feature usage
  await trackFeatureUsage(
    `${horoscopeType}_horoscope`,
    'horoscope',
    userId
  );
}

/**
 * Track business forecast view events
 * @param userId User ID
 * @param businessId Business ID
 * @param forecastType Type of forecast
 * @param forecastPeriod Period of the forecast
 * @param contentId Content ID of the forecast
 */
export async function trackBusinessForecast(
  userId: string,
  businessId: string,
  forecastType: 'financial' | 'strategic' | 'team' | 'general',
  forecastPeriod: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
  contentId?: string
): Promise<void> {
  await trackEvent(
    'business_forecast_viewed',
    EventCategory.ASTROLOGY,
    EventAction.VIEW,
    {
      business_id: businessId,
      forecast_type: forecastType,
      forecast_period: forecastPeriod,
      content_id: contentId
    },
    userId
  );
  
  // Also track as feature usage
  await trackFeatureUsage(
    'business_forecast',
    'forecast',
    userId,
    undefined,
    'success',
    { 
      business_id: businessId,
      forecast_type: forecastType,
      forecast_period: forecastPeriod
    }
  );
}

/**
 * Track free tool usage
 * @param userId User ID or anonymous ID
 * @param toolName Name of the free tool
 * @param inputData Input data provided to the tool
 * @param resultData Result data from the tool
 * @param usageDuration Duration of usage in seconds
 */
export async function trackFreeToolUsage(
  userId: string,
  toolName: 'name_analysis' | 'tagline_analysis' | 'color_analysis' | 'logo_analysis',
  inputData?: Record<string, any>,
  resultData?: Record<string, any>,
  usageDuration?: number
): Promise<void> {
  await trackEvent(
    'free_tool_used',
    EventCategory.INTERACTION,
    EventAction.USE,
    {
      tool_name: toolName,
      input_data: inputData,
      result_summary: resultData ? summarizeResults(resultData) : undefined
    },
    userId
  );
  
  // Also track as feature usage
  await trackFeatureUsage(
    toolName,
    'free_tool',
    userId,
    usageDuration,
    'success',
    { 
      has_input: !!inputData,
      has_result: !!resultData
    }
  );
}

/**
 * Track subscription tier changes
 * @param userId User ID
 * @param previousTier Previous subscription tier
 * @param newTier New subscription tier
 * @param changeReason Reason for the change
 */
export async function trackSubscriptionChange(
  userId: string,
  previousTier: 'free' | 'basic' | 'pro' | 'enterprise' | null,
  newTier: 'free' | 'basic' | 'pro' | 'enterprise',
  changeReason?: 'new' | 'upgrade' | 'downgrade' | 'renewal' | 'cancellation'
): Promise<void> {
  const eventName = !previousTier ? 'subscription_started' : 
                    newTier === 'free' ? 'subscription_cancelled' :
                    getTierValue(newTier) > getTierValue(previousTier) ? 'subscription_upgraded' : 
                    'subscription_downgraded';
  
  await trackEvent(
    eventName,
    EventCategory.SUBSCRIPTION,
    !previousTier ? EventAction.CREATE : 
    newTier === 'free' ? EventAction.DELETE :
    getTierValue(newTier) > getTierValue(previousTier) ? EventAction.UPGRADE : 
    EventAction.DOWNGRADE,
    {
      previous_tier: previousTier || 'none',
      new_tier: newTier,
      change_reason: changeReason || 'unknown'
    },
    userId
  );
}

/**
 * Track Astro Ratan AI chat interactions
 * @param userId User ID
 * @param sessionId Chat session ID
 * @param messageCount Number of messages in the conversation
 * @param topicCategories Categories of topics discussed
 * @param satisfactionScore User satisfaction score if available
 */
export async function trackAstroRatanChat(
  userId: string,
  sessionId: string,
  messageCount: number,
  topicCategories?: string[],
  satisfactionScore?: number
): Promise<void> {
  await trackEvent(
    'astro_ratan_chat',
    EventCategory.INTERACTION,
    EventAction.SUBMIT,
    {
      session_id: sessionId,
      message_count: messageCount,
      topic_categories: topicCategories,
      satisfaction_score: satisfactionScore
    },
    userId
  );
  
  // Also track as feature usage
  await trackFeatureUsage(
    'astro_ratan',
    'ai_chat',
    userId,
    undefined,
    satisfactionScore && satisfactionScore >= 4 ? 'success' : 
    satisfactionScore && satisfactionScore < 3 ? 'failure' : undefined,
    { 
      message_count: messageCount,
      topic_categories: topicCategories
    }
  );
}

/**
 * Get astrology feature usage analytics
 * @param startDate Start date for analysis
 * @param endDate End date for analysis
 * @param subscriptionTier Filter by subscription tier
 */
export async function getAstrologyFeatureAnalytics(
  startDate: Date,
  endDate: Date,
  subscriptionTier?: 'free' | 'basic' | 'pro' | 'enterprise'
): Promise<Record<string, any>> {
  try {
    // Get chart generation metrics
    const chartMetrics = await AnalyticsEvent.findAll({
      where: {
        event_name: 'chart_generated',
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        },
        ...(subscriptionTier ? {
          'properties.subscription_tier': subscriptionTier
        } : {})
      },
      attributes: [
        [safeLiteral('properties->\'chart_type\''), 'chart_type'],
        [safeFn('COUNT', safeCol('event_id')), 'count'],
        [safeFn('AVG', safeLiteral('CAST(properties->>\'generation_time\' AS INTEGER)')), 'avg_generation_time']
      ],
      group: [safeLiteral('properties->\'chart_type\'')]
    });
    
    // Get horoscope view metrics
    const horoscopeMetrics = await AnalyticsEvent.findAll({
      where: {
        event_name: 'horoscope_viewed',
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        },
        ...(subscriptionTier ? {
          'properties.subscription_tier': subscriptionTier
        } : {})
      },
      attributes: [
        [safeLiteral('properties->\'horoscope_type\''), 'horoscope_type'],
        [safeFn('COUNT', safeCol('event_id')), 'count']
      ],
      group: [safeLiteral('properties->\'horoscope_type\'')]
    });
    
    // Get business forecast metrics
    const forecastMetrics = await AnalyticsEvent.findAll({
      where: {
        event_name: 'business_forecast_viewed',
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        },
        ...(subscriptionTier ? {
          'properties.subscription_tier': subscriptionTier
        } : {})
      },
      attributes: [
        [safeLiteral('properties->\'forecast_type\''), 'forecast_type'],
        [safeLiteral('properties->\'forecast_period\''), 'forecast_period'],
        [safeFn('COUNT', safeCol('event_id')), 'count']
      ],
      group: [
        safeLiteral('properties->\'forecast_type\''),
        safeLiteral('properties->\'forecast_period\'')
      ]
    });
    
    // Get free tool usage metrics
    const freeToolMetrics = await AnalyticsEvent.findAll({
      where: {
        event_name: 'free_tool_used',
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [safeLiteral('properties->\'tool_name\''), 'tool_name'],
        [safeFn('COUNT', safeCol('event_id')), 'count']
      ],
      group: [safeLiteral('properties->\'tool_name\'')]
    });
    
    // Get Astro Ratan chat metrics
    const chatMetrics = await AnalyticsEvent.findAll({
      where: {
        event_name: 'astro_ratan_chat',
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        },
        ...(subscriptionTier ? {
          'properties.subscription_tier': subscriptionTier
        } : {})
      },
      attributes: [
        [safeFn('COUNT', safeCol('event_id')), 'total_sessions'],
        [safeFn('AVG', safeLiteral('CAST(properties->>\'message_count\' AS INTEGER)')), 'avg_messages_per_session'],
        [safeFn('AVG', safeLiteral('CAST(properties->>\'satisfaction_score\' AS FLOAT)')), 'avg_satisfaction']
      ]
    });
    
    return {
      chart_metrics: chartMetrics,
      horoscope_metrics: horoscopeMetrics,
      forecast_metrics: forecastMetrics,
      free_tool_metrics: freeToolMetrics,
      chat_metrics: chatMetrics[0] || { total_sessions: 0, avg_messages_per_session: 0, avg_satisfaction: 0 }
    };
  } catch (error) {
    console.error('Error getting astrology feature analytics:', error);
    return {};
  }
}

/**
 * Get subscription analytics
 * @param startDate Start date for analysis
 * @param endDate End date for analysis
 */
export async function getSubscriptionAnalytics(
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>> {
  try {
    // Get subscription changes
    const subscriptionChanges = await AnalyticsEvent.findAll({
      where: {
        event_name: {
          [Op.in]: ['subscription_started', 'subscription_upgraded', 'subscription_downgraded', 'subscription_cancelled']
        },
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        'event_name',
        [safeFn('COUNT', safeCol('event_id')), 'count']
      ],
      group: ['event_name']
    });
    
    // Get subscription distribution
    const subscriptionDistribution = await AnalyticsEvent.findAll({
      where: {
        event_name: {
          [Op.in]: ['subscription_started', 'subscription_upgraded', 'subscription_downgraded']
        },
        client_timestamp: {
          [Op.lte]: endDate
        },
        'properties.new_tier': {
          [Op.ne]: 'free'
        }
      },
      attributes: [
        [safeLiteral('properties->\'new_tier\''), 'tier'],
        [safeFn('COUNT', safeCol('event_id')), 'count']
      ],
      group: [safeLiteral('properties->\'new_tier\'')]
    });
    
    // Get cancellation reasons if available
    const cancellationReasons = await AnalyticsEvent.findAll({
      where: {
        event_name: 'subscription_cancelled',
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        },
        'properties.cancellation_reason': {
          [Op.ne]: null
        }
      },
      attributes: [
        [safeLiteral('properties->\'cancellation_reason\''), 'reason'],
        [safeFn('COUNT', safeCol('event_id')), 'count']
      ],
      group: [safeLiteral('properties->\'cancellation_reason\'')]
    });
    
    return {
      subscription_changes: subscriptionChanges,
      subscription_distribution: subscriptionDistribution,
      cancellation_reasons: cancellationReasons
    };
  } catch (error) {
    console.error('Error getting subscription analytics:', error);
    return {};
  }
}

// Helper functions

/**
 * Get numeric value for subscription tier for comparison
 */
function getTierValue(tier: 'free' | 'basic' | 'pro' | 'enterprise'): number {
  switch (tier) {
    case 'free': return 0;
    case 'basic': return 1;
    case 'pro': return 2;
    case 'enterprise': return 3;
    default: return 0;
  }
}

/**
 * Summarize result data to avoid storing too much in the analytics event
 */
function summarizeResults(resultData: Record<string, any>): Record<string, any> {
  const summary: Record<string, any> = {};
  
  // Extract only key information
  if (resultData.score) summary.score = resultData.score;
  if (resultData.rating) summary.rating = resultData.rating;
  if (resultData.category) summary.category = resultData.category;
  if (resultData.recommendation) summary.has_recommendation = true;
  if (resultData.analysis) summary.has_analysis = true;
  
  return summary;
}
