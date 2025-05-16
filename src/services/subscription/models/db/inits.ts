import sequelize from '../../../../config/sequelize.config';
import SubscriptionPlan from '../subscription';
import UserSubscription from '../UserSubscription ';
import SubscriptionHistory from '../SubscriptionHistory';
import seedSubscriptionPlans from '../../utils/seedSubscriptionPlans';
import logger from '../../../../utils/logger';

const syncModels = async () => {
  const isDev = false; // toggle to true during development if you want to alter tables
  await Promise.all([
    SubscriptionPlan.sync({ alter: isDev }),
    UserSubscription.sync({ alter: isDev }),
    SubscriptionHistory.sync({ alter: isDev }),
  ]);
};

const subscriptionModelsync = async () => {
  await sequelize.authenticate();
  await syncModels();
  
  // Seed default subscription plans
  try {
    await seedSubscriptionPlans();
    logger.info('✅ Default subscription plans seeded successfully');
  } catch (error) {
    logger.error('❌ Error seeding subscription plans:', error);
    // Continue even if seeding fails, as this is not critical for the application to run
  }
};

export default subscriptionModelsync;
