// src/services/content/controllers/variableController.ts

import { Request, Response } from 'express';
import ContentVariable from '../models/ContentVariable';
import logger from '../../../utils/logger';
import { Op } from 'sequelize';

/**
 * Create a new content variable
 */
export const createVariable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { variable_name, variable_type, context, values } = req.body;

    // Validate required fields
    if (!variable_name || !variable_type || !context || !values) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: variable_name, variable_type, context, values',
      });
      return;
    }

    // Create variable
    const variable = await ContentVariable.create({
      variable_name,
      variable_type,
      context,
      values,
    });

    res.status(201).json({
      success: true,
      data: variable,
    });
  } catch (error) {
    logger.error('Error creating content variable', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to create content variable',
      error: (error as Error).message,
    });
  }
};

/**
 * Get all content variables with optional filtering
 */
export const getVariables = async (req: Request, res: Response): Promise<void> => {
  try {
    const { variable_type, context } = req.query;

    // Build query conditions
    const whereClause: any = {};

    if (variable_type) {
      whereClause.variable_type = variable_type;
    }

    if (context) {
      whereClause.context = context;
    }

    // Get variables
    const variables = await ContentVariable.findAll({
      where: whereClause,
      order: [['variable_name', 'ASC']],
    });

    res.status(200).json({
      success: true,
      count: variables.length,
      data: variables,
    });
  } catch (error) {
    logger.error('Error getting content variables', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to get content variables',
      error: (error as Error).message,
    });
  }
};

/**
 * Get a single content variable by ID
 */
export const getVariableById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const variable = await ContentVariable.findByPk(id);

    if (!variable) {
      res.status(404).json({
        success: false,
        message: `Variable not found with id: ${id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: variable,
    });
  } catch (error) {
    logger.error(`Error getting content variable with id: ${req.params.id}`, { error });
    res.status(500).json({
      success: false,
      message: 'Failed to get content variable',
      error: (error as Error).message,
    });
  }
};

/**
 * Update a content variable
 */
export const updateVariable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { variable_name, variable_type, context, values } = req.body;

    const variable = await ContentVariable.findByPk(id);

    if (!variable) {
      res.status(404).json({
        success: false,
        message: `Variable not found with id: ${id}`,
      });
      return;
    }

    // Update variable
    await variable.update({
      variable_name: variable_name || variable.variable_name,
      variable_type: variable_type || variable.variable_type,
      context: context || variable.context,
      values: values || variable.values,
      updated_at: new Date(),
    });

    res.status(200).json({
      success: true,
      data: variable,
    });
  } catch (error) {
    logger.error(`Error updating content variable with id: ${req.params.id}`, { error });
    res.status(500).json({
      success: false,
      message: 'Failed to update content variable',
      error: (error as Error).message,
    });
  }
};

/**
 * Delete a content variable
 */
export const deleteVariable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const variable = await ContentVariable.findByPk(id);

    if (!variable) {
      res.status(404).json({
        success: false,
        message: `Variable not found with id: ${id}`,
      });
      return;
    }

    await variable.destroy();

    res.status(200).json({
      success: true,
      message: 'Variable deleted successfully',
    });
  } catch (error) {
    logger.error(`Error deleting content variable with id: ${req.params.id}`, { error });
    res.status(500).json({
      success: false,
      message: 'Failed to delete content variable',
      error: (error as Error).message,
    });
  }
};

/**
 * Get variables by name
 */
export const getVariableByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.params;

    const variable = await ContentVariable.findOne({
      where: {
        variable_name: name,
      },
    });

    if (!variable) {
      res.status(404).json({
        success: false,
        message: `Variable not found with name: ${name}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: variable,
    });
  } catch (error) {
    logger.error(`Error getting content variable with name: ${req.params.name}`, { error });
    res.status(500).json({
      success: false,
      message: 'Failed to get content variable',
      error: (error as Error).message,
    });
  }
};
