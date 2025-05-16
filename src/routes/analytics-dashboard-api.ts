/**
 * Analytics Dashboard API Routes
 * Endpoints for the Super Admin analytics dashboard
 */

import express, { Request, Response, NextFunction } from 'express';
import { query, param } from 'express-validator';
import { rateLimit } from '../middleware/rateLimit';
import { authenticate } from '../middleware/auth';
import { checkAdminRole } from '../middleware/roleCheck';
import {
  getOverviewMetrics,
  getUserEngagementMetrics,
  getFeatureUsageMetrics,
  getABTestMetrics,
  getUserJourneyMetrics,
  getRealTimeAnalytics
} from '../controllers/analyticsDashboardController';

const router = express.Router();

/**
 * Analytics Dashboard API Routes
 * These endpoints provide data for the Super Admin analytics dashboard
 * All routes require authentication and admin role
 */

// Apply rate limiting to all dashboard endpoints
const dashboardRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'Too many requests from this IP, please try again after a minute'
});

// Helper function to wrap controller methods to ensure proper Express routing
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Apply middleware to all routes
router.use(dashboardRateLimit);
router.use(authenticate);
router.use(checkAdminRole);

/**
 * @route GET /api/analytics/dashboard/overview
 * @desc Get overview metrics for the dashboard
 * @access Private (Admin only)
 */
router.get(
  '/overview',
  [
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date')
  ],
  asyncHandler(getOverviewMetrics)
);

/**
 * @route GET /api/analytics/dashboard/engagement
 * @desc Get user engagement metrics
 * @access Private (Admin only)
 */
router.get(
  '/engagement',
  [
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date')
  ],
  asyncHandler(getUserEngagementMetrics)
);

/**
 * @route GET /api/analytics/dashboard/features
 * @desc Get feature usage metrics
 * @access Private (Admin only)
 */
router.get(
  '/features',
  [
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
    query('category').optional().isString().withMessage('Category must be a string')
  ],
  asyncHandler(getFeatureUsageMetrics)
);

/**
 * @route GET /api/analytics/dashboard/abtests/:testName
 * @desc Get A/B test metrics for a specific test
 * @access Private (Admin only)
 */
router.get(
  '/abtests/:testName',
  [
    param('testName').notEmpty().withMessage('Test name is required'),
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date')
  ],
  asyncHandler(getABTestMetrics)
);

/**
 * @route GET /api/analytics/dashboard/journeys/:journeyName
 * @desc Get user journey metrics for a specific journey or all journeys
 * @access Private (Admin only)
 */
router.get(
  '/journeys/:journeyName',
  [
    param('journeyName').notEmpty().withMessage('Journey name is required'),
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date')
  ],
  asyncHandler(getUserJourneyMetrics)
);

/**
 * @route GET /api/analytics/dashboard/realtime
 * @desc Get real-time analytics data
 * @access Private (Admin only)
 */
router.get(
  '/realtime',
  asyncHandler(getRealTimeAnalytics)
);

export default router;
