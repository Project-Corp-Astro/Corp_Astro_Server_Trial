// src/services/content/index.ts

import express from 'express';
import templateRoutes from './routes/templateRoutes';
import contentRoutes from './routes/contentRoutes';
import variableRoutes from './routes/variableRoutes';

const router = express.Router();

// Register routes
router.use('/templates', templateRoutes);
router.use('/variables', variableRoutes);
router.use('/generate', contentRoutes);

export default router;
