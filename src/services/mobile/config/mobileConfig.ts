// src/services/mobile/config/mobileConfig.ts

/**
 * Mobile API configuration
 * Contains settings and constants for mobile-specific API enhancements
 */
export const mobileConfig = {
  // API versioning
  apiVersion: 'v1',
  
  // Response optimization
  responseOptimization: {
    // Maximum payload size in KB before compression is applied
    compressionThreshold: 2, // 2KB
    
    // Default image quality for image responses (0-100)
    defaultImageQuality: 85,
    
    // Maximum image dimensions for mobile responses
    maxImageWidth: 1080,
    maxImageHeight: 1920,
    
    // Enable response minification
    minifyResponses: true,
  },
  
  // Bandwidth optimization
  bandwidthOptimization: {
    // Enable differential updates
    enableDifferentialUpdates: true,
    
    // Enable response field filtering
    enableFieldFiltering: true,
    
    // Default fields to exclude from responses unless explicitly requested
    defaultExcludedFields: ['created_at', 'updated_at', 'metadata'],
    
    // Enable response pagination
    enablePagination: true,
    
    // Default page size for paginated responses
    defaultPageSize: 20,
    
    // Maximum page size for paginated responses
    maxPageSize: 100,
  },
  
  // Battery optimization
  batteryOptimization: {
    // Enable batch processing for mobile requests
    enableBatchProcessing: true,
    
    // Maximum batch size
    maxBatchSize: 10,
    
    // Enable push notifications instead of polling
    enablePushNotifications: true,
    
    // Default push notification channel
    defaultPushChannel: 'fcm', // Firebase Cloud Messaging
  },
  
  // Offline support
  offlineSupport: {
    // Enable offline data synchronization
    enableOfflineSync: true,
    
    // Default sync interval in minutes
    defaultSyncInterval: 60,
    
    // Maximum sync interval in minutes
    maxSyncInterval: 1440, // 24 hours
    
    // Enable conflict resolution
    enableConflictResolution: true,
    
    // Default conflict resolution strategy
    defaultConflictStrategy: 'server-wins',
  },
  
  // Device adaptation
  deviceAdaptation: {
    // Enable device-specific optimizations
    enableDeviceOptimization: true,
    
    // Enable network type detection
    enableNetworkTypeDetection: true,
    
    // Low bandwidth mode threshold in Kbps
    lowBandwidthThreshold: 500, // 500 Kbps
    
    // Enable battery level detection
    enableBatteryLevelDetection: true,
    
    // Low battery threshold percentage
    lowBatteryThreshold: 15, // 15%
  },
  
  // Security
  security: {
    // Mobile API token expiration time in seconds
    tokenExpirationTime: 2592000, // 30 days
    
    // Enable device binding for tokens
    enableDeviceBinding: true,
    
    // Enable biometric authentication
    enableBiometricAuth: true,
    
    // Enable certificate pinning
    enableCertificatePinning: true,
  },
};

export default mobileConfig;
