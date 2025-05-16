# Corp Astro Authentication and User Management Guide

This guide provides detailed information about the authentication and user management system in the Corp Astro backend. The system handles user registration, authentication, profile management, and access control.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [User Profiles](#user-profiles)
5. [User Preferences](#user-preferences)
6. [API Endpoints](#api-endpoints)
7. [Error Handling](#error-handling)
8. [Security Best Practices](#security-best-practices)

## Overview

The Corp Astro authentication and user management system provides:

- Secure user registration and authentication
- JWT-based token authentication
- User profile management
- User preferences storage
- Role-based access control
- Password management
- Session management

## Authentication

The Corp Astro backend uses JSON Web Tokens (JWT) for authentication. When a user logs in, they receive an access token and a refresh token. The access token is used to authenticate API requests, while the refresh token is used to obtain a new access token when the current one expires.

### Authentication Flow

1. **Registration**: User creates an account with email and password
2. **Login**: User provides credentials and receives tokens
3. **API Requests**: User includes access token in request headers
4. **Token Refresh**: User uses refresh token to get a new access token when needed
5. **Logout**: User invalidates their tokens

### Token Structure

#### Access Token

The access token is a JWT with the following claims:

- `sub`: User ID
- `email`: User email
- `role`: User role
- `tier`: Subscription tier
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp (typically 1 hour from issuance)

#### Refresh Token

The refresh token is a JWT with the following claims:

- `sub`: User ID
- `jti`: Unique token ID (used for revocation)
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp (typically 30 days from issuance)

### Token Usage

To authenticate API requests, include the access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## User Management

The user management system handles user registration, profile updates, and account management.

### User Roles

The system supports the following user roles:

- **User**: Regular user with access to their own data
- **Admin**: Administrator with access to system management features
- **Support**: Support staff with limited administrative access

### User Status

Users can have the following status values:

- **Active**: User account is active and can access the system
- **Inactive**: User account is temporarily disabled
- **Pending**: User account is pending email verification
- **Suspended**: User account is suspended due to policy violations
- **Deleted**: User account has been deleted

## User Profiles

User profiles contain personal information about the user, including:

- Basic information (name, email, phone)
- Birth details (date, time, location)
- Profile picture
- Account settings

### User Profile Structure

```json
{
  "id": "user123",
  "email": "john.doe@example.com",
  "name": {
    "first": "John",
    "last": "Doe"
  },
  "phone": "+1234567890",
  "birthDetails": {
    "date": "1990-01-15",
    "time": "12:30:00",
    "location": {
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  "profilePicture": "https://assets.corp-astro.com/profiles/user123.jpg",
  "accountSettings": {
    "emailNotifications": true,
    "pushNotifications": true,
    "twoFactorEnabled": false,
    "language": "en",
    "timezone": "America/New_York"
  },
  "role": "user",
  "status": "active",
  "subscription": {
    "tier": "subscription",
    "expiresAt": "2025-06-15T00:00:00.000Z"
  },
  "createdAt": "2023-01-15T00:00:00.000Z",
  "updatedAt": "2023-01-15T00:00:00.000Z"
}
```

## User Preferences

User preferences store user-specific settings and preferences, including:

- UI preferences (theme, layout)
- Content preferences (content types, frequency)
- Notification preferences
- Privacy settings

### User Preferences Structure

```json
{
  "userId": "user123",
  "ui": {
    "theme": "dark",
    "layout": "compact",
    "fontSize": "medium",
    "colorScheme": "blue"
  },
  "content": {
    "preferredContentTypes": ["daily_horoscope", "business_insights"],
    "contentFrequency": "daily",
    "contentFormat": "detailed"
  },
  "notifications": {
    "email": {
      "dailyHoroscope": true,
      "monthlyReport": true,
      "businessInsights": true,
      "accountUpdates": true,
      "marketingMessages": false
    },
    "push": {
      "dailyHoroscope": true,
      "monthlyReport": true,
      "businessInsights": true,
      "accountUpdates": true,
      "marketingMessages": false
    },
    "frequency": "daily",
    "quietHours": {
      "enabled": true,
      "start": "22:00",
      "end": "08:00",
      "timezone": "America/New_York"
    }
  },
  "privacy": {
    "shareDataForImprovement": true,
    "shareAnonymousUsageStats": true,
    "allowPersonalization": true
  },
  "createdAt": "2023-01-15T00:00:00.000Z",
  "updatedAt": "2023-01-15T00:00:00.000Z"
}
```

## API Endpoints

### Authentication

#### Register

```
POST /api/auth/register
```

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "name": {
    "first": "John",
    "last": "Doe"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "email": "john.doe@example.com",
      "name": {
        "first": "John",
        "last": "Doe"
      },
      "role": "user",
      "status": "pending",
      "createdAt": "2025-05-16T05:28:42+05:30"
    },
    "message": "Registration successful. Please check your email to verify your account."
  }
}
```

#### Login

```
POST /api/auth/login
```

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "email": "john.doe@example.com",
      "name": {
        "first": "John",
        "last": "Doe"
      },
      "role": "user",
      "subscription": {
        "tier": "subscription",
        "expiresAt": "2025-06-15T00:00:00.000Z"
      }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
  }
}
```

#### Refresh Token

```
POST /api/auth/refresh
```

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
  }
}
```

#### Logout

```
POST /api/auth/logout
```

**Authentication**: Required

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### Verify Email

```
GET /api/auth/verify-email?token=verification_token
```

**Response**:
```json
{
  "success": true,
  "message": "Email verified successfully. You can now log in."
}
```

#### Forgot Password

```
POST /api/auth/forgot-password
```

**Request Body**:
```json
{
  "email": "john.doe@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset instructions sent to your email."
}
```

#### Reset Password

```
POST /api/auth/reset-password
```

**Request Body**:
```json
{
  "token": "reset_token",
  "password": "NewSecurePassword123!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset successful. You can now log in with your new password."
}
```

### User Management

#### Get User Profile

```
GET /api/user/profile
```

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "user123",
      "email": "john.doe@example.com",
      "name": {
        "first": "John",
        "last": "Doe"
      },
      "phone": "+1234567890",
      "birthDetails": {
        "date": "1990-01-15",
        "time": "12:30:00",
        "location": {
          "city": "New York",
          "state": "NY",
          "country": "USA",
          "latitude": 40.7128,
          "longitude": -74.0060
        }
      },
      "profilePicture": "https://assets.corp-astro.com/profiles/user123.jpg",
      "accountSettings": {
        "emailNotifications": true,
        "pushNotifications": true,
        "twoFactorEnabled": false,
        "language": "en",
        "timezone": "America/New_York"
      },
      "subscription": {
        "tier": "subscription",
        "expiresAt": "2025-06-15T00:00:00.000Z"
      }
    }
  }
}
```

#### Update User Profile

```
PUT /api/user/profile
```

**Authentication**: Required

**Request Body**:
```json
{
  "name": {
    "first": "John",
    "last": "Doe"
  },
  "phone": "+1234567890",
  "birthDetails": {
    "date": "1990-01-15",
    "time": "12:30:00",
    "location": {
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  "accountSettings": {
    "emailNotifications": true,
    "pushNotifications": true,
    "language": "en",
    "timezone": "America/New_York"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "user123",
      "email": "john.doe@example.com",
      "name": {
        "first": "John",
        "last": "Doe"
      },
      "phone": "+1234567890",
      "birthDetails": {
        "date": "1990-01-15",
        "time": "12:30:00",
        "location": {
          "city": "New York",
          "state": "NY",
          "country": "USA",
          "latitude": 40.7128,
          "longitude": -74.0060
        }
      },
      "profilePicture": "https://assets.corp-astro.com/profiles/user123.jpg",
      "accountSettings": {
        "emailNotifications": true,
        "pushNotifications": true,
        "twoFactorEnabled": false,
        "language": "en",
        "timezone": "America/New_York"
      },
      "updatedAt": "2025-05-16T05:28:42+05:30"
    }
  }
}
```

#### Upload Profile Picture

```
POST /api/user/profile/picture
```

**Authentication**: Required

**Request**: Multipart form data with `picture` field containing the image file

**Response**:
```json
{
  "success": true,
  "data": {
    "profilePicture": "https://assets.corp-astro.com/profiles/user123.jpg"
  }
}
```

#### Change Password

```
PUT /api/user/password
```

**Authentication**: Required

**Request Body**:
```json
{
  "currentPassword": "SecurePassword123!",
  "newPassword": "EvenMoreSecurePassword456!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Get User Preferences

```
GET /api/user/preferences
```

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "preferences": {
      "ui": {
        "theme": "dark",
        "layout": "compact",
        "fontSize": "medium",
        "colorScheme": "blue"
      },
      "content": {
        "preferredContentTypes": ["daily_horoscope", "business_insights"],
        "contentFrequency": "daily",
        "contentFormat": "detailed"
      },
      "notifications": {
        "email": {
          "dailyHoroscope": true,
          "monthlyReport": true,
          "businessInsights": true,
          "accountUpdates": true,
          "marketingMessages": false
        },
        "push": {
          "dailyHoroscope": true,
          "monthlyReport": true,
          "businessInsights": true,
          "accountUpdates": true,
          "marketingMessages": false
        },
        "frequency": "daily",
        "quietHours": {
          "enabled": true,
          "start": "22:00",
          "end": "08:00",
          "timezone": "America/New_York"
        }
      },
      "privacy": {
        "shareDataForImprovement": true,
        "shareAnonymousUsageStats": true,
        "allowPersonalization": true
      }
    }
  }
}
```

#### Update User Preferences

```
PUT /api/user/preferences
```

**Authentication**: Required

**Request Body**:
```json
{
  "ui": {
    "theme": "light",
    "layout": "standard",
    "fontSize": "large",
    "colorScheme": "green"
  },
  "notifications": {
    "email": {
      "dailyHoroscope": false,
      "monthlyReport": true,
      "businessInsights": true,
      "accountUpdates": true,
      "marketingMessages": false
    },
    "push": {
      "dailyHoroscope": true,
      "monthlyReport": true,
      "businessInsights": true,
      "accountUpdates": true,
      "marketingMessages": false
    },
    "frequency": "weekly"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "preferences": {
      "ui": {
        "theme": "light",
        "layout": "standard",
        "fontSize": "large",
        "colorScheme": "green"
      },
      "content": {
        "preferredContentTypes": ["daily_horoscope", "business_insights"],
        "contentFrequency": "daily",
        "contentFormat": "detailed"
      },
      "notifications": {
        "email": {
          "dailyHoroscope": false,
          "monthlyReport": true,
          "businessInsights": true,
          "accountUpdates": true,
          "marketingMessages": false
        },
        "push": {
          "dailyHoroscope": true,
          "monthlyReport": true,
          "businessInsights": true,
          "accountUpdates": true,
          "marketingMessages": false
        },
        "frequency": "weekly",
        "quietHours": {
          "enabled": true,
          "start": "22:00",
          "end": "08:00",
          "timezone": "America/New_York"
        }
      },
      "privacy": {
        "shareDataForImprovement": true,
        "shareAnonymousUsageStats": true,
        "allowPersonalization": true
      },
      "updatedAt": "2025-05-16T05:28:42+05:30"
    }
  }
}
```

#### Delete Account

```
DELETE /api/user/account
```

**Authentication**: Required

**Request Body**:
```json
{
  "password": "SecurePassword123!",
  "reason": "No longer using the service"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Account scheduled for deletion. You will receive a confirmation email."
}
```

## Error Handling

The authentication and user management API uses the standard Corp Astro error format:

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
| `INVALID_CREDENTIALS` | Invalid email or password |
| `EMAIL_ALREADY_EXISTS` | Email is already registered |
| `EMAIL_NOT_VERIFIED` | Email is not verified |
| `INVALID_TOKEN` | Invalid authentication token |
| `TOKEN_EXPIRED` | Authentication token has expired |
| `PASSWORD_TOO_WEAK` | Password does not meet strength requirements |
| `ACCOUNT_LOCKED` | Account is locked due to too many failed login attempts |
| `ACCOUNT_DISABLED` | Account has been disabled |
| `UNAUTHORIZED` | User is not authorized to perform this action |
| `INVALID_RESET_TOKEN` | Invalid password reset token |
| `RESET_TOKEN_EXPIRED` | Password reset token has expired |

### Authentication Errors

#### Invalid Credentials

```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "The email or password you entered is incorrect"
  }
}
```

#### Token Expired

```json
{
  "success": false,
  "message": "Authentication token expired",
  "error": {
    "code": "TOKEN_EXPIRED",
    "details": "Your session has expired. Please log in again."
  }
}
```

#### Email Already Exists

```json
{
  "success": false,
  "message": "Email already registered",
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "details": "This email address is already registered. Please use a different email or try logging in."
  }
}
```

## Security Best Practices

### Password Management

1. **Strong Passwords**: Require passwords to be at least 8 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters
2. **Password Hashing**: Store passwords using bcrypt with a work factor of at least 10
3. **Password Reset**: Implement a secure password reset flow with time-limited tokens
4. **Account Lockout**: Lock accounts after multiple failed login attempts

### Token Management

1. **Short-Lived Access Tokens**: Set access tokens to expire after a short period (e.g., 1 hour)
2. **Secure Token Storage**: Store refresh tokens securely (e.g., in HTTP-only cookies)
3. **Token Rotation**: Rotate refresh tokens when they are used
4. **Token Revocation**: Implement token revocation for logout and security incidents

### API Security

1. **HTTPS**: Require HTTPS for all API requests
2. **CORS**: Implement proper CORS policies to restrict access to trusted domains
3. **Rate Limiting**: Implement rate limiting to prevent brute force attacks
4. **Input Validation**: Validate all user input to prevent injection attacks
5. **Output Encoding**: Encode all output to prevent XSS attacks

### Two-Factor Authentication

1. **Multiple Methods**: Support multiple 2FA methods (e.g., TOTP, SMS, email)
2. **Recovery Codes**: Provide recovery codes for users who lose access to their 2FA device
3. **Remember Device**: Allow users to trust devices to reduce 2FA friction

### Client-Side Implementation

#### Authentication Flow

```javascript
// Register a new user
async function register(email, password, firstName, lastName) {
  try {
    const response = await fetch('https://api.corp-astro.com/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        name: {
          first: firstName,
          last: lastName
        }
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Login a user
async function login(email, password) {
  try {
    const response = await fetch('https://api.corp-astro.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    // Store tokens
    localStorage.setItem('accessToken', data.data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
    localStorage.setItem('tokenExpiry', Date.now() + (data.data.tokens.expiresIn * 1000));
    
    return data.data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Refresh access token
async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch('https://api.corp-astro.com/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refreshToken
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      // Clear tokens and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiry');
      window.location.href = '/login';
      throw new Error(data.message);
    }
    
    // Update tokens
    localStorage.setItem('accessToken', data.data.tokens.accessToken);
    localStorage.setItem('tokenExpiry', Date.now() + (data.data.tokens.expiresIn * 1000));
    
    return data.data.tokens.accessToken;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
}

// Authenticated API request
async function authenticatedRequest(url, method = 'GET', body = null) {
  try {
    // Check if token needs to be refreshed
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (tokenExpiry && Date.now() > tokenExpiry - 60000) { // Refresh if less than 1 minute left
      await refreshToken();
    }
    
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('No access token available');
    }
    
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Logout
async function logout() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      await fetch('https://api.corp-astro.com/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          refreshToken
        })
      });
    }
    
    // Clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    
    // Redirect to login
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
    
    // Clear tokens even if logout fails
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    
    // Redirect to login
    window.location.href = '/login';
  }
}
```

By following these guidelines, you can implement a secure and robust authentication and user management system for your application.
