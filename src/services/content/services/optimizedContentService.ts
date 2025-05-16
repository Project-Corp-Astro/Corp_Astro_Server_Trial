// src/services/content/services/optimizedContentService.ts

import GeneratedContent from '../models/GeneratedContent';
import ContentTemplate from '../models/ContentTemplate';
import { cacheManager } from '../../performance/utils/cacheManager';
import { QueryOptimizer } from '../../performance/utils/queryOptimizer';
import logger from '../../../utils/logger';
import moment from 'moment';

/**
 * Optimized content service that leverages caching and query optimization
 * for improved performance in content generation and retrieval
 */
export class OptimizedContentService {
  /**
   * Get cached content or generate new content if not available
   * @param userId User ID
   * @param businessId Business ID
   * @param contentType Content type (e.g., 'daily_horoscope', 'monthly_report')
   * @param generateFn Function to generate content if not cached
   * @returns Generated or cached content
   */
  static async getOrGenerateContent(
    userId: string,
    businessId: string,
    contentType: string,
    generateFn: () => Promise<string>
  ): Promise<{ content: string; fromCache: boolean }> {
    try {
      const cacheKey = `content:${contentType}:user:${userId}:business:${businessId}`;
      
      // Check if we have valid content in the database first
      const existingContent = await this.getValidContent(userId, businessId, contentType);
      
      if (existingContent) {
        // Update cache with the existing content for faster future retrievals
        await cacheManager.set(cacheKey, existingContent.content, 3600); // Cache for 1 hour
        return { content: existingContent.content, fromCache: true };
      }
      
      // If not in database, check Redis cache
      const cachedContent = await cacheManager.get<string>(cacheKey);
      if (cachedContent) {
        logger.debug(`Cache hit for ${contentType} content for user ${userId} and business ${businessId}`);
        return { content: cachedContent, fromCache: true };
      }
      
      // Generate new content
      logger.debug(`Generating new ${contentType} content for user ${userId} and business ${businessId}`);
      const content = await generateFn();
      
      // Cache the generated content
      await cacheManager.set(cacheKey, content, 3600); // Cache for 1 hour
      
      return { content, fromCache: false };
    } catch (error) {
      logger.error(`Error in getOrGenerateContent: ${error}`);
      throw error;
    }
  }
  
  /**
   * Get valid content from the database
   * @param userId User ID
   * @param businessId Business ID
   * @param contentType Content type
   * @returns Valid content or null if not found
   */
  static async getValidContent(
    userId: string,
    businessId: string,
    contentType: string
  ): Promise<GeneratedContent | null> {
    const now = new Date();
    
    // Use QueryOptimizer for better performance
    return await QueryOptimizer.findOne<GeneratedContent>(
      GeneratedContent,
      {
        where: {
          user_id: String(userId),
          business_id: businessId,
          content_type: contentType,
          valid_from: { $lte: now },
          valid_until: { $gte: now }
        },
        order: [['created_at', 'DESC']]
      },
      `db:content:valid:${contentType}:${userId}:${businessId}`,
      300 // Cache for 5 minutes
    );
  }
  
  /**
   * Save generated content to the database
   * @param userId User ID
   * @param businessId Business ID
   * @param contentType Content type
   * @param content Generated content
   * @param validFrom Valid from date
   * @param validUntil Valid until date
   * @returns Saved content
   */
  static async saveContent(
    userId: string,
    businessId: string,
    contentType: string,
    content: string,
    validFrom: Date,
    validUntil: Date
  ): Promise<GeneratedContent> {
    try {
      // Create new content record
      const newContent = await GeneratedContent.create({
        user_id: String(userId),
        business_id: businessId,
        content_type: contentType,
        content,
        valid_from: validFrom,
        valid_until: validUntil
      });
      
      // Invalidate related caches
      await cacheManager.invalidateEntity('content', contentType);
      
      return newContent;
    } catch (error) {
      logger.error(`Error saving content: ${error}`);
      throw error;
    }
  }
  
  /**
   * Get content template with caching
   * @param templateName Template name
   * @returns Content template
   */
  static async getTemplate(templateName: string): Promise<ContentTemplate | null> {
    const cacheKey = `template:${templateName}`;
    
    return await cacheManager.getOrSet<ContentTemplate | null>(
      cacheKey,
      async () => {
        return await ContentTemplate.findOne({
          where: { template_type: templateName, active: true }
        });
      },
      3600 // Cache for 1 hour
    );
  }
  
  /**
   * Preload frequently used templates into cache
   */
  static async preloadTemplates(): Promise<void> {
    try {
      logger.info('Preloading content templates into cache...');
      
      // Get common template types
      const templateTypes = [
        'daily_horoscope',
        'monthly_report',
        'business_insight',
        'compatibility_analysis'
      ];
      
      // Load each template type
      for (const templateType of templateTypes) {
        const templates = await ContentTemplate.findAll({
          where: { template_type: templateType, active: true }
        });
        
        // Cache each template
        for (const template of templates) {
          const cacheKey = `template:${template.template_type}`;
          await cacheManager.set(cacheKey, template, 3600); // Cache for 1 hour
        }
        
        logger.debug(`Preloaded ${templates.length} ${templateType} templates`);
      }
      
      logger.info('Content templates preloaded successfully');
    } catch (error) {
      logger.error(`Error preloading templates: ${error}`);
    }
  }
  
  /**
   * Calculate optimal cache TTL based on content type
   * @param contentType Content type
   * @returns Cache TTL in seconds
   */
  static getCacheTTL(contentType: string): number {
    // Set different cache durations based on content type
    if (contentType.includes('daily')) {
      return 60 * 60; // 1 hour for daily content
    } else if (contentType.includes('monthly')) {
      return 24 * 60 * 60; // 24 hours for monthly content
    } else if (contentType.includes('business')) {
      return 12 * 60 * 60; // 12 hours for business content
    } else {
      return 6 * 60 * 60; // 6 hours default
    }
  }
  
  /**
   * Clear expired content from the database
   */
  static async clearExpiredContent(): Promise<void> {
    try {
      const now = new Date();
      
      // Delete expired content older than 30 days
      const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
      
      const deletedCount = await GeneratedContent.destroy({
        where: {
          valid_until: { $lt: now },
          created_at: { $lt: thirtyDaysAgo }
        }
      });
      
      if (deletedCount > 0) {
        logger.info(`Cleared ${deletedCount} expired content items`);
      }
    } catch (error) {
      logger.error(`Error clearing expired content: ${error}`);
    }
  }
}

export default OptimizedContentService;
