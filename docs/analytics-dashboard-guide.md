# Analytics Dashboard Guide

This guide explains how to use the Corp Astro Analytics Dashboard to monitor user behavior, track feature usage, and optimize your application through A/B testing.

## Overview

The Analytics Dashboard provides a comprehensive view of your application's performance and user engagement metrics. It allows you to:

- Track user growth and activity
- Monitor feature usage across different subscription tiers
- Analyze user journeys and conversion funnels
- Evaluate A/B test results to optimize user experiences

## Accessing the Dashboard

The Analytics Dashboard is available to admin users at:

```
/admin/analytics
```

You must be logged in with admin privileges to access the dashboard.

## Dashboard Sections

### 1. Overview

The Overview tab provides a high-level summary of key metrics, including:

- **User Metrics**: Total users, active users, and new user growth
- **Feature Usage**: Chart generations, horoscope views, business forecasts, and free tool usage
- **Subscription Metrics**: Conversion rates and distribution by tier
- **Time-based Trends**: User growth and feature usage over time
- **Feature Breakdowns**: Usage statistics by feature type
- **A/B Test Summary**: Quick view of ongoing and completed tests

### 2. User Journeys

The User Journeys tab allows you to analyze how users progress through defined paths in your application:

- **Journey Completion Rates**: See what percentage of users complete each journey
- **Stage Analysis**: Identify where users drop off in each journey
- **Filter by Journey**: Focus on specific journeys to optimize

### 3. A/B Tests

The A/B Tests tab provides detailed results for your experiments:

- **Test Details**: View test parameters, duration, and status
- **Variant Performance**: Compare conversion rates between variants
- **Winner Identification**: See which variant performed best
- **Visualization**: Visual comparison of variant performance

## Using Filters

The dashboard includes powerful filtering capabilities:

- **Date Range**: Select specific time periods for analysis
- **Subscription Tier**: Filter data by free, subscription, or premium users
- **Journey Name**: Focus on specific user journeys
- **Test Name**: View results for specific A/B tests

## Key Metrics Explained

### User Metrics

- **Total Users**: Total number of unique users who have used the application
- **Active Users**: Users who performed at least one action in the selected period
- **New Users**: Users who joined during the selected period

### Feature Usage

- **Chart Generations**: Number of astrological charts generated
- **Horoscope Views**: Number of daily/monthly horoscope views
- **Business Forecasts**: Number of business forecast requests
- **Free Tool Usage**: Usage of free tools like name analysis, tagline analysis, etc.

### A/B Test Metrics

- **Impressions**: Number of users who saw each variant
- **Conversions**: Number of users who completed the desired action
- **Conversion Rate**: Percentage of impressions that resulted in conversions

## Best Practices

1. **Regular Monitoring**: Check the dashboard weekly to track trends and identify issues
2. **Comparative Analysis**: Compare metrics across different time periods to spot trends
3. **Segmentation**: Use filters to understand how different user segments behave
4. **A/B Testing**: Always run tests before making significant changes to the user experience
5. **Journey Optimization**: Focus on improving journeys with low completion rates

## Technical Implementation

The dashboard is built using:

- React with Material UI for the frontend components
- Recharts for data visualization
- Express.js API endpoints for data retrieval
- Sequelize for database queries

## API Endpoints

The dashboard uses the following API endpoints:

- `GET /api/analytics/dashboard/metrics`: Retrieves overview metrics
- `GET /api/analytics/dashboard/journeys`: Retrieves user journey metrics
- `GET /api/analytics/dashboard/ab-tests/:testName`: Retrieves A/B test results

## Adding Custom Metrics

To add custom metrics to the dashboard:

1. Define the metric in the backend controller (`dashboardController.ts`)
2. Update the frontend component (`AnalyticsDashboard.tsx`) to display the new metric
3. Ensure proper tracking of the metric in your application code

## Troubleshooting

If you encounter issues with the dashboard:

- Check that you have admin privileges
- Verify that the date range contains data
- Ensure that analytics events are being properly tracked
- Check the browser console for any JavaScript errors
- Verify that the API endpoints are responding correctly

For further assistance, contact the development team.
