// src/services/content/routes/variableRoutes.ts

import express from 'express';
import {
  createVariable,
  getVariables,
  getVariableById,
  updateVariable,
  deleteVariable,
  getVariableByName,
} from '../controllers/variableController';
import { isAuthenticated, isAdmin } from '../../../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getVariables);
router.get('/:id', getVariableById);
router.get('/name/:name', getVariableByName);

// Protected routes (admin only)
router.post('/', isAuthenticated, isAdmin, createVariable);
router.put('/:id', isAuthenticated, isAdmin, updateVariable);
router.delete('/:id', isAuthenticated, isAdmin, deleteVariable);

export default router;
