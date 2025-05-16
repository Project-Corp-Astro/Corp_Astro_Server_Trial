// src/services/mobile/controllers/mobileApiController.ts

import { Request, Response } from 'express';
import logger from '../../../utils/logger';
import { asyncHandler } from '../../performance/utils/asyncHandler';
import pushNotificationService, { PushPlatform } from '../utils/pushNotificationService';
import { redisClient } from '../../../config/redis.config';
import { cacheManager } from '../../performance/utils/cacheManager';
import mobileConfig from '../config/mobileConfig';

/**
 * Register device for push notifications
 */
export const registerDevice = asyncHandler(async (req: Request, res: Response) => {
  const { deviceId, token, platform } = req.body;
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (!deviceId || !token || !platform) {
    return res.status(400).json({
      success: false,
      message: 'Device ID, token, and platform are required',
    });
  }

  const result = await pushNotificationService.registerDeviceToken(
    String(userId),
    deviceId,
    token,
    platform as PushPlatform
  );

  return res.status(200).json({
    success: result,
    message: result ? 'Device registered successfully' : 'Failed to register device',
  });
});

/**
 * Unregister device from push notifications
 */
export const unregisterDevice = asyncHandler(async (req: Request, res: Response) => {
  const { deviceId } = req.body;
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (!deviceId) {
    return res.status(400).json({
      success: false,
      message: 'Device ID is required',
    });
  }

  const result = await pushNotificationService.unregisterDeviceToken(
    String(userId),
    deviceId
  );

  return res.status(200).json({
    success: result,
    message: result ? 'Device unregistered successfully' : 'Failed to unregister device',
  });
});

/**
 * Get mobile configuration
 */
export const getMobileConfig = asyncHandler(async (req: Request, res: Response) => {
  const deviceInfo = (req as any).deviceInfo;
  
  // Customize config based on device info
  const customizedConfig = { ...mobileConfig };
  
  if (deviceInfo) {
    // Adjust config based on device capabilities
    if (deviceInfo.isLowBandwidth) {
      customizedConfig.responseOptimization.defaultImageQuality = 60;
      customizedConfig.bandwidthOptimization.defaultPageSize = 10;
    }
    
    if (deviceInfo.isLowBattery) {
      // Make sure we're accessing the correct property
      if (customizedConfig.offlineSupport && 'defaultSyncInterval' in customizedConfig.offlineSupport) {
        customizedConfig.offlineSupport.defaultSyncInterval = 120;
      }
    }
  }
  
  return res.status(200).json({
    success: true,
    data: customizedConfig,
  });
});

/**
 * Get user profile with mobile-optimized data
 */
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // Get user profile from cache or database
  const cacheKey = `mobile:profile:${userId}`;
  const userProfile = await cacheManager.getOrSet(
    cacheKey,
    async () => {
      // Fetch user data from database
      // This is a placeholder - replace with actual database query
      return {
        id: userId,
        name: 'User Name',
        email: 'user@example.com',
        subscription: {
          tier: 'free',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        preferences: {
          notifications: true,
          theme: 'light',
          language: 'en',
        },
        stats: {
          lastLogin: new Date(),
          contentViewed: 42,
          reportsGenerated: 7,
        },
      };
    },
    300 // Cache for 5 minutes
  );

  return res.status(200).json({
    success: true,
    data: userProfile,
  });
});

/**
 * Get mobile-optimized content
 */
export const getMobileContent = asyncHandler(async (req: Request, res: Response) => {
  const { contentType, contentId } = req.params;
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (!contentType) {
    return res.status(400).json({
      success: false,
      message: 'Content type is required',
    });
  }

  // Get device info
  const deviceInfo = (req as any).deviceInfo;
  const isLowBandwidth = deviceInfo?.isLowBandwidth || false;

  // Get content from cache or database
  const cacheKey = `mobile:content:${contentType}:${contentId || userId}`;
  const content = await cacheManager.getOrSet(
    cacheKey,
    async () => {
      // Fetch content from database
      // This is a placeholder - replace with actual database query
      let contentData: any = {};
      
      switch (contentType) {
        case 'daily_horoscope':
          contentData = {
            title: 'Daily Horoscope',
            content: 'Your daily horoscope content...',
            date: new Date(),
            imageUrl: 'https://example.com/horoscope.jpg',
          };
          break;
          
        case 'monthly_report':
          contentData = {
            title: 'Monthly Report',
            content: 'Your monthly report content...',
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            sections: [
              { title: 'Overview', content: 'Overview content...' },
              { title: 'Career', content: 'Career content...' },
              { title: 'Finance', content: 'Finance content...' },
            ],
          };
          break;
          
        case 'business_insight':
          contentData = {
            title: 'Business Insight',
            content: 'Your business insight content...',
            businessId: contentId,
            insightType: 'weekly',
            recommendations: [
              'Recommendation 1',
              'Recommendation 2',
              'Recommendation 3',
            ],
          };
          break;
          
        default:
          contentData = {
            title: 'Content',
            content: 'Generic content...',
          };
          break;
      }
      
      return contentData;
    },
    600 // Cache for 10 minutes
  );

  // Optimize content for low bandwidth if needed
  if (isLowBandwidth && content) {
    // Remove non-essential data
    if (content.metadata) {
      delete content.metadata;
    }
    
    // Truncate long text fields
    if (content.content && typeof content.content === 'string' && content.content.length > 500) {
      content.content = content.content.substring(0, 500) + '...';
    }
    
    // Reduce image quality
    if (content.imageUrl && typeof content.imageUrl === 'string') {
      content.imageUrl = `${content.imageUrl}?q=60&w=480`;
    }
  }

  return res.status(200).json({
    success: true,
    data: content,
  });
});

/**
 * Update user device settings
 */
export const updateDeviceSettings = asyncHandler(async (req: Request, res: Response) => {
  const { deviceId, settings } = req.body;
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (!deviceId || !settings) {
    return res.status(400).json({
      success: false,
      message: 'Device ID and settings are required',
    });
  }

  // Save device settings
  const key = `mobile:settings:${userId}:${deviceId}`;
  await redisClient.set(key, JSON.stringify({
    ...settings,
    updatedAt: Date.now(),
  }));

  return res.status(200).json({
    success: true,
    message: 'Device settings updated successfully',
  });
});

/**
 * Get mobile-optimized business data
 */
export const getBusinessData = asyncHandler(async (req: Request, res: Response) => {
  const { businessId } = req.params;
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (!businessId) {
    return res.status(400).json({
      success: false,
      message: 'Business ID is required',
    });
  }

  // Get business data from cache or database
  const cacheKey = `mobile:business:${businessId}`;
  const businessData = await cacheManager.getOrSet(
    cacheKey,
    async () => {
      // Fetch business data from database
      // This is a placeholder - replace with actual database query
      return {
        id: businessId,
        name: 'Business Name',
        foundingDate: '2020-01-01',
        location: 'New York, NY',
        industry: 'Technology',
        chart: {
          ascendant: 'Aries',
          sun: 'Taurus',
          moon: 'Gemini',
          // Other chart data...
        },
        insights: [
          { type: 'weekly', id: 'w123', title: 'Weekly Insight', date: new Date() },
          { type: 'monthly', id: 'm456', title: 'Monthly Insight', date: new Date() },
        ],
      };
    },
    600 // Cache for 10 minutes
  );

  return res.status(200).json({
    success: true,
    data: businessData,
  });
});

export default {
  registerDevice,
  unregisterDevice,
  getMobileConfig,
  getUserProfile,
  getMobileContent,
  updateDeviceSettings,
  getBusinessData,
};
