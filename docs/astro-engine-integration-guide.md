# Corp Astro Engine Integration Guide

This guide provides detailed information about integrating with the Astro Engine, which is the core astrological calculation system used by the Corp Astro backend. The Astro Engine handles all chart calculations, planetary positions, and predictive algorithms using the sidereal zodiac system, whole sign system, and Lahiri ayanamsa.

## Table of Contents

1. [Overview](#overview)
2. [Integration Points](#integration-points)
3. [Chart Calculations](#chart-calculations)
4. [Planetary Positions](#planetary-positions)
5. [Predictive Features](#predictive-features)
6. [API Reference](#api-reference)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

## Overview

The Astro Engine is a separate component that provides astrological calculations and interpretations for the Corp Astro system. It is built on top of the Swiss Ephemeris and implements:

- **Chart Calculations**: Natal charts, transit charts, synastry charts, composite charts, progressed charts
- **Planetary Positions**: Accurate planetary positions with retrograde handling
- **House System**: Whole Sign house system
- **Ayanamsa**: Lahiri ayanamsa (for sidereal zodiac)
- **Aspects**: Calculation of planetary aspects and their interpretations
- **Predictive Features**: Dashas, transits, progressions

The Corp Astro backend integrates with the Astro Engine through a well-defined API, allowing for seamless access to astrological calculations and interpretations.

## Integration Points

The Corp Astro backend integrates with the Astro Engine at several key points:

### Content Generation

When generating personalized content such as daily horoscopes, monthly reports, and business insights, the backend queries the Astro Engine for relevant astrological data.

### Business Analysis

When analyzing a business's astrological profile, the backend uses the Astro Engine to calculate the business's natal chart based on its founding date, time, and location.

### Free Tools

The free astrological tools (name number analysis, tagline analysis, brand color analysis) use the Astro Engine for their calculations and interpretations.

### User Profiles

When a user provides their birth details, the backend uses the Astro Engine to calculate their natal chart, which is then used for personalized content.

## Chart Calculations

The Astro Engine supports various types of chart calculations:

### Natal Charts

Natal charts represent the positions of celestial bodies at the time of birth (for individuals) or founding (for businesses).

**API Endpoint**:
```
GET /api/astrology/chart/natal
```

**Parameters**:
- `date`: Birth/founding date (YYYY-MM-DD)
- `time`: Birth/founding time (HH:MM:SS)
- `latitude`: Birth/founding location latitude
- `longitude`: Birth/founding location longitude
- `timezone`: Timezone offset in hours (e.g., +5.5 for IST)
- `houseSystem`: House system to use (default: "whole-sign")
- `ayanamsa`: Ayanamsa to use (default: "lahiri")

**Response**:
```json
{
  "success": true,
  "data": {
    "chart": {
      "ascendant": {
        "sign": "Aries",
        "degree": 15.5
      },
      "planets": [
        {
          "name": "Sun",
          "sign": "Taurus",
          "degree": 25.75,
          "retrograde": false,
          "house": 2
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
      "ascendant": "The Aries ascendant gives a pioneering and entrepreneurial spirit...",
      "sunSign": "The Sun in Taurus indicates a steady and reliable approach to business...",
      "moonSign": "The Moon in Gemini brings adaptability and communication skills...",
      // Other interpretations...
    }
  }
}
```

### Transit Charts

Transit charts represent the current positions of celestial bodies and their relationships to a natal chart.

**API Endpoint**:
```
GET /api/astrology/chart/transit
```

**Parameters**:
- `natalDate`: Birth/founding date (YYYY-MM-DD)
- `natalTime`: Birth/founding time (HH:MM:SS)
- `natalLatitude`: Birth/founding location latitude
- `natalLongitude`: Birth/founding location longitude
- `natalTimezone`: Timezone offset in hours (e.g., +5.5 for IST)
- `transitDate`: Transit date (YYYY-MM-DD)
- `transitTime`: Transit time (HH:MM:SS)
- `houseSystem`: House system to use (default: "whole-sign")
- `ayanamsa`: Ayanamsa to use (default: "lahiri")

**Response**:
```json
{
  "success": true,
  "data": {
    "natalChart": {
      // Natal chart data...
    },
    "transitChart": {
      // Transit chart data...
    },
    "transitAspects": [
      {
        "transitPlanet": "Jupiter",
        "natalPlanet": "Sun",
        "aspect": "conjunction",
        "orb": 0.5,
        "applying": false
      },
      // Other transit aspects...
    ],
    "interpretation": {
      "overall": "This is a favorable time for business growth and expansion...",
      "transitAspects": [
        {
          "aspect": "Jupiter conjunction Sun",
          "interpretation": "This transit brings opportunities for growth and success..."
        },
        // Other aspect interpretations...
      ]
    }
  }
}
```

### Synastry Charts

Synastry charts compare two natal charts to analyze compatibility.

**API Endpoint**:
```
GET /api/astrology/chart/synastry
```

**Parameters**:
- `chart1Date`, `chart1Time`, `chart1Latitude`, `chart1Longitude`, `chart1Timezone`: Data for first chart
- `chart2Date`, `chart2Time`, `chart2Latitude`, `chart2Longitude`, `chart2Timezone`: Data for second chart
- `houseSystem`: House system to use (default: "whole-sign")
- `ayanamsa`: Ayanamsa to use (default: "lahiri")

**Response**:
```json
{
  "success": true,
  "data": {
    "chart1": {
      // First chart data...
    },
    "chart2": {
      // Second chart data...
    },
    "synastryAspects": [
      {
        "chart1Planet": "Sun",
        "chart2Planet": "Moon",
        "aspect": "trine",
        "orb": 1.2
      },
      // Other synastry aspects...
    ],
    "interpretation": {
      "overall": "This business partnership shows strong compatibility...",
      "synastryAspects": [
        {
          "aspect": "Sun trine Moon",
          "interpretation": "This aspect indicates natural harmony and support..."
        },
        // Other aspect interpretations...
      ],
      "compatibility": {
        "score": 85,
        "strengths": [
          "Communication and idea sharing",
          "Long-term vision alignment",
          "Complementary skills"
        ],
        "challenges": [
          "Different approaches to financial management",
          "Potential power struggles"
        ]
      }
    }
  }
}
```

## Planetary Positions

The Astro Engine provides accurate planetary positions for any given date and time.

**API Endpoint**:
```
GET /api/astrology/planets
```

**Parameters**:
- `date`: Date (YYYY-MM-DD)
- `time`: Time (HH:MM:SS)
- `timezone`: Timezone offset in hours (e.g., +5.5 for IST)
- `ayanamsa`: Ayanamsa to use (default: "lahiri")

**Response**:
```json
{
  "success": true,
  "data": {
    "planets": [
      {
        "name": "Sun",
        "sign": "Taurus",
        "degree": 25.75,
        "longitude": 55.75,
        "latitude": 0.0,
        "speed": 0.9856,
        "retrograde": false
      },
      // Other planets...
    ],
    "date": "2025-05-16",
    "time": "05:22:48",
    "timezone": "+05:30"
  }
}
```

## Predictive Features

The Astro Engine includes several predictive features:

### Dashas (Planetary Periods)

Dashas are planetary periods used in Vedic astrology to predict life events.

**API Endpoint**:
```
GET /api/astrology/dashas
```

**Parameters**:
- `date`: Birth/founding date (YYYY-MM-DD)
- `time`: Birth/founding time (HH:MM:SS)
- `latitude`: Birth/founding location latitude
- `longitude`: Birth/founding location longitude
- `timezone`: Timezone offset in hours (e.g., +5.5 for IST)
- `startDate`: Start date for dasha calculation (YYYY-MM-DD)
- `endDate`: End date for dasha calculation (YYYY-MM-DD)
- `dashaSystem`: Dasha system to use (default: "vimshottari")

**Response**:
```json
{
  "success": true,
  "data": {
    "dashas": [
      {
        "planet": "Venus",
        "startDate": "2023-06-15",
        "endDate": "2043-06-15",
        "subDashas": [
          {
            "planet": "Venus",
            "startDate": "2023-06-15",
            "endDate": "2026-10-15"
          },
          // Other sub-dashas...
        ]
      },
      // Other main dashas...
    ],
    "currentDasha": {
      "mahadashaLord": "Venus",
      "antardashaLord": "Mercury",
      "pratyantardashaLord": "Jupiter"
    },
    "interpretation": {
      "current": "The current Venus-Mercury-Jupiter period is favorable for business expansion...",
      "upcoming": [
        {
          "period": "Venus-Mercury-Saturn",
          "startDate": "2025-07-22",
          "endDate": "2025-12-15",
          "interpretation": "This period may bring challenges in communication and logistics..."
        },
        // Other upcoming periods...
      ]
    }
  }
}
```

### Transits

Transits show the current planetary movements and their effects on a natal chart.

**API Endpoint**:
```
GET /api/astrology/transits
```

**Parameters**:
- `natalDate`: Birth/founding date (YYYY-MM-DD)
- `natalTime`: Birth/founding time (HH:MM:SS)
- `natalLatitude`: Birth/founding location latitude
- `natalLongitude`: Birth/founding location longitude
- `natalTimezone`: Timezone offset in hours (e.g., +5.5 for IST)
- `startDate`: Start date for transit calculation (YYYY-MM-DD)
- `endDate`: End date for transit calculation (YYYY-MM-DD)
- `planets`: Comma-separated list of planets to include (default: all)
- `aspects`: Comma-separated list of aspects to include (default: all)
- `orb`: Maximum orb for aspects (default: 3)

**Response**:
```json
{
  "success": true,
  "data": {
    "transits": [
      {
        "transitPlanet": "Jupiter",
        "natalPlanet": "Sun",
        "aspect": "conjunction",
        "exactDate": "2025-05-20",
        "startDate": "2025-05-10",
        "endDate": "2025-05-30",
        "applying": true
      },
      // Other transits...
    ],
    "interpretation": {
      "highlights": [
        {
          "transit": "Jupiter conjunction Sun",
          "date": "2025-05-20",
          "interpretation": "This transit brings opportunities for growth and recognition..."
        },
        // Other highlights...
      ],
      "keyDates": [
        {
          "date": "2025-05-20",
          "description": "Favorable for important business decisions",
          "transits": ["Jupiter conjunction Sun"]
        },
        // Other key dates...
      ]
    }
  }
}
```

### Progressions

Progressions are a predictive technique that "progresses" the natal chart forward in time.

**API Endpoint**:
```
GET /api/astrology/progressions
```

**Parameters**:
- `natalDate`: Birth/founding date (YYYY-MM-DD)
- `natalTime`: Birth/founding time (HH:MM:SS)
- `natalLatitude`: Birth/founding location latitude
- `natalLongitude`: Birth/founding location longitude
- `natalTimezone`: Timezone offset in hours (e.g., +5.5 for IST)
- `progressedDate`: Date to progress to (YYYY-MM-DD)
- `progressionType`: Type of progression (default: "secondary")
- `houseSystem`: House system to use (default: "whole-sign")
- `ayanamsa`: Ayanamsa to use (default: "lahiri")

**Response**:
```json
{
  "success": true,
  "data": {
    "natalChart": {
      // Natal chart data...
    },
    "progressedChart": {
      // Progressed chart data...
    },
    "progressedAspects": [
      {
        "progressedPlanet": "Sun",
        "natalPlanet": "Jupiter",
        "aspect": "trine",
        "orb": 0.8
      },
      // Other progressed aspects...
    ],
    "interpretation": {
      "overall": "The progressed chart indicates a period of business transformation...",
      "progressedAspects": [
        {
          "aspect": "Progressed Sun trine natal Jupiter",
          "interpretation": "This progression brings opportunities for growth and expansion..."
        },
        // Other aspect interpretations...
      ]
    }
  }
}
```

## API Reference

### Chart Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/astrology/chart/natal` | Calculate a natal chart |
| `/api/astrology/chart/transit` | Calculate a transit chart |
| `/api/astrology/chart/synastry` | Calculate a synastry chart |
| `/api/astrology/chart/composite` | Calculate a composite chart |
| `/api/astrology/chart/progressed` | Calculate a progressed chart |

### Predictive Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/astrology/dashas` | Calculate dashas (planetary periods) |
| `/api/astrology/transits` | Calculate transits |
| `/api/astrology/progressions` | Calculate progressions |
| `/api/astrology/solar-return` | Calculate solar return chart |
| `/api/astrology/lunar-return` | Calculate lunar return chart |

### Utility Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/astrology/planets` | Get planetary positions |
| `/api/astrology/aspects` | Calculate aspects between planets |
| `/api/astrology/ephemeris` | Generate an ephemeris for a date range |
| `/api/astrology/timezone` | Get timezone information for a location |
| `/api/astrology/geocode` | Geocode a location name to coordinates |

## Error Handling

The Astro Engine API uses the standard Corp Astro error format:

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
| `INVALID_DATE` | Invalid date format or value |
| `INVALID_TIME` | Invalid time format or value |
| `INVALID_COORDINATES` | Invalid latitude or longitude |
| `INVALID_TIMEZONE` | Invalid timezone format or value |
| `CALCULATION_ERROR` | Error in astrological calculation |
| `MISSING_PARAMETER` | Required parameter is missing |
| `INVALID_PARAMETER` | Parameter has an invalid value |

## Best Practices

### Caching

To optimize performance, cache astrological calculations when appropriate:

- Natal charts rarely change and can be cached indefinitely
- Transit calculations for specific dates can be cached for a day
- Daily horoscope calculations can be cached for 24 hours

### Batch Processing

For multiple calculations, use batch endpoints to reduce API calls:

```
POST /api/astrology/batch
```

Body:
```json
{
  "requests": [
    {
      "id": "natal",
      "endpoint": "/api/astrology/chart/natal",
      "parameters": {
        "date": "1990-01-15",
        "time": "12:30:00",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "timezone": -5
      }
    },
    {
      "id": "transit",
      "endpoint": "/api/astrology/chart/transit",
      "parameters": {
        "natalDate": "1990-01-15",
        "natalTime": "12:30:00",
        "natalLatitude": 40.7128,
        "natalLongitude": -74.0060,
        "natalTimezone": -5,
        "transitDate": "2025-05-16",
        "transitTime": "05:22:48",
        "transitTimezone": 5.5
      }
    }
  ]
}
```

### Error Handling

Implement proper error handling for astrological calculations:

- Validate input parameters before making API calls
- Handle calculation errors gracefully
- Provide user-friendly error messages
- Implement fallback content when calculations fail

### Performance Optimization

To optimize performance:

- Request only the data you need
- Use appropriate caching strategies
- Batch related requests
- Implement background processing for complex calculations

### Integration Example (JavaScript)

```javascript
async function getBusinessNatalChart(businessId) {
  try {
    // First, get business details
    const businessResponse = await fetch(`https://api.corp-astro.com/api/business/${businessId}`);
    const businessData = await businessResponse.json();
    
    if (!businessData.success) {
      throw new Error(businessData.message);
    }
    
    const { foundingDate, foundingTime, location } = businessData.data;
    
    // Then, calculate natal chart
    const chartResponse = await fetch('https://api.corp-astro.com/api/astrology/chart/natal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        date: foundingDate,
        time: foundingTime,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone
      })
    });
    
    const chartData = await chartResponse.json();
    
    if (!chartData.success) {
      throw new Error(chartData.message);
    }
    
    return chartData.data;
  } catch (error) {
    console.error('Error calculating business natal chart:', error);
    return null;
  }
}
```

By following these guidelines, you can effectively integrate with the Astro Engine to provide accurate astrological calculations and interpretations for your applications.
