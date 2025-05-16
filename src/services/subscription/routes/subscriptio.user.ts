import express, { RequestHandler } from 'express';

import {
  getUserSubscriptions,
  createUserSubscription,
  updateUserSubscription,
  deleteUserSubscription
} from "../../subscription/controllers/Subscription.user"


const subscroptionUser = express.Router();


// User Subscription Routes
subscroptionUser.get('/subscriptions', getUserSubscriptions as unknown as RequestHandler);
subscroptionUser.post('/subscriptions', createUserSubscription as unknown as RequestHandler);
subscroptionUser.put('/subscriptions/:subscription_id/status', updateUserSubscription as unknown as RequestHandler);
subscroptionUser.delete('/subscriptions/:subscription_id', deleteUserSubscription as unknown as RequestHandler);

export default subscroptionUser;
