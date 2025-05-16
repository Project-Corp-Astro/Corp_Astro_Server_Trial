// src/services/mobile/controllers/__tests__/mobileApiController.test.ts

import request from 'supertest';
import express, { Application, Request, Response, NextFunction } from 'express';
import { MobileDeviceInfo, DeviceAwareRequest, AuthenticatedRequest } from '../../../../types/common';

// Extend Request type to include deviceInfo and user
interface RequestWithDeviceInfo extends Request {
  deviceInfo?: MobileDeviceInfo;
  user?: any;
}

import bodyParser from 'body-parser';
import mobileApiController from '../mobileApiController';
import pushNotificationService from '../../utils/pushNotificationService';
import { redisClient } from '../../../../config/redis.config';
import { cacheManager } from '../../../performance/utils/cacheManager';
import { authenticatedRequest, createTestUser, mockDeviceInfo } from '../../../../__tests__/utils/testUtils';

// Mock dependencies
jest.mock('../../utils/pushNotificationService');
jest.mock('../../../../config/redis.config');
jest.mock('../../../performance/utils/cacheManager');
jest.mock('../../../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('Mobile API Controller Integration Tests', () => {
  let app: Application;
  let testUser: any;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create Express app
    app = express();
    app.use(bodyParser.json());
    
    // Create test user
    testUser = {
      user_id: 'user123',
      email: 'test@example.com',
      full_name: 'Test User',
      user_role: 'user',
      subscriptionType: 'subscription',
      phone_number: '+1234567890'
    };
    
    // Mock authentication middleware
    app.use((req: RequestWithDeviceInfo, res, next) => {
      req.user = testUser;
      next();
    });
    
    // Set up routes
    app.post('/api/mobile/device/register', mobileApiController.registerDevice);
    app.post('/api/mobile/device/unregister', mobileApiController.unregisterDevice);
    app.get('/api/mobile/config', mobileApiController.getMobileConfig);
    app.get('/api/mobile/profile', mobileApiController.getUserProfile);
    app.get('/api/mobile/content/:contentType', mobileApiController.getMobileContent);
    app.get('/api/mobile/content/:contentType/:contentId', mobileApiController.getMobileContent);
    app.post('/api/mobile/device/settings', mobileApiController.updateDeviceSettings);
    app.get('/api/mobile/business/:businessId', mobileApiController.getBusinessData);
  });
  
  describe('Device Registration', () => {
    test('should register a device successfully', async () => {
      // Mock push notification service
      (pushNotificationService.registerDeviceToken as jest.Mock).mockResolvedValue(true);
      
      const response = await request(app)
        .post('/api/mobile/device/register')
        .send({
          deviceId: 'device123',
          token: 'fcm-token-123',
          platform: 'fcm',
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Device registered successfully',
      });
      expect(pushNotificationService.registerDeviceToken).toHaveBeenCalledWith(
        'user123',
        'device123',
        'fcm-token-123',
        'fcm'
      );
    });
    
    test('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/mobile/device/register')
        .send({
          deviceId: 'device123',
          // Missing token and platform
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'Device ID, token, and platform are required',
      });
      expect(pushNotificationService.registerDeviceToken).not.toHaveBeenCalled();
    });
  });
  
  describe('Device Unregistration', () => {
    test('should unregister a device successfully', async () => {
      // Mock push notification service
      (pushNotificationService.unregisterDeviceToken as jest.Mock).mockResolvedValue(true);
      
      const response = await request(app)
        .post('/api/mobile/device/unregister')
        .send({
          deviceId: 'device123',
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Device unregistered successfully',
      });
      expect(pushNotificationService.unregisterDeviceToken).toHaveBeenCalledWith(
        'user123',
        'device123'
      );
    });
    
    test('should return 400 if deviceId is missing', async () => {
      const response = await request(app)
        .post('/api/mobile/device/unregister')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'Device ID is required',
      });
      expect(pushNotificationService.unregisterDeviceToken).not.toHaveBeenCalled();
    });
  });
  
  describe('Mobile Configuration', () => {
    test('should return mobile configuration', async () => {
      // Add device info to request
      app.use((req: RequestWithDeviceInfo, res, next) => {
        req.deviceInfo = mockDeviceInfo;
        next();
      });
      
      const response = await request(app)
        .get('/api/mobile/config');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: expect.any(Object),
      });
      expect(response.body.data).toHaveProperty('responseOptimization');
      expect(response.body.data).toHaveProperty('bandwidthOptimization');
    });
    
    test('should customize config based on device capabilities', async () => {
      // Add low bandwidth device info to request
      app.use((req: RequestWithDeviceInfo, res, next) => {
        req.deviceInfo = {
          ...mockDeviceInfo,
          isLowBandwidth: true,
          isLowBattery: true,
        };
        next();
      });
      
      const response = await request(app)
        .get('/api/mobile/config');
      
      expect(response.status).toBe(200);
      expect(response.body.data.responseOptimization.defaultImageQuality).toBeLessThan(85);
      expect(response.body.data.bandwidthOptimization.defaultPageSize).toBeLessThan(20);
      expect(response.body.data.batteryOptimization.defaultSyncInterval).toBeGreaterThan(60);
    });
  });
  
  describe('User Profile', () => {
    test('should return user profile with mobile-optimized data', async () => {
      // Mock cache manager
      (cacheManager.getOrSet as jest.Mock).mockImplementation(async (key, callback) => {
        return await callback();
      });
      
      const response = await request(app)
        .get('/api/mobile/profile');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          id: 'user123',
          name: expect.any(String),
          subscription: expect.any(Object),
        }),
      });
      expect(cacheManager.getOrSet).toHaveBeenCalled();
    });
  });
  
  describe('Mobile Content', () => {
    test('should return mobile-optimized content', async () => {
      // Mock cache manager
      (cacheManager.getOrSet as jest.Mock).mockImplementation(async (key, callback) => {
        return await callback();
      });
      
      const response = await request(app)
        .get('/api/mobile/content/daily_horoscope');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          title: 'Daily Horoscope',
          content: expect.any(String),
        }),
      });
      expect(cacheManager.getOrSet).toHaveBeenCalled();
    });
    
    test('should return content with specific ID', async () => {
      // Mock cache manager
      (cacheManager.getOrSet as jest.Mock).mockImplementation(async (key, callback) => {
        return await callback();
      });
      
      const response = await request(app)
        .get('/api/mobile/content/business_insight/insight123');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          title: 'Business Insight',
          businessId: 'insight123',
        }),
      });
      expect(cacheManager.getOrSet).toHaveBeenCalled();
    });
    
    test('should optimize content for low bandwidth devices', async () => {
      // Mock cache manager
      (cacheManager.getOrSet as jest.Mock).mockImplementation(async (key, callback) => {
        return {
          title: 'Test Content',
          content: 'A'.repeat(1000), // Long content
          metadata: { author: 'Test Author' },
          imageUrl: 'https://example.com/image.jpg',
        };
      });
      
      // Add low bandwidth device info to request
      app.use((req: RequestWithDeviceInfo, res, next) => {
        req.deviceInfo = {
          ...mockDeviceInfo,
          isLowBandwidth: true,
        };
        next();
      });
      
      const response = await request(app)
        .get('/api/mobile/content/daily_horoscope');
      
      expect(response.status).toBe(200);
      expect(response.body.data).not.toHaveProperty('metadata');
      expect(response.body.data.content.length).toBeLessThan(1000);
      expect(response.body.data.imageUrl).toContain('q=60');
    });
    
    test('should return 400 if content type is missing', async () => {
      const response = await request(app)
        .get('/api/mobile/content/');
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('Device Settings', () => {
    test('should update device settings successfully', async () => {
      // Mock Redis
      (redisClient.set as jest.Mock).mockResolvedValue('OK');
      
      const response = await request(app)
        .post('/api/mobile/device/settings')
        .send({
          deviceId: 'device123',
          settings: {
            notifications: true,
            theme: 'dark',
            language: 'en',
          },
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Device settings updated successfully',
      });
      expect(redisClient.set).toHaveBeenCalledWith(
        'mobile:settings:user123:device123',
        expect.stringContaining('"notifications":true')
      );
    });
    
    test('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/mobile/device/settings')
        .send({
          deviceId: 'device123',
          // Missing settings
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'Device ID and settings are required',
      });
      expect(redisClient.set).not.toHaveBeenCalled();
    });
  });
  
  describe('Business Data', () => {
    test('should return mobile-optimized business data', async () => {
      // Mock cache manager
      (cacheManager.getOrSet as jest.Mock).mockImplementation(async (key, callback) => {
        return await callback();
      });
      
      const response = await request(app)
        .get('/api/mobile/business/business123');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          id: 'business123',
          name: expect.any(String),
          chart: expect.any(Object),
        }),
      });
      expect(cacheManager.getOrSet).toHaveBeenCalled();
    });
    
    test('should return 400 if business ID is missing', async () => {
      const response = await request(app)
        .get('/api/mobile/business/');
      
      expect(response.status).toBe(404);
    });
  });
});
