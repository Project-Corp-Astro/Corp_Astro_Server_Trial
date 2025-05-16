// src/services/mobile/utils/pushNotificationService.ts

import logger from '../../../utils/logger';
import mobileConfig from '../config/mobileConfig';
import { redisClient } from '../../../config/redis.config';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

/**
 * Push notification platform
 */
export enum PushPlatform {
  FCM = 'fcm', // Firebase Cloud Messaging (Android/iOS)
  APNS = 'apns', // Apple Push Notification Service (iOS)
}

/**
 * Push notification priority
 */
export enum PushPriority {
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
}

/**
 * Push notification data
 */
export interface PushNotificationData {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  sound?: string;
  badge?: number;
  clickAction?: string;
  category?: string;
  priority?: PushPriority;
  ttl?: number; // Time to live in seconds
  collapseKey?: string;
}

/**
 * Device token data
 */
export interface DeviceToken {
  token: string;
  platform: PushPlatform;
  userId: string;
  deviceId: string;
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
}

/**
 * Push notification result
 */
export interface PushNotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  deviceToken: string;
}

/**
 * Push notification service for mobile clients
 * This service handles sending push notifications to mobile devices
 * to reduce battery consumption by eliminating the need for polling
 */
export class PushNotificationService {
  private static instance: PushNotificationService;
  private fcmServerKey: string;
  private apnsKeyId: string;
  private apnsTeamId: string;
  private apnsBundleId: string;
  private apnsAuthKey: string;
  
  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    // Initialize FCM credentials
    this.fcmServerKey = process.env.FCM_SERVER_KEY || '';
    
    // Initialize APNS credentials
    this.apnsKeyId = process.env.APNS_KEY_ID || '';
    this.apnsTeamId = process.env.APNS_TEAM_ID || '';
    this.apnsBundleId = process.env.APNS_BUNDLE_ID || '';
    this.apnsAuthKey = process.env.APNS_AUTH_KEY || '';
    
    // Log initialization
    if (!this.fcmServerKey) {
      logger.warn('FCM server key not configured. FCM push notifications will not work.');
    }
    
    if (!this.apnsKeyId || !this.apnsTeamId || !this.apnsBundleId || !this.apnsAuthKey) {
      logger.warn('APNS credentials not fully configured. APNS push notifications will not work.');
    }
  }
  
  /**
   * Get singleton instance
   * @returns PushNotificationService instance
   */
  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    
    return PushNotificationService.instance;
  }
  
  /**
   * Register a device token
   * @param userId User ID
   * @param deviceId Device ID
   * @param token Device token
   * @param platform Push platform
   * @returns Success status
   */
  public async registerDeviceToken(
    userId: string,
    deviceId: string,
    token: string,
    platform: PushPlatform
  ): Promise<boolean> {
    try {
      // Create device token data
      const deviceToken: DeviceToken = {
        token,
        platform,
        userId,
        deviceId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isActive: true,
      };
      
      // Save device token in Redis
      const key = `push:token:${userId}:${deviceId}`;
      await redisClient.set(key, JSON.stringify(deviceToken));
      
      // Add to user's device tokens set
      await redisClient.sAdd(`push:user:${userId}`, deviceId);
      
      logger.info(`Registered device token for user ${userId}, device ${deviceId}`);
      
      return true;
    } catch (error) {
      logger.error(`Error registering device token: ${error}`);
      return false;
    }
  }
  
  /**
   * Unregister a device token
   * @param userId User ID
   * @param deviceId Device ID
   * @returns Success status
   */
  public async unregisterDeviceToken(userId: string, deviceId: string): Promise<boolean> {
    try {
      // Get device token from Redis
      const key = `push:token:${userId}:${deviceId}`;
      const tokenData = await redisClient.get(key);
      
      if (tokenData) {
        // Parse device token
        const deviceToken: DeviceToken = JSON.parse(tokenData);
        
        // Mark as inactive
        deviceToken.isActive = false;
        deviceToken.updatedAt = Date.now();
        
        // Update device token in Redis
        await redisClient.set(key, JSON.stringify(deviceToken));
        
        // Remove from user's device tokens set
        await redisClient.sRem(`push:user:${userId}`, deviceId);
        
        logger.info(`Unregistered device token for user ${userId}, device ${deviceId}`);
      }
      
      return true;
    } catch (error) {
      logger.error(`Error unregistering device token: ${error}`);
      return false;
    }
  }
  
  /**
   * Send push notification to a user
   * @param userId User ID
   * @param notification Push notification data
   * @returns Push notification results
   */
  public async sendToUser(
    userId: string,
    notification: PushNotificationData
  ): Promise<PushNotificationResult[]> {
    try {
      // Get user's device tokens
      const deviceIds = await redisClient.sMembers(`push:user:${userId}`);
      
      if (!deviceIds.length) {
        logger.warn(`No device tokens found for user ${userId}`);
        return [];
      }
      
      // Send push notification to each device
      const results: PushNotificationResult[] = [];
      
      for (const deviceId of deviceIds) {
        // Get device token
        const key = `push:token:${userId}:${deviceId}`;
        const tokenData = await redisClient.get(key);
        
        if (tokenData) {
          // Parse device token
          const deviceToken: DeviceToken = JSON.parse(tokenData);
          
          // Skip inactive tokens
          if (!deviceToken.isActive) {
            continue;
          }
          
          // Send push notification
          const result = await this.sendToDevice(deviceToken, notification);
          results.push(result);
          
          // Handle token errors
          if (!result.success && result.error) {
            if (
              result.error.includes('NotRegistered') ||
              result.error.includes('InvalidRegistration') ||
              result.error.includes('MismatchSenderId')
            ) {
              // Token is invalid, mark as inactive
              deviceToken.isActive = false;
              deviceToken.updatedAt = Date.now();
              
              // Update device token in Redis
              await redisClient.set(key, JSON.stringify(deviceToken));
              
              // Remove from user's device tokens set
              await redisClient.sRem(`push:user:${userId}`, deviceId);
              
              logger.warn(`Marked device token as inactive for user ${userId}, device ${deviceId}`);
            }
          }
        }
      }
      
      return results;
    } catch (error) {
      logger.error(`Error sending push notification to user: ${error}`);
      return [];
    }
  }
  
  /**
   * Send push notification to a device
   * @param deviceToken Device token
   * @param notification Push notification data
   * @returns Push notification result
   */
  private async sendToDevice(
    deviceToken: DeviceToken,
    notification: PushNotificationData
  ): Promise<PushNotificationResult> {
    try {
      // Send push notification based on platform
      switch (deviceToken.platform) {
        case PushPlatform.FCM:
          return await this.sendFcmNotification(deviceToken.token, notification);
          
        case PushPlatform.APNS:
          return await this.sendApnsNotification(deviceToken.token, notification);
          
        default:
          return {
            success: false,
            error: `Unsupported platform: ${deviceToken.platform}`,
            deviceToken: deviceToken.token,
          };
      }
    } catch (error: any) {
      logger.error(`Error sending push notification to device: ${error}`);
      
      return {
        success: false,
        error: error.message,
        deviceToken: deviceToken.token,
      };
    }
  }
  
  /**
   * Send FCM push notification
   * @param token FCM device token
   * @param notification Push notification data
   * @returns Push notification result
   */
  private async sendFcmNotification(
    token: string,
    notification: PushNotificationData
  ): Promise<PushNotificationResult> {
    try {
      // Check if FCM is configured
      if (!this.fcmServerKey) {
        return {
          success: false,
          error: 'FCM server key not configured',
          deviceToken: token,
        };
      }
      
      // Prepare FCM payload
      const payload: {
        to: string;
        notification: {
          title: string;
          body: string;
          image?: string;
          sound: string;
          badge?: number;
          click_action?: string;
        };
        data: Record<string, string>;
        priority: PushPriority;
        content_available: boolean;
        mutable_content: boolean;
        time_to_live?: number;
        collapse_key?: string;
      } = {
        to: token,
        notification: {
          title: notification.title,
          body: notification.body,
          image: notification.imageUrl,
          sound: notification.sound || 'default',
          badge: notification.badge,
          click_action: notification.clickAction,
        },
        data: notification.data || {},
        priority: notification.priority || PushPriority.HIGH,
        content_available: true,
        mutable_content: true,
      };
      
      // Add optional fields
      if (notification.ttl) {
        payload.time_to_live = notification.ttl;
      }
      
      if (notification.collapseKey) {
        payload.collapse_key = notification.collapseKey;
      }
      
      // Send FCM notification
      const response = await axios.post(
        'https://fcm.googleapis.com/fcm/send',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `key=${this.fcmServerKey}`,
          },
        }
      );
      
      // Check response
      if (response.data.success === 1) {
        return {
          success: true,
          messageId: response.data.results[0].message_id,
          deviceToken: token,
        };
      } else {
        return {
          success: false,
          error: response.data.results[0].error,
          deviceToken: token,
        };
      }
    } catch (error: any) {
      logger.error(`Error sending FCM notification: ${error}`);
      
      return {
        success: false,
        error: error.message,
        deviceToken: token,
      };
    }
  }
  
  /**
   * Send APNS push notification
   * @param token APNS device token
   * @param notification Push notification data
   * @returns Push notification result
   */
  private async sendApnsNotification(
    token: string,
    notification: PushNotificationData
  ): Promise<PushNotificationResult> {
    try {
      // Check if APNS is configured
      if (!this.apnsKeyId || !this.apnsTeamId || !this.apnsBundleId || !this.apnsAuthKey) {
        return {
          success: false,
          error: 'APNS credentials not fully configured',
          deviceToken: token,
        };
      }
      
      // Generate JWT token for APNS
      const jwt = this.generateApnsJwt();
      
      // Prepare APNS payload
      interface ApnsPayload {
        aps: {
          alert: {
            title: string;
            body: string;
          };
          sound: string;
          badge?: number;
          'content-available': number;
          'mutable-content': number;
          category?: string;
        };
        image_url?: string;
        [key: string]: any;
      }
      
      const payload: ApnsPayload = {
        aps: {
          alert: {
            title: notification.title,
            body: notification.body,
          },
          sound: notification.sound || 'default',
          badge: notification.badge,
          'content-available': 1,
          'mutable-content': 1,
          category: notification.category,
        },
        ...notification.data,
      };
      
      // Add image if provided
      if (notification.imageUrl) {
        payload.aps['mutable-content'] = 1;
        payload.image_url = notification.imageUrl;
      }
      
      // Determine APNS topic
      const topic = this.apnsBundleId;
      
      // Determine APNS priority
      let priority = 10; // High priority
      if (notification.priority === PushPriority.NORMAL) {
        priority = 5;
      } else if (notification.priority === PushPriority.LOW) {
        priority = 1;
      }
      
      // Determine APNS expiration
      const expiration = notification.ttl ? Math.floor(Date.now() / 1000) + notification.ttl : 0;
      
      // Determine APNS collapse ID
      const collapseId = notification.collapseKey || undefined;
      
      // Send APNS notification
      const response = await axios.post(
        `https://api.push.apple.com/3/device/${token}`,
        JSON.stringify(payload),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${jwt}`,
            'apns-topic': topic,
            'apns-priority': priority.toString(),
            'apns-expiration': expiration.toString(),
            ...(collapseId && { 'apns-collapse-id': collapseId }),
          },
        }
      );
      
      // Check response
      if (response.status === 200) {
        return {
          success: true,
          messageId: response.headers['apns-id'],
          deviceToken: token,
        };
      } else {
        return {
          success: false,
          error: response.data.reason,
          deviceToken: token,
        };
      }
    } catch (error: any) {
      logger.error(`Error sending APNS notification: ${error}`);
      
      return {
        success: false,
        error: error.message,
        deviceToken: token,
      };
    }
  }
  
  /**
   * Generate JWT token for APNS
   * @returns JWT token
   */
  private generateApnsJwt(): string {
    // Note: This is a simplified implementation
    // In a production environment, you should use a proper JWT library
    
    // Create JWT header
    const header = {
      alg: 'ES256',
      kid: this.apnsKeyId,
    };
    
    // Create JWT payload
    const payload = {
      iss: this.apnsTeamId,
      iat: Math.floor(Date.now() / 1000),
    };
    
    // Encode header and payload
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
      
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    
    // Create signature (simplified)
    // In a production environment, you should use a proper JWT library
    // to create a valid ES256 signature
    const signature = 'SIMULATED_SIGNATURE';
    
    // Return JWT token
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
  
  /**
   * Send content update notification
   * @param userId User ID
   * @param contentType Content type
   * @param contentId Content ID
   * @returns Push notification results
   */
  public async sendContentUpdateNotification(
    userId: string,
    contentType: string,
    contentId: string
  ): Promise<PushNotificationResult[]> {
    // Get content title based on type
    let title = 'New Content Available';
    let body = 'New content is available for you.';
    
    switch (contentType) {
      case 'daily_horoscope':
        title = 'Daily Horoscope';
        body = 'Your daily horoscope is now available.';
        break;
        
      case 'monthly_report':
        title = 'Monthly Report';
        body = 'Your monthly astrology report is now available.';
        break;
        
      case 'business_insight':
        title = 'Business Insight';
        body = 'New business astrology insight is available for you.';
        break;
        
      default:
        title = 'New Content';
        body = `New ${contentType.replace('_', ' ')} is available for you.`;
        break;
    }
    
    // Create notification data
    const notification: PushNotificationData = {
      title,
      body,
      data: {
        contentType,
        contentId,
        notificationType: 'content_update',
      },
      priority: PushPriority.NORMAL,
      ttl: 86400, // 24 hours
      collapseKey: `content_${contentType}_${userId}`,
    };
    
    // Send notification
    return await this.sendToUser(userId, notification);
  }
  
  /**
   * Send subscription expiration notification
   * @param userId User ID
   * @param daysRemaining Days remaining
   * @returns Push notification results
   */
  public async sendSubscriptionExpirationNotification(
    userId: string,
    daysRemaining: number
  ): Promise<PushNotificationResult[]> {
    // Create notification data
    const notification: PushNotificationData = {
      title: 'Subscription Expiring',
      body: `Your subscription will expire in ${daysRemaining} days.`,
      data: {
        daysRemaining: daysRemaining.toString(),
        notificationType: 'subscription_expiration',
      },
      priority: PushPriority.NORMAL,
      ttl: 86400, // 24 hours
      collapseKey: `subscription_expiration_${userId}`,
    };
    
    // Send notification
    return await this.sendToUser(userId, notification);
  }
  
  /**
   * Send offline sync notification
   * @param userId User ID
   * @param changesCount Number of changes
   * @returns Push notification results
   */
  public async sendOfflineSyncNotification(
    userId: string,
    changesCount: number
  ): Promise<PushNotificationResult[]> {
    // Create notification data
    const notification: PushNotificationData = {
      title: 'Data Updated',
      body: `${changesCount} updates are available to sync.`,
      data: {
        changesCount: changesCount.toString(),
        notificationType: 'offline_sync',
      },
      priority: PushPriority.LOW,
      ttl: 3600, // 1 hour
      collapseKey: `offline_sync_${userId}`,
    };
    
    // Send notification
    return await this.sendToUser(userId, notification);
  }
}

// Export singleton instance
export const pushNotificationService = PushNotificationService.getInstance();
export default pushNotificationService;
