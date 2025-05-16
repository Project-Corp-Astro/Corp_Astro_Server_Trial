// src/utils/pushNotification.ts
import admin from '../config/firebase';

export const sendPushNotification = async (deviceToken: string, title: string, body: string) => {
  const message = {
    token: deviceToken,
    notification: {
      title,
      body,
    },
    android: {
      priority: 'high' as const,
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
        },
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    throw error;
  }
};
