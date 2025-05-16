/**
 * Mobile Analytics API Routes
 * Endpoints for tracking analytics events from mobile applications
 */

import express, { Request, Response, NextFunction } from 'express';
import { body, ValidationChain } from 'express-validator';
import { rateLimit } from '../middleware/rateLimit';
import {
  processMobileEventBatch,
  trackMobileScreenView,
  getMobileTestVariant,
  trackMobileTestConversion,
  trackMobileAstrologyFeature,
  trackMobileEngagement,
  trackAppLifecycle
} from '../controllers/mobileAnalyticsController';

const router = express.Router();

/**
 * Mobile Analytics API Routes
 * These endpoints handle tracking events, feature usage, and A/B testing
 * for mobile applications
 */

// Apply rate limiting to all mobile analytics endpoints
// Allow 200 requests per minute per IP (mobile apps may send more events)
const mobileAnalyticsRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  message: 'Too many requests from this IP, please try again after a minute'
});

router.use(mobileAnalyticsRateLimit);

/**
 * @route POST /api/mobile-analytics/batch
 * @desc Process a batch of analytics events from mobile devices
 * @access Public (but requires valid session or user ID)
 */
// Helper function to wrap controller methods to ensure proper Express routing
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post(
  '/batch',
  [
    body('events').isArray().withMessage('Events must be an array'),
    body('events.*.event_name').notEmpty().withMessage('Event name is required'),
    body('events.*.event_category').notEmpty().withMessage('Event category is required'),
    body('events.*.event_action').notEmpty().withMessage('Event action is required'),
    body('sessionId').optional().isString(),
    body('deviceInfo').optional().isObject()
  ],
  asyncHandler(processMobileEventBatch)
);

/**
 * @route POST /api/mobile-analytics/screen-view
 * @desc Track a screen view from a mobile device
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/screen-view',
  [
    body('screen_name').notEmpty().withMessage('Screen name is required'),
    body('user_id').optional().isString(),
    body('session_id').optional().isString(),
    body('properties').optional().isObject(),
    body('device_info').optional().isObject()
  ],
  asyncHandler(trackMobileScreenView)
);

/**
 * @route POST /api/mobile-analytics/ab-test/variant
 * @desc Get A/B test variant for a mobile user
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/ab-test/variant',
  [
    body('test_name').notEmpty().withMessage('Test name is required'),
    body('user_id').optional().isString(),
    body('session_id').optional().isString()
  ],
  asyncHandler(getMobileTestVariant)
);

/**
 * @route POST /api/mobile-analytics/ab-test/conversion
 * @desc Track a conversion for an A/B test from a mobile device
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
  asyncHandler(trackMobileTestConversion)
);

/**
 * @route POST /api/mobile-analytics/astrology-feature
 * @desc Track astrology feature usage from a mobile device
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/astrology-feature',
  [
    body('feature_type').notEmpty().withMessage('Feature type is required'),
    body('user_id').optional().isString(),
    body('session_id').optional().isString(),
    body('properties').optional().isObject(),
    body('device_info').optional().isObject()
  ],
  asyncHandler(trackMobileAstrologyFeature)
);

/**
 * @route POST /api/mobile-analytics/engagement
 * @desc Track user engagement metrics from a mobile device
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/engagement',
  [
    body('engagement_type').notEmpty().withMessage('Engagement type is required'),
    body('user_id').optional().isString(),
    body('session_id').optional().isString(),
    body('duration_seconds').optional().isNumeric(),
    body('properties').optional().isObject(),
    body('device_info').optional().isObject()
  ],
  asyncHandler(trackMobileEngagement)
);

/**
 * @route POST /api/mobile-analytics/lifecycle
 * @desc Track app lifecycle events from a mobile device
 * @access Public (but requires valid session or user ID)
 */
router.post(
  '/lifecycle',
  [
    body('lifecycle_event').notEmpty().withMessage('Lifecycle event is required')
      .isIn(['app_start', 'app_background', 'app_foreground', 'app_terminate', 'app_crash'])
      .withMessage('Invalid lifecycle event'),
    body('user_id').optional().isString(),
    body('session_id').optional().isString(),
    body('properties').optional().isObject(),
    body('device_info').optional().isObject()
  ],
  asyncHandler(trackAppLifecycle)
);

export default router;
