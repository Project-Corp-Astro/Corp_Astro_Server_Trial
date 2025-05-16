import { ABTest, ABTestAssignment } from '../models';
import { createABTest, getTestVariant, recordConversion, getTestResults } from './abTestingService';
import { trackEvent } from './analyticsService';
import { EventCategory, EventAction } from './eventSchema';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

/**
 * Astrology-specific A/B testing utilities
 * These functions help create and manage A/B tests for astrology-related features
 */

// Test types specific to astrology application
export enum AstrologyTestType {
  ONBOARDING = 'onboarding',
  CHART_VISUALIZATION = 'chart_visualization',
  SUBSCRIPTION_PAGE = 'subscription_page',
  HOROSCOPE_FORMAT = 'horoscope_format',
  BUSINESS_FORECAST = 'business_forecast',
  ASTRO_RATAN_INTERFACE = 'astro_ratan_interface'
}

// Conversion types for astrology tests
export enum AstrologyConversionType {
  CHART_GENERATED = 'chart_generated',
  SUBSCRIPTION_STARTED = 'subscription_started',
  FEATURE_USED = 'feature_used',
  ASTRO_RATAN_CHAT = 'astro_ratan_chat',
  BUSINESS_DETAILS_ADDED = 'business_details_added',
  ENGAGEMENT = 'engagement',
  CONVERSION = 'conversion',
  SATISFACTION = 'satisfaction'
}

interface AstrologyTestConfig {
  testName: string;
  testType: AstrologyTestType;
  variants: {
    name: string;
    weight: number;
    config: Record<string, any>;
  }[];
  conversionType: AstrologyConversionType;
  description?: string;
  userSegment?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Create an astrology-specific A/B test
 * @param config Test configuration
 */
export async function createAstrologyABTest(config: AstrologyTestConfig): Promise<string | null> {
  try {
    // Format variants for the A/B testing service
    const variants = config.variants.map(variant => ({
      name: variant.name,
      weight: variant.weight,
      config: variant.config
    }));
    
    // Create the test
    const testId = await createABTest(
      config.testName,
      variants,
      config.description || `${config.testType} test`,
      config.startDate || new Date(),
      config.endDate
    );
    
    return testId;
  } catch (error) {
    console.error('Error creating astrology A/B test:', error);
    return null;
  }
}

/**
 * Get the variant for a user in an astrology test
 * @param testName Name of the test
 * @param userId User ID
 * @param sessionId Session ID (for anonymous users)
 */
export async function getAstrologyTestVariant(
  testName: string,
  userId?: string,
  sessionId?: string
): Promise<{
  variantName: string;
  variantConfig: Record<string, any>;
  isNewAssignment: boolean;
} | null> {
  try {
    if (!userId && !sessionId) {
      throw new Error('Either userId or sessionId must be provided');
    }
    
    // Get the variant assignment
    const assignment = await getTestVariant(
      testName,
      sessionId || uuidv4(), // Ensure we always have a session ID
      userId
    );
    
    if (!assignment) {
      return null;
    }
    
    // If we have an assignment, track it
    if (assignment && (userId || sessionId)) {
      await trackEvent(
        'ab_test_assignment',
        EventCategory.INTERACTION,
        EventAction.VIEW,
        {
          test_name: testName,
          variant_name: assignment.name,
          user_id: userId,
          session_id: sessionId
        },
        userId,
        sessionId
      );
    }
    
    return assignment ? {
      variantName: assignment.name,
      variantConfig: assignment,
      isNewAssignment: true
    } : null;
  } catch (error) {
    console.error('Error getting astrology test variant:', error);
    return null;
  }
}

/**
 * Track a conversion for an astrology test
 * @param testName Name of the test
 * @param userId User ID
 * @param sessionId Session ID (for anonymous users)
 * @param conversionValue Optional value associated with the conversion
 */
export async function trackAstrologyTestConversion(
  testName: string,
  userId?: string,
  sessionId?: string,
  conversionValue?: number
): Promise<boolean> {
  try {
    if (!userId && !sessionId) {
      throw new Error('Either userId or sessionId must be provided');
    }
    
    // Record the conversion
    const result = await recordConversion(
      testName,
      sessionId || uuidv4(), // Ensure we always have a session ID
      userId
    );
    
    if (result && (userId || sessionId)) {
      // Track the conversion
      await trackEvent(
        'ab_test_conversion',
        EventCategory.INTERACTION,
        EventAction.SUBMIT,
        {
          test_name: testName,
          conversion_value: conversionValue || 0
        },
        userId,
        sessionId
      );
    }
    
    return !!result;
  } catch (error) {
    console.error('Error tracking astrology test conversion:', error);
    return false;
  }
}

/**
 * Get results for an astrology A/B test
 * @param testName Name of the test
 */
export async function getAstrologyTestResults(testName: string): Promise<Record<string, any> | null> {
  try {
    // Get the test details
    const test = await ABTest.findOne({
      where: { test_name: testName }
    });
    
    if (!test) {
      return null;
    }
    
    // Get all assignments for this test
    const assignments = await ABTestAssignment.findAll({
      where: {
        test_id: test.test_id
      }
    }) as any[];
    
    if (!assignments.length) {
      return {
        test_name: testName,
        status: 'No data available',
        variants: []
      };
    }
    
    // Calculate conversion rates for each variant
    const variantStats: Record<string, any> = {};
    let totalConversions = 0;
    
    assignments.forEach(assignment => {
      const variantName = assignment.variant;
      
      if (!variantStats[variantName]) {
        variantStats[variantName] = {
          impressions: 0,
          conversions: 0,
          conversionRate: 0
        };
      }
      
      variantStats[variantName].impressions++;
      
      if (assignment.converted) {
        variantStats[variantName].conversions++;
        totalConversions++;
        
        if (assignment.conversion_value) {
          if (!variantStats[variantName].totalValue) {
            variantStats[variantName].totalValue = 0;
          }
          variantStats[variantName].totalValue += assignment.conversion_value;
        }
      }
    });
    
    // Calculate conversion rates and average conversion values
    Object.keys(variantStats).forEach(variantName => {
      const stats = variantStats[variantName];
      stats.conversionRate = stats.impressions > 0 ? (stats.conversions / stats.impressions) * 100 : 0;
      if (stats.totalValue && stats.conversions > 0) {
        stats.avgConversionValue = stats.totalValue / stats.conversions;
      }
    });
    
    // Find winner if test has enough data
    let winner: string | null = null;
    let bestConversionRate = 0;
    
    Object.keys(variantStats).forEach(variantName => {
      const stats = variantStats[variantName];
      if (stats.conversions > 0 && stats.conversionRate > bestConversionRate) {
        winner = variantName;
        bestConversionRate = stats.conversionRate;
      }
    });
    
    // Get test configuration
    // Parse variants if needed
    const variants = typeof test.variants === 'string' ? JSON.parse(test.variants) : test.variants;
    // Get test type from first variant if available
    const testConfig = variants && variants.length > 0 ? variants[0].config : {};
    const testType = testConfig?.testType || 'unknown';
    
    return {
      test_name: testName,
      test_type: testType || 'unknown',
      conversion_type: 'unknown',
      start_date: test.created_at,
      status: test.is_active ? 'Active' : 'Inactive',
      total_assignments: assignments.length,
      total_conversions: totalConversions,
      overall_conversion_rate: totalConversions > 0 ? parseFloat(((totalConversions / assignments.length) * 100).toFixed(2)) : 0,
      variants: Object.keys(variantStats).map(variantName => ({
        variant_name: variantName,
        impressions: variantStats[variantName].impressions,
        conversions: variantStats[variantName].conversions,
        conversion_rate: parseFloat(variantStats[variantName].conversionRate.toFixed(2)),
        avg_conversion_value: variantStats[variantName].avgConversionValue ? parseFloat(variantStats[variantName].avgConversionValue.toFixed(2)) : null
      }))
    };
  } catch (error) {
    console.error('Error getting astrology test results:', error);
    return null;
  }
}

/**
 * Create an onboarding flow A/B test
 * @param testName Name of the test
 * @param variants Array of onboarding flow variants
 */
export async function createOnboardingTest(
  testName: string,
  variants: {
    name: string;
    weight: number;
    steps: string[];
    additionalConfig?: Record<string, any>;
  }[]
): Promise<string | null> {
  // Format variants with proper config
  const formattedVariants = variants.map(variant => ({
    name: variant.name,
    weight: variant.weight,
    config: {
      steps: variant.steps,
      ...variant.additionalConfig
    }
  }));
  
  return createAstrologyABTest({
    testName,
    testType: AstrologyTestType.ONBOARDING,
    variants: formattedVariants,
    conversionType: AstrologyConversionType.BUSINESS_DETAILS_ADDED,
    description: 'Test different onboarding flows to optimize user activation'
  });
}

/**
 * Create a chart visualization A/B test
 * @param testName Name of the test
 * @param variants Array of chart visualization variants
 */
export async function createChartVisualizationTest(
  testName: string,
  variants: {
    name: string;
    weight: number;
    style: 'modern' | 'traditional' | 'minimalist' | 'detailed';
    colorScheme: string;
    additionalConfig?: Record<string, any>;
  }[]
): Promise<string | null> {
  // Format variants with proper config
  const formattedVariants = variants.map(variant => ({
    name: variant.name,
    weight: variant.weight,
    config: {
      style: variant.style,
      colorScheme: variant.colorScheme,
      ...variant.additionalConfig
    }
  }));
  
  return createAstrologyABTest({
    testName,
    testType: AstrologyTestType.CHART_VISUALIZATION,
    variants: formattedVariants,
    conversionType: AstrologyConversionType.CHART_GENERATED,
    description: 'Test different chart visualization styles to improve user experience'
  });
}

/**
 * Create a subscription page A/B test
 * @param testName Name of the test
 * @param variants Array of subscription page variants
 */
export async function createSubscriptionPageTest(
  testName: string,
  variants: {
    name: string;
    weight: number;
    layout: 'cards' | 'table' | 'feature-focused' | 'benefit-focused';
    pricingDisplay: 'monthly-first' | 'annual-first' | 'monthly-only' | 'annual-only' | 'toggle';
    additionalConfig?: Record<string, any>;
  }[]
): Promise<string | null> {
  // Format variants with proper config
  const formattedVariants = variants.map(variant => ({
    name: variant.name,
    weight: variant.weight,
    config: {
      layout: variant.layout,
      pricingDisplay: variant.pricingDisplay,
      ...variant.additionalConfig
    }
  }));
  
  return createAstrologyABTest({
    testName,
    testType: AstrologyTestType.SUBSCRIPTION_PAGE,
    variants: formattedVariants,
    conversionType: AstrologyConversionType.SUBSCRIPTION_STARTED,
    description: 'Test different subscription page layouts to optimize conversion'
  });
}

/**
 * Create a horoscope format A/B test
 * @param testName Name of the test
 * @param variants Array of horoscope format variants
 */
export async function createHoroscopeFormatTest(
  testName: string,
  variants: {
    name: string;
    weight: number;
    format: 'concise' | 'detailed' | 'actionable' | 'narrative';
    sections: string[];
    additionalConfig?: Record<string, any>;
  }[]
): Promise<string | null> {
  // Format variants with proper config
  const formattedVariants = variants.map(variant => ({
    name: variant.name,
    weight: variant.weight,
    config: {
      format: variant.format,
      sections: variant.sections,
      ...variant.additionalConfig
    }
  }));
  
  return createAstrologyABTest({
    testName,
    testType: AstrologyTestType.HOROSCOPE_FORMAT,
    variants: formattedVariants,
    conversionType: AstrologyConversionType.FEATURE_USED,
    description: 'Test different horoscope formats to improve engagement and retention'
  });
}

/**
 * Create a business forecast A/B test
 * @param testName Name of the test
 * @param variants Array of business forecast variants
 */
export async function createBusinessForecastTest(
  testName: string,
  variants: {
    name: string;
    weight: number;
    format: 'executive-summary' | 'detailed-analysis' | 'visual-timeline' | 'action-items';
    timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    additionalConfig?: Record<string, any>;
  }[]
): Promise<string | null> {
  // Format variants with proper config
  const formattedVariants = variants.map(variant => ({
    name: variant.name,
    weight: variant.weight,
    config: {
      format: variant.format,
      timeframe: variant.timeframe,
      ...variant.additionalConfig
    }
  }));
  
  return createAstrologyABTest({
    testName,
    testType: AstrologyTestType.BUSINESS_FORECAST,
    variants: formattedVariants,
    conversionType: AstrologyConversionType.FEATURE_USED,
    description: 'Test different business forecast formats to improve business user engagement'
  });
}

/**
 * Create an Astro Ratan interface A/B test
 * @param testName Name of the test
 * @param variants Array of Astro Ratan interface variants
 */
export async function createAstroRatanInterfaceTest(
  testName: string,
  variants: {
    name: string;
    weight: number;
    interfaceType: 'chat' | 'guided' | 'hybrid';
    personalityStyle: 'formal' | 'friendly' | 'mystical' | 'analytical';
    additionalConfig?: Record<string, any>;
  }[]
): Promise<string | null> {
  // Format variants with proper config
  const formattedVariants = variants.map(variant => ({
    name: variant.name,
    weight: variant.weight,
    config: {
      interfaceType: variant.interfaceType,
      personalityStyle: variant.personalityStyle,
      ...variant.additionalConfig
    }
  }));
  
  return createAstrologyABTest({
    testName,
    testType: AstrologyTestType.ASTRO_RATAN_INTERFACE,
    variants: formattedVariants,
    conversionType: AstrologyConversionType.ASTRO_RATAN_CHAT,
    description: 'Test different Astro Ratan AI interface styles to optimize user engagement'
  });
}
