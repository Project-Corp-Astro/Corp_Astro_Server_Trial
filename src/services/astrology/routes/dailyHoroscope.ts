import { RequestHandler, Router } from 'express';
import { getHoroscopeBySignName } from '../controllers/horoscopeControler/dailyHoroscope';

const dailyHoroscopeRoutes = Router();

dailyHoroscopeRoutes.get('/horoscope/:signName', getHoroscopeBySignName as unknown as RequestHandler);

export default dailyHoroscopeRoutes;
