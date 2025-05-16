/**
 * Mobile Analytics Controller
 * Handles API requests from mobile applications for analytics tracking
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { 
  trackEvent, 
  batchProcessEvents 
} from '../services/analytics/utils/analyticsService';
import { 
  trackChartGeneration,
  trackHoroscopeView,
  trackBusinessForecast,
  trackFreeToolUsage
} from '../services/analytics/utils/astrologyMetrics';
import {
  getAstrologyTestVariant,
  trackAstrologyTestConversion
} from '../services/analytics/utils/astrologyABTests';
import { EventCategory, EventAction } from '../services/analytics/utils/eventSchema';

/**
 * Process a batch of events from mobile devices
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const processMobileEventBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { events, sessionId, deviceInfo } = req.body;

    // Validate that events is an array
    if (!Array.isArray(events)) {
      return res.status(400).json({
        error: 'Events must be an array'
      });
    }

    // Add device info to each event if provided
    const processedEvents = events.map(event => ({
      ...event,
      device_info: event.device_info || deviceInfo,
      session_id: event.session_id || sessionId
    }));

    // Process the batch of events
    await batchProcessEvents(processedEvents);

    return res.status(200).json({
      success: true,
      message: 'Events batch processed successfully',
      count: events.length
    });
  } catch (error) {
    console.error('Error processing mobile events batch:', error);
    return res.status(500).json({
      error: 'Failed to process events batch'
    });
  }
};

/**
 * Track a screen view from a mobile device
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const trackMobileScreenView = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      screen_name,
      user_id,
      session_id,
      properties,
      device_info
    } = req.body;

    // Track the screen view as an event
    await trackEvent(
      'screen_view',
      EventCategory.NAVIGATION,
      EventAction.VIEW,
      {
        screen_name,
        ...properties
      },
      user_id,
      session_id,
      false,  // immediate
      undefined, // timestamp
      device_info
    );

    return res.status(200).json({
      success: true,
      message: 'Screen view tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking mobile screen view:', error);
    return res.status(500).json({
      error: 'Failed to track screen view'
    });
  }
};

/**
 * Get A/B test variant for a mobile user
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const getMobileTestVariant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { test_name, user_id, session_id } = req.body;

    // Require either user_id or session_id
    if (!user_id && !session_id) {
      return res.status(400).json({
        error: 'Either user_id or session_id is required'
      });
    }

    // Get the test variant
    const variant = await getAstrologyTestVariant(
      test_name,
      user_id,
      session_id
    );

    if (!variant) {
      return res.status(404).json({
        error: 'Test not found or no variant assigned'
      });
    }

    return res.status(200).json({
      success: true,
      variant
    });
  } catch (error) {
    console.error('Error getting mobile test variant:', error);
    return res.status(500).json({
      error: 'Failed to get test variant'
    });
  }
};

/**
 * Track a conversion for an A/B test from a mobile device
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const trackMobileTestConversion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { test_name, user_id, session_id, conversion_value } = req.body;

    // Require either user_id or session_id
    if (!user_id && !session_id) {
      return res.status(400).json({
        error: 'Either user_id or session_id is required'
      });
    }

    // Track the conversion
    const result = await trackAstrologyTestConversion(
      test_name,
      user_id,
      session_id,
      conversion_value
    );

    if (!result) {
      return res.status(404).json({
        error: 'Test not found or no variant assigned to user'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Conversion tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking mobile test conversion:', error);
    return res.status(500).json({
      error: 'Failed to track conversion'
    });
  }
};

/**
 * Track astrology feature usage from a mobile device
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const trackMobileAstrologyFeature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      feature_type,
      user_id,
      session_id,
      properties,
      device_info
    } = req.body;

    // Track different types of astrology features
    switch (feature_type) {
      case 'chart_generation':
        await trackChartGeneration(
          user_id,
          properties.chart_type,
          properties.business_id,
          properties.chart_data,
          properties.duration_ms
        );
        break;
        
      case 'horoscope_view':
        await trackHoroscopeView(
          user_id,
          properties.horoscope_type,
          properties.content_id
        );
        break;
        
      case 'business_forecast':
        await trackBusinessForecast(
          user_id,
          properties.business_id,
          properties.forecast_type,
          properties.timeframe,
          properties.duration_seconds
        );
        break;
        
      case 'free_tool':
        await trackFreeToolUsage(
          user_id,
          properties.tool_name,
          properties.input_data,
          properties.result,
          properties.duration_seconds
        );
        break;
        
      default:
        // For other feature types, track as a generic event
        await trackEvent(
          `${feature_type}_used`,
          EventCategory.FEATURE,
          EventAction.USE,
          properties,
          user_id,
          session_id,
          false,  // immediate
          undefined, // timestamp
          device_info
        );
    }

    return res.status(200).json({
      success: true,
      message: 'Feature usage tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking mobile astrology feature:', error);
    return res.status(500).json({
      error: 'Failed to track feature usage'
    });
  }
};

/**
 * Track user engagement metrics from a mobile device
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const trackMobileEngagement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      engagement_type,
      user_id,
      session_id,
      duration_seconds,
      properties,
      device_info
    } = req.body;

    // Track the engagement as an event
    await trackEvent(
      `${engagement_type}_engagement`,
      EventCategory.ENGAGEMENT,
      EventAction.ENGAGE,
      {
        duration_seconds,
        ...properties
      },
      user_id,
      session_id,
      false,  // immediate
      undefined, // timestamp
      device_info
    );

    return res.status(200).json({
      success: true,
      message: 'Engagement tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking mobile engagement:', error);
    return res.status(500).json({
      error: 'Failed to track engagement'
    });
  }
};

/**
 * Track app lifecycle events from a mobile device
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const trackAppLifecycle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      lifecycle_event,
      user_id,
      session_id,
      properties,
      device_info
    } = req.body;

    let eventAction: EventAction;
    
    // Map lifecycle events to event actions
    switch (lifecycle_event) {
      case 'app_start':
        eventAction = EventAction.START;
        break;
      case 'app_background':
        eventAction = EventAction.BACKGROUND;
        break;
      case 'app_foreground':
        eventAction = EventAction.FOREGROUND;
        break;
      case 'app_terminate':
        eventAction = EventAction.END;
        break;
      default:
        eventAction = EventAction.OTHER;
    }

    // Track the lifecycle event
    await trackEvent(
      lifecycle_event,
      EventCategory.SYSTEM,
      eventAction,
      properties,
      user_id,
      session_id,
      false,  // immediate
      undefined, // timestamp
      device_info
    );

    return res.status(200).json({
      success: true,
      message: 'App lifecycle event tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking app lifecycle event:', error);
    return res.status(500).json({
      error: 'Failed to track app lifecycle event'
    });
  }
};
