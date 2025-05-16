import express, { RequestHandler } from 'express';

import {
    getAllSubscriptionPlans,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan
  } from "../../subscription/controllers/subscriptionplan.controller"

  const SubscriptionPlans = express.Router();
// Subscription Plan Routes
SubscriptionPlans.get('/plans', getAllSubscriptionPlans as unknown as RequestHandler);
SubscriptionPlans.post('/plans', createSubscriptionPlan as unknown as RequestHandler);
SubscriptionPlans.put('/plans/:plan_id', updateSubscriptionPlan as unknown as RequestHandler);
SubscriptionPlans.delete('/plans/:plan_id', deleteSubscriptionPlan as unknown as RequestHandler);
export default SubscriptionPlans;