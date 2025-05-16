// src/services/content/utils/tierIntegration.ts

import tierService from '../../subscription/services/tierService';
import { SubscriptionTierType } from '../../subscription/constants/tiers';
import logger from '../../../utils/logger';

/**
 * Utility class for integrating subscription tier system with content generation
 */
class ContentTierIntegration {
  /**
   * Check if a user has access to daily horoscopes
   * @param userId User ID to check
   * @returns Whether the user has access to daily horoscopes
   */
  async canAccessDailyHoroscope(userId: string): Promise<boolean> {
    try {
      return await tierService.hasFeatureAccess(userId, 'dailyHoroscope');
    } catch (error) {
      logger.error('Error checking daily horoscope access:', error);
      return false;
    }
  }

  /**
   * Check if a user has access to monthly reports
   * @param userId User ID to check
   * @returns Whether the user has access to monthly reports
   */
  async canAccessMonthlyReport(userId: string): Promise<boolean> {
    try {
      return await tierService.hasFeatureAccess(userId, 'monthlyReport');
    } catch (error) {
      logger.error('Error checking monthly report access:', error);
      return false;
    }
  }

  /**
   * Check if a user has access to business compatibility analysis
   * @param userId User ID to check
   * @returns Whether the user has access to business compatibility analysis
   */
  async canAccessBusinessCompatibility(userId: string): Promise<boolean> {
    try {
      return await tierService.hasFeatureAccess(userId, 'businessCompatibility');
    } catch (error) {
      logger.error('Error checking business compatibility access:', error);
      return false;
    }
  }

  /**
   * Get the maximum number of business profiles a user can create
   * @param userId User ID to check
   * @returns Maximum number of business profiles allowed
   */
  async getMaxBusinessProfiles(userId: string): Promise<number> {
    try {
      const userTier = await tierService.getUserTier(userId);
      const tierFeatures = tierService.getTierFeatures(userTier);
      return tierFeatures.maxBusinessProfiles;
    } catch (error) {
      logger.error('Error getting max business profiles:', error);
      // Default to free tier limit
      return tierService.getTierFeatures(SubscriptionTierType.FREE).maxBusinessProfiles;
    }
  }

  /**
   * Get the maximum number of saved reports a user can have
   * @param userId User ID to check
   * @returns Maximum number of saved reports allowed
   */
  async getMaxSavedReports(userId: string): Promise<number> {
    try {
      const userTier = await tierService.getUserTier(userId);
      const tierFeatures = tierService.getTierFeatures(userTier);
      return tierFeatures.maxSavedReports;
    } catch (error) {
      logger.error('Error getting max saved reports:', error);
      // Default to free tier limit
      return tierService.getTierFeatures(SubscriptionTierType.FREE).maxSavedReports;
    }
  }

  /**
   * Check if a user can access Astro Ratan chat
   * @param userId User ID to check
   * @returns Whether the user has access to Astro Ratan chat
   */
  async canAccessAstroRatanChat(userId: string): Promise<boolean> {
    try {
      return await tierService.hasFeatureAccess(userId, 'astroRatanChat');
    } catch (error) {
      logger.error('Error checking Astro Ratan chat access:', error);
      return false;
    }
  }

  /**
   * Check if a user can access human astrologer consultations
   * @param userId User ID to check
   * @returns Whether the user has access to human astrologer consultations
   */
  async canAccessHumanAstrologer(userId: string): Promise<boolean> {
    try {
      return await tierService.hasFeatureAccess(userId, 'humanAstrologerAccess');
    } catch (error) {
      logger.error('Error checking human astrologer access:', error);
      return false;
    }
  }
}

export default new ContentTierIntegration();
