# Corp Astro Content API Guide

This guide provides detailed information about the content generation and delivery system in the Corp Astro backend server. The content system is responsible for generating personalized astrological content such as daily horoscopes, monthly reports, and business insights based on user data and subscription tier.

## Table of Contents

1. [Overview](#overview)
2. [Content Types](#content-types)
3. [Subscription Tiers](#subscription-tiers)
4. [API Endpoints](#api-endpoints)
5. [Free Tools](#free-tools)
6. [Content Generation](#content-generation)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

## Overview

The Corp Astro content system provides personalized astrological content based on user data, including:

- Daily horoscopes tailored to user's astrological profile
- Monthly reports with business insights
- Business-specific astrological analysis
- Free astrological tools for business analysis

The content is generated using a combination of:

- Astrological calculations from the Astro Engine
- Template-based content generation
- User profile data (birth details, business information)
- Current planetary positions and transits

## Content Types

### Daily Horoscope

Daily horoscopes provide personalized astrological guidance for the day, including:

- Overall daily forecast
- Career and business insights
- Relationship guidance
- Health and well-being recommendations
- Lucky numbers and favorable colors
- Do's and don'ts for the day

### Monthly Report

Monthly reports provide a comprehensive astrological forecast for the month, including:

- Monthly overview
- Financial outlook
- Business opportunities and challenges
- Key dates for important decisions
- Strategic recommendations
- Long-term planning guidance

### Business Insight

Business insights provide astrological analysis for a specific business, including:

- Business natal chart interpretation
- Current planetary influences on the business
- Upcoming favorable and challenging periods
- Strategic recommendations
- Compatibility with potential partners or clients
- Timing recommendations for business decisions

### Free Tools

Free tools provide basic astrological analysis without requiring a subscription:

- **Name Number Analysis**: Numerological analysis of a business name
- **Tagline Analysis**: Astrological interpretation of a business tagline
- **Brand Color Analysis**: Color recommendations based on business founding date

## Subscription Tiers

The Corp Astro content system implements a tiered subscription approach:

### Free Tier

- Access to basic features
- Free tools (name number analysis, tagline analysis, brand color analysis)
- Limited content access
- Ad-supported experience

### Subscription Tier

- Daily horoscopes
- Monthly reports
- Astro Ratan chat access
- Ad-free experience
- Unlimited access to free tools
- Content personalization

### Premium Tier

- All subscription features
- Business insights
- Human astrologer appointments
- Priority support
- Multiple business profiles
- Advanced content personalization
- Downloadable reports

## API Endpoints

### Daily Horoscope

```
GET /api/content/daily-horoscope
```

**Authentication**: Required
**Subscription**: Subscription or Premium tier

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "horoscope123",
    "date": "2025-05-16",
    "title": "Your Daily Business Horoscope",
    "overview": "Today is a favorable day for business decisions...",
    "sections": [
      {
        "title": "Career",
        "content": "Focus on networking today..."
      },
      {
        "title": "Finances",
        "content": "Be cautious with investments today..."
      },
      {
        "title": "Relationships",
        "content": "Business partnerships are highlighted today..."
      }
    ],
    "luckyNumbers": [3, 7, 12, 28],
    "favorableColors": ["blue", "gold"],
    "dosAndDonts": {
      "dos": [
        "Schedule important meetings",
        "Review financial statements",
        "Network with industry peers"
      ],
      "donts": [
        "Make impulsive decisions",
        "Sign contracts without review",
        "Ignore team input"
      ]
    }
  }
}
```

### Monthly Report

```
GET /api/content/monthly-report?month=5&year=2025
```

**Authentication**: Required
**Subscription**: Subscription or Premium tier
**Parameters**:
- `month`: Month number (1-12)
- `year`: Year (4-digit)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "report123",
    "month": 5,
    "year": 2025,
    "title": "May 2025 Business Forecast",
    "overview": "May brings significant opportunities for business growth...",
    "sections": [
      {
        "title": "Financial Outlook",
        "content": "The first half of the month is favorable for investments..."
      },
      {
        "title": "Business Relationships",
        "content": "New partnerships may form during the second week..."
      },
      {
        "title": "Career Development",
        "content": "Focus on professional growth opportunities..."
      }
    ],
    "keyDates": [
      {
        "date": "2025-05-10",
        "description": "Favorable for contract negotiations",
        "planetaryInfluence": "Mercury trine Jupiter"
      },
      {
        "date": "2025-05-18",
        "description": "Challenging day for financial decisions",
        "planetaryInfluence": "Mars square Saturn"
      }
    ],
    "monthlyFocus": [
      "Team building",
      "Market expansion",
      "Product development"
    ]
  }
}
```

### Business Insight

```
GET /api/content/business-insight/business123?type=monthly
```

**Authentication**: Required
**Subscription**: Premium tier
**Parameters**:
- `businessId`: ID of the business
- `type`: Type of insight (weekly, monthly, quarterly, yearly)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "insight123",
    "businessId": "business123",
    "type": "monthly",
    "period": {
      "startDate": "2025-05-01",
      "endDate": "2025-05-31"
    },
    "title": "May 2025 Business Astrological Insight",
    "overview": "The business natal chart shows significant activity...",
    "sections": [
      {
        "title": "Leadership Dynamics",
        "content": "With Mars transiting your 1st house, leadership will be energized..."
      },
      {
        "title": "Financial Trends",
        "content": "Venus in your 2nd house brings favorable financial energy..."
      },
      {
        "title": "Team Dynamics",
        "content": "Mercury retrograde may cause communication challenges..."
      }
    ],
    "recommendations": [
      {
        "category": "Marketing",
        "content": "Launch new marketing initiatives between May 5-15...",
        "priority": "high"
      },
      {
        "category": "Finance",
        "content": "Delay major investments until after May 20...",
        "priority": "medium"
      },
      {
        "category": "Operations",
        "content": "Review and optimize internal processes...",
        "priority": "low"
      }
    ],
    "keyDates": [
      {
        "date": "2025-05-12",
        "description": "Ideal for important meetings or presentations",
        "planetaryInfluence": "Sun conjunct Jupiter"
      },
      {
        "date": "2025-05-25",
        "description": "Potential challenges with business partners",
        "planetaryInfluence": "Mars opposite Saturn"
      }
    ]
  }
}
```

### Free Tools

```
GET /api/content/free-tools/name-number?input=Acme%20Corporation
```

**Authentication**: Required (any tier)
**Parameters**:
- `toolName`: Name of the free tool (name-number, tagline-analysis, brand-color)
- `input`: Input for the tool (e.g., business name, tagline, or color code)

**Response**:
```json
{
  "success": true,
  "data": {
    "toolName": "name-number",
    "input": "Acme Corporation",
    "result": {
      "numerology": 7,
      "meaning": "The number 7 represents analysis, understanding, and knowledge...",
      "recommendations": [
        "Focus on intellectual property and innovation",
        "Invest in research and development",
        "Build a reputation for expertise and knowledge"
      ]
    }
  }
}
```

## Free Tools

### Name Number Analysis

The name number analysis tool calculates the numerological value of a business name and provides insights based on numerology principles.

**How It Works**:

1. Each letter in the name is assigned a number (A=1, B=2, etc.)
2. The numbers are summed to get a total
3. The total is reduced to a single digit (except for master numbers 11, 22, 33)
4. The resulting number is interpreted based on numerological principles

**Example**:

```
GET /api/content/free-tools/name-number?input=Acme%20Corporation
```

### Tagline Analysis

The tagline analysis tool examines a business tagline and provides astrological insights based on the words and phrases used.

**How It Works**:

1. The tagline is analyzed for key words and themes
2. These themes are mapped to astrological principles
3. The analysis provides insights into how the tagline aligns with the business's astrological profile

**Example**:

```
GET /api/content/free-tools/tagline-analysis?input=Innovation%20for%20tomorrow
```

### Brand Color Analysis

The brand color analysis tool recommends colors based on a business's founding date and astrological profile.

**How It Works**:

1. The business's founding date is used to determine its astrological profile
2. Colors associated with favorable planets are recommended
3. The analysis provides insights into how different colors can influence the business's energy

**Example**:

```
GET /api/content/free-tools/brand-color?input=2020-01-15
```

## Content Generation

The Corp Astro content generation system uses a combination of:

### Templates

Content templates provide the structure for different types of content. Templates include:

- Placeholders for personalized data
- Section structures
- Variable content based on astrological factors

### Astrological Calculations

The Astro Engine provides astrological calculations, including:

- Natal chart calculations
- Transit calculations
- Aspect calculations
- Predictive algorithms (Dashas, progressions)

### Personalization

Content is personalized based on:

- User's birth details (date, time, location)
- Business founding details
- Current planetary positions
- Historical data and preferences

### Caching Strategy

To optimize performance, the content system implements a caching strategy:

- Daily horoscopes are cached for 24 hours
- Monthly reports are cached for 7 days
- Business insights are cached for 3 days
- Cache is invalidated when relevant user data changes

## Error Handling

The content API uses a consistent error format:

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
| `FORBIDDEN` | Subscription tier doesn't allow access |
| `NOT_FOUND` | Content not found |
| `INTERNAL_ERROR` | Server error |

### Subscription-Related Errors

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

## Best Practices

### Content Retrieval

- Cache content on the client side when appropriate
- Use conditional requests with ETags
- Request only needed content types
- Implement proper error handling for subscription limitations

### User Experience

- Show appropriate subscription upgrade prompts
- Provide clear explanations of content types
- Implement progressive loading for large content
- Cache content for offline access

### Performance Optimization

- Batch related content requests
- Implement client-side caching
- Use compression for large responses
- Request only needed fields with the `fields` parameter

### Security

- Always use HTTPS
- Validate subscription status server-side
- Implement proper authentication
- Protect sensitive user data
