/**
 * Tools API Routes
 * 
 * Defines routes for the free tools offered by the Corp Astro mobile application,
 * including business name numerology analysis and tagline analysis.
 */

import express from 'express';
import toolsController from '../controllers/toolsController';

const router = express.Router();

// Free tools routes - no authentication required as these are free features
router.post('/numerology/business-name', toolsController.analyzeBusinessName);
router.post('/numerology/tagline', toolsController.analyzeTagline);
router.post('/numerology/compatibility', toolsController.checkNameTaglineCompatibility);

export default router;
