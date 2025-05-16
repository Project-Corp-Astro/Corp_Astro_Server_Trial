// src/services/content/utils/contentGenerator.ts

import axios from 'axios';
import logger from '../../../utils/logger';
import { AstroEngine, ASTRO_ENGINE_URL } from '../../../config/constants';
import { Op } from 'sequelize';
import ContentTemplate from '../models/ContentTemplate';
import ContentVariable from '../models/ContentVariable';
import GeneratedContent from '../models/GeneratedContent';
// Import UserProfile from the index file
import { UserProfile } from '../../user/models';
import BusinessProfile from '../../business/models/businessProfile';
import contentPersonalizer from './contentPersonalizer';
import { getCache, setCacheWithExpiry } from '../../../utils/redisHelper';

class ContentGenerator {
  /**
   * Generate content based on a template and astrological data
   */
  async generateContent(
    templateType: string,
    params: {
      userId?: string;
      businessId?: string;
      zodiacSign?: string;
      date?: Date;
      additionalData?: Record<string, any>;
    }
  ): Promise<string> {
    try {
      // Find appropriate template
      const template = await this.findTemplate(templateType, params.zodiacSign);
      
      if (!template) {
        throw new Error(`No template found for type: ${templateType} and sign: ${params.zodiacSign || 'any'}`);
      }
      
      // Get astrological data
      const astroData = await this.getAstrologicalData(params);
      
      // Combine additional data with astrological data
      const combinedData = {
        ...astroData,
        ...(params.additionalData || {}),
      };
      
      // Replace variables in template
      const content = await this.replaceVariables(template.template_content, template.variables, combinedData);
      
      // Store generated content if user or business ID is provided
      if (params.userId || params.businessId) {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        await GeneratedContent.create({
          user_id: params.userId,
          business_id: params.businessId,
          content_type: templateType,
          zodiac_sign: params.zodiacSign,
          content,
          astrological_data: astroData,
          valid_from: now,
          valid_until: tomorrow,
        });
      }
      
      return content;
    } catch (error) {
      logger.error(`Error generating content for template type: ${templateType}`, { error });
      throw error;
    }
  }

  /**
   * Generate daily horoscope for a user
   */
  async generateDailyHoroscope(userId: string, date?: Date): Promise<string> {
    try {
      // Get user profile from database
      const userProfile = await UserProfile.findOne({
        where: { user_id: userId },
      });
      
      if (!userProfile || !userProfile.zodiac_sign) {
        throw new Error(`No zodiac sign found for user: ${userId}`);
      }
      
      // Get personalization variables
      const personalVariables = await contentPersonalizer.getPersonalizationVariables(
        userId,
        'daily_horoscope'
      );
      
      // Generate content with personalized variables
      return this.generateContent('daily_horoscope', {
        userId,
        zodiacSign: userProfile.zodiac_sign,
        date: date || new Date(),
        additionalData: personalVariables,
      });
    } catch (error) {
      logger.error(`Error generating daily horoscope for user: ${userId}`, { error });
      throw error;
    }
  }

  /**
   * Generate monthly report for a user
   */
  async generateMonthlyReport(userId: string, month?: number, year?: number): Promise<string> {
    try {
      // Get user profile from database
      const userProfile = await UserProfile.findOne({
        where: { user_id: userId },
      });
      
      if (!userProfile || !userProfile.zodiac_sign) {
        throw new Error(`No zodiac sign found for user: ${userId}`);
      }
      
      // Set month and year if not provided
      const now = new Date();
      const reportMonth = month || now.getMonth() + 1;
      const reportYear = year || now.getFullYear();
      
      // Get personalization variables
      const personalVariables = await contentPersonalizer.getPersonalizationVariables(
        userId,
        'monthly_report'
      );
      
      // Generate content with personalized variables
      return this.generateContent('monthly_report', {
        userId,
        zodiacSign: userProfile.zodiac_sign,
        additionalData: {
          ...personalVariables,
          month: reportMonth,
          year: reportYear,
        },
      });
    } catch (error) {
      logger.error(`Error generating monthly report for user: ${userId}`, { error });
      throw error;
    }
  }

  /**
   * Generate business insight for a business
   */
  async generateBusinessInsight(businessId: string, userId: string, insightType: string): Promise<string> {
    try {
      // Get business profile from database
      const businessProfile = await BusinessProfile.findOne({
        where: { business_id: businessId },
      });
      
      if (!businessProfile) {
        throw new Error(`Business profile not found for business: ${businessId}`);
      }
      
      // Get personalization variables including business-specific data
      const personalVariables = await contentPersonalizer.getPersonalizationVariables(
        userId,
        'business_insight',
        businessId
      );
      
      // Generate content with personalized variables
      return this.generateContent(`business_${insightType}`, {
        businessId,
        userId,
        additionalData: personalVariables,
      });
    } catch (error) {
      logger.error(`Error generating business insight for business: ${businessId}`, { error });
      throw error;
    }
  }

  /**
   * Find appropriate template based on type and zodiac sign
   */
  private async findTemplate(templateType: string, zodiacSign?: string): Promise<ContentTemplate | null> {
    try {
      // Try to find a template specific to the zodiac sign
      if (zodiacSign) {
        const specificTemplate = await ContentTemplate.findOne({
          where: {
            template_type: templateType,
            zodiac_sign: zodiacSign,
            active: true,
          },
        });
        
        if (specificTemplate) {
          return specificTemplate;
        }
      }
      
      // Fall back to a generic template for the type
      return await ContentTemplate.findOne({
        where: {
          template_type: templateType,
          active: true,
          zodiac_sign: { [Op.is]: null },
        } as any, // Type assertion to bypass type checking for null comparison
      });
    } catch (error) {
      logger.error(`Error finding template for type: ${templateType} and sign: ${zodiacSign || 'any'}`, { error });
      throw error;
    }
  }

  /**
   * Replace variables in template with actual values
   */
  private async replaceVariables(
    template: string,
    variables: string[],
    data: Record<string, any>
  ): Promise<string> {
    try {
      let content = template;
      
      // Replace each variable in the template
      for (const variable of variables) {
        const placeholder = `{{${variable}}}`;
        
        if (content.includes(placeholder)) {
          // Check if value exists in data
          if (data[variable] !== undefined) {
            content = content.replace(new RegExp(placeholder, 'g'), data[variable]);
          } else {
            // Try to get value from content variables database
            const variableData = await this.getVariableValue(variable);
            
            if (variableData) {
              content = content.replace(new RegExp(placeholder, 'g'), variableData);
            } else {
              // If no value found, replace with empty string
              content = content.replace(new RegExp(placeholder, 'g'), '');
              logger.warn(`No value found for variable: ${variable}`);
            }
          }
        }
      }
      
      return content;
    } catch (error) {
      logger.error('Error replacing variables in template', { error });
      throw error;
    }
  }

  /**
   * Get variable value from database
   */
  private async getVariableValue(variableName: string): Promise<string | null> {
    try {
      const variable = await ContentVariable.findOne({
        where: {
          variable_name: variableName,
        },
      });
      
      if (!variable) {
        return null;
      }
      
      // If the variable has multiple possible values, select one randomly
      const values = variable.values as Record<string, string>;
      
      if (Array.isArray(values)) {
        const randomIndex = Math.floor(Math.random() * values.length);
        return values[randomIndex];
      } else if (typeof values === 'object') {
        // If it's an object, return a random key-value pair
        const keys = Object.keys(values);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return values[randomKey];
      } else {
        return String(values);
      }
    } catch (error) {
      logger.error(`Error getting value for variable: ${variableName}`, { error });
      return null;
    }
  }

  /**
   * Get astrological data from Astro Engine
   */
  private async getAstrologicalData(params: {
    userId?: string;
    businessId?: string;
    zodiacSign?: string;
    date?: Date;
  }): Promise<Record<string, any>> {
    try {
      // Use contentPersonalizer to get astrological data if userId or businessId is provided
      if (params.userId) {
        const astroData = await contentPersonalizer.getUserAstrologicalData(params.userId, params.date);
        return astroData || {};
      } else if (params.businessId) {
        const astroData = await contentPersonalizer.getBusinessAstrologicalData(params.businessId, params.date);
        return astroData || {};
      }
      
      // For generic zodiac sign requests, use the original implementation
      // Check if we have cached data
      const cacheKey = this.generateCacheKey(params);
      const cachedData = await getCache(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
      
      // No cached data, fetch from Astro Engine
      if (params.zodiacSign) {
        const response = await axios.post(`${ASTRO_ENGINE_URL}/calculate/zodiac`, {
          zodiacSign: params.zodiacSign,
          date: params.date ? params.date.toISOString() : new Date().toISOString(),
        });
        
        const astroData = response.data;
        
        // Cache the data for 1 hour
        await setCacheWithExpiry(cacheKey, astroData, 3600);
        
        return astroData;
      } else {
        throw new Error('No parameters provided for astrological data');
      }
    } catch (error) {
      logger.error('Error getting astrological data', { error, params });
      
      // Return empty object if we can't get astrological data
      return {};
    }
  }

  /**
   * Generate cache key for astrological data
   */
  private generateCacheKey(params: {
    userId?: string;
    businessId?: string;
    zodiacSign?: string;
    date?: Date;
  }): string {
    const date = params.date ? params.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    
    if (params.userId) {
      return `astro:user:${params.userId}:${date}`;
    } else if (params.businessId) {
      return `astro:business:${params.businessId}:${date}`;
    } else if (params.zodiacSign) {
      return `astro:zodiac:${params.zodiacSign}:${date}`;
    } else {
      return `astro:generic:${date}`;
    }
  }

  /**
   * Generate compatibility analysis between two businesses or a user and a business
   */
  async generateCompatibilityAnalysis(
    entityId1: string, 
    entityId2: string, 
    entityType1: 'user' | 'business', 
    entityType2: 'user' | 'business'
  ): Promise<string> {
    try {
      // Determine the primary user ID for personalization
      const userId = entityType1 === 'user' ? entityId1 : (entityType2 === 'user' ? entityId2 : null);
      
      if (!userId) {
        throw new Error('At least one entity must be a user for personalization');
      }
      
      // Get personalization variables
      const personalVariables = await contentPersonalizer.getPersonalizationVariables(
        userId,
        'compatibility_analysis',
        entityType1 === 'business' ? entityId1 : (entityType2 === 'business' ? entityId2 : undefined)
      );
      
      // Generate content with personalized variables
      return this.generateContent('compatibility_analysis', {
        userId,
        additionalData: {
          ...personalVariables,
          entityType1,
          entityType2,
          entityId1,
          entityId2,
        },
      });
    } catch (error) {
      logger.error(`Error generating compatibility analysis between ${entityType1}:${entityId1} and ${entityType2}:${entityId2}`, { error });
      throw error;
    }
  }
  
  /**
   * Generate name numerology analysis for a business name
   */
  async generateNameAnalysis(businessName: string, userId: string): Promise<string> {
    try {
      // Get personalization variables
      const personalVariables = await contentPersonalizer.getPersonalizationVariables(
        userId,
        'name_analysis'
      );
      
      // Calculate numerology value (simplified implementation)
      const numerologyValue = this.calculateNameNumerology(businessName);
      
      // Generate content with personalized variables
      return this.generateContent('name_analysis', {
        userId,
        additionalData: {
          ...personalVariables,
          businessName,
          numerologyValue,
        },
      });
    } catch (error) {
      logger.error(`Error generating name analysis for business name: ${businessName}`, { error });
      throw error;
    }
  }
  
  /**
   * Generate color analysis for a business brand color
   */
  async generateColorAnalysis(colorHex: string, userId: string): Promise<string> {
    try {
      // Get personalization variables
      const personalVariables = await contentPersonalizer.getPersonalizationVariables(
        userId,
        'color_analysis'
      );
      
      // Determine color name from hex (simplified implementation)
      const colorName = this.getColorNameFromHex(colorHex);
      
      // Generate content with personalized variables
      return this.generateContent('color_analysis', {
        userId,
        additionalData: {
          ...personalVariables,
          colorHex,
          colorName,
        },
      });
    } catch (error) {
      logger.error(`Error generating color analysis for color: ${colorHex}`, { error });
      throw error;
    }
  }
  
  /**
   * Calculate numerology value for a name (simplified implementation)
   */
  private calculateNameNumerology(name: string): number {
    // Remove spaces and convert to lowercase
    const processedName = name.replace(/\s+/g, '').toLowerCase();
    
    // Simple algorithm: sum of character codes modulo 9, or 9 if divisible by 9
    let sum = 0;
    for (let i = 0; i < processedName.length; i++) {
      sum += processedName.charCodeAt(i) % 9 || 9;
    }
    
    // Final reduction to a single digit
    const result = sum % 9 || 9;
    return result;
  }
  
  /**
   * Get color name from hex code (simplified implementation)
   */
  private getColorNameFromHex(hex: string): string {
    // Basic color mapping (would be more sophisticated in production)
    const colorMap: Record<string, string> = {
      '#ff0000': 'Red',
      '#00ff00': 'Green',
      '#0000ff': 'Blue',
      '#ffff00': 'Yellow',
      '#ff00ff': 'Purple',
      '#00ffff': 'Cyan',
      '#000000': 'Black',
      '#ffffff': 'White',
      '#ffa500': 'Orange',
      '#808080': 'Gray',
    };
    
    // Normalize hex code
    const normalizedHex = hex.toLowerCase();
    
    // Return color name if found, otherwise return 'Unknown'
    return colorMap[normalizedHex] || 'Unknown';
  }
}

export default new ContentGenerator();
