import { Router, RequestHandler } from 'express';
import numerologySystemRoutes from './routes/numerologySystemRoutes';
import numerologyAnalysisRouter from './routes/NumerologyAnalysis.routes';
import LoShuGridrouter from './routes/loSHuNumerology';
const numerologyRouter = Router();

numerologyRouter.use('/numerology-system', numerologySystemRoutes);
numerologyRouter.use('/numerology-analysis', numerologyAnalysisRouter);


numerologyRouter.use('/numerology-loshuGrid', LoShuGridrouter);

export default numerologyRouter;
