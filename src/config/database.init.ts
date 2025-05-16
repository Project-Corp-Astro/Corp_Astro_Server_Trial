import logger from '../utils/logger';
import usermodelsync from '../services/user-management/models/db/inits';
import chartTypeSync from '../services/astrology/db/inits';
import businessmodelsync from '../services/business/models/db/init';
import defineAssociations from './postgres-relationships';
import subscriptionModelsync from '../services/subscription/models/db/inits';
import numerologysystemsync from '../services/NumerologyAnalysis/models/db/init';
import astroRatanmodelsync from '../services/AstroRatan/models/db/init';
import contentModelsSync from '../services/content/models/db/init';
import { Sequelize } from 'sequelize';
import { sequelize } from './sequelize.config';

export const initializeDatabase = async (): Promise<Sequelize> => {
  try {
    logger.info("🛠️ Initializing PostgreSQL schemas...");

    // Setup associations
    defineAssociations();

    // Sync models
    await usermodelsync();
    logger.info("✅ User management models synced.");

    await chartTypeSync();
    logger.info("✅ Astrology models synced.");

    await businessmodelsync();
    logger.info("✅ Business models synced.");

    await subscriptionModelsync();
    logger.info("✅ Subscription models synced.");

    await numerologysystemsync();
    logger.info("✅ Numerology models synced.");

    await astroRatanmodelsync();
    logger.info("✅ AstroRatan models synced.");

    await contentModelsSync();
    logger.info("✅ Content models synced.");

    logger.info("✅ All models synced successfully.");
    
    return sequelize;
  } catch (error) {
    logger.error("❌ Error initializing database:", error);
    throw error;
  }
};
