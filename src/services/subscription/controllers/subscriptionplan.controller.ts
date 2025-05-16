import { Request, Response } from 'express';
import SubscriptionPlan from '../models/subscription';

// Get all subscription plans
export const getAllSubscriptionPlans = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const plans = await SubscriptionPlan.findAll();
    return res.status(200).json({ success: true, data: plans });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription plans',
      error: error.message
    });
  }
};

// Create a new subscription plan
export const createSubscriptionPlan = async (req: Request, res: Response): Promise<Response> => {
  try {
    const plan = await SubscriptionPlan.create(req.body);
    return res.status(201).json({ success: true, data: plan });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create subscription plan',
      error: error.message
    });
  }
};

// Update a subscription plan
export const updateSubscriptionPlan = async (req: Request, res: Response): Promise<Response> => {
  try {
    const plan = await SubscriptionPlan.findByPk(req.params.plan_id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    await plan.update(req.body);
    return res.status(200).json({ success: true, data: plan });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update subscription plan',
      error: error.message
    });
  }
};

// Delete a subscription plan
export const deleteSubscriptionPlan = async (req: Request, res: Response): Promise<Response> => {
  try {
    const plan = await SubscriptionPlan.findByPk(req.params.plan_id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    await plan.destroy();
    return res.status(200).json({ success: true, message: 'Plan deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete subscription plan',
      error: error.message
    });
  }
};
