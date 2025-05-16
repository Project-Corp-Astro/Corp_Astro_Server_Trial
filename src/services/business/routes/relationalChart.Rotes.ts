//relationalChart.Rotes.ts
import express, { RequestHandler, Request, Response } from 'express';
import { fetchRelationalChart, insertSynastryChart, insertCompositeChart, updateRelationalChart } from '../controllers/relationalcontroler';

const router = express.Router();
//insert relational synastry chart by user id    
router.post('/insertSynastryChart', insertSynastryChart as unknown as RequestHandler);

//insert composite chart by user id 
router.post('/insertCompositeChart', insertCompositeChart as unknown as RequestHandler);

//fetch relational chart by user id and partner id and business id and chart type id    
router.get('/fetchRelationalChart', fetchRelationalChart as unknown as RequestHandler);


router.put('/updateRelationalChart', (async (req: Request, res: Response) => {
    const { id, type } = req.body;
  
    if (!id || !type) {
      return res.status(400).json({ error: 'id and type are required' });
    }
  
    try {
      await updateRelationalChart(id, type);
      res.status(200).json({ message: 'Relational chart updated successfully' });
    } catch (error) {
      console.error(`[ERROR] Failed to update relational chart:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }) as RequestHandler);
  

export default router;
