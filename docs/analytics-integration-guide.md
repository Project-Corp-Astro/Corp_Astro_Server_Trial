# Corp Astro Analytics Integration Guide

This guide explains how to integrate the Corp Astro Analytics system into your applications to track user behavior, feature usage, and optimize the user experience through advanced analytics and A/B testing. It covers both web and mobile integration as well as the Super Admin Dashboard for analytics management.

## Installation

### Web Integration

#### For TypeScript Projects

1. Import the CorpAstroAnalytics class:

```typescript
import { CorpAstroAnalytics } from '../path/to/CorpAstroAnalytics';
```

#### For JavaScript Projects

1. Compile the TypeScript SDK to JavaScript:

```bash
tsc src/services/analytics/client/CorpAstroAnalytics.ts --outDir dist/analytics-sdk
```

2. Include the compiled JavaScript file in your project.

### Mobile Integration

#### For React Native Projects

1. Import the MobileAnalyticsSDK class:

```typescript
import { mobileAnalytics } from '../path/to/mobile-sdk';
```

#### For Native iOS/Android Projects

1. For iOS (Swift), use the REST API endpoints directly or create a wrapper around the API:

```swift
// Example Swift implementation
class CorpAstroAnalytics {
    static let shared = CorpAstroAnalytics()
    private let apiUrl = "https://api.corpastro.com/analytics"
    
    func trackEvent(name: String, category: String, action: String, properties: [String: Any]?) {
        // Implementation using URLSession
    }
}
```

2. For Android (Kotlin), use the REST API endpoints directly or create a wrapper around the API:

```kotlin
// Example Kotlin implementation
class CorpAstroAnalytics private constructor() {
    private val apiUrl = "https://api.corpastro.com/analytics"
    
    fun trackEvent(name: String, category: String, action: String, properties: Map<String, Any>?) {
        // Implementation using Retrofit or similar
    }
    
    companion object {
        val instance: CorpAstroAnalytics by lazy { CorpAstroAnalytics() }
    }
}
```

## Basic Setup

### Web SDK Setup

Initialize the analytics SDK in your application's entry point:

```typescript
// Initialize analytics
const analytics = new CorpAstroAnalytics({
  apiUrl: '/api/analytics',
  appVersion: '1.0.0',
  debug: process.env.NODE_ENV !== 'production',
  userIdProvider: () => getUserId() // Your function to get the current user ID
});

// Make analytics available globally if needed
window.analytics = analytics;
```

### Mobile SDK Setup

Initialize the mobile analytics SDK in your application's entry point:

```typescript
// Import the SDK
import { mobileAnalytics } from '../path/to/mobile-sdk';

// Initialize the SDK
mobileAnalytics.init({
  apiUrl: 'https://api.corpastro.com/api/analytics',
  flushInterval: 10000, // 10 seconds
  maxBatchSize: 20,
  debug: __DEV__, // Enable debug mode in development
  userId: currentUserId, // Optional: Set user ID if available
  deviceInfo: {
    deviceId: DeviceInfo.getUniqueId(),
    platform: Platform.OS,
    osVersion: Platform.Version,
    appVersion: DeviceInfo.getVersion(),
    manufacturer: DeviceInfo.getManufacturer(),
    model: DeviceInfo.getModel()
  }
});

// Set user ID when user logs in
function onUserLogin(userId) {
  mobileAnalytics.setUserId(userId);
}

// Track screen views
function onScreenChange(screenName, screenProps) {
  mobileAnalytics.trackScreenView(screenName, screenProps);
}
```

## Tracking Events

### Page Views

Page views are tracked automatically when the SDK is initialized. For single-page applications, the SDK automatically tracks route changes.

### Custom Events

Track custom events to understand user behavior:

```typescript
// Basic event tracking
analytics.trackEvent(
  'chart_generated',           // Event name
  'astrology',                 // Category
  'create',                    // Action
  {                            // Properties
    chart_type: 'natal',
    generation_time: 1200,     // ms
    birth_date: '1990-01-01'
  }
);

// Track when a user views specific content
analytics.trackEvent(
  'content_viewed',
  'content',
  'view',
  {
    content_id: '12345',
    content_type: 'horoscope',
    content_category: 'daily'
  }
);
```

### Feature Usage

Track how users interact with specific features:

```typescript
// Track feature usage
analytics.trackFeatureUsage(
  'compatibility_check',       // Feature name
  'compatibility',            // Feature category
  120,                        // Usage duration in seconds
  'success',                  // Result: 'success', 'failure', 'abandoned'
  {                           // Additional data
    sign_1: 'aries',
    sign_2: 'leo',
    compatibility_score: 85
  }
);
```

## UI Interaction Tracking for Heatmaps

Track where users click and interact with your UI:

```typescript
// Set up click tracking for heatmaps
document.addEventListener('click', (event) => {
  const element = event.target as HTMLElement;
  
  analytics.trackUIInteraction(
    {
      x: event.clientX,
      y: event.clientY,
      pageWidth: window.innerWidth,
      pageHeight: document.body.scrollHeight,
      elementSelector: getElementSelector(element),
      elementId: element.id,
      elementClass: element.className
    },
    'click'
  );
});

// Helper function to get CSS selector for an element
function getElementSelector(element) {
  // Implementation depends on your needs
  // Could return something like 'button.primary#submit-btn'
}
```

## A/B Testing

Implement A/B testing to optimize user experience:

```typescript
// Get variant for a user
const testResult = await analytics.getABTestVariant('new_onboarding_flow');

if (testResult.success) {
  const variant = testResult.variant;
  
  // Apply the variant
  if (variant.name === 'control') {
    showOriginalOnboarding();
  } else if (variant.name === 'variant_a') {
    showNewOnboarding();
  }
  
  // Later, when the user completes the goal:
  analytics.recordABTestConversion('new_onboarding_flow');
}
```

## Best Practices

1. **Consistent Naming**: Use consistent event names, categories, and properties
2. **Don't Over-Track**: Focus on meaningful events that provide actionable insights
3. **Respect Privacy**: Ensure your tracking complies with privacy regulations like GDPR and CCPA
4. **Performance**: The SDK batches events to minimize performance impact, but be mindful of tracking too many events
5. **Error Handling**: The SDK handles errors internally, but consider adding your own error handling for critical tracking

## Key Events to Track

For Corp Astro applications, consider tracking these key events:

### User Journey
- Registration steps
- Subscription funnel steps
- Profile completion
- First chart generation

### Feature Usage
- Chart generation (natal, transit, composite)
- Horoscope reading
- Compatibility checking
- Personalized report viewing

### Engagement
- Time spent on content
- Return visits
- Sharing actions
- Saved items

## Dashboard Access

Analytics data can be viewed in the admin dashboard at `/admin/analytics`. Contact your administrator for access.

## Astrology-Specific Analytics

The Corp Astro Analytics system includes specialized tracking for astrology-related features and business metrics.

### Chart Generation Tracking

```typescript
import { trackChartGeneration } from '../services/analytics/utils/astrologyMetrics';

// Track when a user generates a chart
await trackChartGeneration(
  userId,                     // User ID
  'natal',                    // Chart type: 'natal', 'transit', 'synastry', 'composite', 'progressed', 'dasha'
  businessId,                 // Optional business ID if applicable
  1250,                       // Generation time in ms
  {                           // Optional additional chart data
    planets: ['sun', 'moon', 'mercury'],
    houses: 12,
    aspects: true
  }
);
```

### Horoscope View Tracking

```typescript
import { trackHoroscopeView } from '../services/analytics/utils/astrologyMetrics';

// Track when a user views a horoscope
await trackHoroscopeView(
  userId,                     // User ID
  'daily',                    // Horoscope type: 'daily', 'weekly', 'monthly'
  'basic',                    // Subscription tier: 'free', 'basic', 'pro', 'enterprise'
  'horoscope-123'             // Optional content ID
);
```

### Business Forecast Tracking

```typescript
import { trackBusinessForecast } from '../services/analytics/utils/astrologyMetrics';

// Track when a user views a business forecast
await trackBusinessForecast(
  userId,                     // User ID
  businessId,                 // Business ID
  'financial',                // Forecast type: 'financial', 'strategic', 'team', 'general'
  'monthly',                  // Forecast period: 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
  'forecast-456'              // Optional content ID
);
```

### Free Tool Usage Tracking

```typescript
import { trackFreeToolUsage } from '../services/analytics/utils/astrologyMetrics';

// Track when a user uses a free tool
await trackFreeToolUsage(
  userId,                     // User ID or anonymous ID
  'name_analysis',            // Tool name: 'name_analysis', 'tagline_analysis', 'color_analysis', 'logo_analysis'
  { name: 'Acme Corp' },      // Input data provided to the tool
  { score: 85, rating: 'A' }, // Result data from the tool
  120                         // Usage duration in seconds
);
```

### Subscription Change Tracking

```typescript
import { trackSubscriptionChange } from '../services/analytics/utils/astrologyMetrics';

// Track when a user changes subscription tier
await trackSubscriptionChange(
  userId,                     // User ID
  'free',                     // Previous tier: 'free', 'basic', 'pro', 'enterprise' or null for new subscriptions
  'basic',                    // New tier: 'free', 'basic', 'pro', 'enterprise'
  'upgrade'                   // Change reason: 'new', 'upgrade', 'downgrade', 'renewal', 'cancellation'
);
```

### Astro Ratan AI Chat Tracking

```typescript
import { trackAstroRatanChat } from '../services/analytics/utils/astrologyMetrics';

// Track when a user interacts with Astro Ratan AI
await trackAstroRatanChat(
  userId,                     // User ID
  sessionId,                  // Chat session ID
  15,                         // Number of messages in the conversation
  ['business', 'career'],     // Optional categories of topics discussed
  4.5                         // Optional user satisfaction score (0-5)
);
```

## Subscription Analytics

The Corp Astro Analytics system includes specialized tracking for subscription-related events and metrics.

### Subscription Page View Tracking

```typescript
import { trackSubscriptionPageView } from '../services/analytics/utils/subscriptionAnalytics';

// Track when a user views the subscription page
await trackSubscriptionPageView(
  userId,                     // User ID
  '/features',                // Optional referrer page
  'pricing_v2'                // Optional A/B test variant
);
```

### Subscription Selection Tracking

```typescript
import { trackSubscriptionSelection } from '../services/analytics/utils/subscriptionAnalytics';

// Track when a user selects a subscription tier
await trackSubscriptionSelection(
  userId,                     // User ID
  'pro',                      // Selected tier: 'basic', 'pro', 'enterprise'
  'basic',                    // Previous tier if upgrading/downgrading
  'pricing_v2'                // Optional A/B test variant
);
```

### Payment Process Tracking

```typescript
import { trackPaymentInitiation, trackPaymentCompletion } from '../services/analytics/utils/subscriptionAnalytics';

// Track when a user initiates payment
await trackPaymentInitiation(
  userId,                     // User ID
  'pro',                      // Selected tier: 'basic', 'pro', 'enterprise'
  'credit_card',              // Payment method: 'credit_card', 'paypal', 'apple_pay', 'google_pay', 'other'
  true                        // Whether annual billing was selected
);

// Track when payment is completed
await trackPaymentCompletion(
  userId,                     // User ID
  'pro',                      // Selected tier: 'basic', 'pro', 'enterprise'
  'credit_card',              // Payment method
  true,                       // Whether annual billing was selected
  'tx_12345',                 // Transaction ID
  true                        // Whether payment was successful
);
```

### Feature Access Tracking

```typescript
import { trackFeatureAccess, hasFeatureAccess } from '../services/analytics/utils/subscriptionAnalytics';

// Check if a user has access to a feature
const hasAccess = hasFeatureAccess(
  'advanced_business_forecast',  // Feature name
  'basic'                        // User's subscription tier: 'free', 'basic', 'pro', 'enterprise'
);

// Track feature access attempt
await trackFeatureAccess(
  userId,                     // User ID
  'advanced_business_forecast',  // Feature being accessed
  'basic',                    // User's subscription tier
  hasAccess                   // Whether access was granted
);
```

## Astrology-Specific A/B Testing

The Corp Astro Analytics system includes specialized A/B testing for astrology-related features and flows.

### Onboarding Flow Testing

```typescript
import { getAstrologyTestVariant, trackAstrologyTestConversion, AstrologyTestType, AstrologyConversionType } from '../services/analytics/utils/astrologyABTests';

// Get the variant for a user
const testResult = await getAstrologyTestVariant(
  'new_onboarding_flow',     // Test name
  userId,                     // User ID
  sessionId                   // Optional session ID for anonymous users
);

if (testResult) {
  const { variantName, variantConfig } = testResult;
  
  // Apply the variant based on configuration
  if (variantName === 'control') {
    // Show original onboarding
    showOnboardingSteps(variantConfig.steps);
  } else if (variantName === 'simplified') {
    // Show simplified onboarding
    showOnboardingSteps(variantConfig.steps);
  }
  
  // Later, when the user completes the goal (e.g., adds business details):
  await trackAstrologyTestConversion(
    'new_onboarding_flow',    // Test name
    userId,                   // User ID
    sessionId                 // Optional session ID for anonymous users
  );
}
```

### Chart Visualization Testing

```typescript
import { getAstrologyTestVariant, trackAstrologyTestConversion } from '../services/analytics/utils/astrologyABTests';

// Get the variant for a user
const testResult = await getAstrologyTestVariant(
  'chart_visualization_test',  // Test name
  userId,                     // User ID
  sessionId                   // Optional session ID for anonymous users
);

if (testResult) {
  const { variantName, variantConfig } = testResult;
  
  // Apply the chart visualization style based on variant
  applyChartStyle({
    style: variantConfig.style,             // e.g., 'modern', 'traditional'
    colorScheme: variantConfig.colorScheme, // e.g., 'dark', 'light', 'colorful'
    ...variantConfig                         // Any other config options
  });
  
  // Later, when the user generates a chart:
  await trackAstrologyTestConversion(
    'chart_visualization_test',  // Test name
    userId,                     // User ID
    sessionId                   // Optional session ID for anonymous users
  );
}
```
