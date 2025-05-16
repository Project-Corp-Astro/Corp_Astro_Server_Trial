// src/services/mobile/middleware/__tests__/deviceDetection.test.ts

import { Request, Response, NextFunction } from 'express';
import mobileDeviceDetection, { MobileDeviceInfo } from '../deviceDetection';
import { MobileDeviceInfo as CommonMobileDeviceInfo } from '../../../../types/common';

// Extend Request type to include deviceInfo
interface RequestWithDeviceInfo extends Request {
  deviceInfo?: MobileDeviceInfo;
}
import logger from '../../../../utils/logger';

// Mock logger
jest.mock('../../../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('Device Detection Middleware', () => {
  let mockRequest: Partial<RequestWithDeviceInfo>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should detect mobile device from user-agent', () => {
    // Mobile user agent
    mockRequest.headers = {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    };

    mobileDeviceDetection(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest).toHaveProperty('deviceInfo');
    expect(mockRequest.deviceInfo).toHaveProperty('isMobile', true);
    expect(mockRequest.deviceInfo).toHaveProperty('deviceType', 'phone');
    expect(mockRequest.deviceInfo).toHaveProperty('os', 'ios');
    expect(nextFunction).toHaveBeenCalled();
  });

  test('should detect desktop device from user-agent', () => {
    // Desktop user agent
    mockRequest.headers = {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    };

    mobileDeviceDetection(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest).toHaveProperty('deviceInfo');
    expect(mockRequest.deviceInfo).toHaveProperty('isMobile', false);
    expect(mockRequest.deviceInfo).toHaveProperty('deviceType', 'desktop');
    expect(nextFunction).toHaveBeenCalled();
  });

  test('should handle missing user-agent header', () => {
    // No user agent
    mockRequest.headers = {};

    mobileDeviceDetection(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest).toHaveProperty('deviceInfo');
    expect(mockRequest.deviceInfo).toHaveProperty('isMobile', false);
    expect(mockRequest.deviceInfo).toHaveProperty('deviceType', 'unknown');
    expect(nextFunction).toHaveBeenCalled();
  });

  test('should extract network information from headers', () => {
    mockRequest.headers = {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      'network-type': '4G',
      'battery-level': '75',
    };

    mobileDeviceDetection(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest.deviceInfo).toHaveProperty('networkType', '4G');
    expect(mockRequest.deviceInfo).toHaveProperty('batteryLevel', 75);
    expect(mockRequest.deviceInfo).toHaveProperty('isLowBattery', false);
    expect(nextFunction).toHaveBeenCalled();
  });

  test('should detect low battery condition', () => {
    mockRequest.headers = {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      'battery-level': '15',
    };

    mobileDeviceDetection(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest.deviceInfo).toHaveProperty('batteryLevel', 15);
    expect(mockRequest.deviceInfo).toHaveProperty('isLowBattery', true);
    expect(nextFunction).toHaveBeenCalled();
  });

  test('should detect low bandwidth condition', () => {
    mockRequest.headers = {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      'network-type': '2G',
    };

    mobileDeviceDetection(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest.deviceInfo).toHaveProperty('networkType', '2G');
    expect(mockRequest.deviceInfo).toHaveProperty('isLowBandwidth', true);
    expect(nextFunction).toHaveBeenCalled();
  });

  test('should handle errors gracefully', () => {
    // Force an error by making headers throw when accessed
    Object.defineProperty(mockRequest, 'headers', {
      get: () => {
        throw new Error('Test error');
      }
    });

    mobileDeviceDetection(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(logger.error).toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
  });
});
