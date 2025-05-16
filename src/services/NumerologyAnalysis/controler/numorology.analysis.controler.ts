// import { Request, Response } from 'express';
// import NumerologyAnalysis from '../models/astrology.numerology_analyses'; // Import model
// import User from '../../user-management/models/user';
// import BusinessPartner from '../../business/models/business_partners';
// import BusinessProfile from '../../business/models/businessProfile';

// // Pythagorean Numerology Calculation
// const calculatePythagorean = (inputText: string) => {
//   const pythagoreanMapping: Record<string, number> = {
//     A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
//     J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
//     S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
//   };
  
//   // Normalize input text (convert to uppercase and remove non-alphabetic characters)
//   const cleanedText = inputText.toUpperCase().replace(/[^A-Z]/g, '');
  
//   // Calculate compound number
//   let compoundNumber = 0;
//   for (let i = 0; i < cleanedText.length; i++) {
//     compoundNumber += pythagoreanMapping[cleanedText[i]] || 0;
//   }

//   // Reduce compound number to a single digit root number (unless it's a master number)
//   let rootNumber = compoundNumber;
//   while (rootNumber > 9 && rootNumber !== 11 && rootNumber !== 22 && rootNumber !== 33) {
//     rootNumber = rootNumber.toString().split('').reduce((sum, num) => sum + parseInt(num), 0);
//   }

//   return {
//     compoundNumber,
//     rootNumber,
//     isMasterNumber: rootNumber === 11 || rootNumber === 22 || rootNumber === 33,
//     calculationDetails: { system: 'Pythagorean', compoundNumber, rootNumber }
//   };
// };

// // Chaldean Numerology Calculation
// const calculateChaldean = (inputText: string) => {
//   const chaldeanMapping: Record<string, number> = {
//     A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1,
//     J: 1, K: 2, L: 3, M: 4, N: 5, O: 7, P: 8, Q: 1, R: 2,
//     S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7,
//   };
  
//   // Normalize input text (convert to uppercase and remove non-alphabetic characters)
//   const cleanedText = inputText.toUpperCase().replace(/[^A-Z]/g, '');
  
//   // Calculate compound number
//   let compoundNumber = 0;
//   for (let i = 0; i < cleanedText.length; i++) {
//     compoundNumber += chaldeanMapping[cleanedText[i]] || 0;
//   }

//   // Reduce compound number to a single digit root number (unless it's a master number)
//   let rootNumber = compoundNumber;
//   while (rootNumber > 9 && rootNumber !== 11 && rootNumber !== 22 && rootNumber !== 33) {
//     rootNumber = rootNumber.toString().split('').reduce((sum, num) => sum + parseInt(num), 0);
//   }

//   return {
//     compoundNumber,
//     rootNumber,
//     isMasterNumber: rootNumber === 11 || rootNumber === 22 || rootNumber === 33,
//     calculationDetails: { system: 'Chaldean', compoundNumber, rootNumber }
//   };
// };

// // Create Numerology Analysis
// export const createNumerologyAnalysis = async (req: Request, res: Response) => {
//   try {
//     const { entity_type, input_text, numerology_system_id, analysis_name, input_date, user_id, business_id, partner_id } = req.body;

//     // Validation: Required fields
//     if (!entity_type || !input_text || !numerology_system_id || !analysis_name) {
//       return res.status(400).json({ message: 'entity_type, input_text, numerology_system_id, and analysis_name are required.' });
//     }

//     // Validate entity type and fetch corresponding entity (User, Business, Partner)
//     let entity = null;
//     if (entity_type === 'USER' && user_id) {
//       entity = await User.findByPk(user_id);
//       if (!entity) return res.status(404).json({ message: 'User not found' });
//     } else if (entity_type === 'BUSINESS' && business_id) {
//       entity = await BusinessProfile.findByPk(business_id);
//       if (!entity) return res.status(404).json({ message: 'Business not found' });
//     } else if (entity_type === 'PARTNER' && partner_id) {
//       entity = await BusinessPartner.findByPk(partner_id);
//       if (!entity) return res.status(404).json({ message: 'Partner not found' });
//     } else {
//       return res.status(400).json({ message: 'Invalid entity type or missing entity ID.' });
//     }

//     // Logic: Apply the chosen numerology system
//     let numerologyResult;
//     if (numerology_system_id === 1) {  // Assuming 1 is for Pythagorean system
//       numerologyResult = calculatePythagorean(input_text);
//     } else if (numerology_system_id === 2) {  // Assuming 2 is for Chaldean system
//       numerologyResult = calculateChaldean(input_text);
//     } else {
//       return res.status(400).json({ message: 'Invalid numerology system ID' });
//     }

//     // Prepare data for storage
//     const analysisData = {
//       entity_type,
//       user_id: user_id || null,
//       business_id: business_id || null,
//       partner_id: partner_id || null,
//       analysis_name,
//       input_text,
//       input_date: input_date || null,
//       numerology_system_id,
//       compound_number: numerologyResult.compoundNumber,
//       root_number: numerologyResult.rootNumber,
//       is_master_number: numerologyResult.isMasterNumber,
//       calculation_details: numerologyResult.calculationDetails,
//       lo_shu_grid: undefined,
//       missing_numbers: undefined,
//       planet_correlations: undefined,
//       full_analysis: numerologyResult,
//       recommendations: undefined,
//     };

//     // Store analysis in the database
//     const newAnalysis = await NumerologyAnalysis.create(analysisData);

//     return res.status(201).json({
//       message: 'Numerology analysis created successfully',
//       analysis: newAnalysis
//     });

//   } catch (error) {
//     console.error('Error creating numerology analysis:', error);
//     return res.status(500).json({ message: 'An error occurred while processing the numerology analysis', error });
//   }
// };




import { Request, Response } from 'express';
import NumerologyAnalysis from '../models/astrology.numerology_analyses';
import axios from 'axios';
import NumerologySystem from '../models/astrology.numerology_systems';
import dotenv from "dotenv";
dotenv.config();
const ASTRO_ENGINE_URL = process.env.Astro_Url;


export const createAnalysis = async (req: Request, res: Response) => {
  const { entity_type, entity_id, name, tagline, founding_date, system_id } = req.body;

  // Step 1: Validate required fields
  if (!entity_type || !entity_id || !name || !system_id) {
    return res.status(400).json({ success: false, message: 'Missing required fields: system_id, entity_type, entity_id, or name' });
  }
  const normalizedEntityType = entity_type.toUpperCase(); // Ensures ENUM match

  // Step 2: Validate numerology system
  const system = await NumerologySystem.findByPk(system_id);
  if (!system) {
    return res.status(400).json({ success: false, message: 'Invalid system_id' });
  }

  try {
    const analysis_name = tagline ? `${name} - ${tagline}` : name;
    const input_text = [name, tagline, founding_date].filter(Boolean).join(' | ');
    const input_date = founding_date ? new Date(founding_date) : undefined;

    // Step 3: Construct payload   entity_type: 'USER' | 'BUSINESS' | 'PARTNER';

    let payload: any = { name };
    if (normalizedEntityType === 'BUSINESS') {
      if (tagline) payload.tagline = tagline;
      if (founding_date) payload.date = founding_date;
    } else if (normalizedEntityType === 'USER') {
      if (founding_date) payload.date = founding_date;
    }

    // Step 4: Check for existing analysis
    const existingAnalysis = await NumerologyAnalysis.findOne({
      where: { analysis_name }
    });
    if (existingAnalysis) {
      return res.status(200).json({ success: true, data: existingAnalysis });
    }

    // Step 5: Call Astro Ratan API
    const numerologyResponse = await axios.post(`${ASTRO_ENGINE_URL}/chaldean_numerology`, payload);
    const data = numerologyResponse.data;

    // Step 6: Extract and normalize response
    const compound_number = data.compound_number || data.business_tagline?.compound_number || null;
    const root_number = data.root_number || data.business_tagline?.root_number || null;
    const is_master_number = [11, 22, 33].includes(root_number); // Optional logic
    const lo_shu_grid = data.lo_shu_grid || null;
    const missing_numbers = data.missing_numbers || null;
    const planet_correlations = data.ruling_planet || null;

    const full_analysis = JSON.stringify({
      astrological_insight: data.astrological_insight || null,
      personal_interpretation: data.personal_interpretation || null,
      business_interpretation: data.business_tagline?.business_interpretation || null,
      compatibility: data.business_tagline?.compatibility_with_personal || data.founding_date?.compatibility || null,
      sun_sign: data.founding_date?.sun_sign || null,
      sun_sign_influence: data.founding_date?.sun_sign_influence || null
    });

    const recommendations = JSON.stringify(
        data.business_tagline?.recommendations || data.recommendations || {}
    );
    // Step 7: Save analysis
    const analysis = await NumerologyAnalysis.create({
      entity_type: normalizedEntityType,
      entity_id,
      analysis_name,
      input_text,
      input_date,
      numerology_system_id: system_id,
      compound_number,
      root_number,
      is_master_number,
      calculation_details: system.calculation_rules,
      full_analysis: JSON.parse(full_analysis),
      lo_shu_grid,
      missing_numbers,
      planet_correlations,
      recommendations: JSON.parse(recommendations),
    });

    return res.status(201).json({ success: true, data: analysis });

  } catch (error: any) {
    console.error('Error creating analysis:', error);
    if (error.errors) {
      // Log specific validation errors if any
      error.errors.forEach((e: any) => console.error(e.message));
    }
    return res.status(500).json({ success: false, message: 'Failed to create analysis', error: error.message });
  }
  
};

  


export const getAnalysisById = async (req: Request, res: Response) => {
  try {
    const { analysis_id } = req.params;
    const analysis = await NumerologyAnalysis.findByPk(analysis_id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    return res.status(200).json({ success: true, data: analysis });
  } catch (error: any) {
    console.error('Error fetching analysis:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch analysis', error: error.message });
  }
};

export const getAllAnalysesForEntity = async (req: Request, res: Response) => {
  try {
    const { entity_type, entity_id } = req.query;

    const analyses = await NumerologyAnalysis.findAll({
      where: {
        entity_type: entity_type as 'user' | 'partner' | 'business',
        entity_id: entity_id as string,
      },
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({ success: true, data: analyses });
  } catch (error: any) {
    console.error('Error fetching analyses:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch analyses', error: error.message });
  }
};



export const deleteAnalysis = async (req: Request, res: Response) => {
  try {
    const { analysis_id } = req.params;

    const deleted = await NumerologyAnalysis.destroy({
      where: { analysis_id },
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    return res.status(200).json({ success: true, message: 'Analysis deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting analysis:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete analysis', error: error.message });
  }
};
