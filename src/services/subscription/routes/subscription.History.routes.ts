//routes for subscription

import { RequestHandler, Router } from 'express';
import {
    getAllSubscriptionHistory,
    createSubscriptionHistory,
    getUserSubscriptionHistory
  } from "../../subscription/controllers/Subscription.history"
  
const subscriptionHistoryRoutes = Router();

subscriptionHistoryRoutes.get('/subscription-history', getAllSubscriptionHistory as unknown as RequestHandler);
subscriptionHistoryRoutes.post('/subscription-history', createSubscriptionHistory as unknown as RequestHandler);
subscriptionHistoryRoutes.get('/subscription-history/user/:user_id', getUserSubscriptionHistory as unknown as RequestHandler);

export default subscriptionHistoryRoutes;

