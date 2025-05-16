# Corp Astro Subscription System Guide

This guide provides detailed information about the subscription system in the Corp Astro backend. The subscription system manages user access to different features and content based on their subscription tier (free, subscription, or premium).

## Table of Contents

1. [Overview](#overview)
2. [Subscription Tiers](#subscription-tiers)
3. [Feature Access Control](#feature-access-control)
4. [API Endpoints](#api-endpoints)
5. [Subscription Lifecycle](#subscription-lifecycle)
6. [Payment Integration](#payment-integration)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

## Overview

The Corp Astro subscription system implements a tiered approach to content and feature access:

- **Free Tier**: Basic features and free tools
- **Subscription Tier**: Daily horoscopes, monthly reports, and Astro Ratan chat access
- **Premium Tier**: All subscription features plus business insights and human astrologer appointments

The system handles:

- Subscription creation and management
- Feature access control based on subscription tier
- Payment processing and billing
- Subscription lifecycle events (creation, renewal, cancellation, expiration)
- Upgrade/downgrade workflows

## Subscription Tiers

### Free Tier

The free tier provides access to basic features and is the default for new users.

**Features**:
- Free tools (name number analysis, tagline analysis, brand color analysis)
- Limited content access
- Ad-supported experience
- One business profile

### Subscription Tier

The subscription tier provides access to personalized daily content and is available for a monthly fee.

**Features**:
- All free tier features
- Daily horoscopes
- Monthly reports
- Astro Ratan chat access
- Ad-free experience
- Up to 3 business profiles
- Content personalization

### Premium Tier

The premium tier provides access to all features and is available for a higher monthly fee.

**Features**:
- All subscription tier features
- Business insights
- Human astrologer appointments
- Priority support
- Up to 10 business profiles
- Advanced content personalization
- Downloadable reports

## Feature Access Control

The subscription system controls access to features based on the user's subscription tier. This is implemented through a feature access control system that checks the user's subscription before allowing access to protected features.

### Feature Map

The following table shows which features are available in each subscription tier:

| Feature | Free | Subscription | Premium |
|---------|------|--------------|---------|
| Name Number Analysis | ✅ | ✅ | ✅ |
| Tagline Analysis | ✅ | ✅ | ✅ |
| Brand Color Analysis | ✅ | ✅ | ✅ |
| Daily Horoscope | ❌ | ✅ | ✅ |
| Monthly Report | ❌ | ✅ | ✅ |
| Astro Ratan Chat | ❌ | ✅ | ✅ |
| Human Astrologer Access | ❌ | ❌ | ✅ |
| Business Compatibility | ❌ | ❌ | ✅ |
| Max Business Profiles | 1 | 3 | 10 |
| Max Saved Reports | 5 | 20 | Unlimited |
| Ad-Free | ❌ | ✅ | ✅ |

### Access Control Implementation

Feature access is controlled through the `hasAccess` method in the subscription service:

```typescript
// Check if user has access to a feature
const hasAccess = await subscriptionService.hasAccess(userId, 'dailyHoroscope');

if (hasAccess) {
  // Generate and return daily horoscope
} else {
  // Return subscription required error
}
```

## API Endpoints

### Subscription Management

#### Get Current Subscription

```
GET /api/subscription
```

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "tier": "subscription",
    "startDate": "2025-01-15T00:00:00.000Z",
    "expiryDate": "2025-06-15T00:00:00.000Z",
    "autoRenew": true,
    "paymentMethod": {
      "type": "card",
      "last4": "4242",
      "expiryMonth": 12,
      "expiryYear": 2026
    },
    "features": [
      "nameNumberAnalysis",
      "taglineAnalysis",
      "brandColorAnalysis",
      "dailyHoroscope",
      "monthlyReport",
      "astroRatanChat"
    ],
    "limits": {
      "maxBusinessProfiles": 3,
      "maxSavedReports": 20
    }
  }
}
```

#### Create Subscription

```
POST /api/subscription
```

**Authentication**: Required

**Request Body**:
```json
{
  "tier": "subscription",
  "paymentMethodId": "pm_123456789",
  "couponCode": "WELCOME20"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_123456789",
    "tier": "subscription",
    "startDate": "2025-05-16T05:22:48+05:30",
    "expiryDate": "2025-06-16T05:22:48+05:30",
    "autoRenew": true,
    "paymentMethod": {
      "type": "card",
      "last4": "4242",
      "expiryMonth": 12,
      "expiryYear": 2026
    },
    "features": [
      "nameNumberAnalysis",
      "taglineAnalysis",
      "brandColorAnalysis",
      "dailyHoroscope",
      "monthlyReport",
      "astroRatanChat"
    ],
    "limits": {
      "maxBusinessProfiles": 3,
      "maxSavedReports": 20
    }
  }
}
```

#### Update Subscription

```
PUT /api/subscription
```

**Authentication**: Required

**Request Body**:
```json
{
  "tier": "premium",
  "paymentMethodId": "pm_123456789"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_123456789",
    "tier": "premium",
    "startDate": "2025-05-16T05:22:48+05:30",
    "expiryDate": "2025-06-16T05:22:48+05:30",
    "autoRenew": true,
    "paymentMethod": {
      "type": "card",
      "last4": "4242",
      "expiryMonth": 12,
      "expiryYear": 2026
    },
    "features": [
      "nameNumberAnalysis",
      "taglineAnalysis",
      "brandColorAnalysis",
      "dailyHoroscope",
      "monthlyReport",
      "astroRatanChat",
      "humanAstrologerAccess",
      "businessCompatibility"
    ],
    "limits": {
      "maxBusinessProfiles": 10,
      "maxSavedReports": 100
    },
    "prorationDetails": {
      "previousTier": "subscription",
      "proratedAmount": 15.00,
      "proratedDays": 20
    }
  }
}
```

#### Cancel Subscription

```
DELETE /api/subscription
```

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_123456789",
    "tier": "subscription",
    "cancelledAt": "2025-05-16T05:22:48+05:30",
    "expiryDate": "2025-06-16T05:22:48+05:30",
    "autoRenew": false,
    "message": "Your subscription will remain active until the end of the current billing period."
  }
}
```

### Payment Methods

#### Get Payment Methods

```
GET /api/subscription/payment-methods
```

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "paymentMethods": [
      {
        "id": "pm_123456789",
        "type": "card",
        "brand": "visa",
        "last4": "4242",
        "expiryMonth": 12,
        "expiryYear": 2026,
        "isDefault": true
      },
      {
        "id": "pm_987654321",
        "type": "card",
        "brand": "mastercard",
        "last4": "5555",
        "expiryMonth": 10,
        "expiryYear": 2027,
        "isDefault": false
      }
    ]
  }
}
```

#### Add Payment Method

```
POST /api/subscription/payment-methods
```

**Authentication**: Required

**Request Body**:
```json
{
  "paymentMethodId": "pm_123456789",
  "setAsDefault": true
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "paymentMethod": {
      "id": "pm_123456789",
      "type": "card",
      "brand": "visa",
      "last4": "4242",
      "expiryMonth": 12,
      "expiryYear": 2026,
      "isDefault": true
    }
  }
}
```

#### Remove Payment Method

```
DELETE /api/subscription/payment-methods/{paymentMethodId}
```

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "message": "Payment method removed successfully"
}
```

### Billing

#### Get Invoices

```
GET /api/subscription/invoices
```

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "inv_123456789",
        "amount": 19.99,
        "currency": "USD",
        "status": "paid",
        "date": "2025-05-16T05:22:48+05:30",
        "description": "Corp Astro Subscription - May 2025",
        "downloadUrl": "https://api.corp-astro.com/api/subscription/invoices/inv_123456789/pdf"
      },
      {
        "id": "inv_987654321",
        "amount": 19.99,
        "currency": "USD",
        "status": "paid",
        "date": "2025-04-16T05:22:48+05:30",
        "description": "Corp Astro Subscription - April 2025",
        "downloadUrl": "https://api.corp-astro.com/api/subscription/invoices/inv_987654321/pdf"
      }
    ]
  }
}
```

#### Get Invoice PDF

```
GET /api/subscription/invoices/{invoiceId}/pdf
```

**Authentication**: Required

**Response**: PDF file

## Subscription Lifecycle

The subscription system manages the entire lifecycle of a subscription:

### Creation

When a user subscribes:

1. User selects a subscription tier
2. User provides payment information
3. Payment is processed
4. Subscription is created with a start date and expiry date
5. User is granted access to tier-specific features

### Renewal

When a subscription is due for renewal:

1. System attempts to charge the user's payment method
2. If successful, the subscription expiry date is extended
3. User continues to have access to tier-specific features
4. If unsuccessful, the system retries payment and notifies the user

### Cancellation

When a user cancels their subscription:

1. User requests cancellation
2. Subscription is marked as cancelled but remains active until the end of the current billing period
3. Auto-renewal is disabled
4. User is notified of the cancellation and final active date

### Expiration

When a subscription expires:

1. User's access to tier-specific features is revoked
2. User is downgraded to the free tier
3. User is notified of the expiration
4. User is prompted to resubscribe

### Upgrade/Downgrade

When a user changes their subscription tier:

1. User selects a new tier
2. System calculates prorated charges or credits
3. Payment is processed
4. Subscription is updated with the new tier
5. User's access to features is updated immediately

## Payment Integration

The subscription system integrates with payment processors to handle subscription payments:

### Supported Payment Processors

- Stripe
- PayPal
- Razorpay (for India)

### Payment Flow

1. User selects a subscription tier
2. User is redirected to the payment processor's checkout page or a secure form
3. User enters payment details
4. Payment processor validates and processes the payment
5. Payment processor notifies the Corp Astro backend of the payment status
6. Corp Astro backend updates the user's subscription status

### Webhooks

The subscription system uses webhooks to receive real-time updates from payment processors:

- `payment.succeeded`: Payment was successful
- `payment.failed`: Payment failed
- `subscription.created`: Subscription was created
- `subscription.updated`: Subscription was updated
- `subscription.cancelled`: Subscription was cancelled
- `subscription.expired`: Subscription expired

## Error Handling

The subscription system uses the standard Corp Astro error format:

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| `PAYMENT_FAILED` | Payment processing failed |
| `INVALID_PAYMENT_METHOD` | Invalid or expired payment method |
| `SUBSCRIPTION_NOT_FOUND` | Subscription not found |
| `INVALID_SUBSCRIPTION_TIER` | Invalid subscription tier |
| `FEATURE_NOT_AVAILABLE` | Feature not available in the current subscription tier |
| `LIMIT_EXCEEDED` | User has exceeded a limit in their subscription tier |
| `COUPON_INVALID` | Invalid or expired coupon code |

### Feature Access Errors

When a user attempts to access a feature not available in their subscription tier:

```json
{
  "success": false,
  "message": "This feature requires a premium subscription",
  "error": {
    "code": "SUBSCRIPTION_REQUIRED",
    "details": "Premium subscription required for business insights",
    "requiredTier": "premium",
    "currentTier": "subscription",
    "upgradeUrl": "https://corp-astro.com/upgrade"
  }
}
```

## Best Practices

### Client-Side Implementation

#### Feature Access Checks

Implement client-side feature access checks to provide a better user experience:

```javascript
// Check if user has access to a feature
async function hasAccess(feature) {
  try {
    const response = await fetch(`https://api.corp-astro.com/api/subscription/access/${feature}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    return data.success && data.data.hasAccess;
  } catch (error) {
    console.error('Error checking feature access:', error);
    return false;
  }
}

// Usage
if (await hasAccess('dailyHoroscope')) {
  // Show daily horoscope UI
} else {
  // Show subscription upgrade prompt
}
```

#### Subscription UI

Implement a clear subscription UI that shows:

- Current subscription tier
- Features included in the current tier
- Features available in higher tiers
- Subscription expiry date
- Payment method information
- Billing history

#### Upgrade Prompts

Implement contextual upgrade prompts when a user attempts to access a feature not available in their current tier:

```javascript
async function accessFeature(feature) {
  try {
    const response = await fetch(`https://api.corp-astro.com/api/content/${feature}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!data.success && data.error.code === 'SUBSCRIPTION_REQUIRED') {
      // Show upgrade prompt
      showUpgradePrompt(data.error.requiredTier, data.error.upgradeUrl);
      return null;
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error accessing ${feature}:`, error);
    return null;
  }
}
```

### Server-Side Implementation

#### Feature Access Control

Implement robust feature access control on the server side:

```typescript
// Middleware to check feature access
const requireFeatureAccess = (feature: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: {
            code: 'UNAUTHORIZED',
            details: 'You must be logged in to access this feature'
          }
        });
      }
      
      const hasAccess = await subscriptionService.hasAccess(userId, feature);
      
      if (!hasAccess) {
        const subscription = await subscriptionService.getUserSubscription(userId);
        
        return res.status(403).json({
          success: false,
          message: `This feature requires a ${subscription.requiredTier} subscription`,
          error: {
            code: 'SUBSCRIPTION_REQUIRED',
            details: `${subscription.requiredTier} subscription required for ${feature}`,
            requiredTier: subscription.requiredTier,
            currentTier: subscription.currentTier,
            upgradeUrl: 'https://corp-astro.com/upgrade'
          }
        });
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Usage
router.get('/daily-horoscope', requireFeatureAccess('dailyHoroscope'), dailyHoroscopeController);
```

#### Subscription Expiry Handling

Implement proper handling of subscription expiry:

```typescript
// Scheduled job to handle expired subscriptions
const handleExpiredSubscriptions = async () => {
  try {
    const expiredSubscriptions = await subscriptionService.getExpiredSubscriptions();
    
    for (const subscription of expiredSubscriptions) {
      // Downgrade user to free tier
      await subscriptionService.downgradeToFreeTier(subscription.userId);
      
      // Send expiration notification
      await notificationService.sendSubscriptionExpiredNotification(subscription.userId);
      
      // Log expiration
      logger.info(`Subscription expired for user ${subscription.userId}`);
    }
  } catch (error) {
    logger.error('Error handling expired subscriptions:', error);
  }
};

// Run daily
cron.schedule('0 0 * * *', handleExpiredSubscriptions);
```

#### Payment Retry Strategy

Implement a payment retry strategy for failed payments:

```typescript
// Retry failed payments
const retryFailedPayments = async () => {
  try {
    const failedPayments = await paymentService.getFailedPayments();
    
    for (const payment of failedPayments) {
      // Skip if maximum retry attempts reached
      if (payment.retryCount >= 3) {
        // Mark subscription as expired
        await subscriptionService.expireSubscription(payment.subscriptionId);
        
        // Send final failure notification
        await notificationService.sendPaymentFailedFinalNotification(payment.userId);
        
        continue;
      }
      
      // Retry payment
      const result = await paymentService.retryPayment(payment.id);
      
      if (result.success) {
        // Payment succeeded, update subscription
        await subscriptionService.renewSubscription(payment.subscriptionId);
        
        // Send success notification
        await notificationService.sendPaymentSuccessNotification(payment.userId);
      } else {
        // Payment failed again, increment retry count
        await paymentService.incrementRetryCount(payment.id);
        
        // Send failure notification
        await notificationService.sendPaymentFailedNotification(payment.userId, payment.retryCount + 1);
      }
    }
  } catch (error) {
    logger.error('Error retrying failed payments:', error);
  }
};

// Run daily
cron.schedule('0 12 * * *', retryFailedPayments);
```

By following these guidelines, you can implement a robust subscription system that provides a seamless experience for users while ensuring proper access control and payment processing.
