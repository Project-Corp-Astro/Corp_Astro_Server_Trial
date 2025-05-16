// src/types/mobile.ts

import { Request, Response, NextFunction } from 'express';
import { MobileDeviceInfo, AuthenticatedRequest } from './common';

/**
 * Batch request interface for mobile clients
 */
export interface BatchRequest {
  method: string;
  path: string;
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Batch response interface for mobile clients
 */
export interface BatchResponse {
  status: number;
  body: any;
  headers?: Record<string, string>;
}

/**
 * Mobile middleware function type
 */
export type MobileMiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

/**
 * Mobile request with device info
 */
export interface MobileRequest extends AuthenticatedRequest {
  deviceInfo: MobileDeviceInfo;
}

/**
 * Sync operation type for offline support
 */
export enum SyncOperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

/**
 * Sync operation interface for offline support
 */
export interface SyncOperation {
  id: string;
  type: SyncOperationType;
  resourceType: string;
  resourceId: string;
  data?: any;
  timestamp: number;
  deviceId: string;
  userId: string;
  clientId: string;
  resolved: boolean;
  serverTimestamp: number;
}

/**
 * Sync conflict interface for offline support
 */
export interface SyncConflict {
  id: string;
  clientOperation: SyncOperation;
  serverOperation: SyncOperation;
  resolution?: 'client-wins' | 'server-wins' | 'manual';
  resolvedData?: any;
  resolved: boolean;
  timestamp: number;
}

/**
 * Push notification data interface
 */
export interface PushNotificationData {
  title: string;
  body: string;
  imageUrl?: string;
  sound?: string;
  badge?: number;
  clickAction?: string;
  category?: string;
  data?: Record<string, string>;
  priority?: PushPriority;
  ttl?: number;
  collapseKey?: string;
}

/**
 * Push notification priority
 */
export enum PushPriority {
  HIGH = 'high',
  NORMAL = 'normal',
}

/**
 * Push notification result interface
 */
export interface PushNotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  deviceToken: string;
}

/**
 * Mobile device token interface
 */
export interface DeviceToken {
  token: string;
  platform: 'ios' | 'android';
  deviceId: string;
  userId: string;
  active: boolean;
  lastUsed: Date;
  createdAt: Date;
  updatedAt: Date;
}
