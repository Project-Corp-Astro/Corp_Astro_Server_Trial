import { Request, Response } from 'express';
import NumerologySystem from '../models/astrology.numerology_systems'; // Import NumerologySystem model

// Create a new numerology system
export const createNumerologySystem = async (req: Request, res: Response) => {
  try {
    
    const { system_name, description, base_numbers, calculation_rules } = req.body;
   
    // Validation: Ensure required fields are present
    if (!system_name || !base_numbers || !calculation_rules) {
      return res.status(400).json({ message: 'System name, base numbers, and calculation rules are required.' });
    }

    // Create the numerology system in the database
    const newNumerologySystem = await NumerologySystem.create({
      system_name,
      description,
      base_numbers,
      calculation_rules,
    });

    return res.status(201).json({
      message: 'Numerology system created successfully',
      numerologySystem: newNumerologySystem,
    });
  } catch (error) {
    console.error('Error creating numerology system:', error);
    return res.status(500).json({ message: 'An error occurred while creating the numerology system', error });
  }
};

// Get all numerology systems
export const getAllNumerologySystems = async (req: Request, res: Response) => {
  try {
    const numerologySystems = await NumerologySystem.findAll();

    return res.status(200).json({
      numerologySystems,
    });
  } catch (error) {
    console.error('Error fetching numerology systems:', error);
    return res.status(500).json({ message: 'An error occurred while fetching the numerology systems', error });
  }
};

// Get a numerology system by ID
export const getNumerologySystemById = async (req: Request, res: Response) => {
  try {
    const { system_id } = req.params;

    const numerologySystem = await NumerologySystem.findByPk(system_id);

    if (!numerologySystem) {
      return res.status(404).json({ message: 'Numerology system not found' });
    }

    return res.status(200).json({
      numerologySystem,
    });
  } catch (error) {
    console.error('Error fetching numerology system by ID:', error);
    return res.status(500).json({ message: 'An error occurred while fetching the numerology system', error });
  }
};

// Update a numerology system
export const updateNumerologySystem = async (req: Request, res: Response) => {
  try {
    const { system_id } = req.params;
    const { system_name, description, base_numbers, calculation_rules } = req.body;

    const numerologySystem = await NumerologySystem.findByPk(system_id);

    if (!numerologySystem) {
      return res.status(404).json({ message: 'Numerology system not found' });
    }

    // Update the system
    numerologySystem.system_name = system_name || numerologySystem.system_name;
    numerologySystem.description = description || numerologySystem.description;
    numerologySystem.base_numbers = base_numbers || numerologySystem.base_numbers;
    numerologySystem.calculation_rules = calculation_rules || numerologySystem.calculation_rules;

    await numerologySystem.save();

    return res.status(200).json({
      message: 'Numerology system updated successfully',
      numerologySystem,
    });
  } catch (error) {
    console.error('Error updating numerology system:', error);
    return res.status(500).json({ message: 'An error occurred while updating the numerology system', error });
  }
};

// Delete a numerology system
export const deleteNumerologySystem = async (req: Request, res: Response) => {
  try {
    const { system_id } = req.params;

    const numerologySystem = await NumerologySystem.findByPk(system_id);

    if (!numerologySystem) {
      return res.status(404).json({ message: 'Numerology system not found' });
    }

    await numerologySystem.destroy();

    return res.status(200).json({
      message: 'Numerology system deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting numerology system:', error);
    return res.status(500).json({ message: 'An error occurred while deleting the numerology system', error });
  }
};
