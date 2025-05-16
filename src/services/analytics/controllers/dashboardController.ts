import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { sequelize } from '../../../models';
import AnalyticsEvent from '../models/AnalyticsEvent';
import FeatureUsage from '../models/FeatureUsage';
import ABTest from '../models/ABTest';
import ABTestAssignment from '../models/ABTestAssignment';
import UserJourney from '../models/UserJourney';
import logger from '../../../utils/logger';

/**
 * Get overview metrics for the analytics dashboard
 * @param req Request object
 * @param res Response object
 */
export const getOverviewMetrics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, subscriptionTier } = req.query;
    
    // Validate date parameters
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }
    
    // Parse dates
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    // Add one day to end date to include the entire end date
    end.setDate(end.getDate() + 1);
    
    // Base query conditions
    const dateCondition = {
      client_timestamp: {
        [Op.between]: [start, end]
      }
    };
    
    // Add subscription tier filter if provided
    const subscriptionFilter = subscriptionTier && subscriptionTier !== 'all'
      ? { 'properties.subscription_tier': subscriptionTier }
      : {};
    
    // Get total users
    const totalUsersQuery = await AnalyticsEvent.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('user_id'))), 'count']
      ],
      where: {
        ...dateCondition,
        user_id: {
          [Op.not]: null as any
        }
      },
      raw: true
    });
    
    const totalUsers = totalUsersQuery[0].count || 0;
    
    // Get active users (users with at least one event in the period)
    const activeUsersQuery = await AnalyticsEvent.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('user_id'))), 'count']
      ],
      where: {
        ...dateCondition,
        user_id: {
          [Op.not]: null as any
        }
      },
      raw: true
    });
    
    const activeUsers = activeUsersQuery[0].count || 0;
    
    // Get new users (users who had their first event in the period)
    const newUsersQuery = await sequelize.query(`
      SELECT COUNT(DISTINCT user_id) as count
      FROM analytics_events
      WHERE user_id IN (
        SELECT user_id
        FROM analytics_events
        WHERE client_timestamp BETWEEN :start AND :end
        GROUP BY user_id
        HAVING MIN(client_timestamp) BETWEEN :start AND :end
      )
    `, {
      replacements: { start, end },
      type: sequelize.QueryTypes.SELECT
    });
    
    const newUsers = newUsersQuery[0].count || 0;
    
    // Get chart generations
    const chartGenerationsQuery = await FeatureUsage.count({
      where: {
        ...dateCondition,
        feature_category: 'chart_generation',
        ...subscriptionFilter
      }
    });
    
    const chartGenerations = chartGenerationsQuery || 0;
    
    // Get horoscope views
    const horoscopeViewsQuery = await FeatureUsage.count({
      where: {
        ...dateCondition,
        feature_category: 'horoscope',
        ...subscriptionFilter
      }
    });
    
    const horoscopeViews = horoscopeViewsQuery || 0;
    
    // Get business forecasts
    const businessForecastsQuery = await FeatureUsage.count({
      where: {
        ...dateCondition,
        feature_category: 'business_forecast',
        ...subscriptionFilter
      }
    });
    
    const businessForecasts = businessForecastsQuery || 0;
    
    // Get free tool usage
    const freeToolUsageQuery = await FeatureUsage.count({
      where: {
        ...dateCondition,
        feature_category: 'free_tool',
        ...subscriptionFilter
      }
    });
    
    const freeToolUsage = freeToolUsageQuery || 0;
    
    // Get subscription conversions
    const subscriptionConversionsQuery = await AnalyticsEvent.count({
      where: {
        ...dateCondition,
        event_category: 'subscription',
        event_action: 'conversion',
        ...subscriptionFilter
      }
    });
    
    const subscriptionConversions = subscriptionConversionsQuery || 0;
    
    // Get AI chat interactions
    const aiChatInteractionsQuery = await FeatureUsage.count({
      where: {
        ...dateCondition,
        feature_category: 'ai_chat',
        ...subscriptionFilter
      }
    });
    
    const aiChatInteractions = aiChatInteractionsQuery || 0;
    
    // Get chart generations by type
    const chartGenerationsByTypeQuery = await FeatureUsage.findAll({
      attributes: [
        'feature_name',
        [sequelize.fn('COUNT', sequelize.col('usage_id')), 'count']
      ],
      where: {
        ...dateCondition,
        feature_category: 'chart_generation',
        ...subscriptionFilter
      },
      group: ['feature_name'],
      raw: true
    });
    
    const chartGenerationsByType = chartGenerationsByTypeQuery.map(item => ({
      name: item.feature_name,
      value: parseInt(item.count as string, 10)
    }));
    
    // Get horoscope views by type
    const horoscopeViewsByTypeQuery = await FeatureUsage.findAll({
      attributes: [
        'feature_name',
        [sequelize.fn('COUNT', sequelize.col('usage_id')), 'count']
      ],
      where: {
        ...dateCondition,
        feature_category: 'horoscope',
        ...subscriptionFilter
      },
      group: ['feature_name'],
      raw: true
    });
    
    const horoscopeViewsByType = horoscopeViewsByTypeQuery.map(item => ({
      name: item.feature_name,
      value: parseInt(item.count as string, 10)
    }));
    
    // Get free tool usage by type
    const freeToolUsageByTypeQuery = await FeatureUsage.findAll({
      attributes: [
        'feature_name',
        [sequelize.fn('COUNT', sequelize.col('usage_id')), 'count']
      ],
      where: {
        ...dateCondition,
        feature_category: 'free_tool',
        ...subscriptionFilter
      },
      group: ['feature_name'],
      raw: true
    });
    
    const freeToolUsageByType = freeToolUsageByTypeQuery.map(item => ({
      name: item.feature_name,
      value: parseInt(item.count as string, 10)
    }));
    
    // Get user growth over time
    const userGrowthQuery = await sequelize.query(`
      WITH dates AS (
        SELECT generate_series(
          :start::date,
          :end::date,
          '1 day'::interval
        )::date AS date
      ),
      daily_users AS (
        SELECT
          date_trunc('day', client_timestamp)::date AS date,
          COUNT(DISTINCT user_id) AS users
        FROM
          analytics_events
        WHERE
          client_timestamp BETWEEN :start AND :end
          AND user_id IS NOT NULL
        GROUP BY
          date_trunc('day', client_timestamp)::date
      )
      SELECT
        dates.date::text,
        COALESCE(daily_users.users, 0) AS value
      FROM
        dates
      LEFT JOIN
        daily_users ON dates.date = daily_users.date
      ORDER BY
        dates.date
    `, {
      replacements: { start, end },
      type: sequelize.QueryTypes.SELECT
    });
    
    const userGrowth = userGrowthQuery.map(item => ({
      date: item.date,
      value: parseInt(item.value, 10)
    }));
    
    // Get feature usage over time
    const featureUsageOverTimeQuery = await sequelize.query(`
      WITH dates AS (
        SELECT generate_series(
          :start::date,
          :end::date,
          '1 day'::interval
        )::date AS date
      ),
      daily_usage AS (
        SELECT
          date_trunc('day', timestamp)::date AS date,
          COUNT(*) AS usage_count
        FROM
          feature_usage
        WHERE
          timestamp BETWEEN :start AND :end
        GROUP BY
          date_trunc('day', timestamp)::date
      )
      SELECT
        dates.date::text,
        COALESCE(daily_usage.usage_count, 0) AS value
      FROM
        dates
      LEFT JOIN
        daily_usage ON dates.date = daily_usage.date
      ORDER BY
        dates.date
    `, {
      replacements: { start, end },
      type: sequelize.QueryTypes.SELECT
    });
    
    const featureUsageOverTime = featureUsageOverTimeQuery.map(item => ({
      date: item.date,
      value: parseInt(item.value, 10)
    }));
    
    // Get subscriptions by tier
    const subscriptionsByTierQuery = await sequelize.query(`
      SELECT
        properties->>'subscription_tier' AS tier,
        COUNT(DISTINCT user_id) AS count
      FROM
        analytics_events
      WHERE
        client_timestamp BETWEEN :start AND :end
        AND event_category = 'subscription'
        AND properties->>'subscription_tier' IS NOT NULL
      GROUP BY
        properties->>'subscription_tier'
    `, {
      replacements: { start, end },
      type: sequelize.QueryTypes.SELECT
    });
    
    const subscriptionsByTier = subscriptionsByTierQuery.map(item => ({
      name: item.tier,
      value: parseInt(item.count, 10)
    }));
    
    // Get A/B test results
    const abTestsQuery = await ABTest.findAll({
      where: {
        start_date: {
          [Op.lte]: end
        },
        [Op.or]: [
          { end_date: null },
          { end_date: { [Op.gte]: start } }
        ]
      },
      raw: true
    });
    
    const abTestResults = [];
    
    for (const test of abTestsQuery) {
      const assignmentsQuery = await ABTestAssignment.findAll({
        attributes: [
          'variant',
          [sequelize.fn('COUNT', sequelize.col('assignment_id')), 'impressions'],
          [sequelize.fn('SUM', sequelize.literal('CASE WHEN converted = true THEN 1 ELSE 0 END')), 'conversions']
        ],
        where: {
          test_id: test.test_id,
          assigned_at: {
            [Op.between]: [start, end]
          }
        },
        group: ['variant'],
        raw: true
      });
      
      const variants = assignmentsQuery.map(item => {
        const impressions = parseInt(item.impressions as string, 10);
        const conversions = parseInt(item.conversions as string, 10);
        const conversionRate = impressions > 0 ? (conversions / impressions) * 100 : 0;
        
        return {
          name: item.variant,
          impressions,
          conversions,
          conversionRate: Math.round(conversionRate * 10) / 10 // Round to 1 decimal place
        };
      });
      
      if (variants.length > 0) {
        abTestResults.push({
          testName: test.test_name,
          variants
        });
      }
    }
    
    // Return all metrics
    return res.status(200).json({
      success: true,
      metrics: {
        totalUsers,
        activeUsers,
        newUsers,
        chartGenerations,
        horoscopeViews,
        businessForecasts,
        freeToolUsage,
        subscriptionConversions,
        aiChatInteractions,
        chartGenerationsByType,
        horoscopeViewsByType,
        freeToolUsageByType,
        userGrowth,
        featureUsageOverTime,
        subscriptionsByTier,
        abTestResults
      }
    });
  } catch (error) {
    logger.error('Error getting overview metrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get overview metrics',
      error: error.message
    });
  }
};

/**
 * Get user journey metrics
 * @param req Request object
 * @param res Response object
 */
export const getUserJourneyMetrics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, journeyName } = req.query;
    
    // Validate date parameters
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }
    
    // Parse dates
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    // Add one day to end date to include the entire end date
    end.setDate(end.getDate() + 1);
    
    // Base query conditions
    const dateCondition = {
      start_time: {
        [Op.between]: [start, end]
      }
    };
    
    // Add journey name filter if provided
    const journeyFilter = journeyName ? { journey_name: journeyName } : {};
    
    // Get journey metrics
    const journeyMetricsQuery = await UserJourney.findAll({
      attributes: [
        'journey_name',
        [sequelize.fn('COUNT', sequelize.col('journey_id')), 'total'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN is_completed = true THEN 1 ELSE 0 END')), 'completed']
      ],
      where: {
        ...dateCondition,
        ...journeyFilter
      },
      group: ['journey_name'],
      raw: true
    });
    
    const journeyMetrics = journeyMetricsQuery.map(item => {
      const total = parseInt(item.total as string, 10);
      const completed = parseInt(item.completed as string, 10);
      const completionRate = total > 0 ? (completed / total) * 100 : 0;
      
      return {
        name: item.journey_name,
        total,
        completed,
        completionRate: Math.round(completionRate * 10) / 10 // Round to 1 decimal place
      };
    });
    
    // Get journey stages
    const journeyStagesQuery = await UserJourney.findAll({
      attributes: [
        'journey_name',
        'journey_stage',
        [sequelize.fn('COUNT', sequelize.col('journey_id')), 'count']
      ],
      where: {
        ...dateCondition,
        ...journeyFilter
      },
      group: ['journey_name', 'journey_stage'],
      raw: true
    });
    
    // Group stages by journey
    const journeyStages = {};
    journeyStagesQuery.forEach(item => {
      if (!journeyStages[item.journey_name]) {
        journeyStages[item.journey_name] = [];
      }
      
      journeyStages[item.journey_name].push({
        stage: item.journey_stage,
        count: parseInt(item.count as string, 10)
      });
    });
    
    // Return journey metrics
    return res.status(200).json({
      success: true,
      journeyMetrics,
      journeyStages
    });
  } catch (error) {
    logger.error('Error getting user journey metrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get user journey metrics',
      error: error.message
    });
  }
};

/**
 * Get A/B test results
 * @param req Request object
 * @param res Response object
 */
export const getABTestResults = async (req: Request, res: Response) => {
  try {
    const { testName } = req.params;
    
    // Get test details
    const test = await ABTest.findOne({
      where: {
        test_name: testName
      },
      raw: true
    });
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'A/B test not found'
      });
    }
    
    // Get test assignments
    const assignmentsQuery = await ABTestAssignment.findAll({
      attributes: [
        'variant',
        [sequelize.fn('COUNT', sequelize.col('assignment_id')), 'impressions'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN converted = true THEN 1 ELSE 0 END')), 'conversions']
      ],
      where: {
        test_id: test.test_id
      },
      group: ['variant'],
      raw: true
    });
    
    const variants = assignmentsQuery.map(item => {
      const impressions = parseInt(item.impressions as string, 10);
      const conversions = parseInt(item.conversions as string, 10);
      const conversionRate = impressions > 0 ? (conversions / impressions) * 100 : 0;
      
      return {
        name: item.variant,
        impressions,
        conversions,
        conversionRate: Math.round(conversionRate * 10) / 10 // Round to 1 decimal place
      };
    });
    
    // Determine the winner
    let winner = null;
    if (variants.length > 0) {
      winner = variants.reduce((prev, current) => {
        return prev.conversionRate > current.conversionRate ? prev : current;
      });
    }
    
    // Return test results
    return res.status(200).json({
      success: true,
      test: {
        name: test.test_name,
        description: test.description,
        startDate: test.start_date,
        endDate: test.end_date,
        isActive: test.is_active
      },
      variants,
      winner
    });
  } catch (error) {
    logger.error('Error getting A/B test results:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get A/B test results',
      error: error.message
    });
  }
};

export default {
  getOverviewMetrics,
  getUserJourneyMetrics,
  getABTestResults
};
