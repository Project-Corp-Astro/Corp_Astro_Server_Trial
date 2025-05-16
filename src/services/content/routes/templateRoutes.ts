// src/services/content/routes/templateRoutes.ts

import express from 'express';
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  searchTemplates,
} from '../controllers/templateController';
import { isAuthenticated, isAdmin } from '../../../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getTemplates);
router.get('/search', searchTemplates);
router.get('/:id', getTemplateById);

// Protected routes (admin only)
router.post('/', isAuthenticated, isAdmin, createTemplate);
router.put('/:id', isAuthenticated, isAdmin, updateTemplate);
router.delete('/:id', isAuthenticated, isAdmin, deleteTemplate);

export default router;
