import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const maskSensitiveData = (data: any) => {
  if (data === undefined || data === null) return data;

  let cloned;

  try {
    cloned = JSON.parse(JSON.stringify(data)); // Deep clone
  } catch (err) {
    return data; // If not serializable, return as-is
  }

  const sensitiveKeys = ['token', 'accessToken', 'password', 'secret'];

  const mask = (obj: any) => {
    if (!obj || typeof obj !== 'object') return;

    for (const key in obj) {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        obj[key] = '****';
      } else if (typeof obj[key] === 'object') {
        mask(obj[key]); // Recursively mask
      }
    }
  };

  mask(cloned);
  return cloned;
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const safeHeaders = maskSensitiveData(req.headers || {});
  const safeBody = maskSensitiveData(req.body || {});
  const safeQuery = maskSensitiveData(req.query || {});

  const logDetails = {
    method: req.method,
    url: req.originalUrl,
    headers: safeHeaders,
    body: safeBody,
    query: safeQuery,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  };

  logger.info(`[Request]`, logDetails);

  next();
};
