import { expect } from 'chai';
import * as sinon from 'sinon';
import { createAstrologyABTest, getAstrologyTestVariant, trackAstrologyTestConversion, getAstrologyTestResults, AstrologyTestType, AstrologyConversionType } from '../../services/analytics/utils/astrologyABTests';
import * as abTestingService from '../../services/analytics/utils/abTestingService';

describe('Astrology AB Tests', () => {
  let createABTestStub: sinon.SinonStub;
  let getTestVariantStub: sinon.SinonStub;
  let recordConversionStub: sinon.SinonStub;
  let getTestResultsStub: sinon.SinonStub;
  
  beforeEach(() => {
    // Create stubs for the abTestingService functions
    createABTestStub = sinon.stub(abTestingService, 'createABTest');
    getTestVariantStub = sinon.stub(abTestingService, 'getTestVariant');
    recordConversionStub = sinon.stub(abTestingService, 'recordConversion');
    getTestResultsStub = sinon.stub(abTestingService, 'getTestResults');
  });
  
  afterEach(() => {
    // Restore all stubs
    sinon.restore();
  });
  
  describe('createAstrologyABTest', () => {
    it('should create an A/B test for astrology features', async () => {
      // Arrange
      const testName = 'horoscope_layout_test';
      const variants = ['layout_a', 'layout_b'];
      const expectedTestId = 'test-123';
      
      createABTestStub.resolves(expectedTestId);
      
      // Act
      const result = await createAstrologyABTest({
        testName,
        testType: AstrologyTestType.HOROSCOPE_FORMAT,
        variants: variants.map(v => ({ name: v, weight: 50, config: {} })),
        conversionType: AstrologyConversionType.FEATURE_USED,
        description: 'Test description'
      });
      
      // Assert
      expect(createABTestStub.calledOnce).to.be.true;
      expect(createABTestStub.firstCall.args[0]).to.equal(testName);
      expect(createABTestStub.firstCall.args[1]).to.deep.equal(variants);
      expect(result).to.equal(expectedTestId);
    });
    
    it('should handle errors when creating an A/B test', async () => {
      // Arrange
      const testName = 'horoscope_layout_test';
      const variants = ['layout_a', 'layout_b'];
      const error = new Error('Database error');
      
      createABTestStub.rejects(error);
      
      try {
        // Act
        await createAstrologyABTest({
        testName,
        testType: AstrologyTestType.HOROSCOPE_FORMAT,
        variants: variants.map(v => ({ name: v, weight: 50, config: {} })),
        conversionType: AstrologyConversionType.FEATURE_USED,
        description: 'Test description'
      });
        // If we reach here, the test should fail
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        // Assert
        expect(err).to.equal(error);
      }
    });
  });
  
  describe('getAstrologyTestVariant', () => {
    it('should get the variant for a user', async () => {
      // Arrange
      const testName = 'horoscope_layout_test';
      const userId = 'user-123';
      const expectedVariant = {
        testId: 'test-123',
        variantName: 'layout_a'
      };
      
      getTestVariantStub.resolves(expectedVariant);
      
      // Act
      const result = await getAstrologyTestVariant(testName);
      
      // Assert
      expect(getTestVariantStub.calledOnce).to.be.true;
      expect(getTestVariantStub.firstCall.args[0]).to.equal(testName);
      // No second argument for getTestVariant
      expect(result).to.deep.equal(expectedVariant);
    });
    
    it('should handle errors when getting a variant', async () => {
      // Arrange
      const testName = 'horoscope_layout_test';
      const userId = 'user-123';
      const error = new Error('Test not found');
      
      getTestVariantStub.rejects(error);
      
      try {
        // Act
        await getAstrologyTestVariant(testName);
        // If we reach here, the test should fail
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        // Assert
        expect(err).to.equal(error);
      }
    });
  });
  
  describe('trackAstrologyTestConversion', () => {
    it('should track a conversion for an astrology test', async () => {
      // Arrange
      const testName = 'horoscope_layout_test';
      const userId = 'user-123';
      
      recordConversionStub.resolves(true);
      
      // Act
      const result = await trackAstrologyTestConversion(testName, userId);
      
      // Assert
      expect(recordConversionStub.calledOnce).to.be.true;
      expect(recordConversionStub.firstCall.args[0]).to.equal(testName);
      // No second argument for recordConversion
      expect(result).to.be.true;
    });
    
    it('should handle errors when tracking a conversion', async () => {
      // Arrange
      const testName = 'horoscope_layout_test';
      const userId = 'user-123';
      const error = new Error('Assignment not found');
      
      recordConversionStub.rejects(error);
      
      try {
        // Act
        await trackAstrologyTestConversion(testName, userId);
        // If we reach here, the test should fail
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        // Assert
        expect(err).to.equal(error);
      }
    });
  });
  
  describe('getAstrologyTestResults', () => {
    it('should get results for an astrology test', async () => {
      // Arrange
      const testName = 'horoscope_layout_test';
      const expectedResults = {
        testName: 'horoscope_layout_test',
        variants: [
          {
            name: 'layout_a',
            impressions: 100,
            conversions: 20,
            conversionRate: 0.2
          },
          {
            name: 'layout_b',
            impressions: 100,
            conversions: 25,
            conversionRate: 0.25
          }
        ]
      };
      
      getTestResultsStub.resolves(expectedResults);
      
      // Act
      const result = await getAstrologyTestResults(testName);
      
      // Assert
      expect(getTestResultsStub.calledOnce).to.be.true;
      expect(getTestResultsStub.firstCall.args[0]).to.equal(testName);
      expect(result).to.deep.equal(expectedResults);
    });
    
    it('should handle errors when getting test results', async () => {
      // Arrange
      const testName = 'horoscope_layout_test';
      const error = new Error('Test not found');
      
      getTestResultsStub.rejects(error);
      
      try {
        // Act
        await getAstrologyTestResults(testName);
        // If we reach here, the test should fail
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        // Assert
        expect(err).to.equal(error);
      }
    });
  });
});
