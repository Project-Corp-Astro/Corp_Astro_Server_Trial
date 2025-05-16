//routes for subscription
import { Router } from 'express';
import subscroptionUser from './routes/subscriptio.user';
import SubscriptionPlans from './routes/subscription.plan.routes';
import subscriptionHistoryRoutes from './routes/subscription.History.routes';
import tierRoutes from './routes/tier.routes';
 
const subscriptionRoutes = Router();

subscriptionRoutes.use('/subscriptionPlan', SubscriptionPlans);
subscriptionRoutes.use('/subscroptionUser', subscroptionUser);
subscriptionRoutes.use('/subscriptionHistory', subscriptionHistoryRoutes);
subscriptionRoutes.use('/tiers', tierRoutes);

export default subscriptionRoutes;

