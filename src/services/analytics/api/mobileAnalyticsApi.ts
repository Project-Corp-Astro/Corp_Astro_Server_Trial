/**
 * Mobile Analytics API Service
 * Provides methods for mobile applications to interact with the analytics system
 */

import axios from 'axios';
import { EventCategory, EventAction } from '../utils/eventSchema';

// Define the base URL for API requests
const API_BASE_URL = '/api/mobile-analytics';

// Interface for device information
export interface DeviceInfo {
  device_model: string;
  os_version: string;
  app_version: string;
  screen_size?: string;
  locale?: string;
  timezone?: string;
  network_type?: string;
}

// Interface for event data
export interface EventData {
  event_name: string;
  event_category: string;
  event_action: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

// Interface for screen view data
export interface ScreenViewData {
  screen_name: string;
  properties?: Record<string, any>;
}

// Interface for feature usage data
export interface FeatureUsageData {
  feature_type: string;
  properties?: Record<string, any>;
}

// Interface for A/B test data
export interface ABTestData {
  test_name: string;
  conversion_value?: number;
}

// Interface for engagement data
export interface EngagementData {
  engagement_type: string;
  duration_seconds?: number;
  properties?: Record<string, any>;
}

// Interface for app lifecycle data
export interface AppLifecycleData {
  lifecycle_event: 'app_start' | 'app_background' | 'app_foreground' | 'app_terminate' | 'app_crash';
  properties?: Record<string, any>;
}

/**
 * Mobile Analytics API Service
 * Provides methods for tracking analytics events from mobile applications
 */
export class MobileAnalyticsApi {
  private userId?: string;
  private sessionId: string;
  private deviceInfo: DeviceInfo;
  private eventQueue: EventData[] = [];
  private flushInterval: number = 30000; // 30 seconds
  private maxQueueSize: number = 20;
  private flushTimeoutId?: NodeJS.Timeout;
  private isOffline: boolean = false;
  private offlineStorage: EventData[] = [];

  /**
   * Create a new instance of the Mobile Analytics API
   * @param sessionId Unique session identifier
   * @param deviceInfo Device information
   * @param userId Optional user identifier
   */
  constructor(sessionId: string, deviceInfo: DeviceInfo, userId?: string) {
    this.sessionId = sessionId;
    this.deviceInfo = deviceInfo;
    this.userId = userId;
    
    // Start the flush interval
    this.startFlushInterval();
    
    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }
  
  /**
   * Set the user ID for tracking
   * @param userId User identifier
   */
  public setUserId(userId: string): void {
    this.userId = userId;
  }
  
  /**
   * Track a screen view
   * @param data Screen view data
   */
  public async trackScreenView(data: ScreenViewData): Promise<void> {
    try {
      const payload = {
        screen_name: data.screen_name,
        user_id: this.userId,
        session_id: this.sessionId,
        properties: data.properties || {},
        device_info: this.deviceInfo
      };
      
      if (this.isOffline) {
        this.queueEvent({
          event_name: 'screen_view',
          event_category: EventCategory.NAVIGATION,
          event_action: EventAction.VIEW,
          properties: payload
        });
        return;
      }
      
      await axios.post(`${API_BASE_URL}/screen-view`, payload);
    } catch (error) {
      console.error('Error tracking screen view:', error);
      this.handleError(error, {
        event_name: 'screen_view',
        event_category: EventCategory.NAVIGATION,
        event_action: EventAction.VIEW,
        properties: {
          screen_name: data.screen_name,
          ...data.properties
        }
      });
    }
  }
  
  /**
   * Track feature usage
   * @param data Feature usage data
   */
  public async trackFeatureUsage(data: FeatureUsageData): Promise<void> {
    try {
      const payload = {
        feature_type: data.feature_type,
        user_id: this.userId,
        session_id: this.sessionId,
        properties: data.properties || {},
        device_info: this.deviceInfo
      };
      
      if (this.isOffline) {
        this.queueEvent({
          event_name: `${data.feature_type}_used`,
          event_category: EventCategory.FEATURE,
          event_action: EventAction.USE,
          properties: payload
        });
        return;
      }
      
      await axios.post(`${API_BASE_URL}/astrology-feature`, payload);
    } catch (error) {
      console.error('Error tracking feature usage:', error);
      this.handleError(error, {
        event_name: `${data.feature_type}_used`,
        event_category: EventCategory.FEATURE,
        event_action: EventAction.USE,
        properties: {
          feature_type: data.feature_type,
          ...data.properties
        }
      });
    }
  }
  
  /**
   * Get A/B test variant
   * @param testName Name of the A/B test
   * @returns Promise resolving to the variant name
   */
  public async getABTestVariant(testName: string): Promise<string> {
    try {
      const payload = {
        test_name: testName,
        user_id: this.userId,
        session_id: this.sessionId
      };
      
      if (this.isOffline) {
        // Return a default variant when offline
        return 'control';
      }
      
      const response = await axios.post(`${API_BASE_URL}/ab-test/variant`, payload);
      return response.data.variant;
    } catch (error) {
      console.error('Error getting A/B test variant:', error);
      // Return a default variant on error
      return 'control';
    }
  }
  
  /**
   * Track A/B test conversion
   * @param data A/B test data
   */
  public async trackABTestConversion(data: ABTestData): Promise<void> {
    try {
      const payload = {
        test_name: data.test_name,
        user_id: this.userId,
        session_id: this.sessionId,
        conversion_value: data.conversion_value
      };
      
      if (this.isOffline) {
        this.queueEvent({
          event_name: 'ab_test_conversion',
          event_category: EventCategory.EXPERIMENT,
          event_action: EventAction.CONVERT,
          properties: payload
        });
        return;
      }
      
      await axios.post(`${API_BASE_URL}/ab-test/conversion`, payload);
    } catch (error) {
      console.error('Error tracking A/B test conversion:', error);
      this.handleError(error, {
        event_name: 'ab_test_conversion',
        event_category: EventCategory.EXPERIMENT,
        event_action: EventAction.CONVERT,
        properties: {
          test_name: data.test_name,
          conversion_value: data.conversion_value
        }
      });
    }
  }
  
  /**
   * Track user engagement
   * @param data Engagement data
   */
  public async trackEngagement(data: EngagementData): Promise<void> {
    try {
      const payload = {
        engagement_type: data.engagement_type,
        user_id: this.userId,
        session_id: this.sessionId,
        duration_seconds: data.duration_seconds,
        properties: data.properties || {},
        device_info: this.deviceInfo
      };
      
      if (this.isOffline) {
        this.queueEvent({
          event_name: `${data.engagement_type}_engagement`,
          event_category: EventCategory.ENGAGEMENT,
          event_action: EventAction.ENGAGE,
          properties: payload
        });
        return;
      }
      
      await axios.post(`${API_BASE_URL}/engagement`, payload);
    } catch (error) {
      console.error('Error tracking engagement:', error);
      this.handleError(error, {
        event_name: `${data.engagement_type}_engagement`,
        event_category: EventCategory.ENGAGEMENT,
        event_action: EventAction.ENGAGE,
        properties: {
          engagement_type: data.engagement_type,
          duration_seconds: data.duration_seconds,
          ...data.properties
        }
      });
    }
  }
  
  /**
   * Track app lifecycle event
   * @param data App lifecycle data
   */
  public async trackAppLifecycle(data: AppLifecycleData): Promise<void> {
    try {
      const payload = {
        lifecycle_event: data.lifecycle_event,
        user_id: this.userId,
        session_id: this.sessionId,
        properties: data.properties || {},
        device_info: this.deviceInfo
      };
      
      if (this.isOffline) {
        this.queueEvent({
          event_name: data.lifecycle_event,
          event_category: EventCategory.SYSTEM,
          event_action: this.mapLifecycleEventToAction(data.lifecycle_event),
          properties: payload
        });
        return;
      }
      
      await axios.post(`${API_BASE_URL}/lifecycle`, payload);
    } catch (error) {
      console.error('Error tracking app lifecycle:', error);
      this.handleError(error, {
        event_name: data.lifecycle_event,
        event_category: EventCategory.SYSTEM,
        event_action: this.mapLifecycleEventToAction(data.lifecycle_event),
        properties: {
          lifecycle_event: data.lifecycle_event,
          ...data.properties
        }
      });
    }
  }
  
  /**
   * Track a custom event
   * @param eventName Name of the event
   * @param eventCategory Category of the event
   * @param eventAction Action of the event
   * @param properties Additional properties
   */
  public async trackEvent(
    eventName: string,
    eventCategory: EventCategory,
    eventAction: EventAction,
    properties: Record<string, any> = {}
  ): Promise<void> {
    try {
      const event: EventData = {
        event_name: eventName,
        event_category: eventCategory,
        event_action: eventAction,
        properties
      };
      
      this.queueEvent(event);
      
      // Flush immediately if queue is full
      if (this.eventQueue.length >= this.maxQueueSize) {
        await this.flushEvents();
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }
  
  /**
   * Queue an event for batch processing
   * @param event Event data
   */
  private queueEvent(event: EventData): void {
    this.eventQueue.push(event);
  }
  
  /**
   * Flush queued events to the server
   */
  public async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) {
      return;
    }
    
    // If offline, store events for later
    if (this.isOffline) {
      this.offlineStorage = [...this.offlineStorage, ...this.eventQueue];
      this.eventQueue = [];
      return;
    }
    
    try {
      const events = [...this.eventQueue];
      this.eventQueue = [];
      
      // Add user ID, session ID, and device info to each event
      const formattedEvents = events.map(event => ({
        ...event,
        user_id: this.userId,
        session_id: this.sessionId,
        device_info: this.deviceInfo
      }));
      
      await axios.post(`${API_BASE_URL}/batch`, {
        events: formattedEvents,
        sessionId: this.sessionId,
        deviceInfo: this.deviceInfo
      });
    } catch (error) {
      console.error('Error flushing events:', error);
      
      // Put events back in the queue
      this.eventQueue = [...this.eventQueue, ...this.eventQueue];
    }
  }
  
  /**
   * Start the flush interval
   */
  private startFlushInterval(): void {
    this.flushTimeoutId = setInterval(() => {
      this.flushEvents();
    }, this.flushInterval);
  }
  
  /**
   * Handle network errors
   * @param error Error object
   * @param event Event data
   */
  private handleError(error: any, event: EventData): void {
    // Queue the event for retry
    this.queueEvent(event);
    
    // If network error, mark as offline
    if (error.message === 'Network Error') {
      this.isOffline = true;
    }
  }
  
  /**
   * Handle online event
   */
  private handleOnline = (): void => {
    this.isOffline = false;
    
    // Flush offline storage
    if (this.offlineStorage.length > 0) {
      const offlineEvents = [...this.offlineStorage];
      this.offlineStorage = [];
      
      // Add offline events to the queue
      offlineEvents.forEach(event => this.queueEvent(event));
      
      // Flush events
      this.flushEvents();
    }
  };
  
  /**
   * Handle offline event
   */
  private handleOffline = (): void => {
    this.isOffline = true;
  };
  
  /**
   * Map lifecycle event to event action
   * @param lifecycleEvent Lifecycle event
   * @returns Event action
   */
  private mapLifecycleEventToAction(lifecycleEvent: string): EventAction {
    switch (lifecycleEvent) {
      case 'app_start':
        return EventAction.START;
      case 'app_background':
        return EventAction.BACKGROUND;
      case 'app_foreground':
        return EventAction.FOREGROUND;
      case 'app_terminate':
        return EventAction.END;
      case 'app_crash':
        return EventAction.ERROR;
      default:
        return EventAction.OTHER;
    }
  }
  
  /**
   * Clean up resources
   */
  public dispose(): void {
    // Clear flush interval
    if (this.flushTimeoutId) {
      clearInterval(this.flushTimeoutId);
    }
    
    // Flush any remaining events
    this.flushEvents();
    
    // Remove event listeners
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
  }
}

// Export a singleton instance
export default MobileAnalyticsApi;
