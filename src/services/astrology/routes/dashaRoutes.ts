import { RequestHandler, Router } from 'express';
import {
  fetchAllDashaCharts,
  fetchDashaByUserId,
  fetchDashaByPlanet,
  fetchDashaPeriodsByUser,
  calculateVimshottariSookshamaDasha,
  dashaTypefetch,
  updateDashaChart,
} from '../controllers/dashacontroler';

const dashaRoutes = Router();

// Define routes for fetching Dasha data
dashaRoutes.post('/dasha/:id', calculateVimshottariSookshamaDasha as unknown as RequestHandler);  
dashaRoutes.get('/dasha', fetchAllDashaCharts as unknown as RequestHandler); // Get all Dasha charts
dashaRoutes.get('/dasha/:userId', fetchDashaByUserId as unknown as RequestHandler); // Get Dasha chart by user ID
dashaRoutes.get('/dasha/planet', fetchDashaByPlanet as unknown as RequestHandler); // Get Dasha charts filtered by planet (via query)
dashaRoutes.get('/dasha/:userId/periods', fetchDashaPeriodsByUser as unknown as RequestHandler); // Get Dasha periods for a user
dashaRoutes.get('/dasha/:userId/:dashaType', dashaTypefetch as unknown as RequestHandler); // Get Dasha periods for a user
dashaRoutes.put('/dasha/:userId', updateDashaChart as unknown as RequestHandler); // Update Dasha chart
export default dashaRoutes;
