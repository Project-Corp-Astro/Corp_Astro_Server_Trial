# Corp Astro Analytics Implementation Guide

This guide provides step-by-step instructions for setting up and using the Corp Astro Analytics system. The analytics system is designed specifically for tracking astrology-related metrics, user journeys, and optimizing the business through A/B testing.

## Table of Contents

1. [System Overview](#system-overview)
2. [Prerequisites](#prerequisites)
3. [Database Setup](#database-setup)
4. [Running Migrations](#running-migrations)
5. [Frontend Integration](#frontend-integration)
6. [Tracking Key Metrics](#tracking-key-metrics)
7. [Setting Up A/B Tests](#setting-up-ab-tests)
8. [Using the Dashboards](#using-the-dashboards)
9. [Analyzing the Data](#analyzing-the-data)
10. [Troubleshooting](#troubleshooting)

## System Overview

The Corp Astro Analytics system consists of:

- **Database**: PostgreSQL for storing analytics events, user journeys, and A/B test data
- **Backend Services**: TypeScript services for tracking and analyzing data
- **Frontend SDK**: Client-side library for tracking events and implementing A/B tests
- **Dashboards**: React components for visualizing analytics data

## Prerequisites

Before setting up the analytics system, ensure you have:

- Node.js 14+ and npm installed
- Docker and Docker Compose installed (for the database)
- PostgreSQL client tools (optional, for direct database access)

## Database Setup

The analytics system uses PostgreSQL to store all analytics data. We've provided a Docker Compose configuration to make setup easy.

### Using the Setup Script

We've created a setup script that handles the entire process:

```bash
# Make the script executable if needed
chmod +x scripts/setup-analytics.sh

# Run the setup script
./scripts/setup-analytics.sh
```

This script will:
1. Start the PostgreSQL database using Docker
2. Wait for the database to be ready
3. Run the necessary migrations
4. Provide connection information

### Manual Setup

If you prefer to set up the database manually:

1. Start the PostgreSQL container:

```bash
docker-compose -f docker-compose.analytics.yml up -d
```

2. Verify the database is running:

```bash
docker exec corp-astro-analytics-db pg_isready -U postgres
```

## Running Migrations

The migrations create all necessary tables for the analytics system. If you used the setup script, migrations have already been run. Otherwise:

```bash
# Run migrations
npx sequelize-cli db:migrate

# If you need to undo migrations
npx sequelize-cli db:migrate:undo:all
```

## Frontend Integration

To integrate the analytics system with your frontend applications, follow these steps:

1. Import the analytics SDK:

```typescript
import { CorpAstroAnalytics } from '../path/to/CorpAstroAnalytics';
```

2. Initialize the SDK in your application's entry point:

```typescript
const analytics = new CorpAstroAnalytics({
  apiUrl: '/api/analytics',
  appVersion: '1.0.0',
  debug: process.env.NODE_ENV !== 'production',
  userIdProvider: () => getUserId() // Your function to get the current user ID
});

// Make analytics available globally if needed
window.analytics = analytics;
```

3. For more detailed integration instructions, see the [Analytics Integration Guide](./analytics-integration-guide.md).

## Tracking Key Metrics

The analytics system is designed to track metrics specific to your astrology business. Here are the key metrics to implement:

### Chart Generation

Track when users generate astrological charts:

```typescript
import { trackChartGeneration } from '../services/analytics/utils/astrologyMetrics';

await trackChartGeneration(
  userId,
  'natal', // Chart type: 'natal', 'transit', 'synastry', 'composite', 'progressed', 'dasha'
  businessId, // Optional business ID
  generationTime, // Time in ms
  chartData // Optional additional data
);
```

### Horoscope Views

Track when users view horoscopes:

```typescript
import { trackHoroscopeView } from '../services/analytics/utils/astrologyMetrics';

await trackHoroscopeView(
  userId,
  'daily', // Horoscope type: 'daily', 'weekly', 'monthly'
  'basic', // Subscription tier
  contentId // Optional content ID
);
```

### Business Forecasts

Track business forecast views:

```typescript
import { trackBusinessForecast } from '../services/analytics/utils/astrologyMetrics';

await trackBusinessForecast(
  userId,
  businessId,
  'financial', // Forecast type
  'monthly', // Forecast period
  contentId // Optional content ID
);
```

### Free Tool Usage

Track when users use free tools:

```typescript
import { trackFreeToolUsage } from '../services/analytics/utils/astrologyMetrics';

await trackFreeToolUsage(
  userId,
  'name_analysis', // Tool name
  inputData, // Input data
  resultData, // Result data
  usageDuration // Duration in seconds
);
```

### Subscription Changes

Track subscription tier changes:

```typescript
import { trackSubscriptionChange } from '../services/analytics/utils/astrologyMetrics';

await trackSubscriptionChange(
  userId,
  previousTier, // Previous tier or null for new subscriptions
  newTier, // New tier
  'upgrade' // Change reason
);
```

### Astro Ratan AI Chat

Track AI chat interactions:

```typescript
import { trackAstroRatanChat } from '../services/analytics/utils/astrologyMetrics';

await trackAstroRatanChat(
  userId,
  sessionId,
  messageCount,
  topicCategories, // Optional
  satisfactionScore // Optional
);
```

## Setting Up A/B Tests

The analytics system includes a powerful A/B testing framework designed specifically for astrology applications.

### Creating an Onboarding Test

```typescript
import { createOnboardingTest } from '../services/analytics/utils/astrologyABTests';

const testId = await createOnboardingTest(
  'new_onboarding_flow',
  [
    {
      name: 'control',
      weight: 50,
      steps: ['business_details', 'founder_details', 'business_goals', 'chart_preferences'],
      additionalConfig: { showProgressBar: true }
    },
    {
      name: 'simplified',
      weight: 50,
      steps: ['combined_business_founder', 'business_goals'],
      additionalConfig: { showProgressBar: true }
    }
  ]
);
```

### Implementing the Test in UI

```typescript
import { getAstrologyTestVariant, trackAstrologyTestConversion } from '../services/analytics/utils/astrologyABTests';

// Get the variant for a user
const testResult = await getAstrologyTestVariant(
  'new_onboarding_flow',
  userId,
  sessionId // Optional
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
  
  // Later, when the user completes the goal:
  await trackAstrologyTestConversion(
    'new_onboarding_flow',
    userId,
    sessionId // Optional
  );
}
```

### Other Test Types

The system supports various test types:

- Chart visualization tests
- Subscription page tests
- Horoscope format tests
- Business forecast tests
- Astro Ratan interface tests

For examples, see the [A/B Testing Guide](./analytics-ab-testing-guide.md).

## Using the Dashboards

The analytics system includes pre-built dashboards for visualizing your data:

### User Growth Dashboard

```typescript
import UserGrowthDashboard from '../services/analytics/examples/user-growth-dashboard';

// In your React component
return <UserGrowthDashboard />;
```

### Astrology Features Dashboard

```typescript
import AstrologyFeaturesDashboard from '../services/analytics/examples/astrology-features-dashboard';

// In your React component
return <AstrologyFeaturesDashboard />;
```

## Analyzing the Data

The analytics system provides several utility functions for analyzing your data:

### Subscription Funnel Analysis

```typescript
import { getSubscriptionFunnelMetrics } from '../services/analytics/utils/subscriptionAnalytics';

const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
const endDate = new Date();

const funnelMetrics = await getSubscriptionFunnelMetrics(startDate, endDate);
```

### Feature Usage Analysis

```typescript
import { getFeatureUsageByTier } from '../services/analytics/utils/subscriptionAnalytics';

const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
const endDate = new Date();

const featureUsage = await getFeatureUsageByTier(startDate, endDate);
```

### Retention Analysis

```typescript
import { getSubscriptionRetentionMetrics } from '../services/analytics/utils/subscriptionAnalytics';

const retentionMetrics = await getSubscriptionRetentionMetrics(6); // 6 months
```

### A/B Test Results

```typescript
import { getAstrologyTestResults } from '../services/analytics/utils/astrologyABTests';

const testResults = await getAstrologyTestResults('new_onboarding_flow');
```

## Troubleshooting

### Database Connection Issues

If you're having trouble connecting to the database:

1. Check if the Docker container is running:

```bash
docker ps | grep corp-astro-analytics-db
```

2. Check the container logs:

```bash
docker logs corp-astro-analytics-db
```

3. Verify your database configuration in `src/config/database.js`

### Migration Errors

If migrations fail:

1. Check the error message for specific issues
2. Verify that the database exists and is accessible
3. Try running migrations with the `--debug` flag:

```bash
npx sequelize-cli db:migrate --debug
```

### Tracking Issues

If events aren't being tracked:

1. Check browser console for errors
2. Verify that the analytics SDK is properly initialized
3. Check network requests to ensure they're reaching the server
4. Verify that the server is processing and storing events correctly

For more help, contact the development team or refer to the API documentation.
