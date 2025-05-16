// middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Redis from 'ioredis';

export interface JwtPayload {
  userId: string;
  role: 'user' | 'astro' | 'admin';
  subscriptionType?: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

const redis = new Redis(); // initialize your Redis client
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized: No token' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Check in Redis if token is still valid
    const storedToken = await redis.get(`auth_token:${decoded.userId}`);

    if (!storedToken || storedToken !== token) {
      return res.status(401).json({ message: 'Unauthorized: Session expired' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
