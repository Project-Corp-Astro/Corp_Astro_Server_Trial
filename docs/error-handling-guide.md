# Corp Astro API Error Handling Guide

This guide provides detailed information about error handling in the Corp Astro backend API. Proper error handling is essential for creating a robust and user-friendly experience, especially for mobile applications that may operate in varying network conditions.

## Table of Contents

1. [Overview](#overview)
2. [Error Response Format](#error-response-format)
3. [HTTP Status Codes](#http-status-codes)
4. [Error Categories](#error-categories)
5. [Common Error Codes](#common-error-codes)
6. [Subscription-Related Errors](#subscription-related-errors)
7. [Validation Errors](#validation-errors)
8. [Authentication Errors](#authentication-errors)
9. [Mobile-Specific Errors](#mobile-specific-errors)
10. [Offline Error Handling](#offline-error-handling)
11. [Best Practices](#best-practices)

## Overview

The Corp Astro API implements a consistent error handling mechanism that provides:

- Standardized error response format
- Descriptive error messages
- Specific error codes for different scenarios
- Helpful debugging information (in development environments)
- Localized error messages

This approach helps developers quickly identify and resolve issues when integrating with the API.

## Error Response Format

All API errors follow a consistent JSON format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details",
    "field": "field_name",  // For validation errors
    "params": {},           // Additional parameters related to the error
    "timestamp": "2025-05-16T05:22:48+05:30"
  }
}
```

### Fields Explanation

| Field | Description |
|-------|-------------|
| `success` | Always `false` for error responses |
| `message` | Human-readable error message suitable for displaying to users |
| `error.code` | Machine-readable error code for programmatic handling |
| `error.details` | Technical details about the error (may be omitted in production) |
| `error.field` | For validation errors, indicates which field caused the error |
| `error.params` | Additional parameters that provide context for the error |
| `error.timestamp` | ISO 8601 timestamp when the error occurred |

## HTTP Status Codes

The API uses standard HTTP status codes to indicate the general category of response:

| Status Code | Description |
|-------------|-------------|
| 200 OK | The request was successful (even some expected errors use this) |
| 400 Bad Request | The request was invalid or cannot be served |
| 401 Unauthorized | Authentication is required or failed |
| 403 Forbidden | The authenticated user doesn't have permission |
| 404 Not Found | The requested resource doesn't exist |
| 409 Conflict | The request conflicts with the current state |
| 422 Unprocessable Entity | Validation errors |
| 429 Too Many Requests | Rate limit exceeded |
| 500 Internal Server Error | An unexpected error occurred on the server |
| 503 Service Unavailable | The service is temporarily unavailable |

## Error Categories

Errors in the Corp Astro API are categorized into several groups:

### Client Errors (4xx)

Errors caused by the client sending an invalid request. These should be handled by fixing the request.

### Server Errors (5xx)

Errors caused by issues on the server side. These should be reported to the API provider.

### Business Logic Errors

Errors related to business rules, such as subscription limitations or content availability.

### Validation Errors

Errors related to invalid input data, such as missing required fields or invalid formats.

### Authentication Errors

Errors related to authentication issues, such as invalid tokens or expired sessions.

## Common Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_INPUT` | 400 | The request contains invalid input parameters |
| `MISSING_PARAMETER` | 400 | A required parameter is missing |
| `INVALID_FORMAT` | 400 | A parameter has an invalid format |
| `RESOURCE_NOT_FOUND` | 404 | The requested resource doesn't exist |
| `UNAUTHORIZED` | 401 | Authentication is required |
| `INVALID_TOKEN` | 401 | The authentication token is invalid |
| `TOKEN_EXPIRED` | 401 | The authentication token has expired |
| `FORBIDDEN` | 403 | The user doesn't have permission |
| `SUBSCRIPTION_REQUIRED` | 403 | The requested resource requires a subscription |
| `RATE_LIMITED` | 429 | The user has exceeded the rate limit |
| `INTERNAL_ERROR` | 500 | An unexpected error occurred on the server |
| `SERVICE_UNAVAILABLE` | 503 | The service is temporarily unavailable |

## Subscription-Related Errors

When a user attempts to access content not available in their subscription tier:

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

### Subscription Error Codes

| Error Code | Description |
|------------|-------------|
| `SUBSCRIPTION_REQUIRED` | The user needs a subscription to access this resource |
| `SUBSCRIPTION_EXPIRED` | The user's subscription has expired |
| `SUBSCRIPTION_LIMIT_REACHED` | The user has reached a limit in their subscription (e.g., number of businesses) |
| `PREMIUM_REQUIRED` | The resource requires a premium subscription |

## Validation Errors

Validation errors occur when the request contains invalid data:

```json
{
  "success": false,
  "message": "Invalid input parameters",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": "Multiple validation errors occurred",
    "validationErrors": [
      {
        "field": "email",
        "message": "Invalid email format",
        "code": "INVALID_FORMAT"
      },
      {
        "field": "birthDate",
        "message": "Birth date is required",
        "code": "MISSING_FIELD"
      }
    ]
  }
}
```

### Validation Error Codes

| Error Code | Description |
|------------|-------------|
| `VALIDATION_ERROR` | General validation error |
| `MISSING_FIELD` | A required field is missing |
| `INVALID_FORMAT` | A field has an invalid format |
| `OUT_OF_RANGE` | A numeric field is outside the allowed range |
| `INVALID_DATE` | A date field has an invalid format or value |
| `INVALID_ENUM` | A field value is not one of the allowed enum values |

## Authentication Errors

Authentication errors occur when there are issues with the user's authentication:

```json
{
  "success": false,
  "message": "Authentication required",
  "error": {
    "code": "TOKEN_EXPIRED",
    "details": "Your session has expired, please log in again",
    "loginUrl": "https://corp-astro.com/login"
  }
}
```

### Authentication Error Codes

| Error Code | Description |
|------------|-------------|
| `UNAUTHORIZED` | Authentication is required |
| `INVALID_TOKEN` | The authentication token is invalid |
| `TOKEN_EXPIRED` | The authentication token has expired |
| `INVALID_CREDENTIALS` | The provided credentials are invalid |
| `ACCOUNT_LOCKED` | The user account is locked |
| `ACCOUNT_DISABLED` | The user account is disabled |

## Mobile-Specific Errors

Mobile-specific errors are related to mobile API features:

```json
{
  "success": false,
  "message": "Device registration failed",
  "error": {
    "code": "DEVICE_ALREADY_REGISTERED",
    "details": "This device is already registered with a different user",
    "deviceId": "device-123456"
  }
}
```

### Mobile Error Codes

| Error Code | Description |
|------------|-------------|
| `DEVICE_NOT_FOUND` | The specified device was not found |
| `DEVICE_ALREADY_REGISTERED` | The device is already registered |
| `INVALID_PUSH_TOKEN` | The push notification token is invalid |
| `SYNC_CONFLICT` | A conflict occurred during data synchronization |
| `BATCH_PROCESSING_ERROR` | An error occurred during batch processing |
| `INVALID_BATCH_FORMAT` | The batch request format is invalid |

## Offline Error Handling

For mobile applications that support offline mode, proper error handling is essential:

### Sync Conflict Errors

```json
{
  "success": false,
  "message": "Sync conflict detected",
  "error": {
    "code": "SYNC_CONFLICT",
    "details": "The resource was modified on the server",
    "conflicts": [
      {
        "id": "conflict1",
        "resourceType": "user_preferences",
        "resourceId": "pref123",
        "clientVersion": 3,
        "serverVersion": 4,
        "clientData": { "theme": "dark" },
        "serverData": { "theme": "light" }
      }
    ]
  }
}
```

### Network Error Handling

When the mobile application is offline, it should:

1. Store failed requests in a local queue
2. Display appropriate offline indicators to the user
3. Retry requests when the connection is restored
4. Implement conflict resolution for offline changes

## Best Practices

### For API Consumers

1. **Always check the `success` field** to determine if the request was successful
2. **Handle specific error codes** programmatically for different scenarios
3. **Display user-friendly error messages** based on the `message` field
4. **Implement retry logic** for transient errors (e.g., network issues, rate limiting)
5. **Log detailed error information** for debugging purposes
6. **Implement proper offline handling** for mobile applications

### Error Handling Example (JavaScript)

```javascript
async function fetchDailyHoroscope() {
  try {
    const response = await fetch('https://api.corp-astro.com/api/content/daily-horoscope', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!data.success) {
      // Handle error based on error code
      switch (data.error.code) {
        case 'SUBSCRIPTION_REQUIRED':
          showSubscriptionUpgradePrompt(data.error.requiredTier);
          break;
        case 'TOKEN_EXPIRED':
          refreshTokenAndRetry(fetchDailyHoroscope);
          break;
        case 'RATE_LIMITED':
          scheduleRetry(fetchDailyHoroscope, data.error.retryAfter);
          break;
        default:
          showErrorMessage(data.message);
      }
      return null;
    }
    
    return data.data;
  } catch (error) {
    // Handle network errors
    if (!navigator.onLine) {
      showOfflineMessage();
      queueRequestForLater(fetchDailyHoroscope);
    } else {
      showErrorMessage('An unexpected error occurred. Please try again later.');
      logError(error);
    }
    return null;
  }
}
```

### Offline Queue Example (JavaScript)

```javascript
class OfflineQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    
    // Listen for online status changes
    window.addEventListener('online', () => this.processQueue());
  }
  
  addToQueue(request) {
    this.queue.push({
      request,
      timestamp: Date.now()
    });
    
    // Save queue to local storage
    this.saveQueue();
  }
  
  async processQueue() {
    if (!navigator.onLine || this.isProcessing) return;
    
    this.isProcessing = true;
    
    while (this.queue.length > 0 && navigator.onLine) {
      const item = this.queue[0];
      
      try {
        await item.request();
        // Request succeeded, remove from queue
        this.queue.shift();
      } catch (error) {
        // If it's not a network error, remove from queue to avoid infinite retries
        if (error.name !== 'NetworkError') {
          this.queue.shift();
        } else {
          // Network error, stop processing
          break;
        }
      }
    }
    
    this.isProcessing = false;
    this.saveQueue();
  }
  
  saveQueue() {
    localStorage.setItem('offlineQueue', JSON.stringify(this.queue));
  }
  
  loadQueue() {
    const savedQueue = localStorage.getItem('offlineQueue');
    if (savedQueue) {
      this.queue = JSON.parse(savedQueue);
    }
  }
}

// Usage
const offlineQueue = new OfflineQueue();
offlineQueue.loadQueue();

function queueRequestForLater(request) {
  offlineQueue.addToQueue(request);
}
```

By following these error handling guidelines, developers can create robust applications that provide a great user experience even when errors occur.
