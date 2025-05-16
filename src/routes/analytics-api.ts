import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { 
  trackEvent, 
  trackFeatureUsage, 
  trackUIInteraction,
  batchProcessEvents
} from '../services/analytics/utils/analyticsService';
import { 
  trackChartGeneration,
  trackHoroscopeView,
  trackBusinessForecast,
  trackFreeToolUsage,
  trackSubscriptionChange,
  trackAstroRatanChat,
  getAstrologyFeatureAnalytics
} from '../services/analytics/utils/astrologyMetrics';
import {
  getAstrologyTestVariant,
  trackAstrologyTestConversion,
  getAstrologyTestResults
} from '../services/analytics/utils/astrologyABTests';
import { rateLimit } from '../middleware/rateLimit';

const router = express.Router();

/**
 * Analytics API Routes
 * These endpoints handle tracking events, feature usage, and A/B testing
 * for the Corp Astro application
 */

// Apply rate limiting to all analytics endpoints
// Allow 100 requests per minute per IP
const analyticsRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: 'Too many requests from this IP, please try again after a minute'
});

router.use(analyticsRateLimit);

/**
 * @route POST /api/analytics/events
 * @desc Track an analytics event
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/events',
  [
    body('event_name').notEmpty().withMessage('Event name is required'),
    body('event_category').notEmpty().withMessage('Event category is required'),
    body('event_action').notEmpty().withMessage('Event action is required'),
    body('properties').optional().isObject(),
    body('client_timestamp').optional().isISO8601().withMessage('Invalid timestamp format')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        event_name,
        event_category,
        event_action,
        properties,
        client_timestamp,
        user_id,
        session_id
      } = req.body;

      // Require either user_id or session_id
      if (!user_id && !session_id) {
        return res.status(400).json({
          error: 'Either user_id or session_id is required'
        });
      }

      // Track the event
      await trackEvent(
        event_name,
        event_category,
        event_action,
        properties || {},
        user_id || session_id,
        client_timestamp ? new Date(client_timestamp) : undefined
      );

      return res.status(200).json({
        success: true,
        message: 'Event tracked successfully'
      });
    } catch (error) {
      console.error('Error tracking event:', error);
      return res.status(500).json({
        error: 'Failed to track event'
      });
    }
  }
);

/**
 * @route POST /api/analytics/batch
 * @desc Process a batch of analytics events
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/batch',
  [
    body('events').isArray().withMessage('Events must be an array'),
    body('events.*.event_name').notEmpty().withMessage('Event name is required'),
    body('events.*.event_category').notEmpty().withMessage('Event category is required'),
    body('events.*.event_action').notEmpty().withMessage('Event action is required')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { events } = req.body;

      // Process the batch of events
      await batchProcessEvents(events);

      return res.status(200).json({
        success: true,
        message: 'Events batch processed successfully',
        count: events.length
      });
    } catch (error) {
      console.error('Error processing events batch:', error);
      return res.status(500).json({
        error: 'Failed to process events batch'
      });
    }
  }
);

/**
 * @route POST /api/analytics/feature-usage
 * @desc Track feature usage
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/feature-usage',
  [
    body('feature_name').notEmpty().withMessage('Feature name is required'),
    body('feature_category').notEmpty().withMessage('Feature category is required'),
    body('user_id').optional().isString(),
    body('session_id').optional().isString(),
    body('duration').optional().isNumeric(),
    body('result').optional().isString(),
    body('usage_data').optional().isObject()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        feature_name,
        feature_category,
        user_id,
        session_id,
        duration,
        result,
        usage_data
      } = req.body;

      // Require either user_id or session_id
      if (!user_id && !session_id) {
        return res.status(400).json({
          error: 'Either user_id or session_id is required'
        });
      }

      // Track feature usage
      await trackFeatureUsage(
        feature_name,
        feature_category,
        user_id || session_id,
        duration,
        result,
        usage_data
      );

      return res.status(200).json({
        success: true,
        message: 'Feature usage tracked successfully'
      });
    } catch (error) {
      console.error('Error tracking feature usage:', error);
      return res.status(500).json({
        error: 'Failed to track feature usage'
      });
    }
  }
);

/**
 * @route POST /api/analytics/ui-interaction
 * @desc Track UI interaction for heatmaps
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/ui-interaction',
  [
    body('coordinates').isObject().withMessage('Coordinates object is required'),
    body('coordinates.x').isNumeric().withMessage('X coordinate is required'),
    body('coordinates.y').isNumeric().withMessage('Y coordinate is required'),
    body('coordinates.pageWidth').isNumeric().withMessage('Page width is required'),
    body('coordinates.pageHeight').isNumeric().withMessage('Page height is required'),
    body('interaction_type').isString().withMessage('Interaction type is required'),
    body('user_id').optional().isString(),
    body('session_id').optional().isString(),
    body('page_url').notEmpty().withMessage('Page URL is required')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        coordinates,
        interaction_type,
        user_id,
        session_id,
        page_url
      } = req.body;

      // Require either user_id or session_id
      if (!user_id && !session_id) {
        return res.status(400).json({
          error: 'Either user_id or session_id is required'
        });
      }

      // Track UI interaction
      await trackUIInteraction(
        coordinates,
        interaction_type,
        page_url,
        user_id,
        session_id
      );

      return res.status(200).json({
        success: true,
        message: 'UI interaction tracked successfully'
      });
    } catch (error) {
      console.error('Error tracking UI interaction:', error);
      return res.status(500).json({
        error: 'Failed to track UI interaction'
      });
    }
  }
);

/**
 * @route POST /api/analytics/astrology/chart
 * @desc Track chart generation
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/astrology/chart',
  [
    body('user_id').optional().isString(),
    body('chart_type').isIn(['natal', 'transit', 'synastry', 'composite', 'progressed', 'dasha'])
      .withMessage('Valid chart type is required'),
    body('business_id').optional().isString(),
    body('generation_time').optional().isNumeric(),
    body('chart_data').optional().isObject()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        user_id,
        chart_type,
        business_id,
        generation_time,
        chart_data
      } = req.body;

      if (!user_id) {
        return res.status(400).json({
          error: 'User ID is required'
        });
      }

      // Track chart generation
      await trackChartGeneration(
        user_id,
        chart_type,
        business_id,
        generation_time,
        chart_data
      );

      return res.status(200).json({
        success: true,
        message: 'Chart generation tracked successfully'
      });
    } catch (error) {
      console.error('Error tracking chart generation:', error);
      return res.status(500).json({
        error: 'Failed to track chart generation'
      });
    }
  }
);

/**
 * @route POST /api/analytics/astrology/horoscope
 * @desc Track horoscope view
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/astrology/horoscope',
  [
    body('user_id').notEmpty().withMessage('User ID is required'),
    body('horoscope_type').isIn(['daily', 'weekly', 'monthly'])
      .withMessage('Valid horoscope type is required'),
    body('subscription_tier').isIn(['free', 'basic', 'pro', 'enterprise'])
      .withMessage('Valid subscription tier is required'),
    body('content_id').optional().isString()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        user_id,
        horoscope_type,
        subscription_tier,
        content_id
      } = req.body;

      // Track horoscope view
      await trackHoroscopeView(
        user_id,
        horoscope_type,
        subscription_tier,
        content_id
      );

      return res.status(200).json({
        success: true,
        message: 'Horoscope view tracked successfully'
      });
    } catch (error) {
      console.error('Error tracking horoscope view:', error);
      return res.status(500).json({
        error: 'Failed to track horoscope view'
      });
    }
  }
);

/**
 * @route POST /api/analytics/astrology/business-forecast
 * @desc Track business forecast view
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/astrology/business-forecast',
  [
    body('user_id').notEmpty().withMessage('User ID is required'),
    body('business_id').notEmpty().withMessage('Business ID is required'),
    body('forecast_type').isIn(['financial', 'strategic', 'team', 'general'])
      .withMessage('Valid forecast type is required'),
    body('forecast_period').isIn(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'])
      .withMessage('Valid forecast period is required'),
    body('content_id').optional().isString()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        user_id,
        business_id,
        forecast_type,
        forecast_period,
        content_id
      } = req.body;

      // Track business forecast view
      await trackBusinessForecast(
        user_id,
        business_id,
        forecast_type,
        forecast_period,
        content_id
      );

      return res.status(200).json({
        success: true,
        message: 'Business forecast view tracked successfully'
      });
    } catch (error) {
      console.error('Error tracking business forecast view:', error);
      return res.status(500).json({
        error: 'Failed to track business forecast view'
      });
    }
  }
);

/**
 * @route POST /api/analytics/astrology/free-tool
 * @desc Track free tool usage
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/astrology/free-tool',
  [
    body('user_id').notEmpty().withMessage('User ID is required'),
    body('tool_name').isIn(['name_analysis', 'tagline_analysis', 'color_analysis', 'logo_analysis'])
      .withMessage('Valid tool name is required'),
    body('input_data').optional().isObject(),
    body('result_data').optional().isObject(),
    body('usage_duration').optional().isNumeric()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        user_id,
        tool_name,
        input_data,
        result_data,
        usage_duration
      } = req.body;

      // Track free tool usage
      await trackFreeToolUsage(
        user_id,
        tool_name,
        input_data,
        result_data,
        usage_duration
      );

      return res.status(200).json({
        success: true,
        message: 'Free tool usage tracked successfully'
      });
    } catch (error) {
      console.error('Error tracking free tool usage:', error);
      return res.status(500).json({
        error: 'Failed to track free tool usage'
      });
    }
  }
);

/**
 * @route POST /api/analytics/astrology/subscription
 * @desc Track subscription change
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/astrology/subscription',
  [
    body('user_id').notEmpty().withMessage('User ID is required'),
    body('previous_tier').optional().isIn(['free', 'basic', 'pro', 'enterprise', null])
      .withMessage('Valid previous tier is required'),
    body('new_tier').isIn(['free', 'basic', 'pro', 'enterprise'])
      .withMessage('Valid new tier is required'),
    body('change_reason').optional().isIn(['new', 'upgrade', 'downgrade', 'renewal', 'cancellation'])
      .withMessage('Valid change reason is required')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        user_id,
        previous_tier,
        new_tier,
        change_reason
      } = req.body;

      // Track subscription change
      await trackSubscriptionChange(
        user_id,
        previous_tier,
        new_tier,
        change_reason
      );

      return res.status(200).json({
        success: true,
        message: 'Subscription change tracked successfully'
      });
    } catch (error) {
      console.error('Error tracking subscription change:', error);
      return res.status(500).json({
        error: 'Failed to track subscription change'
      });
    }
  }
);

/**
 * @route POST /api/analytics/astrology/ai-chat
 * @desc Track Astro Ratan AI chat interaction
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/astrology/ai-chat',
  [
    body('user_id').notEmpty().withMessage('User ID is required'),
    body('session_id').notEmpty().withMessage('Session ID is required'),
    body('message_count').isNumeric().withMessage('Message count is required'),
    body('topic_categories').optional().isArray(),
    body('satisfaction_score').optional().isFloat({ min: 0, max: 5 })
      .withMessage('Satisfaction score must be between 0 and 5')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        user_id,
        session_id,
        message_count,
        topic_categories,
        satisfaction_score
      } = req.body;

      // Track AI chat interaction
      await trackAstroRatanChat(
        user_id,
        session_id,
        message_count,
        topic_categories,
        satisfaction_score
      );

      return res.status(200).json({
        success: true,
        message: 'AI chat interaction tracked successfully'
      });
    } catch (error) {
      console.error('Error tracking AI chat interaction:', error);
      return res.status(500).json({
        error: 'Failed to track AI chat interaction'
      });
    }
  }
);

/**
 * @route GET /api/analytics/ab-test/variant
 * @desc Get A/B test variant for a user
 * @access Public (but requires valid session or user ID)
 */
router.get(
  '/ab-test/variant',
  [
    body('test_name').notEmpty().withMessage('Test name is required'),
    body('user_id').optional().isString(),
    body('session_id').optional().isString()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        test_name,
        user_id,
        session_id
      } = req.query as any;

      // Require either user_id or session_id
      if (!user_id && !session_id) {
        return res.status(400).json({
          error: 'Either user_id or session_id is required'
        });
      }

      // Get test variant
      const variant = await getAstrologyTestVariant(
        test_name,
        user_id as string,
        session_id as string
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
      console.error('Error getting test variant:', error);
      return res.status(500).json({
        error: 'Failed to get test variant'
      });
    }
  }
);

/**
 * @route POST /api/analytics/ab-test/conversion
 * @desc Track A/B test conversion
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/ab-test/conversion',
  [
    body('test_name').notEmpty().withMessage('Test name is required'),
    body('user_id').optional().isString(),
    body('session_id').optional().isString(),
    body('conversion_value').optional().isNumeric()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        test_name,
        user_id,
        session_id,
        conversion_value
      } = req.body;

      // Require either user_id or session_id
      if (!user_id && !session_id) {
        return res.status(400).json({
          error: 'Either user_id or session_id is required'
        });
      }

      // Track conversion
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
      console.error('Error tracking conversion:', error);
      return res.status(500).json({
        error: 'Failed to track conversion'
      });
    }
  }
);

/**
 * @route GET /api/analytics/ab-test/results/:testName
 * @desc Get A/B test results
 * @access Private (admin only)
 */
router.get(
  '/ab-test/results/:testName',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { testName } = req.params;

      // Check if user has admin privileges
      if (!(req as any).user.isAdmin) {
        return res.status(403).json({
          error: 'Unauthorized access to test results'
        });
      }

      // Get test results
      const results = await getAstrologyTestResults(testName);

      if (!results) {
        return res.status(404).json({
          error: 'Test not found'
        });
      }

      return res.status(200).json({
        success: true,
        results
      });
    } catch (error) {
      console.error('Error getting test results:', error);
      return res.status(500).json({
        error: 'Failed to get test results'
      });
    }
  }
);

/**
 * @route GET /api/analytics/metrics/astrology
 * @desc Get astrology feature analytics
 * @access Private (admin only)
 */
router.get(
  '/metrics/astrology',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      // Check if user has admin privileges
      if (!(req as any).user.isAdmin) {
        return res.status(403).json({
          error: 'Unauthorized access to analytics metrics'
        });
      }

      const { startDate, endDate, subscriptionTier } = req.query as any;

      // Validate date parameters
      if (!startDate || !endDate) {
        return res.status(400).json({
          error: 'Start date and end date are required'
        });
      }

      // Get astrology feature analytics
      const metrics = await getAstrologyFeatureAnalytics(
        new Date(startDate),
        new Date(endDate),
        subscriptionTier as any
      );

      return res.status(200).json({
        success: true,
        metrics
      });
    } catch (error) {
      console.error('Error getting astrology metrics:', error);
      return res.status(500).json({
        error: 'Failed to get astrology metrics'
      });
    }
  }
);

export default router;
