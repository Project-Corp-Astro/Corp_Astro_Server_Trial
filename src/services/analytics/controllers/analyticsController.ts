import { Request, Response } from 'express';
import { 
  trackEvent, 
  processBatchQueue, 
  getJourneyAnalytics, 
  getFeatureUsageAnalytics 
} from '../utils/analyticsService';
import { 
  getTestVariant, 
  recordConversion, 
  getTestResults 
} from '../utils/abTestingService';
import { 
  trackHeatmapInteraction, 
  generateHeatmapData, 
  getMostInteractedElements 
} from '../utils/heatmapService';
import { EventCategory, EventAction, validateEventProperties } from '../utils/eventSchema';
import { AnalyticsEvent, UserJourney, FeatureUsage, ABTest, DataExport } from '../models';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

/**
 * Track a single analytics event
 */
export async function trackSingleEvent(req: Request, res: Response): Promise<void> {
  try {
    const { 
      event_name, 
      event_category, 
      event_action, 
      properties, 
      session_id 
    } = req.body;
    
    // Get user ID from authenticated session if available
    const userId = req.user?.id;
    
    // Validate required fields
    if (!event_name || !event_category || !event_action) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: event_name, event_category, and event_action are required'
      });
      return;
    }
    
    // Validate event properties if any
    if (properties) {
      const validation = validateEventProperties(event_name, properties);
      if (!validation.valid) {
        res.status(400).json({
          success: false,
          message: 'Invalid event properties',
          errors: validation.errors
        });
        return;
      }
    }
    
    // Track the event
    const eventId = await trackEvent(
      event_name,
      event_category as EventCategory,
      event_action as EventAction,
      properties || {},
      userId,
      session_id || uuidv4(),
      true // Process immediately
    );
    
    res.status(200).json({
      success: true,
      event_id: eventId
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking event',
      error: (error as Error).message
    });
  }
}

/**
 * Track multiple analytics events in batch
 */
export async function trackBatchEvents(req: Request, res: Response): Promise<void> {
  try {
    const { events } = req.body;
    
    // Validate request
    if (!Array.isArray(events) || events.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Events must be a non-empty array'
      });
      return;
    }
    
    // Get user ID from authenticated session if available
    const userId = req.user?.id;
    
    // Process each event
    const eventIds: string[] = [];
    for (const event of events) {
      const { 
        event_name, 
        event_category, 
        event_action, 
        properties, 
        session_id 
      } = event;
      
      // Skip invalid events
      if (!event_name || !event_category || !event_action) {
        continue;
      }
      
      // Track the event (add to batch queue)
      const eventId = await trackEvent(
        event_name,
        event_category as EventCategory,
        event_action as EventAction,
        properties || {},
        userId,
        session_id || uuidv4(),
        false // Add to batch queue
      );
      
      eventIds.push(eventId);
    }
    
    // Process the batch queue
    await processBatchQueue();
    
    res.status(200).json({
      success: true,
      events_processed: eventIds.length,
      event_ids: eventIds
    });
  } catch (error) {
    console.error('Error tracking batch events:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking batch events',
      error: (error as Error).message
    });
  }
}

/**
 * Track feature usage
 */
export async function trackFeatureUsage(req: Request, res: Response): Promise<void> {
  try {
    const { 
      feature_name, 
      feature_category, 
      usage_duration, 
      usage_result, 
      usage_data 
    } = req.body;
    
    // Get user ID from authenticated session if available
    const userId = req.user?.id;
    
    // Validate required fields
    if (!feature_name || !feature_category) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: feature_name and feature_category are required'
      });
      return;
    }
    
    // Track the feature usage
    await trackFeatureUsage(
      feature_name,
      feature_category,
      userId,
      usage_duration,
      usage_result,
      usage_data
    );
    
    res.status(200).json({
      success: true
    });
  } catch (error) {
    console.error('Error tracking feature usage:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking feature usage',
      error: (error as Error).message
    });
  }
}

/**
 * Get A/B test variant for a user
 */
export async function getABTestVariant(req: Request, res: Response): Promise<void> {
  try {
    const { test_name, session_id, force_variant } = req.body;
    
    // Get user ID from authenticated session if available
    const userId = req.user?.id;
    
    // Validate required fields
    if (!test_name || !session_id) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: test_name and session_id are required'
      });
      return;
    }
    
    // Get the variant
    const variant = await getTestVariant(
      test_name,
      session_id,
      userId,
      force_variant
    );
    
    if (!variant) {
      res.status(404).json({
        success: false,
        message: `A/B test "${test_name}" not found or not active`
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      test_name,
      variant
    });
  } catch (error) {
    console.error('Error getting A/B test variant:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting A/B test variant',
      error: (error as Error).message
    });
  }
}

/**
 * Record a conversion for an A/B test
 */
export async function recordABTestConversion(req: Request, res: Response): Promise<void> {
  try {
    const { test_name, session_id } = req.body;
    
    // Get user ID from authenticated session if available
    const userId = req.user?.id;
    
    // Validate required fields
    if (!test_name || !session_id) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: test_name and session_id are required'
      });
      return;
    }
    
    // Record the conversion
    const success = await recordConversion(
      test_name,
      session_id,
      userId
    );
    
    if (!success) {
      res.status(404).json({
        success: false,
        message: 'A/B test or assignment not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      test_name
    });
  } catch (error) {
    console.error('Error recording A/B test conversion:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording A/B test conversion',
      error: (error as Error).message
    });
  }
}

/**
 * Track UI interaction for heatmap
 */
export async function trackUIInteraction(req: Request, res: Response): Promise<void> {
  try {
    const { 
      page_url, 
      coordinates, 
      interaction_type, 
      session_id 
    } = req.body;
    
    // Get user ID from authenticated session if available
    const userId = req.user?.id;
    
    // Validate required fields
    if (!page_url || !coordinates || !interaction_type) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: page_url, coordinates, and interaction_type are required'
      });
      return;
    }
    
    // Validate coordinates
    if (!coordinates.x || !coordinates.y || !coordinates.pageWidth || !coordinates.pageHeight) {
      res.status(400).json({
        success: false,
        message: 'Invalid coordinates: x, y, pageWidth, and pageHeight are required'
      });
      return;
    }
    
    // Track the interaction
    await trackHeatmapInteraction(
      page_url,
      coordinates,
      interaction_type,
      userId,
      session_id
    );
    
    res.status(200).json({
      success: true
    });
  } catch (error) {
    console.error('Error tracking UI interaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking UI interaction',
      error: (error as Error).message
    });
  }
}

/**
 * Get analytics dashboard data
 * This endpoint requires admin privileges
 */
export async function getDashboardData(req: Request, res: Response): Promise<void> {
  try {
    // Check admin permissions
    if (!req.user?.isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Unauthorized: Admin privileges required'
      });
      return;
    }
    
    const { start_date, end_date } = req.query;
    
    // Parse dates or use defaults
    const endDate = end_date ? new Date(end_date as string) : new Date();
    const startDate = start_date ? new Date(start_date as string) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
    
    // Get overall metrics
    const totalEvents = await AnalyticsEvent.count({
      where: {
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        }
      }
    });
    
    const uniqueUsers = await AnalyticsEvent.count({
      where: {
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        },
        user_id: {
          [Op.not]: null
        }
      },
      distinct: true,
      col: 'user_id'
    });
    
    const uniqueSessions = await AnalyticsEvent.count({
      where: {
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        }
      },
      distinct: true,
      col: 'session_id'
    });
    
    // Get top events
    const topEvents = await AnalyticsEvent.findAll({
      where: {
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        'event_name',
        'event_category',
        [AnalyticsEvent.sequelize!.fn('COUNT', AnalyticsEvent.sequelize!.col('event_id')), 'count']
      ],
      group: ['event_name', 'event_category'],
      order: [[AnalyticsEvent.sequelize!.literal('count'), 'DESC']],
      limit: 10
    });
    
    // Get journey completion rates
    const journeyCompletionRates = await UserJourney.findAll({
      where: {
        started_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        'journey_name',
        [UserJourney.sequelize!.fn('COUNT', UserJourney.sequelize!.col('journey_id')), 'total'],
        [UserJourney.sequelize!.fn('SUM', UserJourney.sequelize!.cast(
          UserJourney.sequelize!.col('completed'), 'int'
        )), 'completed']
      ],
      group: ['journey_name']
    });
    
    // Get top features
    const topFeatures = await FeatureUsage.findAll({
      where: {
        last_used_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        'feature_name',
        'feature_category',
        [FeatureUsage.sequelize!.fn('SUM', FeatureUsage.sequelize!.col('usage_count')), 'total_usage']
      ],
      group: ['feature_name', 'feature_category'],
      order: [[FeatureUsage.sequelize!.literal('total_usage'), 'DESC']],
      limit: 10
    });
    
    // Get active A/B tests
    const activeTests = await ABTest.findAll({
      where: {
        is_active: true,
        start_date: {
          [Op.lte]: endDate
        },
        [Op.or]: [
          { end_date: null },
          { end_date: { [Op.gte]: startDate } }
        ]
      },
      attributes: ['test_id', 'test_name', 'start_date', 'end_date']
    });
    
    res.status(200).json({
      success: true,
      time_range: {
        start_date: startDate,
        end_date: endDate
      },
      metrics: {
        total_events: totalEvents,
        unique_users: uniqueUsers,
        unique_sessions: uniqueSessions
      },
      top_events: topEvents,
      journey_completion_rates: journeyCompletionRates,
      top_features: topFeatures,
      active_tests: activeTests
    });
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting dashboard data',
      error: (error as Error).message
    });
  }
}

/**
 * Request a data export
 * This endpoint requires admin privileges
 */
export async function requestDataExport(req: Request, res: Response): Promise<void> {
  try {
    // Check admin permissions
    if (!req.user?.isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Unauthorized: Admin privileges required'
      });
      return;
    }
    
    const { export_name, export_type, query_params } = req.body;
    
    // Validate required fields
    if (!export_name || !export_type) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: export_name and export_type are required'
      });
      return;
    }
    
    // Create export request
    const dataExport = await DataExport.create({
      export_name,
      export_type,
      query_params,
      requested_by: req.user.id,
      requested_at: new Date(),
      status: 'pending'
    });
    
    // In a real implementation, you would trigger a background job to process the export
    // For now, we'll just return the export ID
    
    res.status(200).json({
      success: true,
      export_id: dataExport.export_id,
      status: 'pending'
    });
  } catch (error) {
    console.error('Error requesting data export:', error);
    res.status(500).json({
      success: false,
      message: 'Error requesting data export',
      error: (error as Error).message
    });
  }
}
