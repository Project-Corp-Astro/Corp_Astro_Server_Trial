// src/services/mobile/middleware/__tests__/offlineSupport.test.ts

import { Request, Response, NextFunction } from 'express';
import mobileOfflineSupport from '../offlineSupport';
import logger from '../../../../utils/logger';
import { redisClient } from '../../../../config/redis.config';

// Mock logger
jest.mock('../../../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

// Mock Redis client
jest.mock('../../../../config/redis.config', () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
    keys: jest.fn(),
    expire: jest.fn(),
    flushDb: jest.fn(),
  },
}));

describe('Mobile Offline Support Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      path: '',
      method: 'GET',
      query: {},
      body: {},
      user: {
        id: 'user123',
      },
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    nextFunction = jest.fn();
    
    // Reset Redis mock
    jest.clearAllMocks();
  });

  test('should pass through non-sync requests', async () => {
    // Set a non-sync path
    // Using Object.defineProperty to override the read-only property
    Object.defineProperty(mockRequest, 'path', { value: '/api/mobile/content' });
    
    await mobileOfflineSupport(mockRequest as Request, mockResponse as Response, nextFunction);
    
    // Should call next and not process further
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test('should return 401 if user is not authenticated', async () => {
    // Set sync path but no user
    Object.defineProperty(mockRequest, 'path', { value: '/api/mobile/sync' });
    mockRequest.user = undefined;
    
    await mobileOfflineSupport(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Authentication required'),
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should return 400 if device-id header is missing', async () => {
    // Set sync path with user but no device-id
    Object.defineProperty(mockRequest, 'path', { value: '/api/mobile/sync' });
    mockRequest.user = { id: 'user123' };
    mockRequest.headers = {};
    
    await mobileOfflineSupport(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Device ID is required'),
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should handle GET request to fetch changes', async () => {
    // Set up GET request to sync endpoint
    Object.defineProperty(mockRequest, 'path', { value: '/api/mobile/sync' });
    mockRequest.method = 'GET';
    mockRequest.user = { id: 'user123' };
    mockRequest.headers = {
      'device-id': 'device123',
      'client-id': 'client123',
    };
    mockRequest.query = {
      lastSync: '1620000000000',
      resources: 'users,content',
    };
    
    // Mock Redis responses
    (redisClient.keys as jest.Mock).mockResolvedValueOnce(['sync:changes:user123:users:1', 'sync:changes:user123:users:2']);
    (redisClient.get as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify({ id: '1', resourceType: 'users', serverTimestamp: 1620000001000 }))
      .mockResolvedValueOnce(JSON.stringify({ id: '2', resourceType: 'users', serverTimestamp: 1620000002000 }))
      .mockResolvedValueOnce(null); // No conflicts
    
    await mobileOfflineSupport(mockRequest as Request, mockResponse as Response, nextFunction);
    
    // Verify response
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          changes: expect.arrayContaining([
            expect.objectContaining({ id: '1' }),
            expect.objectContaining({ id: '2' }),
          ]),
          conflicts: expect.any(Array),
          timestamp: expect.any(Number),
        }),
      })
    );
    
    // Verify Redis calls
    expect(redisClient.keys).toHaveBeenCalledWith(expect.stringContaining('sync:changes:user123'));
    expect(redisClient.set).toHaveBeenCalledWith(
      expect.stringContaining('sync:lastSync:user123:device123:client123'),
      expect.any(String)
    );
    expect(redisClient.expire).toHaveBeenCalled();
  });

  test('should handle POST request to process client changes', async () => {
    // Set up POST request to sync endpoint
    Object.defineProperty(mockRequest, 'path', { value: '/api/mobile/sync' });
    mockRequest.method = 'POST';
    mockRequest.user = { id: 'user123' };
    mockRequest.headers = {
      'device-id': 'device123',
      'client-id': 'client123',
    };
    mockRequest.body = {
      changes: [
        {
          id: 'change1',
          type: 'update',
          resourceType: 'users',
          resourceId: 'user1',
          data: { name: 'Updated Name' },
          timestamp: 1620000003000,
        },
      ],
    };
    
    // Mock Redis responses - no conflicts
    (redisClient.get as jest.Mock).mockResolvedValue(null);
    
    await mobileOfflineSupport(mockRequest as Request, mockResponse as Response, nextFunction);
    
    // Verify response
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          applied: expect.arrayContaining([
            expect.objectContaining({ id: 'change1' }),
          ]),
          conflicts: expect.any(Array),
          timestamp: expect.any(Number),
        }),
      })
    );
    
    // Verify Redis calls
    expect(redisClient.set).toHaveBeenCalledWith(
      expect.stringContaining('sync:changes:user123:users:user1'),
      expect.any(String)
    );
    expect(redisClient.expire).toHaveBeenCalled();
  });

  test('should handle PUT request to resolve conflicts', async () => {
    // Set up PUT request to sync endpoint
    Object.defineProperty(mockRequest, 'path', { value: '/api/mobile/sync' });
    mockRequest.method = 'PUT';
    mockRequest.user = { id: 'user123' };
    mockRequest.headers = {
      'device-id': 'device123',
      'client-id': 'client123',
    };
    mockRequest.body = {
      conflicts: [
        {
          id: 'conflict1',
          resolution: 'client-wins',
          data: { name: 'Resolved Name' },
        },
      ],
    };
    
    // Mock Redis responses
    (redisClient.get as jest.Mock).mockResolvedValueOnce(JSON.stringify({
      id: 'conflict1',
      clientOperation: {
        resourceType: 'users',
        resourceId: 'user1',
        clientId: 'client123',
      },
      serverOperation: {},
      resolved: false,
    }));
    
    await mobileOfflineSupport(mockRequest as Request, mockResponse as Response, nextFunction);
    
    // Verify response
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          resolved: expect.arrayContaining(['conflict1']),
          failed: expect.any(Array),
          timestamp: expect.any(Number),
        }),
      })
    );
    
    // Verify Redis calls
    expect(redisClient.get).toHaveBeenCalledWith(
      expect.stringContaining('sync:conflicts:user123:device123:conflict1')
    );
    expect(redisClient.set).toHaveBeenCalledWith(
      expect.stringContaining('sync:conflicts:user123:device123:conflict1'),
      expect.any(String)
    );
    expect(redisClient.set).toHaveBeenCalledWith(
      expect.stringContaining('sync:changes:user123:users:user1'),
      expect.any(String)
    );
  });

  test('should handle invalid method', async () => {
    // Set up DELETE request to sync endpoint (not supported)
    Object.defineProperty(mockRequest, 'path', { value: '/api/mobile/sync' });
    mockRequest.method = 'DELETE';
    mockRequest.user = { id: 'user123' };
    mockRequest.headers = {
      'device-id': 'device123',
    };
    
    await mobileOfflineSupport(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(405);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Method not allowed'),
      })
    );
  });

  test('should handle errors gracefully', async () => {
    // Set up request that will cause an error
    Object.defineProperty(mockRequest, 'path', { value: '/api/mobile/sync' });
    mockRequest.method = 'GET';
    mockRequest.user = { id: 'user123' };
    mockRequest.headers = {
      'device-id': 'device123',
    };
    
    // Force Redis to throw an error
    (redisClient.keys as jest.Mock).mockRejectedValue(new Error('Redis error'));
    
    await mobileOfflineSupport(mockRequest as Request, mockResponse as Response, nextFunction);
    
    // Verify error handling
    expect(logger.error).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Internal server error'),
        error: expect.stringContaining('Redis error'),
      })
    );
  });
});
