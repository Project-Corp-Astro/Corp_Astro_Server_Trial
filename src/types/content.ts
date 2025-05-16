// src/types/content.ts

/**
 * Content item interface
 */
export interface ContentItem {
  id: string;
  contentType: ContentType;
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  author?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

/**
 * Content type enum
 */
export enum ContentType {
  DAILY_HOROSCOPE = 'daily_horoscope',
  WEEKLY_HOROSCOPE = 'weekly_horoscope',
  MONTHLY_HOROSCOPE = 'monthly_horoscope',
  YEARLY_HOROSCOPE = 'yearly_horoscope',
  BUSINESS_INSIGHT = 'business_insight',
  ARTICLE = 'article',
  BLOG_POST = 'blog_post',
  TUTORIAL = 'tutorial',
  FAQ = 'faq',
}

/**
 * Content filter options
 */
export interface ContentFilterOptions {
  contentType?: ContentType;
  tags?: string[];
  author?: string;
  fromDate?: Date;
  toDate?: Date;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'publishedAt' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Horoscope content interface
 */
export interface HoroscopeContent extends ContentItem {
  zodiacSign: ZodiacSign;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  aspects: AspectData[];
  luckRating?: number;
  loveRating?: number;
  careerRating?: number;
  healthRating?: number;
  luckyNumbers?: number[];
  luckyColors?: string[];
}

/**
 * Zodiac sign enum
 */
export enum ZodiacSign {
  ARIES = 'aries',
  TAURUS = 'taurus',
  GEMINI = 'gemini',
  CANCER = 'cancer',
  LEO = 'leo',
  VIRGO = 'virgo',
  LIBRA = 'libra',
  SCORPIO = 'scorpio',
  SAGITTARIUS = 'sagittarius',
  CAPRICORN = 'capricorn',
  AQUARIUS = 'aquarius',
  PISCES = 'pisces',
}

/**
 * Aspect data interface
 */
export interface AspectData {
  planet1: Planet;
  planet2: Planet;
  aspectType: AspectType;
  orb: number;
  influence: 'positive' | 'negative' | 'neutral';
  description?: string;
}

/**
 * Planet enum
 */
export enum Planet {
  SUN = 'sun',
  MOON = 'moon',
  MERCURY = 'mercury',
  VENUS = 'venus',
  MARS = 'mars',
  JUPITER = 'jupiter',
  SATURN = 'saturn',
  URANUS = 'uranus',
  NEPTUNE = 'neptune',
  PLUTO = 'pluto',
  RAHU = 'rahu',
  KETU = 'ketu',
}

/**
 * Aspect type enum
 */
export enum AspectType {
  CONJUNCTION = 'conjunction',
  OPPOSITION = 'opposition',
  TRINE = 'trine',
  SQUARE = 'square',
  SEXTILE = 'sextile',
  QUINCUNX = 'quincunx',
  SEMISEXTILE = 'semisextile',
}

/**
 * Content generation request
 */
export interface ContentGenerationRequest {
  contentType: ContentType;
  parameters: Record<string, any>;
  userId?: string;
  businessId?: string;
  targetDate?: Date;
}

/**
 * Content generation response
 */
export interface ContentGenerationResponse {
  success: boolean;
  contentItem?: ContentItem;
  error?: string;
  processingTime?: number;
}
