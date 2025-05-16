// src/__tests__/utils/testUtils.ts

import { Application } from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { redisClient } from '../../config/redis.config';
import User, { Role, AccountStatus } from '../../services/user-management/models/user';

/**
 * Test user data
 */
export interface TestUser {
  user_id: string;
  email?: string;
  full_name: string;
  user_role: Role;
  subscriptionType: string;
  phone_number: string;
}

/**
 * Create a test user in the database
 * @param userData Partial user data to override defaults
 * @returns Created test user
 */
export const createTestUser = async (userData: Partial<TestUser> = {}): Promise<TestUser> => {
  // Generate a UUID for user_id
  const uuid = require('uuid');
  
  // Create a user in the database with required fields
  const user = await User.create({
    user_id: uuid.v4(), // Generate a UUID for the user_id
    email: userData.email || 'test@example.com',
    full_name: userData.full_name || 'Test User',
    phone_number: userData.phone_number || '+1234567890',
    date_of_birth: '1990-01-01',
    time_of_birth: '12:00:00',
    place_of_birth: 'Test City',
    birth_timezone: 'UTC',
    timezone_offset: 0,
    preferred_language: 'en',
    user_role: userData.user_role || Role.User,
    subscriptionType: userData.subscriptionType || 'free',
    notification_preferences: { push: true, email: true, sms: true },
    account_status: AccountStatus.ACTIVE
  });
  
  return {
    user_id: user.user_id,
    email: user.email,
    full_name: user.full_name,
    user_role: user.user_role,
    subscriptionType: user.subscriptionType,
    phone_number: user.phone_number
  };
};

/**
 * Generate a JWT token for a test user
 * @param user Test user
 * @returns JWT token
 */
export const generateToken = (user: TestUser): string => {
  const jwtSecret = process.env.JWT_SECRET || 'test_jwt_secret';
  const payload = {
    user_id: user.user_id,
    email: user.email,
    user_role: user.user_role,
  };
  
  // Use the secret directly as a string
  // @ts-ignore - Ignoring type issues with jwt.sign
  return jwt.sign(payload, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

/**
 * Create an authenticated request for testing
 * @param app Express application
 * @param user Test user
 * @returns Supertest request with authentication
 */
export const authenticatedRequest = (app: Application, user: TestUser) => {
  const token = generateToken(user);
  return request(app).set('Authorization', `Bearer ${token}`);
};

/**
 * Mock Redis client for testing
 */
export const mockRedisClient = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  exists: jest.fn(),
  expire: jest.fn(),
  keys: jest.fn(),
  flushDb: jest.fn(),
  select: jest.fn(),
  sAdd: jest.fn(),
  sMembers: jest.fn(),
  sRem: jest.fn(),
  quit: jest.fn(),
};

/**
 * Set up mock Redis client
 */
export const setupMockRedis = () => {
  jest.mock('../../config/redis.config', () => ({
    redisClient: mockRedisClient,
  }));
};

/**
 * Reset mock Redis client
 */
export const resetMockRedis = () => {
  Object.keys(mockRedisClient).forEach(key => {
    mockRedisClient[key].mockReset();
  });
};

/**
 * Import type definitions
 */
import { MobileDeviceInfo } from '../../types/common';
import { Request } from 'express';
import { DeviceAwareRequest } from '../../types/common';

/**
 * Mock device info for mobile testing
 */
export const mockDeviceInfo: MobileDeviceInfo = {
  isMobile: true,
  deviceType: 'phone',
  os: 'ios',
  osVersion: '15.0',
  browser: 'safari',
  browserVersion: '15.0',
  isLowBandwidth: false,
  isLowBattery: false,
  networkType: '4g',
  batteryLevel: 80,
  screenWidth: 375,
  screenHeight: 812,
  pixelRatio: 3,
  appVersion: '1.0.0'
};

/**
 * Add mock device info to request
 * @param req Express request
 * @param deviceInfo Device info to add
 */
export const addMockDeviceInfo = (req: Request, deviceInfo = mockDeviceInfo): DeviceAwareRequest => {
  (req as DeviceAwareRequest).deviceInfo = deviceInfo;
  return req as DeviceAwareRequest;
};
