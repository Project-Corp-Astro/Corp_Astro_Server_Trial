/**
 * Corp Astro Analytics SDK
 * 
 * This SDK provides a simple interface for tracking analytics events, feature usage,
 * and A/B testing in the Corp Astro application. It handles batching, caching, and
 * offline support automatically.
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Types
export interface AnalyticsEvent {
  event_name: string;
  event_category: string;
  event_action: string;
  properties?: Record<string, any>;
  client_timestamp?: string;
  user_id?: string;
  session_id?: string;
}

export interface FeatureUsage {
  feature_name: string;
  feature_category: string;
  user_id?: string;
  session_id?: string;
  duration?: number;
  result?: string;
  usage_data?: Record<string, any>;
}

export interface UIInteraction {
  coordinates: {
    x: number;
    y: number;
    pageWidth: number;
    pageHeight: number;
  };
  interaction_type: string;
  user_id?: string;
  session_id?: string;
  page_url: string;
}

export interface ChartGeneration {
  user_id: string;
  chart_type: 'natal' | 'transit' | 'synastry' | 'composite' | 'progressed' | 'dasha';
  business_id?: string;
  generation_time?: number;
  chart_data?: Record<string, any>;
}

export interface HoroscopeView {
  user_id: string;
  horoscope_type: 'daily' | 'weekly' | 'monthly';
  subscription_tier: 'free' | 'basic' | 'pro' | 'enterprise';
  content_id?: string;
}

export interface BusinessForecast {
  user_id: string;
  business_id: string;
  forecast_type: 'financial' | 'strategic' | 'team' | 'general';
  forecast_period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  content_id?: string;
}

export interface FreeToolUsage {
  user_id: string;
  tool_name: 'name_analysis' | 'tagline_analysis' | 'color_analysis' | 'logo_analysis';
  input_data?: Record<string, any>;
  result_data?: Record<string, any>;
  usage_duration?: number;
}

export interface SubscriptionChange {
  user_id: string;
  previous_tier: 'free' | 'basic' | 'pro' | 'enterprise' | null;
  new_tier: 'free' | 'basic' | 'pro' | 'enterprise';
  change_reason?: 'new' | 'upgrade' | 'downgrade' | 'renewal' | 'cancellation';
}

export interface AIChatInteraction {
  user_id: string;
  session_id: string;
  message_count: number;
  topic_categories?: string[];
  satisfaction_score?: number;
}

export interface ABTestVariant {
  test_name: string;
  user_id?: string;
  session_id?: string;
}

export interface ABTestConversion {
  test_name: string;
  user_id?: string;
  session_id?: string;
  conversion_value?: number;
}

export interface AnalyticsConfig {
  apiUrl: string;
  batchSize?: number;
  batchInterval?: number;
  offlineStorageLimit?: number;
  debug?: boolean;
  authToken?: string;
}

class CorpAstroAnalytics {
  private apiClient: AxiosInstance;
  private eventQueue: AnalyticsEvent[] = [];
  private userId: string | null = null;
  private sessionId: string | null = null;
  private config: AnalyticsConfig;
  private batchIntervalId: NodeJS.Timeout | null = null;
  private isOnline: boolean = true;
  private offlineEvents: AnalyticsEvent[] = [];

  /**
   * Initialize the Analytics SDK
   * @param config Configuration options
   */
  constructor(config: AnalyticsConfig) {
    this.config = {
      batchSize: 10,
      batchInterval: 5000, // 5 seconds
      offlineStorageLimit: 1000,
      debug: false,
      ...config
    };

    // Create axios instance
    this.apiClient = axios.create({
      baseURL: this.config.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.authToken ? { 'Authorization': `Bearer ${this.config.authToken}` } : {})
      }
    });

    // Generate a session ID if not provided
    this.sessionId = this.generateSessionId();

    // Start batch processing
    this.startBatchProcessing();

    // Set up online/offline detection
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      this.isOnline = navigator.onLine;
    }

    // Load any cached offline events
    this.loadOfflineEvents();

    this.log('Corp Astro Analytics SDK initialized');
  }

  /**
   * Set the user ID for all subsequent tracking calls
   * @param userId User ID
   */
  public setUserId(userId: string): void {
    this.userId = userId;
    this.log(`User ID set: ${userId}`);
  }

  /**
   * Set the session ID for all subsequent tracking calls
   * @param sessionId Session ID
   */
  public setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
    this.log(`Session ID set: ${sessionId}`);
  }

  /**
   * Track a general analytics event
   * @param eventName Name of the event
   * @param eventCategory Category of the event
   * @param eventAction Action performed
   * @param properties Additional properties
   */
  public trackEvent(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    properties: Record<string, any> = {}
  ): void {
    const event: AnalyticsEvent = {
      event_name: eventName,
      event_category: eventCategory,
      event_action: eventAction,
      properties,
      client_timestamp: new Date().toISOString(),
      user_id: this.userId || undefined,
      session_id: this.sessionId || undefined
    };

    this.queueEvent(event);
    this.log(`Event tracked: ${eventName}`);
  }

  /**
   * Track feature usage
   * @param featureName Name of the feature
   * @param featureCategory Category of the feature
   * @param duration Time spent using the feature (ms)
   * @param result Result of the feature usage
   * @param usageData Additional data about the usage
   */
  public trackFeatureUsage(
    featureName: string,
    featureCategory: string,
    duration?: number,
    result?: string,
    usageData: Record<string, any> = {}
  ): void {
    const data: FeatureUsage = {
      feature_name: featureName,
      feature_category: featureCategory,
      user_id: this.userId || undefined,
      session_id: this.sessionId || undefined,
      duration,
      result,
      usage_data: usageData
    };

    this.sendRequest('/feature-usage', data);
    this.log(`Feature usage tracked: ${featureName}`);
  }

  /**
   * Track UI interaction for heatmaps
   * @param x X coordinate
   * @param y Y coordinate
   * @param pageWidth Width of the page
   * @param pageHeight Height of the page
   * @param interactionType Type of interaction (click, hover, etc.)
   * @param pageUrl URL of the page
   */
  public trackUIInteraction(
    x: number,
    y: number,
    pageWidth: number,
    pageHeight: number,
    interactionType: string,
    pageUrl: string
  ): void {
    const data: UIInteraction = {
      coordinates: {
        x,
        y,
        pageWidth,
        pageHeight
      },
      interaction_type: interactionType,
      user_id: this.userId || undefined,
      session_id: this.sessionId || undefined,
      page_url: pageUrl
    };

    this.sendRequest('/ui-interaction', data);
    this.log(`UI interaction tracked: ${interactionType} at (${x}, ${y})`);
  }

  /**
   * Track chart generation
   * @param chartType Type of chart
   * @param businessId Business ID if applicable
   * @param generationTime Time taken to generate the chart (ms)
   * @param chartData Additional data about the chart
   */
  public trackChartGeneration(
    chartType: 'natal' | 'transit' | 'synastry' | 'composite' | 'progressed' | 'dasha',
    businessId?: string,
    generationTime?: number,
    chartData: Record<string, any> = {}
  ): void {
    if (!this.userId) {
      this.log('Cannot track chart generation without user ID', 'error');
      return;
    }

    const data: ChartGeneration = {
      user_id: this.userId,
      chart_type: chartType,
      business_id: businessId,
      generation_time: generationTime,
      chart_data: chartData
    };

    this.sendRequest('/astrology/chart', data);
    this.log(`Chart generation tracked: ${chartType}`);
  }

  /**
   * Track horoscope view
   * @param horoscopeType Type of horoscope
   * @param subscriptionTier Subscription tier
   * @param contentId Content ID if applicable
   */
  public trackHoroscopeView(
    horoscopeType: 'daily' | 'weekly' | 'monthly',
    subscriptionTier: 'free' | 'basic' | 'pro' | 'enterprise',
    contentId?: string
  ): void {
    if (!this.userId) {
      this.log('Cannot track horoscope view without user ID', 'error');
      return;
    }

    const data: HoroscopeView = {
      user_id: this.userId,
      horoscope_type: horoscopeType,
      subscription_tier: subscriptionTier,
      content_id: contentId
    };

    this.sendRequest('/astrology/horoscope', data);
    this.log(`Horoscope view tracked: ${horoscopeType}`);
  }

  /**
   * Track business forecast view
   * @param businessId Business ID
   * @param forecastType Type of forecast
   * @param forecastPeriod Period of forecast
   * @param contentId Content ID if applicable
   */
  public trackBusinessForecast(
    businessId: string,
    forecastType: 'financial' | 'strategic' | 'team' | 'general',
    forecastPeriod: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
    contentId?: string
  ): void {
    if (!this.userId) {
      this.log('Cannot track business forecast without user ID', 'error');
      return;
    }

    const data: BusinessForecast = {
      user_id: this.userId,
      business_id: businessId,
      forecast_type: forecastType,
      forecast_period: forecastPeriod,
      content_id: contentId
    };

    this.sendRequest('/astrology/business-forecast', data);
    this.log(`Business forecast tracked: ${forecastType} for ${forecastPeriod}`);
  }

  /**
   * Track free tool usage
   * @param toolName Name of the tool
   * @param inputData Input data for the tool
   * @param resultData Result data from the tool
   * @param usageDuration Duration of tool usage (ms)
   */
  public trackFreeToolUsage(
    toolName: 'name_analysis' | 'tagline_analysis' | 'color_analysis' | 'logo_analysis',
    inputData: Record<string, any> = {},
    resultData: Record<string, any> = {},
    usageDuration?: number
  ): void {
    if (!this.userId) {
      this.log('Cannot track free tool usage without user ID', 'error');
      return;
    }

    const data: FreeToolUsage = {
      user_id: this.userId,
      tool_name: toolName,
      input_data: inputData,
      result_data: resultData,
      usage_duration: usageDuration
    };

    this.sendRequest('/astrology/free-tool', data);
    this.log(`Free tool usage tracked: ${toolName}`);
  }

  /**
   * Track subscription change
   * @param previousTier Previous subscription tier
   * @param newTier New subscription tier
   * @param changeReason Reason for the change
   */
  public trackSubscriptionChange(
    previousTier: 'free' | 'basic' | 'pro' | 'enterprise' | null,
    newTier: 'free' | 'basic' | 'pro' | 'enterprise',
    changeReason?: 'new' | 'upgrade' | 'downgrade' | 'renewal' | 'cancellation'
  ): void {
    if (!this.userId) {
      this.log('Cannot track subscription change without user ID', 'error');
      return;
    }

    const data: SubscriptionChange = {
      user_id: this.userId,
      previous_tier: previousTier,
      new_tier: newTier,
      change_reason: changeReason
    };

    this.sendRequest('/astrology/subscription', data);
    this.log(`Subscription change tracked: ${previousTier || 'none'} -> ${newTier}`);
  }

  /**
   * Track Astro Ratan AI chat interaction
   * @param sessionId Chat session ID
   * @param messageCount Number of messages in the conversation
   * @param topicCategories Categories of topics discussed
   * @param satisfactionScore User satisfaction score (0-5)
   */
  public trackAstroRatanChat(
    sessionId: string,
    messageCount: number,
    topicCategories: string[] = [],
    satisfactionScore?: number
  ): void {
    if (!this.userId) {
      this.log('Cannot track AI chat without user ID', 'error');
      return;
    }

    const data: AIChatInteraction = {
      user_id: this.userId,
      session_id: sessionId,
      message_count: messageCount,
      topic_categories: topicCategories,
      satisfaction_score: satisfactionScore
    };

    this.sendRequest('/astrology/ai-chat', data);
    this.log(`AI chat tracked: ${messageCount} messages`);
  }

  /**
   * Get A/B test variant for a user
   * @param testName Name of the test
   * @returns Promise with the variant name
   */
  public async getABTestVariant(testName: string): Promise<string> {
    try {
      const params: ABTestVariant = {
        test_name: testName,
        user_id: this.userId || undefined,
        session_id: this.sessionId || undefined
      };

      const response = await this.apiClient.get('/ab-test/variant', { params });
      this.log(`A/B test variant retrieved: ${response.data.variant}`);
      return response.data.variant;
    } catch (error) {
      this.log(`Error getting A/B test variant: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * Track A/B test conversion
   * @param testName Name of the test
   * @param conversionValue Value of the conversion (if applicable)
   */
  public trackABTestConversion(testName: string, conversionValue?: number): void {
    const data: ABTestConversion = {
      test_name: testName,
      user_id: this.userId || undefined,
      session_id: this.sessionId || undefined,
      conversion_value: conversionValue
    };

    this.sendRequest('/ab-test/conversion', data);
    this.log(`A/B test conversion tracked: ${testName}`);
  }

  /**
   * Flush the event queue immediately
   */
  public flush(): void {
    if (this.eventQueue.length > 0) {
      this.processBatch();
    }
  }

  /**
   * Clean up resources when the SDK is no longer needed
   */
  public dispose(): void {
    if (this.batchIntervalId) {
      clearInterval(this.batchIntervalId);
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }

    // Flush any remaining events
    this.flush();
    this.log('Analytics SDK disposed');
  }

  // Private methods

  private queueEvent(event: AnalyticsEvent): void {
    this.eventQueue.push(event);

    // Process immediately if batch size reached
    if (this.eventQueue.length >= (this.config.batchSize || 10)) {
      this.processBatch();
    }
  }

  private startBatchProcessing(): void {
    if (this.batchIntervalId) {
      clearInterval(this.batchIntervalId);
    }

    this.batchIntervalId = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.processBatch();
      }
    }, this.config.batchInterval || 5000);
  }

  private processBatch(): void {
    if (!this.isOnline) {
      // Store events for later if offline
      this.storeOfflineEvents([...this.eventQueue]);
      this.eventQueue = [];
      return;
    }

    const batch = [...this.eventQueue];
    this.eventQueue = [];

    this.sendRequest('/batch', { events: batch });
  }

  private async sendRequest(endpoint: string, data: any): Promise<void> {
    if (!this.isOnline) {
      // For non-event endpoints, convert to event and store offline
      if (endpoint !== '/batch') {
        const event: AnalyticsEvent = {
          event_name: `${endpoint.replace('/', '')}_event`,
          event_category: 'api',
          event_action: 'call',
          properties: data,
          client_timestamp: new Date().toISOString(),
          user_id: this.userId || undefined,
          session_id: this.sessionId || undefined
        };
        this.storeOfflineEvents([event]);
      }
      return;
    }

    try {
      await this.apiClient.post(endpoint, data);
    } catch (error) {
      this.log(`Error sending request to ${endpoint}: ${error}`, 'error');
      
      // Convert to event and store offline on error
      if (endpoint !== '/batch') {
        const event: AnalyticsEvent = {
          event_name: `${endpoint.replace('/', '')}_event`,
          event_category: 'api',
          event_action: 'call',
          properties: data,
          client_timestamp: new Date().toISOString(),
          user_id: this.userId || undefined,
          session_id: this.sessionId || undefined
        };
        this.storeOfflineEvents([event]);
      } else if (Array.isArray(data.events)) {
        this.storeOfflineEvents(data.events);
      }
    }
  }

  private handleOnline = (): void => {
    this.isOnline = true;
    this.log('Device is online, processing offline events');
    this.processOfflineEvents();
  };

  private handleOffline = (): void => {
    this.isOnline = false;
    this.log('Device is offline, events will be stored locally');
  };

  private storeOfflineEvents(events: AnalyticsEvent[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      // Get existing offline events
      const existingEvents = this.loadOfflineEvents();
      
      // Combine with new events, respecting the storage limit
      const combinedEvents = [...existingEvents, ...events].slice(
        0, 
        this.config.offlineStorageLimit || 1000
      );
      
      // Save back to localStorage
      localStorage.setItem('corpastro_offline_events', JSON.stringify(combinedEvents));
      this.log(`Stored ${events.length} events for offline processing`);
    } catch (error) {
      this.log(`Error storing offline events: ${error}`, 'error');
    }
  }

  private loadOfflineEvents(): AnalyticsEvent[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const storedEvents = localStorage.getItem('corpastro_offline_events');
      if (storedEvents) {
        return JSON.parse(storedEvents);
      }
    } catch (error) {
      this.log(`Error loading offline events: ${error}`, 'error');
    }
    
    return [];
  }

  private processOfflineEvents(): void {
    const offlineEvents = this.loadOfflineEvents();
    
    if (offlineEvents.length === 0) {
      return;
    }
    
    this.log(`Processing ${offlineEvents.length} offline events`);
    
    // Clear offline storage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('corpastro_offline_events');
    }
    
    // Process in batches
    const batchSize = this.config.batchSize || 10;
    for (let i = 0; i < offlineEvents.length; i += batchSize) {
      const batch = offlineEvents.slice(i, i + batchSize);
      this.sendRequest('/batch', { events: batch });
    }
  }

  private generateSessionId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private log(message: string, level: 'info' | 'error' = 'info'): void {
    if (this.config.debug) {
      if (level === 'error') {
        console.error(`[CorpAstroAnalytics] ${message}`);
      } else {
        console.log(`[CorpAstroAnalytics] ${message}`);
      }
    }
  }
}

export default CorpAstroAnalytics;
