# Corp Astro Subscription Tier System

This module implements a comprehensive subscription tier system for the Corp Astro application, providing tiered access to features based on the user's subscription level.

## Overview

The subscription tier system supports three tiers:

1. **Free Tier**: Basic access with limited features
   - Free tools: name number analysis, tagline analysis, company brand color analysis
   - Limited business profile (1 profile)
   - Limited saved reports (5 reports)

2. **Subscription Tier**: Enhanced access with personalized content
   - All free tier features
   - Daily horoscopes
   - Monthly reports
   - Astro Ratan chat access
   - Business compatibility analysis
   - Multiple business profiles (3 profiles)
   - More saved reports (20 reports)
   - Ad-free experience

3. **Premium Tier**: Full access with human astrologer consultations
   - All subscription tier features
   - Human astrologer appointments
   - More business profiles (10 profiles)
   - More saved reports (100 reports)

## Architecture

The subscription tier system is built with the following components:

### Models

- **SubscriptionPlan**: Defines the available subscription plans with pricing and features
- **UserSubscription**: Tracks user subscriptions, including start/end dates and billing cycles
- **SubscriptionHistory**: Records subscription history for auditing and analytics

### Services

- **TierService**: Core service for checking user tiers and feature access
- **ContentTierIntegration**: Integration with the content generation system

### Middleware

- **TierAccess**: Middleware for protecting routes based on subscription tier
- **FeatureAccess**: Middleware for checking access to specific features

### Controllers

- **TierController**: API endpoints for tier-related operations
- **SubscriptionController**: API endpoints for subscription management

## API Endpoints

### Tier Information

- `GET /api/subscription/tiers/all`: Get all available subscription tiers
- `GET /api/subscription/tiers/details/:tierType`: Get details for a specific tier
- `GET /api/subscription/tiers/compare`: Compare all subscription tiers side by side
- `GET /api/subscription/tiers/current`: Get the current user's subscription tier
- `GET /api/subscription/tiers/feature/:featureName`: Check if the user has access to a specific feature

### Subscription Management

- `GET /api/subscription/subscriptionPlan`: Get all subscription plans
- `POST /api/subscription/subscriptionPlan`: Create a new subscription plan (admin only)
- `PUT /api/subscription/subscriptionPlan/:plan_id`: Update a subscription plan (admin only)
- `DELETE /api/subscription/subscriptionPlan/:plan_id`: Delete a subscription plan (admin only)

- `GET /api/subscription/subscroptionUser/:user_id`: Get user's subscriptions
- `POST /api/subscription/subscroptionUser`: Create a new user subscription
- `PUT /api/subscription/subscroptionUser/:subscription_id`: Update user subscription status
- `DELETE /api/subscription/subscroptionUser/:subscription_id`: Delete a user subscription

## Integration with Content Generation

The subscription tier system is integrated with the content generation system to ensure that users can only access content based on their subscription tier:

- Daily horoscopes require at least a subscription tier
- Monthly reports require at least a subscription tier
- Business insights require at least a subscription tier

## Usage Examples

### Checking User Tier

```typescript
import tierService from '../services/subscription/services/tierService';

// Get user's current tier
const userTier = await tierService.getUserTier(userId);

// Check if user has access to a specific feature
const hasAccess = await tierService.hasFeatureAccess(userId, 'dailyHoroscope');

// Check if user has a specific tier or higher
const hasTierAccess = await tierService.hasTierAccess(userId, SubscriptionTierType.SUBSCRIPTION);
```

### Protecting Routes with Middleware

```typescript
import { requireTier, checkFeatureAccess } from '../services/subscription/middleware/tierAccess';
import { SubscriptionTierType } from '../services/subscription/constants/tiers';

// Protect a route that requires a subscription
router.get('/protected-route', isAuthenticated, requireTier(SubscriptionTierType.SUBSCRIPTION), controller.method);

// Check access to a specific feature
router.get('/feature-route', isAuthenticated, checkFeatureAccess('dailyHoroscope'), controller.method);
```

## Future Enhancements

- Payment gateway integration
- Subscription renewal notifications
- Promotional codes and discounts
- Usage analytics and reporting
- Tiered pricing for different regions
