/**
 * Event schema definitions for standardized analytics tracking
 * This ensures consistent event naming and properties across the application
 */

// Event Categories
export enum EventCategory {
  ACCOUNT = 'account',
  SUBSCRIPTION = 'subscription',
  CONTENT = 'content',
  NAVIGATION = 'navigation',
  INTERACTION = 'interaction',
  ASTROLOGY = 'astrology',
  REPORT = 'report',
  NOTIFICATION = 'notification',
  ERROR = 'error',
  PERFORMANCE = 'performance',
  USER_JOURNEY = 'user_journey',
  FEATURE = 'feature',
  ENGAGEMENT = 'engagement',
  SYSTEM = 'system',
  EXPERIMENT = 'experiment'
}

// Standard event actions
export enum EventAction {
  VIEW = 'view',
  CLICK = 'click',
  SUBMIT = 'submit',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  SEARCH = 'search',
  FILTER = 'filter',
  SORT = 'sort',
  DOWNLOAD = 'download',
  SHARE = 'share',
  LOGIN = 'login',
  LOGOUT = 'logout',
  REGISTER = 'register',
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
  UPGRADE = 'upgrade',
  DOWNGRADE = 'downgrade',
  GENERATE = 'generate',
  ERROR = 'error',
  START = 'start',
  PROGRESS = 'progress',
  COMPLETE = 'complete',
  USE = 'use',
  SUCCESS = 'success',
  BACKGROUND = 'background',
  FOREGROUND = 'foreground',
  END = 'end',
  OTHER = 'other',
  ENGAGE = 'engage',
  ASSIGN = 'assign',
  CONVERT = 'convert'
}

// Standard event names
export const EventName = {
  // Account events
  ACCOUNT_CREATED: 'account_created',
  ACCOUNT_UPDATED: 'account_updated',
  ACCOUNT_DELETED: 'account_deleted',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  LOGOUT: 'logout',
  PASSWORD_RESET_REQUESTED: 'password_reset_requested',
  PASSWORD_RESET_COMPLETED: 'password_reset_completed',
  PROFILE_UPDATED: 'profile_updated',
  
  // Subscription events
  SUBSCRIPTION_VIEWED: 'subscription_viewed',
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_UPGRADED: 'subscription_upgraded',
  SUBSCRIPTION_DOWNGRADED: 'subscription_downgraded',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  SUBSCRIPTION_RENEWED: 'subscription_renewed',
  PAYMENT_SUCCEEDED: 'payment_succeeded',
  PAYMENT_FAILED: 'payment_failed',
  
  // Content events
  CONTENT_VIEWED: 'content_viewed',
  CONTENT_CREATED: 'content_created',
  CONTENT_UPDATED: 'content_updated',
  CONTENT_DELETED: 'content_deleted',
  CONTENT_SHARED: 'content_shared',
  CONTENT_DOWNLOADED: 'content_downloaded',
  CONTENT_RATED: 'content_rated',
  CONTENT_COMMENTED: 'content_commented',
  
  // Navigation events
  PAGE_VIEW: 'page_view',
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  SORT_APPLIED: 'sort_applied',
  MENU_OPENED: 'menu_opened',
  MENU_CLOSED: 'menu_closed',
  
  // Astrology-specific events
  CHART_GENERATED: 'chart_generated',
  CHART_VIEWED: 'chart_viewed',
  CHART_SHARED: 'chart_shared',
  CHART_DOWNLOADED: 'chart_downloaded',
  HOROSCOPE_VIEWED: 'horoscope_viewed',
  COMPATIBILITY_CHECKED: 'compatibility_checked',
  TRANSIT_REPORT_VIEWED: 'transit_report_viewed',
  NATAL_CHART_VIEWED: 'natal_chart_viewed',
  
  // Error events
  API_ERROR: 'api_error',
  CLIENT_ERROR: 'client_error',
  VALIDATION_ERROR: 'validation_error',
  
  // Performance events
  PAGE_LOAD_TIME: 'page_load_time',
  API_RESPONSE_TIME: 'api_response_time',
  RESOURCE_LOAD_TIME: 'resource_load_time'
};

// Feature categories for feature usage tracking
export enum FeatureCategory {
  CHART = 'chart',
  HOROSCOPE = 'horoscope',
  COMPATIBILITY = 'compatibility',
  TRANSIT = 'transit',
  REPORT = 'report',
  DASHBOARD = 'dashboard',
  PROFILE = 'profile',
  SUBSCRIPTION = 'subscription',
  NOTIFICATION = 'notification',
  SEARCH = 'search',
  CONTENT = 'content'
}

// Standard user journey names
export enum JourneyName {
  ONBOARDING = 'onboarding',
  SUBSCRIPTION = 'subscription',
  CHART_CREATION = 'chart_creation',
  REPORT_GENERATION = 'report_generation',
  ACCOUNT_SETUP = 'account_setup',
  COMPATIBILITY_CHECK = 'compatibility_check',
  TRANSIT_ANALYSIS = 'transit_analysis'
}

// Event validation schema
export interface EventValidationSchema {
  required: string[];
  optional: string[];
  values?: {
    [key: string]: string[];
  };
}

// Event validation schemas for each event type
export const eventValidationSchemas: Record<string, EventValidationSchema> = {
  [EventName.PAGE_VIEW]: {
    required: ['page_url', 'page_title'],
    optional: ['referrer', 'page_type']
  },
  [EventName.CHART_GENERATED]: {
    required: ['chart_type'],
    optional: ['birth_date', 'birth_time', 'birth_location', 'generation_time']
  },
  // Add more event validation schemas as needed
};

// Helper function to validate event properties against schema
export function validateEventProperties(
  eventName: string, 
  properties: Record<string, any>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const schema = eventValidationSchemas[eventName];
  
  if (!schema) {
    return { valid: true, errors: [] }; // No schema defined, assume valid
  }
  
  // Check required properties
  for (const requiredProp of schema.required) {
    if (properties[requiredProp] === undefined) {
      errors.push(`Missing required property: ${requiredProp}`);
    }
  }
  
  // Check property values if specified
  if (schema.values) {
    for (const [prop, allowedValues] of Object.entries(schema.values)) {
      if (properties[prop] !== undefined && !allowedValues.includes(properties[prop])) {
        errors.push(`Invalid value for ${prop}: ${properties[prop]}. Allowed values: ${allowedValues.join(', ')}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Helper function to create standardized event objects
export function createEvent(
  eventName: string,
  eventCategory: EventCategory,
  eventAction: EventAction,
  properties: Record<string, any> = {},
  userId?: string,
  sessionId?: string
): Record<string, any> {
  // Validate properties against schema
  const validation = validateEventProperties(eventName, properties);
  
  if (!validation.valid) {
    console.warn(`Event validation warnings for ${eventName}:`, validation.errors);
  }
  
  return {
    event_name: eventName,
    event_category: eventCategory,
    event_action: eventAction,
    user_id: userId,
    session_id: sessionId || 'anonymous',
    properties,
    client_timestamp: new Date()
  };
}
