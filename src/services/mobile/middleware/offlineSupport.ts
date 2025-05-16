// src/services/mobile/middleware/offlineSupport.ts

import { Request, Response, NextFunction } from 'express';
import logger from '../../../utils/logger';
import mobileConfig from '../config/mobileConfig';
import { redisClient } from '../../../config/redis.config';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../../../types/common';
import { SyncOperation, SyncOperationType, SyncConflict } from '../../../types/mobile';

/**
 * Middleware to handle offline data synchronization for mobile clients
 */
const mobileOfflineSupport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only process requests to the sync endpoint
    if (req.path !== '/api/mobile/sync') {
      return next();
    }
    
    // Get user ID from request
    const userId = req.user?.user_id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required for data synchronization',
      });
      return;
    }
    
    // Get device ID from request
    const deviceId = req.headers['device-id'] as string;
    if (!deviceId) {
      res.status(400).json({
        success: false,
        message: 'Device ID is required for data synchronization',
      });
      return;
    }
    
    // Get client ID from request
    const clientId = req.headers['client-id'] as string || uuidv4();
    
    // Handle sync request based on method
    switch (req.method) {
      case 'GET':
        // Get changes since last sync
        await handleGetChanges(req, res, userId, deviceId, clientId);
        break;
        
      case 'POST':
        // Process client changes
        await handlePostChanges(req, res, userId, deviceId, clientId);
        break;
        
      case 'PUT':
        // Resolve conflicts
        await handleResolveConflicts(req, res, userId, deviceId, clientId);
        break;
        
      default:
        res.status(405).json({
          success: false,
          message: 'Method not allowed',
        });
        return;
    }
  } catch (error: any) {
    logger.error(`Error in offline support middleware: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Handle GET request to get changes since last sync
 * @param req Express request
 * @param res Express response
 * @param userId User ID
 * @param deviceId Device ID
 * @param clientId Client ID
 */
const handleGetChanges = async (
  req: Request,
  res: Response,
  userId: string,
  deviceId: string,
  clientId: string
): Promise<void> => {
  try {
    // Get last sync timestamp from query parameters
    const lastSyncTimestamp = parseInt(req.query.lastSync as string || '0', 10);
    
    // Get resource types to sync from query parameters
    const resourceTypes = (req.query.resources as string || '')
      .split(',')
      .filter(Boolean)
      .map(type => type.trim());
    
    // Get server changes since last sync
    const serverChanges = await getServerChangesSince(userId, lastSyncTimestamp, resourceTypes);
    
    // Get unresolved conflicts
    const conflicts = await getUnresolvedConflicts(userId, deviceId);
    
    // Get current server timestamp
    const serverTimestamp = Date.now();
    
    // Update last sync timestamp
    await updateLastSyncTimestamp(userId, deviceId, clientId, serverTimestamp);
    
    // Send response
    res.status(200).json({
      success: true,
      data: {
        changes: serverChanges,
        conflicts,
        timestamp: serverTimestamp,
      },
    });
  } catch (error: any) {
    logger.error(`Error getting changes: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Error getting changes',
      error: error.message,
    });
  }
};

/**
 * Handle POST request to process client changes
 * @param req Express request
 * @param res Express response
 * @param userId User ID
 * @param deviceId Device ID
 * @param clientId Client ID
 */
const handlePostChanges = async (
  req: Request,
  res: Response,
  userId: string,
  deviceId: string,
  clientId: string
): Promise<void> => {
  try {
    // Get client changes from request body
    const clientChanges = req.body.changes || [];
    
    if (!Array.isArray(clientChanges)) {
      res.status(400).json({
        success: false,
        message: 'Invalid changes format. Expected an array of changes.',
      });
      return;
    }
    
    // Process client changes
    const result = await processClientChanges(clientChanges, userId, deviceId, clientId);
    
    // Get current server timestamp
    const serverTimestamp = Date.now();
    
    // Update last sync timestamp
    await updateLastSyncTimestamp(userId, deviceId, clientId, serverTimestamp);
    
    // Send response
    res.status(200).json({
      success: true,
      data: {
        applied: result.applied,
        conflicts: result.conflicts,
        timestamp: serverTimestamp,
      },
    });
  } catch (error: any) {
    logger.error(`Error processing changes: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Error processing changes',
      error: error.message,
    });
  }
};

/**
 * Handle PUT request to resolve conflicts
 * @param req Express request
 * @param res Express response
 * @param userId User ID
 * @param deviceId Device ID
 * @param clientId Client ID
 */
const handleResolveConflicts = async (
  req: Request,
  res: Response,
  userId: string,
  deviceId: string,
  clientId: string
): Promise<void> => {
  try {
    // Get resolved conflicts from request body
    const resolvedConflicts = req.body.conflicts || [];
    // Validate sync data
    if (!req.body.operations || !Array.isArray(req.body.operations)) {
      res.status(400).json({
        success: false,
        message: 'Invalid conflicts format. Expected an array of resolved conflicts.',
      });
      return;
    }
    
    if (!Array.isArray(resolvedConflicts)) {
      res.status(400).json({
        success: false,
        message: 'Invalid conflicts format. Expected an array of resolved conflicts.',
      });
      return;
    }
    
    // Process resolved conflicts
    const result = await processResolvedConflicts(resolvedConflicts, userId, deviceId);
    
    // Get current server timestamp
    const serverTimestamp = Date.now();
    
    // Update last sync timestamp
    await updateLastSyncTimestamp(userId, deviceId, clientId, serverTimestamp);
    
    // Send response
    res.status(200).json({
      success: true,
      data: {
        resolved: result.resolved,
        failed: result.failed,
        timestamp: serverTimestamp,
      },
    });
  } catch (error: any) {
    logger.error(`Error resolving conflicts: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Error resolving conflicts',
      error: error.message,
    });
  }
};

/**
 * Get server changes since last sync
 * @param userId User ID
 * @param lastSyncTimestamp Last sync timestamp
 * @param resourceTypes Resource types to sync
 * @returns Server changes
 */
const getServerChangesSince = async (
  userId: string,
  lastSyncTimestamp: number,
  resourceTypes: string[]
): Promise<any[]> => {
  try {
    // Get all changes for the user since the last sync
    const changes: any[] = [];
    
    // Get changes from each resource type
    for (const resourceType of resourceTypes) {
      // Get changes from Redis
      const changeKeys = await redisClient.keys(`sync:changes:${userId}:${resourceType}:*`);
      
      for (const key of changeKeys) {
        const changeData = await redisClient.get(key);
        
        if (changeData) {
          const change = JSON.parse(changeData);
          
          // Only include changes after the last sync
          if (change.serverTimestamp > lastSyncTimestamp) {
            changes.push(change);
          }
        }
      }
    }
    
    return changes;
  } catch (error) {
    logger.error(`Error getting server changes: ${error}`);
    return [];
  }
};

/**
 * Get unresolved conflicts for a user and device
 * @param userId User ID
 * @param deviceId Device ID
 * @returns Unresolved conflicts
 */
const getUnresolvedConflicts = async (
  userId: string,
  deviceId: string
): Promise<SyncConflict[]> => {
  try {
    // Get all conflicts for the user and device
    const conflictKeys = await redisClient.keys(`sync:conflicts:${userId}:${deviceId}:*`);
    const conflicts: SyncConflict[] = [];
    
    for (const key of conflictKeys) {
      const conflictData = await redisClient.get(key);
      
      if (conflictData) {
        const conflict = JSON.parse(conflictData);
        
        // Only include unresolved conflicts
        if (!conflict.resolved) {
          conflicts.push(conflict);
        }
      }
    }
    
    return conflicts;
  } catch (error) {
    logger.error(`Error getting unresolved conflicts: ${error}`);
    return [];
  }
};

/**
 * Update last sync timestamp
 * @param userId User ID
 * @param deviceId Device ID
 * @param clientId Client ID
 * @param timestamp Timestamp
 */
const updateLastSyncTimestamp = async (
  userId: string,
  deviceId: string,
  clientId: string,
  timestamp: number
): Promise<void> => {
  try {
    // Update last sync timestamp in Redis
    await redisClient.set(`sync:lastSync:${userId}:${deviceId}:${clientId}`, timestamp.toString());
    
    // Set expiration time (30 days)
    await redisClient.expire(`sync:lastSync:${userId}:${deviceId}:${clientId}`, 30 * 24 * 60 * 60);
  } catch (error) {
    logger.error(`Error updating last sync timestamp: ${error}`);
  }
};

/**
 * Process client changes
 * @param changes Client changes
 * @param userId User ID
 * @param deviceId Device ID
 * @param clientId Client ID
 * @returns Processing result
 */
const processClientChanges = async (
  changes: any[],
  userId: string,
  deviceId: string,
  clientId: string
): Promise<{ applied: any[]; conflicts: SyncConflict[] }> => {
  const applied: any[] = [];
  const conflicts: SyncConflict[] = [];
  
  // Process each change
  for (const change of changes) {
    try {
      // Validate change
      if (!change.id || !change.type || !change.resourceType || !change.resourceId) {
        logger.warn(`Invalid change format: ${JSON.stringify(change)}`);
        continue;
      }
      
      // Create sync operation
      const clientOperation: SyncOperation = {
        id: change.id,
        type: change.type,
        resourceType: change.resourceType,
        resourceId: change.resourceId,
        data: change.data,
        timestamp: change.timestamp || Date.now(),
        deviceId,
        userId,
        clientId,
        resolved: false,
        serverTimestamp: Date.now(),
      };
      
      // Check for conflicts
      const conflict = await checkForConflict(clientOperation);
      
      if (conflict) {
        // Add to conflicts
        conflicts.push(conflict);
      } else {
        // Apply change
        await applyChange(clientOperation);
        applied.push(clientOperation);
      }
    } catch (error) {
      logger.error(`Error processing change: ${error}`);
    }
  }
  
  return { applied, conflicts };
};

/**
 * Check for conflict with a client operation
 * @param clientOperation Client operation
 * @returns Conflict or null if no conflict
 */
const checkForConflict = async (clientOperation: SyncOperation): Promise<SyncConflict | null> => {
  try {
    // Get the latest server operation for the same resource
    const serverOperationKey = `sync:changes:${clientOperation.userId}:${clientOperation.resourceType}:${clientOperation.resourceId}`;
    const serverOperationData = await redisClient.get(serverOperationKey);
    
    if (!serverOperationData) {
      // No server operation, no conflict
      return null;
    }
    
    const serverOperation = JSON.parse(serverOperationData);
    
    // Check if the server operation is newer than the client operation
    if (serverOperation.timestamp > clientOperation.timestamp) {
      // Create conflict
      const conflict: SyncConflict = {
        id: uuidv4(),
        clientOperation,
        serverOperation,
        resolved: false,
        timestamp: Date.now(),
      };
      
      // Save conflict
      const conflictKey = `sync:conflicts:${clientOperation.userId}:${clientOperation.deviceId}:${conflict.id}`;
      await redisClient.set(conflictKey, JSON.stringify(conflict));
      
      // Set expiration time (30 days)
      await redisClient.expire(conflictKey, 30 * 24 * 60 * 60);
      
      return conflict;
    }
    
    return null;
  } catch (error) {
    logger.error(`Error checking for conflict: ${error}`);
    return null;
  }
};

/**
 * Apply a sync operation
 * @param operation Sync operation
 */
const applyChange = async (operation: SyncOperation): Promise<void> => {
  try {
    // Save the operation
    const operationKey = `sync:changes:${operation.userId}:${operation.resourceType}:${operation.resourceId}`;
    await redisClient.set(operationKey, JSON.stringify(operation));
    
    // Set expiration time (30 days)
    await redisClient.expire(operationKey, 30 * 24 * 60 * 60);
    
    // TODO: Apply the change to the actual data store
    // This would involve calling the appropriate service methods
    // based on the operation type and resource type
    
    // For now, we'll just log the operation
    logger.info(`Applied sync operation: ${JSON.stringify(operation)}`);
  } catch (error) {
    logger.error(`Error applying change: ${error}`);
    throw error;
  }
};

/**
 * Process resolved conflicts
 * @param resolvedConflicts Resolved conflicts
 * @param userId User ID
 * @param deviceId Device ID
 * @returns Processing result
 */
const processResolvedConflicts = async (
  resolvedConflicts: any[],
  userId: string,
  deviceId: string
): Promise<{ resolved: string[]; failed: string[] }> => {
  const resolved: string[] = [];
  const failed: string[] = [];
  
  // Process each resolved conflict
  for (const resolvedConflict of resolvedConflicts) {
    try {
      // Validate resolved conflict
      if (!resolvedConflict.id || !resolvedConflict.resolution || !resolvedConflict.data) {
        logger.warn(`Invalid resolved conflict format: ${JSON.stringify(resolvedConflict)}`);
        failed.push(resolvedConflict.id);
        continue;
      }
      
      // Get the conflict
      const conflictKey = `sync:conflicts:${userId}:${deviceId}:${resolvedConflict.id}`;
      const conflictData = await redisClient.get(conflictKey);
      
      if (!conflictData) {
        logger.warn(`Conflict not found: ${resolvedConflict.id}`);
        failed.push(resolvedConflict.id);
        continue;
      }
      
      const conflict = JSON.parse(conflictData);
      
      // Update the conflict
      conflict.resolution = resolvedConflict.resolution;
      conflict.resolvedData = resolvedConflict.data;
      conflict.resolved = true;
      
      // Save the updated conflict
      await redisClient.set(conflictKey, JSON.stringify(conflict));
      
      // Apply the resolved data
      const operation: SyncOperation = {
        id: uuidv4(),
        type: SyncOperationType.UPDATE,
        resourceType: conflict.clientOperation.resourceType,
        resourceId: conflict.clientOperation.resourceId,
        data: resolvedConflict.data,
        timestamp: Date.now(),
        deviceId,
        userId,
        clientId: conflict.clientOperation.clientId,
        resolved: true,
        serverTimestamp: Date.now(),
      };
      
      await applyChange(operation);
      
      resolved.push(resolvedConflict.id);
    } catch (error) {
      logger.error(`Error processing resolved conflict: ${error}`);
      failed.push(resolvedConflict.id);
    }
  }
  
  return { resolved, failed };
};

export default mobileOfflineSupport;
