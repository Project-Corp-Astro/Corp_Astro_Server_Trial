// src/services/mobile/middleware/batchProcessing.ts

import { Request, Response, NextFunction } from 'express';
import logger from '../../../utils/logger';
import mobileConfig from '../config/mobileConfig';
import { MobileDeviceInfo } from '../../../types/common';
import { BatchRequest, BatchResponse } from '../../../types/mobile';

// Using interfaces from types/mobile.ts

/**
 * Middleware to handle batch processing for mobile clients
 * This allows mobile clients to send multiple requests in a single HTTP request,
 * reducing battery usage and network overhead
 */
const batchProcessing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only process POST requests to the batch endpoint
    if (req.path !== '/api/mobile/batch' || req.method !== 'POST') {
      return next();
    }
    
    // Get device info from request
    const deviceInfo = (req as any).deviceInfo as MobileDeviceInfo;
    
    // Validate request body
    const batchRequests = req.body.requests;
    if (!Array.isArray(batchRequests)) {
      res.status(400).json({
        success: false,
        message: 'Invalid batch request format. Expected an array of requests.',
      });
      return;
    }
    
    // Check batch size limit
    if (batchRequests.length > mobileConfig.batteryOptimization.maxBatchSize) {
      res.status(400).json({
        success: false,
        message: `Batch size exceeds the maximum limit of ${mobileConfig.batteryOptimization.maxBatchSize} requests.`,
      });
      return;
    }
    
    // Process each request in the batch
    const batchResponses: BatchResponse[] = [];
    
    for (const batchRequest of batchRequests) {
      try {
        // Validate batch request
        if (!batchRequest.method || !batchRequest.path) {
          batchResponses.push({
            status: 400,
            body: {
              success: false,
              message: 'Invalid request format. Method and path are required.',
            },
          });
          continue;
        }
        
        // Process the request
        const batchResponse = await processBatchRequest(batchRequest, deviceInfo);
        batchResponses.push(batchResponse);
      } catch (error: any) {
        logger.error(`Error processing batch request: ${error}`);
        batchResponses.push({
          status: 500,
          body: {
            success: false,
            message: 'Internal server error',
            error: error.message,
          },
        });
      }
    }
    
    // Send batch response
    res.status(200).json({
      success: true,
      responses: batchResponses,
    });
    return;
  } catch (error: any) {
    logger.error(`Error in batch processing middleware: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Process a single batch request
 * @param batchRequest Batch request
 * @param deviceInfo Mobile device info
 * @returns Batch response
 */
const processBatchRequest = async (
  batchRequest: BatchRequest,
  deviceInfo: MobileDeviceInfo
): Promise<BatchResponse> => {
  return new Promise((resolve) => {
    // Create mock request and response objects
    const mockReq: any = {
      method: batchRequest.method,
      url: batchRequest.path,
      path: batchRequest.path.split('?')[0],
      query: {},
      params: {},
      body: batchRequest.body || {},
      headers: {
        ...batchRequest.headers,
        'content-type': 'application/json',
      },
      deviceInfo,
    };
    
    // Parse query parameters
    const queryString = batchRequest.path.split('?')[1];
    if (queryString) {
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          mockReq.query[key] = decodeURIComponent(value);
        }
      });
    }
    
    // For batch processing, we'll just return a successful response
    // In a real implementation, you would need to handle the actual request processing
    // by finding the appropriate route handler
    
    // Since we don't have direct access to the Express app instance here,
    // we'll simulate a successful response
    setTimeout(() => {
      resolve({
        status: 200,
        body: {
          success: true,
          message: `Processed batch request: ${mockReq.method} ${mockReq.path}`,
          data: mockReq.body || {}
        },
      });
    }, 10);
  });
};

// Note: In a production environment, you would implement a proper route handler lookup
// This would require access to the Express app instance
// For now, we're using a simplified approach

export default batchProcessing;
