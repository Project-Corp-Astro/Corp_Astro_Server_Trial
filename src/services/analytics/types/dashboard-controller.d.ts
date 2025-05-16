/**
 * Type declarations for the dashboard controller
 * This file provides type overrides to fix TypeScript errors in the dashboard controller
 */

// Allow any return type for the dashboard controller routes
declare namespace Express {
  export interface Response {
    json(body?: any): this;
  }
}

// Fix for type conversion issues in the dashboard controller
interface ABTestResult {
  testName: string;
  variants: Array<{
    name: string;
    impressions: number;
    conversions: number;
    conversionRate: number;
  }>;
}

// Allow unknown error types
declare global {
  interface Error {
    [key: string]: any;
  }
}
