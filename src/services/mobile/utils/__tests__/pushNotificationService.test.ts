// src/services/mobile/utils/__tests__/pushNotificationService.test.ts

import { PushNotificationService, PushPlatform, PushPriority } from '../pushNotificationService';
import { redisClient } from '../../../../config/redis.config';
import axios from 'axios';
import logger from '../../../../utils/logger';
import { PushNotificationData, PushNotificationResult, DeviceToken } from '../../../../types/mobile';

// Mock dependencies
jest.mock('axios');
jest.mock('../../../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));
jest.mock('../../../../config/redis.config', () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    sAdd: jest.fn(),
    sMembers: jest.fn(),
    sRem: jest.fn(),
    expire: jest.fn(),
  },
}));

describe('Push Notification Service', () => {
  let pushService: PushNotificationService;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Set environment variables for testing
    process.env.FCM_SERVER_KEY = 'test_fcm_key';
    process.env.APNS_KEY_ID = 'test_apns_key_id';
    process.env.APNS_TEAM_ID = 'test_apns_team_id';
    process.env.APNS_BUNDLE_ID = 'test.bundle.id';
    process.env.APNS_AUTH_KEY = 'test_apns_auth_key';
    
    // Get service instance
    pushService = PushNotificationService.getInstance();
  });
  
  afterEach(() => {
    // Clean up environment variables
    delete process.env.FCM_SERVER_KEY;
    delete process.env.APNS_KEY_ID;
    delete process.env.APNS_TEAM_ID;
    delete process.env.APNS_BUNDLE_ID;
    delete process.env.APNS_AUTH_KEY;
  });
  
  describe('Singleton Pattern', () => {
    test('should return the same instance when getInstance is called multiple times', () => {
      const instance1 = PushNotificationService.getInstance();
      const instance2 = PushNotificationService.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });
  
  describe('Device Token Registration', () => {
    test('should register a device token successfully', async () => {
      // Mock Redis response
      (redisClient.set as jest.Mock).mockResolvedValue('OK');
      (redisClient.sAdd as jest.Mock).mockResolvedValue(1);
      
      const result = await pushService.registerDeviceToken(
        'user123',
        'device123',
        'fcm-token-123',
        PushPlatform.FCM
      );
      
      expect(result).toBe(true);
      expect(redisClient.set).toHaveBeenCalledWith(
        'push:token:user123:device123',
        expect.stringContaining('fcm-token-123')
      );
      expect(redisClient.sAdd).toHaveBeenCalledWith(
        'push:user:user123',
        'device123'
      );
      expect(logger.info).toHaveBeenCalled();
    });
    
    test('should handle errors during registration', async () => {
      // Mock Redis error
      (redisClient.set as jest.Mock).mockRejectedValue(new Error('Redis error'));
      
      const result = await pushService.registerDeviceToken(
        'user123',
        'device123',
        'fcm-token-123',
        PushPlatform.FCM
      );
      
      expect(result).toBe(false);
      expect(logger.error).toHaveBeenCalled();
    });
  });
  
  describe('Device Token Unregistration', () => {
    test('should unregister a device token successfully', async () => {
      // Mock Redis responses
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify({
        token: 'fcm-token-123',
        platform: PushPlatform.FCM,
        userId: 'user123',
        deviceId: 'device123',
        isActive: true,
      }));
      (redisClient.set as jest.Mock).mockResolvedValue('OK');
      (redisClient.sRem as jest.Mock).mockResolvedValue(1);
      
      const result = await pushService.unregisterDeviceToken('user123', 'device123');
      
      expect(result).toBe(true);
      expect(redisClient.get).toHaveBeenCalledWith('push:token:user123:device123');
      expect(redisClient.set).toHaveBeenCalledWith(
        'push:token:user123:device123',
        expect.stringContaining('"isActive":false')
      );
      expect(redisClient.sRem).toHaveBeenCalledWith('push:user:user123', 'device123');
      expect(logger.info).toHaveBeenCalled();
    });
    
    test('should handle non-existent token gracefully', async () => {
      // Mock Redis response for non-existent token
      (redisClient.get as jest.Mock).mockResolvedValue(null);
      
      const result = await pushService.unregisterDeviceToken('user123', 'device123');
      
      expect(result).toBe(true);
      expect(redisClient.set).not.toHaveBeenCalled();
      expect(redisClient.sRem).not.toHaveBeenCalled();
    });
    
    test('should handle errors during unregistration', async () => {
      // Mock Redis error
      (redisClient.get as jest.Mock).mockRejectedValue(new Error('Redis error'));
      
      const result = await pushService.unregisterDeviceToken('user123', 'device123');
      
      expect(result).toBe(false);
      expect(logger.error).toHaveBeenCalled();
    });
  });
  
  describe('Send Push Notification to User', () => {
    test('should send push notification to all user devices', async () => {
      // Mock Redis responses
      (redisClient.sMembers as jest.Mock).mockResolvedValue(['device1', 'device2']);
      (redisClient.get as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify({
          token: 'fcm-token-1',
          platform: PushPlatform.FCM,
          userId: 'user123',
          deviceId: 'device1',
          isActive: true,
        }))
        .mockResolvedValueOnce(JSON.stringify({
          token: 'apns-token-2',
          platform: PushPlatform.APNS,
          userId: 'user123',
          deviceId: 'device2',
          isActive: true,
        }));
      
      // Mock axios responses
      (axios.post as jest.Mock)
        .mockResolvedValueOnce({ data: { success: 1, results: [{ message_id: 'msg1' }] } })
        .mockResolvedValueOnce({ status: 200, headers: { 'apns-id': 'apns1' } });
      
      const notification = {
        title: 'Test Title',
        body: 'Test Body',
        data: { key: 'value' },
      };
      
      const results = await pushService.sendToUser('user123', notification);
      
      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[0].messageId).toBe('msg1');
      expect(results[1].success).toBe(true);
      expect(results[1].messageId).toBe('apns1');
      
      expect(redisClient.sMembers).toHaveBeenCalledWith('push:user:user123');
      expect(redisClient.get).toHaveBeenCalledWith('push:token:user123:device1');
      expect(redisClient.get).toHaveBeenCalledWith('push:token:user123:device2');
      expect(axios.post).toHaveBeenCalledTimes(2);
    });
    
    test('should handle user with no devices', async () => {
      // Mock Redis response for user with no devices
      (redisClient.sMembers as jest.Mock).mockResolvedValue([]);
      
      const notification = {
        title: 'Test Title',
        body: 'Test Body',
      };
      
      const results = await pushService.sendToUser('user123', notification);
      
      expect(results).toHaveLength(0);
      expect(logger.warn).toHaveBeenCalled();
    });
    
    test('should handle invalid tokens and mark them as inactive', async () => {
      // Mock Redis responses
      (redisClient.sMembers as jest.Mock).mockResolvedValue(['device1']);
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify({
        token: 'fcm-token-1',
        platform: PushPlatform.FCM,
        userId: 'user123',
        deviceId: 'device1',
        isActive: true,
      }));
      
      // Mock axios response for invalid token
      (axios.post as jest.Mock).mockResolvedValue({
        data: { success: 0, results: [{ error: 'NotRegistered' }] }
      });
      
      const notification = {
        title: 'Test Title',
        body: 'Test Body',
      };
      
      const results = await pushService.sendToUser('user123', notification);
      
      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].error).toBe('NotRegistered');
      
      // Should mark token as inactive
      expect(redisClient.set).toHaveBeenCalledWith(
        'push:token:user123:device1',
        expect.stringContaining('"isActive":false')
      );
      expect(redisClient.sRem).toHaveBeenCalledWith('push:user:user123', 'device1');
      expect(logger.warn).toHaveBeenCalled();
    });
  });
  
  describe('FCM Notifications', () => {
    test('should send FCM notification successfully', async () => {
      // Mock axios response
      (axios.post as jest.Mock).mockResolvedValue({
        data: { success: 1, results: [{ message_id: 'msg1' }] }
      });
      
      const notification = {
        title: 'Test Title',
        body: 'Test Body',
        imageUrl: 'https://example.com/image.jpg',
        sound: 'default',
        badge: 1,
        clickAction: 'OPEN_ACTIVITY',
        priority: PushPriority.HIGH,
        ttl: 3600,
        collapseKey: 'test_collapse',
      };
      
      // Call the private method using any type assertion
      const result = await (pushService as any).sendFcmNotification(
        'fcm-token-123',
        notification
      );
      
      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg1');
      expect(axios.post).toHaveBeenCalledWith(
        'https://fcm.googleapis.com/fcm/send',
        expect.objectContaining({
          to: 'fcm-token-123',
          notification: expect.objectContaining({
            title: 'Test Title',
            body: 'Test Body',
          }),
          priority: 'high',
          time_to_live: 3600,
          collapse_key: 'test_collapse',
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'key=test_fcm_key',
          }),
        })
      );
    });
    
    test('should handle FCM error response', async () => {
      // Mock axios error response
      (axios.post as jest.Mock).mockResolvedValue({
        data: { success: 0, results: [{ error: 'InvalidRegistration' }] }
      });
      
      const notification = {
        title: 'Test Title',
        body: 'Test Body',
      };
      
      // Call the private method using any type assertion
      const result = await (pushService as any).sendFcmNotification(
        'fcm-token-123',
        notification
      );
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('InvalidRegistration');
    });
    
    test('should handle FCM server error', async () => {
      // Mock axios throwing an error
      (axios.post as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      const notification = {
        title: 'Test Title',
        body: 'Test Body',
      };
      
      // Call the private method using any type assertion
      const result = await (pushService as any).sendFcmNotification(
        'fcm-token-123',
        notification
      );
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
      expect(logger.error).toHaveBeenCalled();
    });
  });
  
  describe('Content-specific Notifications', () => {
    test('should send content update notification with correct format', async () => {
      // Mock the sendToUser method
      const mockSendToUser = jest.spyOn(pushService, 'sendToUser').mockResolvedValue([
        { success: true, messageId: 'msg1', deviceToken: 'token1' }
      ]);
      
      const results = await pushService.sendContentUpdateNotification(
        'user123',
        'daily_horoscope',
        'horoscope123'
      );
      
      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      
      // Verify sendToUser was called with correct parameters
      expect(mockSendToUser).toHaveBeenCalledWith(
        'user123',
        expect.objectContaining({
          title: 'Daily Horoscope',
          body: 'Your daily horoscope is now available.',
          data: expect.objectContaining({
            contentType: 'daily_horoscope',
            contentId: 'horoscope123',
          }),
          collapseKey: expect.stringContaining('content_daily_horoscope_user123'),
        })
      );
      
      // Restore the original method
      mockSendToUser.mockRestore();
    });
    
    test('should send subscription expiration notification with correct format', async () => {
      // Mock the sendToUser method
      const mockSendToUser = jest.spyOn(pushService, 'sendToUser').mockResolvedValue([
        { success: true, messageId: 'msg1', deviceToken: 'token1' }
      ]);
      
      const results = await pushService.sendSubscriptionExpirationNotification(
        'user123',
        7
      );
      
      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      
      // Verify sendToUser was called with correct parameters
      expect(mockSendToUser).toHaveBeenCalledWith(
        'user123',
        expect.objectContaining({
          title: 'Subscription Expiring',
          body: 'Your subscription will expire in 7 days.',
          data: expect.objectContaining({
            daysRemaining: '7',
          }),
          collapseKey: expect.stringContaining('subscription_expiration_user123'),
        })
      );
      
      // Restore the original method
      mockSendToUser.mockRestore();
    });
  });
});
