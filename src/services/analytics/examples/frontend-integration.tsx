import React, { useEffect, useState } from 'react';
import { CorpAstroAnalytics } from '../client/CorpAstroAnalytics';
import { getOnboardingVariant, recordOnboardingCompletion } from './onboarding-ab-test';

// Initialize analytics
const analytics = new CorpAstroAnalytics({
  apiUrl: '/api/analytics',
  appVersion: '1.0.0',
  debug: process.env.NODE_ENV !== 'production',
  userIdProvider: () => localStorage.getItem('user_id') || null
});

/**
 * Example: Onboarding component that uses A/B testing
 */
function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingConfig, setOnboardingConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('user_id') || 'anonymous';
  const sessionId = localStorage.getItem('session_id') || 'session_' + Math.random().toString(36).substring(2);
  
  // Load the appropriate variant for this user
  useEffect(() => {
    async function loadVariant() {
      try {
        // Get the variant for this user
        const config = await getOnboardingVariant(userId, sessionId);
        setOnboardingConfig(config);
        
        // Track onboarding start
        analytics.trackEvent(
          'onboarding_started',
          'onboarding',
          'start',
          {
            variant: config.steps.length === 3 ? 'simplified' : 'control',
            total_steps: config.steps.length
          }
        );
      } catch (error) {
        console.error('Error loading variant:', error);
        // Fallback to default config
        setOnboardingConfig({
          steps: ['welcome', 'birth_info', 'interests', 'subscription'],
          showProgressBar: true,
          allowSkip: false
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadVariant();
  }, [userId, sessionId]);
  
  // Handle next step
  const handleNextStep = () => {
    // Track step completion
    analytics.trackEvent(
      'onboarding_step_completed',
      'onboarding',
      'next',
      {
        step_name: onboardingConfig.steps[currentStep],
        step_number: currentStep + 1,
        total_steps: onboardingConfig.steps.length
      }
    );
    
    if (currentStep < onboardingConfig.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Onboarding completed
      handleOnboardingComplete();
    }
  };
  
  // Handle skip step
  const handleSkipStep = () => {
    // Track step skipped
    analytics.trackEvent(
      'onboarding_step_skipped',
      'onboarding',
      'skip',
      {
        step_name: onboardingConfig.steps[currentStep],
        step_number: currentStep + 1,
        total_steps: onboardingConfig.steps.length
      }
    );
    
    if (currentStep < onboardingConfig.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Onboarding completed
      handleOnboardingComplete();
    }
  };
  
  // Handle onboarding completion
  const handleOnboardingComplete = async () => {
    // Record conversion for A/B test
    await recordOnboardingCompletion(userId, sessionId);
    
    // Track onboarding completion
    analytics.trackEvent(
      'onboarding_completed',
      'onboarding',
      'complete',
      {
        variant: onboardingConfig.steps.length === 3 ? 'simplified' : 'control',
        total_steps: onboardingConfig.steps.length,
        time_spent: 300 // Example value in seconds
      }
    );
    
    // Track feature usage
    analytics.trackFeatureUsage(
      'onboarding',
      'user_journey',
      300, // Duration in seconds
      'success',
      {
        steps_completed: onboardingConfig.steps.length,
        skipped_steps: 0 // Update with actual count
      }
    );
    
    // Navigate to dashboard or home page
    // window.location.href = '/dashboard';
  };
  
  if (loading) {
    return <div>Loading onboarding...</div>;
  }
  
  // Render current step
  const renderStep = () => {
    const stepName = onboardingConfig.steps[currentStep];
    
    switch (stepName) {
      case 'welcome':
        return <WelcomeStep onNext={handleNextStep} />;
      case 'birth_info':
        return <BirthInfoStep onNext={handleNextStep} onSkip={onboardingConfig.allowSkip ? handleSkipStep : undefined} />;
      case 'interests':
        return <InterestsStep onNext={handleNextStep} onSkip={onboardingConfig.allowSkip ? handleSkipStep : undefined} />;
      case 'subscription':
        return <SubscriptionStep onNext={handleNextStep} />;
      default:
        return <div>Unknown step</div>;
    }
  };
  
  return (
    <div className="onboarding-flow">
      {onboardingConfig.showProgressBar && (
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${((currentStep + 1) / onboardingConfig.steps.length) * 100}%` }}
          />
        </div>
      )}
      
      <div className="step-container">
        {renderStep()}
      </div>
      
      <div className="step-indicator">
        Step {currentStep + 1} of {onboardingConfig.steps.length}
      </div>
    </div>
  );
}

// Example step components
const WelcomeStep = ({ onNext }: { onNext: () => void }) => (
  <div className="step">
    <h2>Welcome to Corp Astro!</h2>
    <p>Discover the power of astrology for your business decisions.</p>
    <button onClick={onNext}>Get Started</button>
  </div>
);

const BirthInfoStep = ({ onNext, onSkip }: { onNext: () => void, onSkip?: () => void }) => (
  <div className="step">
    <h2>Your Birth Information</h2>
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
      <div className="form-group">
        <label>Date of Birth</label>
        <input type="date" required />
      </div>
      <div className="form-group">
        <label>Time of Birth</label>
        <input type="time" required />
      </div>
      <div className="form-group">
        <label>Place of Birth</label>
        <input type="text" placeholder="City, Country" required />
      </div>
      <button type="submit">Continue</button>
      {onSkip && <button type="button" onClick={onSkip}>Skip for now</button>}
    </form>
  </div>
);

const InterestsStep = ({ onNext, onSkip }: { onNext: () => void, onSkip?: () => void }) => (
  <div className="step">
    <h2>Your Business Interests</h2>
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
      <div className="form-group">
        <label>Industry</label>
        <select>
          <option>Technology</option>
          <option>Finance</option>
          <option>Healthcare</option>
          <option>Retail</option>
          <option>Other</option>
        </select>
      </div>
      <div className="form-group">
        <label>Business Goals</label>
        <div className="checkbox-group">
          <label><input type="checkbox" /> Strategic Planning</label>
          <label><input type="checkbox" /> Team Building</label>
          <label><input type="checkbox" /> Investment Timing</label>
          <label><input type="checkbox" /> Personal Growth</label>
        </div>
      </div>
      <button type="submit">Continue</button>
      {onSkip && <button type="button" onClick={onSkip}>Skip for now</button>}
    </form>
  </div>
);

const SubscriptionStep = ({ onNext }: { onNext: () => void }) => {
  // Track UI interaction for heatmap
  const handlePlanClick = (plan: string, e: React.MouseEvent) => {
    analytics.trackUIInteraction(
      {
        x: e.clientX,
        y: e.clientY,
        elementSelector: `subscription-plan-${plan}`
      },
      'click'
    );
  };
  
  return (
    <div className="step">
      <h2>Choose Your Plan</h2>
      <div className="subscription-plans">
        <div 
          className="plan" 
          onClick={(e) => handlePlanClick('basic', e)}
          data-testid="subscription-plan-basic"
        >
          <h3>Basic</h3>
          <p className="price">$9.99/month</p>
          <ul>
            <li>Daily Horoscope</li>
            <li>Basic Business Forecast</li>
            <li>Email Support</li>
          </ul>
          <button onClick={onNext}>Select Basic</button>
        </div>
        
        <div 
          className="plan featured" 
          onClick={(e) => handlePlanClick('pro', e)}
          data-testid="subscription-plan-pro"
        >
          <h3>Professional</h3>
          <p className="price">$19.99/month</p>
          <ul>
            <li>Daily & Weekly Horoscope</li>
            <li>Advanced Business Forecast</li>
            <li>Team Compatibility</li>
            <li>Priority Support</li>
          </ul>
          <button onClick={onNext}>Select Pro</button>
        </div>
        
        <div 
          className="plan" 
          onClick={(e) => handlePlanClick('enterprise', e)}
          data-testid="subscription-plan-enterprise"
        >
          <h3>Enterprise</h3>
          <p className="price">$49.99/month</p>
          <ul>
            <li>All Pro Features</li>
            <li>Strategic Planning Tools</li>
            <li>Investment Timing Guide</li>
            <li>Dedicated Consultant</li>
          </ul>
          <button onClick={onNext}>Select Enterprise</button>
        </div>
      </div>
      <p>
        <a href="#" onClick={(e) => { e.preventDefault(); onNext(); }}>
          Continue with Free Trial
        </a>
      </p>
    </div>
  );
};

export default OnboardingFlow;
