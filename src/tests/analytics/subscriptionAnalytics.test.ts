import { expect } from 'chai';
import sinon from 'sinon';
import { 
  hasFeatureAccess,
  getSubscriptionAnalytics,
  getSubscriptionFunnelMetrics,
  getSubscriptionRetentionMetrics
} from '../../services/analytics/utils/subscriptionAnalytics';
import { AnalyticsEvent } from '../../services/analytics/models';

describe('Subscription Analytics', () => {
  afterEach(() => {
    // Restore all stubs
    sinon.restore();
  });
  
  describe('hasFeatureAccess', () => {
    it('should return true when user has access to a feature', () => {
      // Arrange & Act
      const result = hasFeatureAccess('daily_horoscope', 'pro');
      
      // Assert
      expect(result).to.be.true;
    });
    
    it('should return false when user does not have access to a feature', () => {
      // Arrange & Act
      const result = hasFeatureAccess('strategic_planning', 'basic');
      
      // Assert
      expect(result).to.be.false;
    });
    
    it('should return false for invalid tier', () => {
      // Arrange & Act
      // @ts-ignore - Testing with invalid tier
      const result = hasFeatureAccess('daily_horoscope', 'invalid_tier');
      
      // Assert
      expect(result).to.be.false;
    });
  });
  
  describe('getSubscriptionFunnelMetrics', () => {
    it('should return subscription funnel metrics', async () => {
      // Arrange
      const findAllStub = sinon.stub(AnalyticsEvent, 'findAll' as any);
      
      // Mock the first call for funnel stages
      findAllStub.onFirstCall().resolves([
        { get: (key: string) => key === 'event_name' ? 'subscription_page_viewed' : key === 'count' ? '100' : null },
        { get: (key: string) => key === 'event_name' ? 'subscription_tier_selected' : key === 'count' ? '75' : null },
        { get: (key: string) => key === 'event_name' ? 'payment_initiated' : key === 'count' ? '50' : null },
        { get: (key: string) => key === 'event_name' ? 'payment_succeeded' : key === 'count' ? '40' : null }
      ]);
      
      // Mock the second call for conversion by tier
      findAllStub.onSecondCall().resolves([
        { get: (key: string) => key === 'tier' ? 'basic' : key === 'count' ? '20' : null },
        { get: (key: string) => key === 'tier' ? 'pro' : key === 'count' ? '15' : null },
        { get: (key: string) => key === 'tier' ? 'enterprise' : key === 'count' ? '5' : null }
      ]);
      
      // Mock the third call for payment methods
      findAllStub.onThirdCall().resolves([
        { get: (key: string) => key === 'payment_method' ? 'credit_card' : key === 'count' ? '25' : null },
        { get: (key: string) => key === 'payment_method' ? 'paypal' : key === 'count' ? '10' : null },
        { get: (key: string) => key === 'payment_method' ? 'apple_pay' : key === 'count' ? '5' : null }
      ]);
      
      // Mock the fourth call for billing cycles
      findAllStub.onCall(3).resolves([
        { get: (key: string) => key === 'is_annual' ? 'true' : key === 'count' ? '15' : null },
        { get: (key: string) => key === 'is_annual' ? 'false' : key === 'count' ? '25' : null }
      ]);
      
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-05-01');
      
      // Act
      const result = await getSubscriptionFunnelMetrics(startDate, endDate);
      
      // Assert
      expect(findAllStub.callCount).to.equal(4);
      expect(result).to.have.property('funnel').that.is.an('array');
      expect(result).to.have.property('conversion_by_tier').that.is.an('object');
      expect(result).to.have.property('payment_methods').that.is.an('object');
      expect(result).to.have.property('billing_cycles').that.is.an('object');
      
      expect(result.funnel).to.have.lengthOf(4);
      expect(result.funnel[0].rate).to.equal(100);
      expect(result.funnel[1].rate).to.equal(75);
      expect(result.funnel[2].rate).to.equal(50);
      expect(result.funnel[3].rate).to.equal(40);
      
      expect(result.conversion_by_tier).to.have.property('basic', 20);
      expect(result.conversion_by_tier).to.have.property('pro', 15);
      expect(result.conversion_by_tier).to.have.property('enterprise', 5);
      
      expect(result.payment_methods).to.have.property('credit_card', 25);
      expect(result.payment_methods).to.have.property('paypal', 10);
      expect(result.payment_methods).to.have.property('apple_pay', 5);
      
      expect(result.billing_cycles).to.have.property('annual', 15);
      expect(result.billing_cycles).to.have.property('monthly', 25);
    });
    
    it('should handle errors when getting subscription funnel metrics', async () => {
      // Arrange
      const error = new Error('Database error');
      sinon.stub(AnalyticsEvent, 'findAll' as any).rejects(error);
      
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-05-01');
      
      // Act
      const result = await getSubscriptionFunnelMetrics(startDate, endDate);
      
      // Assert
      expect(result).to.deep.equal({});
    });
  });
  
  describe('getSubscriptionRetentionMetrics', () => {
    it('should return subscription retention metrics', async () => {
      // Arrange
      const findAllStub = sinon.stub(AnalyticsEvent, 'findAll' as any);
      
      // Mock cohort data for each month
      findAllStub.resolves([
        { 
          get: (key: string) => {
            if (key === 'cohort_month') return '2025-01';
            if (key === 'month_0') return '100';
            if (key === 'month_1') return '90';
            if (key === 'month_2') return '85';
            return null;
          }
        },
        { 
          get: (key: string) => {
            if (key === 'cohort_month') return '2025-02';
            if (key === 'month_0') return '120';
            if (key === 'month_1') return '100';
            if (key === 'month_2') return '95';
            return null;
          }
        },
        { 
          get: (key: string) => {
            if (key === 'cohort_month') return '2025-03';
            if (key === 'month_0') return '150';
            if (key === 'month_1') return '130';
            return null;
          }
        }
      ]);
      
      // Act
      const result = await getSubscriptionRetentionMetrics(3);
      
      // Assert
      expect(result).to.have.property('cohorts').that.is.an('array');
      expect(result).to.have.property('average_retention').that.is.an('object');
      
      expect(result.cohorts).to.have.lengthOf(3);
      expect(result.cohorts[0]).to.have.property('cohort_month', '2025-01');
      expect(result.cohorts[0]).to.have.property('month_0', 100);
      expect(result.cohorts[0]).to.have.property('month_1', 90);
      expect(result.cohorts[0]).to.have.property('month_2', 85);
      
      expect(result.average_retention).to.have.property('month_0');
      expect(result.average_retention).to.have.property('month_1');
      expect(result.average_retention).to.have.property('month_2');
    });
    
    it('should handle errors when getting subscription retention metrics', async () => {
      // Arrange
      const error = new Error('Database error');
      sinon.stub(AnalyticsEvent, 'findAll' as any).rejects(error);
      
      // Act
      const result = await getSubscriptionRetentionMetrics(3);
      
      // Assert
      expect(result).to.deep.equal({});
    });
  });
  
  describe('getSubscriptionAnalytics', () => {
    it('should return comprehensive subscription analytics data', async () => {
      // Arrange
      const funnelMetricsStub = sinon.stub().resolves({
        funnel: [
          { stage: 'subscription_page_viewed', count: 100, rate: 100 },
          { stage: 'subscription_tier_selected', count: 75, rate: 75 },
          { stage: 'payment_initiated', count: 50, rate: 50 },
          { stage: 'payment_succeeded', count: 40, rate: 40 }
        ],
        conversion_by_tier: { basic: 20, pro: 15, enterprise: 5 },
        payment_methods: { credit_card: 25, paypal: 10, apple_pay: 5 },
        billing_cycles: { annual: 15, monthly: 25 }
      });
      
      const retentionMetricsStub = sinon.stub().resolves({
        cohorts: [
          { cohort_month: '2025-01', month_0: 100, month_1: 90, month_2: 85 },
          { cohort_month: '2025-02', month_0: 120, month_1: 100, month_2: 95 },
          { cohort_month: '2025-03', month_0: 150, month_1: 130 }
        ],
        average_retention: { month_0: 100, month_1: 90, month_2: 85 }
      });
      
      const findAllStub = sinon.stub(AnalyticsEvent, 'findAll' as any).resolves([
        { get: (key: string) => key === 'tier' ? 'basic' : key === 'count' ? '20' : null },
        { get: (key: string) => key === 'tier' ? 'pro' : key === 'count' ? '15' : null },
        { get: (key: string) => key === 'tier' ? 'enterprise' : key === 'count' ? '5' : null }
      ]);
      
      // Replace the actual functions with stubs
      const originalFunnelMetrics = require('../../services/analytics/utils/subscriptionAnalytics').getSubscriptionFunnelMetrics;
      const originalRetentionMetrics = require('../../services/analytics/utils/subscriptionAnalytics').getSubscriptionRetentionMetrics;
      
      Object.defineProperty(require('../../services/analytics/utils/subscriptionAnalytics'), 'getSubscriptionFunnelMetrics', {
        value: funnelMetricsStub
      });
      
      Object.defineProperty(require('../../services/analytics/utils/subscriptionAnalytics'), 'getSubscriptionRetentionMetrics', {
        value: retentionMetricsStub
      });
      
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-05-01');
      
      try {
        // Act
        const result = await getSubscriptionAnalytics(startDate, endDate);
        
        // Assert
        expect(funnelMetricsStub.calledOnce).to.be.true;
        expect(retentionMetricsStub.calledOnce).to.be.true;
        expect(findAllStub.calledOnce).to.be.true;
        
        expect(result).to.have.property('funnel').that.is.an('array');
        expect(result).to.have.property('conversion_by_tier').that.is.an('object');
        expect(result).to.have.property('payment_methods').that.is.an('object');
        expect(result).to.have.property('billing_cycles').that.is.an('object');
        expect(result).to.have.property('retention').that.is.an('object');
        expect(result).to.have.property('cohorts').that.is.an('array');
        expect(result).to.have.property('subscriptions_by_tier').that.is.an('object');
      } finally {
        // Restore the original functions
        Object.defineProperty(require('../../services/analytics/utils/subscriptionAnalytics'), 'getSubscriptionFunnelMetrics', {
          value: originalFunnelMetrics
        });
        
        Object.defineProperty(require('../../services/analytics/utils/subscriptionAnalytics'), 'getSubscriptionRetentionMetrics', {
          value: originalRetentionMetrics
        });
      }
    });
    
    it('should handle errors when getting subscription analytics', async () => {
      // Arrange
      const error = new Error('Database error');
      sinon.stub(AnalyticsEvent, 'findAll' as any).rejects(error);
      
      // Replace the actual functions with stubs that throw errors
      const originalFunnelMetrics = require('../../services/analytics/utils/subscriptionAnalytics').getSubscriptionFunnelMetrics;
      const originalRetentionMetrics = require('../../services/analytics/utils/subscriptionAnalytics').getSubscriptionRetentionMetrics;
      
      const errorStub = sinon.stub().rejects(error);
      
      Object.defineProperty(require('../../services/analytics/utils/subscriptionAnalytics'), 'getSubscriptionFunnelMetrics', {
        value: errorStub
      });
      
      Object.defineProperty(require('../../services/analytics/utils/subscriptionAnalytics'), 'getSubscriptionRetentionMetrics', {
        value: errorStub
      });
      
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-05-01');
      
      try {
        // Act
        const result = await getSubscriptionAnalytics(startDate, endDate);
        
        // Assert
        expect(result).to.deep.equal({});
      } finally {
        // Restore the original functions
        Object.defineProperty(require('../../services/analytics/utils/subscriptionAnalytics'), 'getSubscriptionFunnelMetrics', {
          value: originalFunnelMetrics
        });
        
        Object.defineProperty(require('../../services/analytics/utils/subscriptionAnalytics'), 'getSubscriptionRetentionMetrics', {
          value: originalRetentionMetrics
        });
      }
    });
  });
});
