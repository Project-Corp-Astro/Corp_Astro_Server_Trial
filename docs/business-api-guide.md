# Corp Astro Business API Guide

This guide provides detailed information about the business-related features in the Corp Astro backend server. The business API allows users to manage business profiles, get astrological insights for businesses, and analyze business compatibility.

## Table of Contents

1. [Overview](#overview)
2. [Business Profiles](#business-profiles)
3. [Business Charts](#business-charts)
4. [Business Insights](#business-insights)
5. [Business Compatibility](#business-compatibility)
6. [Free Business Tools](#free-business-tools)
7. [API Endpoints](#api-endpoints)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)

## Overview

The Corp Astro business API provides endpoints for managing business profiles and getting astrological insights for businesses. Key features include:

- **Business Profile Management**: Create, read, update, and delete business profiles
- **Business Charts**: Calculate and interpret business natal charts
- **Business Insights**: Get astrological insights for businesses
- **Business Compatibility**: Analyze compatibility between businesses
- **Free Business Tools**: Access free tools for business analysis

## Business Profiles

Business profiles contain information about a business, including its founding date, location, and industry. This information is used to calculate the business's natal chart and generate astrological insights.

### Business Profile Structure

```json
{
  "id": "business123",
  "name": "Acme Corporation",
  "foundingDate": "2020-01-15",
  "foundingTime": "10:30:00",
  "location": {
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "industry": "Technology",
  "description": "A technology company specializing in innovative solutions",
  "logo": "https://assets.corp-astro.com/logos/business123.png",
  "website": "https://acmecorp.com",
  "contactEmail": "info@acmecorp.com",
  "ownerId": "user123",
  "createdAt": "2023-01-15T00:00:00.000Z",
  "updatedAt": "2023-01-15T00:00:00.000Z"
}
```

### Business Profile Limits

The number of business profiles a user can create depends on their subscription tier:

- **Free Tier**: 1 business profile
- **Subscription Tier**: 3 business profiles
- **Premium Tier**: 10 business profiles

## Business Charts

Business charts represent the astrological chart of a business based on its founding date, time, and location. The business chart is used to generate insights and recommendations for the business.

### Business Chart Structure

```json
{
  "businessId": "business123",
  "chart": {
    "ascendant": {
      "sign": "Aries",
      "degree": 15.5
    },
    "planets": [
      {
        "name": "Sun",
        "sign": "Capricorn",
        "degree": 25.75,
        "retrograde": false,
        "house": 10
      },
      {
        "name": "Moon",
        "sign": "Gemini",
        "degree": 10.25,
        "retrograde": false,
        "house": 3
      },
      // Other planets...
    ],
    "houses": [
      {
        "number": 1,
        "sign": "Aries",
        "degree": 0
      },
      // Other houses...
    ],
    "aspects": [
      {
        "planet1": "Sun",
        "planet2": "Jupiter",
        "aspect": "trine",
        "orb": 2.5,
        "applying": true
      },
      // Other aspects...
    ]
  },
  "interpretation": {
    "ascendant": "The Aries ascendant gives your business a pioneering and entrepreneurial spirit...",
    "sunSign": "The Sun in Capricorn indicates a steady and reliable approach to business...",
    "moonSign": "The Moon in Gemini brings adaptability and communication skills to your business...",
    // Other interpretations...
  }
}
```

## Business Insights

Business insights provide astrological analysis and recommendations for a business based on its natal chart and current planetary transits. Insights can be generated for different time periods (weekly, monthly, quarterly, yearly).

### Business Insight Structure

```json
{
  "id": "insight123",
  "businessId": "business123",
  "type": "monthly",
  "period": {
    "startDate": "2025-05-01",
    "endDate": "2025-05-31"
  },
  "title": "May 2025 Business Astrological Insight",
  "overview": "The business natal chart shows significant activity in the 10th house of career and public reputation this month. This indicates a period of increased visibility and potential for recognition in your industry.",
  "sections": [
    {
      "title": "Leadership Dynamics",
      "content": "With Mars transiting your 1st house, leadership will be energized and proactive. Team members will respond well to direct communication and clear direction."
    },
    {
      "title": "Financial Trends",
      "content": "Venus in your 2nd house brings favorable financial energy. This is a good time for investments and financial planning."
    },
    {
      "title": "Team Dynamics",
      "content": "Mercury retrograde may cause communication challenges within your team. Be extra clear in your communications and double-check important messages."
    }
  ],
  "recommendations": [
    {
      "category": "Marketing",
      "content": "Launch new marketing initiatives between May 5-15 when Venus aspects your natal Mercury, enhancing communication and creative expression.",
      "priority": "high"
    },
    {
      "category": "Finance",
      "content": "Delay major investments until after May 20 when Mercury goes direct.",
      "priority": "medium"
    },
    {
      "category": "Operations",
      "content": "Review and optimize internal processes during the last week of May when Saturn forms a favorable aspect to your natal Mars.",
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
  ],
  "createdAt": "2025-05-01T00:00:00.000Z"
}
```

### Insight Availability

Business insights are available based on subscription tier:

- **Free Tier**: No business insights
- **Subscription Tier**: Monthly insights only
- **Premium Tier**: Weekly, monthly, quarterly, and yearly insights

## Business Compatibility

Business compatibility analysis compares two business charts to determine their compatibility for partnerships, mergers, acquisitions, or other business relationships.

### Business Compatibility Structure

```json
{
  "business1Id": "business123",
  "business2Id": "business456",
  "overallCompatibility": {
    "score": 85,
    "description": "These businesses show strong compatibility for a partnership."
  },
  "areas": [
    {
      "name": "Communication",
      "score": 90,
      "description": "Strong communication compatibility indicates effective information sharing and collaboration."
    },
    {
      "name": "Values",
      "score": 80,
      "description": "Good alignment of business values and ethics."
    },
    {
      "name": "Goals",
      "score": 85,
      "description": "Similar long-term goals and vision."
    },
    {
      "name": "Operations",
      "score": 75,
      "description": "Generally compatible operational styles with some differences in approach."
    },
    {
      "name": "Leadership",
      "score": 70,
      "description": "Different leadership styles that may require some adjustment."
    }
  ],
  "strengths": [
    "Strong communication and idea sharing",
    "Complementary skills and resources",
    "Aligned long-term vision",
    "Mutual respect and understanding"
  ],
  "challenges": [
    "Different approaches to financial management",
    "Potential power struggles in leadership",
    "Different risk tolerance levels"
  ],
  "recommendations": [
    "Establish clear communication channels and protocols",
    "Define roles and responsibilities clearly",
    "Create a shared decision-making framework",
    "Develop a conflict resolution process"
  ],
  "astrologicalDetails": {
    "keyAspects": [
      {
        "aspect": "Business 1 Sun trine Business 2 Jupiter",
        "interpretation": "This aspect indicates natural harmony and mutual growth potential."
      },
      {
        "aspect": "Business 1 Moon square Business 2 Mars",
        "interpretation": "This aspect may create emotional tension and conflicts in day-to-day operations."
      },
      // Other aspects...
    ]
  }
}
```

### Compatibility Availability

Business compatibility analysis is available based on subscription tier:

- **Free Tier**: No compatibility analysis
- **Subscription Tier**: No compatibility analysis
- **Premium Tier**: Full compatibility analysis

## Free Business Tools

Free business tools provide basic astrological analysis for businesses without requiring a subscription. These tools include:

### Name Number Analysis

Calculates the numerological value of a business name and provides insights based on numerology principles.

```json
{
  "toolName": "name-number",
  "input": "Acme Corporation",
  "result": {
    "numerology": 7,
    "meaning": "The number 7 represents analysis, understanding, and knowledge. Businesses with this number often excel in research, development, and innovation.",
    "recommendations": [
      "Focus on intellectual property and innovation",
      "Invest in research and development",
      "Build a reputation for expertise and knowledge"
    ],
    "strengths": [
      "Analytical thinking",
      "Problem-solving",
      "Technical expertise"
    ],
    "challenges": [
      "Marketing and promotion",
      "Customer engagement",
      "Team building"
    ]
  }
}
```

### Tagline Analysis

Examines a business tagline and provides astrological insights based on the words and phrases used.

```json
{
  "toolName": "tagline-analysis",
  "input": "Innovation for tomorrow",
  "result": {
    "elements": {
      "fire": 60,
      "earth": 20,
      "air": 15,
      "water": 5
    },
    "keywords": [
      "innovation",
      "future",
      "progress",
      "vision"
    ],
    "interpretation": "Your tagline has a strong fire element, indicating passion, creativity, and forward-thinking. It resonates with Aries and Sagittarius energy, suggesting a pioneering and visionary approach to business.",
    "recommendations": [
      "Emphasize your innovative solutions in marketing",
      "Highlight your future-oriented vision",
      "Showcase your creative process"
    ],
    "alignment": "This tagline aligns well with technology, design, and creative industries."
  }
}
```

### Brand Color Analysis

Recommends colors based on a business's founding date and astrological profile.

```json
{
  "toolName": "brand-color",
  "input": "2020-01-15",
  "result": {
    "primaryColors": [
      {
        "color": "Navy Blue",
        "hex": "#003366",
        "planetaryInfluence": "Saturn",
        "meaning": "Authority, stability, trust"
      },
      {
        "color": "Forest Green",
        "hex": "#228B22",
        "planetaryInfluence": "Jupiter",
        "meaning": "Growth, prosperity, abundance"
      }
    ],
    "accentColors": [
      {
        "color": "Gold",
        "hex": "#FFD700",
        "planetaryInfluence": "Sun",
        "meaning": "Success, achievement, prestige"
      },
      {
        "color": "Silver",
        "hex": "#C0C0C0",
        "planetaryInfluence": "Moon",
        "meaning": "Innovation, creativity, intuition"
      }
    ],
    "colorCombinations": [
      {
        "name": "Professional",
        "colors": ["Navy Blue", "Silver", "White"],
        "usage": "Corporate communications, website, business cards"
      },
      {
        "name": "Growth",
        "colors": ["Forest Green", "Gold", "White"],
        "usage": "Marketing materials, product packaging"
      }
    ],
    "recommendations": [
      "Use Navy Blue for your primary brand color to convey stability and trustworthiness",
      "Incorporate Gold accents for important calls-to-action and highlights",
      "Consider using Forest Green for growth-oriented initiatives and products"
    ]
  }
}
```

## API Endpoints

### Business Profile Management

#### Get User's Businesses

```
GET /api/business
```

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "businesses": [
      {
        "id": "business123",
        "name": "Acme Corporation",
        "foundingDate": "2020-01-15",
        "industry": "Technology",
        "location": {
          "city": "New York",
          "state": "NY",
          "country": "USA"
        }
      },
      {
        "id": "business456",
        "name": "Global Innovations",
        "foundingDate": "2018-06-22",
        "industry": "Consulting",
        "location": {
          "city": "San Francisco",
          "state": "CA",
          "country": "USA"
        }
      }
    ],
    "limits": {
      "current": 2,
      "maximum": 3
    }
  }
}
```

#### Create Business

```
POST /api/business
```

**Authentication**: Required

**Request Body**:
```json
{
  "name": "Acme Corporation",
  "foundingDate": "2020-01-15",
  "foundingTime": "10:30:00",
  "location": {
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "industry": "Technology",
  "description": "A technology company specializing in innovative solutions",
  "website": "https://acmecorp.com",
  "contactEmail": "info@acmecorp.com"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "business": {
      "id": "business123",
      "name": "Acme Corporation",
      "foundingDate": "2020-01-15",
      "foundingTime": "10:30:00",
      "location": {
        "city": "New York",
        "state": "NY",
        "country": "USA",
        "latitude": 40.7128,
        "longitude": -74.0060
      },
      "industry": "Technology",
      "description": "A technology company specializing in innovative solutions",
      "website": "https://acmecorp.com",
      "contactEmail": "info@acmecorp.com",
      "ownerId": "user123",
      "createdAt": "2025-05-16T05:28:42+05:30",
      "updatedAt": "2025-05-16T05:28:42+05:30"
    }
  }
}
```

#### Get Business Details

```
GET /api/business/{businessId}
```

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "business": {
      "id": "business123",
      "name": "Acme Corporation",
      "foundingDate": "2020-01-15",
      "foundingTime": "10:30:00",
      "location": {
        "city": "New York",
        "state": "NY",
        "country": "USA",
        "latitude": 40.7128,
        "longitude": -74.0060
      },
      "industry": "Technology",
      "description": "A technology company specializing in innovative solutions",
      "logo": "https://assets.corp-astro.com/logos/business123.png",
      "website": "https://acmecorp.com",
      "contactEmail": "info@acmecorp.com",
      "ownerId": "user123",
      "createdAt": "2023-01-15T00:00:00.000Z",
      "updatedAt": "2023-01-15T00:00:00.000Z"
    }
  }
}
```

#### Update Business

```
PUT /api/business/{businessId}
```

**Authentication**: Required

**Request Body**:
```json
{
  "name": "Acme Corporation International",
  "description": "A global technology company specializing in innovative solutions",
  "website": "https://acmecorp.com",
  "contactEmail": "info@acmecorp.com"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "business": {
      "id": "business123",
      "name": "Acme Corporation International",
      "foundingDate": "2020-01-15",
      "foundingTime": "10:30:00",
      "location": {
        "city": "New York",
        "state": "NY",
        "country": "USA",
        "latitude": 40.7128,
        "longitude": -74.0060
      },
      "industry": "Technology",
      "description": "A global technology company specializing in innovative solutions",
      "logo": "https://assets.corp-astro.com/logos/business123.png",
      "website": "https://acmecorp.com",
      "contactEmail": "info@acmecorp.com",
      "ownerId": "user123",
      "createdAt": "2023-01-15T00:00:00.000Z",
      "updatedAt": "2025-05-16T05:28:42+05:30"
    }
  }
}
```

#### Delete Business

```
DELETE /api/business/{businessId}
```

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "message": "Business deleted successfully"
}
```

### Business Charts

#### Get Business Chart

```
GET /api/business/{businessId}/chart
```

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "businessId": "business123",
    "chart": {
      "ascendant": {
        "sign": "Aries",
        "degree": 15.5
      },
      "planets": [
        {
          "name": "Sun",
          "sign": "Capricorn",
          "degree": 25.75,
          "retrograde": false,
          "house": 10
        },
        // Other planets...
      ],
      "houses": [
        {
          "number": 1,
          "sign": "Aries",
          "degree": 0
        },
        // Other houses...
      ],
      "aspects": [
        {
          "planet1": "Sun",
          "planet2": "Jupiter",
          "aspect": "trine",
          "orb": 2.5,
          "applying": true
        },
        // Other aspects...
      ]
    },
    "interpretation": {
      "ascendant": "The Aries ascendant gives your business a pioneering and entrepreneurial spirit...",
      "sunSign": "The Sun in Capricorn indicates a steady and reliable approach to business...",
      "moonSign": "The Moon in Gemini brings adaptability and communication skills to your business...",
      // Other interpretations...
    }
  }
}
```

### Business Insights

#### Get Business Insights

```
GET /api/business/{businessId}/insights?type=monthly
```

**Authentication**: Required
**Subscription**: Premium tier
**Parameters**:
- `type`: Type of insight (weekly, monthly, quarterly, yearly)

**Response**:
```json
{
  "success": true,
  "data": {
    "insight": {
      "id": "insight123",
      "businessId": "business123",
      "type": "monthly",
      "period": {
        "startDate": "2025-05-01",
        "endDate": "2025-05-31"
      },
      "title": "May 2025 Business Astrological Insight",
      "overview": "The business natal chart shows significant activity in the 10th house...",
      "sections": [
        {
          "title": "Leadership Dynamics",
          "content": "With Mars transiting your 1st house, leadership will be energized..."
        },
        // Other sections...
      ],
      "recommendations": [
        {
          "category": "Marketing",
          "content": "Launch new marketing initiatives between May 5-15...",
          "priority": "high"
        },
        // Other recommendations...
      ],
      "keyDates": [
        {
          "date": "2025-05-12",
          "description": "Ideal for important meetings or presentations",
          "planetaryInfluence": "Sun conjunct Jupiter"
        },
        // Other key dates...
      ]
    }
  }
}
```

### Business Compatibility

#### Get Business Compatibility

```
GET /api/business/{businessId}/compatibility/{business2Id}
```

**Authentication**: Required
**Subscription**: Premium tier

**Response**:
```json
{
  "success": true,
  "data": {
    "compatibility": {
      "business1Id": "business123",
      "business2Id": "business456",
      "overallCompatibility": {
        "score": 85,
        "description": "These businesses show strong compatibility for a partnership."
      },
      "areas": [
        {
          "name": "Communication",
          "score": 90,
          "description": "Strong communication compatibility indicates effective information sharing and collaboration."
        },
        // Other areas...
      ],
      "strengths": [
        "Strong communication and idea sharing",
        "Complementary skills and resources",
        "Aligned long-term vision",
        "Mutual respect and understanding"
      ],
      "challenges": [
        "Different approaches to financial management",
        "Potential power struggles in leadership",
        "Different risk tolerance levels"
      ],
      "recommendations": [
        "Establish clear communication channels and protocols",
        "Define roles and responsibilities clearly",
        "Create a shared decision-making framework",
        "Develop a conflict resolution process"
      ],
      "astrologicalDetails": {
        "keyAspects": [
          {
            "aspect": "Business 1 Sun trine Business 2 Jupiter",
            "interpretation": "This aspect indicates natural harmony and mutual growth potential."
          },
          // Other aspects...
        ]
      }
    }
  }
}
```

### Free Business Tools

#### Name Number Analysis

```
GET /api/business/tools/name-number?input=Acme%20Corporation
```

**Authentication**: Required (any tier)
**Parameters**:
- `input`: Business name

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
      ],
      "strengths": [
        "Analytical thinking",
        "Problem-solving",
        "Technical expertise"
      ],
      "challenges": [
        "Marketing and promotion",
        "Customer engagement",
        "Team building"
      ]
    }
  }
}
```

#### Tagline Analysis

```
GET /api/business/tools/tagline-analysis?input=Innovation%20for%20tomorrow
```

**Authentication**: Required (any tier)
**Parameters**:
- `input`: Business tagline

**Response**:
```json
{
  "success": true,
  "data": {
    "toolName": "tagline-analysis",
    "input": "Innovation for tomorrow",
    "result": {
      "elements": {
        "fire": 60,
        "earth": 20,
        "air": 15,
        "water": 5
      },
      "keywords": [
        "innovation",
        "future",
        "progress",
        "vision"
      ],
      "interpretation": "Your tagline has a strong fire element, indicating passion, creativity, and forward-thinking...",
      "recommendations": [
        "Emphasize your innovative solutions in marketing",
        "Highlight your future-oriented vision",
        "Showcase your creative process"
      ],
      "alignment": "This tagline aligns well with technology, design, and creative industries."
    }
  }
}
```

#### Brand Color Analysis

```
GET /api/business/tools/brand-color?input=2020-01-15
```

**Authentication**: Required (any tier)
**Parameters**:
- `input`: Business founding date (YYYY-MM-DD)

**Response**:
```json
{
  "success": true,
  "data": {
    "toolName": "brand-color",
    "input": "2020-01-15",
    "result": {
      "primaryColors": [
        {
          "color": "Navy Blue",
          "hex": "#003366",
          "planetaryInfluence": "Saturn",
          "meaning": "Authority, stability, trust"
        },
        // Other colors...
      ],
      "accentColors": [
        {
          "color": "Gold",
          "hex": "#FFD700",
          "planetaryInfluence": "Sun",
          "meaning": "Success, achievement, prestige"
        },
        // Other colors...
      ],
      "colorCombinations": [
        {
          "name": "Professional",
          "colors": ["Navy Blue", "Silver", "White"],
          "usage": "Corporate communications, website, business cards"
        },
        // Other combinations...
      ],
      "recommendations": [
        "Use Navy Blue for your primary brand color to convey stability and trustworthiness",
        "Incorporate Gold accents for important calls-to-action and highlights",
        "Consider using Forest Green for growth-oriented initiatives and products"
      ]
    }
  }
}
```

## Error Handling

The business API uses the standard Corp Astro error format:

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
| `BUSINESS_NOT_FOUND` | The specified business was not found |
| `BUSINESS_LIMIT_REACHED` | The user has reached their business profile limit |
| `INVALID_FOUNDING_DATE` | Invalid founding date format or value |
| `INVALID_FOUNDING_TIME` | Invalid founding time format or value |
| `INVALID_LOCATION` | Invalid location information |
| `SUBSCRIPTION_REQUIRED` | The requested feature requires a subscription |
| `PREMIUM_REQUIRED` | The requested feature requires a premium subscription |
| `UNAUTHORIZED` | The user is not authorized to access this business |

### Subscription-Related Errors

When a user attempts to access a feature not available in their subscription tier:

```json
{
  "success": false,
  "message": "This feature requires a premium subscription",
  "error": {
    "code": "PREMIUM_REQUIRED",
    "details": "Business insights are only available with a premium subscription",
    "requiredTier": "premium",
    "currentTier": "subscription",
    "upgradeUrl": "https://corp-astro.com/upgrade"
  }
}
```

## Best Practices

### Business Profile Management

1. **Validate Business Data**: Ensure that business founding dates, times, and locations are accurate before creating a business profile
2. **Complete All Fields**: Provide as much information as possible when creating a business profile to get the most accurate astrological analysis
3. **Manage Business Limits**: Be aware of the business profile limits for each subscription tier and manage accordingly

### Business Insights

1. **Regular Updates**: Check for new business insights regularly, especially at the beginning of each month
2. **Implement Recommendations**: Use the recommendations provided in business insights to inform business decisions
3. **Track Key Dates**: Pay attention to the key dates mentioned in business insights for optimal timing of business activities

### Business Compatibility

1. **Multiple Analyses**: Compare compatibility with multiple potential partners before making decisions
2. **Focus on Strengths and Challenges**: Pay special attention to the strengths and challenges sections of compatibility analyses
3. **Implement Recommendations**: Use the recommendations provided in compatibility analyses to improve business relationships

### Free Tools

1. **Experiment with Variations**: Try different business names, taglines, and founding dates to see how they affect the results
2. **Combine Tools**: Use multiple free tools together for a more comprehensive analysis
3. **Implement Recommendations**: Use the recommendations provided by the free tools to improve your business branding and marketing

### API Integration

1. **Cache Results**: Cache business charts and free tool results to reduce API calls
2. **Handle Subscription Limitations**: Implement proper handling of subscription-related errors
3. **Implement Proper Error Handling**: Handle all potential error scenarios gracefully

By following these guidelines, you can effectively integrate with the Corp Astro business API to provide valuable astrological insights for businesses.
