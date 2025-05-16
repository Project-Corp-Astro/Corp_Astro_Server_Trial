import dotenv from 'dotenv';
dotenv.config();

import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import path from 'path';
import fs from 'fs';

// Environment validation
const requiredEnvVars = ['NODE_ENV'];
const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Environment setup
const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

// Configuration with defaults
const config = {
  LOG_LEVEL: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  LOG_MAX_SIZE: process.env.LOG_MAX_SIZE || '10m',
  LOG_MAX_FILES: process.env.LOG_MAX_FILES || '14d',
  LOG_ENABLE_CONSOLE: process.env.LOG_ENABLE_CONSOLE !== 'false',
  LOG_DIR: process.env.LOG_DIR || 'logs',
  LOG_MAX_FILES_COUNT: parseInt(process.env.LOG_MAX_FILES_COUNT || '30', 10)
};

// Ensure log directory exists
try {
  if (!fs.existsSync(config.LOG_DIR)) {
    fs.mkdirSync(config.LOG_DIR, { recursive: true });
  }
} catch (error) {
  console.error('Failed to create log directory:', error);
  process.exit(1);
}

// Metadata
const requestId = uuidv4();
const hostname = os.hostname();
const serviceName = process.env.SERVICE_NAME || 'app';

// Sensitive data redaction
const redactFormat = format((info) => {
  const sensitiveKeys = ['password', 'token', 'authorization', 'api_key'];
  sensitiveKeys.forEach(key => {
    if (info[key]) {
      info[key] = '[REDACTED]';
    }
  });
  return info;
});

// Base log format
const baseFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.errors({ stack: true }),
  redactFormat(),
  format((info) => ({
    ...info,
    environment: env,
    hostname,
    requestId,
    service: serviceName
  }))()
);

// Development format
const devFormat = format.combine(
  baseFormat,
  format.colorize(),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level}] [${requestId}] ${message}${metaString}`;
  })
);

// Production format (JSON)
const prodFormat = format.combine(baseFormat, format.json());

// Common transport options
const commonFileOptions = {
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: config.LOG_MAX_SIZE,
  maxFiles: config.LOG_MAX_FILES,
  dirname: config.LOG_DIR,
  createSymlink: true,
  symlinkName: 'current.log'
};

// Logger transports
const transports: winston.transport[] = [
  new DailyRotateFile({
    ...commonFileOptions,
    filename: 'combined-%DATE%.log',
    level: config.LOG_LEVEL
  }),
  new DailyRotateFile({
    ...commonFileOptions,
    filename: 'error-%DATE%.log',
    level: 'error'
  })
];

// Add console transport in dev or if enabled explicitly
if (config.LOG_ENABLE_CONSOLE || !isProduction) {
  transports.push(
    new winston.transports.Console({
      level: isProduction ? 'info' : 'debug',
      format: isProduction ? prodFormat : devFormat,
      handleExceptions: true,
      handleRejections: true
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: isProduction ? prodFormat : devFormat,
  transports,
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(config.LOG_DIR, 'exceptions.log'),
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(config.LOG_DIR, 'rejections.log'),
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5
    })
  ],
  exitOnError: false
});

// For use in HTTP request logging
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};

// Log unhandled exceptions
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection at:', { reason });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error });
  if (!isProduction) {
    process.exit(1);
  }
});

export default logger;