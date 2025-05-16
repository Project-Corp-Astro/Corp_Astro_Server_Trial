# Corp Astro Mobile Analytics Integration Guide

This guide provides step-by-step instructions for integrating the Corp Astro Analytics system into your mobile application. The analytics system is designed to track user behavior, feature usage, and optimize the user experience through A/B testing.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Tracking Key User Actions](#tracking-key-user-actions)
3. [Astrology-Specific Analytics](#astrology-specific-analytics)
4. [A/B Testing Implementation](#ab-testing-implementation)
5. [Offline Support](#offline-support)
6. [Performance Considerations](#performance-considerations)
7. [Privacy and Compliance](#privacy-and-compliance)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### Installation

The Analytics SDK is available as a TypeScript module. To use it in your mobile application:

1. Import the SDK into your project:

```typescript
import CorpAstroAnalytics from '@corp-astro/analytics-sdk';
```

2. Initialize the SDK with your configuration:

```typescript
// Initialize the analytics SDK
const analytics = new CorpAstroAnalytics({
  apiUrl: 'https://api.corpastro.com/api/analytics',
  debug: __DEV__, // Enable debug logging in development
  batchSize: 10,   // Number of events to batch before sending
  batchInterval: 30000, // 30 seconds
  offlineStorageLimit: 1000, // Maximum number of events to store offline
});
```

3. Set up user identification as early as possible:

```typescript
// When user logs in
analytics.setUserId(user.id);

// For anonymous users, a session ID is automatically generated
// but you can set your own if needed
analytics.setSessionId(customSessionId);
```

## Tracking Key User Actions

### User Authentication

```typescript
// Track user login
analytics.trackEvent(
  'user_login',
  'authentication',
  'login_success',
  { method: 'email', user_tier: user.subscriptionTier }
);

// Track user logout
analytics.trackEvent(
  'user_logout',
  'authentication',
  'logout',
  { session_duration: sessionDurationInSeconds }
);
```

### App Navigation

```typescript
// Track screen views
analytics.trackEvent(
  'screen_view',
  'navigation',
  'view',
  { 
    screen_name: 'DashboardScreen',
    previous_screen: 'LoginScreen'
  }
);

// Track feature navigation
analytics.trackEvent(
  'feature_navigation',
  'navigation',
  'select',
  { feature: 'business_forecast' }
);
```

### Error Tracking

```typescript
// Track errors
analytics.trackEvent(
  'error',
  'system',
  'api_error',
  { 
    error_code: error.code,
    error_message: error.message,
    api_endpoint: '/api/charts'
  }
);
```

## Astrology-Specific Analytics

### Chart Generation

```typescript
// Track when a user generates a chart
analytics.trackChartGeneration(
  'natal', // chart_type: 'natal' | 'transit' | 'synastry' | 'composite' | 'progressed' | 'dasha'
  'business-123', // business_id (optional)
  1500, // generation_time in ms (optional)
  {
    // Additional chart data (optional)
    houses: 12,
    zodiac_system: 'sidereal',
    ayanamsa: 'lahiri'
  }
);
```

### Horoscope Views

```typescript
// Track when a user views a horoscope
analytics.trackHoroscopeView(
  'daily', // horoscope_type: 'daily' | 'weekly' | 'monthly'
  'basic', // subscription_tier: 'free' | 'basic' | 'pro' | 'enterprise'
  'horoscope-123' // content_id (optional)
);
```

### Business Forecasts

```typescript
// Track when a user views a business forecast
analytics.trackBusinessForecast(
  'business-123', // business_id
  'financial', // forecast_type: 'financial' | 'strategic' | 'team' | 'general'
  'monthly', // forecast_period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  'forecast-456' // content_id (optional)
);
```

### Free Tool Usage

```typescript
// Track when a user uses a free tool
analytics.trackFreeToolUsage(
  'name_analysis', // tool_name: 'name_analysis' | 'tagline_analysis' | 'color_analysis' | 'logo_analysis'
  { name: 'Cosmic Enterprises' }, // input_data (optional)
  { numerology_value: 7, interpretation: '...' }, // result_data (optional)
  2500 // usage_duration in ms (optional)
);
```

### Subscription Changes

```typescript
// Track when a user changes their subscription
analytics.trackSubscriptionChange(
  'free', // previous_tier: 'free' | 'basic' | 'pro' | 'enterprise' | null
  'basic', // new_tier: 'free' | 'basic' | 'pro' | 'enterprise'
  'upgrade' // change_reason: 'new' | 'upgrade' | 'downgrade' | 'renewal' | 'cancellation' (optional)
);
```

### Astro Ratan AI Chat

```typescript
// Track Astro Ratan AI chat interactions
analytics.trackAstroRatanChat(
  'chat-session-123', // session_id
  5, // message_count
  ['business_advice', 'timing_questions'], // topic_categories (optional)
  4.5 // satisfaction_score (0-5) (optional)
);
```

## A/B Testing Implementation

### Getting a Test Variant

```typescript
// Get the variant for a user
const variant = await analytics.getABTestVariant('onboarding_flow');

// Then use the variant to show different UI
if (variant === 'control') {
  // Show the standard onboarding flow
  showStandardOnboarding();
} else if (variant === 'simplified') {
  // Show the simplified onboarding flow
  showSimplifiedOnboarding();
}
```

### Tracking Conversions

```typescript
// Track when a user completes a conversion action
analytics.trackABTestConversion(
  'onboarding_flow', // test_name
  1 // conversion_value (optional)
);
```

### Example: Implementing an Onboarding A/B Test

```typescript
// In your onboarding screen component
useEffect(() => {
  async function setupOnboarding() {
    try {
      // Get the variant for this user
      const variant = await analytics.getABTestVariant('onboarding_flow');
      
      // Set up the appropriate onboarding experience
      switch (variant) {
        case 'control':
          setOnboardingSteps(standardOnboardingSteps);
          break;
        case 'simplified':
          setOnboardingSteps(simplifiedOnboardingSteps);
          break;
        case 'video_intro':
          setOnboardingSteps(videoOnboardingSteps);
          break;
        default:
          // Fallback to standard if something goes wrong
          setOnboardingSteps(standardOnboardingSteps);
      }
      
      // Track that the user started onboarding
      analytics.trackEvent(
        'onboarding_start',
        'user_journey',
        'start',
        { variant }
      );
    } catch (error) {
      console.error('Error setting up onboarding:', error);
      // Fallback to standard onboarding
      setOnboardingSteps(standardOnboardingSteps);
    }
  }
  
  setupOnboarding();
}, []);

// When the user completes onboarding
const handleOnboardingComplete = () => {
  // Track the conversion
  analytics.trackABTestConversion('onboarding_flow');
  
  // Also track as a regular event
  analytics.trackEvent(
    'onboarding_complete',
    'user_journey',
    'complete',
    { steps_viewed: stepsViewed, time_spent: timeSpent }
  );
  
  // Navigate to the next screen
  navigation.navigate('Dashboard');
};
```

## Offline Support

The SDK automatically handles offline scenarios:

1. Events are stored locally when the device is offline
2. Events are sent when the device comes back online
3. The storage limit prevents excessive memory usage

You don't need to implement any special handling for offline support, but you can customize the behavior:

```typescript
// Configure offline storage limit
const analytics = new CorpAstroAnalytics({
  // ... other config
  offlineStorageLimit: 2000, // Store up to 2000 events when offline
});

// Manually flush events when needed
analytics.flush();
```

## Performance Considerations

The Analytics SDK is designed to be lightweight and efficient:

1. **Event Batching**: Events are batched to reduce network requests
2. **Automatic Retry**: Failed requests are retried with exponential backoff
3. **Prioritization**: Critical events are sent immediately, while less important events are batched

Best practices:

- Don't track too many events from the same action
- Use appropriate event categories and actions for easier analysis
- Include relevant properties but avoid excessive data

## Privacy and Compliance

To ensure compliance with privacy regulations:

1. **User Consent**: Always obtain user consent before tracking
2. **Data Minimization**: Only collect data that is necessary
3. **Transparency**: Clearly communicate what data is being collected and why

Implementation example:

```typescript
// Check for user consent before initializing analytics
if (hasUserConsent()) {
  // Initialize analytics
  initializeAnalytics();
} else {
  // Show consent dialog
  showConsentDialog(onConsent => {
    if (onConsent) {
      initializeAnalytics();
    }
  });
}
```

## Troubleshooting

### Debug Mode

Enable debug mode to see detailed logs:

```typescript
const analytics = new CorpAstroAnalytics({
  // ... other config
  debug: true,
});
```

### Common Issues

1. **Events not being tracked**
   - Check if the user ID is set correctly
   - Verify the API URL is correct
   - Check network connectivity

2. **A/B test variant not being assigned**
   - Ensure the test exists in the backend
   - Check if the user ID is set before requesting the variant

3. **High data usage**
   - Reduce the batch size
   - Increase the batch interval
   - Be more selective about what events to track

### Logging

For advanced debugging, you can implement a custom logging solution:

```typescript
// Set up a custom logger
const customLogger = (message, level) => {
  if (level === 'error') {
    // Send to your error reporting service
    ErrorReporting.captureMessage(message);
  }
  
  // Log to console in development
  if (__DEV__) {
    console.log(`[Analytics] ${message}`);
  }
};

// Pass to the SDK
const analytics = new CorpAstroAnalytics({
  // ... other config
  logger: customLogger,
});
```

---

## Next Steps

1. **Implement Basic Tracking**: Start with user authentication and screen views
2. **Add Feature-Specific Tracking**: Implement tracking for charts, horoscopes, and forecasts
3. **Set Up A/B Tests**: Create your first A/B test for the onboarding flow
4. **Review Analytics Data**: Use the analytics dashboards to analyze user behavior
5. **Optimize Based on Data**: Make data-driven decisions to improve your app

For additional support, contact the Corp Astro Analytics team at analytics-support@corpastro.com.
