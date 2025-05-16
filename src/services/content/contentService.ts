/**
 * Content Service
 * 
 * Handles the generation, retrieval, and management of content for the Corp Astro mobile application,
 * including daily horoscopes, monthly reports, and business forecasts.
 */

import { ContentItem, UserContent, BusinessProfile } from './models';
import { Op } from 'sequelize';
import sequelize from '../../config/sequelize.config';
import { UserSubscription } from '../subscription/models/UserSubscription';
import { SubscriptionTier } from '../subscription/models/SubscriptionTier';
import logger from '../../utils/logger';

/**
 * Content Service class for managing all content-related operations
 */
export class ContentService {
  /**
   * Get daily horoscope for a user
   * @param userId User ID
   * @param date Optional date, defaults to current date
   * @returns Promise resolving to the daily horoscope content
   */
  public async getDailyHoroscope(userId: string, date?: Date): Promise<any> {
    try {
      const targetDate = date || new Date();
      
      // Format date to YYYY-MM-DD for comparison
      const formattedDate = targetDate.toISOString().split('T')[0];
      
      // Check user's subscription tier
      const userSubscription = await UserSubscription.findOne({
        where: {
          user_id: userId,
          end_date: {
            [Op.gte]: new Date(),
          },
          payment_status: 'completed',
        },
        include: [
          {
            model: SubscriptionTier,
            as: 'subscriptionTier',
          },
        ],
      });
      
      // Default to free tier if no active subscription
      const tierCode = userSubscription?.subscriptionTier?.tier_code || 'free';
      
      // Find the daily horoscope for the user's subscription tier
      const horoscope = await ContentItem.findOne({
        where: {
          content_type: 'daily_horoscope',
          publish_date: {
            [Op.gte]: sequelize.literal(`DATE('${formattedDate}')`),
            [Op.lt]: sequelize.literal(`DATE('${formattedDate}') + INTERVAL '1 day'`),
          },
          subscription_tier_required: {
            [Op.in]: [tierCode, 'free'], // Include free tier content for all users
          },
          active: true,
        },
        order: [
          ['publish_date', 'DESC'],
        ],
      });
      
      if (!horoscope) {
        // If no horoscope found, generate a new one
        return this.generateDailyHoroscope(userId, targetDate);
      }
      
      // Record that the user has viewed this content
      await this.recordContentView(userId, horoscope.id);
      
      return {
        id: horoscope.id,
        title: horoscope.title,
        content: horoscope.content,
        publish_date: horoscope.publish_date,
        metadata: horoscope.metadata,
      };
    } catch (error) {
      logger.error('Error getting daily horoscope:', error);
      throw new Error('Failed to retrieve daily horoscope');
    }
  }
  
  /**
   * Get monthly report for a user
   * @param userId User ID
   * @param year Year for the report
   * @param month Month for the report (1-12)
   * @returns Promise resolving to the monthly report content
   */
  public async getMonthlyReport(userId: string, year: number, month: number): Promise<any> {
    try {
      // Check user's subscription tier
      const userSubscription = await UserSubscription.findOne({
        where: {
          user_id: userId,
          end_date: {
            [Op.gte]: new Date(),
          },
          payment_status: 'completed',
        },
        include: [
          {
            model: SubscriptionTier,
            as: 'subscriptionTier',
          },
        ],
      });
      
      // Monthly reports are only available for paid tiers
      if (!userSubscription || userSubscription.subscriptionTier?.tier_code === 'free') {
        throw new Error('Monthly reports require a paid subscription');
      }
      
      const tierCode = userSubscription.subscriptionTier?.tier_code;
      
      // Find the monthly report for the user's subscription tier
      const report = await ContentItem.findOne({
        where: {
          content_type: 'monthly_report',
          metadata: {
            year,
            month,
          },
          subscription_tier_required: tierCode,
          active: true,
        },
        order: [
          ['publish_date', 'DESC'],
        ],
      });
      
      if (!report) {
        // If no report found, generate a new one
        return this.generateMonthlyReport(userId, year, month);
      }
      
      // Record that the user has viewed this content
      await this.recordContentView(userId, report.id);
      
      return {
        id: report.id,
        title: report.title,
        content: report.content,
        publish_date: report.publish_date,
        metadata: report.metadata,
      };
    } catch (error) {
      logger.error('Error getting monthly report:', error);
      throw new Error('Failed to retrieve monthly report');
    }
  }
  
  /**
   * Get business forecast for a user's business
   * @param userId User ID
   * @param businessId Business ID
   * @param period Forecast period ('daily', 'weekly', 'monthly', 'quarterly')
   * @returns Promise resolving to the business forecast content
   */
  public async getBusinessForecast(userId: string, businessId: string, period: 'daily' | 'weekly' | 'monthly' | 'quarterly'): Promise<any> {
    try {
      // Check user's subscription tier
      const userSubscription = await UserSubscription.findOne({
        where: {
          user_id: userId,
          end_date: {
            [Op.gte]: new Date(),
          },
          payment_status: 'completed',
        },
        include: [
          {
            model: SubscriptionTier,
            as: 'subscriptionTier',
          },
        ],
      });
      
      // Business forecasts are only available for paid tiers
      if (!userSubscription || userSubscription.subscriptionTier?.tier_code === 'free') {
        throw new Error('Business forecasts require a paid subscription');
      }
      
      const tierCode = userSubscription.subscriptionTier?.tier_code;
      
      // Get the business profile
      const business = await BusinessProfile.findByPk(businessId);
      
      if (!business) {
        throw new Error('Business profile not found');
      }
      
      // Find the business forecast for the user's subscription tier
      const forecast = await ContentItem.findOne({
        where: {
          content_type: 'business_forecast',
          metadata: {
            business_id: businessId,
            period,
          },
          subscription_tier_required: tierCode,
          active: true,
        },
        order: [
          ['publish_date', 'DESC'],
        ],
      });
      
      if (!forecast) {
        // If no forecast found, generate a new one
        return this.generateBusinessForecast(userId, businessId, period);
      }
      
      // Record that the user has viewed this content
      await this.recordContentView(userId, forecast.id);
      
      return {
        id: forecast.id,
        title: forecast.title,
        content: forecast.content,
        publish_date: forecast.publish_date,
        metadata: forecast.metadata,
      };
    } catch (error) {
      logger.error('Error getting business forecast:', error);
      throw new Error('Failed to retrieve business forecast');
    }
  }
  
  /**
   * Record that a user has viewed a content item
   * @param userId User ID
   * @param contentId Content ID
   * @returns Promise resolving to the created or updated user content record
   */
  private async recordContentView(userId: string, contentId: string): Promise<UserContent> {
    try {
      // Check if the user has already viewed this content
      let userContent = await UserContent.findOne({
        where: {
          user_id: userId,
          content_id: contentId,
        },
      });
      
      if (userContent) {
        // Update the viewed_at timestamp
        userContent.viewed_at = new Date();
        await userContent.save();
        return userContent;
      }
      
      // Create a new user content record
      userContent = await UserContent.create({
        user_id: userId,
        content_id: contentId,
        viewed_at: new Date(),
        favorite: false,
      });
      
      return userContent;
    } catch (error) {
      logger.error('Error recording content view:', error);
      throw new Error('Failed to record content view');
    }
  }
  
  /**
   * Generate a daily horoscope for a user
   * @param userId User ID
   * @param date Date for the horoscope
   * @returns Promise resolving to the generated horoscope
   */
  private async generateDailyHoroscope(userId: string, date: Date): Promise<any> {
    try {
      // In a real implementation, this would call the Astro Engine to generate a horoscope
      // For now, we'll create a placeholder horoscope
      
      const formattedDate = date.toISOString().split('T')[0];
      
      // Check user's subscription tier
      const userSubscription = await UserSubscription.findOne({
        where: {
          user_id: userId,
          end_date: {
            [Op.gte]: new Date(),
          },
          payment_status: 'completed',
        },
        include: [
          {
            model: SubscriptionTier,
            as: 'subscriptionTier',
          },
        ],
      });
      
      // Default to free tier if no active subscription
      const tierCode = userSubscription?.subscriptionTier?.tier_code || 'free';
      
      // Create a new horoscope content item
      const horoscope = await ContentItem.create({
        content_type: 'daily_horoscope',
        title: `Daily Business Horoscope for ${formattedDate}`,
        content: `This is a placeholder for the daily horoscope for ${formattedDate}. In a real implementation, this would be generated by the Astro Engine based on the user's profile and astrological data.`,
        metadata: {
          date: formattedDate,
          user_id: userId,
        },
        publish_date: date,
        subscription_tier_required: tierCode,
        active: true,
      });
      
      // Record that the user has viewed this content
      await this.recordContentView(userId, horoscope.id);
      
      return {
        id: horoscope.id,
        title: horoscope.title,
        content: horoscope.content,
        publish_date: horoscope.publish_date,
        metadata: horoscope.metadata,
      };
    } catch (error) {
      logger.error('Error generating daily horoscope:', error);
      throw new Error('Failed to generate daily horoscope');
    }
  }
  
  /**
   * Generate a monthly report for a user
   * @param userId User ID
   * @param year Year for the report
   * @param month Month for the report (1-12)
   * @returns Promise resolving to the generated report
   */
  private async generateMonthlyReport(userId: string, year: number, month: number): Promise<any> {
    try {
      // In a real implementation, this would call the Astro Engine to generate a report
      // For now, we'll create a placeholder report
      
      // Check user's subscription tier
      const userSubscription = await UserSubscription.findOne({
        where: {
          user_id: userId,
          end_date: {
            [Op.gte]: new Date(),
          },
          payment_status: 'completed',
        },
        include: [
          {
            model: SubscriptionTier,
            as: 'subscriptionTier',
          },
        ],
      });
      
      // Monthly reports are only available for paid tiers
      if (!userSubscription || userSubscription.subscriptionTier?.tier_code === 'free') {
        throw new Error('Monthly reports require a paid subscription');
      }
      
      const tierCode = userSubscription.subscriptionTier?.tier_code;
      
      // Create a new report content item
      const report = await ContentItem.create({
        content_type: 'monthly_report',
        title: `Monthly Business Report for ${month}/${year}`,
        content: `This is a placeholder for the monthly report for ${month}/${year}. In a real implementation, this would be generated by the Astro Engine based on the user's profile and astrological data.`,
        metadata: {
          year,
          month,
          user_id: userId,
        },
        publish_date: new Date(year, month - 1, 1),
        subscription_tier_required: tierCode,
        active: true,
      });
      
      // Record that the user has viewed this content
      await this.recordContentView(userId, report.id);
      
      return {
        id: report.id,
        title: report.title,
        content: report.content,
        publish_date: report.publish_date,
        metadata: report.metadata,
      };
    } catch (error) {
      logger.error('Error generating monthly report:', error);
      throw new Error('Failed to generate monthly report');
    }
  }
  
  /**
   * Generate a business forecast for a user's business
   * @param userId User ID
   * @param businessId Business ID
   * @param period Forecast period ('daily', 'weekly', 'monthly', 'quarterly')
   * @returns Promise resolving to the generated forecast
   */
  private async generateBusinessForecast(userId: string, businessId: string, period: 'daily' | 'weekly' | 'monthly' | 'quarterly'): Promise<any> {
    try {
      // In a real implementation, this would call the Astro Engine to generate a forecast
      // For now, we'll create a placeholder forecast
      
      // Check user's subscription tier
      const userSubscription = await UserSubscription.findOne({
        where: {
          user_id: userId,
          end_date: {
            [Op.gte]: new Date(),
          },
          payment_status: 'completed',
        },
        include: [
          {
            model: SubscriptionTier,
            as: 'subscriptionTier',
          },
        ],
      });
      
      // Business forecasts are only available for paid tiers
      if (!userSubscription || userSubscription.subscriptionTier?.tier_code === 'free') {
        throw new Error('Business forecasts require a paid subscription');
      }
      
      const tierCode = userSubscription.subscriptionTier?.tier_code;
      
      // Get the business profile
      const business = await BusinessProfile.findByPk(businessId);
      
      if (!business) {
        throw new Error('Business profile not found');
      }
      
      // Create a new forecast content item
      const forecast = await ContentItem.create({
        content_type: 'business_forecast',
        title: `${period.charAt(0).toUpperCase() + period.slice(1)} Business Forecast for ${business.business_name}`,
        content: `This is a placeholder for the ${period} business forecast for ${business.business_name}. In a real implementation, this would be generated by the Astro Engine based on the business profile and astrological data.`,
        metadata: {
          business_id: businessId,
          period,
          user_id: userId,
        },
        publish_date: new Date(),
        subscription_tier_required: tierCode,
        active: true,
      });
      
      // Record that the user has viewed this content
      await this.recordContentView(userId, forecast.id);
      
      return {
        id: forecast.id,
        title: forecast.title,
        content: forecast.content,
        publish_date: forecast.publish_date,
        metadata: forecast.metadata,
      };
    } catch (error) {
      logger.error('Error generating business forecast:', error);
      throw new Error('Failed to generate business forecast');
    }
  }
  
  /**
   * Get favorite content items for a user
   * @param userId User ID
   * @returns Promise resolving to the user's favorite content items
   */
  public async getFavoriteContent(userId: string): Promise<any[]> {
    try {
      const favorites = await UserContent.findAll({
        where: {
          user_id: userId,
          favorite: true,
        },
        include: [
          {
            model: ContentItem,
            as: 'content',
          },
        ],
      });
      
      return favorites.map(favorite => ({
        id: favorite.content?.id,
        title: favorite.content?.title,
        content_type: favorite.content?.content_type,
        publish_date: favorite.content?.publish_date,
        viewed_at: favorite.viewed_at,
        user_rating: favorite.user_rating,
      }));
    } catch (error) {
      logger.error('Error getting favorite content:', error);
      throw new Error('Failed to retrieve favorite content');
    }
  }
  
  /**
   * Toggle favorite status for a content item
   * @param userId User ID
   * @param contentId Content ID
   * @returns Promise resolving to the updated favorite status
   */
  public async toggleFavorite(userId: string, contentId: string): Promise<boolean> {
    try {
      // Find the user content record
      let userContent = await UserContent.findOne({
        where: {
          user_id: userId,
          content_id: contentId,
        },
      });
      
      if (!userContent) {
        // Create a new user content record if it doesn't exist
        userContent = await UserContent.create({
          user_id: userId,
          content_id: contentId,
          favorite: true,
        });
        
        return true;
      }
      
      // Toggle the favorite status
      userContent.favorite = !userContent.favorite;
      await userContent.save();
      
      return userContent.favorite;
    } catch (error) {
      logger.error('Error toggling favorite status:', error);
      throw new Error('Failed to update favorite status');
    }
  }
  
  /**
   * Rate a content item
   * @param userId User ID
   * @param contentId Content ID
   * @param rating Rating (1-5)
   * @returns Promise resolving to the updated user content record
   */
  public async rateContent(userId: string, contentId: string, rating: number): Promise<UserContent> {
    try {
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }
      
      // Find the user content record
      let userContent = await UserContent.findOne({
        where: {
          user_id: userId,
          content_id: contentId,
        },
      });
      
      if (!userContent) {
        // Create a new user content record if it doesn't exist
        userContent = await UserContent.create({
          user_id: userId,
          content_id: contentId,
          user_rating: rating,
        });
        
        return userContent;
      }
      
      // Update the rating
      userContent.user_rating = rating;
      await userContent.save();
      
      return userContent;
    } catch (error) {
      logger.error('Error rating content:', error);
      throw new Error('Failed to rate content');
    }
  }
}

export default new ContentService();
