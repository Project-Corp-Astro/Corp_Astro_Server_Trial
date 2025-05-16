import { Request, Response } from 'express';
import UserSubscription from '../models/UserSubscription ';
import SubscriptionPlan from '../models/subscription';
import SubscriptionHistory, { SubscriptionStatus } from '../models/SubscriptionHistory';
import { Op } from 'sequelize';
import moment from 'moment';
const validateUUID = require('uuid-validate');
import User from '../../user-management/models/user';

// Controller for getting subscriptions of a user
export const getUserSubscriptions = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  try {
    const subscriptions = await UserSubscription.findAll({
      where: { user_id },
      include: [{ model: SubscriptionPlan, as: 'plan' }],
    });
    return res.status(200).json(subscriptions);
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// Controller for creating a new user subscription
export const createUserSubscription = async (req: Request, res: Response) => {
  const { user_id, plan_id, billing_cycle, auto_renew, status, payment_method, payment_reference } = req.body;

  // 1. Validate the user_id format (UUID)
  if (!validateUUID(user_id)) {
    return res.status(400).json({ message: 'Invalid user_id format' });
  }

  try {
    // 2. Check if the user exists in the `users` table (Assuming `users` table exists and is connected to `UserSubscription` via `user_id`)
    const user = await User.findOne({ where: { user_id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 3. Check if the user already has an active subscription
    const existingSubscription = await UserSubscription.findOne({
      where: {
        user_id,
        status: 'active', // Only check for active subscriptions
      }
    });

    if (existingSubscription) {
      return res.status(400).json({ 
        message: 'User already has an active subscription', 
        existing_subscription: existingSubscription 
      });
    }

    // 4. Check if the subscription plan exists in the `subscription_plans` table
    const plan = await SubscriptionPlan.findByPk(plan_id);
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    // 5. Get the current date as the start date
    const start_date = moment().toDate();

    // 6. Calculate the end date based on the billing cycle (Monthly, Quarterly, Annually)
    let end_date: Date;
    switch (billing_cycle) {
      case 'monthly':
        end_date = moment(start_date).add(1, 'months').toDate();
        break;
      case 'quarterly':
        end_date = moment(start_date).add(3, 'months').toDate();
        break;
      case 'annually':
        end_date = moment(start_date).add(1, 'years').toDate();
        break;
      default:
        return res.status(400).json({ message: 'Invalid billing cycle' });
    }

    // 7. Create a new user subscription record
    const newSubscription = await UserSubscription.create({
      user_id,
      plan_id,
      start_date,
      end_date,
      billing_cycle,
      auto_renew,
      status,
      payment_method,
      payment_reference,
    });

    // 8. Create subscription history log
    await SubscriptionHistory.create({
      subscription_id: newSubscription.subscription_id,
      user_id,
      plan_id,
      start_date: newSubscription.start_date,
      end_date: newSubscription.end_date,
      status: newSubscription.status,
    });

    return res.status(201).json(newSubscription);
  } catch (error: any) {
    console.error('Error creating user subscription:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
// Controller for updating user subscription status
export const updateUserSubscription = async (req: Request, res: Response) => {
  const { subscription_id } = req.params;
  const { status, cancellation_date, cancellation_reason } = req.body;
  try {
    const subscription = await UserSubscription.findByPk(subscription_id);
    if (!subscription) {
      return res.status(404).json({ message: 'User subscription not found' });
    }

    // Save previous status before update
    const previousStatus = subscription.status;

    // Update subscription
    subscription.status = status;
    subscription.cancellation_date = cancellation_date;
    subscription.cancellation_reason = cancellation_reason;
    await subscription.save();

    // Log history of subscription status change if there is a change
    if (previousStatus !== status) {
      await SubscriptionHistory.create({
        subscription_id: subscription.subscription_id,
        user_id: subscription.user_id,
        plan_id: subscription.plan_id,
        start_date: subscription.start_date,
        end_date: subscription.end_date,
        status,
        cancellation_date,
        cancellation_reason,
      });
    }

    return res.status(200).json(subscription);
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller for deleting a user subscription
export const deleteUserSubscription = async (req: Request, res: Response) => {
  const { subscription_id } = req.params;
  try {
    const subscription = await UserSubscription.findByPk(subscription_id);
    if (!subscription) {
      return res.status(404).json({ message: 'User subscription not found' });
    }

    // Log the cancellation history before deleting
    await SubscriptionHistory.create({
      subscription_id: subscription.subscription_id,
      user_id: subscription.user_id,
      plan_id: subscription.plan_id,
      start_date: subscription.start_date,
      end_date: subscription.end_date,
      status: SubscriptionStatus.CANCELED,
      cancellation_date: new Date(),
      cancellation_reason: 'User requested cancellation',
    });

    // Delete the subscription
    await subscription.destroy();

    return res.status(200).json({ message: 'User subscription deleted successfully' });
  } catch (error) {
    console.error('Error deleting user subscription:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
