# Analytics API Documentation

This document provides comprehensive documentation for the Corp Astro Analytics API endpoints. These endpoints are designed to be used by the mobile application to track user behavior and by the Super Admin Panel (SAP) to retrieve analytics data for visualization and analysis.

## Overview

The Analytics API provides endpoints for:

1. Tracking user events and interactions
2. Recording feature usage
3. Managing A/B tests
4. Analyzing user journeys
5. Retrieving analytics data for dashboards

## Base URL

All API endpoints are relative to the base URL:

```
https://api.corpastro.com/api/analytics
```

For local development:

```
http://localhost:3000/api/analytics
```

## Authentication

All analytics endpoints require authentication:

- Mobile app endpoints require a valid JWT token in the Authorization header
- Dashboard endpoints require admin privileges

```
Authorization: Bearer <token>
```

## Tracking Endpoints

### Track Event

Records a general analytics event.

**Endpoint:** `POST /track`

**Request Body:**
```json
{
  "eventName": "app_opened",
  "eventCategory": "app_usage",
  "eventAction": "open",
  "properties": {
    "deviceType": "iOS",
    "appVersion": "1.2.0",
    "subscription_tier": "premium"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event tracked successfully",
  "eventId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Track Feature Usage

Records usage of a specific feature.

**Endpoint:** `POST /feature-usage`

**Request Body:**
```json
{
  "featureCategory": "chart_generation",
  "featureName": "natal_chart",
  "businessId": "550e8400-e29b-41d4-a716-446655440001",
  "properties": {
    "chartType": "sidereal",
    "includeAspects": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feature usage tracked successfully",
  "usageId": "550e8400-e29b-41d4-a716-446655440002"
}
```

### Track User Journey

Records a user's progress through a defined journey.

**Endpoint:** `POST /journey`

**Request Body:**
```json
{
  "journeyName": "onboarding",
  "journeyStage": "profile_completed",
  "isCompleted": false,
  "properties": {
    "timeSpent": 120,
    "skippedSteps": ["tutorial"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Journey progress tracked successfully",
  "journeyId": "550e8400-e29b-41d4-a716-446655440003"
}
```

### Track UI Interaction

Records detailed user interface interactions.

**Endpoint:** `POST /ui-interaction`

**Request Body:**
```json
{
  "screenName": "horoscope_detail",
  "elementId": "share_button",
  "interactionType": "click",
  "coordinates": {
    "x": 320,
    "y": 480
  },
  "properties": {
    "contentId": "550e8400-e29b-41d4-a716-446655440004"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "UI interaction tracked successfully",
  "interactionId": "550e8400-e29b-41d4-a716-446655440005"
}
```

### Batch Track Events

Tracks multiple events in a single request, useful for offline scenarios.

**Endpoint:** `POST /batch`

**Request Body:**
```json
{
  "events": [
    {
      "eventName": "app_opened",
      "eventCategory": "app_usage",
      "eventAction": "open",
      "clientTimestamp": "2025-05-15T12:34:56Z",
      "properties": {
        "deviceType": "iOS"
      }
    },
    {
      "eventName": "feature_used",
      "eventCategory": "feature_usage",
      "eventAction": "use",
      "clientTimestamp": "2025-05-15T12:35:30Z",
      "properties": {
        "featureName": "natal_chart"
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Batch events tracked successfully",
  "processedCount": 2,
  "eventIds": [
    "550e8400-e29b-41d4-a716-446655440006",
    "550e8400-e29b-41d4-a716-446655440007"
  ]
}
```

## A/B Testing Endpoints

### Create A/B Test

Creates a new A/B test.

**Endpoint:** `POST /ab-test`

**Request Body:**
```json
{
  "testName": "onboarding_flow",
  "description": "Testing different onboarding flows to improve conversion",
  "variants": [
    {
      "name": "control",
      "weight": 50
    },
    {
      "name": "variant_a",
      "weight": 25
    },
    {
      "name": "variant_b",
      "weight": 25
    }
  ],
  "startDate": "2025-06-01T00:00:00Z",
  "endDate": "2025-06-30T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "A/B test created successfully",
  "testId": "550e8400-e29b-41d4-a716-446655440008"
}
```

### Get User Variant

Gets the assigned variant for a user.

**Endpoint:** `GET /ab-test/variant/:testName`

**Response:**
```json
{
  "success": true,
  "testName": "onboarding_flow",
  "variant": "variant_a",
  "assignmentId": "550e8400-e29b-41d4-a716-446655440009"
}
```

### Track Conversion

Records a conversion for an A/B test.

**Endpoint:** `POST /ab-test/convert`

**Request Body:**
```json
{
  "testName": "onboarding_flow",
  "assignmentId": "550e8400-e29b-41d4-a716-446655440009"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Conversion tracked successfully"
}
```

## Dashboard Data Endpoints

These endpoints are designed for the Super Admin Panel (SAP) to retrieve analytics data for visualization.

### Get Overview Metrics

Retrieves overview metrics for the dashboard.

**Endpoint:** `GET /dashboard/metrics`

**Query Parameters:**
- `startDate`: Start date for the data (YYYY-MM-DD)
- `endDate`: End date for the data (YYYY-MM-DD)
- `subscriptionTier`: (Optional) Filter by subscription tier (free, subscription, premium, all)

**Response:**
```json
{
  "success": true,
  "metrics": {
    "totalUsers": 15000,
    "activeUsers": 8500,
    "newUsers": 1200,
    "chartGenerations": 25000,
    "horoscopeViews": 45000,
    "businessForecasts": 12000,
    "freeToolUsage": 30000,
    "subscriptionConversions": 500,
    "aiChatInteractions": 18000,
    "chartGenerationsByType": [
      { "name": "natal_chart", "value": 15000 },
      { "name": "transit_chart", "value": 5000 },
      { "name": "synastry_chart", "value": 3000 },
      { "name": "progressed_chart", "value": 2000 }
    ],
    "horoscopeViewsByType": [
      { "name": "daily", "value": 30000 },
      { "name": "weekly", "value": 10000 },
      { "name": "monthly", "value": 5000 }
    ],
    "freeToolUsageByType": [
      { "name": "name_analysis", "value": 12000 },
      { "name": "tagline_analysis", "value": 10000 },
      { "name": "color_analysis", "value": 8000 }
    ],
    "userGrowth": [
      { "date": "2025-05-01", "value": 14000 },
      { "date": "2025-05-02", "value": 14200 },
      { "date": "2025-05-03", "value": 14350 }
    ],
    "featureUsageOverTime": [
      { "date": "2025-05-01", "value": 2500 },
      { "date": "2025-05-02", "value": 2700 },
      { "date": "2025-05-03", "value": 2900 }
    ],
    "subscriptionsByTier": [
      { "name": "free", "value": 10000 },
      { "name": "subscription", "value": 4000 },
      { "name": "premium", "value": 1000 }
    ],
    "abTestResults": [
      {
        "testName": "onboarding_flow",
        "variants": [
          {
            "name": "control",
            "impressions": 5000,
            "conversions": 1000,
            "conversionRate": 20.0
          },
          {
            "name": "variant_a",
            "impressions": 2500,
            "conversions": 600,
            "conversionRate": 24.0
          },
          {
            "name": "variant_b",
            "impressions": 2500,
            "conversions": 550,
            "conversionRate": 22.0
          }
        ]
      }
    ]
  }
}
```

### Get User Journey Metrics

Retrieves user journey metrics.

**Endpoint:** `GET /dashboard/journeys`

**Query Parameters:**
- `startDate`: Start date for the data (YYYY-MM-DD)
- `endDate`: End date for the data (YYYY-MM-DD)
- `journeyName`: (Optional) Filter by journey name

**Response:**
```json
{
  "success": true,
  "journeyMetrics": [
    {
      "name": "onboarding",
      "total": 5000,
      "completed": 3500,
      "completionRate": 70.0
    },
    {
      "name": "subscription",
      "total": 3000,
      "completed": 1500,
      "completionRate": 50.0
    }
  ],
  "journeyStages": {
    "onboarding": [
      { "stage": "signup", "count": 5000 },
      { "stage": "profile_creation", "count": 4500 },
      { "stage": "business_details", "count": 4000 },
      { "stage": "tutorial", "count": 3500 }
    ],
    "subscription": [
      { "stage": "view_plans", "count": 3000 },
      { "stage": "select_plan", "count": 2200 },
      { "stage": "payment_details", "count": 1800 },
      { "stage": "confirmation", "count": 1500 }
    ]
  }
}
```

### Get A/B Test Results

Retrieves detailed results for a specific A/B test.

**Endpoint:** `GET /dashboard/ab-tests/:testName`

**Response:**
```json
{
  "success": true,
  "test": {
    "name": "onboarding_flow",
    "description": "Testing different onboarding flows to improve conversion",
    "startDate": "2025-06-01T00:00:00Z",
    "endDate": "2025-06-30T23:59:59Z",
    "isActive": true
  },
  "variants": [
    {
      "name": "control",
      "impressions": 5000,
      "conversions": 1000,
      "conversionRate": 20.0
    },
    {
      "name": "variant_a",
      "impressions": 2500,
      "conversions": 600,
      "conversionRate": 24.0
    },
    {
      "name": "variant_b",
      "impressions": 2500,
      "conversions": 550,
      "conversionRate": 22.0
    }
  ],
  "winner": {
    "name": "variant_a",
    "impressions": 2500,
    "conversions": 600,
    "conversionRate": 24.0
  }
}
```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "Error code or additional details"
}
```

Common error codes:

- `400`: Bad Request - Invalid parameters or request body
- `401`: Unauthorized - Missing or invalid authentication
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server-side error

## Rate Limiting

To protect the API from abuse, rate limiting is implemented:

- Mobile app endpoints: 100 requests per minute per user
- Dashboard endpoints: 60 requests per minute per admin

When a rate limit is exceeded, the API will respond with a 429 status code and the following response:

```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later.",
  "error": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

## Integration with Mobile SDK

The mobile application should use the provided Analytics SDK to interact with these endpoints. The SDK handles:

- Batching events for efficient network usage
- Offline support with local storage
- Automatic retry on failure
- Session management

For more details on integrating the SDK, refer to the [Mobile Analytics Integration Guide](./mobile-analytics-integration-guide.md).

## Integration with Super Admin Panel

The Super Admin Panel should use the dashboard data endpoints to retrieve analytics data for visualization. These endpoints are designed to provide all the necessary data for building comprehensive dashboards and reports.

For more details on integrating with the SAP, contact the SAP development team.
