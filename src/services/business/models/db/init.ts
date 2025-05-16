import sequelize from '../../../../config/sequelize.config';
import BusinessProfile from '../businessProfile';
import BusinessPartner from '../business_partners';
import RelationshipChart from '../relationchart';
import UserProgressedChart from '../progressive_charts';
import logger from '../../../../utils/logger'; // Adjust path if needed

const syncModels = async () => {
  try {
    const isDev = false;
    await Promise.all([
      BusinessProfile.sync({ alter: isDev }),
      BusinessPartner.sync({ alter: isDev }),
      RelationshipChart.sync({ alter: isDev }),
      UserProgressedChart.sync({ alter: isDev }),
    ]);
    logger.info('Database synchronized successfully');
  } catch (error) {
    logger.error('Database synchronization failed:', error);
    throw error;
  }
};

const businessmodelsync = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connection has been established successfully.');
    await syncModels();
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
};

businessmodelsync();

export default businessmodelsync;
