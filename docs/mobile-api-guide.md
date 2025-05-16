# Corp Astro Mobile API Guide

This guide provides detailed information about the mobile-specific API enhancements in the Corp Astro backend server. These enhancements are designed to optimize the experience for mobile clients by reducing data transfer, improving performance, and providing offline support.

## Table of Contents

1. [Overview](#overview)
2. [Device Detection](#device-detection)
3. [Response Optimization](#response-optimization)
4. [Batch Processing](#batch-processing)
5. [Offline Support](#offline-support)
6. [Push Notifications](#push-notifications)
7. [API Endpoints](#api-endpoints)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)

## Overview

The Corp Astro mobile API provides optimized endpoints and middleware for mobile clients. These optimizations include:

- **Device Detection**: Automatically detects mobile devices and their capabilities
- **Response Optimization**: Reduces response size based on device capabilities
- **Batch Processing**: Allows multiple API requests in a single HTTP request
- **Offline Support**: Provides robust synchronization for offline usage
- **Push Notifications**: Delivers real-time updates to mobile devices

## Device Detection

The device detection middleware automatically identifies mobile devices and extracts information about their capabilities from request headers.

### How It Works

1. The middleware examines the `User-Agent` header to determine if the request is coming from a mobile device
2. Additional headers like `X-Device-Type`, `X-Device-Platform`, and `X-Network-Type` are used to gather more information
3. The extracted information is added to the request object for use by other middleware and controllers

### Custom Headers

Mobile clients should send the following custom headers when possible:

| Header | Description | Example |
|--------|-------------|---------|
| `X-Device-Type` | Type of device | `smartphone`, `tablet` |
| `X-Device-Platform` | Operating system | `ios`, `android` |
| `X-Device-Model` | Device model | `iPhone 14`, `Pixel 7` |
| `X-App-Version` | App version | `1.2.3` |
| `X-Network-Type` | Network connection type | `wifi`, `cellular`, `4g`, `5g` |
| `X-Network-Speed` | Estimated network speed in Mbps | `10.5` |
| `X-Battery-Level` | Battery level percentage | `75` |
| `X-Battery-Charging` | Whether device is charging | `true`, `false` |

### Example

```javascript
// Client-side code to set custom headers
const headers = {
  'X-Device-Type': 'smartphone',
  'X-Device-Platform': 'ios',
  'X-Device-Model': 'iPhone 14 Pro',
  'X-App-Version': '1.2.3',
  'X-Network-Type': 'wifi',
  'X-Network-Speed': '25.5',
  'X-Battery-Level': '80',
  'X-Battery-Charging': 'true'
};

fetch('https://api.corp-astro.com/api/mobile/profile', {
  headers: headers
});
```

## Response Optimization

The response optimization middleware reduces the size of API responses based on device capabilities and network conditions.

### Features

- **Field Filtering**: Includes only requested fields in the response
- **Image Quality Adjustment**: Reduces image quality based on network conditions
- **Content Compression**: Compresses response data for slower connections
- **Payload Size Reduction**: Removes unnecessary metadata for mobile clients

### Field Filtering

Use the `fields` query parameter to specify which fields to include in the response:

```
GET /api/mobile/content/daily_horoscope?fields=title,content,date
```

This will return only the specified fields, reducing the response size.

### Example

```javascript
// Client-side code to request specific fields
fetch('https://api.corp-astro.com/api/mobile/content/daily_horoscope?fields=title,content,date')
  .then(response => response.json())
  .then(data => {
    // data will only contain title, content, and date fields
    console.log(data);
  });
```

## Batch Processing

The batch processing middleware allows mobile clients to send multiple API requests in a single HTTP request, reducing network overhead and battery usage.

### How to Use

Send a POST request to the `/api/mobile/batch` endpoint with an array of request objects:

```json
{
  "requests": [
    {
      "id": "req1",
      "method": "GET",
      "path": "/api/content/daily-horoscope"
    },
    {
      "id": "req2",
      "method": "GET",
      "path": "/api/business/123/insights"
    },
    {
      "id": "req3",
      "method": "POST",
      "path": "/api/user/preferences",
      "body": {
        "theme": "dark",
        "notifications": true
      }
    }
  ]
}
```

### Response Format

The response will contain an array of results in the same order as the requests:

```json
{
  "success": true,
  "data": [
    {
      "id": "req1",
      "status": 200,
      "body": {
        "success": true,
        "data": {
          "title": "Daily Horoscope",
          "content": "Today is a favorable day..."
        }
      }
    },
    {
      "id": "req2",
      "status": 200,
      "body": {
        "success": true,
        "data": {
          "title": "Business Insight",
          "content": "Your business is aligned with..."
        }
      }
    },
    {
      "id": "req3",
      "status": 200,
      "body": {
        "success": true,
        "message": "Preferences updated successfully"
      }
    }
  ]
}
```

## Offline Support

The offline support middleware provides robust synchronization between mobile clients and the server, allowing users to continue using the app even when offline.

### Synchronization Process

1. **Initial Sync**: Client downloads necessary data when online
2. **Offline Changes**: Client stores changes locally while offline
3. **Sync on Reconnect**: Client sends changes to server when back online
4. **Conflict Resolution**: Server detects and resolves conflicts

### API Endpoints

#### Get Changes Since Last Sync

```
GET /api/mobile/sync?lastSync=1620000000000&resources=users,content
```

Headers:
- `device-id`: Unique identifier for the device
- `client-id`: Unique identifier for the client instance

#### Submit Client Changes

```
POST /api/mobile/sync
```

Headers:
- `device-id`: Unique identifier for the device
- `client-id`: Unique identifier for the client instance

Body:
```json
{
  "changes": [
    {
      "id": "op123",
      "type": "update",
      "resource": "user_preferences",
      "resourceId": "pref123",
      "timestamp": 1620000000000,
      "data": {
        "theme": "dark",
        "notifications": true
      },
      "version": 3
    }
  ]
}
```

#### Resolve Conflicts

```
PUT /api/mobile/sync
```

Headers:
- `device-id`: Unique identifier for the device
- `client-id`: Unique identifier for the client instance

Body:
```json
{
  "conflicts": [
    {
      "id": "conflict1",
      "resolution": "client-wins",
      "data": {
        "theme": "dark",
        "notifications": true
      }
    }
  ]
}
```

## Push Notifications

The push notification system allows sending real-time updates to mobile devices.

### Device Registration

Register a device to receive push notifications:

```
POST /api/mobile/device/register
```

Body:
```json
{
  "deviceId": "device-123456",
  "token": "fcm-token-abcdef123456",
  "platform": "fcm"
}
```

### Device Unregistration

Unregister a device to stop receiving push notifications:

```
POST /api/mobile/device/unregister
```

Body:
```json
{
  "deviceId": "device-123456"
}
```

### Notification Types

The Corp Astro backend sends various types of notifications:

- **Content Updates**: New daily horoscopes, monthly reports
- **Subscription Alerts**: Expiration reminders, renewal confirmations
- **Business Insights**: New insights for registered businesses
- **System Notifications**: App updates, maintenance alerts

## API Endpoints

### Device Management

- `POST /api/mobile/device/register` - Register a device for push notifications
- `POST /api/mobile/device/unregister` - Unregister a device
- `POST /api/mobile/device/settings` - Update device settings

### Content Access

- `GET /api/mobile/content/{contentType}` - Get mobile-optimized content by type
- `GET /api/mobile/content/{contentType}/{contentId}` - Get specific content item
- `GET /api/mobile/profile` - Get user profile with mobile-optimized data
- `GET /api/mobile/business/{businessId}` - Get mobile-optimized business data

### Batch Processing

- `POST /api/mobile/batch` - Process multiple API requests in a single batch

### Offline Support

- `GET /api/mobile/sync` - Get changes since last sync
- `POST /api/mobile/sync` - Submit client changes
- `PUT /api/mobile/sync` - Resolve sync conflicts

### Configuration

- `GET /api/mobile/config` - Get mobile-specific configuration

## Error Handling

The mobile API uses a consistent error format:

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

| Code | Description |
|------|-------------|
| `INVALID_INPUT` | Invalid request parameters |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource conflict |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

### Offline Error Handling

When offline, the mobile client should:

1. Store failed requests locally
2. Retry when back online
3. Implement exponential backoff for retries
4. Provide appropriate user feedback

## Best Practices

### Network Efficiency

- Use the batch API for multiple requests
- Request only needed fields with the `fields` parameter
- Implement proper caching on the client side
- Use ETags for conditional requests

### Battery Optimization

- Minimize background sync frequency
- Adjust sync frequency based on battery level
- Use push notifications instead of polling
- Batch network requests

### Data Usage

- Cache responses when appropriate
- Implement delta updates
- Compress request/response data
- Monitor and optimize payload sizes

### Security

- Always use HTTPS
- Store authentication tokens securely
- Implement proper token refresh mechanisms
- Validate all user input

### User Experience

- Provide offline indicators
- Show sync status to users
- Implement graceful degradation when offline
- Handle conflicts with minimal user intervention
