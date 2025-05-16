/**
 * Mobile SDK for Analytics
 * This module provides a lightweight client-side SDK for the mobile application
 * to interact with the analytics system.
 */

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { EventCategory, EventAction } from '../utils/eventSchema';

// Default configuration
const DEFAULT_CONFIG = {
  apiUrl: '/api/analytics',
  flushInterval: 10000, // 10 seconds
  maxBatchSize: 20,
  debug: false
};

interface AnalyticsSDKConfig {
  apiUrl?: string;
  flushInterval?: number;
  maxBatchSize?: number;
  debug?: boolean;
  userId?: string;
  sessionId?: string;
  deviceInfo?: {
    deviceId: string;
    platform: 'ios' | 'android';
    osVersion: string;
    appVersion: string;
    manufacturer?: string;
    model?: string;
  };
}

interface EventData {
  event_name: string;
  category: EventCategory;
  action: EventAction;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
  deviceInfo?: Record<string, any>;
}

/**
 * Analytics SDK for Mobile Applications
 * Provides methods for tracking events, managing user sessions,
 * and participating in A/B tests.
 */
export class MobileAnalyticsSDK {
  private config: Required<AnalyticsSDKConfig>;
  private eventQueue: EventData[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private sessionId: string;
  private userId: string | null = null;
  private deviceInfo: Record<string, any> | null = null;
  private isInitialized = false;

  /**
   * Create a new instance of the Mobile Analytics SDK
   * @param config Configuration options
   */
  constructor(config: AnalyticsSDKConfig = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    } as Required<AnalyticsSDKConfig>;

    this.sessionId = config.sessionId || uuidv4();
    this.userId = config.userId || null;
    this.deviceInfo = config.deviceInfo || null;
  }

  /**
   * Initialize the SDK
   * @param userId Optional user ID for authenticated users
   * @param deviceInfo Device information
   */
  public init(userId?: string, deviceInfo?: AnalyticsSDKConfig['deviceInfo']): void {
    if (userId) {
      this.userId = userId;
    }

    if (deviceInfo) {
      this.deviceInfo = deviceInfo;
    }

    // Start the flush timer
    this.startFlushTimer();
    
    // Track initialization event
    this.trackEvent(
      'sdk_initialized',
      EventCategory.SYSTEM,
      EventAction.INITIALIZE,
      { sdk_version: '1.0.0' }
    );

    this.isInitialized = true;
    this.log('Analytics SDK initialized');
  }

  /**
   * Set or update the user ID
   * @param userId User ID for authenticated users
   */
  public setUserId(userId: string): void {
    const previousId = this.userId;
    this.userId = userId;
    
    // Track user identification event
    if (previousId !== userId) {
      this.trackEvent(
        'user_identified',
        EventCategory.USER,
        EventAction.IDENTIFY,
        { previous_id: previousId }
      );
    }
  }

  /**
   * Track an event
   * @param eventName Name of the event
   * @param category Event category
   * @param action Event action
   * @param properties Additional properties for the event
   */
  public trackEvent(
    eventName: string,
    category: EventCategory,
    action: EventAction,
    properties: Record<string, any> = {}
  ): void {
    if (!this.isInitialized) {
      this.log('Warning: SDK not initialized. Call init() first.');
    }

    const event: EventData = {
      event_name: eventName,
      category,
      action,
      properties,
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionId,
      deviceInfo: this.deviceInfo || undefined
    };

    this.eventQueue.push(event);
    this.log(`Event tracked: ${eventName}`);

    // Flush if we've reached the max batch size
    if (this.eventQueue.length >= this.config.maxBatchSize) {
      this.flush();
    }
  }

  /**
   * Track a screen view
   * @param screenName Name of the screen
   * @param properties Additional properties
   */
  public trackScreenView(screenName: string, properties: Record<string, any> = {}): void {
    this.trackEvent(
      'screen_view',
      EventCategory.NAVIGATION,
      EventAction.VIEW,
      {
        screen_name: screenName,
        ...properties
      }
    );
  }

  /**
   * Track a user action
   * @param actionName Name of the action
   * @param properties Additional properties
   */
  public trackUserAction(actionName: string, properties: Record<string, any> = {}): void {
    this.trackEvent(
      actionName,
      EventCategory.INTERACTION,
      EventAction.CLICK,
      properties
    );
  }

  /**
   * Get the variant for an A/B test
   * @param testName Name of the test
   * @returns Promise resolving to the variant or null if not found
   */
  public async getTestVariant(testName: string): Promise<{ 
    variantName: string; 
    variantConfig: Record<string, any>;
  } | null> {
    try {
      const response = await axios.get(`${this.config.apiUrl}/ab-tests/variant`, {
        params: {
          testName,
          userId: this.userId,
          sessionId: this.sessionId
        }
      });

      if (response.data && response.data.variant) {
        // Track that the user was assigned to a variant
        this.trackEvent(
          'ab_test_assignment',
          EventCategory.EXPERIMENT,
          EventAction.ASSIGN,
          {
            test_name: testName,
            variant_name: response.data.variant.variantName
          }
        );

        return response.data.variant;
      }

      return null;
    } catch (error) {
      this.log(`Error getting test variant: ${error}`, true);
      return null;
    }
  }

  /**
   * Track a conversion for an A/B test
   * @param testName Name of the test
   * @param conversionValue Optional value associated with the conversion
   */
  public async trackTestConversion(
    testName: string,
    conversionValue?: number
  ): Promise<boolean> {
    try {
      const response = await axios.post(`${this.config.apiUrl}/ab-tests/conversion`, {
        testName,
        userId: this.userId,
        sessionId: this.sessionId,
        conversionValue
      });

      // Also track as a regular event
      this.trackEvent(
        'ab_test_conversion',
        EventCategory.EXPERIMENT,
        EventAction.CONVERT,
        {
          test_name: testName,
          conversion_value: conversionValue
        }
      );

      return response.data && response.data.success;
    } catch (error) {
      this.log(`Error tracking test conversion: ${error}`, true);
      return false;
    }
  }

  /**
   * Track an astrology feature usage
   * @param featureName Name of the feature
   * @param properties Additional properties
   */
  public trackAstrologyFeature(featureName: string, properties: Record<string, any> = {}): void {
    this.trackEvent(
      'astrology_feature_used',
      EventCategory.FEATURE,
      EventAction.USE,
      {
        feature_name: featureName,
        ...properties
      }
    );
  }

  /**
   * Track a business forecast view
   * @param forecastType Type of forecast
   * @param timeframe Timeframe of the forecast
   * @param properties Additional properties
   */
  public trackBusinessForecast(
    forecastType: string,
    timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly',
    properties: Record<string, any> = {}
  ): void {
    this.trackEvent(
      'business_forecast_viewed',
      EventCategory.FEATURE,
      EventAction.VIEW,
      {
        forecast_type: forecastType,
        timeframe,
        ...properties
      }
    );
  }

  /**
   * Track an Astro Ratan interaction
   * @param interactionType Type of interaction
   * @param properties Additional properties
   */
  public trackAstroRatanInteraction(
    interactionType: 'question' | 'response' | 'feedback',
    properties: Record<string, any> = {}
  ): void {
    this.trackEvent(
      'astro_ratan_interaction',
      EventCategory.INTERACTION,
      EventAction.ENGAGE,
      {
        interaction_type: interactionType,
        ...properties
      }
    );
  }

  /**
   * Flush the event queue to the server
   */
  public async flush(): Promise<void> {
    if (this.eventQueue.length === 0) {
      return;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await axios.post(`${this.config.apiUrl}/events/batch`, {
        events,
        sessionId: this.sessionId,
        timestamp: Date.now()
      });

      this.log(`Flushed ${events.length} events`);
    } catch (error) {
      // Put the events back in the queue
      this.eventQueue = [...events, ...this.eventQueue];
      this.log(`Error flushing events: ${error}`, true);
    }
  }

  /**
   * Start the automatic flush timer
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  /**
   * Log a message if debug mode is enabled
   * @param message Message to log
   * @param isError Whether this is an error message
   */
  private log(message: string, isError = false): void {
    if (this.config.debug) {
      if (isError) {
        console.error(`[Analytics SDK] ${message}`);
      } else {
        console.log(`[Analytics SDK] ${message}`);
      }
    }
  }

  /**
   * Clean up resources when the SDK is no longer needed
   */
  public dispose(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    // Flush any remaining events
    this.flush();
    this.isInitialized = false;
  }
}

// Export a singleton instance for easy use
export const mobileAnalytics = new MobileAnalyticsSDK();

// Export types and enums
export { EventCategory, EventAction };
