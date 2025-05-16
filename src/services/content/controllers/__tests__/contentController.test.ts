// src/services/content/controllers/__tests__/contentController.test.ts

import { Request, Response } from 'express';
import * as contentController from '../contentController';
import { cacheManager } from '../../../performance/utils/cacheManager';
import logger from '../../../../utils/logger';

// Mock dependencies
jest.mock('../../../performance/utils/cacheManager');
jest.mock('../../../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

describe('Content Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  
  beforeEach(() => {
    mockRequest = {
      user: {
        id: 'user123',
        email: 'test@example.com',
        subscription: {
          tier: 'premium',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days in the future
        },
      },
      body: {
        zodiacSign: 'aries',
        date: '2023-05-15',
        businessName: 'Test Business',
        industry: 'Technology',
      },
      params: {
        id: 'content123',
      },
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    
    mockNext = jest.fn();
    
    // Reset all mocks
    jest.clearAllMocks();
  });
  
  describe('generateDailyHoroscope', () => {
    it('should generate daily horoscope for premium users', async () => {
      // Mock cache manager to return generated content
      (cacheManager.getOrSet as jest.Mock).mockImplementation(async (key, callback) => {
        return await callback();
      });
      
      await contentController.generateDailyHoroscope(
        mockRequest as Request,
        mockResponse as Response
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
    
    it('should return error for invalid zodiac sign', async () => {
      mockRequest.body.zodiacSign = 'invalid';
      
      await contentController.generateDailyHoroscope(
        mockRequest as Request,
        mockResponse as Response
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('Invalid zodiac sign'),
        })
      );
    });
    
    it('should handle errors gracefully', async () => {
      // Mock cache manager to throw an error
      (cacheManager.getOrSet as jest.Mock).mockRejectedValue(new Error('Test error'));
      
      await contentController.generateDailyHoroscope(
        mockRequest as Request,
        mockResponse as Response
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('Error generating daily horoscope'),
        })
      );
    });
  });
  
  describe('generateMonthlyReport', () => {
    it('should generate monthly report for premium users', async () => {
      // Mock cache manager to return generated content
      (cacheManager.getOrSet as jest.Mock).mockImplementation(async (key, callback) => {
        return await callback();
      });
      
      await contentController.generateMonthlyReport(
        mockRequest as Request,
        mockResponse as Response
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
    
    it('should handle errors gracefully', async () => {
      // Mock cache manager to throw an error
      (cacheManager.getOrSet as jest.Mock).mockRejectedValue(new Error('Test error'));
      
      await contentController.generateMonthlyReport(
        mockRequest as Request,
        mockResponse as Response
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('Error generating monthly report'),
        })
      );
    });
  });
  
  describe('generateBusinessInsight', () => {
    it('should generate business insight for premium users', async () => {
      // Mock cache manager to return generated content
      (cacheManager.getOrSet as jest.Mock).mockImplementation(async (key, callback) => {
        return await callback();
      });
      
      await contentController.generateBusinessInsight(
        mockRequest as Request,
        mockResponse as Response
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
    
    it('should return error for missing business details', async () => {
      mockRequest.body.businessName = '';
      
      await contentController.generateBusinessInsight(
        mockRequest as Request,
        mockResponse as Response
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('Business name is required'),
        })
      );
    });
    
    it('should handle errors gracefully', async () => {
      // Mock cache manager to throw an error
      (cacheManager.getOrSet as jest.Mock).mockRejectedValue(new Error('Test error'));
      
      await contentController.generateBusinessInsight(
        mockRequest as Request,
        mockResponse as Response
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('Error generating business insight'),
        })
      );
    });
  });
  
  describe('getUserContentHistory', () => {
    it('should get user content history', async () => {
      await contentController.getUserContentHistory(
        mockRequest as Request,
        mockResponse as Response
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    
    it('should handle errors gracefully', async () => {
      // Mock an error
      const error = new Error('Test error');
      mockNext.mockImplementation(() => { throw error; });
      
      await contentController.getUserContentHistory(
        mockRequest as Request,
        mockResponse as Response
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
  
  describe('getContentById', () => {
    it('should get content by id', async () => {
      await contentController.getContentById(
        mockRequest as Request,
        mockResponse as Response
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    
    it('should return 404 for non-existent content', async () => {
      // Mock a not found error
      mockNext.mockImplementation(() => {
        const error = new Error('Content not found');
        (error as any).statusCode = 404;
        throw error;
      });
      
      await contentController.getContentById(
        mockRequest as Request,
        mockResponse as Response
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
    
    it('should handle errors gracefully', async () => {
      // Mock an error
      const error = new Error('Test error');
      mockNext.mockImplementation(() => { throw error; });
      
      await contentController.getContentById(
        mockRequest as Request,
        mockResponse as Response
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
