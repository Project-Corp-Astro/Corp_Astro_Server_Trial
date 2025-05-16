/**
 * Corp Astro Analytics SDK
 * A lightweight client-side library for tracking analytics events, feature usage, and UI interactions
 */

export interface AnalyticsConfig {
  apiUrl?: string;
  appVersion?: string;
  debug?: boolean;
  batchSize?: number;
  batchInterval?: number;
  sessionIdProvider?: () => string;
  userIdProvider?: () => string | null;
}

export interface HeatmapCoordinate {
  x: number;
  y: number;
  pageWidth?: number;
  pageHeight?: number;
  elementSelector?: string;
  elementId?: string;
  elementClass?: string;
}

export interface EventProperties {
  [key: string]: any;
}

export type InteractionType = 'click' | 'hover' | 'scroll' | 'dwell';
export type UsageResult = 'success' | 'failure' | 'abandoned';

export class CorpAstroAnalytics {
  private config: Required<AnalyticsConfig>;
  private eventQueue: Record<string, any>[] = [];
  private batchTimeout: number | null = null;
  private sessionId: string;

  /**
   * Initialize the analytics SDK
   * @param config Configuration options
   */
  constructor(config: AnalyticsConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl || '/api/analytics',
      appVersion: config.appVersion || '1.0.0',
      debug: config.debug || false,
      batchSize: config.batchSize || 10,
      batchInterval: config.batchInterval || 30000, // 30 seconds
      sessionIdProvider: config.sessionIdProvider || this._defaultSessionIdProvider.bind(this),
      userIdProvider: config.userIdProvider || (() => null)
    };

    // Initialize session
    this.sessionId = this.config.sessionIdProvider();
    
    // Set up automatic page view tracking
    if (typeof window !== 'undefined') {
      this._setupPageViewTracking();
      this._setupErrorTracking();
      this._setupPerformanceTracking();
      
      // Process queue before page unload
      window.addEventListener('beforeunload', () => {
        if (this.eventQueue.length > 0) {
          this._processBatchQueue(true);
        }
      });
    }
    
    this._log('Corp Astro Analytics initialized');
  }

  /**
   * Track an analytics event
   * @param eventName Name of the event
   * @param eventCategory Category of the event
   * @param eventAction Action performed
   * @param properties Additional event properties
   * @param immediate Whether to send immediately or batch
   * @returns Event ID
   */
  public async trackEvent(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    properties: EventProperties = {},
    immediate: boolean = false
  ): Promise<string | Record<string, any>> {
    if (typeof window === 'undefined') return Promise.resolve('');
    
    const eventData = {
      event_name: eventName,
      event_category: eventCategory,
      event_action: eventAction,
      properties: {
        ...properties,
        app_version: this.config.appVersion,
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        locale: navigator.language
      },
      session_id: this.sessionId,
      user_id: this.config.userIdProvider(),
      client_timestamp: new Date().toISOString()
    };

    this._log('Tracking event:', eventData);

    if (immediate) {
      return this._sendRequest('/events', eventData);
    } else {
      // Add to batch queue
      this.eventQueue.push(eventData);
      
      // Process queue if it's full
      if (this.eventQueue.length >= this.config.batchSize) {
        this._processBatchQueue();
      } else if (!this.batchTimeout) {
        // Start timeout to process queue
        this.batchTimeout = window.setTimeout(() => {
          this._processBatchQueue();
        }, this.config.batchInterval);
      }
      
      return Promise.resolve('queued');
    }
  }

  /**
   * Track a page view
   * @param pageUrl URL of the page (defaults to current URL)
   * @param pageTitle Title of the page (defaults to document title)
   * @param referrer Referrer URL (defaults to document.referrer)
   * @returns Event ID
   */
  public trackPageView(
    pageUrl?: string,
    pageTitle?: string,
    referrer?: string
  ): Promise<string | Record<string, any>> {
    if (typeof window === 'undefined') return Promise.resolve('');
    
    return this.trackEvent(
      'page_view',
      'navigation',
      'view',
      {
        page_url: pageUrl || window.location.href,
        page_title: pageTitle || document.title,
        page_path: window.location.pathname,
        referrer: referrer || document.referrer
      }
    );
  }

  /**
   * Track feature usage
   * @param featureName Name of the feature
   * @param featureCategory Category of the feature
   * @param usageDuration Duration of usage in seconds
   * @param usageResult Result of the usage (success, failure, abandoned)
   * @param usageData Additional usage data
   * @returns Response data
   */
  public async trackFeatureUsage(
    featureName: string,
    featureCategory: string,
    usageDuration?: number,
    usageResult?: UsageResult,
    usageData: Record<string, any> = {}
  ): Promise<Record<string, any>> {
    const data = {
      feature_name: featureName,
      feature_category: featureCategory,
      usage_duration: usageDuration,
      usage_result: usageResult,
      usage_data: usageData,
      session_id: this.sessionId
    };
    
    this._log('Tracking feature usage:', data);
    
    return this._sendRequest('/feature-usage', data);
  }

  /**
   * Track UI interaction for heatmap generation
   * @param coordinates Coordinates of the interaction
   * @param interactionType Type of interaction (click, hover, scroll, dwell)
   * @param pageUrl URL of the page (defaults to current URL)
   * @returns Response data
   */
  public async trackUIInteraction(
    coordinates: HeatmapCoordinate,
    interactionType: InteractionType,
    pageUrl?: string
  ): Promise<Record<string, any>> {
    if (typeof window === 'undefined') return Promise.resolve({});
    
    const data = {
      page_url: pageUrl || window.location.href,
      coordinates: {
        x: coordinates.x,
        y: coordinates.y,
        pageWidth: coordinates.pageWidth || window.innerWidth,
        pageHeight: coordinates.pageHeight || document.body.scrollHeight,
        elementSelector: coordinates.elementSelector,
        elementId: coordinates.elementId,
        elementClass: coordinates.elementClass
      },
      interaction_type: interactionType,
      session_id: this.sessionId
    };
    
    this._log('Tracking UI interaction:', data);
    
    return this._sendRequest('/ui-interaction', data);
  }

  /**
   * Get A/B test variant for the current user
   * @param testName Name of the test
   * @param forceVariant Force a specific variant (for testing)
   * @returns Variant data
   */
  public async getABTestVariant(
    testName: string,
    forceVariant?: string
  ): Promise<Record<string, any>> {
    const data = {
      test_name: testName,
      session_id: this.sessionId,
      force_variant: forceVariant
    };
    
    this._log('Getting A/B test variant:', data);
    
    const response = await this._sendRequest('/ab-test/variant', data);
    
    if (response.success && response.variant) {
      // Cache the variant in localStorage for persistence
      try {
        localStorage.setItem(`ab_test_${testName}`, JSON.stringify(response.variant));
      } catch (e) {
        this._log('Error caching A/B test variant:', e);
      }
    }
    
    return response;
  }

  /**
   * Record a conversion for an A/B test
   * @param testName Name of the test
   * @returns Response data
   */
  public async recordABTestConversion(
    testName: string
  ): Promise<Record<string, any>> {
    const data = {
      test_name: testName,
      session_id: this.sessionId
    };
    
    this._log('Recording A/B test conversion:', data);
    
    return this._sendRequest('/ab-test/conversion', data);
  }

  /**
   * Process the batch queue of events
   * @param sync Whether to send synchronously (for beforeunload)
   * @private
   */
  private async _processBatchQueue(sync: boolean = false): Promise<void> {
    if (this.eventQueue.length === 0) return;
    
    if (this.batchTimeout !== null) {
      window.clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
    
    const eventsToProcess = [...this.eventQueue];
    this.eventQueue = [];
    
    this._log(`Processing batch queue: ${eventsToProcess.length} events`);
    
    try {
      if (sync && navigator.sendBeacon) {
        // Use sendBeacon for beforeunload events
        const url = `${this.config.apiUrl}/events/batch`;
        const blob = new Blob([JSON.stringify({ events: eventsToProcess })], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      } else {
        // Use regular fetch
        await this._sendRequest('/events/batch', { events: eventsToProcess });
      }
    } catch (error) {
      this._log('Error processing batch queue:', error);
      // Re-add failed events to the queue
      this.eventQueue = [...eventsToProcess, ...this.eventQueue];
    }
  }

  /**
   * Send a request to the analytics API
   * @param endpoint API endpoint
   * @param data Request data
   * @returns Response data
   * @private
   */
  private async _sendRequest(
    endpoint: string,
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    try {
      const response = await fetch(`${this.config.apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include' // Include cookies for auth
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      this._log('API request error:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Default session ID provider
   * Generates a new session ID or retrieves existing one from localStorage
   * @returns Session ID
   * @private
   */
  private _defaultSessionIdProvider(): string {
    if (typeof window === 'undefined') return 'server';
    
    try {
      let sessionId = localStorage.getItem('corp_astro_session_id');
      const sessionTimestamp = localStorage.getItem('corp_astro_session_timestamp');
      
      // Check if session is expired (30 minutes)
      const now = Date.now();
      if (!sessionId || !sessionTimestamp || now - parseInt(sessionTimestamp, 10) > 30 * 60 * 1000) {
        // Generate new session ID
        sessionId = 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('corp_astro_session_id', sessionId);
      }
      
      // Update session timestamp
      localStorage.setItem('corp_astro_session_timestamp', now.toString());
      
      return sessionId;
    } catch (e) {
      // Fallback if localStorage is not available
      return 'session_' + Math.random().toString(36).substring(2, 15);
    }
  }

  /**
   * Set up automatic page view tracking
   * @private
   */
  private _setupPageViewTracking(): void {
    // Track initial page view
    this.trackPageView();
    
    // Track page views on history changes
    if (window.history) {
      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;
      
      window.history.pushState = function(...args) {
        originalPushState.apply(this, args);
        window.dispatchEvent(new Event('locationchange'));
      };
      
      window.history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        window.dispatchEvent(new Event('locationchange'));
      };
      
      window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'));
      });
      
      window.addEventListener('locationchange', () => {
        this.trackPageView();
      });
    }
  }

  /**
   * Set up automatic error tracking
   * @private
   */
  private _setupErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.trackEvent(
        'client_error',
        'error',
        'error',
        {
          error_message: event.message,
          error_source: event.filename,
          error_line: event.lineno,
          error_column: event.colno,
          error_stack: event.error ? event.error.stack : null
        },
        true // Send immediately
      );
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent(
        'unhandled_promise_rejection',
        'error',
        'error',
        {
          error_message: event.reason ? event.reason.message : 'Unknown promise rejection',
          error_stack: event.reason ? event.reason.stack : null
        },
        true // Send immediately
      );
    });
  }

  /**
   * Set up performance tracking
   * @private
   */
  private _setupPerformanceTracking(): void {
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        // Wait for page to fully load
        setTimeout(() => {
          const timing = window.performance.timing;
          const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
          const domReadyTime = timing.domComplete - timing.domLoading;
          const networkLatency = timing.responseEnd - timing.requestStart;
          
          this.trackEvent(
            'page_load_time',
            'performance',
            'load',
            {
              page_load_time: pageLoadTime,
              dom_ready_time: domReadyTime,
              network_latency: networkLatency,
              redirect_time: timing.redirectEnd - timing.redirectStart,
              dns_time: timing.domainLookupEnd - timing.domainLookupStart,
              tcp_connect_time: timing.connectEnd - timing.connectStart,
              server_response_time: timing.responseStart - timing.requestStart,
              download_time: timing.responseEnd - timing.responseStart,
              processing_time: timing.domComplete - timing.responseEnd
            }
          );
        }, 0);
      });
    }
  }

  /**
   * Log debug messages
   * @private
   */
  private _log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[Corp Astro Analytics]', ...args);
    }
  }
}
