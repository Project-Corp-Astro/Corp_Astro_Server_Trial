import { createABTest, getTestVariant, recordConversion } from '../utils/abTestingService';

/**
 * Example: Setting up an A/B test for the onboarding flow
 * This is a sample implementation that you can use as a reference
 */
async function setupOnboardingABTest() {
  try {
    // Create the A/B test
    const testId = await createABTest(
      'new_onboarding_flow',                // Test name
      [
        {                                   // Variants
          name: 'control',                  // Original version
          weight: 50,                       // 50% of users
          config: {
            steps: ['welcome', 'birth_info', 'interests', 'subscription'],
            showProgressBar: true,
            allowSkip: false
          }
        },
        {
          name: 'simplified',               // New version
          weight: 50,                       // 50% of users
          config: {
            steps: ['welcome', 'birth_info', 'subscription'],
            showProgressBar: true,
            allowSkip: true
          }
        }
      ],
      'Testing a simplified onboarding flow with fewer steps', // Description
      new Date(),                           // Start date (now)
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // End date (30 days)
    );
    
    console.log(`A/B test created with ID: ${testId}`);
    return testId;
  } catch (error) {
    console.error('Error setting up A/B test:', error);
    throw error;
  }
}

/**
 * Example: Getting the variant for a user
 * This would be called when a user starts the onboarding process
 */
async function getOnboardingVariant(userId: string, sessionId: string) {
  try {
    const result = await getTestVariant('new_onboarding_flow', sessionId, userId);
    
    if (!result) {
      // Test not found or not active, use default onboarding
      return {
        steps: ['welcome', 'birth_info', 'interests', 'subscription'],
        showProgressBar: true,
        allowSkip: false
      };
    }
    
    console.log(`User ${userId} assigned to variant: ${result.name}`);
    return result.config;
  } catch (error) {
    console.error('Error getting A/B test variant:', error);
    // Fallback to default onboarding
    return {
      steps: ['welcome', 'birth_info', 'interests', 'subscription'],
      showProgressBar: true,
      allowSkip: false
    };
  }
}

/**
 * Example: Recording a conversion
 * This would be called when a user completes the onboarding process
 */
async function recordOnboardingCompletion(userId: string, sessionId: string) {
  try {
    const success = await recordConversion('new_onboarding_flow', sessionId, userId);
    console.log(`Conversion recorded for user ${userId}: ${success}`);
    return success;
  } catch (error) {
    console.error('Error recording conversion:', error);
    return false;
  }
}

export {
  setupOnboardingABTest,
  getOnboardingVariant,
  recordOnboardingCompletion
};
