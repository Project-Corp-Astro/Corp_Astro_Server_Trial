// src/config/constants.ts

/**
 * Constants for the application
 */

/**
 * Astro Engine URL
 */
export const ASTRO_ENGINE_URL = process.env.ASTRO_ENGINE_URL || 'http://localhost:4000';
export const AstroEngine = {
  BASE_URL: process.env.ASTRO_ENGINE_URL || 'http://localhost:4000',
  API_KEY: process.env.ASTRO_ENGINE_API_KEY || 'default_api_key',
  ENDPOINTS: {
    NATAL_CHART: '/api/chart/natal',
    TRANSIT_CHART: '/api/chart/transit',
    SYNASTRY_CHART: '/api/chart/synastry',
    COMPOSITE_CHART: '/api/chart/composite',
    PROGRESSED_CHART: '/api/chart/progressed',
    DASHA: '/api/predictions/dasha',
    TRANSITS: '/api/predictions/transits',
  }
};

/**
 * Subscription tiers
 */
export const SubscriptionTiers = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium'
};

/**
 * Content types
 */
export const ContentTypes = {
  DAILY_HOROSCOPE: 'daily_horoscope',
  MONTHLY_REPORT: 'monthly_report',
  BUSINESS_INSIGHT: 'business_insight',
  COMPATIBILITY: 'compatibility'
};

/**
 * Zodiac signs
 */
export const ZodiacSigns = {
  ARIES: 'aries',
  TAURUS: 'taurus',
  GEMINI: 'gemini',
  CANCER: 'cancer',
  LEO: 'leo',
  VIRGO: 'virgo',
  LIBRA: 'libra',
  SCORPIO: 'scorpio',
  SAGITTARIUS: 'sagittarius',
  CAPRICORN: 'capricorn',
  AQUARIUS: 'aquarius',
  PISCES: 'pisces'
};

/**
 * Planets
 */
export const Planets = {
  SUN: 'sun',
  MOON: 'moon',
  MERCURY: 'mercury',
  VENUS: 'venus',
  MARS: 'mars',
  JUPITER: 'jupiter',
  SATURN: 'saturn',
  URANUS: 'uranus',
  NEPTUNE: 'neptune',
  PLUTO: 'pluto',
  RAHU: 'rahu',
  KETU: 'ketu'
};

/**
 * Houses
 */
export const Houses = {
  FIRST: '1',
  SECOND: '2',
  THIRD: '3',
  FOURTH: '4',
  FIFTH: '5',
  SIXTH: '6',
  SEVENTH: '7',
  EIGHTH: '8',
  NINTH: '9',
  TENTH: '10',
  ELEVENTH: '11',
  TWELFTH: '12'
};

/**
 * Aspects
 */
export const Aspects = {
  CONJUNCTION: 'conjunction',
  OPPOSITION: 'opposition',
  TRINE: 'trine',
  SQUARE: 'square',
  SEXTILE: 'sextile'
};
