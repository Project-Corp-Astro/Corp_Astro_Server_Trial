import { RequestHandler, Router, Request, Response } from 'express';
import { createProgressedChart, getProgressedChart, deleteProgressedChart, updateProgressedChartByUserId } from '../controllers/userProgressedChart.controler';

const progressedChartRouter = Router();

//create a route to create a new progressed chart
progressedChartRouter.post('/:user_id', createProgressedChart as unknown as RequestHandler);

//get a progressed chart
progressedChartRouter.get('/:user_id', getProgressedChart as unknown as RequestHandler);

//update a progressed chart function takes user_id as a parameter
progressedChartRouter.put('/:user_id', (async (req: Request, res: Response) => {
    const { user_id } = req.params;
  
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
  
    try {
      await updateProgressedChartByUserId(user_id);
      res.status(200).json({ message: 'Progressed chart updated successfully' });
    } catch (error) {
      console.error(`[ERROR]    Failed to update progressed chart:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }) as unknown as RequestHandler);

//delete a progressed chart
progressedChartRouter.delete('/:user_id', deleteProgressedChart as unknown as RequestHandler);

export default progressedChartRouter;
