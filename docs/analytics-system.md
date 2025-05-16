# Analytics System Documentation

## Overview

The Corp Astro Analytics System provides comprehensive tracking, analysis, and optimization capabilities for the Corp Astro application. It enables data-driven decision making through detailed metrics, A/B testing, and user behavior tracking.

## Key Components

### 1. Event Tracking

The event tracking system captures user interactions and system events using a standardized schema:

```typescript
trackEvent(
  eventName: string,
  category: EventCategory,
  action: EventAction,
  properties?: Record<string, any>
): Promise<boolean>
```

#### Event Categories
- `ACCOUNT`: User account-related events
- `SUBSCRIPTION`: Subscription-related events
- `CONTENT`: Content interaction events
- `NAVIGATION`: App navigation events
- `INTERACTION`: User interaction events
- `ASTROLOGY`: Astrology feature usage events
- `REPORT`: Report generation events
- `NOTIFICATION`: Notification-related events
- `ERROR`: Error events
- `PERFORMANCE`: Performance metrics
- `USER_JOURNEY`: User journey/flow events

#### Event Actions
- `VIEW`: Content viewing
- `CLICK`: User clicks
- `SUBMIT`: Form submissions
- `CREATE`: Resource creation
- `UPDATE`: Resource updates
- `DELETE`: Resource deletion
- `SEARCH`: Search actions
- `FILTER`: Filter actions
- `SORT`: Sort actions
- `DOWNLOAD`: Content downloads
- `SHARE`: Content sharing
- `LOGIN`: User login
- `LOGOUT`: User logout
- `REGISTER`: User registration
- `SUBSCRIBE`: Subscription events
- `UNSUBSCRIBE`: Unsubscription events
- `UPGRADE`: Subscription upgrades
- `DOWNGRADE`: Subscription downgrades
- `GENERATE`: Content generation
- `ERROR`: Error occurrences
- `START`: Journey/flow start
- `PROGRESS`: Journey/flow progress
- `COMPLETE`: Journey/flow completion

### 2. A/B Testing Framework

The A/B testing framework allows for controlled experiments to optimize features and user experience:

#### Core Functions

```typescript
// Create a new A/B test
createABTest(
  testName: string,
  variants: string[],
  description?: string
): Promise<string>

// Get the assigned variant for a user
getTestVariant(
  testName: string,
  userId: string
): Promise<{ testId: string; variantName: string } | null>

// Track a conversion for a test
trackTestConversion(
  testName: string,
  userId: string
): Promise<boolean>

// Get test results
getTestResults(
  testName: string
): Promise<{
  testName: string;
  variants: Array<{
    name: string;
    impressions: number;
    conversions: number;
    conversionRate: number;
  }>;
}>
```

#### Astrology-Specific A/B Testing

Specialized functions for astrology feature testing:

```typescript
// Create an astrology-specific A/B test
createAstrologyABTest(
  testName: string,
  variants: string[],
  description?: string
): Promise<string>

// Get the assigned variant for a user for an astrology test
getAstrologyTestVariant(
  testName: string,
  userId: string
): Promise<{ testId: string; variantName: string } | null>

// Track a conversion for an astrology test
trackAstrologyTestConversion(
  testName: string,
  userId: string
): Promise<boolean>

// Get results for an astrology test
getAstrologyTestResults(
  testName: string
): Promise<{
  testName: string;
  variants: Array<{
    name: string;
    impressions: number;
    conversions: number;
    conversionRate: number;
  }>;
}>
```

### 3. Subscription Analytics

The subscription analytics module provides insights into subscription performance:

```typescript
// Get comprehensive subscription analytics
getSubscriptionAnalytics(
  startDate?: Date,
  endDate?: Date
): Promise<Record<string, any>>

// Get subscription funnel metrics
getSubscriptionFunnelMetrics(
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>>

// Get subscription retention metrics
getSubscriptionRetentionMetrics(
  cohortMonths: number = 6
): Promise<Record<string, any>>

// Check if a user has access to a feature based on their subscription tier
hasFeatureAccess(
  featureName: string,
  userTier: 'free' | 'basic' | 'pro' | 'enterprise'
): boolean
```

### 4. Astrology Metrics

Specialized metrics for astrology features:

```typescript
// Get horoscope usage metrics
getHoroscopeMetrics(): Promise<any[]>

// Get feature usage metrics by zodiac sign
getFeatureUsageByZodiacSign(
  featureName: string,
  startDate: Date,
  endDate: Date
): Promise<any[]>

// Get business forecast metrics
getBusinessForecastMetrics(): Promise<any[]>
```

### 5. Heatmap Service

Tracks user interactions with UI elements to generate heatmaps:

```typescript
// Track a user interaction for heatmap generation
trackHeatmapInteraction(
  userId: string,
  page: string,
  x: number,
  y: number,
  elementSelector: string
): Promise<boolean>

// Get heatmap data for analysis
getHeatmapData(
  page?: string,
  startDate?: Date,
  endDate?: Date
): Promise<any[]>
```

## Analytics Dashboard

The analytics dashboard provides a visual interface for monitoring and analyzing data:

### Key Metrics Displayed

1. **User Growth**
   - New user registrations
   - Active users (daily, weekly, monthly)
   - User retention rates

2. **Subscription Performance**
   - Conversion rates by tier
   - Subscription funnel
   - Retention by cohort
   - Revenue metrics

3. **Feature Usage**
   - Most popular features
   - Feature usage by subscription tier
   - Feature usage by zodiac sign
   - Engagement metrics

4. **A/B Test Results**
   - Current and past tests
   - Conversion rates by variant
   - Statistical significance
   - Recommended winners

## Integration with Mobile App

### Mobile SDK

The mobile SDK provides easy integration with the Corp Astro mobile application:

```typescript
// Initialize the analytics SDK
initAnalytics(apiKey: string, userId?: string): void

// Track an event from the mobile app
trackMobileEvent(
  eventName: string,
  category: string,
  action: string,
  properties?: Record<string, any>
): Promise<boolean>

// Get A/B test variant for the current user
getMobileTestVariant(testName: string): Promise<string>

// Track a conversion for an A/B test
trackMobileConversion(testName: string): Promise<boolean>
```

### Offline Support

The mobile SDK supports offline event tracking:

1. Events are stored locally when offline
2. Batch synchronization occurs when connectivity is restored
3. Timestamp tracking ensures proper event ordering

## Integration with Super Admin Panel (SAP)

The analytics system integrates with the Super Admin Panel through:

1. **Analytics Dashboard**: Embedded analytics views in the SAP
2. **A/B Test Management**: Interface for creating and managing tests
3. **Export Capabilities**: Data export for further analysis
4. **Custom Report Generation**: Tools for generating custom reports

## Database Schema

The analytics system uses the following database tables:

1. **AnalyticsEvent**
   - `event_id`: Unique identifier
   - `event_name`: Name of the event
   - `category`: Event category
   - `action`: Event action
   - `user_id`: Associated user (optional)
   - `properties`: JSON object with additional properties
   - `created_at`: Timestamp

2. **ABTest**
   - `test_id`: Unique identifier
   - `test_name`: Name of the test
   - `description`: Test description
   - `variants`: Array of variant names
   - `start_date`: Test start date
   - `end_date`: Test end date (optional)
   - `is_active`: Whether the test is active

3. **ABTestAssignment**
   - `assignment_id`: Unique identifier
   - `test_id`: Associated test
   - `user_id`: Associated user
   - `variant_name`: Assigned variant
   - `assigned_at`: Assignment timestamp
   - `impressions`: Number of impressions
   - `conversions`: Number of conversions

4. **FeatureUsage**
   - `usage_id`: Unique identifier
   - `feature_name`: Name of the feature
   - `user_id`: Associated user
   - `usage_count`: Number of times used
   - `last_used`: Last usage timestamp

5. **UserJourney**
   - `journey_id`: Unique identifier
   - `user_id`: Associated user
   - `journey_name`: Name of the journey
   - `journey_stage`: Current stage of the journey
   - `start_time`: Journey start timestamp
   - `end_time`: Journey completion timestamp
   - `completed`: Whether the journey was completed

## Best Practices

### Event Tracking

1. **Use Standard Categories and Actions**: Stick to the defined EventCategory and EventAction enums
2. **Be Consistent**: Use consistent naming for events across the application
3. **Include Relevant Properties**: Add contextual information in the properties object
4. **Don't Track PII**: Avoid tracking personally identifiable information
5. **Batch Events When Possible**: Use batch tracking for high-volume events

### A/B Testing

1. **Test One Variable at a Time**: Focus on testing a single change
2. **Use Descriptive Test Names**: Make test names clear and descriptive
3. **Define Success Metrics**: Clearly define what constitutes a conversion
4. **Run Tests Long Enough**: Ensure statistical significance before concluding
5. **Document Test Results**: Keep a record of all tests and their outcomes

## Troubleshooting

### Common Issues

1. **Events Not Being Tracked**
   - Check network connectivity
   - Verify API key and authentication
   - Check for console errors

2. **A/B Test Variants Not Consistent**
   - Verify user ID is being passed correctly
   - Check if the test is still active
   - Ensure the test name matches exactly

3. **Dashboard Data Discrepancies**
   - Check date range filters
   - Verify data refresh timing
   - Check for data processing delays

### Logging and Debugging

The analytics system includes detailed logging for troubleshooting:

```typescript
// Enable debug mode
enableAnalyticsDebug(): void

// Get analytics logs
getAnalyticsLogs(): Promise<string[]>
```

## Future Enhancements

Planned enhancements for the analytics system include:

1. **Machine Learning Integration**: Predictive analytics for user behavior
2. **Advanced Segmentation**: More detailed user segmentation capabilities
3. **Real-time Analytics**: Streaming analytics for immediate insights
4. **Enhanced Visualization**: Additional chart types and visualization options
5. **Integration with External Tools**: Export to tools like Google Analytics and Mixpanel
