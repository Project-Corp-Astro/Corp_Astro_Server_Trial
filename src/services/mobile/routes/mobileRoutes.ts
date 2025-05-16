// src/services/mobile/routes/mobileRoutes.ts

import express from 'express';
import mobileApiController from '../controllers/mobileApiController';
import deviceDetection from '../middleware/deviceDetection';
import responseOptimization from '../middleware/responseOptimization';
import batchProcessing from '../middleware/batchProcessing';
import mobileOfflineSupport from '../middleware/offlineSupport';
import { authenticate } from '../../../middleware/auth';
import { rateLimiter } from '../../performance/middleware/rateLimiter';

const router = express.Router();

// Apply device detection middleware to all mobile routes
router.use(deviceDetection);

// Apply response optimization middleware to all mobile routes
router.use(responseOptimization);

// Apply offline support middleware to sync endpoint
router.use('/sync', mobileOfflineSupport);

// Device registration routes
router.post('/device/register', 
  authenticate, 
  rateLimiter('mobile-api', 10), 
  mobileApiController.registerDevice
);

router.post('/device/unregister', 
  authenticate, 
  rateLimiter('mobile-api', 10), 
  mobileApiController.unregisterDevice
);

router.post('/device/settings', 
  authenticate, 
  rateLimiter('mobile-api', 10), 
  mobileApiController.updateDeviceSettings
);

// Configuration route
router.get('/config', 
  rateLimiter('mobile-api', 20), 
  mobileApiController.getMobileConfig
);

// User profile route
router.get('/profile', 
  authenticate, 
  rateLimiter('mobile-api', 20), 
  mobileApiController.getUserProfile
);

// Content routes
router.get('/content/:contentType', 
  authenticate, 
  rateLimiter('mobile-api', 30), 
  mobileApiController.getMobileContent
);

router.get('/content/:contentType/:contentId', 
  authenticate, 
  rateLimiter('mobile-api', 30), 
  mobileApiController.getMobileContent
);

// Business data route
router.get('/business/:businessId', 
  authenticate, 
  rateLimiter('mobile-api', 20), 
  mobileApiController.getBusinessData
);

// Batch processing endpoint
router.post('/batch', 
  authenticate, 
  rateLimiter('mobile-api', 5), 
  batchProcessing
);

export default router;
