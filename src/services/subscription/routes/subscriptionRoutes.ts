// src/services/subscription/routes/subscriptionRoutes.ts

import { Router } from 'express';
import { body, param } from 'express-validator';
import subscriptionController from '../controllers/subscriptionController';
import { isAuthenticated } from '../../../middleware/auth';

const router = Router();

/**
 * @route GET /api/subscription/tiers
 * @desc Get all available subscription tiers
 * @access Public
 */
router.get('/tiers', subscriptionController.getSubscriptionTiers);

/**
 * @route GET /api/subscription/user
 * @desc Get a user's current subscription
 * @access Private
 */
router.get('/user', isAuthenticated, subscriptionController.getUserSubscription);

/**
 * @route POST /api/subscription/subscribe
 * @desc Subscribe to a tier
 * @access Private
 */
router.post(
  '/subscribe',
  isAuthenticated,
  [
    body('tierCode').notEmpty().withMessage('Tier code is required'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required'),
    body('transactionId').optional(),
  ],
  subscriptionController.subscribe
);

/**
 * @route POST /api/subscription/cancel
 * @desc Cancel a subscription
 * @access Private
 */
router.post('/cancel', isAuthenticated, subscriptionController.cancelSubscription);

/**
 * @route GET /api/subscription/access/:contentType
 * @desc Check if a user has access to a specific content type
 * @access Private
 */
router.get(
  '/access/:contentType',
  isAuthenticated,
  [
    param('contentType').notEmpty().withMessage('Content type is required'),
  ],
  subscriptionController.checkContentAccess
);

export default router;
