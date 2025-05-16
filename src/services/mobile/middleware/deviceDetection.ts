// src/services/mobile/middleware/deviceDetection.ts

import { Request, Response, NextFunction } from 'express';
import logger from '../../../utils/logger';
import mobileConfig from '../config/mobileConfig';

/**
 * Mobile device information interface
 */
export interface MobileDeviceInfo {
  isMobile: boolean;
  deviceType: 'phone' | 'tablet' | 'desktop' | 'unknown';
  os: 'ios' | 'android' | 'windows' | 'other' | 'unknown';
  osVersion: string;
  browser: string;
  browserVersion: string;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  networkType: 'wifi' | '5g' | '4g' | '3g' | '2g' | 'unknown';
  batteryLevel: number | null;
  isLowBandwidth: boolean;
  isLowBattery: boolean;
  appVersion: string;
}

/**
 * Detect mobile device information from request headers
 * @param req Express request
 * @returns Mobile device information
 */
export const detectMobileDevice = (req: Request): MobileDeviceInfo => {
  const userAgent = req.headers['user-agent'] || '';
  const appVersion = req.headers['app-version'] || '';
  const screenWidth = parseInt(req.headers['screen-width'] as string || '0', 10);
  const screenHeight = parseInt(req.headers['screen-height'] as string || '0', 10);
  const pixelRatio = parseFloat(req.headers['pixel-ratio'] as string || '1');
  const networkType = req.headers['network-type'] as string || 'unknown';
  const batteryLevel = parseFloat(req.headers['battery-level'] as string || '-1');
  
  // Detect if mobile device
  const isMobile = /mobile|iphone|ipad|android|windows phone/i.test(userAgent);
  
  // Detect device type
  let deviceType: 'phone' | 'tablet' | 'desktop' | 'unknown' = 'unknown';
  if (/ipad|android(?!.*mobile)/i.test(userAgent)) {
    deviceType = 'tablet';
  } else if (isMobile) {
    deviceType = 'phone';
  } else {
    deviceType = 'desktop';
  }
  
  // Detect OS
  let os: 'ios' | 'android' | 'windows' | 'other' | 'unknown' = 'unknown';
  let osVersion = 'unknown';
  
  if (/iphone|ipad|ipod/i.test(userAgent)) {
    os = 'ios';
    const match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (match) {
      osVersion = `${match[1]}.${match[2]}${match[3] ? `.${match[3]}` : ''}`;
    }
  } else if (/android/i.test(userAgent)) {
    os = 'android';
    const match = userAgent.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))?/);
    if (match) {
      osVersion = match.slice(1).filter(Boolean).join('.');
    }
  } else if (/windows phone/i.test(userAgent)) {
    os = 'windows';
    const match = userAgent.match(/Windows Phone (\d+)(?:\.(\d+))?(?:\.(\d+))?/);
    if (match) {
      osVersion = match.slice(1).filter(Boolean).join('.');
    }
  } else if (/windows|win32/i.test(userAgent)) {
    os = 'windows';
  } else {
    os = 'other';
  }
  
  // Detect browser
  let browser = 'unknown';
  let browserVersion = 'unknown';
  
  if (/chrome/i.test(userAgent)) {
    browser = 'chrome';
    const match = userAgent.match(/Chrome\/(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:\.(\d+))?/);
    if (match) {
      browserVersion = match.slice(1).filter(Boolean).join('.');
    }
  } else if (/firefox/i.test(userAgent)) {
    browser = 'firefox';
    const match = userAgent.match(/Firefox\/(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
    if (match) {
      browserVersion = match.slice(1).filter(Boolean).join('.');
    }
  } else if (/safari/i.test(userAgent)) {
    browser = 'safari';
    const match = userAgent.match(/Version\/(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
    if (match) {
      browserVersion = match.slice(1).filter(Boolean).join('.');
    }
  } else if (/edge/i.test(userAgent)) {
    browser = 'edge';
    const match = userAgent.match(/Edge\/(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
    if (match) {
      browserVersion = match.slice(1).filter(Boolean).join('.');
    }
  }
  
  // Determine if low bandwidth
  const isLowBandwidth = networkType === '2g' || networkType === '3g' || 
    (networkType === 'unknown' && req.headers['low-bandwidth'] === 'true');
  
  // Determine if low battery
  const isLowBattery = batteryLevel > 0 && batteryLevel <= mobileConfig.deviceAdaptation.lowBatteryThreshold;
  
  return {
    isMobile,
    deviceType,
    os,
    osVersion,
    browser,
    browserVersion,
    screenWidth: screenWidth || 0,
    screenHeight: screenHeight || 0,
    pixelRatio: pixelRatio || 1,
    networkType: (networkType as any) || 'unknown',
    batteryLevel: batteryLevel >= 0 ? batteryLevel : null,
    isLowBandwidth,
    isLowBattery,
    appVersion: appVersion as string || 'unknown',
  };
};

/**
 * Middleware to detect mobile device and add device info to request
 */
export const mobileDeviceDetection = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Detect mobile device
    const deviceInfo = detectMobileDevice(req);
    
    // Add device info to request
    (req as any).deviceInfo = deviceInfo;
    
    // Log device info for debugging
    logger.debug(`Mobile device detected: ${JSON.stringify(deviceInfo)}`);
    
    next();
  } catch (error) {
    logger.error(`Error detecting mobile device: ${error}`);
    next();
  }
};

export default mobileDeviceDetection;
