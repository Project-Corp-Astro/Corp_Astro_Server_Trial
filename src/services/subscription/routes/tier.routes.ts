// src/services/subscription/routes/tier.routes.ts

import { Router } from 'express';
import { 
  getAllTiers, 
  getTierDetails, 
  getCurrentUserTier, 
  checkFeatureAccess, 
  compareTiers 
} from '../controllers/tierController';
import { isAuthenticated } from '../../../middleware/auth';

const router = Router();

// Public routes
router.get('/all', getAllTiers);
router.get('/details/:tierType', getTierDetails);
router.get('/compare', compareTiers);

// Protected routes (require authentication)
router.get('/current', isAuthenticated, getCurrentUserTier);
router.get('/feature/:featureName', isAuthenticated, checkFeatureAccess);

export default router;
