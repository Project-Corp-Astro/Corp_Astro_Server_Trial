import { Request, Response } from 'express';
import User from '../../user-management/models/user';
import DashaModel from '../mongo-models/DashaChart';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

//astro engine url
const ASTRO_ENGINE_URL = process.env.Astro_Url;

// Define types for better type safety
interface DashaPeriod {
  planet: string;
  start_date: Date;
  end_date: Date;
  duration_years?: number;
  duration_days?: number;
  antardashas?: DashaPeriod[];
  pratyantardashas?: DashaPeriod[];
  sookshma_dashas?: DashaPeriod[];
}

interface DashaResponse {
  mahadashas: DashaPeriod[];
}

export const calculateVimshottariSookshamaDasha = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Fetch user details
    const userDetails = await User.findOne({ where: { user_id: id } });

    if (!userDetails) {
      return res.status(404).json({ message: 'User not found' });
    }
    //check if the user already has a dasha chart
    const existingDasha = await DashaModel.findOne({ user_id: id });
    if (existingDasha) {
      return res.status(200).json({
        message: 'Dasha chart already exists for this user',
        data: existingDasha
      });
    }
    const { full_name, date_of_birth, time_of_birth, latitude, longitude, timezone_offset } = userDetails;

    // Sending request to Dasha API
    const response = await axios.post<DashaResponse>(
      `${ASTRO_ENGINE_URL}/calculate_vimshottari_Sookshama`,
      {
        user_name: full_name,
        birth_date: date_of_birth,
        birth_time: time_of_birth,
        latitude: Number(latitude),
        longitude: Number(longitude),
        timezone_offset
      }
    );

    // Log full response for debugging
    console.log('Dasha API Response:', response.data);

    // Check for valid mahadashas
    if (!response.data || !Array.isArray(response.data.mahadashas)) {
      console.error('Invalid response data:', response.data);
      return res.status(400).json({
        message: 'Dasha calculation service returned invalid data',
        error: 'mahadashas is missing or invalid',
        response: response.data // Include the response for debugging purposes
      });
    }

    // Iterate over mahadashas and build the necessary data
    const dashaRecord = new DashaModel({
      user_id: id,
      system_type: 'VIMSHOTTARI',
      mahadashas: response.data.mahadashas.map(dasha => ({
        planet: dasha.planet,
        start_date: new Date(dasha.start_date),
        end_date: new Date(dasha.end_date),
        duration_years: dasha.duration_years,
        antardashas: dasha.antardashas?.map(antar => ({
          planet: antar.planet,
          start_date: new Date(antar.start_date),
          end_date: new Date(antar.end_date),
          duration_years: antar.duration_years,
          pratyantardashas: antar.pratyantardashas?.map(pratyantar => ({
            planet: pratyantar.planet,
            start_date: new Date(pratyantar.start_date),
            end_date: new Date(pratyantar.end_date),
            sookshma_dashas: pratyantar.sookshma_dashas?.map(sookshma => ({
              planet: sookshma.planet,
              start_date: new Date(sookshma.start_date),
              end_date: new Date(sookshma.end_date),
              duration_days: sookshma.duration_days
            }))
          }))
        }))
      }))
    });

    // Save to MongoDB
    await dashaRecord.save();

    return res.status(200).json({
      message: 'Vimshottari Sookshama Dasha calculated and saved successfully',
      data: dashaRecord
    });

  } catch (error) {
    console.error('Error in calculating Vimshottari Sookshama Dasha:', error);

    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        message: 'Error calling Dasha calculation service',
        error: error.response?.data || error.message
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};



// Fetch all Dasha records from the database
export const fetchAllDashaCharts = async (req: Request, res: Response) => {
  try {
    const dashaCharts = await DashaModel.find(); // Fetch all records

    if (!dashaCharts || dashaCharts.length === 0) {
      return res.status(404).json({ message: 'No Dasha charts found' });
    }

    return res.status(200).json({
      message: 'All Dasha charts fetched successfully',
      data: dashaCharts
    });
  } catch (error) {
    console.error('Error fetching Dasha charts:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

// Fetch Dasha chart by specific user ID
export const fetchDashaByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const dashaChart = await DashaModel.findOne({ user_id: userId });

    if (!dashaChart) {
      return res.status(404).json({ message: 'Dasha chart not found for this user' });
    }

    return res.status(200).json({
      message: `Dasha chart for user ${userId} fetched successfully`,
      data: dashaChart
    });
  } catch (error) {
    console.error('Error fetching Dasha chart by userId:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

// Fetch Dasha charts filtered by planet
export const fetchDashaByPlanet = async (req: Request, res: Response) => {
  const { planet } = req.query; // Get planet name from query parameters (e.g., ?planet=Saturn)

  try {
    const dashaCharts = await DashaModel.find({
      'mahadashas.planet': planet // Using dot notation to search inside embedded arrays
    });

    if (!dashaCharts || dashaCharts.length === 0) {
      return res.status(404).json({ message: `No Dasha charts found for planet: ${planet}` });
    }

    return res.status(200).json({
      message: `Dasha charts for planet ${planet} fetched successfully`,
      data: dashaCharts
    });
  } catch (error) {
    console.error('Error fetching Dasha charts by planet:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

// Fetch specific Dasha periods (Mahadasha, Antardasha, etc.) for a user
export const fetchDashaPeriodsByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userDasha = await DashaModel.findOne({ user_id: userId });

    if (!userDasha) {
      return res.status(404).json({ message: 'Dasha chart not found for this user' });
    }

    return res.status(200).json({
      message: `Dasha periods for user ${userId} fetched successfully`,
      data: userDasha.mahadashas // Changed from mahasdashes to mahadashas
    });
  } catch (error) {
    console.error('Error fetching Dasha periods for user:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};


//if they have a dasha chart then fetch the pratyantardasha or else fetch the mahadasha or antardasha or sookshma dasha 
  //check and give take the input from the user which one they want to fetch  write a function for this 
  export const dashaTypefetch = async (req: Request, res: Response) => {
  const { userId, dashaType } = req.params;

  try {
    //check if the user has a dasha chart 
    const userDasha = await DashaModel.findOne({ user_id: userId });
    //if the user has a dasha chart then fetch the pratyantardasha or else fetch the mahadasha or antardasha or sookshma dasha 
    if (userDasha) {
      //check the dasha type    
      if (dashaType === 'pratyantardasha') {
        return res.status(200).json({
          message: `Pratyantardasha for user ${userId} fetched successfully`,
          data: userDasha.mahadashas.flatMap(maha => 
            maha.antardashas?.flatMap(antar => 
              antar.pratyantardashas || []
            ) || []
          ) 
        });
      }
      else if (dashaType === 'mahadasha') {
        return res.status(200).json({
          message: `Mahadasha for user ${userId} fetched successfully`,
          data: userDasha.mahadashas
        });
      }
      else if (dashaType === 'antardasha') {  
        return res.status(200).json({
          message: `Antardasha for user ${userId} fetched successfully`,
          data: userDasha.mahadashas.flatMap(maha => 
            maha.antardashas || []
          )
        });
      }
      else if (dashaType === 'sookshma_dasha') {
        return res.status(200).json({
          message: `Sookshma dasha for user ${userId} fetched successfully`,
          data: userDasha.mahadashas.flatMap(maha => 
            maha.antardashas?.flatMap(antar => 
              antar.pratyantardashas?.flatMap(pratyantar => 
                pratyantar.sookshma_dashas || []
              ) || []
            ) || []
          )
        });
      }
    }
    else {
      return res.status(404).json({ message: 'Dasha chart not found for this user' });
    }
  } catch (error) {
    console.error('Error fetching Dasha periods for user:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};  


export const updateDashaChart = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userDetails = await User.findOne({ where: { user_id: userId } });

    if (!userDetails) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingDasha = await DashaModel.findOne({ user_id: userId });
    if (!existingDasha) {
      return res.status(404).json({ message: 'Dasha chart not found for this user' });
    }

    const { full_name, date_of_birth, time_of_birth, latitude, longitude, timezone_offset } = userDetails;

    // Fetch new Dasha data
    const response = await axios.post<DashaResponse>(
      `${ASTRO_ENGINE_URL}/calculate_vimshottari_Sookshama`,
      {
        user_name: full_name,
        birth_date: date_of_birth,
        birth_time: time_of_birth,
        latitude: Number(latitude),
        longitude: Number(longitude),
        timezone_offset
      }
    );

    if (!response.data || !Array.isArray(response.data.mahadashas)) {
      console.error('Invalid response data from Dasha API:', response.data);
      return res.status(400).json({
        message: 'Dasha calculation service returned invalid data',
        error: 'mahadashas is missing or invalid'
      });
    }

    // Construct updated data
    const updatedData = {
      system_type: 'VIMSHOTTARI',
      mahadashas: response.data.mahadashas.map(dasha => ({
        planet: dasha.planet,
        start_date: new Date(dasha.start_date),
        end_date: new Date(dasha.end_date),
        duration_years: dasha.duration_years,
        antardashas: dasha.antardashas?.map(antar => ({
          planet: antar.planet,
          start_date: new Date(antar.start_date),
          end_date: new Date(antar.end_date),
          duration_years: antar.duration_years,
          pratyantardashas: antar.pratyantardashas?.map(pratyantar => ({
            planet: pratyantar.planet,
            start_date: new Date(pratyantar.start_date),
            end_date: new Date(pratyantar.end_date),
            sookshma_dashas: pratyantar.sookshma_dashas?.map(sookshma => ({
              planet: sookshma.planet,
              start_date: new Date(sookshma.start_date),
              end_date: new Date(sookshma.end_date),
              duration_days: sookshma.duration_days
            }))
          }))
        }))
      }))
    };

    const updatedDasha = await DashaModel.findByIdAndUpdate(existingDasha._id, updatedData, { new: true });

    return res.status(200).json({
      message: 'Dasha chart updated successfully',
      data: updatedDasha
    });

  } catch (error) {
    console.error('Error updating Dasha chart:', error);

    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        message: 'Error calling Dasha calculation service',
        error: error.response?.data || error.message
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};
