// src/services/content/utils/scheduledJobs.ts

import cron from 'node-cron';
import sequelize from '../../../config/sequelize.config';
import contentGenerator from './contentGenerator';
import logger from '../../../utils/logger';
import { QueryTypes } from 'sequelize';

// Define interfaces for query results
interface UserResult {
  user_id: string;
}

interface BusinessResult {
  business_id: string;
  user_id: string;
}

/**
 * Setup scheduled jobs for content generation
 */
export const setupContentGenerationJobs = (): void => {
  // Generate daily horoscopes at 1 AM every day
  cron.schedule('0 1 * * *', async () => {
    try {
      logger.info('Starting scheduled daily horoscope generation');
      
      // Get all active subscription users
      const activeUsers = await sequelize.query<UserResult>(
        `SELECT u.user_id 
         FROM users u
         JOIN subscriptions s ON u.user_id = s.user_id
         WHERE s.status = 'ACTIVE'
         AND s.plan_type IN ('subscription', 'premium')`,
        {
          type: QueryTypes.SELECT,
        }
      );
      
      logger.info(`Generating daily horoscopes for ${activeUsers.length} users`);
      
      // Generate horoscopes for each user
      for (const user of activeUsers) {
        try {
          await contentGenerator.generateDailyHoroscope(user.user_id);
          logger.debug(`Generated daily horoscope for user: ${user.user_id}`);
        } catch (error) {
          logger.error(`Error generating daily horoscope for user: ${user.user_id}`, { error });
          // Continue with next user
        }
      }
      
      logger.info('Completed scheduled daily horoscope generation');
    } catch (error) {
      logger.error('Error in scheduled daily horoscope generation', { error });
    }
  });
  
  // Generate monthly reports on the 1st of each month at 2 AM
  cron.schedule('0 2 1 * *', async () => {
    try {
      logger.info('Starting scheduled monthly report generation');
      
      // Get all premium subscription users
      const premiumUsers = await sequelize.query<UserResult>(
        `SELECT u.user_id 
         FROM users u
         JOIN subscriptions s ON u.user_id = s.user_id
         WHERE s.status = 'ACTIVE'
         AND s.plan_type = 'premium'`,
        {
          type: QueryTypes.SELECT,
        }
      );
      
      logger.info(`Generating monthly reports for ${premiumUsers.length} premium users`);
      
      // Generate monthly reports for each premium user
      for (const user of premiumUsers) {
        try {
          await contentGenerator.generateMonthlyReport(user.user_id);
          logger.debug(`Generated monthly report for user: ${user.user_id}`);
        } catch (error) {
          logger.error(`Error generating monthly report for user: ${user.user_id}`, { error });
          // Continue with next user
        }
      }
      
      logger.info('Completed scheduled monthly report generation');
    } catch (error) {
      logger.error('Error in scheduled monthly report generation', { error });
    }
  });
  
  // Generate weekly business insights every Monday at 3 AM
  cron.schedule('0 3 * * 1', async () => {
    try {
      logger.info('Starting scheduled business insight generation');
      
      // Get all businesses with active subscriptions
      const businesses = await sequelize.query<BusinessResult>(
        `SELECT bp.business_id, bp.user_id 
         FROM business_profiles bp
         JOIN users u ON bp.user_id = u.user_id
         JOIN subscriptions s ON u.user_id = s.user_id
         WHERE s.status = 'ACTIVE'
         AND s.plan_type IN ('subscription', 'premium')`,
        {
          type: QueryTypes.SELECT,
        }
      );
      
      logger.info(`Generating business insights for ${businesses.length} businesses`);
      
      // Generate insights for each business
      for (const business of businesses) {
        try {
          // Generate different types of business insights
          await contentGenerator.generateBusinessInsight(business.business_id, business.user_id, 'weekly_forecast');
          await contentGenerator.generateBusinessInsight(business.business_id, business.user_id, 'opportunity');
          
          logger.debug(`Generated business insights for business: ${business.business_id}`);
        } catch (error) {
          logger.error(`Error generating business insights for business: ${business.business_id}`, { error });
          // Continue with next business
        }
      }
      
      logger.info('Completed scheduled business insight generation');
    } catch (error) {
      logger.error('Error in scheduled business insight generation', { error });
    }
  });
  
  logger.info('Content generation scheduled jobs setup complete');
};

export default setupContentGenerationJobs;
