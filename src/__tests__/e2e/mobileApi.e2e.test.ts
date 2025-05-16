// src/__tests__/e2e/mobileApi.e2e.test.ts

import request from 'supertest';
import { Application } from 'express';
import jwt from 'jsonwebtoken';
import app from '../../app';
import { redisClient } from '../../config/redis.config';

// Mock User model since we can't find it
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

describe('Mobile API End-to-End Tests', () => {
  // Use the imported app directly
  let authToken: string;
  
  beforeAll(async () => {
    // Use the imported app directly
    
    // Create a test auth token
    const user = {
      user_id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    };
    
    // Fix JWT signing by providing proper options
    authToken = jwt.sign(
      user,
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });
  
  afterAll(async () => {
    await redisClient.disconnect();
  });
  
  describe('Mobile Authentication', () => {
    it('should validate auth token', async () => {
      const response = await request(app)
        .get('/api/mobile/auth/validate')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    
    it('should reject invalid auth token', async () => {
      const response = await request(app)
        .get('/api/mobile/auth/validate')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('Mobile Content API', () => {
    it('should fetch daily horoscope', async () => {
      const response = await request(app)
        .get('/api/mobile/content/horoscope/aries')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
    
    it('should return 404 for invalid zodiac sign', async () => {
      const response = await request(app)
        .get('/api/mobile/content/horoscope/invalid')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('Mobile Sync API', () => {
    it('should require device ID for sync', async () => {
      const response = await request(app)
        .get('/api/mobile/sync')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Device ID is required');
    });
    
    it('should sync with valid device ID', async () => {
      const response = await request(app)
        .get('/api/mobile/sync')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Device-ID', 'test-device-123')
        .set('Client-ID', 'test-client-123');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
  
  describe('Mobile Batch API', () => {
    it('should process batch requests', async () => {
      const batchRequests = {
        requests: [
          {
            method: 'GET',
            path: '/api/mobile/content/horoscope/aries',
          },
          {
            method: 'GET',
            path: '/api/mobile/user/profile',
          },
        ],
      };
      
      const response = await request(app)
        .post('/api/mobile/batch')
        .set('Authorization', `Bearer ${authToken}`)
        .send(batchRequests);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.responses)).toBe(true);
    });
  });
});
