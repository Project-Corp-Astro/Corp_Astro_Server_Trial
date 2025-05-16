// src/services/content/data/defaultTemplates.ts

/**
 * Default content templates for the Corp Astro application
 * These templates are used as fallbacks if no custom templates are found
 */

/**
 * Template interface for type safety
 */
export interface ContentTemplateData {
  template_type: string;
  zodiac_sign?: string | null;
  planet?: string | null;
  house?: number | null;
  aspect?: string | null;
  template_content: string;
  variables: string[];
  tags?: string[];
  active: boolean;
}

export const defaultTemplates: ContentTemplateData[] = [
  // Daily Horoscope Templates
  {
    template_type: 'daily_horoscope',
    zodiac_sign: null, // Generic template for all signs
    template_content: `# Daily Business Horoscope for {{date}}

## Overview
{{dailyOverview}}

## Business Opportunities
Today's planetary alignments suggest {{businessOpportunities}}

## Financial Outlook
{{financialOutlook}}

## Team Dynamics
{{teamDynamics}}

## Strategic Advice
{{strategicAdvice}}

## Networking
{{networkingAdvice}}

## Best Times for Important Decisions
{{bestTimes}}`,
    variables: [
      'date', 
      'dailyOverview', 
      'businessOpportunities', 
      'financialOutlook', 
      'teamDynamics', 
      'strategicAdvice', 
      'networkingAdvice', 
      'bestTimes'
    ],
    tags: ['daily', 'business', 'horoscope'],
    active: true
  },
  
  // Aries-specific daily horoscope
  {
    template_type: 'daily_horoscope',
    zodiac_sign: 'Aries',
    template_content: `# Daily Business Horoscope for Aries - {{date}}

## Overview
As an Aries entrepreneur, today's energy is {{dailyOverview}}

## Business Opportunities
Your natural leadership qualities are {{businessOpportunities}}

## Financial Outlook
Mars, your ruling planet, influences your financial decisions today: {{financialOutlook}}

## Team Dynamics
Your team needs your Aries energy to {{teamDynamics}}

## Strategic Advice
Channel your pioneering spirit to {{strategicAdvice}}

## Networking
Your networking power today is {{networkingAdvice}}

## Best Times for Important Decisions
{{bestTimes}}`,
    variables: [
      'date', 
      'dailyOverview', 
      'businessOpportunities', 
      'financialOutlook', 
      'teamDynamics', 
      'strategicAdvice', 
      'networkingAdvice', 
      'bestTimes'
    ],
    tags: ['daily', 'business', 'horoscope', 'aries'],
    active: true
  },
  
  // Taurus-specific daily horoscope
  {
    template_type: 'daily_horoscope',
    zodiac_sign: 'Taurus',
    template_content: `# Daily Business Horoscope for Taurus - {{date}}

## Overview
As a Taurus business leader, today's energy is {{dailyOverview}}

## Business Opportunities
Your practical approach to business today will {{businessOpportunities}}

## Financial Outlook
Venus, your ruling planet, influences your financial decisions today: {{financialOutlook}}

## Team Dynamics
Your team appreciates your steadfast leadership as you {{teamDynamics}}

## Strategic Advice
Use your determination to {{strategicAdvice}}

## Networking
Your networking opportunities today are {{networkingAdvice}}

## Best Times for Important Decisions
{{bestTimes}}`,
    variables: [
      'date', 
      'dailyOverview', 
      'businessOpportunities', 
      'financialOutlook', 
      'teamDynamics', 
      'strategicAdvice', 
      'networkingAdvice', 
      'bestTimes'
    ],
    tags: ['daily', 'business', 'horoscope', 'taurus'],
    active: true
  },
  
  // Monthly Report Templates
  {
    template_type: 'monthly_report',
    zodiac_sign: null, // Generic template for all signs
    template_content: `# Monthly Business Forecast: {{month}} {{year}}

## Executive Summary
{{executiveSummary}}

## Business Climate Overview
{{businessClimateOverview}}

## Financial Projections
{{financialProjections}}

## Strategic Opportunities
{{strategicOpportunities}}

## Potential Challenges
{{potentialChallenges}}

## Team Management Focus
{{teamManagementFocus}}

## Networking & Partnership Opportunities
{{networkingOpportunities}}

## Key Dates for Business Activities
{{keyDates}}

## Long-term Planning Advice
{{longTermAdvice}}`,
    variables: [
      'month', 
      'year', 
      'executiveSummary', 
      'businessClimateOverview', 
      'financialProjections', 
      'strategicOpportunities', 
      'potentialChallenges', 
      'teamManagementFocus', 
      'networkingOpportunities', 
      'keyDates', 
      'longTermAdvice'
    ],
    tags: ['monthly', 'business', 'report'],
    active: true
  },
  
  // Business Insight Templates
  {
    template_type: 'business_insight',
    template_content: `# Business Astrological Insight for {{businessName}}

## Business Personality
Based on your founding date of {{foundingDate}}, your business has the following astrological profile:
{{businessPersonality}}

## Current Transits Impact
{{transitsImpact}}

## Strategic Recommendations
{{strategicRecommendations}}

## Team Dynamics
{{teamDynamics}}

## Financial Outlook
{{financialOutlook}}

## Upcoming Opportunities
{{upcomingOpportunities}}

## Potential Challenges
{{potentialChallenges}}

## Optimal Timing for Key Initiatives
{{optimalTiming}}`,
    variables: [
      'businessName', 
      'foundingDate', 
      'businessPersonality', 
      'transitsImpact', 
      'strategicRecommendations', 
      'teamDynamics', 
      'financialOutlook', 
      'upcomingOpportunities', 
      'potentialChallenges', 
      'optimalTiming'
    ],
    tags: ['business', 'insight', 'analysis'],
    active: true
  },
  
  // Business Compatibility Analysis
  {
    template_type: 'business_compatibility',
    template_content: `# Business Compatibility Analysis

## Compatibility Overview
{{compatibilityOverview}}

## Synergy Points
{{synergyPoints}}

## Potential Friction Areas
{{frictionAreas}}

## Communication Dynamics
{{communicationDynamics}}

## Strategic Partnership Potential
{{partnershipPotential}}

## Financial Relationship
{{financialRelationship}}

## Long-term Outlook
{{longTermOutlook}}

## Recommendations for Successful Collaboration
{{recommendations}}`,
    variables: [
      'compatibilityOverview', 
      'synergyPoints', 
      'frictionAreas', 
      'communicationDynamics', 
      'partnershipPotential', 
      'financialRelationship', 
      'longTermOutlook', 
      'recommendations'
    ],
    tags: ['business', 'compatibility', 'partnership'],
    active: true
  },
  
  // Name Number Analysis
  {
    template_type: 'name_number_analysis',
    template_content: `# Numerological Analysis for "{{businessName}}"

## Core Number: {{coreNumber}}
{{coreNumberMeaning}}

## Expression Number: {{expressionNumber}}
{{expressionNumberMeaning}}

## Business Personality
{{businessPersonality}}

## Brand Identity Alignment
{{brandIdentityAlignment}}

## Customer Attraction Potential
{{customerAttractionPotential}}

## Growth and Success Indicators
{{growthIndicators}}

## Challenges to Address
{{challenges}}

## Recommendations
{{recommendations}}`,
    variables: [
      'businessName', 
      'coreNumber', 
      'coreNumberMeaning', 
      'expressionNumber', 
      'expressionNumberMeaning', 
      'businessPersonality', 
      'brandIdentityAlignment', 
      'customerAttractionPotential', 
      'growthIndicators', 
      'challenges', 
      'recommendations'
    ],
    tags: ['numerology', 'name analysis', 'business'],
    active: true
  }
];

/**
 * Template variable values for testing and development
 */
export const sampleVariableValues = {
  // Daily horoscope variables
  date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  dailyOverview: 'particularly favorable for strategic planning and team coordination.',
  businessOpportunities: 'highlighted in the areas of digital marketing and customer relationship management.',
  financialOutlook: 'stable with potential for unexpected gains through collaborative ventures.',
  teamDynamics: 'benefit from clear communication and defined roles.',
  strategicAdvice: 'focus on long-term goals while remaining flexible to immediate market changes.',
  networkingAdvice: 'strongest in the morning hours, particularly with industry peers in complementary sectors.',
  bestTimes: 'between 10 AM and 2 PM for negotiations; after 4 PM for creative brainstorming.',
  
  // Monthly report variables
  month: new Date().toLocaleDateString('en-US', { month: 'long' }),
  year: new Date().getFullYear().toString(),
  executiveSummary: 'A month of significant growth potential with emphasis on strategic partnerships and innovation.',
  businessClimateOverview: 'Favorable for expansion and new initiatives, particularly in technology and service sectors.',
  financialProjections: 'Steady growth with potential for increased revenue through diversified income streams.',
  strategicOpportunities: 'Expansion into adjacent markets, strategic acquisitions, and digital transformation initiatives.',
  potentialChallenges: 'Resource allocation, talent acquisition, and adapting to regulatory changes.',
  teamManagementFocus: 'Skills development, cross-functional collaboration, and leadership mentoring.',
  networkingOpportunities: 'Industry conferences, professional associations, and strategic alliance formation.',
  keyDates: '10th (product launch), 15th-17th (industry conference), 25th (quarterly planning).',
  longTermAdvice: 'Invest in sustainable practices, digital infrastructure, and building a resilient organizational culture.',
  
  // Business insight variables
  businessName: 'Acme Innovations',
  foundingDate: 'June 15, 2018',
  businessPersonality: 'Dynamic, innovative, and relationship-oriented with strong leadership qualities.',
  transitsImpact: 'Current planetary positions favor technological innovation and strategic partnerships.',
  strategicRecommendations: 'Focus on product development and customer experience enhancement.',
  upcomingOpportunities: 'International expansion, strategic acquisitions, and new market penetration.',
  optimalTiming: 'New initiatives between the 10th and 15th; negotiations after the 20th.',
  
  // Business compatibility variables
  compatibilityOverview: 'Strong overall compatibility with complementary strengths and shared values.',
  synergyPoints: 'Innovation capacity, market approach, and operational efficiency.',
  frictionAreas: 'Decision-making processes and risk tolerance levels.',
  communicationDynamics: 'Open and direct, with potential for occasional misalignment on priorities.',
  partnershipPotential: 'Excellent for joint ventures, especially in product development and market expansion.',
  financialRelationship: 'Mutually beneficial with fair value exchange and shared investment potential.',
  longTermOutlook: 'Sustainable growth through combined resources and complementary capabilities.',
  recommendations: 'Establish clear governance structures, regular strategic alignment sessions, and transparent communication channels.',
  
  // Name number analysis variables
  coreNumber: '7',
  coreNumberMeaning: 'Associated with analysis, research, and strategic thinking.',
  expressionNumber: '22',
  expressionNumberMeaning: 'A master number representing vision, practical idealism, and large-scale achievements.',
  brandIdentityAlignment: 'Strongly aligned with innovation, thought leadership, and premium positioning.',
  customerAttractionPotential: 'Particularly appealing to discerning clients who value expertise and quality.',
  growthIndicators: 'Strong potential for intellectual property development and thought leadership.',
  challenges: 'May need to balance analytical approach with emotional connection to customers.'
};
