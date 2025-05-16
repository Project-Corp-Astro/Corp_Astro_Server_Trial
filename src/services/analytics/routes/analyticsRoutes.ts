import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { authenticateJWT, isAdmin } from '../../../middleware/authMiddleware';

const router = Router();

// Public routes - require only session ID
router.post('/events', analyticsController.trackSingleEvent);
router.post('/events/batch', analyticsController.trackBatchEvents);
router.post('/ui-interaction', analyticsController.trackUIInteraction);

// Routes that can use authentication if available
router.post('/feature-usage', analyticsController.trackFeatureUsage);
router.post('/ab-test/variant', analyticsController.getABTestVariant);
router.post('/ab-test/conversion', analyticsController.recordABTestConversion);

// Admin-only routes
router.get('/dashboard', authenticateJWT, isAdmin, analyticsController.getDashboardData);
router.post('/export', authenticateJWT, isAdmin, analyticsController.requestDataExport);

export default router;
