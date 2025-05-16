// src/services/mobile/middleware/responseOptimization.ts

import { Request, Response, NextFunction } from 'express';
import logger from '../../../utils/logger';
import mobileConfig from '../config/mobileConfig';
import { MobileDeviceInfo } from './deviceDetection';
import { redisClient } from '../../../config/redis.config';
import { cacheManager } from '../../performance/utils/cacheManager';

/**
 * Middleware to optimize API responses for mobile clients
 * - Reduces payload size by removing unnecessary fields
 * - Applies field filtering based on query parameters
 * - Implements differential updates
 * - Handles pagination
 */
export const mobileResponseOptimization = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get device info from request
    const deviceInfo = (req as any).deviceInfo as MobileDeviceInfo;
    
    if (!deviceInfo || !deviceInfo.isMobile) {
      // Not a mobile device, skip optimization
      return next();
    }
    
    // Store original send method
    const originalSend = res.send;
    
    // Override send method
    res.send = function(body: any): Response {
      try {
        // Only optimize JSON responses
        if (typeof body === 'string' && body.startsWith('{')) {
          try {
            const jsonBody = JSON.parse(body);
            const optimizedBody = optimizeResponseBody(jsonBody, req, deviceInfo);
            body = JSON.stringify(optimizedBody);
          } catch (parseError) {
            // Not valid JSON, skip optimization
            logger.debug(`Could not parse response as JSON: ${parseError}`);
          }
        } else if (typeof body === 'object') {
          // Already an object
          body = optimizeResponseBody(body, req, deviceInfo);
        }
        
        // Add mobile optimization headers
        res.set('X-Mobile-Optimized', 'true');
        
        // Apply response compression if needed
        const contentLength = typeof body === 'string' ? Buffer.byteLength(body, 'utf8') : 0;
        if (contentLength > mobileConfig.responseOptimization.compressionThreshold * 1024) {
          res.set('Content-Encoding', 'gzip');
        }
        
        // Set cache control headers for mobile clients
        if (!res.get('Cache-Control')) {
          // Default cache control for mobile clients
          res.set('Cache-Control', 'private, max-age=300'); // 5 minutes
        }
      } catch (error) {
        logger.error(`Error optimizing mobile response: ${error}`);
      }
      
      // Call original send method
      return originalSend.call(this, body);
    };
    
    next();
  } catch (error) {
    logger.error(`Error in mobile response optimization middleware: ${error}`);
    next();
  }
};

/**
 * Optimize response body for mobile clients
 * @param body Response body
 * @param req Express request
 * @param deviceInfo Mobile device info
 * @returns Optimized response body
 */
const optimizeResponseBody = (body: any, req: Request, deviceInfo: MobileDeviceInfo): any => {
  // Skip optimization if body is not an object
  if (!body || typeof body !== 'object') {
    return body;
  }
  
  // Get optimization options from query parameters
  const fields = req.query.fields as string;
  const exclude = req.query.exclude as string;
  const since = req.query.since as string;
  const page = parseInt(req.query.page as string || '1', 10);
  const pageSize = parseInt(req.query.pageSize as string || mobileConfig.bandwidthOptimization.defaultPageSize.toString(), 10);
  
  // Create a copy of the body to avoid modifying the original
  let optimizedBody = { ...body };
  
  // Apply field filtering if enabled
  if (mobileConfig.bandwidthOptimization.enableFieldFiltering) {
    optimizedBody = applyFieldFiltering(optimizedBody, fields, exclude);
  }
  
  // Apply differential updates if enabled
  if (mobileConfig.bandwidthOptimization.enableDifferentialUpdates && since) {
    optimizedBody = applyDifferentialUpdates(optimizedBody, since);
  }
  
  // Apply pagination if enabled
  if (mobileConfig.bandwidthOptimization.enablePagination && Array.isArray(optimizedBody.data)) {
    optimizedBody = applyPagination(optimizedBody, page, pageSize);
  }
  
  // Apply device-specific optimizations
  if (mobileConfig.deviceAdaptation.enableDeviceOptimization) {
    optimizedBody = applyDeviceOptimizations(optimizedBody, deviceInfo);
  }
  
  // Add optimization metadata
  optimizedBody._meta = {
    optimized: true,
    timestamp: new Date().toISOString(),
    deviceType: deviceInfo.deviceType,
    os: deviceInfo.os,
  };
  
  return optimizedBody;
};

/**
 * Apply field filtering to response body
 * @param body Response body
 * @param fields Comma-separated list of fields to include
 * @param exclude Comma-separated list of fields to exclude
 * @returns Filtered response body
 */
const applyFieldFiltering = (body: any, fields?: string, exclude?: string): any => {
  // If body is an array, apply filtering to each item
  if (Array.isArray(body)) {
    return body.map(item => applyFieldFiltering(item, fields, exclude));
  }
  
  // If body is not an object, return as is
  if (!body || typeof body !== 'object') {
    return body;
  }
  
  // Create a new object with filtered fields
  const result: any = {};
  
  if (fields) {
    // Include only specified fields
    const fieldList = fields.split(',').map(f => f.trim());
    
    for (const field of fieldList) {
      if (field in body) {
        result[field] = body[field];
      }
    }
  } else {
    // Include all fields except excluded ones
    const excludeList = exclude 
      ? exclude.split(',').map(f => f.trim())
      : mobileConfig.bandwidthOptimization.defaultExcludedFields;
    
    for (const key in body) {
      if (!excludeList.includes(key)) {
        result[key] = body[key];
      }
    }
  }
  
  return result;
};

/**
 * Apply differential updates to response body
 * @param body Response body
 * @param since Timestamp to compare against
 * @returns Differential response body
 */
const applyDifferentialUpdates = (body: any, since: string): any => {
  try {
    const sinceDate = new Date(since);
    
    // If body is an array, apply differential updates to each item
    if (Array.isArray(body)) {
      // Filter items updated since the given timestamp
      return {
        data: body.filter(item => {
          const updatedAt = item.updated_at ? new Date(item.updated_at) : null;
          return updatedAt && updatedAt > sinceDate;
        }),
        _differential: {
          since,
          totalCount: body.length,
        },
      };
    }
    
    // If body has a data array, apply differential updates to it
    if (body.data && Array.isArray(body.data)) {
      return {
        ...body,
        data: body.data.filter(item => {
          const updatedAt = item.updated_at ? new Date(item.updated_at) : null;
          return updatedAt && updatedAt > sinceDate;
        }),
        _differential: {
          since,
          totalCount: body.data.length,
        },
      };
    }
    
    // If body is an object, check if it was updated since the given timestamp
    const updatedAt = body.updated_at ? new Date(body.updated_at) : null;
    if (updatedAt && updatedAt <= sinceDate) {
      // Object hasn't been updated, return minimal response
      return {
        id: body.id,
        _differential: {
          unchanged: true,
          since,
        },
      };
    }
    
    // Object has been updated, return full object with differential metadata
    return {
      ...body,
      _differential: {
        changed: true,
        since,
      },
    };
  } catch (error) {
    logger.error(`Error applying differential updates: ${error}`);
    return body;
  }
};

/**
 * Apply pagination to response body
 * @param body Response body
 * @param page Page number
 * @param pageSize Page size
 * @returns Paginated response body
 */
const applyPagination = (body: any, page: number, pageSize: number): any => {
  // Validate page and pageSize
  const validPage = Math.max(1, page);
  const validPageSize = Math.min(
    Math.max(1, pageSize),
    mobileConfig.bandwidthOptimization.maxPageSize
  );
  
  // If body is an array, paginate it
  if (Array.isArray(body)) {
    const totalCount = body.length;
    const startIndex = (validPage - 1) * validPageSize;
    const endIndex = startIndex + validPageSize;
    const paginatedData = body.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      pagination: {
        page: validPage,
        pageSize: validPageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / validPageSize),
        hasMore: endIndex < totalCount,
      },
    };
  }
  
  // If body has a data array, paginate it
  if (body.data && Array.isArray(body.data)) {
    const totalCount = body.data.length;
    const startIndex = (validPage - 1) * validPageSize;
    const endIndex = startIndex + validPageSize;
    const paginatedData = body.data.slice(startIndex, endIndex);
    
    return {
      ...body,
      data: paginatedData,
      pagination: {
        page: validPage,
        pageSize: validPageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / validPageSize),
        hasMore: endIndex < totalCount,
      },
    };
  }
  
  // If body is not an array or doesn't have a data array, return as is
  return body;
};

/**
 * Apply device-specific optimizations to response body
 * @param body Response body
 * @param deviceInfo Mobile device info
 * @returns Optimized response body
 */
const applyDeviceOptimizations = (body: any, deviceInfo: MobileDeviceInfo): any => {
  // If low bandwidth mode, apply more aggressive optimizations
  if (deviceInfo.isLowBandwidth) {
    // Remove non-essential data
    if (body.metadata) {
      delete body.metadata;
    }
    
    // Truncate long text fields
    if (body.description && typeof body.description === 'string' && body.description.length > 100) {
      body.description = body.description.substring(0, 100) + '...';
    }
    
    // Reduce image quality
    if (body.imageUrl && typeof body.imageUrl === 'string') {
      // Add query parameter to reduce image quality
      body.imageUrl = addImageQualityParam(body.imageUrl, 60); // Lower quality for low bandwidth
    }
  }
  
  // If low battery mode, apply battery-saving optimizations
  if (deviceInfo.isLowBattery) {
    // Reduce data processing load
    if (body.animations) {
      body.animations = false;
    }
    
    // Suggest client-side caching
    body._meta = {
      ...(body._meta || {}),
      cacheSuggestion: 'aggressive',
      batteryOptimized: true,
    };
  }
  
  return body;
};

/**
 * Add image quality parameter to URL
 * @param url Image URL
 * @param quality Image quality (0-100)
 * @returns URL with quality parameter
 */
const addImageQualityParam = (url: string, quality: number): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}q=${quality}`;
};

export default mobileResponseOptimization;
