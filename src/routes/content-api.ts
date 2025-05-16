/**
 * Content API Routes
 * 
 * Defines routes for the mobile application to access content
 * such as daily horoscopes, monthly reports, and business forecasts.
 */

import express from 'express';
import contentController from '../controllers/contentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Authentication middleware for all content API routes
router.use(authenticateToken);

// Daily horoscope routes
router.get('/horoscope/:userId', contentController.getDailyHoroscope);

// Monthly report routes
router.get('/report/:userId', contentController.getMonthlyReport);

// Business forecast routes
router.get('/forecast/:userId/:businessId', contentController.getBusinessForecast);

// Favorite content routes
router.get('/favorites/:userId', contentController.getFavoriteContent);
router.post('/favorites/:userId/:contentId', contentController.toggleFavorite);

// Content rating routes
router.post('/rate/:userId/:contentId', contentController.rateContent);

export default router;
