import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connectRedis, redisClient } from "./config/redis.config";
import usermodelsync from "./services/user-management/models/db/inits";
import subscriptionRoutes from "./services/subscription/routes/subscriptionRoutes";
import swaggerSpec from "./config/swagger.config";
import { setupSwagger } from "./middleware/swagger";

import useroutes from "./services/user-management/index";
import { initializeDatabase } from "./config/database.init";
import { connectToMongo } from "./config/mongoconfig";
import chartRouter from "./services/astrology/index";
import businessRoutes from "./services/business/index";
import { setupdailyTransitCronJobs } from "./services/astrology/controllers/horoscopeControler/dailyTransistControler";
import { setupHoroscopeCronJob } from "./services/astrology/controllers/horoscopeControler/dailyHoroscope";
import numerologyRouter from "./services/NumerologyAnalysis/index";
import contentRoutes from "./services/content";
import { setupContentGenerationJobs } from "./services/content/utils/scheduledJobs";
import { logServiceStatus } from "./utils/logServiceStatus";
import logger from "./utils/logger";
import { requestLogger } from "./middleware/requestLogger";
import { applyPerformanceOptimizations } from "./services/performance";
import { errorHandler } from "./services/performance/utils/asyncHandler";
import { memoryManager } from "./services/performance/utils/memoryManager";
import DatabaseOptimizer from "./services/performance/utils/databaseOptimizer";
import { performanceMonitor } from "./services/performance/utils/performanceMonitor";
import OptimizedContentService from "./services/content/services/optimizedContentService";
import { seedDefaultTemplates } from "./services/content/utils/seedTemplates";
import { seedDefaultVariables } from "./services/content/utils/seedVariables";
import { seedSubscriptionTiers } from "./services/subscription/utils/seedSubscriptionTiers";
import scalabilityRouter, { initializeScalability, initializeConnectionPool } from "./services/scalability";

// Import mobile service
import mobileService from "./services/mobile";

const app = express();
const PORT = process.env.PORT || 3000;

// Make Redis client available to the entire application
app.set('redisClient', redisClient);

// Basic middleware setup
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
app.use(requestLogger); // ✅ Register request logger globally

// Apply performance optimizations
applyPerformanceOptimizations(app);

// Apply scalability middleware
app.use('/api/scalability', scalabilityRouter);

// We'll initialize the mobile service in the startServer function

const serviceStatus: Record<string, string> = {
  PostgreSQL: "Pending",
  MongoDB: "Pending",
  Redis: "Pending",
};

const startServer = async () => {
  try {
    // PostgreSQL
    const sequelize = await initializeDatabase();
    await usermodelsync();
    serviceStatus.PostgreSQL = "Connected";
    
    // Initialize database optimizer
    DatabaseOptimizer.initialize(sequelize);
    logger.info('✅ Database optimizer initialized');
    
    // Initialize connection pool manager for scalability
    initializeConnectionPool(sequelize);
    logger.info('✅ Connection pool manager initialized');

    // MongoDB
    await connectToMongo();
    serviceStatus.MongoDB = "Connected";

    // Redis
    await connectRedis();
    serviceStatus.Redis = "Connected";

    // Cron jobs
    setupdailyTransitCronJobs();
    setupHoroscopeCronJob();
    setupContentGenerationJobs();

    // Swagger and Routes
    setupSwagger(app);
    app.use("/api/usermanagement", useroutes);
    app.use("/api/astrology", chartRouter);
    app.use("/api/business", businessRoutes);
    app.use("/api/subscription", subscriptionRoutes);
    app.use("/api/numerology", numerologyRouter);
    app.use("/api/content", contentRoutes);
    
    // Initialize mobile service with options
    mobileService.initialize(app, {
      apiPrefix: '/api/mobile',
      enableDeviceDetection: true,
      enableResponseOptimization: true,
      enableBatchProcessing: true,
      enableOfflineSupport: true
    });
    logger.info('✅ Mobile service initialized');

    // Start memory monitoring
    memoryManager.startMonitoring();
    
    // Start performance monitoring
    performanceMonitor.startMonitoring();
    
    // Initialize scalability components
    await initializeScalability(app);
    logger.info('✅ Scalability components initialized');
    
    // Seed default content templates, variables, and subscription tiers if needed
    await seedDefaultTemplates();
    await seedDefaultVariables();
    await seedSubscriptionTiers();
    
    // Preload content templates for faster access
    await OptimizedContentService.preloadTemplates();
    
    // Register global error handler
    app.use(errorHandler);
    
    // Start server
    const server = app.listen(PORT, () => {
      logServiceStatus(serviceStatus, PORT);
      logger.info(`Server started on port ${PORT}`);
      logger.info(`✅ Performance optimizations applied`);
      
      // Log performance optimization status
      DatabaseOptimizer.checkHealth().then(dbHealth => {
        logger.info(`Database health: ${dbHealth.status} (${dbHealth.responseTime}ms)`);
      });
      
      DatabaseOptimizer.getStatistics().then(dbStats => {
        logger.info(`Database connection pool: ${dbStats.activeConnections}/${dbStats.connectionPoolSize} active connections`);
      });
      
      // Set up scheduled performance tasks
      setInterval(async () => {
        // Clear expired content periodically
        await OptimizedContentService.clearExpiredContent();
      }, 24 * 60 * 60 * 1000); // Run once per day
    });
    
    // Configure server timeouts
    server.timeout = 120000; // 2 minutes
    server.keepAliveTimeout = 65000; // 65 seconds
    server.headersTimeout = 66000; // 66 seconds (slightly more than keepAliveTimeout)

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    // implement logger   error
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();
export default app;
