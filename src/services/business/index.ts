// Business Service Index

import { Router } from 'express';
import businessProfileRouter from './routes/business.routes';
import partnerRouter from './routes/partner.rotes';
import relationalChartRouter from './routes/relationalChart.Rotes';
import progressedChartRouter from './routes/UserProgressedChart.routes';
const businessRoutes = Router();

businessRoutes.use('/business', businessProfileRouter);
businessRoutes.use('/partner', partnerRouter);
businessRoutes.use('/relationalChart', relationalChartRouter);
businessRoutes.use('/progressedChart', progressedChartRouter);
export default businessRoutes;

// Business Service Index
