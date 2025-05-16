import { ABTest, ABTestAssignment } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { trackEvent } from './analyticsService';
import { EventCategory, EventAction } from './eventSchema';

/**
 * Create a new A/B test
 * @param testName Unique name for the test
 * @param variants Array of variant configurations
 * @param description Optional description of the test
 * @param startDate When the test should start (defaults to now)
 * @param endDate When the test should end (optional)
 */
export async function createABTest(
  testName: string,
  variants: Record<string, any>[],
  description?: string,
  startDate: Date = new Date(),
  endDate?: Date
): Promise<string> {
  try {
    // Validate variants
    if (!Array.isArray(variants) || variants.length < 2) {
      throw new Error('A/B test must have at least 2 variants');
    }
    
    // Check if test with this name already exists
    const existingTest = await ABTest.findOne({
      where: { test_name: testName }
    });
    
    if (existingTest) {
      throw new Error(`A/B test with name "${testName}" already exists`);
    }
    
    // Create the test
    const test = await ABTest.create({
      test_name: testName,
      description,
      variants,
      start_date: startDate,
      end_date: endDate,
      is_active: true
    });
    
    return test.test_id;
  } catch (error) {
    console.error('Error creating A/B test:', error);
    throw error;
  }
}

/**
 * Get variant for a user in an A/B test
 * @param testName Name of the test
 * @param userId User ID if available
 * @param sessionId Session ID for anonymous users
 * @param forceVariant Force a specific variant (for testing)
 */
export async function getTestVariant(
  testName: string,
  sessionId: string,
  userId?: string,
  forceVariant?: string
): Promise<Record<string, any> | null> {
  try {
    // Find the test
    const test = await ABTest.findOne({
      where: {
        test_name: testName,
        is_active: true,
        start_date: { [Op.lte]: new Date() },
        [Op.or]: [
          { end_date: null as any }, // Type assertion to fix TypeScript error
          { end_date: { [Op.gt]: new Date() } }
        ]
      }
    });
    
    if (!test) {
      return null; // Test not found or not active
    }
    
    // Check if user/session already has an assignment
    const existingAssignment = await ABTestAssignment.findOne({
      where: {
        test_id: test.test_id,
        ...(userId ? { user_id: userId } : {}),
        session_id: sessionId
      }
    });
    
    if (existingAssignment) {
      // Return the existing variant
      const variantData = test.variants.find(v => v.name === existingAssignment.variant);
      return variantData || null;
    }
    
    // Assign a new variant
    let variantName: string = '';
    
    if (forceVariant) {
      // Use forced variant if specified (useful for testing)
      const variantExists = test.variants.some(v => v.name === forceVariant);
      if (!variantExists) {
        throw new Error(`Variant "${forceVariant}" does not exist in test "${testName}"`);
      }
      variantName = forceVariant;
    } else {
      // Randomly assign a variant based on weights
      const variants = test.variants;
      const totalWeight = variants.reduce((sum, variant) => sum + (variant.weight || 1), 0);
      let random = Math.random() * totalWeight;
      
      for (const variant of variants) {
        const weight = variant.weight || 1;
        if (random < weight) {
          variantName = variant.name;
          break;
        }
        random -= weight;
      }
      
      // Fallback to first variant if something went wrong
      if (!variantName) {
        variantName = variants[0].name;
      }
    }
    
    // Create the assignment
    await ABTestAssignment.create({
      test_id: test.test_id,
      user_id: userId,
      session_id: sessionId,
      variant: variantName,
      assigned_at: new Date()
    });
    
    // Track the assignment event
    await trackEvent(
      'ab_test_assignment',
      EventCategory.INTERACTION, // Using correct category from enum
      EventAction.VIEW, // Using correct action from enum
      {
        test_name: testName,
        variant: variantName
      },
      userId,
      sessionId
    );
    
    // Return the variant data
    const variantData = test.variants.find(v => v.name === variantName);
    return variantData || null;
  } catch (error) {
    console.error('Error getting A/B test variant:', error);
    return null;
  }
}

/**
 * Record a conversion for an A/B test
 * @param testName Name of the test
 * @param userId User ID if available
 * @param sessionId Session ID for anonymous users
 */
export async function recordConversion(
  testName: string,
  sessionId: string,
  userId?: string
): Promise<boolean> {
  try {
    // Find the test
    const test = await ABTest.findOne({
      where: { test_name: testName }
    });
    
    if (!test) {
      return false; // Test not found
    }
    
    // Find the assignment
    const assignment = await ABTestAssignment.findOne({
      where: {
        test_id: test.test_id,
        ...(userId ? { user_id: userId } : {}),
        session_id: sessionId
      }
    });
    
    if (!assignment) {
      return false; // No assignment found
    }
    
    // Update the assignment
    await assignment.update({
      converted: true, // Using correct field name from model
      converted_at: new Date()
    });
    
    // Track the conversion event
    await trackEvent(
      'ab_test_conversion',
      EventCategory.INTERACTION, // Using correct category from enum
      EventAction.SUBMIT,
      {
        test_name: testName,
        variant: assignment.variant
      },
      userId,
      sessionId
    );
    
    return true;
  } catch (error) {
    console.error('Error recording A/B test conversion:', error);
    return false;
  }
}

/**
 * Get A/B test results
 * @param testName Name of the test
 */
export async function getTestResults(testName: string): Promise<Record<string, any>> {
  try {
    // Find the test
    const test = await ABTest.findOne({
      where: { test_name: testName },
      include: [{ association: 'assignments' }]
    });
    
    if (!test) {
      throw new Error(`Test "${testName}" not found`);
    }
    
    // Calculate results per variant
    const results: Record<string, any> = {
      test_name: testName,
      start_date: test.start_date,
      end_date: test.end_date,
      is_active: test.is_active,
      total_participants: 0,
      total_conversions: 0,
      overall_conversion_rate: 0,
      variants: {}
    };
    
    // Group assignments by variant
    const assignments = test.assignments || [];
    results.total_participants = assignments.length;
    
    const variantCounts: Record<string, { participants: number; conversions: number }> = {};
    
    // Initialize variant counts
    test.variants.forEach(variant => {
      variantCounts[variant.name] = { participants: 0, conversions: 0 };
    });
    
    // Count participants and conversions per variant
    assignments.forEach(assignment => {
      // Use type assertion to access the properties
      const assignmentData = assignment as any;
      const variant = assignmentData.variant;
      
      if (!variantCounts[variant]) {
        variantCounts[variant] = { participants: 0, conversions: 0 };
      }
      
      variantCounts[variant].participants++;
      
      if (assignmentData.converted) {
        variantCounts[variant].conversions++;
        results.total_conversions++;
      }
    });
    
    // Calculate conversion rates
    results.overall_conversion_rate = results.total_participants > 0 
      ? (results.total_conversions / results.total_participants) * 100 
      : 0;
    
    // Format variant results
    Object.entries(variantCounts).forEach(([variant, counts]: [string, any]) => {
      const conversionRate = counts.participants > 0 
        ? (counts.conversions / counts.participants) * 100 
        : 0;
      
      results.variants[variant] = {
        participants: counts.participants,
        conversions: counts.conversions,
        conversion_rate: conversionRate
      };
    });
    
    // Calculate statistical significance (simplified Chi-squared test)
    if (Object.keys(results.variants).length >= 2 && results.total_participants >= 100) {
      results.statistical_analysis = calculateStatisticalSignificance(results.variants);
    }
    
    return results;
  } catch (error) {
    console.error('Error getting A/B test results:', error);
    throw error;
  }
}

/**
 * Calculate statistical significance between variants
 * Uses a simplified Chi-squared test
 * @param variants Variant results
 */
function calculateStatisticalSignificance(variants: Record<string, any>): Record<string, any> {
  const variantNames = Object.keys(variants);
  
  // Need at least 2 variants
  if (variantNames.length < 2) {
    return { significant: false, confidence_level: 0, winner: null };
  }
  
  // Find variant with highest conversion rate
  let highestRate = 0;
  let winner: string | null = null;
  
  for (const [name, data] of Object.entries(variants) as [string, any][]) {
    if (data.conversion_rate > highestRate) {
      highestRate = data.conversion_rate;
      winner = name;
    }
  }
  
  // Calculate Chi-squared statistic
  // This is a simplified implementation - for production, use a proper statistics library
  let chiSquared = 0;
  let totalParticipants = 0;
  let totalConversions = 0;
  
  // Get totals
  for (const data of Object.values(variants) as any[]) {
    totalParticipants += data.participants;
    totalConversions += data.conversions;
  }
  
  const expectedConversionRate = totalConversions / totalParticipants;
  
  // Calculate Chi-squared
  for (const data of Object.values(variants)) {
    const expectedConversions = data.participants * expectedConversionRate;
    const expectedNonConversions = data.participants * (1 - expectedConversionRate);
    
    if (expectedConversions > 0 && expectedNonConversions > 0) {
      const convDiff = data.conversions - expectedConversions;
      const nonConvDiff = (data.participants - data.conversions) - expectedNonConversions;
      
      chiSquared += (convDiff * convDiff) / expectedConversions;
      chiSquared += (nonConvDiff * nonConvDiff) / expectedNonConversions;
    }
  }
  
  // Degrees of freedom = number of variants - 1
  const degreesOfFreedom = variantNames.length - 1;
  
  // Simplified p-value calculation
  // This is very approximate - for production, use a proper statistics library
  let confidenceLevel = 0;
  
  if (degreesOfFreedom === 1) {
    if (chiSquared >= 3.84) confidenceLevel = 95;
    if (chiSquared >= 6.63) confidenceLevel = 99;
    if (chiSquared >= 10.83) confidenceLevel = 99.9;
  } else if (degreesOfFreedom === 2) {
    if (chiSquared >= 5.99) confidenceLevel = 95;
    if (chiSquared >= 9.21) confidenceLevel = 99;
    if (chiSquared >= 13.82) confidenceLevel = 99.9;
  } else {
    if (chiSquared >= 7.81) confidenceLevel = 95;
    if (chiSquared >= 11.34) confidenceLevel = 99;
    if (chiSquared >= 16.27) confidenceLevel = 99.9;
  }
  
  return {
    significant: confidenceLevel >= 95,
    confidence_level: confidenceLevel,
    winner,
    chi_squared: chiSquared,
    degrees_of_freedom: degreesOfFreedom
  };
}
