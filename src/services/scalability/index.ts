// src/services/scalability/index.ts

import express from 'express';
import { createRateLimiter, createSpeedLimiter, circuitBreaker, requestPrioritization, applyScalabilityMiddleware } from './middleware/scalabilityMiddleware';
import monitoring from './utils/monitoring';
import connectionPoolManager from './utils/connectionPoolManager';
import cacheManager from './utils/cacheManager';
import taskQueue from './utils/taskQueue';
import clusterManager from './utils/clusterManager';
import loadBalancer from './utils/loadBalancer';
import dataShardingManager from './utils/dataSharding';
import logger from '../../utils/logger';

const router = express.Router();

// Apply scalability middleware
router.use(applyScalabilityMiddleware);

// Initialize all scalability components
export const initializeScalability = async (app: express.Application): Promise<void> => {
  try {
    logger.info('Initializing scalability components...');
    
    // Initialize cluster manager first (if enabled)
    await clusterManager.initialize();
    
    // Only continue with other initializations if this is the primary process
    // or if cluster mode is disabled
    if (!clusterManager.isClusterMode() || clusterManager.isPrimaryProcess()) {
      // Set up monitoring
      monitoring.setupScalabilityMonitoring();
      
      // Initialize cache manager
      cacheManager.initialize();
      
      // Initialize task queue
      taskQueue.initialize();
      
      // Initialize load balancer
      loadBalancer.initialize();
      
      // Initialize data sharding manager
      dataShardingManager.initialize();
      
      // Apply global rate limiting
      app.use(createRateLimiter());
      
      // Apply global speed limiting
      app.use(createSpeedLimiter());
      
      // Apply circuit breaker
      app.use(circuitBreaker);
      
      // Apply request prioritization
      app.use(requestPrioritization);
      
      logger.info('All scalability components initialized successfully');
    }
  } catch (error) {
    logger.error('Error initializing scalability components:', error);
    throw error;
  }
};

// Initialize database connection pool manager
export const initializeConnectionPool = (sequelize: any): void => {
  const poolManager = connectionPoolManager.getInstance(sequelize);
  poolManager.configurePool();
  poolManager.startMonitoring();
};

export {
  connectionPoolManager,
  cacheManager,
  taskQueue,
  clusterManager,
  loadBalancer,
  dataShardingManager,
};

export default router;
