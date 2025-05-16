// routes/userRoutes.ts
import { Router } from 'express';
import router from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

const useroutes = Router();

useroutes.use('/user', router);
useroutes.use('/auth', authRoutes);

export default useroutes;
