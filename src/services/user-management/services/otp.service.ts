import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID_OTP;
const CLIENT_SECRET = process.env.CLIENT_SECRET_OTP;
const APP_ID = process.env.APP_ID_OTP;

export const sendOtp = async (phoneNumber: string): Promise<{ success: boolean; orderId?: string }> => {
  try {
    const response = await axios.post(
      'https://auth.otpless.app/auth/otp/v1/send',
      {
        phoneNumber,
        otpLength: 4,
        channel: 'SMS',
        expiry: 600,
        template: 'Your OTP for Astro is {{otp}}. Valid for 10 mins.',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'clientId': CLIENT_ID,
          'clientSecret': CLIENT_SECRET,
          'appId': APP_ID,
        },
      }
    );

    if (response.data.orderId) {
      return { success: true, orderId: response.data.orderId };
    }
    return { success: false };
  } catch (error: any) {
    console.error('Error sending OTP:', error.response?.data || error.message);
    return { success: false };
  }
};

export const verifyOtp = async (phoneNumber: string, otp: string, orderId: string): Promise<{ success: boolean }> => {
  try {
    const response = await axios.post(
      'https://auth.otpless.app/auth/otp/v1/verify',
      {
        phoneNumber,
        otp,
        orderId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'clientId': CLIENT_ID,
          'clientSecret': CLIENT_SECRET,
          'appId': APP_ID,
        },
      }
    );

    return { success: response.data.isOTPVerified || false };
  } catch (error: any) {
    console.error('Error verifying OTP:', error.response?.data || error.message);
    return { success: false };
  }
};