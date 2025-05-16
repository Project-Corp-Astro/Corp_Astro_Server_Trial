# Corp Astro API Documentation

Welcome to the Corp Astro API documentation. This comprehensive guide provides detailed information about the Corp Astro backend server API, which powers the Corp Astro mobile application for corporate astrology.

## Overview

Corp Astro is a comprehensive astrology project focused on corporate astrology for business aspects. The backend server provides the API and services required by the Corp Astro mobile application, including:

- Content generation and delivery (daily horoscopes, monthly reports)
- Subscription tier management (free, subscription, premium)
- Business astrology features
- Free astrological tools (name number analysis, tagline analysis, brand color analysis)
- Mobile-specific API optimizations
- Offline support and data synchronization
- Authentication and user management

## Documentation Guides

### Core Guides

- [Mobile API Guide](./mobile-api-guide.md) - Detailed information about mobile-specific API enhancements
- [Content API Guide](./content-api-guide.md) - Guide to the content generation and delivery system
- [Business API Guide](./business-api-guide.md) - Guide to business profile management and astrological insights
- [Subscription System Guide](./subscription-system-guide.md) - Guide to the subscription tier system
- [Authentication & User Guide](./auth-user-guide.md) - Guide to authentication and user management
- [Astro Engine Integration Guide](./astro-engine-integration-guide.md) - Guide to integrating with the Astro Engine
- [Error Handling Guide](./error-handling-guide.md) - Comprehensive guide to API error handling

### API Reference

The complete API reference is available through the Swagger UI when the server is running:

- **Development**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Production**: [https://api.corp-astro.com/api-docs](https://api.corp-astro.com/api-docs)

## Getting Started

### Authentication

All API requests (except for public endpoints) require authentication using a JWT token. To authenticate, include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

To obtain a token, use the authentication endpoints:

```
POST /api/auth/register - Register a new user
POST /api/auth/login - Login and get authentication token
POST /api/auth/refresh - Refresh authentication token
```

### Base URLs

- **Development**: `http://localhost:3000`
- **Production**: `https://api.corp-astro.com`

### Content Types

The API accepts and returns JSON data. All requests should include the header:

```
Content-Type: application/json
```

### Response Format

All API responses follow a consistent format:

#### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

#### Error Response

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

## Key Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get authentication token
- `POST /api/auth/refresh` - Refresh authentication token

### User Management

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update user preferences

### Content

- `GET /api/content/daily-horoscope` - Get daily horoscope
- `GET /api/content/monthly-report` - Get monthly report
- `GET /api/content/business-insight/:businessId` - Get business insight
- `GET /api/content/free-tools/:toolName` - Use a free astrological tool

### Mobile-Specific

- `POST /api/mobile/device/register` - Register a device for push notifications
- `POST /api/mobile/device/unregister` - Unregister a device
- `GET /api/mobile/config` - Get mobile-specific configuration
- `GET /api/mobile/profile` - Get user profile with mobile-optimized data
- `GET /api/mobile/content/:contentType` - Get mobile-optimized content
- `POST /api/mobile/batch` - Process multiple API requests in a single batch
- `GET /api/mobile/sync` - Get changes since last sync
- `POST /api/mobile/sync` - Submit client changes
- `PUT /api/mobile/sync` - Resolve sync conflicts

### Subscription

- `GET /api/subscription` - Get current subscription
- `POST /api/subscription` - Create subscription
- `PUT /api/subscription` - Update subscription
- `DELETE /api/subscription` - Cancel subscription
- `GET /api/subscription/payment-methods` - Get payment methods
- `POST /api/subscription/payment-methods` - Add payment method
- `DELETE /api/subscription/payment-methods/:id` - Remove payment method
- `GET /api/subscription/invoices` - Get invoices
- `GET /api/subscription/invoices/:id/pdf` - Get invoice PDF

### Business

- `GET /api/business` - Get user's businesses
- `POST /api/business` - Create a new business
- `GET /api/business/:id` - Get business details
- `PUT /api/business/:id` - Update business details
- `DELETE /api/business/:id` - Delete business
- `GET /api/business/:id/chart` - Get business natal chart
- `GET /api/business/:id/compatibility/:id2` - Get business compatibility

### Astrology

- `GET /api/astrology/chart/natal` - Calculate a natal chart
- `GET /api/astrology/chart/transit` - Calculate a transit chart
- `GET /api/astrology/chart/synastry` - Calculate a synastry chart
- `GET /api/astrology/dashas` - Calculate dashas (planetary periods)
- `GET /api/astrology/transits` - Calculate transits
- `GET /api/astrology/planets` - Get planetary positions

## Support

If you have any questions or need assistance with the API, please contact:

- **Support Email**: support@corp-astro.com
- **Developer Portal**: https://developers.corp-astro.com
- **API Status**: https://status.corp-astro.com

## License

The Corp Astro API is proprietary and all rights are reserved. Unauthorized use, reproduction, or distribution is prohibited.
