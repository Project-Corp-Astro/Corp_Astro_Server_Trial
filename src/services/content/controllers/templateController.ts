// src/services/content/controllers/templateController.ts

import { Request, Response } from 'express';
import ContentTemplate from '../models/ContentTemplate';
import logger from '../../../utils/logger';
import { Op } from 'sequelize';

/**
 * Create a new content template
 */
export const createTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      template_type,
      zodiac_sign,
      planet,
      house,
      aspect,
      template_content,
      variables,
      tags,
    } = req.body;

    // Validate required fields
    if (!template_type || !template_content || !variables) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: template_type, template_content, variables',
      });
      return;
    }

    // Create template
    const template = await ContentTemplate.create({
      template_type,
      zodiac_sign,
      planet,
      house,
      aspect,
      template_content,
      variables,
      tags,
      active: true,
    });

    res.status(201).json({
      success: true,
      data: template,
    });
  } catch (error) {
    logger.error('Error creating content template', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to create content template',
      error: (error as Error).message,
    });
  }
};

/**
 * Get all content templates with optional filtering
 */
export const getTemplates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { template_type, zodiac_sign, planet, house, aspect, active } = req.query;

    // Build query conditions
    const whereClause: any = {};

    if (template_type) {
      whereClause.template_type = template_type;
    }

    if (zodiac_sign) {
      whereClause.zodiac_sign = zodiac_sign;
    }

    if (planet) {
      whereClause.planet = planet;
    }

    if (house) {
      whereClause.house = parseInt(house as string);
    }

    if (aspect) {
      whereClause.aspect = aspect;
    }

    if (active !== undefined) {
      whereClause.active = active === 'true';
    }

    // Get templates
    const templates = await ContentTemplate.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    logger.error('Error getting content templates', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to get content templates',
      error: (error as Error).message,
    });
  }
};

/**
 * Get a single content template by ID
 */
export const getTemplateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const template = await ContentTemplate.findByPk(id);

    if (!template) {
      res.status(404).json({
        success: false,
        message: `Template not found with id: ${id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    logger.error(`Error getting content template with id: ${req.params.id}`, { error });
    res.status(500).json({
      success: false,
      message: 'Failed to get content template',
      error: (error as Error).message,
    });
  }
};

/**
 * Update a content template
 */
export const updateTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      template_type,
      zodiac_sign,
      planet,
      house,
      aspect,
      template_content,
      variables,
      tags,
      active,
    } = req.body;

    const template = await ContentTemplate.findByPk(id);

    if (!template) {
      res.status(404).json({
        success: false,
        message: `Template not found with id: ${id}`,
      });
      return;
    }

    // Update template
    await template.update({
      template_type: template_type || template.template_type,
      zodiac_sign: zodiac_sign !== undefined ? zodiac_sign : template.zodiac_sign,
      planet: planet !== undefined ? planet : template.planet,
      house: house !== undefined ? house : template.house,
      aspect: aspect !== undefined ? aspect : template.aspect,
      template_content: template_content || template.template_content,
      variables: variables || template.variables,
      tags: tags || template.tags,
      active: active !== undefined ? active : template.active,
      updated_at: new Date(),
    });

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    logger.error(`Error updating content template with id: ${req.params.id}`, { error });
    res.status(500).json({
      success: false,
      message: 'Failed to update content template',
      error: (error as Error).message,
    });
  }
};

/**
 * Delete a content template
 */
export const deleteTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const template = await ContentTemplate.findByPk(id);

    if (!template) {
      res.status(404).json({
        success: false,
        message: `Template not found with id: ${id}`,
      });
      return;
    }

    await template.destroy();

    res.status(200).json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    logger.error(`Error deleting content template with id: ${req.params.id}`, { error });
    res.status(500).json({
      success: false,
      message: 'Failed to delete content template',
      error: (error as Error).message,
    });
  }
};

/**
 * Search for templates by content
 */
export const searchTemplates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query) {
      res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
      return;
    }

    const templates = await ContentTemplate.findAll({
      where: {
        [Op.or]: [
          { template_content: { [Op.iLike]: `%${query}%` } },
          { template_type: { [Op.iLike]: `%${query}%` } },
        ],
      },
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    logger.error('Error searching content templates', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to search content templates',
      error: (error as Error).message,
    });
  }
};
