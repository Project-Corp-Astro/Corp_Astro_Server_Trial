/**
 * Corp Astro Analytics Service
 * 
 * This module provides analytics tracking and A/B testing functionality for the Corp Astro application.
 * It includes functions for tracking events, feature usage, user journeys, and A/B testing.
 */

import { Express } from 'express';
import logger from '../../utils/logger';

// Import analytics tracking functions
import { trackEvent, trackFeatureUsage } from './utils/analyticsService';

// Import A/B testing functions
import { getTestVariant, recordConversion, getTestResults } from './utils/abTestingService';

// Import astrology-specific A/B testing functions
import {
  createAstrologyABTest,
  getAstrologyTestVariant,
  trackAstrologyTestConversion,
  getAstrologyTestResults,
  AstrologyTestType,
  AstrologyConversionType
} from './utils/astrologyABTests';

// Import astrology metrics functions
import {
  trackChartGeneration,
  trackHoroscopeView,
  trackBusinessForecast,
  trackFreeToolUsage,
  trackSubscriptionChange,
  trackAstroRatanChat
} from './utils/astrologyMetrics';

// Re-export all functions
export {
  trackEvent,
  trackFeatureUsage,
  getTestVariant,
  recordConversion,
  getTestResults,
  createAstrologyABTest,
  getAstrologyTestVariant,
  trackAstrologyTestConversion,
  getAstrologyTestResults,
  trackChartGeneration,
  trackHoroscopeView,
  trackBusinessForecast,
  trackFreeToolUsage,
  trackSubscriptionChange,
  trackAstroRatanChat
};

/**
 * Initialize the analytics service
 * @param app Express application instance
 */
export function initAnalyticsService(app: Express): void {
  logger.info('Initializing Analytics Service');
  
  try {
    // Initialize analytics routes
    require('./routes/analyticsRoutes').default(app);
    require('./routes/dashboardRoutes').default(app);
    
    // Initialize predefined A/B tests
    initPredefinedABTests();
    
    logger.info('Analytics Service initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Analytics Service:', error);
  }
}

/**
 * Initialize predefined A/B tests for the application
 */
function initPredefinedABTests(): void {
  try {
    // Horoscope Layout Test
    createAstrologyABTest({
      testName: 'horoscope_layout_test',
      testType: AstrologyTestType.HOROSCOPE_FORMAT,
      conversionType: AstrologyConversionType.ENGAGEMENT,
      description: 'Testing different horoscope layouts',
      variants: [
        { name: 'cards', weight: 0.33, config: { layout: 'cards' } },
        { name: 'list', weight: 0.33, config: { layout: 'list' } },
        { name: 'grid', weight: 0.34, config: { layout: 'grid' } }
      ]
    });
    
    // Subscription CTA Test
    createAstrologyABTest({
      testName: 'subscription_cta_test',
      testType: AstrologyTestType.SUBSCRIPTION_PAGE,
      conversionType: AstrologyConversionType.CONVERSION,
      description: 'Testing different subscription call-to-action messages',
      variants: [
        { name: 'value', weight: 0.5, config: { message: 'Unlock premium astrological insights' } },
        { name: 'scarcity', weight: 0.5, config: { message: 'Limited time offer: 30% off premium' } }
      ]
    });
    
    // Business Report Format Test
    createAstrologyABTest({
      testName: 'business_report_format_test',
      testType: AstrologyTestType.BUSINESS_FORECAST,
      conversionType: AstrologyConversionType.SATISFACTION,
      description: 'Testing different business report formats',
      variants: [
        { name: 'detailed', weight: 0.33, config: { format: 'detailed' } },
        { name: 'summary', weight: 0.33, config: { format: 'summary' } },
        { name: 'visual', weight: 0.34, config: { format: 'visual' } }
      ]
    });
    
    logger.info('Predefined A/B tests initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize predefined A/B tests:', error);
  }
}

// Export default object with all functions
export default {
  initAnalyticsService,
  trackEvent,
  trackFeatureUsage,
  getTestVariant,
  recordConversion,
  getTestResults,
  createAstrologyABTest,
  getAstrologyTestVariant,
  trackAstrologyTestConversion,
  getAstrologyTestResults,
  trackChartGeneration,
  trackHoroscopeView,
  trackBusinessForecast,
  trackFreeToolUsage,
  trackSubscriptionChange,
  trackAstroRatanChat
};
