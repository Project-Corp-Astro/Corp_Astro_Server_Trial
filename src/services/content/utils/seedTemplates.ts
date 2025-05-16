// src/services/content/utils/seedTemplates.ts

import ContentTemplate from '../models/ContentTemplate';
import { defaultTemplates, ContentTemplateData } from '../data/defaultTemplates';
import logger from '../../../utils/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Seed default content templates into the database
 * This ensures that the content generation system has templates to work with
 */
export const seedDefaultTemplates = async (): Promise<void> => {
  try {
    logger.info('Seeding default content templates...');
    
    // Count existing templates
    const existingCount = await ContentTemplate.count();
    logger.info(`Found ${existingCount} existing templates in the database`);
    
    // Only seed if no templates exist
    if (existingCount === 0) {
      logger.info('No templates found. Seeding default templates...');
      
      // Create templates
      for (const template of defaultTemplates) {
        await ContentTemplate.create({
          id: uuidv4(),
          template_type: template.template_type,
          zodiac_sign: template.zodiac_sign === null ? undefined : template.zodiac_sign,
          planet: template.planet === null ? undefined : template.planet,
          house: template.house === null ? undefined : template.house,
          aspect: template.aspect === null ? undefined : template.aspect,
          template_content: template.template_content,
          variables: template.variables,
          tags: template.tags || [],
          active: template.active,
        });
      }
      
      logger.info(`Successfully seeded ${defaultTemplates.length} default templates`);
    } else {
      logger.info('Templates already exist. Skipping seed process.');
    }
  } catch (error) {
    logger.error('Error seeding default templates:', error);
    throw error;
  }
};

/**
 * Check if a specific template type exists, and create it if not
 * @param templateType Template type to check
 * @param zodiacSign Optional zodiac sign for the template
 */
export const ensureTemplateExists = async (
  templateType: string,
  zodiacSign?: string
): Promise<void> => {
  try {
    // Build query
    const whereClause: any = {
      template_type: templateType,
      active: true,
    };
    
    if (zodiacSign) {
      whereClause.zodiac_sign = zodiacSign;
    } else {
      whereClause.zodiac_sign = null;
    }
    
    // Check if template exists
    const existingTemplate = await ContentTemplate.findOne({
      where: whereClause,
    });
    
    // If template doesn't exist, create it from defaults
    if (!existingTemplate) {
      logger.info(`Template not found for type: ${templateType} and sign: ${zodiacSign || 'generic'}. Creating from defaults...`);
      
      // Find matching default template
      const defaultTemplate = defaultTemplates.find(t => 
        t.template_type === templateType && 
        (zodiacSign ? t.zodiac_sign === zodiacSign : t.zodiac_sign === null)
      );
      
      if (defaultTemplate) {
        await ContentTemplate.create({
          id: uuidv4(),
          template_type: defaultTemplate.template_type,
          zodiac_sign: defaultTemplate.zodiac_sign === null ? undefined : defaultTemplate.zodiac_sign,
          planet: defaultTemplate.planet === null ? undefined : defaultTemplate.planet,
          house: defaultTemplate.house === null ? undefined : defaultTemplate.house,
          aspect: defaultTemplate.aspect === null ? undefined : defaultTemplate.aspect,
          template_content: defaultTemplate.template_content,
          variables: defaultTemplate.variables,
          tags: defaultTemplate.tags || [],
          active: defaultTemplate.active,
        });
        
        logger.info(`Created template for type: ${templateType} and sign: ${zodiacSign || 'generic'}`);
      } else {
        logger.warn(`No default template found for type: ${templateType} and sign: ${zodiacSign || 'generic'}`);
      }
    }
  } catch (error) {
    logger.error(`Error ensuring template exists for type: ${templateType} and sign: ${zodiacSign || 'generic'}:`, error);
    throw error;
  }
};

export default {
  seedDefaultTemplates,
  ensureTemplateExists,
};
