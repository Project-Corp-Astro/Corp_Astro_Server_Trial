/**
 * Content Controller
 * 
 * Provides API endpoints for the mobile application to access content
 * such as daily horoscopes, monthly reports, and business forecasts.
 */

import { Request, Response } from 'express';
import contentService from '../services/content/contentService';
import logger from '../utils/logger';
import { validateUserId } from '../utils/validators';

/**
 * Controller for content endpoints
 */
export class ContentController {
  /**
   * Get daily horoscope for a user
   * @param req Express request
   * @param res Express response
   */
  public async getDailyHoroscope(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { date } = req.query;
      
      // Validate user ID
      if (!validateUserId(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
        return;
      }
      
      // Parse date if provided
      let targetDate: Date | undefined;
      if (date) {
        targetDate = new Date(date as string);
        if (isNaN(targetDate.getTime())) {
          res.status(400).json({
            success: false,
            message: 'Invalid date format'
          });
          return;
        }
      }
      
      // Get daily horoscope
      const horoscope = await contentService.getDailyHoroscope(userId, targetDate);
      
      res.status(200).json({
        success: true,
        data: horoscope
      });
    } catch (error) {
      logger.error('Error in getDailyHoroscope:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve daily horoscope',
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Get monthly report for a user
   * @param req Express request
   * @param res Express response
   */
  public async getMonthlyReport(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { year, month } = req.query;
      
      // Validate user ID
      if (!validateUserId(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
        return;
      }
      
      // Validate year and month
      if (!year || !month) {
        res.status(400).json({
          success: false,
          message: 'Year and month are required'
        });
        return;
      }
      
      const yearNum = parseInt(year as string);
      const monthNum = parseInt(month as string);
      
      if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        res.status(400).json({
          success: false,
          message: 'Invalid year or month format'
        });
        return;
      }
      
      // Get monthly report
      const report = await contentService.getMonthlyReport(userId, yearNum, monthNum);
      
      res.status(200).json({
        success: true,
        data: report
      });
    } catch (error) {
      logger.error('Error in getMonthlyReport:', error);
      
      // Handle subscription errors specifically
      if ((error as Error).message.includes('subscription')) {
        res.status(403).json({
          success: false,
          message: 'Subscription required',
          error: (error as Error).message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve monthly report',
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Get business forecast for a user's business
   * @param req Express request
   * @param res Express response
   */
  public async getBusinessForecast(req: Request, res: Response): Promise<void> {
    try {
      const { userId, businessId } = req.params;
      const { period } = req.query;
      
      // Validate user ID
      if (!validateUserId(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
        return;
      }
      
      // Validate period
      if (!period || !['daily', 'weekly', 'monthly', 'quarterly'].includes(period as string)) {
        res.status(400).json({
          success: false,
          message: 'Valid period is required (daily, weekly, monthly, quarterly)'
        });
        return;
      }
      
      // Get business forecast
      const forecast = await contentService.getBusinessForecast(
        userId, 
        businessId, 
        period as 'daily' | 'weekly' | 'monthly' | 'quarterly'
      );
      
      res.status(200).json({
        success: true,
        data: forecast
      });
    } catch (error) {
      logger.error('Error in getBusinessForecast:', error);
      
      // Handle subscription errors specifically
      if ((error as Error).message.includes('subscription')) {
        res.status(403).json({
          success: false,
          message: 'Subscription required',
          error: (error as Error).message
        });
        return;
      }
      
      // Handle business profile errors
      if ((error as Error).message.includes('Business profile')) {
        res.status(404).json({
          success: false,
          message: 'Business profile not found',
          error: (error as Error).message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve business forecast',
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Get favorite content items for a user
   * @param req Express request
   * @param res Express response
   */
  public async getFavoriteContent(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      // Validate user ID
      if (!validateUserId(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
        return;
      }
      
      // Get favorite content
      const favorites = await contentService.getFavoriteContent(userId);
      
      res.status(200).json({
        success: true,
        data: favorites
      });
    } catch (error) {
      logger.error('Error in getFavoriteContent:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve favorite content',
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Toggle favorite status for a content item
   * @param req Express request
   * @param res Express response
   */
  public async toggleFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { userId, contentId } = req.params;
      
      // Validate user ID
      if (!validateUserId(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
        return;
      }
      
      // Toggle favorite status
      const isFavorite = await contentService.toggleFavorite(userId, contentId);
      
      res.status(200).json({
        success: true,
        data: {
          contentId,
          favorite: isFavorite
        }
      });
    } catch (error) {
      logger.error('Error in toggleFavorite:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update favorite status',
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Rate a content item
   * @param req Express request
   * @param res Express response
   */
  public async rateContent(req: Request, res: Response): Promise<void> {
    try {
      const { userId, contentId } = req.params;
      const { rating } = req.body;
      
      // Validate user ID
      if (!validateUserId(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
        return;
      }
      
      // Validate rating
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        res.status(400).json({
          success: false,
          message: 'Rating must be a number between 1 and 5'
        });
        return;
      }
      
      // Rate content
      const userContent = await contentService.rateContent(userId, contentId, rating);
      
      res.status(200).json({
        success: true,
        data: {
          contentId,
          rating: userContent.user_rating
        }
      });
    } catch (error) {
      logger.error('Error in rateContent:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to rate content',
        error: (error as Error).message
      });
    }
  }
}

export default new ContentController();
