// routes/userRoutes.ts
import { RequestHandler, Router } from 'express';
import router from './routes/chart.routes';
import { fetchAllCharts } from './controllers/allcharts';
import dashaRoutes from './routes/dashaRoutes';
import dailyHoroscopeRoutes from './routes/dailyHoroscope';
const chartRouter = Router();

chartRouter.post('/charttypes', router as unknown as RequestHandler);
chartRouter.use('/natalchart', router);
chartRouter.use('/transitchart', router);
chartRouter.use('/deriedchart', router);
chartRouter.use('/dasha', dashaRoutes);
chartRouter.get('/allcharts/:id', fetchAllCharts as unknown as RequestHandler);
chartRouter.use('/dailyhoroscope', dailyHoroscopeRoutes);
chartRouter.use('/lagna', router);
export default chartRouter;
