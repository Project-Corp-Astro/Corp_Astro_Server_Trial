// middleware/checkRole.ts
import { AuthRequest } from './auth.middleware';
import { Response, NextFunction } from 'express';

export const checkRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied: Invalid role' });
    }
    next();
  };
};
