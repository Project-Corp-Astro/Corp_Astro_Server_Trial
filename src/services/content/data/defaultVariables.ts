// src/services/content/data/defaultVariables.ts

/**
 * Default content variables for the Corp Astro application
 * These variables are used to personalize content in templates
 */

export interface ContentVariableData {
  variable_name: string;
  variable_type: string;
  context: string;
  values: Record<string, any>;
}

export const defaultVariables: ContentVariableData[] = [
  // Planet variables for daily horoscopes
  {
    variable_name: 'planet_influence',
    variable_type: 'planet',
    context: 'daily_horoscope',
    values: {
      Sun: 'leadership, vitality, and self-expression',
      Moon: 'emotions, intuition, and adaptability',
      Mercury: 'communication, intellect, and analysis',
      Venus: 'relationships, values, and resources',
      Mars: 'action, energy, and initiative',
      Jupiter: 'expansion, growth, and opportunity',
      Saturn: 'structure, discipline, and responsibility',
      Uranus: 'innovation, disruption, and change',
      Neptune: 'inspiration, spirituality, and vision',
      Pluto: 'transformation, power, and regeneration'
    }
  },
  
  // Business sector variables
  {
    variable_name: 'business_sector_advice',
    variable_type: 'business',
    context: 'business_insight',
    values: {
      Technology: 'Focus on innovation and staying ahead of market trends',
      Finance: 'Pay attention to market fluctuations and maintain conservative reserves',
      Healthcare: 'Emphasize quality of care and patient satisfaction metrics',
      Retail: 'Enhance customer experience and optimize inventory management',
      Manufacturing: 'Streamline production processes and reduce waste',
      Education: 'Invest in new learning methodologies and staff development',
      Entertainment: 'Create engaging content and expand distribution channels',
      RealEstate: 'Monitor market conditions and focus on location-based opportunities',
      Hospitality: 'Prioritize exceptional service and personalized experiences',
      Consulting: 'Develop specialized expertise and build strong client relationships'
    }
  },
  
  // Zodiac sign variables for monthly reports
  {
    variable_name: 'zodiac_business_traits',
    variable_type: 'zodiac',
    context: 'monthly_report',
    values: {
      Aries: 'leadership, initiative, and pioneering spirit',
      Taurus: 'stability, resource management, and persistence',
      Gemini: 'communication, adaptability, and networking',
      Cancer: 'nurturing culture, emotional intelligence, and team loyalty',
      Leo: 'creativity, confidence, and inspiring leadership',
      Virgo: 'analytical skills, attention to detail, and process improvement',
      Libra: 'partnerships, diplomacy, and balanced decision-making',
      Scorpio: 'strategic thinking, research capabilities, and transformation',
      Sagittarius: 'vision, expansion, and global perspective',
      Capricorn: 'discipline, structure, and long-term planning',
      Aquarius: 'innovation, teamwork, and future-oriented thinking',
      Pisces: 'intuition, compassion, and creative problem-solving'
    }
  },
  
  // Compatibility variables
  {
    variable_name: 'business_compatibility',
    variable_type: 'compatibility',
    context: 'compatibility_analysis',
    values: {
      'Aries-Leo': 'dynamic leadership and creative vision',
      'Taurus-Virgo': 'practical resource management and attention to detail',
      'Gemini-Libra': 'excellent communication and balanced partnerships',
      'Cancer-Scorpio': 'emotional intelligence and strategic depth',
      'Leo-Sagittarius': 'inspiring leadership and expansive vision',
      'Virgo-Capricorn': 'analytical precision and disciplined execution',
      'Libra-Aquarius': 'harmonious teamwork and innovative thinking',
      'Scorpio-Pisces': 'transformative power and intuitive insight',
      'Sagittarius-Aries': 'adventurous spirit and pioneering initiative',
      'Capricorn-Taurus': 'structured approach and resource stability',
      'Aquarius-Gemini': 'forward-thinking and adaptable communication',
      'Pisces-Cancer': 'compassionate vision and nurturing culture'
    }
  },
  
  // Name numerology variables
  {
    variable_name: 'numerology_business_meaning',
    variable_type: 'numerology',
    context: 'name_analysis',
    values: {
      '1': 'leadership, innovation, and pioneering ventures',
      '2': 'partnerships, cooperation, and diplomatic business relationships',
      '3': 'creativity, communication, and expressive marketing',
      '4': 'stability, organization, and methodical business processes',
      '5': 'adaptability, change, and diverse business opportunities',
      '6': 'responsibility, service, and community-focused business',
      '7': 'analysis, research, and specialized knowledge',
      '8': 'ambition, authority, and financial management',
      '9': 'humanitarian values, global perspective, and completion'
    }
  },
  
  // Color analysis variables
  {
    variable_name: 'color_business_influence',
    variable_type: 'color',
    context: 'color_analysis',
    values: {
      Red: 'energy, passion, and action-oriented business approach',
      Blue: 'trust, reliability, and professional service focus',
      Green: 'growth, balance, and sustainable business practices',
      Yellow: 'optimism, clarity, and intellectual business solutions',
      Purple: 'luxury, creativity, and visionary business leadership',
      Orange: 'enthusiasm, warmth, and social business engagement',
      Black: 'sophistication, authority, and premium business positioning',
      White: 'simplicity, clarity, and innovative business thinking',
      Gold: 'prosperity, wisdom, and high-value business offerings',
      Silver: 'prestige, modernity, and technological business focus'
    }
  },
  
  // Astrological house variables
  {
    variable_name: 'house_business_focus',
    variable_type: 'house',
    context: 'business_insight',
    values: {
      '1': 'brand identity and company image',
      '2': 'financial resources and revenue streams',
      '3': 'communication, marketing, and local networking',
      '4': 'office space, company culture, and foundational elements',
      '5': 'creative output, product development, and speculative ventures',
      '6': 'operational efficiency, employee relations, and service quality',
      '7': 'partnerships, contracts, and client relationships',
      '8': 'investments, shared resources, and transformative business changes',
      '9': 'expansion, international markets, and higher education',
      '10': 'reputation, achievement, and long-term business goals',
      '11': 'networking, innovation, and future business vision',
      '12': 'behind-the-scenes work, research, and strategic planning'
    }
  }
];

export default defaultVariables;
