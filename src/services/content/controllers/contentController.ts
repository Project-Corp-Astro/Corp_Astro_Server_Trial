// src/services/content/controllers/contentController.ts

import { Request, Response } from 'express';
import contentGenerator from '../utils/contentGenerator';
import GeneratedContent from '../models/GeneratedContent';
import moment from 'moment';
import tierService from '../../subscription/services/tierService';
import { SubscriptionTierType } from '../../subscription/constants/tiers';
import { AppError } from '../../performance/utils/asyncHandler';
import OptimizedContentService from '../services/optimizedContentService';
import { asyncHandler } from '../../performance/utils/asyncHandler';
import logger from '../../../utils/logger';

// Import the tier features type from the subscription constants
import { TierFeatures } from '../../subscription/constants/tiers';

// Define the feature type based on the keys of the TierFeatures object
type ContentFeatureType = keyof typeof TierFeatures[SubscriptionTierType.PREMIUM];

/**
 * Generate daily horoscope for a user
 */
export const generateDailyHoroscope = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { date } = req.query;

    // Check if user has access to daily horoscopes based on subscription tier
    const hasAccess = await tierService.hasFeatureAccess(userId, 'dailyHoroscope' as ContentFeatureType);
    if (!hasAccess) {
      throw new AppError('Your subscription plan does not include access to daily horoscopes', 403);
    }

    // Define start and end of day for content validity
    const now = new Date();
    const startOfDay = moment(now).startOf('day').toDate();
    const endOfDay = moment(now).endOf('day').toDate();

    // Use optimized content service to get or generate content
    const { content, fromCache } = await OptimizedContentService.getOrGenerateContent(
      String(userId),
      '', // Empty string instead of null for businessId
      'daily_horoscope',
      async () => {
        // This function is only called if content is not in cache or database
        logger.info(`Generating new daily horoscope for user ${userId}`);
        return await contentGenerator.generateDailyHoroscope(userId, date ? new Date(date as string) : undefined);
      }
    );

    // If content was newly generated (not from cache), save it to the database
    if (!fromCache) {
      await OptimizedContentService.saveContent(
        String(userId),
        '', // Empty string instead of null for businessId
        'daily_horoscope',
        content,
        startOfDay,
        endOfDay
      );
    }

    res.status(200).json({
      success: true,
      data: {
        content,
        generated_at: new Date(),
        valid_until: endOfDay,
        fromCache
      }
    });
  } catch (error) {
    logger.error(`Error generating daily horoscope for user: ${req.params.userId}`, { error });
    res.status(500).json({
      success: false,
      message: 'Failed to generate daily horoscope',
      error: (error as Error).message,
    });
  }
};

/**
 * Generate monthly report for a user
 */
export const generateMonthlyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { month, year } = req.query;

    // Check if user has access to monthly reports based on subscription tier
    const hasAccess = await tierService.hasFeatureAccess(userId, 'monthlyReport' as ContentFeatureType);
    if (!hasAccess) {
      throw new AppError('Your subscription plan does not include access to monthly reports', 403);
    }

    // Define start and end of month for content validity
    const now = new Date();
    const startOfMonth = moment(now).startOf('month').toDate();
    const endOfMonth = moment(now).endOf('month').toDate();

    // Use optimized content service to get or generate content
    const { content, fromCache } = await OptimizedContentService.getOrGenerateContent(
      String(userId),
      '', // Empty string instead of null for businessId
      'monthly_report',
      async () => {
        // This function is only called if content is not in cache or database
        logger.info(`Generating new monthly report for user ${userId}`);
        return await contentGenerator.generateMonthlyReport(
          userId, 
          month ? parseInt(month as string) : undefined, 
          year ? parseInt(year as string) : undefined
        );
      }
    );

    // If content was newly generated (not from cache), save it to the database
    if (!fromCache) {
      await OptimizedContentService.saveContent(
        String(userId),
        '', // Empty string instead of null for businessId
        'monthly_report',
        content,
        startOfMonth,
        endOfMonth
      );
    }

    res.status(200).json({
      success: true,
      data: {
        content,
        generated_at: new Date(),
        valid_until: endOfMonth,
        fromCache
      }
    });
  } catch (error) {
    logger.error(`Error generating monthly report for user: ${req.params.userId}`, { error });
    res.status(500).json({
      success: false,
      message: 'Failed to generate monthly report',
      error: (error as Error).message,
    });
  }
};

/**
 * Generate business insight for a specific business
 */
export const generateBusinessInsight = async (req: Request, res: Response): Promise<void> => {
  try {
    const { businessId } = req.params;
    const { insightType } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    if (!insightType || typeof insightType !== 'string') {
      throw new AppError('Insight type is required', 400);
    }

    // Check if user has access to business compatibility feature, which is needed for business insights
    const hasAccess = await tierService.hasFeatureAccess(userId, 'businessCompatibility');
    if (!hasAccess) {
      throw new AppError('Your subscription plan does not include access to business insights', 403);
    }

    // Determine validity period based on insight type
    const now = new Date();
    let validFrom = now;
    let validUntil: Date;

    if (insightType === 'long_term') {
      validUntil = moment(now).add(30, 'days').endOf('day').toDate();
    } else if (insightType === 'quarterly') {
      validUntil = moment(now).endOf('quarter').toDate();
    } else {
      validFrom = moment(now).startOf('week').toDate();
      validUntil = moment(now).endOf('week').toDate();
    }

    // Use optimized content service to get or generate content
    const { content, fromCache } = await OptimizedContentService.getOrGenerateContent(
      String(userId),
      businessId,
      `business_${insightType}`,
      async () => {
        // This function is only called if content is not in cache or database
        logger.info(`Generating new business insight (${insightType}) for business ${businessId}`);
        return await contentGenerator.generateBusinessInsight(businessId, userId, insightType);
      }
    );

    // If content was newly generated (not from cache), save it to the database
    if (!fromCache) {
      await OptimizedContentService.saveContent(
        String(userId),
        businessId,
        `business_${insightType}`,
        content,
        validFrom,
        validUntil
      );
    }

    res.status(200).json({
      success: true,
      data: {
        content,
        generated_at: new Date(),
        valid_until: validUntil,
        fromCache
      }
    });
  } catch (error) {
    logger.error(`Error generating business insight for business: ${req.params.businessId}`, { error });
    res.status(500).json({
      success: false,
      message: 'Failed to generate business insight',
      error: (error as Error).message,
    });
  }
};

/**
 * Get user's content history
 */
export const getUserContentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { contentType, limit, offset } = req.query;

    // Build query
    const whereClause: any = {
      user_id: userId,
    };

    if (contentType) {
      whereClause.content_type = contentType;
    }

    // Get content history
    const contentHistory = await GeneratedContent.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: limit ? parseInt(limit as string) : 10,
      offset: offset ? parseInt(offset as string) : 0,
    });

    res.status(200).json({
      success: true,
      count: contentHistory.length,
      data: contentHistory,
    });
  } catch (error) {
    logger.error(`Error getting content history for user: ${req.params.userId}`, { error });
    res.status(500).json({
      success: false,
      message: 'Failed to get content history',
      error: (error as Error).message,
    });
  }
};

/**
 * Get business content history
 */
export const getBusinessContentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { businessId } = req.params;
    const { contentType, limit, offset } = req.query;

    // Build query
    const whereClause: any = {
      business_id: businessId,
    };

    if (contentType) {
      whereClause.content_type = contentType;
    }

    // Get content history
    const contentHistory = await GeneratedContent.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: limit ? parseInt(limit as string) : 10,
      offset: offset ? parseInt(offset as string) : 0,
    });

    res.status(200).json({
      success: true,
      count: contentHistory.length,
      data: contentHistory,
    });
  } catch (error) {
    logger.error(`Error getting content history for business: ${req.params.businessId}`, { error });
    res.status(500).json({
      success: false,
      message: 'Failed to get content history',
      error: (error as Error).message,
    });
  }
};

/**
 * Get content by ID
 */
export const getContentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const content = await GeneratedContent.findByPk(id);

    if (!content) {
      res.status(404).json({
        success: false,
        message: `Content not found with id: ${id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    logger.error(`Error getting content with id: ${req.params.id}`, { error });
    res.status(500).json({
      success: false,
      message: 'Failed to get content',
      error: (error as Error).message,
    });
  }
};
