/**
 * Mobile SDK Integration Example for Corp Astro Analytics
 * 
 * This file demonstrates how to integrate the Analytics SDK into the mobile application.
 * It shows practical examples of tracking various events and user interactions.
 */

import CorpAstroAnalytics from '../sdk/AnalyticsSDK';

// Initialize the SDK
const analytics = new CorpAstroAnalytics({
  apiUrl: 'https://api.corpastro.com/api/analytics',
  batchSize: 10,
  batchInterval: 30000, // 30 seconds
  offlineStorageLimit: 1000,
  debug: true
});

/**
 * Example: Track app open event
 */
export const trackAppOpen = (userId: string, appVersion: string, deviceInfo: any) => {
  // Set the user ID first
  analytics.setUserId(userId);
  
  analytics.trackEvent(
    'app_opened',
    'app_usage',
    'open',
    {
      appVersion,
      deviceType: deviceInfo.type,
      osVersion: deviceInfo.osVersion,
      deviceModel: deviceInfo.model,
      screenSize: `${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`
    }
  );
};

/**
 * Example: Track chart generation
 */
export const trackChartGeneration = (
  userId: string,
  chartType: string,
  businessId?: string,
  additionalProperties?: Record<string, any>
) => {
  // Set the user ID first
  analytics.setUserId(userId);
  
  analytics.trackFeatureUsage(
    'chart_generation',
    chartType,
    undefined, // duration
    undefined, // result
    {
      ...(businessId && { businessId }),
      ...additionalProperties
    }
  );
};

/**
 * Example: Track horoscope view
 */
export const trackHoroscopeView = (
  userId: string,
  horoscopeType: 'daily' | 'weekly' | 'monthly',
  businessId?: string
) => {
  // Set the user ID first
  analytics.setUserId(userId);
  
  analytics.trackEvent(
    'horoscope_viewed',
    'content_consumption',
    'view',
    {
      horoscopeType,
      ...(businessId && { businessId }),
      timestamp: new Date().toISOString()
    }
  );
};

/**
 * Example: Track free tool usage
 */
export const trackFreeToolUsage = (
  userId: string,
  toolName: 'name_analysis' | 'tagline_analysis' | 'color_analysis',
  inputData: Record<string, any>
) => {
  // Set the user ID first
  analytics.setUserId(userId);
  
  analytics.trackFeatureUsage(
    'free_tool',
    toolName,
    undefined, // duration
    undefined, // result
    {
      inputLength: JSON.stringify(inputData).length,
      hasBusinessContext: !!inputData.businessContext
    }
  );
};

/**
 * Example: Track subscription conversion
 */
export const trackSubscriptionConversion = (
  userId: string,
  tier: 'subscription' | 'premium',
  planDuration: 'monthly' | 'yearly',
  amount: number,
  currency: string,
  fromTier: 'free' | 'subscription' | null
) => {
  // Set the user ID first
  analytics.setUserId(userId);
  
  analytics.trackEvent(
    'subscription_converted',
    'monetization',
    'convert',
    {
      tier,
      planDuration,
      amount,
      currency,
      fromTier,
      isUpgrade: fromTier !== null
    }
  );
};

/**
 * Example: Track user journey progress
 */
export const trackJourneyProgress = (
  userId: string,
  journeyName: string,
  stageName: string,
  isCompleted: boolean,
  timeSpent?: number
) => {
  // Set the user ID first
  analytics.setUserId(userId);
  
  // Use trackEvent since trackJourney doesn't exist
  analytics.trackEvent(
    'journey_progress',
    journeyName,
    stageName,
    {
      isCompleted,
      ...(timeSpent !== undefined && { timeSpent })
    }
  );
};

/**
 * Example: Track UI interaction
 */
export const trackUIInteraction = (
  userId: string,
  screenName: string,
  elementId: string,
  interactionType: 'click' | 'swipe' | 'scroll' | 'long_press',
  coordinates?: { x: number, y: number },
  additionalProperties?: Record<string, any>
) => {
  // Set the user ID first
  analytics.setUserId(userId);
  
  if (coordinates) {
    analytics.trackUIInteraction(
      coordinates.x,
      coordinates.y,
      window.innerWidth,
      window.innerHeight,
      interactionType,
      screenName
    );
  } else {
    // If no coordinates, use trackEvent instead
    analytics.trackEvent(
      'ui_interaction',
      'user_interface',
      interactionType,
      {
        screenName,
        elementId,
        ...additionalProperties
      }
    );
  }
};

/**
 * Example: Get A/B test variant
 */
export const getABTestVariant = async (
  userId: string,
  testName: string
): Promise<string> => {
  try {
    // Set the user ID first
    analytics.setUserId(userId);
    
    // This is a mock implementation since the actual method isn't available
    // In a real implementation, we would call an API endpoint
    return 'control';
  } catch (error) {
    console.error(`Error getting A/B test variant: ${error}`);
    return 'control'; // Default to control if there's an error
  }
};

/**
 * Example: Track A/B test conversion
 */
export const trackABTestConversion = (
  userId: string,
  testName: string,
  assignmentId: string
) => {
  // Set the user ID first
  analytics.setUserId(userId);
  
  // Use trackEvent since trackABTestConversion doesn't exist
  analytics.trackEvent(
    'ab_test_conversion',
    'ab_testing',
    'convert',
    {
      testName,
      assignmentId
    }
  );
};

/**
 * Example: Track search query
 */
export const trackSearchQuery = (
  userId: string,
  query: string,
  resultCount: number,
  category?: string
) => {
  // Set the user ID first
  analytics.setUserId(userId);
  
  analytics.trackEvent(
    'search_performed',
    'user_engagement',
    'search',
    {
      query,
      resultCount,
      queryLength: query.length,
      hasResults: resultCount > 0,
      ...(category && { category })
    }
  );
};

/**
 * Example: Track content share
 */
export const trackContentShare = (
  userId: string,
  contentType: string,
  contentId: string,
  platform: 'whatsapp' | 'facebook' | 'twitter' | 'email' | 'copy_link' | 'other'
) => {
  // Set the user ID first
  analytics.setUserId(userId);
  
  analytics.trackEvent(
    'content_shared',
    'social_engagement',
    'share',
    {
      contentType,
      contentId,
      platform
    }
  );
};

/**
 * Example: Track app error
 */
export const trackAppError = (
  userId: string,
  errorCode: string,
  errorMessage: string,
  componentName: string,
  stackTrace?: string
) => {
  // Set the user ID first
  analytics.setUserId(userId);
  
  analytics.trackEvent(
    'app_error',
    'error',
    'error_occurred',
    {
      errorCode,
      errorMessage,
      componentName,
      ...(stackTrace && { stackTrace })
    }
  );
};

/**
 * Example: Complete usage in a React Native component
 */
/*
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useUser } from '../hooks/useUser';
import { useDeviceInfo } from '../hooks/useDeviceInfo';
import {
  trackAppOpen,
  trackChartGeneration,
  trackHoroscopeView,
  trackUIInteraction
} from '../analytics/analytics';

const HomeScreen = () => {
  const { user } = useUser();
  const deviceInfo = useDeviceInfo();
  
  useEffect(() => {
    // Track app open when the home screen mounts
    if (user) {
      trackAppOpen(user.id, deviceInfo.appVersion, deviceInfo);
    }
  }, []);
  
  const handleGenerateChart = () => {
    // Track chart generation
    if (user) {
      trackChartGeneration(user.id, 'natal_chart', user.businessId, {
        includeAspects: true,
        houseSystem: 'whole_sign'
      });
    }
    
    // Navigate to chart screen
    // navigation.navigate('ChartScreen');
  };
  
  const handleViewHoroscope = () => {
    // Track horoscope view
    if (user) {
      trackHoroscopeView(user.id, 'daily', user.businessId);
    }
    
    // Navigate to horoscope screen
    // navigation.navigate('HoroscopeScreen');
  };
  
  return (
    <View>
      <Text>Welcome to Corp Astro</Text>
      <Button 
        title="Generate Chart" 
        onPress={() => {
          // Track UI interaction
          if (user) {
            trackUIInteraction(
              user.id,
              'home_screen',
              'generate_chart_button',
              'click'
            );
          }
          handleGenerateChart();
        }} 
      />
      <Button 
        title="View Horoscope" 
        onPress={() => {
          // Track UI interaction
          if (user) {
            trackUIInteraction(
              user.id,
              'home_screen',
              'view_horoscope_button',
              'click'
            );
          }
          handleViewHoroscope();
        }} 
      />
    </View>
  );
};

export default HomeScreen;
*/
