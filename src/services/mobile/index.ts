// src/services/mobile/index.ts

import { Application } from 'express';
import mobileRoutes from './routes/mobileRoutes';
import deviceDetection from './middleware/deviceDetection';
import responseOptimization from './middleware/responseOptimization';
import batchProcessing from './middleware/batchProcessing';
import mobileOfflineSupport from './middleware/offlineSupport';
import pushNotificationService from './utils/pushNotificationService';
import logger from '../../utils/logger';

/**
 * Mobile service configuration options
 */
export interface MobileServiceOptions {
  apiPrefix?: string;
  enableDeviceDetection?: boolean;
  enableResponseOptimization?: boolean;
  enableBatchProcessing?: boolean;
  enableOfflineSupport?: boolean;
}

/**
 * Default options for mobile service
 */
const defaultOptions: MobileServiceOptions = {
  apiPrefix: '/api/mobile',
  enableDeviceDetection: true,
  enableResponseOptimization: true,
  enableBatchProcessing: true,
  enableOfflineSupport: true,
};

/**
 * Initialize mobile service
 * @param app Express application
 * @param options Mobile service options
 */
export const initializeMobileService = (
  app: Application,
  options: MobileServiceOptions = {}
): void => {
  // Merge options with defaults
  const mergedOptions = { ...defaultOptions, ...options };
  
  logger.info('Initializing mobile service with options:', mergedOptions);
  
  // Apply global middleware if enabled
  if (mergedOptions.enableDeviceDetection) {
    logger.info('Enabling global device detection middleware');
    app.use(deviceDetection);
  }
  
  // Register mobile routes with the specified prefix
  app.use(mergedOptions.apiPrefix!, mobileRoutes);
  
  logger.info(`Mobile API routes registered at ${mergedOptions.apiPrefix}`);
  
  // Initialize push notification service
  try {
    // Just accessing the singleton instance will initialize it
    pushNotificationService;
    logger.info('Push notification service initialized');
  } catch (error) {
    logger.error('Failed to initialize push notification service:', error);
  }
};

// Export all mobile service components
export {
  deviceDetection,
  responseOptimization,
  batchProcessing,
  mobileOfflineSupport,
  pushNotificationService,
};

export default {
  initialize: initializeMobileService,
};
