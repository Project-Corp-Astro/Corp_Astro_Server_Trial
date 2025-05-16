// middleware/checkSubscription.ts
import { AuthRequest } from './auth.middleware';
import { Response, NextFunction } from 'express';

export const checkSubscription = (allowedTypes: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !user.subscriptionType || !allowedTypes.includes(user.subscriptionType)) {
      return res.status(403).json({ message: 'Access denied: Invalid subscription' });
    }
    next();
  };
};
