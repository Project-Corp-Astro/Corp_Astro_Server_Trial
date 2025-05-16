// src/services/mobile/middleware/__tests__/batchProcessing.test.ts

import { Request, Response, NextFunction } from 'express';
import batchProcessing from '../batchProcessing';
import logger from '../../../../utils/logger';
import express from 'express';

// Mock logger
jest.mock('../../../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('Batch Processing Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let app: express.Application;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      body: {},
      method: 'POST',
      path: '/api/mobile/batch',
      app: {} as express.Application,
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    nextFunction = jest.fn();
    
    // Create a simple Express app for testing
    app = express();
    mockRequest.app = app;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 if requests array is missing', async () => {
    // No requests array in body
    mockRequest.body = {};
    
    await batchProcessing(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('requests array is required'),
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should return 400 if requests is not an array', async () => {
    // Requests is not an array
    mockRequest.body = {
      requests: 'not an array',
    };
    
    await batchProcessing(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('requests must be an array'),
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should return 400 if requests array is empty', async () => {
    // Empty requests array
    mockRequest.body = {
      requests: [],
    };
    
    await batchProcessing(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('requests array cannot be empty'),
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should return 400 if requests array exceeds maximum size', async () => {
    // Create an array with too many requests
    const tooManyRequests = Array(101).fill({
      method: 'GET',
      path: '/api/users',
    });
    
    mockRequest.body = {
      requests: tooManyRequests,
    };
    
    await batchProcessing(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('maximum of 100 requests'),
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should return 400 if any request is missing required fields', async () => {
    // Request missing method
    mockRequest.body = {
      requests: [
        {
          path: '/api/users',
        },
      ],
    };
    
    await batchProcessing(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Each request must have method and path'),
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should handle batch requests and return responses', async () => {
    // Mock the internal request processing
    const mockInternalRequest = jest.fn().mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: { id: '123' } });
    });
    
    // Add a route to the app
    app.get('/api/users', mockInternalRequest);
    
    // Set up batch request
    mockRequest.body = {
      requests: [
        {
          method: 'GET',
          path: '/api/users',
          headers: {
            'Content-Type': 'application/json',
          },
          query: {
            limit: '10',
          },
        },
      ],
    };
    
    // Add device info
    (mockRequest as any).deviceInfo = {
      isMobile: true,
      deviceType: 'smartphone',
      os: 'iOS',
      osVersion: '15.0',
    };
    
    // Process batch request
    await batchProcessing(mockRequest as Request, mockResponse as Response, nextFunction);
    
    // Verify response
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            status: 200,
            body: expect.objectContaining({
              success: true,
              data: expect.objectContaining({
                id: '123',
              }),
            }),
          }),
        ]),
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should handle errors gracefully', async () => {
    // Force an error
    mockRequest.body = {
      requests: [
        {
          method: 'GET',
          path: '/api/users',
        },
      ],
    };
    
    // Make the app throw an error
    app.get('/api/users', () => {
      throw new Error('Test error');
    });
    
    await batchProcessing(mockRequest as Request, mockResponse as Response, nextFunction);
    
    // Verify error handling
    expect(logger.error).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            status: 500,
            error: expect.stringContaining('Test error'),
          }),
        ]),
      })
    );
  });
});
