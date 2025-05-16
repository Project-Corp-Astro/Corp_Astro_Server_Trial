/**
 * Analytics Dashboard Controller
 * Provides data for the Super Admin analytics dashboard
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AnalyticsEvent, FeatureUsage, UserJourney } from '../services/analytics/models';
import { Op } from 'sequelize';
import sequelize from '../config/sequelize.config';

/**
 * Get overview metrics for the dashboard
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const getOverviewMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Validate date parameters
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
    const end = endDate ? new Date(endDate as string) : new Date();
    
    // Get total users (unique user_ids)
    const totalUsers = await AnalyticsEvent.count({
      distinct: true,
      col: 'user_id',
      where: {
        client_timestamp: {
          [Op.between]: [start, end]
        },
        user_id: {
          [Op.not]: null
        }
      }
    });
    
    // Get total sessions (unique session_ids)
    const totalSessions = await AnalyticsEvent.count({
      distinct: true,
      col: 'session_id',
      where: {
        client_timestamp: {
          [Op.between]: [start, end]
        }
      }
    });
    
    // Get total events
    const totalEvents = await AnalyticsEvent.count({
      where: {
        client_timestamp: {
          [Op.between]: [start, end]
        }
      }
    });
    
    // Get events by category
    const eventsByCategory = await AnalyticsEvent.findAll({
      attributes: [
        'event_category',
        [sequelize.fn('COUNT', sequelize.col('event_id')), 'count']
      ],
      where: {
        client_timestamp: {
          [Op.between]: [start, end]
        }
      },
      group: ['event_category'],
      order: [[sequelize.literal('count'), 'DESC']]
    });
    
    // Get events by platform (from device_info)
    const eventsByPlatform = await AnalyticsEvent.findAll({
      attributes: [
        [sequelize.literal(`properties->'device_info'->>'os_version'`), 'platform'],
        [sequelize.fn('COUNT', sequelize.col('event_id')), 'count']
      ],
      where: {
        client_timestamp: {
          [Op.between]: [start, end]
        },
        [sequelize.literal(`properties->'device_info'->>'os_version' IS NOT NULL`)]: true
      },
      group: [sequelize.literal(`properties->'device_info'->>'os_version'`)],
      order: [[sequelize.literal('count'), 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalSessions,
        totalEvents,
        eventsByCategory,
        eventsByPlatform,
        dateRange: {
          start,
          end
        }
      }
    });
  } catch (error) {
    console.error('Error getting overview metrics:', error);
    return res.status(500).json({
      error: 'Failed to retrieve overview metrics'
    });
  }
};

/**
 * Get user engagement metrics
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const getUserEngagementMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Validate date parameters
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();
    
    // Get daily active users
    const dailyActiveUsers = await AnalyticsEvent.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('client_timestamp')), 'date'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('user_id'))), 'count']
      ],
      where: {
        client_timestamp: {
          [Op.between]: [start, end]
        },
        user_id: {
          [Op.not]: null
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('client_timestamp'))],
      order: [[sequelize.fn('DATE', sequelize.col('client_timestamp')), 'ASC']]
    });
    
    // Get session duration (average)
    const sessionDuration = await AnalyticsEvent.findAll({
      attributes: [
        'session_id',
        [sequelize.fn('MIN', sequelize.col('client_timestamp')), 'session_start'],
        [sequelize.fn('MAX', sequelize.col('client_timestamp')), 'session_end']
      ],
      where: {
        client_timestamp: {
          [Op.between]: [start, end]
        }
      },
      group: ['session_id'],
      having: sequelize.literal('COUNT(event_id) > 1') // Only sessions with multiple events
    });
    
    // Calculate average session duration
    let totalDuration = 0;
    let validSessions = 0;
    
    sessionDuration.forEach((session: any) => {
      const startTime = new Date(session.getDataValue('session_start')).getTime();
      const endTime = new Date(session.getDataValue('session_end')).getTime();
      const duration = (endTime - startTime) / 1000; // in seconds
      
      // Only count sessions with reasonable duration (less than 3 hours)
      if (duration > 0 && duration < 10800) {
        totalDuration += duration;
        validSessions++;
      }
    });
    
    const averageSessionDuration = validSessions > 0 ? totalDuration / validSessions : 0;
    
    // Get screen views by screen name
    const screenViews = await AnalyticsEvent.findAll({
      attributes: [
        [sequelize.literal(`properties->>'screen_name'`), 'screen_name'],
        [sequelize.fn('COUNT', sequelize.col('event_id')), 'count']
      ],
      where: {
        client_timestamp: {
          [Op.between]: [start, end]
        },
        event_name: 'screen_view'
      },
      group: [sequelize.literal(`properties->>'screen_name'`)],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 10
    });
    
    return res.status(200).json({
      success: true,
      data: {
        dailyActiveUsers,
        averageSessionDuration,
        screenViews,
        dateRange: {
          start,
          end
        }
      }
    });
  } catch (error) {
    console.error('Error getting user engagement metrics:', error);
    return res.status(500).json({
      error: 'Failed to retrieve user engagement metrics'
    });
  }
};

/**
 * Get feature usage metrics
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const getFeatureUsageMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, category } = req.query;
    
    // Validate date parameters
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();
    
    // Build where clause
    const whereClause: any = {
      last_used_at: {
        [Op.between]: [start, end]
      }
    };
    
    // Add category filter if provided
    if (category) {
      whereClause.feature_category = category;
    }
    
    // Get feature usage by feature name
    const featureUsageByName = await FeatureUsage.findAll({
      attributes: [
        'feature_name',
        [sequelize.fn('SUM', sequelize.col('usage_count')), 'total_usage'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('user_id'))), 'unique_users']
      ],
      where: whereClause,
      group: ['feature_name'],
      order: [[sequelize.literal('total_usage'), 'DESC']],
      limit: 20
    });
    
    // Get feature usage by category
    const featureUsageByCategory = await FeatureUsage.findAll({
      attributes: [
        'feature_category',
        [sequelize.fn('SUM', sequelize.col('usage_count')), 'total_usage'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('user_id'))), 'unique_users']
      ],
      where: {
        last_used_at: {
          [Op.between]: [start, end]
        }
      },
      group: ['feature_category'],
      order: [[sequelize.literal('total_usage'), 'DESC']]
    });
    
    // Get feature usage by result (success, failure, abandoned)
    const featureUsageByResult = await FeatureUsage.findAll({
      attributes: [
        'usage_result',
        [sequelize.fn('COUNT', sequelize.col('usage_id')), 'count']
      ],
      where: {
        last_used_at: {
          [Op.between]: [start, end]
        },
        usage_result: {
          [Op.not]: null
        }
      },
      group: ['usage_result']
    });
    
    return res.status(200).json({
      success: true,
      data: {
        featureUsageByName,
        featureUsageByCategory,
        featureUsageByResult,
        dateRange: {
          start,
          end
        }
      }
    });
  } catch (error) {
    console.error('Error getting feature usage metrics:', error);
    return res.status(500).json({
      error: 'Failed to retrieve feature usage metrics'
    });
  }
};

/**
 * Get A/B test metrics
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const getABTestMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { testName } = req.params;
    const { startDate, endDate } = req.query;
    
    // Validate date parameters
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();
    
    // Get all events related to this test
    const testEvents = await AnalyticsEvent.findAll({
      where: {
        client_timestamp: {
          [Op.between]: [start, end]
        },
        [sequelize.literal(`properties->>'test_name' = :testName`)]: true
      },
      replacements: { testName },
      order: [['client_timestamp', 'ASC']]
    });
    
    // Process events to get variant assignments and conversions
    const variants: Record<string, any> = {};
    const userVariants: Record<string, string> = {};
    const conversions: Record<string, number> = {};
    
    testEvents.forEach((event: any) => {
      const properties = event.properties || {};
      const userId = event.user_id;
      const variant = properties.variant;
      const isConversion = event.event_name === 'ab_test_conversion';
      
      if (variant && userId) {
        // Track variant assignment
        if (!variants[variant]) {
          variants[variant] = {
            users: new Set(),
            conversions: 0
          };
        }
        
        variants[variant].users.add(userId);
        userVariants[userId] = variant;
      }
      
      if (isConversion && userId) {
        // Track conversion
        const userVariant = userVariants[userId];
        if (userVariant && variants[userVariant]) {
          variants[userVariant].conversions++;
        }
        
        if (!conversions[userId]) {
          conversions[userId] = 0;
        }
        conversions[userId]++;
      }
    });
    
    // Calculate metrics for each variant
    const variantMetrics = Object.entries(variants).map(([variantName, data]: [string, any]) => {
      const userCount = data.users.size;
      const conversionCount = data.conversions;
      const conversionRate = userCount > 0 ? (conversionCount / userCount) * 100 : 0;
      
      return {
        variant: variantName,
        users: userCount,
        conversions: conversionCount,
        conversionRate: parseFloat(conversionRate.toFixed(2))
      };
    });
    
    return res.status(200).json({
      success: true,
      data: {
        testName,
        variantMetrics,
        totalUsers: Object.keys(userVariants).length,
        totalConversions: Object.keys(conversions).length,
        dateRange: {
          start,
          end
        }
      }
    });
  } catch (error) {
    console.error('Error getting A/B test metrics:', error);
    return res.status(500).json({
      error: 'Failed to retrieve A/B test metrics'
    });
  }
};

/**
 * Get user journey metrics
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const getUserJourneyMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { journeyName } = req.params;
    const { startDate, endDate } = req.query;
    
    // Validate date parameters
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();
    
    // Build where clause
    const whereClause: any = {
      started_at: {
        [Op.between]: [start, end]
      }
    };
    
    // Add journey name filter if provided
    if (journeyName && journeyName !== 'all') {
      whereClause.journey_name = journeyName;
    }
    
    // Get journey completion metrics
    const journeyMetrics = await UserJourney.findAll({
      attributes: [
        'journey_name',
        [sequelize.fn('COUNT', sequelize.col('journey_id')), 'total_journeys'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN completed = true THEN 1 ELSE 0 END')), 'completed_journeys'],
        [sequelize.literal('SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) * 100.0 / COUNT(journey_id)'), 'completion_rate']
      ],
      where: whereClause,
      group: ['journey_name'],
      order: [[sequelize.literal('total_journeys'), 'DESC']]
    });
    
    // Get step breakdown for specific journey if requested
    let stepBreakdown = null;
    if (journeyName && journeyName !== 'all') {
      stepBreakdown = await UserJourney.findAll({
        attributes: [
          'current_step',
          [sequelize.fn('COUNT', sequelize.col('journey_id')), 'count']
        ],
        where: {
          journey_name: journeyName,
          started_at: {
            [Op.between]: [start, end]
          }
        },
        group: ['current_step'],
        order: [['current_step', 'ASC']]
      });
    }
    
    // Get average completion time for completed journeys
    const completionTimeData = await UserJourney.findAll({
      attributes: [
        'journey_name',
        [sequelize.literal('AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) / 60'), 'avg_completion_minutes']
      ],
      where: {
        ...whereClause,
        completed: true,
        completed_at: {
          [Op.not]: null
        }
      },
      group: ['journey_name'],
      order: [['journey_name', 'ASC']]
    });
    
    // Format the completion time data
    const completionTimes = completionTimeData.reduce((acc: Record<string, number>, item: any) => {
      acc[item.journey_name] = parseFloat(item.getDataValue('avg_completion_minutes').toFixed(2));
      return acc;
    }, {});
    
    return res.status(200).json({
      success: true,
      data: {
        journeyMetrics,
        stepBreakdown,
        completionTimes,
        dateRange: {
          start,
          end
        }
      }
    });
  } catch (error) {
    console.error('Error getting user journey metrics:', error);
    return res.status(500).json({
      error: 'Failed to retrieve user journey metrics'
    });
  }
};

/**
 * Get real-time analytics data
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const getRealTimeAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get events from the last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    // Get active users in the last 15 minutes
    const activeUsers = await AnalyticsEvent.count({
      distinct: true,
      col: 'user_id',
      where: {
        client_timestamp: {
          [Op.gte]: fifteenMinutesAgo
        },
        user_id: {
          [Op.not]: null
        }
      }
    });
    
    // Get active sessions in the last 15 minutes
    const activeSessions = await AnalyticsEvent.count({
      distinct: true,
      col: 'session_id',
      where: {
        client_timestamp: {
          [Op.gte]: fifteenMinutesAgo
        }
      }
    });
    
    // Get events in the last 15 minutes
    const recentEvents = await AnalyticsEvent.count({
      where: {
        client_timestamp: {
          [Op.gte]: fifteenMinutesAgo
        }
      }
    });
    
    // Get events per minute for the last 15 minutes
    const eventsPerMinute = await AnalyticsEvent.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'minute', sequelize.col('client_timestamp')), 'minute'],
        [sequelize.fn('COUNT', sequelize.col('event_id')), 'count']
      ],
      where: {
        client_timestamp: {
          [Op.gte]: fifteenMinutesAgo
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'minute', sequelize.col('client_timestamp'))],
      order: [[sequelize.fn('DATE_TRUNC', 'minute', sequelize.col('client_timestamp')), 'ASC']]
    });
    
    // Get most recent events (limited to 10)
    const latestEvents = await AnalyticsEvent.findAll({
      attributes: [
        'event_id',
        'event_name',
        'event_category',
        'event_action',
        'client_timestamp',
        'user_id',
        'session_id'
      ],
      where: {
        client_timestamp: {
          [Op.gte]: fifteenMinutesAgo
        }
      },
      order: [['client_timestamp', 'DESC']],
      limit: 10
    });
    
    return res.status(200).json({
      success: true,
      data: {
        activeUsers,
        activeSessions,
        recentEvents,
        eventsPerMinute,
        latestEvents,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting real-time analytics:', error);
    return res.status(500).json({
      error: 'Failed to retrieve real-time analytics'
    });
  }
};
