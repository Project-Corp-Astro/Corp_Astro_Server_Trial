// routes/userRoutes.ts
import { RequestHandler, Router } from 'express';
import { insertChartType } from '../controllers/chartType.controler';
import { fetchNatalData } from '../controllers/natal_chart_controller';
import { fetchDerivedData } from '../controllers/derived_chart_controller';
import { fetchD2Chart } from '../controllers/derivedControllers/d2Chart';
import { fetchD3Chart } from '../controllers/derivedControllers/d3Chart';
import { fetchD4Chart } from '../controllers/derivedControllers/d4Chart';
import { fetchD7Chart } from '../controllers/derivedControllers/d7Chart';
import { fetchD9Chart } from '../controllers/derivedControllers/d9Chart';
import { fetchD10Chart } from '../controllers/derivedControllers/d10Chart';
import { fetchD12Chart } from '../controllers/derivedControllers/d12Chart';
import { fetchD16Chart } from '../controllers/derivedControllers/d16Chart';
import { fetchD24Chart } from '../controllers/derivedControllers/d24Chart';
import { fetchD40Chart } from '../controllers/derivedControllers/d40Chart';
import { fetchD45Chart } from '../controllers/derivedControllers/d45Chart';
import { fetchD60Chart } from '../controllers/derivedControllers/d60Chart';
import { fetchD20Chart } from '../controllers/derivedControllers/d20Chart';
import { fetchMoonChart } from '../controllers/derivedControllers/moonChart';
import { fetchSunChart } from '../controllers/derivedControllers/sunChart';
import { fetchTransitChart } from '../controllers/transit_controller';
import { fetchSripathiBhavaLagnaChart } from '../controllers/lagnaCharts/sripathiChart';
import { fetchBhavaLagnaChart } from '../controllers/lagnaCharts/BhavaLagna';
import { fetchKPLagnaChart } from '../controllers/lagnaCharts/KpLagna';
import { fetchArudhaBhavaLagnaChart } from '../controllers/lagnaCharts/arudhaLagna';
import { fetchEqualBhavaLagnaChart } from '../controllers/lagnaCharts/equalLagna';

const router = Router();

router.post('/insert',  insertChartType as unknown as RequestHandler);
router.post('/natal/:userId', fetchNatalData as unknown as RequestHandler);

router.get('/derived/:id', fetchDerivedData as unknown as RequestHandler);
router.get('/d2Chart/:id', fetchD2Chart as unknown as RequestHandler);
router.get('/d3Chart/:id', fetchD3Chart as unknown as RequestHandler);
router.get('/d4Chart/:id', fetchD4Chart as unknown as RequestHandler);
router.get('/d7Chart/:id', fetchD7Chart as unknown as RequestHandler);
router.get('/d9Chart/:id', fetchD9Chart as unknown as RequestHandler);
router.get('/d10Chart/:id', fetchD10Chart as unknown as RequestHandler);
router.get('/d12Chart/:id', fetchD12Chart as unknown as RequestHandler);
router.get('/d16Chart/:id', fetchD16Chart as unknown as RequestHandler);
router.get('/d20Chart/:id', fetchD20Chart as unknown as RequestHandler);
router.get('/d24Chart/:id', fetchD24Chart as unknown as RequestHandler);
router.get('/d40Chart/:id', fetchD40Chart as unknown as RequestHandler);
router.get('/d45Chart/:id', fetchD45Chart as unknown as RequestHandler);
router.get('/d60Chart/:id', fetchD60Chart as unknown as RequestHandler);
router.get('/moonChart/:id', fetchMoonChart as unknown as RequestHandler);
router.get('/sunChart/:id', fetchSunChart as unknown as RequestHandler);
router.get('/transit/:id', fetchTransitChart as unknown as RequestHandler);
router.get('/bhavaLagna/:id', fetchBhavaLagnaChart as unknown as RequestHandler);
router.get('/sripathi/:id', fetchSripathiBhavaLagnaChart as unknown as RequestHandler);
router.get('/kpLagna/:id', fetchKPLagnaChart as unknown as RequestHandler);
router.get('/arudha/:id', fetchArudhaBhavaLagnaChart as unknown as RequestHandler);
router.get('/equal/:id', fetchEqualBhavaLagnaChart as unknown as RequestHandler);

export default router;

