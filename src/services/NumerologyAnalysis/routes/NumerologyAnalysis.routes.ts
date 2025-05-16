import { 
  createAnalysis,
  getAllAnalysesForEntity,
  deleteAnalysis,
  getAnalysisById,
} from '../controler/numorology.analysis.controler';
import { Router, RequestHandler } from 'express';
const numerologyAnalysisRouter = Router();

// Route to create a numerology system
numerologyAnalysisRouter.post('/create', createAnalysis as unknown as RequestHandler);

// Route to get all numerology systems
numerologyAnalysisRouter.get('/', getAllAnalysesForEntity as unknown as RequestHandler);

// Route to get a numerology system by ID
numerologyAnalysisRouter.get('/:system_id', getAnalysisById as unknown as RequestHandler);

// Route to update a numerology system

// Route to delete a numerology system
numerologyAnalysisRouter.delete('/:system_id', deleteAnalysis as unknown as RequestHandler);

export default numerologyAnalysisRouter;
