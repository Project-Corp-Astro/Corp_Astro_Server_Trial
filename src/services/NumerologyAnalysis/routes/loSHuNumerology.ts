import express from 'express';
import { createLoShuGridAnalysis, getAllLoShuGridAnalysisByEntityId } from '../controler/LoShuGrid.Controlers';  // Assuming controller path
import { Router, RequestHandler } from 'express';

const LoShuGridrouter = Router();

// POST route to create Lo Shu Grid Analysis
LoShuGridrouter.post('/create', createLoShuGridAnalysis as unknown as RequestHandler);
LoShuGridrouter.get('/:entity_type/:entity_id', getAllLoShuGridAnalysisByEntityId as unknown as RequestHandler);

export default LoShuGridrouter;
