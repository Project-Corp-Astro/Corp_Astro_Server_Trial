// src/services/content/models/db/init.ts

import logger from '../../../../utils/logger';
import ContentTemplate from '../ContentTemplate';
import GeneratedContent from '../GeneratedContent';
import ContentVariable from '../ContentVariable';

const contentModelsSync = async (): Promise<void> => {
  try {
    logger.info('Syncing content generation models...');
    
    // Sync all models
    await ContentTemplate.sync({ alter: true });
    logger.info('✅ ContentTemplate model synced');
    
    await GeneratedContent.sync({ alter: true });
    logger.info('✅ GeneratedContent model synced');
    
    await ContentVariable.sync({ alter: true });
    logger.info('✅ ContentVariable model synced');
    
    logger.info('✅ All content generation models synced successfully');
  } catch (error) {
    logger.error('❌ Error syncing content generation models:', error);
    throw error;
  }
};

export default contentModelsSync;
