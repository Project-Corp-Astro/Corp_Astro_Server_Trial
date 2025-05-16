// src/services/content/routes/contentRoutes.ts

import express from 'express';
import {
  generateDailyHoroscope,
  generateMonthlyReport,
  generateBusinessInsight,
  getUserContentHistory,
  getBusinessContentHistory,
  getContentById,
} from '../controllers/contentController';
import { isAuthenticated } from '../../../middleware/auth';
import { checkContentAccess } from '../../../middleware/subscriptionCheck';
import { ContentTypes } from '../../../config/constants';

const router = express.Router();

// User content routes
router.get('/horoscope/daily/:userId', isAuthenticated, checkContentAccess(ContentTypes.DAILY_HOROSCOPE), generateDailyHoroscope);
router.get('/report/monthly/:userId', isAuthenticated, checkContentAccess(ContentTypes.MONTHLY_REPORT), generateMonthlyReport);
router.get('/user/:userId/history', isAuthenticated, getUserContentHistory);

// Business content routes
router.get('/business/:businessId/insight', isAuthenticated, checkContentAccess(ContentTypes.BUSINESS_INSIGHT), generateBusinessInsight);
router.get('/business/:businessId/history', isAuthenticated, getBusinessContentHistory);

// General content routes
router.get('/:id', isAuthenticated, getContentById);

export default router;
