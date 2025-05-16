import { Request, Response } from 'express';
import axios from 'axios';
import LoShuGridAnalysis from '../models/LoShuGridAnalysis';
import User from '../../user-management/models/user';
import dotenv from "dotenv";
dotenv.config();
const ASTRO_ENGINE_URL = process.env.Astro_Url;

export const createLoShuGridAnalysis = async (req: Request, res: Response) => {
  const { entity_type, entity_id, birth_date, gender, system_id } = req.body;

  if (!entity_type || !entity_id || !birth_date || !gender || !system_id) {
    return res.status(400).json({ error: 'All fields are required: entity_type, entity_id, birth_date, gender, system_id.' });
  }

  if (entity_type !== 'user') {
    return res.status(400).json({ error: 'Lo Shu Grid is only supported for users at the moment.' });
  }

  const user = await User.findOne({ where: { user_id: entity_id } });

  if (!user) {
    return res.status(404).json({ message: 'entity_id not found' });
  }
  const normalizedgender = gender.toLowerCase(); // Ensures ENUM match

  try {
    // Check if record already exists
    const existingAnalysis = await LoShuGridAnalysis.findOne({
      where: {
        entity_type,
        entity_id,
        birth_date,
        gender:normalizedgender,
      },
    });

    if (existingAnalysis) {
      return res.status(200).json({
        message: 'Lo Shu Grid analysis already exists for this entity and date.',
        data: existingAnalysis,
      });
    }

    // Proceed to calculate new analysis
    const loShuResponse = await axios.post(`${ASTRO_ENGINE_URL}/lo_shu_grid_numerology`, {
      birth_date,
      gender:normalizedgender,
    });

    const data = loShuResponse.data;

    if (!Array.isArray(data.present_numbers) || !Array.isArray(data.missing_numbers)) {
      return res.status(400).json({ error: 'Invalid data format from numerology service.' });
    }

    const gridNumbers = data.present_numbers
      .map((n: { number: string }) => parseInt(n.number, 10))
      .filter((num: number) => !isNaN(num));

    const missingNumbers = data.missing_numbers
      .map((n: string) => parseInt(n, 10))
      .filter((num: number) => !isNaN(num));

    const newRecord = await LoShuGridAnalysis.create({
      entity_type,
      entity_id,
      birth_date,
      gender:normalizedgender,
      grid_numbers: gridNumbers,
      grid_representation: data.grid,
      missing_numbers: missingNumbers,
      excess_numbers: {},
      diagonal_analysis: {
        present_arrows: data.present_arrows,
      },
      element_balance: {},
      personality_assessment: data.interpretations?.primary_number || '',
      strength_assessment: data.interpretations?.destiny_number || '',
      recommendation: data.interpretations?.missing_numbers?.interpretation || '',
      numerology_system_id: system_id,
    });

    return res.status(201).json({
      message: 'Lo Shu Grid analysis created successfully.',
      data: newRecord,
    });

  } catch (error: any) {
    console.error('Error creating analysis:', error);
    return res.status(500).json({ success: false, message: 'Failed to create analysis', error: error.message });
  }
};


export const getAllLoShuGridAnalysisByEntityId = async (req: Request, res: Response) => {
  const { entity_type, entity_id } = req.params;

  if (!entity_type || !entity_id) {
    return res.status(400).json({
      error: 'Both entity_type and entity_id are required in the URL parameters.',
    });
  }

  try {
    const analyses = await LoShuGridAnalysis.findAll({
      where: {
        entity_type,
        entity_id,
      },
      order: [['createdAt', 'DESC']], // optional: to get the latest first
    });

    if (analyses.length === 0) {
      return res.status(404).json({
        message: 'No Lo Shu Grid analysis records found for the provided entity.',
      });
    }

    return res.status(200).json({
      message: 'Lo Shu Grid analysis records fetched successfully.',
      data: analyses,
    });
  } catch (error: any) {
    console.error('Error fetching analyses:', error);
    return res.status(500).json({
      message: 'Server error while retrieving Lo Shu Grid analysis records.',
      error: error.message,
    });
  }
};