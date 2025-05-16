import { Router, RequestHandler } from 'express';
import { 
  createNumerologySystem, 
  getAllNumerologySystems, 
  getNumerologySystemById, 
  updateNumerologySystem, 
  deleteNumerologySystem 
} from '../controler/numerologySystemController';

const router = Router();

// Route to create a numerology system
router.post('/create', createNumerologySystem as unknown as RequestHandler);

// Route to get all numerology systems
router.get('/', getAllNumerologySystems as unknown as RequestHandler);

// Route to get a numerology system by ID
router.get('/:system_id', getNumerologySystemById as unknown as RequestHandler);

// Route to update a numerology system
router.put('/:system_id', updateNumerologySystem as unknown as RequestHandler);

// Route to delete a numerology system
router.delete('/:system_id', deleteNumerologySystem as unknown as RequestHandler);

export default router;
