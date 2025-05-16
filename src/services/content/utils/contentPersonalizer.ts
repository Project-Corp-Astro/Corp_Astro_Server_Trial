// src/services/content/utils/contentPersonalizer.ts

import logger from '../../../utils/logger';
import { getContentVariable } from './seedVariables';
import axios from 'axios';
import { ASTRO_ENGINE_URL } from '../../../config/constants';
import { getCache, setCacheWithExpiry } from '../../../utils/redisHelper';
import { UserProfile } from '../../user/models';
import BusinessProfile from '../../business/models/businessProfile';

/**
 * Interface for astrological data received from Astro Engine
 */
interface AstrologicalData {
  planets: Record<string, any>;
  houses: Record<string, any>;
  aspects: Record<string, any>;
  zodiacSign: string;
  ascendant: string;
  moonPhase: string;
  retrogradeCount: number;
}

/**
 * Cache TTL in seconds for different content types
 */
const CACHE_TTL = {
  DAILY: 86400, // 24 hours
  MONTHLY: 2592000, // 30 days
  BUSINESS: 604800, // 7 days
};

/**
 * Get astrological data for a user from the Astro Engine
 * @param userId User ID to get data for
 * @param date Optional date for the calculation (defaults to current date)
 * @returns Astrological data or null if not available
 */
export const getUserAstrologicalData = async (
  userId: string,
  date?: Date
): Promise<AstrologicalData | null> => {
  try {
    // Check cache first
    const cacheKey = `astro:user:${userId}:${date ? date.toISOString().split('T')[0] : 'today'}`;
    const cachedData = await getCache<AstrologicalData>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    // Get user profile to retrieve birth data
    const userProfile = await UserProfile.findOne({
      where: { user_id: userId },
    });
    
    if (!userProfile || !userProfile.birth_date || !userProfile.birth_time || !userProfile.birth_place) {
      logger.warn(`Incomplete birth data for user ${userId}`);
      return null;
    }
    
    // Call Astro Engine API
    const response = await axios.post(`${ASTRO_ENGINE_URL}/calculate/natal`, {
      birthDate: userProfile.birth_date,
      birthTime: userProfile.birth_time,
      birthPlace: userProfile.birth_place,
      calculationDate: date ? date.toISOString() : new Date().toISOString(),
    });
    
    if (response.status === 200 && response.data) {
      // Cache the result
      await setCacheWithExpiry(cacheKey, response.data, CACHE_TTL.DAILY);
      
      return response.data;
    }
    
    return null;
  } catch (error) {
    logger.error(`Error getting astrological data for user ${userId}:`, error);
    return null;
  }
};

/**
 * Get astrological data for a business from the Astro Engine
 * @param businessId Business ID to get data for
 * @param date Optional date for the calculation (defaults to current date)
 * @returns Astrological data or null if not available
 */
export const getBusinessAstrologicalData = async (
  businessId: string,
  date?: Date
): Promise<AstrologicalData | null> => {
  try {
    // Check cache first
    const cacheKey = `astro:business:${businessId}:${date ? date.toISOString().split('T')[0] : 'today'}`;
    const cachedData = await getCache<AstrologicalData>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    // Get business profile to retrieve foundation data
    const businessProfile = await BusinessProfile.findOne({
      where: { business_id: businessId },
    });
    
    if (!businessProfile || !businessProfile.foundation_date || !businessProfile.foundation_time || !businessProfile.foundation_place) {
      logger.warn(`Incomplete foundation data for business ${businessId}`);
      return null;
    }
    
    // Call Astro Engine API
    const response = await axios.post(`${ASTRO_ENGINE_URL}/calculate/business`, {
      foundationDate: businessProfile.foundation_date,
      foundationTime: businessProfile.foundation_time,
      foundationPlace: businessProfile.foundation_place,
      calculationDate: date ? date.toISOString() : new Date().toISOString(),
    });
    
    if (response.status === 200 && response.data) {
      // Cache the result
      await setCacheWithExpiry(cacheKey, response.data, CACHE_TTL.DAILY);
      
      return response.data;
    }
    
    return null;
  } catch (error) {
    logger.error(`Error getting astrological data for business ${businessId}:`, error);
    return null;
  }
};

/**
 * Get personalization variables for content generation
 * @param userId User ID
 * @param businessId Optional business ID
 * @param contentType Content type (daily_horoscope, monthly_report, business_insight)
 * @returns Object with personalization variables
 */
export const getPersonalizationVariables = async (
  userId: string,
  contentType: string,
  businessId?: string
): Promise<Record<string, any>> => {
  try {
    // Get user profile
    const userProfile = await UserProfile.findOne({
      where: { user_id: userId },
    });
    
    if (!userProfile) {
      logger.warn(`User profile not found for user ${userId}`);
      return {};
    }
    
    // Get astrological data
    const astroData = await getUserAstrologicalData(userId);
    if (!astroData) {
      logger.warn(`Astrological data not available for user ${userId}`);
      return {
        userName: userProfile.first_name,
        userZodiacSign: userProfile.zodiac_sign || 'Unknown',
      };
    }
    
    // Base variables
    const variables: Record<string, any> = {
      userName: userProfile.first_name,
      userZodiacSign: astroData.zodiacSign,
      ascendant: astroData.ascendant,
      moonPhase: astroData.moonPhase,
      dominantPlanet: getDominantPlanet(astroData),
      retrogradeCount: astroData.retrogradeCount,
    };
    
    // Add content-specific variables
    if (contentType === 'daily_horoscope') {
      const planetInfluences = await getContentVariable('planet_influence', 'daily_horoscope');
      if (planetInfluences) {
        variables.planetInfluences = planetInfluences;
      }
      
      // Get today's most influential planet
      const todayPlanet = getMostInfluentialPlanet(astroData);
      variables.todayPlanet = todayPlanet;
      variables.todayPlanetInfluence = planetInfluences ? planetInfluences[todayPlanet] : '';
    }
    
    if (contentType === 'monthly_report') {
      const zodiacTraits = await getContentVariable('zodiac_business_traits', 'monthly_report');
      if (zodiacTraits) {
        variables.zodiacTraits = zodiacTraits[astroData.zodiacSign] || '';
      }
    }
    
    // Add business-specific variables if a business ID is provided
    if (businessId) {
      const businessProfile = await BusinessProfile.findOne({
        where: { business_id: businessId },
      });
      
      if (businessProfile) {
        variables.businessName = businessProfile.business_name;
        variables.businessSector = businessProfile.business_sector;
        
        // Get business astrological data
        const businessAstroData = await getBusinessAstrologicalData(businessId);
        if (businessAstroData) {
          variables.businessZodiacSign = businessAstroData.zodiacSign;
          
          // Get business sector advice
          const sectorAdvice = await getContentVariable('business_sector_advice', 'business_insight');
          if (sectorAdvice && businessProfile.business_sector) {
            variables.sectorAdvice = sectorAdvice[businessProfile.business_sector] || '';
          }
          
          // Get house focus for business
          const houseFocus = await getContentVariable('house_business_focus', 'business_insight');
          if (houseFocus) {
            const dominantHouse = getDominantHouse(businessAstroData);
            variables.dominantHouse = dominantHouse;
            variables.houseFocus = houseFocus[dominantHouse.toString()] || '';
          }
        }
      }
    }
    
    return variables;
  } catch (error) {
    logger.error(`Error getting personalization variables for user ${userId}:`, error);
    return {};
  }
};

/**
 * Get the dominant planet from astrological data
 * @param astroData Astrological data
 * @returns Name of the dominant planet
 */
const getDominantPlanet = (astroData: AstrologicalData): string => {
  // This is a simplified implementation
  // In a real system, this would use more complex astrological rules
  const planets = astroData.planets;
  let dominantPlanet = 'Sun'; // Default
  let highestStrength = 0;
  
  for (const [planet, data] of Object.entries(planets)) {
    if (data.strength > highestStrength) {
      highestStrength = data.strength;
      dominantPlanet = planet;
    }
  }
  
  return dominantPlanet;
};

/**
 * Get the most influential planet for today from astrological data
 * @param astroData Astrological data
 * @returns Name of the most influential planet
 */
const getMostInfluentialPlanet = (astroData: AstrologicalData): string => {
  // This is a simplified implementation
  // In a real system, this would use more complex astrological rules
  const planets = astroData.planets;
  let influentialPlanet = 'Sun'; // Default
  let highestInfluence = 0;
  
  for (const [planet, data] of Object.entries(planets)) {
    if (data.dailyInfluence > highestInfluence) {
      highestInfluence = data.dailyInfluence;
      influentialPlanet = planet;
    }
  }
  
  return influentialPlanet;
};

/**
 * Get the dominant house from astrological data
 * @param astroData Astrological data
 * @returns Number of the dominant house (1-12)
 */
const getDominantHouse = (astroData: AstrologicalData): number => {
  // This is a simplified implementation
  // In a real system, this would use more complex astrological rules
  const houses = astroData.houses;
  let dominantHouse = 10; // Default to 10th house (career/business)
  let highestActivity = 0;
  
  for (const [house, data] of Object.entries(houses)) {
    if (data.activity > highestActivity) {
      highestActivity = data.activity;
      dominantHouse = parseInt(house, 10);
    }
  }
  
  return dominantHouse;
};

export default {
  getUserAstrologicalData,
  getBusinessAstrologicalData,
  getPersonalizationVariables,
};
