import React, { useState, useEffect } from 'react';

// Mock implementation of useRouter for example purposes
const useRouter = () => {
  return {
    push: (path: string) => console.log(`Navigation to: ${path}`),
    query: {}
  };
};
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  createOnboardingTest, 
  getAstrologyTestVariant, 
  trackAstrologyTestConversion 
} from '../utils/astrologyABTests';
import { trackEvent } from '../utils/analyticsService';
import { EventCategory, EventAction } from '../utils/eventSchema';

/**
 * Example implementation of an A/B test for the Corp Astro onboarding flow
 * 
 * This component demonstrates how to:
 * 1. Create an A/B test for different onboarding flows
 * 2. Assign users to test variants
 * 3. Track user progress through the onboarding flow
 * 4. Record conversions when users complete the flow
 */

// Define the test name
const TEST_NAME = 'business_onboarding_flow_v1';

// Define the test variants
const TEST_VARIANTS = [
  {
    name: 'control',
    weight: 50,
    steps: ['business_details', 'founder_details', 'business_goals', 'chart_preferences'],
    additionalConfig: {
      description: 'Original 4-step onboarding flow',
      showProgressBar: true
    }
  },
  {
    name: 'simplified',
    weight: 50,
    steps: ['combined_business_founder', 'business_goals'],
    additionalConfig: {
      description: 'Simplified 2-step onboarding flow',
      showProgressBar: true
    }
  }
];

// Create the A/B test (in a real implementation, this would be done in an admin interface)
const createTest = async () => {
  try {
    const testId = await createOnboardingTest(TEST_NAME, TEST_VARIANTS);
    console.log(`Created onboarding test with ID: ${testId}`);
    return testId;
  } catch (error) {
    console.error('Error creating onboarding test:', error);
    return null;
  }
};

// Component for the onboarding flow
const OnboardingFlow: React.FC = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [variant, setVariant] = useState<{
    variantName: string;
    variantConfig: Record<string, any>;
    steps: string[];
  } | null>(null);
  
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [foundingDate, setFoundingDate] = useState<Date | null>(null);
  const [founderName, setFounderName] = useState('');
  const [founderBirthDate, setFounderBirthDate] = useState<Date | null>(null);
  const [businessGoals, setBusinessGoals] = useState<string[]>([]);
  const [chartPreferences, setChartPreferences] = useState<string[]>([]);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Get the variant for the current user
  useEffect(() => {
    const getUserVariant = async () => {
      try {
        setLoading(true);
        
        // Get user ID from your auth system
        const userId = localStorage.getItem('user_id') || sessionStorage.getItem('session_id');
        const sessionId = sessionStorage.getItem('session_id');
        
        if (!userId && !sessionId) {
          // Handle anonymous users
          sessionStorage.setItem('session_id', `anon_${Math.random().toString(36).substring(2, 15)}`);
        }
        
        // Get the variant assignment
        const testResult = await getAstrologyTestVariant(
          TEST_NAME,
          userId as string,
          sessionId as string
        );
        
        if (!testResult) {
          // Fallback to control variant if test doesn't exist or fails
          setVariant({
            variantName: 'control',
            variantConfig: TEST_VARIANTS[0].additionalConfig,
            steps: TEST_VARIANTS[0].steps
          });
        } else {
          // Set the assigned variant
          setVariant({
            variantName: testResult.variantName,
            variantConfig: testResult.variantConfig,
            steps: testResult.variantConfig.steps
          });
          
          // Track that the user started the onboarding flow
          trackEvent(
            'onboarding_started',
            EventCategory.USER_JOURNEY,
            EventAction.START,
            {
              variant: testResult.variantName,
              test_name: TEST_NAME
            },
            userId as string
          );
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error getting test variant:', error);
        
        // Fallback to control variant
        setVariant({
          variantName: 'control',
          variantConfig: TEST_VARIANTS[0].additionalConfig,
          steps: TEST_VARIANTS[0].steps
        });
        
        setLoading(false);
      }
    };
    
    getUserVariant();
  }, []);
  
  // Handle next step
  const handleNext = () => {
    // Validate current step
    if (!validateStep()) {
      return;
    }
    
    // Track step completion
    const userId = localStorage.getItem('user_id') || sessionStorage.getItem('session_id');
    trackEvent(
      'onboarding_step_completed',
      EventCategory.USER_JOURNEY,
      EventAction.PROGRESS,
      {
        variant: variant?.variantName,
        test_name: TEST_NAME,
        step: variant?.steps[activeStep],
        step_index: activeStep
      },
      userId as string
    );
    
    // Move to next step
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  // Handle back
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate final step
    if (!validateStep()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Get user ID from your auth system
      const userId = localStorage.getItem('user_id') || sessionStorage.getItem('session_id');
      const sessionId = sessionStorage.getItem('session_id');
      
      // Save business details to your backend
      await saveBusinessDetails();
      
      // Track conversion
      await trackAstrologyTestConversion(
        TEST_NAME,
        userId as string,
        sessionId as string
      );
      
      // Track onboarding completion
      trackEvent(
        'onboarding_completed',
        EventCategory.USER_JOURNEY,
        EventAction.COMPLETE,
        {
          variant: variant?.variantName,
          test_name: TEST_NAME,
          steps_count: variant?.steps.length
        },
        userId as string
      );
      
      setLoading(false);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setLoading(false);
    }
  };
  
  // Validate current step
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (variant?.variantName === 'control') {
      // Validate control variant steps
      if (activeStep === 0) {
        // Business details step
        if (!businessName) newErrors.businessName = 'Business name is required';
        if (!businessType) newErrors.businessType = 'Business type is required';
        if (!foundingDate) newErrors.foundingDate = 'Founding date is required';
      } else if (activeStep === 1) {
        // Founder details step
        if (!founderName) newErrors.founderName = 'Founder name is required';
        if (!founderBirthDate) newErrors.founderBirthDate = 'Founder birth date is required';
      } else if (activeStep === 2) {
        // Business goals step
        if (businessGoals.length === 0) newErrors.businessGoals = 'Select at least one business goal';
      } else if (activeStep === 3) {
        // Chart preferences step
        if (chartPreferences.length === 0) newErrors.chartPreferences = 'Select at least one chart preference';
      }
    } else if (variant?.variantName === 'simplified') {
      // Validate simplified variant steps
      if (activeStep === 0) {
        // Combined business and founder details step
        if (!businessName) newErrors.businessName = 'Business name is required';
        if (!businessType) newErrors.businessType = 'Business type is required';
        if (!founderName) newErrors.founderName = 'Founder name is required';
      } else if (activeStep === 1) {
        // Business goals step
        if (businessGoals.length === 0) newErrors.businessGoals = 'Select at least one business goal';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Save business details to your backend
  const saveBusinessDetails = async () => {
    // In a real implementation, this would call your API
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Saved business details:', {
          businessName,
          businessType,
          foundingDate,
          founderName,
          founderBirthDate,
          businessGoals,
          chartPreferences
        });
        resolve(true);
      }, 1000);
    });
  };
  
  // Render loading state
  if (loading || !variant) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  // Determine if we're on the last step
  const isLastStep = activeStep === variant.steps.length - 1;
  
  // Render step content based on variant and active step
  const getStepContent = () => {
    if (variant.variantName === 'control') {
      // Control variant steps
      switch (variant.steps[activeStep]) {
        case 'business_details':
          return (
            <Box>
              <Typography variant="h6" gutterBottom>
                Business Details
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                error={!!errors.businessName}
                helperText={errors.businessName}
              />
              <FormControl fullWidth margin="normal" error={!!errors.businessType}>
                <InputLabel>Business Type</InputLabel>
                <Select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  label="Business Type"
                >
                  <MenuItem value="startup">Startup</MenuItem>
                  <MenuItem value="small_business">Small Business</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                  <MenuItem value="freelance">Freelance/Solo</MenuItem>
                  <MenuItem value="non_profit">Non-Profit</MenuItem>
                </Select>
                {errors.businessType && <FormHelperText>{errors.businessType}</FormHelperText>}
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Founding Date"
                  value={foundingDate}
                  onChange={(date) => setFoundingDate(date)}
                />
              </LocalizationProvider>
              {errors.foundingDate && (
                <FormHelperText error>{errors.foundingDate}</FormHelperText>
              )}
            </Box>
          );
        case 'founder_details':
          return (
            <Box>
              <Typography variant="h6" gutterBottom>
                Founder Details
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Founder Name"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                error={!!errors.founderName}
                helperText={errors.founderName}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Founder Birth Date"
                  value={founderBirthDate}
                  onChange={(date) => setFounderBirthDate(date)}
                />
              </LocalizationProvider>
              {errors.founderBirthDate && (
                <FormHelperText error>{errors.founderBirthDate}</FormHelperText>
              )}
            </Box>
          );
        case 'business_goals':
          return (
            <Box>
              <Typography variant="h6" gutterBottom>
                Business Goals
              </Typography>
              <FormControl fullWidth margin="normal" error={!!errors.businessGoals}>
                <InputLabel>Business Goals</InputLabel>
                <Select
                  multiple
                  value={businessGoals}
                  onChange={(e) => setBusinessGoals(e.target.value as string[])}
                  label="Business Goals"
                >
                  <MenuItem value="growth">Growth & Expansion</MenuItem>
                  <MenuItem value="funding">Securing Funding</MenuItem>
                  <MenuItem value="team">Team Building</MenuItem>
                  <MenuItem value="product">Product Development</MenuItem>
                  <MenuItem value="market">Market Positioning</MenuItem>
                  <MenuItem value="strategy">Strategic Planning</MenuItem>
                </Select>
                {errors.businessGoals && <FormHelperText>{errors.businessGoals}</FormHelperText>}
              </FormControl>
            </Box>
          );
        case 'chart_preferences':
          return (
            <Box>
              <Typography variant="h6" gutterBottom>
                Chart Preferences
              </Typography>
              <FormControl fullWidth margin="normal" error={!!errors.chartPreferences}>
                <InputLabel>Chart Types</InputLabel>
                <Select
                  multiple
                  value={chartPreferences}
                  onChange={(e) => setChartPreferences(e.target.value as string[])}
                  label="Chart Types"
                >
                  <MenuItem value="business_natal">Business Natal Chart</MenuItem>
                  <MenuItem value="founder_synastry">Founder Synastry</MenuItem>
                  <MenuItem value="team_compatibility">Team Compatibility</MenuItem>
                  <MenuItem value="financial_transits">Financial Transits</MenuItem>
                  <MenuItem value="strategic_progressions">Strategic Progressions</MenuItem>
                </Select>
                {errors.chartPreferences && <FormHelperText>{errors.chartPreferences}</FormHelperText>}
              </FormControl>
            </Box>
          );
        default:
          return null;
      }
    } else if (variant.variantName === 'simplified') {
      // Simplified variant steps
      switch (variant.steps[activeStep]) {
        case 'combined_business_founder':
          return (
            <Box>
              <Typography variant="h6" gutterBottom>
                Business & Founder Information
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                error={!!errors.businessName}
                helperText={errors.businessName}
              />
              <FormControl fullWidth margin="normal" error={!!errors.businessType}>
                <InputLabel>Business Type</InputLabel>
                <Select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  label="Business Type"
                >
                  <MenuItem value="startup">Startup</MenuItem>
                  <MenuItem value="small_business">Small Business</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                  <MenuItem value="freelance">Freelance/Solo</MenuItem>
                  <MenuItem value="non_profit">Non-Profit</MenuItem>
                </Select>
                {errors.businessType && <FormHelperText>{errors.businessType}</FormHelperText>}
              </FormControl>
              <TextField
                fullWidth
                margin="normal"
                label="Founder Name"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                error={!!errors.founderName}
                helperText={errors.founderName}
              />
            </Box>
          );
        case 'business_goals':
          return (
            <Box>
              <Typography variant="h6" gutterBottom>
                Business Goals & Preferences
              </Typography>
              <FormControl fullWidth margin="normal" error={!!errors.businessGoals}>
                <InputLabel>Business Goals</InputLabel>
                <Select
                  multiple
                  value={businessGoals}
                  onChange={(e) => setBusinessGoals(e.target.value as string[])}
                  label="Business Goals"
                >
                  <MenuItem value="growth">Growth & Expansion</MenuItem>
                  <MenuItem value="funding">Securing Funding</MenuItem>
                  <MenuItem value="team">Team Building</MenuItem>
                  <MenuItem value="product">Product Development</MenuItem>
                  <MenuItem value="market">Market Positioning</MenuItem>
                  <MenuItem value="strategy">Strategic Planning</MenuItem>
                </Select>
                {errors.businessGoals && <FormHelperText>{errors.businessGoals}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Chart Types (Optional)</InputLabel>
                <Select
                  multiple
                  value={chartPreferences}
                  onChange={(e) => setChartPreferences(e.target.value as string[])}
                  label="Chart Types (Optional)"
                >
                  <MenuItem value="business_natal">Business Natal Chart</MenuItem>
                  <MenuItem value="founder_synastry">Founder Synastry</MenuItem>
                  <MenuItem value="team_compatibility">Team Compatibility</MenuItem>
                  <MenuItem value="financial_transits">Financial Transits</MenuItem>
                  <MenuItem value="strategic_progressions">Strategic Progressions</MenuItem>
                </Select>
              </FormControl>
            </Box>
          );
        default:
          return null;
      }
    }
    
    return null;
  };
  
  return (
    <Box sx={{ width: '100%', maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Set Up Your Business Profile
          </Typography>
          
          {variant.variantConfig.showProgressBar && (
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {variant.steps.map((label, index) => {
                const stepLabel = label.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                
                return (
                  <Step key={label}>
                    <StepLabel>{stepLabel}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          )}
          
          <Box sx={{ mt: 2, mb: 4 }}>
            {getStepContent()}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={isLastStep ? handleSubmit : handleNext}
            >
              {isLastStep ? 'Complete Setup' : 'Next'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OnboardingFlow;
