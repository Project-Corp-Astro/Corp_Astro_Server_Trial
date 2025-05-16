import { Request, Response } from 'express';
import UserProgressedChart from '../models/progressive_charts';
import { redisClient } from '../../../config/redis.config';  // Assuming redis.config.js is correctly set up
import User from '../../user-management/models/user';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

//astro engine url
const ASTRO_ENGINE_URL = process.env.Astro_Url;
//write a function to calculate the age of the user
const calculateAge = (date_of_birth: string | Date): number => {
  const today = new Date();
  const birthDate = new Date(date_of_birth);
  const age = today.getFullYear() - birthDate.getFullYear();
  return age;
}

// services/chartService.ts

export const generateProgressedChart = async (user_id: string) => {

  // const existingChart = await UserProgressedChart.findOne({ where: { user_id } });

  // if (existingChart) return existingChart;

  const user = await User.findByPk(user_id);
  if (!user) throw new Error('User not found');

  const age = calculateAge(user.date_of_birth);

  const chartData = await axios.post(`${ASTRO_ENGINE_URL}/progressed`, {
    birth_date: user.date_of_birth,
    birth_time: user.time_of_birth,
    latitude: user.latitude,
    longitude: user.longitude,
    tz_offset: user.timezone_offset,
    age
  });

  const chart = await UserProgressedChart.create({
    user_id,
    house_cusps: chartData.data.house_cusps,
    interpretations: chartData.data.interpretations,
    progressed_ascendant: chartData.data.progressed_ascendant,
    progressed_midheaven: chartData.data.progressed_midheaven,
    progressed_planets: chartData.data.progressed_planets,
  });

  await redisClient.set(`userProgressedChart:${user_id}`, JSON.stringify(chart));

  return chart;
};

// // Create a new user progressed chart
// export const createProgressedChart = async (req: Request, res: Response) => {
//   try {
//     const { user_id } = req.params;
//     //check if user_id is provided
//     if (!user_id) {
//       return res.status(400).json({
//         message: 'User ID is required',
//       });
//     }
//     //check if existing chart is present in the database
//     const existingChart = await UserProgressedChart.findOne({ where: { user_id } });
//     if (existingChart) {
//       return res.status(200).json({
//         message: 'Progressed chart already exists',
//         chart: existingChart,
//       });
//     }   
//     //check if user_id is valid
//     const user = await User.findByPk(user_id);
//     if (!user) {
//       return res.status(404).json({
//         message: 'User not found',
//       });
//     }
//     //calculate the age of the user
//     const age = calculateAge(user.date_of_birth);
//     // Create the chart in the database
//     //call the astro api to get the progressed chart
//     const chartData = await axios.post(`${ASTRO_ENGINE_URL}/progressed`, {
//         birth_date: user.date_of_birth,
//         birth_time: user.time_of_birth, 
//         latitude: user.latitude,
//         longitude: user.longitude,
//         tz_offset: user.timezone_offset,
//         age: age
//     });

//     const chart = await UserProgressedChart.create({
//       user_id: user_id,
//       house_cusps: chartData.data.house_cusps,
//       interpretations: chartData.data.interpretations,
//       progressed_ascendant: chartData.data.progressed_ascendant,
//       progressed_midheaven: chartData.data.progressed_midheaven,
//       progressed_planets: chartData.data.progressed_planets,
//     }); 
//     // Cache the created chart in Redis
//     await redisClient.set(`userProgressedChart:${chart.user_id}`, JSON.stringify(chart));

//     return res.status(201).json({
//       message: 'Progressed chart created successfully',
//       chart,
//     });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(500).json({
//       message: 'Error creating progressed chart',
//       error: error.message,
//     });
//   }
// };


export const createProgressedChart = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    if (!user_id) return res.status(400).json({ message: 'User ID is required' });

    const chart = await generateProgressedChart(user_id);

    return res.status(201).json({
      message: 'Progressed chart created successfully',
      chart,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: 'Error creating progressed chart',
      error: error.message,
    });
  }
};
// Get user progressed chart (with Redis cache)
export const getProgressedChart = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    // Check Redis cache for the chart
    const cachedChart = await redisClient.get(`userProgressedChart:${user_id}`);
    if (cachedChart) {
      return res.status(200).json({
        message: 'Chart retrieved from cache',
        chart: JSON.parse(cachedChart),
      });
    }

    // Fetch the chart from the database if not cached
    const chart = await UserProgressedChart.findOne({ where: { user_id } });

    if (!chart) {
      const ChartData = await generateProgressedChart(user_id); // ✅ create if not found
      return res.status(201).json({
        message: 'Chart was missing, newly created',
        ChartData,
      });
    }

    // Cache the retrieved chart in Redis for future access
    await redisClient.set(`userProgressedChart:${user_id}`, JSON.stringify(chart));
      
    return res.status(200).json({
      message: 'Chart retrieved from database',
      chart,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: 'Error retrieving progressed chart',
      error: error.message,
    });
  }
};

// Update user progressed chart
export const updateProgressedChartByUserId = async (user_id: string) => {
    try {
      if (!user_id) {
        throw new Error('User ID is required');
      }
  
      const user = await User.findByPk(user_id);
      if (!user) {
        throw new Error('User not found');
      }
  
      const chart = await UserProgressedChart.findOne({ where: { user_id } });
      if (!chart) {
        return;
      }

  
      const age = calculateAge(user.date_of_birth);
  
      const chartData = await axios.post(`${ASTRO_ENGINE_URL}/progressed`, {
        birth_date: user.date_of_birth,
        birth_time: user.time_of_birth,
        latitude: user.latitude,
        longitude: user.longitude,
        tz_offset: user.timezone_offset,
        age: age
      });
  
      chart.house_cusps = chartData.data.house_cusps;
      chart.interpretations = chartData.data.interpretations;
      chart.progressed_ascendant = chartData.data.progressed_ascendant;
      chart.progressed_midheaven = chartData.data.progressed_midheaven;
      chart.progressed_planets = chartData.data.progressed_planets;
       const updatedChart = await chart.save();
  
       await redisClient.set(`userProgressedChart:${user_id}`, JSON.stringify(updatedChart));
  
      return {
        message: 'Progressed chart updated successfully',
        chart,
      };
    } catch (error: any) {
      console.error('updateProgressedChartByUserId error:', error);
      throw new Error(error.message || 'Error updating progressed chart');
    }
  };
  

// Delete user progressed chart
export const deleteProgressedChart = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    // Fetch the chart from the database
    const chart = await UserProgressedChart.findOne({ where: { user_id } });

    if (!chart) {
      return res.status(404).json({
        message: 'Chart not found',
      });
    }

    // Delete the chart from the database
    await chart.destroy();

    // Delete the cached chart from Redis
    await redisClient.del(`userProgressedChart:${user_id}`);

    return res.status(200).json({
      message: 'Progressed chart deleted successfully',
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: 'Error deleting progressed chart',
      error: error.message,
    });
  }
};
