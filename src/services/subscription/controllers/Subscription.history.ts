import { Request, Response } from 'express';
import SubscriptionHistory from '../models/SubscriptionHistory';

// Get all subscription history
export const getAllSubscriptionHistory = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const history = await SubscriptionHistory.findAll();
    return res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription history',
      error: error.message
    });
  }
};

// Create a new entry in subscription history
export const createSubscriptionHistory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const history = await SubscriptionHistory.create(req.body);
    return res.status(201).json({ success: true, data: history });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create subscription history',
      error: error.message
    });
  }
};

// Get subscription history for a specific user
export const getUserSubscriptionHistory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const history = await SubscriptionHistory.findAll({ where: { user_id: req.params.user_id } });
    return res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user subscription history',
      error: error.message
    });
  }
};
