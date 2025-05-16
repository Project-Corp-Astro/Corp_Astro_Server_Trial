import { Sequelize } from 'sequelize';
import logger from '../utils/logger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get database configuration from environment variables
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
const dbName = process.env.DB_NAME || 'corpastro';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';

// Create Sequelize instance
const sequelizeOptions = {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 20,
    min: 5,
    acquire: 60000,
    idle: 10000,
  },
  // Add development environment options
  ...(process.env.NODE_ENV === 'development' && {
    // In development, we can use these options to make it more forgiving
    retry: {
      max: 3,
      match: [/SequelizeConnectionError/],
    },
  }),
};

// Create Sequelize instance
// @ts-ignore - Ignore TypeScript errors for Sequelize initialization
export const sequelize = new Sequelize(dbName, dbUser, dbPassword, sequelizeOptions);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection has been established successfully.');
    return true;
  } catch (error) {
    logger.error('❌ Unable to connect to the database:', error);
    
    // In development mode, we can continue without a database connection
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Running in development mode without database connection');
      return true;
    }
    
    return false;
  }
};

export default sequelize;
