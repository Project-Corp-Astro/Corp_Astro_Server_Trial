# Push Notification System Documentation

## Overview

The Corp Astro Backend Server implements a robust push notification system to deliver personalized astrological content, alerts, and updates to mobile app users. This document details the push notification architecture, implementation, and integration points.

## Push Notification Architecture

```mermaid
flowchart TD
    Backend[Backend Server] -->|Trigger Event| NotificationService[Notification Service]
    NotificationService -->|Format Payload| FCM[Firebase Cloud Messaging]
    NotificationService -->|Format Payload| APNS[Apple Push Notification Service]
    FCM -->|Deliver| Android[Android Devices]
    APNS -->|Deliver| iOS[iOS Devices]
    
    subgraph Notification Types
        Daily[Daily Horoscopes]
        Monthly[Monthly Reports]
        Business[Business Alerts]
        Content[New Content]
        Subscription[Subscription Alerts]
    end
    
    subgraph Notification Service
        Queue[Message Queue]
        Templates[Notification Templates]
        Scheduler[Notification Scheduler]
        Analytics[Delivery Analytics]
    end
    
    Notification Types --> NotificationService
```

## Implementation Components

### Push Notification Service

Located at `src/services/notifications/pushNotificationService.ts`, this service handles the sending of push notifications to different platforms.

```typescript
// Key functions in pushNotificationService.ts
export const sendPushNotification = async (
  userId: string,
  title: string,
  body: string,
  data: Record<string, any> = {},
  options: NotificationOptions = {}
): Promise<boolean> => {
  try {
    // Get user devices
    const devices = await UserDevice.findAll({
      where: { user_id: userId, active: true }
    });
    
    if (devices.length === 0) {
      logger.info(`No active devices found for user ${userId}`);
      return false;
    }
    
    // Group devices by platform
    const androidTokens = devices
      .filter(device => device.platform === 'android')
      .map(device => device.device_token);
      
    const iosTokens = devices
      .filter(device => device.platform === 'ios')
      .map(device => device.device_token);
    
    // Send to Android devices via FCM
    if (androidTokens.length > 0) {
      await sendFCMNotification(androidTokens, title, body, data, options);
    }
    
    // Send to iOS devices via APNS
    if (iosTokens.length > 0) {
      await sendAPNSNotification(iosTokens, title, body, data, options);
    }
    
    // Log notification
    await NotificationLog.create({
      user_id: userId,
      title,
      body,
      data: JSON.stringify(data),
      sent_at: new Date()
    });
    
    return true;
  } catch (error) {
    logger.error('Error sending push notification', { error, userId });
    return false;
  }
};
```

### Firebase Cloud Messaging (FCM) Integration

Located at `src/services/notifications/fcmService.ts`, this module handles sending notifications to Android devices.

```typescript
// Key function in fcmService.ts
export const sendFCMNotification = async (
  tokens: string[],
  title: string,
  body: string,
  data: Record<string, any> = {},
  options: FCMOptions = {}
): Promise<FCMResponse> => {
  try {
    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title,
        body
      },
      data,
      android: {
        priority: options.priority || 'high',
        ttl: options.ttl || 86400,
        notification: {
          channelId: options.channelId || 'default',
          icon: options.icon || 'ic_notification',
          color: options.color || '#7B1FA2'
        }
      }
    };
    
    const response = await admin.messaging().sendMulticast(message);
    
    return {
      success: response.successCount,
      failure: response.failureCount,
      responses: response.responses
    };
  } catch (error) {
    logger.error('Error sending FCM notification', { error });
    throw error;
  }
};
```

### Apple Push Notification Service (APNS) Integration

Located at `src/services/notifications/apnsService.ts`, this module handles sending notifications to iOS devices.

```typescript
// Key function in apnsService.ts
export const sendAPNSNotification = async (
  tokens: string[],
  title: string,
  body: string,
  data: Record<string, any> = {},
  options: APNSOptions = {}
): Promise<APNSResponse> => {
  try {
    const provider = new apn.Provider({
      token: {
        key: process.env.APNS_KEY_PATH as string,
        keyId: process.env.APNS_KEY_ID as string,
        teamId: process.env.APNS_TEAM_ID as string
      },
      production: process.env.NODE_ENV === 'production'
    });
    
    const notification = new apn.Notification();
    
    notification.expiry = Math.floor(Date.now() / 1000) + (options.ttl || 86400);
    notification.badge = options.badge;
    notification.sound = options.sound || 'default';
    notification.alert = {
      title,
      body
    };
    notification.payload = data;
    notification.topic = process.env.APNS_BUNDLE_ID as string;
    
    const results = await Promise.all(
      tokens.map(token => provider.send(notification, token))
    );
    
    provider.shutdown();
    
    const successCount = results.reduce(
      (count, result) => count + result.sent.length, 0
    );
    
    const failureCount = results.reduce(
      (count, result) => count + result.failed.length, 0
    );
    
    return {
      success: successCount,
      failure: failureCount,
      responses: results
    };
  } catch (error) {
    logger.error('Error sending APNS notification', { error });
    throw error;
  }
};
```

### Notification Templates

Located at `src/services/notifications/templates/`, these files contain templates for different types of notifications.

```typescript
// Example template in dailyHoroscopeTemplate.ts
export const getDailyHoroscopeNotification = (
  userName: string,
  sign: string
): NotificationTemplate => {
  const templates = [
    {
      title: `${sign} Daily Horoscope`,
      body: `${userName}, your daily business horoscope is ready! Tap to see what the stars have in store for you today.`
    },
    {
      title: `Business Insights for ${sign}`,
      body: `${userName}, check out today's astrological insights for your business decisions.`
    },
    {
      title: `Today's ${sign} Forecast`,
      body: `${userName}, your personalized business forecast for today is now available.`
    }
  ];
  
  // Randomly select a template for variety
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    title: template.title,
    body: template.body,
    data: {
      type: 'daily_horoscope',
      sign,
      date: new Date().toISOString().split('T')[0]
    }
  };
};
```

### Notification Scheduler

Located at `src/services/notifications/notificationScheduler.ts`, this module handles scheduling notifications for future delivery.

```typescript
// Key function in notificationScheduler.ts
export const scheduleNotification = async (
  userId: string,
  title: string,
  body: string,
  scheduledTime: Date,
  data: Record<string, any> = {},
  options: NotificationOptions = {}
): Promise<string> => {
  try {
    // Create scheduled notification record
    const scheduledNotification = await ScheduledNotification.create({
      user_id: userId,
      title,
      body,
      data: JSON.stringify(data),
      options: JSON.stringify(options),
      scheduled_time: scheduledTime,
      status: 'pending'
    });
    
    // Add to queue for processing
    await queueManager.add('sendScheduledNotification', {
      notificationId: scheduledNotification.id
    }, {
      delay: scheduledTime.getTime() - Date.now(),
      removeOnComplete: true
    });
    
    return scheduledNotification.id;
  } catch (error) {
    logger.error('Error scheduling notification', { error, userId });
    throw error;
  }
};
```

## Notification Types

The system supports various types of notifications:

1. **Daily Horoscopes**: Sent daily with personalized astrological insights
2. **Monthly Reports**: Sent when monthly reports are generated
3. **Business Alerts**: Sent for important business astrological events
4. **Content Updates**: Sent when new content is available
5. **Subscription Alerts**: Sent for subscription-related events (renewal, expiry)

## Mobile Integration

### Device Registration

```typescript
// Example: Registering device token on mobile (React Native)
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import api from '../api';

const registerDeviceForNotifications = async () => {
  // Request permission
  const authStatus = await messaging().requestPermission();
  
  if (authStatus !== messaging.AuthorizationStatus.AUTHORIZED) {
    console.log('User denied notification permissions');
    return false;
  }
  
  // Get FCM token
  const token = await messaging().getToken();
  
  // Register with backend
  await api.post('/api/notifications/register-device', {
    device_token: token,
    platform: Platform.OS,
    device_info: {
      model: Device.modelName,
      os_version: Device.osVersion,
      app_version: DeviceInfo.getVersion()
    }
  });
  
  return true;
};
```

### Handling Notifications

```typescript
// Example: Handling notifications on mobile (React Native)
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

// Configure local notifications
PushNotification.configure({
  onNotification: function(notification) {
    // Process notification
    console.log('NOTIFICATION:', notification);
    
    // Navigate based on notification type
    if (notification.data.type === 'daily_horoscope') {
      navigation.navigate('DailyHoroscope', {
        date: notification.data.date,
        sign: notification.data.sign
      });
    }
  }
});

// Handle background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  
  // Create local notification
  PushNotification.localNotification({
    channelId: 'default',
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
    data: remoteMessage.data
  });
});

// Handle foreground messages
const unsubscribe = messaging().onMessage(async remoteMessage => {
  console.log('A new FCM message arrived!', remoteMessage);
  
  // Create local notification
  PushNotification.localNotification({
    channelId: 'default',
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
    data: remoteMessage.data
  });
});
```

## Analytics Integration

The push notification system integrates with the analytics system to track:

1. **Delivery Rates**: Percentage of notifications successfully delivered
2. **Open Rates**: Percentage of notifications opened by users
3. **Conversion Rates**: Actions taken after opening notifications
4. **Opt-Out Rates**: Users who disable notifications

```typescript
// Example: Tracking notification open in analytics
export const trackNotificationOpen = async (
  userId: string,
  notificationId: string
): Promise<void> => {
  await analyticsService.trackEvent({
    userId,
    eventName: 'notification_opened',
    eventCategory: 'engagement',
    properties: {
      notification_id: notificationId
    }
  });
};
```

## Testing Push Notifications

```bash
# Test sending push notification
curl -X POST https://api.corpastro.com/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": "user-123",
    "title": "Test Notification",
    "body": "This is a test notification",
    "data": {
      "type": "test",
      "custom_field": "custom_value"
    }
  }'

# Test scheduling push notification
curl -X POST https://api.corpastro.com/api/notifications/schedule \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": "user-123",
    "title": "Scheduled Notification",
    "body": "This is a scheduled notification",
    "scheduled_time": "2025-05-18T10:00:00Z",
    "data": {
      "type": "test",
      "custom_field": "custom_value"
    }
  }'
```
