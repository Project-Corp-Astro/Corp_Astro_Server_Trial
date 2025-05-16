import express, { Request, Response } from 'express';
import { authenticateJWT, isAdmin } from '../../../middleware/authMiddleware';
import * as dashboardController from '../controllers/dashboardController';

const router = express.Router();

/**
 * Dashboard API Routes
 * These endpoints provide analytics data for the dashboard
 * All routes are protected by admin authentication
 */

/**
 * @route GET /api/analytics/dashboard/metrics
 * @desc Get overview metrics for the analytics dashboard
 * @access Private (admin only)
 */
router.get('/metrics', authenticateJWT, isAdmin, async (req: Request, res: Response) => {
  try {
    const metrics = await dashboardController.getOverviewMetrics(req, res);
    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch overview metrics' });
  }
});

/**
 * @route GET /api/analytics/dashboard/journeys
 * @desc Get user journey metrics
 * @access Private (admin only)
 */
router.get('/journeys', authenticateJWT, isAdmin, async (req: Request, res: Response) => {
  try {
    const journeyMetrics = await dashboardController.getUserJourneyMetrics(req, res);
    res.status(200).json(journeyMetrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user journey metrics' });
  }
});

/**
 * @route GET /api/analytics/dashboard/ab-tests/:testName
 * @desc Get A/B test results
 * @access Private (admin only)
 */
router.get('/ab-tests/:testName', authenticateJWT, isAdmin, async (req: Request, res: Response) => {
  try {
    const testResults = await dashboardController.getABTestResults(req, res);
    res.status(200).json(testResults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch A/B test results' });
  }
});

export default router;
