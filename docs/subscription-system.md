# Corp Astro Subscription System

This document provides an overview of the subscription tier system implemented in the Corp Astro backend server.

## Overview

The subscription system implements a tiered approach to content access, with three main tiers:

1. **Free Tier** - Access to basic tools and features
2. **Basic Subscription** - Access to daily horoscopes and monthly reports
3. **Premium Tier** - Full access to all features including business insights and Astro Ratan chat

## Subscription Tiers

### Free Tier
- Name number analysis
- Tagline analysis
- Company brand color analysis
- Basic astrological information

### Basic Subscription
- All Free tier features
- Personalized daily horoscopes
- Do's and don'ts based on planetary positions
- Monthly astrological reports
- Business compatibility insights

### Premium Tier
- All Basic tier features
- Detailed business insights
- Compatibility analysis with business partners
- Astro Ratan chat access
- Priority customer support
- Appointments with human astrology specialists

## Database Models

The subscription system uses the following models:

### SubscriptionTier
Represents the available subscription tiers in the system.

**Fields:**
- `id` (UUID): Unique identifier
- `tier_name` (String): Display name for the tier
- `tier_code` (String): Code used to identify the tier (e.g., 'free', 'basic', 'premium')
- `price` (Decimal): Price of the subscription
- `currency` (String): Currency for the price (default: 'USD')
- `billing_cycle` (Enum): 'monthly', 'quarterly', or 'yearly'
- `features` (JSONB Array): List of features included in this tier
- `active` (Boolean): Whether this tier is currently active

### UserSubscription
Tracks individual user subscriptions.

**Fields:**
- `id` (UUID): Unique identifier
- `user_id` (UUID): User ID
- `subscription_tier_id` (UUID): Reference to the subscription tier
- `start_date` (Date): When the subscription starts
- `end_date` (Date): When the subscription ends
- `auto_renew` (Boolean): Whether to automatically renew
- `payment_status` (Enum): 'pending', 'completed', 'failed', or 'refunded'
- `payment_method` (String): Method used for payment
- `transaction_id` (String): Optional transaction ID for reference

## API Endpoints

### Subscription Management

#### GET /api/subscription/tiers
Returns all available subscription tiers.

#### GET /api/subscription/user
Returns the current user's subscription details.

#### POST /api/subscription/subscribe
Subscribe to a tier.

**Request Body:**
```json
{
  "tierCode": "basic",
  "paymentMethod": "credit_card",
  "transactionId": "optional-transaction-id"
}
```

#### POST /api/subscription/cancel
Cancel the current subscription.

#### GET /api/subscription/access/:contentType
Check if the user has access to a specific content type.

### Content Access

Content endpoints are protected by the subscription check middleware, which verifies that the user has the appropriate subscription tier to access the requested content.

## Integration with Content Generation

The subscription system integrates with the content generation system through middleware that checks the user's subscription tier before allowing access to premium content.

### Middleware

The `checkContentAccess` middleware function in `src/middleware/subscriptionCheck.ts` verifies that a user has access to a specific content type based on their subscription tier.

### Usage in Routes

Content routes use this middleware to protect premium content:

```typescript
router.get(
  '/horoscope/daily/:userId',
  isAuthenticated,
  checkContentAccess(ContentTypes.DAILY_HOROSCOPE),
  generateDailyHoroscope
);
```

## Subscription Service

The `subscriptionService` provides methods for:

1. Checking if a user has an active subscription
2. Getting a user's current subscription tier
3. Checking if a user has access to specific content
4. Creating or updating subscriptions
5. Canceling subscriptions

## Caching

The subscription system uses Redis caching to improve performance:

- Active subscription status is cached for 1 hour
- Subscription tier information is cached for 1 hour
- Cache is automatically cleared when a subscription is created, updated, or canceled

## Seeding Default Tiers

Default subscription tiers are seeded into the database on application startup using the `seedSubscriptionTiers` function.

## Error Handling

The subscription system includes comprehensive error handling to ensure that:

1. Users are not incorrectly blocked from accessing content they have paid for
2. Detailed error logs are generated for debugging
3. Appropriate error responses are returned to the client

## Future Enhancements

Planned enhancements for the subscription system include:

1. Subscription analytics and reporting
2. Promotional codes and discounts
3. Tiered pricing based on region
4. Family and business group plans
5. Integration with additional payment providers
