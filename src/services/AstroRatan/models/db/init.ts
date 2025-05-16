import sequelize from '../../../../config/sequelize.config';
import Message from '../../models/messages';
import Conversation from '../../models/conversations';

const syncModels = async () => {
  try {
    const isDev = false;
    // Set schema to public if not already set
    await Promise.all([
        Message.sync({ alter: isDev }),
        Conversation.sync({ alter: isDev }),
    ]);

    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Database synchronization failed:', error);
    throw error;
  }
};

const astroRatanmodelsync = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await syncModels();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

astroRatanmodelsync();
export default astroRatanmodelsync;
