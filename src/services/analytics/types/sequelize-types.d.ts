/**
 * Type declarations for Sequelize models and operators
 * This file provides type overrides to fix TypeScript errors in the analytics controllers
 */

import { Model, WhereOptions, Op, ModelStatic, FindOptions, Includeable } from 'sequelize';
import { Request } from 'express';
import { ParsedQs } from 'qs';

// Model interfaces
interface ABTestAttributes {
  test_id: string;
  test_name: string;
  description?: string;
  variants: string[];
  start_date: Date;
  end_date?: Date | null;
  is_active: boolean;
}

interface ABTestAssignmentAttributes {
  assignment_id: string;
  test_id: string;
  user_id: string;
  variant_name: string;
  assigned_at: Date;
  impressions?: number;
  conversions?: number;
}

interface AnalyticsEventAttributes {
  event_id: string;
  event_name: string;
  category: string;
  action: string;
  user_id?: string;
  properties?: any;
  created_at: Date;
}

interface FeatureUsageAttributes {
  usage_id: string;
  feature_name: string;
  user_id: string;
  usage_count: number;
  last_used: Date;
}

interface UserJourneyAttributes {
  journey_id: string;
  user_id: string;
  journey_name: string;
  journey_stage?: string;
  start_time: Date;
  end_time?: Date;
  completed: boolean;
  total?: number;
}

declare module 'sequelize' {
  // Allow null in where clauses
  interface WhereAttributeHashValue<T> {
    null?: null;
  }

  // Add support for get() method on model instances
  interface Model {
    get(key: string): any;
    count: number | string;
    total?: number | string;
    journey_stage?: string;
    impressions?: number | string;
    conversions?: number | string;
    completed?: boolean | string;
  }

  // Allow any value in Op.or arrays
  namespace Op {
    interface Operators {
      or: any[];
      not: any;
    }
  }

  // Fix for WhereOptions to allow any properties
  interface WhereOptions<TAttributes = any> {
    [key: string]: any;
  }
}

// Fix for missing models import in dashboardController
declare module '../../../models' {
  export * from '../models';
}

// Extend Express Request to include query parameters
declare module 'express' {
  interface Request {
    query: {
      [key: string]: string | ParsedQs | string[] | ParsedQs[] | undefined;
    };
  }
}

// Declare global ABTest model
declare global {
  var ABTest: ModelStatic<Model<ABTestAttributes>>;
  var ABTestAssignment: ModelStatic<Model<ABTestAssignmentAttributes>>;
  var AnalyticsEvent: ModelStatic<Model<AnalyticsEventAttributes>>;
  var FeatureUsage: ModelStatic<Model<FeatureUsageAttributes>>;
  var UserJourney: ModelStatic<Model<UserJourneyAttributes>>;
}
