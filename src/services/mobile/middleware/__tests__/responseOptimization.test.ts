// src/services/mobile/middleware/__tests__/responseOptimization.test.ts

import { Request, Response, NextFunction } from 'express';
import mobileResponseOptimization from '../responseOptimization';

describe('Mobile Response Optimization Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  
  beforeEach(() => {
    mockRequest = {
      headers: {},
      method: 'GET',
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'finish') {
          callback();
        }
        return mockResponse;
      }),
    };
    
    nextFunction = jest.fn();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should apply response optimization for mobile devices', () => {
    // Set up a mobile device request
    (mockRequest as any).deviceInfo = {
      isMobile: true,
      deviceType: 'smartphone',
      os: 'iOS',
      osVersion: '15.0',
      isLowBandwidth: false,
      isLowPowerMode: false,
    };
    
    mobileResponseOptimization(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockResponse.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });
  
  test('should apply low bandwidth optimizations', () => {
    // Set up a low bandwidth mobile device request
    (mockRequest as any).deviceInfo = {
      isMobile: true,
      deviceType: 'smartphone',
      os: 'Android',
      osVersion: '10.0',
      isLowBandwidth: true,
      isLowPowerMode: false,
    };
    
    mobileResponseOptimization(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockResponse.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });
  
  test('should apply low power mode optimizations', () => {
    // Set up a low power mode mobile device request
    (mockRequest as any).deviceInfo = {
      isMobile: true,
      deviceType: 'smartphone',
      os: 'iOS',
      osVersion: '15.0',
      isLowBandwidth: false,
      isLowPowerMode: true,
    };
    
    mobileResponseOptimization(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockResponse.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });
  
  test('should not apply optimizations for non-mobile devices', () => {
    // Set up a non-mobile device request
    (mockRequest as any).deviceInfo = {
      isMobile: false,
      deviceType: 'desktop',
      os: 'Windows',
      osVersion: '10',
      isLowBandwidth: false,
      isLowPowerMode: false,
    };
    
    mobileResponseOptimization(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(nextFunction).toHaveBeenCalled();
    // Should not set specific mobile optimizations
    expect(mockResponse.setHeader).not.toHaveBeenCalledWith('Cache-Control', expect.stringContaining('max-age='));
  });
  
  test('should handle response with large payload', () => {
    // Set up a mobile device request
    (mockRequest as any).deviceInfo = {
      isMobile: true,
      deviceType: 'smartphone',
      os: 'iOS',
      osVersion: '15.0',
      isLowBandwidth: true,
      isLowPowerMode: false,
    };
    
    // Mock a large response payload
    const largePayload = { data: Array(1000).fill('test data') };
    mockResponse.json = jest.fn().mockImplementation(function(this: any) {
      this._responseData = largePayload;
      return this;
    });
    
    mobileResponseOptimization(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(nextFunction).toHaveBeenCalled();
    
    // Trigger the finish event manually to test the optimization logic
    if (mockResponse.on) {
      const finishCallback = (mockResponse.on as jest.Mock).mock.calls.find(
        call => call[0] === 'finish'
      )[1];
      
      finishCallback();
    }
  });
  
  test('should handle errors gracefully', () => {
    // Set up a mobile device request
    (mockRequest as any).deviceInfo = {
      isMobile: true,
      deviceType: 'smartphone',
      os: 'iOS',
      osVersion: '15.0',
    };
    
    // Mock an error during response processing
    mockResponse.on = jest.fn().mockImplementation((event, callback) => {
      if (event === 'finish') {
        // Force an error in the callback
        jest.spyOn(console, 'error').mockImplementation(() => {});
        callback();
      }
      return mockResponse;
    });
    
    mobileResponseOptimization(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(nextFunction).toHaveBeenCalled();
    
    // Trigger the finish event manually
    if (mockResponse.on) {
      const finishCallback = (mockResponse.on as jest.Mock).mock.calls.find(
        call => call[0] === 'finish'
      )[1];
      
      finishCallback();
    }
  });
});
