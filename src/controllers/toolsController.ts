/**
 * Tools Controller
 * 
 * Provides API endpoints for the free tools offered by the Corp Astro mobile application,
 * including business name numerology analysis and tagline analysis.
 */

import { Request, Response } from 'express';
import numerologyService from '../services/tools/numerologyService';
import logger from '../utils/logger';

/**
 * Controller for free tools endpoints
 */
export class ToolsController {
  /**
   * Analyze a business name using Chaldean numerology
   * @param req Express request
   * @param res Express response
   */
  public async analyzeBusinessName(req: Request, res: Response): Promise<void> {
    try {
      const { businessName } = req.body;
      
      // Validate business name
      if (!businessName || typeof businessName !== 'string' || businessName.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Business name is required'
        });
        return;
      }
      
      // Analyze business name
      const analysis = await numerologyService.analyzeBusinessName(businessName);
      
      res.status(200).json({
        success: true,
        data: analysis
      });
    } catch (error) {
      logger.error('Error in analyzeBusinessName:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze business name',
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Analyze a business tagline using Chaldean numerology
   * @param req Express request
   * @param res Express response
   */
  public async analyzeTagline(req: Request, res: Response): Promise<void> {
    try {
      const { tagline } = req.body;
      
      // Validate tagline
      if (!tagline || typeof tagline !== 'string' || tagline.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Tagline is required'
        });
        return;
      }
      
      // Analyze tagline
      const analysis = await numerologyService.analyzeTagline(tagline);
      
      res.status(200).json({
        success: true,
        data: analysis
      });
    } catch (error) {
      logger.error('Error in analyzeTagline:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze tagline',
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Check compatibility between a business name and tagline
   * @param req Express request
   * @param res Express response
   */
  public async checkNameTaglineCompatibility(req: Request, res: Response): Promise<void> {
    try {
      const { businessName, tagline } = req.body;
      
      // Validate inputs
      if (!businessName || typeof businessName !== 'string' || businessName.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Business name is required'
        });
        return;
      }
      
      if (!tagline || typeof tagline !== 'string' || tagline.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Tagline is required'
        });
        return;
      }
      
      // Check compatibility
      const compatibility = await numerologyService.checkNameTaglineCompatibility(businessName, tagline);
      
      res.status(200).json({
        success: true,
        data: compatibility
      });
    } catch (error) {
      logger.error('Error in checkNameTaglineCompatibility:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check compatibility',
        error: (error as Error).message
      });
    }
  }
}

export default new ToolsController();
