/**
 * Numerology Service
 * 
 * Provides methods for analyzing business names and taglines using Chaldean numerology,
 * as specified in the Corp Astro mobile application requirements.
 */

import logger from '../../utils/logger';

/**
 * Interface for numerology analysis result
 */
export interface NumerologyResult {
  input: string;
  numerologyNumber: number;
  interpretation: string;
  businessImplications: string[];
  compatibility?: Record<string, any>;
}

/**
 * Numerology Service class for name and tagline analysis
 */
export class NumerologyService {
  // Chaldean numerology values for each letter
  private static readonly chaldeanValues: Record<string, number> = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 8, 'g': 3, 'h': 5, 'i': 1,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 7, 'p': 8, 'q': 1, 'r': 2,
    's': 3, 't': 4, 'u': 6, 'v': 6, 'w': 6, 'x': 5, 'y': 1, 'z': 7
  };
  
  // Interpretations for each numerology number
  private static readonly interpretations: Record<number, string> = {
    1: "Number 1 represents leadership, innovation, and pioneering spirit. It signifies originality, independence, and self-reliance.",
    2: "Number 2 represents cooperation, diplomacy, and partnerships. It signifies balance, harmony, and attention to detail.",
    3: "Number 3 represents creativity, communication, and self-expression. It signifies optimism, enthusiasm, and social interaction.",
    4: "Number 4 represents stability, practicality, and organization. It signifies reliability, discipline, and strong foundations.",
    5: "Number 5 represents freedom, adaptability, and change. It signifies versatility, curiosity, and progressive thinking.",
    6: "Number 6 represents responsibility, harmony, and service. It signifies nurturing, community focus, and balance.",
    7: "Number 7 represents analysis, wisdom, and introspection. It signifies research, technical expertise, and specialized knowledge.",
    8: "Number 8 represents power, ambition, and achievement. It signifies financial success, authority, and executive ability.",
    9: "Number 9 represents humanitarianism, compassion, and completion. It signifies global consciousness, philanthropy, and universal service."
  };
  
  // Business implications for each numerology number
  private static readonly businessImplications: Record<number, string[]> = {
    1: [
      "Ideal for startups and pioneering ventures",
      "Suggests leadership in the industry",
      "Good for businesses focused on innovation and original ideas",
      "Supports independent ventures and solo entrepreneurs"
    ],
    2: [
      "Excellent for partnership-based businesses",
      "Suggests success in collaborative industries",
      "Good for businesses requiring diplomacy and negotiation",
      "Supports service-oriented companies with attention to detail"
    ],
    3: [
      "Ideal for creative industries and marketing",
      "Suggests success in communication-based businesses",
      "Good for entertainment, design, and artistic ventures",
      "Supports businesses that require public engagement"
    ],
    4: [
      "Excellent for established industries requiring reliability",
      "Suggests success in construction, manufacturing, and logistics",
      "Good for businesses built on tradition and consistency",
      "Supports ventures requiring long-term planning"
    ],
    5: [
      "Ideal for travel, hospitality, and entertainment industries",
      "Suggests success in businesses requiring adaptability",
      "Good for ventures involving variety and change",
      "Supports businesses targeting younger demographics"
    ],
    6: [
      "Excellent for healthcare, education, and community services",
      "Suggests success in businesses focused on improving lives",
      "Good for family-owned businesses and local establishments",
      "Supports ventures with strong ethical foundations"
    ],
    7: [
      "Ideal for research, technology, and specialized services",
      "Suggests success in analytical and technical fields",
      "Good for businesses requiring deep expertise and knowledge",
      "Supports ventures in education and information sectors"
    ],
    8: [
      "Excellent for finance, real estate, and large corporations",
      "Suggests success in businesses focused on wealth creation",
      "Good for ventures requiring executive leadership",
      "Supports businesses with ambitious growth plans"
    ],
    9: [
      "Ideal for international businesses and non-profits",
      "Suggests success in humanitarian and global ventures",
      "Good for businesses with universal appeal",
      "Supports ventures focused on sustainability and social impact"
    ]
  };
  
  /**
   * Calculate the Chaldean numerology value for a name or tagline
   * @param input The name or tagline to analyze
   * @returns The calculated numerology number
   */
  private calculateChaldeanValue(input: string): number {
    // Convert to lowercase and remove non-alphabetic characters
    const cleanedInput = input.toLowerCase().replace(/[^a-z]/g, '');
    
    // Calculate the sum of Chaldean values
    let sum = 0;
    for (const char of cleanedInput) {
      sum += this.getChaldeanValue(char);
    }
    
    // Reduce to a single digit or master number (11, 22, 33)
    return this.reduceToNumerologyNumber(sum);
  }
  
  /**
   * Get the Chaldean value for a single character
   * @param char The character to get the value for
   * @returns The Chaldean value
   */
  private getChaldeanValue(char: string): number {
    return NumerologyService.chaldeanValues[char] || 0;
  }
  
  /**
   * Reduce a number to a single digit or master number (11, 22, 33)
   * @param num The number to reduce
   * @returns The reduced number
   */
  private reduceToNumerologyNumber(num: number): number {
    // Check for master numbers
    if (num === 11 || num === 22 || num === 33) {
      return num;
    }
    
    // Reduce to a single digit
    while (num > 9) {
      num = this.sumDigits(num);
    }
    
    return num;
  }
  
  /**
   * Sum the digits of a number
   * @param num The number to sum the digits of
   * @returns The sum of the digits
   */
  private sumDigits(num: number): number {
    return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  
  /**
   * Get the interpretation for a numerology number
   * @param num The numerology number
   * @returns The interpretation
   */
  private getInterpretation(num: number): string {
    // Handle master numbers
    if (num === 11) {
      return "Master Number 11 represents intuition, inspiration, and spiritual insight. It signifies visionary leadership and high ideals.";
    } else if (num === 22) {
      return "Master Number 22 represents the master builder, practical idealism, and large-scale undertakings. It signifies the ability to turn dreams into reality.";
    } else if (num === 33) {
      return "Master Number 33 represents the master teacher, compassion, and selfless service. It signifies nurturing leadership and spiritual enlightenment.";
    }
    
    // Return standard interpretation
    return NumerologyService.interpretations[num] || "No interpretation available for this number.";
  }
  
  /**
   * Get the business implications for a numerology number
   * @param num The numerology number
   * @returns Array of business implications
   */
  private getBusinessImplications(num: number): string[] {
    // Handle master numbers
    if (num === 11) {
      return [
        "Ideal for innovative and visionary businesses",
        "Suggests success in spiritual and inspirational ventures",
        "Good for businesses that are ahead of their time",
        "Supports ventures requiring intuitive leadership"
      ];
    } else if (num === 22) {
      return [
        "Excellent for large-scale businesses and infrastructure projects",
        "Suggests success in transformative industries",
        "Good for ventures with global impact potential",
        "Supports businesses that bridge practical and idealistic goals"
      ];
    } else if (num === 33) {
      return [
        "Ideal for educational institutions and healing practices",
        "Suggests success in businesses focused on nurturing and development",
        "Good for ventures with a strong service component",
        "Supports businesses with a humanitarian mission"
      ];
    }
    
    // Return standard implications
    return NumerologyService.businessImplications[num] || ["No specific business implications available for this number."];
  }
  
  /**
   * Analyze a business name using Chaldean numerology
   * @param businessName The business name to analyze
   * @returns Promise resolving to the numerology analysis result
   */
  public async analyzeBusinessName(businessName: string): Promise<NumerologyResult> {
    try {
      if (!businessName || businessName.trim().length === 0) {
        throw new Error('Business name is required');
      }
      
      const numerologyNumber = this.calculateChaldeanValue(businessName);
      const interpretation = this.getInterpretation(numerologyNumber);
      const businessImplications = this.getBusinessImplications(numerologyNumber);
      
      return {
        input: businessName,
        numerologyNumber,
        interpretation,
        businessImplications,
      };
    } catch (error) {
      logger.error('Error analyzing business name:', error);
      throw new Error('Failed to analyze business name');
    }
  }
  
  /**
   * Analyze a business tagline using Chaldean numerology
   * @param tagline The tagline to analyze
   * @returns Promise resolving to the numerology analysis result
   */
  public async analyzeTagline(tagline: string): Promise<NumerologyResult> {
    try {
      if (!tagline || tagline.trim().length === 0) {
        throw new Error('Tagline is required');
      }
      
      const numerologyNumber = this.calculateChaldeanValue(tagline);
      const interpretation = this.getInterpretation(numerologyNumber);
      const businessImplications = this.getBusinessImplications(numerologyNumber);
      
      return {
        input: tagline,
        numerologyNumber,
        interpretation,
        businessImplications,
      };
    } catch (error) {
      logger.error('Error analyzing tagline:', error);
      throw new Error('Failed to analyze tagline');
    }
  }
  
  /**
   * Check compatibility between a business name and tagline
   * @param businessName The business name
   * @param tagline The tagline
   * @returns Promise resolving to the compatibility analysis
   */
  public async checkNameTaglineCompatibility(businessName: string, tagline: string): Promise<Record<string, any>> {
    try {
      const nameAnalysis = await this.analyzeBusinessName(businessName);
      const taglineAnalysis = await this.analyzeTagline(tagline);
      
      const nameNumber = nameAnalysis.numerologyNumber;
      const taglineNumber = taglineAnalysis.numerologyNumber;
      
      // Calculate compatibility score (1-10)
      let compatibilityScore = 5; // Default to neutral
      
      // Exact match is highly compatible
      if (nameNumber === taglineNumber) {
        compatibilityScore = 10;
      } 
      // Complementary numbers (sum to 10)
      else if (nameNumber + taglineNumber === 10) {
        compatibilityScore = 9;
      }
      // Numbers in the same group (1,5,7 = creative) (2,4,8 = practical) (3,6,9 = communicative)
      else if (
        (this.isInGroup(nameNumber, [1, 5, 7]) && this.isInGroup(taglineNumber, [1, 5, 7])) ||
        (this.isInGroup(nameNumber, [2, 4, 8]) && this.isInGroup(taglineNumber, [2, 4, 8])) ||
        (this.isInGroup(nameNumber, [3, 6, 9]) && this.isInGroup(taglineNumber, [3, 6, 9]))
      ) {
        compatibilityScore = 8;
      }
      // Master numbers with anything
      else if (this.isMasterNumber(nameNumber) || this.isMasterNumber(taglineNumber)) {
        compatibilityScore = 7;
      }
      // Neutral combinations
      else {
        compatibilityScore = 6;
      }
      
      // Generate compatibility description
      let compatibilityDescription = '';
      if (compatibilityScore >= 9) {
        compatibilityDescription = 'Excellent compatibility! Your business name and tagline are in perfect harmony.';
      } else if (compatibilityScore >= 7) {
        compatibilityDescription = 'Good compatibility. Your business name and tagline work well together.';
      } else if (compatibilityScore >= 5) {
        compatibilityDescription = 'Moderate compatibility. Your business name and tagline have a neutral relationship.';
      } else {
        compatibilityDescription = 'Low compatibility. Consider adjusting your tagline to better align with your business name.';
      }
      
      return {
        businessName,
        businessNameNumber: nameNumber,
        tagline,
        taglineNumber,
        compatibilityScore,
        compatibilityDescription,
        recommendations: this.getCompatibilityRecommendations(nameNumber, taglineNumber, compatibilityScore)
      };
    } catch (error) {
      logger.error('Error checking name-tagline compatibility:', error);
      throw new Error('Failed to check compatibility');
    }
  }
  
  /**
   * Check if a number is in a group of numbers
   * @param num The number to check
   * @param group The group of numbers
   * @returns True if the number is in the group
   */
  private isInGroup(num: number, group: number[]): boolean {
    return group.includes(num);
  }
  
  /**
   * Check if a number is a master number
   * @param num The number to check
   * @returns True if the number is a master number
   */
  private isMasterNumber(num: number): boolean {
    return num === 11 || num === 22 || num === 33;
  }
  
  /**
   * Get recommendations for improving name-tagline compatibility
   * @param nameNumber The business name number
   * @param taglineNumber The tagline number
   * @param compatibilityScore The current compatibility score
   * @returns Array of recommendations
   */
  private getCompatibilityRecommendations(nameNumber: number, taglineNumber: number, compatibilityScore: number): string[] {
    if (compatibilityScore >= 8) {
      return [
        "Your business name and tagline are already well-aligned.",
        "Focus on consistent messaging that reinforces this natural harmony.",
        "Consider extending this numerological alignment to other branding elements."
      ];
    }
    
    const recommendations: string[] = [];
    
    // Specific recommendations based on name number
    switch (nameNumber) {
      case 1:
        recommendations.push("Consider a tagline that emphasizes innovation or leadership to match your business name's energy.");
        break;
      case 2:
        recommendations.push("Your business name suggests partnership and cooperation; a tagline highlighting these qualities would create better alignment.");
        break;
      case 3:
        recommendations.push("A more creative and expressive tagline would better complement your business name's vibrant energy.");
        break;
      case 4:
        recommendations.push("Consider a tagline that emphasizes reliability or tradition to better align with your business name's stable energy.");
        break;
      case 5:
        recommendations.push("A tagline suggesting adaptability or freedom would better match your business name's dynamic energy.");
        break;
      case 6:
        recommendations.push("A tagline focused on service or community would create better harmony with your business name.");
        break;
      case 7:
        recommendations.push("Consider a tagline that highlights expertise or analysis to better align with your business name's intellectual energy.");
        break;
      case 8:
        recommendations.push("A tagline suggesting success or achievement would better complement your business name's powerful energy.");
        break;
      case 9:
        recommendations.push("Consider a tagline with a humanitarian or global focus to better align with your business name's universal energy.");
        break;
      case 11:
        recommendations.push("A tagline with visionary or inspirational qualities would better match your business name's master number energy.");
        break;
      case 22:
        recommendations.push("Consider a tagline suggesting transformation or large-scale impact to align with your business name's master builder energy.");
        break;
      case 33:
        recommendations.push("A tagline focused on nurturing or teaching would better complement your business name's master teacher energy.");
        break;
    }
    
    // General recommendations
    recommendations.push("Consider adjusting your tagline to include words that resonate with your business name's numerology.");
    recommendations.push("For optimal alignment, aim for a tagline with a numerology value that matches or complements your business name number.");
    
    return recommendations;
  }
}

export default new NumerologyService();
