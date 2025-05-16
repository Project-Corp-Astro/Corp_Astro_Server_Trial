// src/types/business.ts

/**
 * Business entity interface
 */
export interface Business {
  id: string;
  name: string;
  industry: string;
  foundingDate: Date;
  foundingTime?: string;
  foundingLocation?: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
  timezone: string;
  description?: string;
  logo?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Business chart interface
 */
export interface BusinessChart {
  id: string;
  businessId: string;
  chartType: BusinessChartType;
  chartData: any;
  interpretation?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Business chart type enum
 */
export enum BusinessChartType {
  NATAL = 'natal',
  TRANSIT = 'transit',
  PROGRESSION = 'progression',
  DASHA = 'dasha',
}

/**
 * Business insight interface
 */
export interface BusinessInsight {
  id: string;
  businessId: string;
  insightType: BusinessInsightType;
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  relevanceScore?: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

/**
 * Business insight type enum
 */
export enum BusinessInsightType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  SPECIAL = 'special',
}

/**
 * Business recommendation interface
 */
export interface BusinessRecommendation {
  id: string;
  businessId: string;
  recommendationType: BusinessRecommendationType;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  implementationSteps?: string[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

/**
 * Business recommendation type enum
 */
export enum BusinessRecommendationType {
  STRATEGIC = 'strategic',
  OPERATIONAL = 'operational',
  FINANCIAL = 'financial',
  MARKETING = 'marketing',
  PERSONNEL = 'personnel',
}

/**
 * Business analysis interface
 */
export interface BusinessAnalysis {
  id: string;
  businessId: string;
  analysisType: BusinessAnalysisType;
  data: any;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Business analysis type enum
 */
export enum BusinessAnalysisType {
  NAME_NUMBER = 'name_number',
  TAGLINE = 'tagline',
  BRAND_COLOR = 'brand_color',
  LOGO = 'logo',
  COMPATIBILITY = 'compatibility',
}
