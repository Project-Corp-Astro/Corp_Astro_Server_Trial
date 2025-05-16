// src/services/content/utils/seedVariables.ts

import ContentVariable from '../models/ContentVariable';
import { defaultVariables, ContentVariableData } from '../data/defaultVariables';
import logger from '../../../utils/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Seed default content variables into the database
 * This ensures that the content generation system has variables to work with
 */
export const seedDefaultVariables = async (): Promise<void> => {
  try {
    logger.info('Seeding default content variables...');
    
    // Count existing variables
    const existingCount = await ContentVariable.count();
    logger.info(`Found ${existingCount} existing variables in the database`);
    
    // Only seed if no variables exist
    if (existingCount === 0) {
      logger.info('No variables found. Seeding default variables...');
      
      // Create variables
      for (const variable of defaultVariables) {
        await ContentVariable.create({
          id: uuidv4(),
          variable_name: variable.variable_name,
          variable_type: variable.variable_type,
          context: variable.context,
          values: variable.values,
        });
      }
      
      logger.info(`Successfully seeded ${defaultVariables.length} default variables`);
    } else {
      logger.info('Variables already exist. Skipping seed process.');
    }
  } catch (error) {
    logger.error('Error seeding default variables:', error);
    throw error;
  }
};

/**
 * Retrieve a content variable by name and context
 * @param variableName Name of the variable to retrieve
 * @param context Context of the variable
 * @returns The variable values or null if not found
 */
export const getContentVariable = async (
  variableName: string,
  context: string
): Promise<Record<string, any> | null> => {
  try {
    const variable = await ContentVariable.findOne({
      where: {
        variable_name: variableName,
        context: context,
      },
    });
    
    return variable ? variable.values as Record<string, any> : null;
  } catch (error) {
    logger.error(`Error retrieving content variable ${variableName} for context ${context}:`, error);
    return null;
  }
};

/**
 * Check if a specific variable exists, and create it if not
 * @param variableName Variable name to check
 * @param context Context for the variable
 */
export const ensureVariableExists = async (
  variableName: string,
  context: string
): Promise<void> => {
  try {
    // Check if variable exists
    const existingVariable = await ContentVariable.findOne({
      where: {
        variable_name: variableName,
        context: context,
      },
    });
    
    // If variable doesn't exist, create it from defaults
    if (!existingVariable) {
      logger.info(`Variable not found for name: ${variableName} and context: ${context}. Creating from defaults...`);
      
      // Find matching default variable
      const defaultVariable = defaultVariables.find(v => 
        v.variable_name === variableName && 
        v.context === context
      );
      
      if (defaultVariable) {
        await ContentVariable.create({
          id: uuidv4(),
          variable_name: defaultVariable.variable_name,
          variable_type: defaultVariable.variable_type,
          context: defaultVariable.context,
          values: defaultVariable.values,
        });
        
        logger.info(`Created variable for name: ${variableName} and context: ${context}`);
      } else {
        logger.warn(`No default variable found for name: ${variableName} and context: ${context}`);
      }
    }
  } catch (error) {
    logger.error(`Error ensuring variable exists for name: ${variableName} and context: ${context}:`, error);
    throw error;
  }
};

export default {
  seedDefaultVariables,
  getContentVariable,
  ensureVariableExists,
};
