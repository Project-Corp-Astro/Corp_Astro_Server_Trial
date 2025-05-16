// import { Request, Response } from 'express';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import { ValidationError } from 'sequelize';
// import ChartType from '../../models/ChartType';
// import User from '../../../user-management/models/user';
// import DerivedChart from '../../models/DerivedChartModel';
// import DerivedChartPlanet, { Planet } from '../../models/derived_chart_planet';
// import dotenv from 'dotenv';
// dotenv.config();

// const ASTRO_ENGINE_URL = process.env.Astro_Url;

// // Assuming Gender enum is defined in user.ts
// enum Gender {
//   Male = 'male',
//   Female = 'female',
//   Unknown = 'unknown',
// }

// // Helper function to transform chart and planets into desired response format
// const transformResponse = (chart: any, planets: any[], user: any) => {
//   const chartData = chart.chart_data || {};

//   // Build planets object
//   const planetaryPositions = planets.reduce((acc: any, planet: any) => {
//     acc[planet.planet] = {
//       house: planet.house || null,
//       retrograde: planet.is_retrograde || false,
//       sign: planet.sign || '',
//     };
//     return acc;
//   }, {});

//   return {
//     arudha_lagna: chart.ascendant_sign || '',
//     metadata: {
//       ayanamsa: chartData.metadata?.ayanamsa || 'Lahiri',
//       calculation_time: chartData.metadata?.calculation_time || new Date().toISOString(),
//       input: chartData.metadata?.input || {},
//     },
//     planets: planetaryPositions,
//     user_name: user.full_name || 'Unknown',
//   };
// };

// async function validateRequest(id: string, res: Response): Promise<User | null> {
//   if (!id) {
//     res.status(400).json({ message: 'Missing userId' });
//     return null;
//   }
//   const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
//   if (!uuidRegex.test(id)) {
//     res.status(400).json({ message: 'Invalid user ID format' });
//     return null;
//   }
//   const user = await User.findOne({ where: { user_id: id } });
//   if (!user) {
//     res.status(404).json({ message: `No user found for userId: ${id}` });
//     return null;
//   }
//   return user;
// }

// function buildApiPayload(user: User): any {
//   return {
//     chart_type: 'ARUDHA',
//     birth_date: user.date_of_birth,
//     birth_time: user.time_of_birth,
//     latitude: parseFloat(user.latitude?.toString() || '0'),
//     longitude: parseFloat(user.longitude?.toString() || '0'),
//     timezone_offset: user.timezone_offset || 0,
//     timezone: user.birth_timezone || 'Asia/Kolkata',
//     ayanamsa: 'lahiri',
//     house_system: 'arudha',
//     zodiac_system: 'sidereal',
//     gender: user.gender || Gender.Unknown,
//     user_name: user.full_name || 'Unknown',
//     place_of_birth: user.place_of_birth || 'Unknown',
//     calculation_precision: 'high',
//   };
// }

// function hasUserDetailsChanged(user: User, storedParams: any): boolean {
//   const userLatitude = parseFloat(user.latitude?.toString() || '0');
//   const userLongitude = parseFloat(user.longitude?.toString() || '0');
//   const storedLatitude = parseFloat(storedParams?.latitude?.toString() || '0');
//   const storedLongitude = parseFloat(storedParams?.longitude?.toString() || '0');

//   return (
//     user.date_of_birth !== (storedParams?.birth_date || '') ||
//     user.time_of_birth !== (storedParams?.birth_time || '') ||
//     Math.abs(userLatitude - storedLatitude) > 0.0001 ||
//     Math.abs(userLongitude - storedLongitude) > 0.0001 ||
//     (user.timezone_offset || 0) !== (storedParams?.timezone_offset || 0)
//   );
// }

// async function callAstroApi(apiEndpoint: string, payload: any): Promise<any> {
//   try {
//     const fullUrl = `${ASTRO_ENGINE_URL}${apiEndpoint}`;
//     const response = await axios.post(fullUrl, payload, { timeout: 10000 });
//     console.log('Calling Astro API:', fullUrl);
//     return response.data;
//   } catch (error) {
//     console.error('Error in callAstroApi:', error);
//     if (axios.isAxiosError(error) && error.response) {
//       throw new Error(`Failed to call Astro API: ${error.response.data.error || error.message}`);
//     }
//     throw new Error('Failed to call Astro API');
//   }
// }

// async function saveOrUpdateChartData(
//   derivedData: any,
//   chartType: any,
//   user: User,
//   apiEndpoint: string,
//   existingChart?: any
// ): Promise<string> {
//   const derivedChartId = existingChart?.derived_chart_id || uuidv4();

//   const chartData = {
//     arudha_lagna: derivedData.arudha_lagna || '',
//     planets: derivedData.planets || {},
//     metadata: {
//       ayanamsa: derivedData.metadata?.ayanamsa || 'Lahiri',
//       calculation_time: derivedData.metadata?.calculation_time || new Date().toISOString(),
//       input: derivedData.metadata?.input || {},
//       chart_type: derivedData.metadata?.chart_type || `${chartType.chart_name} (${chartType.chart_code})`,
//       house_system: derivedData.metadata?.house_system || 'Arudha',
//     },
//   };

//   const calculationParameters = {
//     ayanamsa: 'lahiri',
//     house_system: 'arudha',
//     zodiac_system: 'sidereal',
//     birth_date: user.date_of_birth,
//     birth_time: user.time_of_birth,
//     latitude: parseFloat(user.latitude?.toString() || '0'),
//     longitude: parseFloat(user.longitude?.toString() || '0'),
//     timezone_offset: user.timezone_offset || 0,
//   };

//   if (existingChart) {
//     await Promise.all([
//       DerivedChartPlanet.destroy({ where: { derived_chart_id: derivedChartId } }),
//       DerivedChart.update(
//         {
//           chart_code: chartType.chart_code,
//           api_endpoint: apiEndpoint,
//           user_id: user.user_id,
//           chart_type_id: chartType.chart_type_id,
//           calculation_parameters: calculationParameters,
//           ascendant_sign: derivedData.arudha_lagna || '',
//           ascendant_degree: derivedData.metadata?.input?.longitude || 0,
//           ascendant_degree_formatted: derivedData.metadata?.input?.longitude ? `${derivedData.metadata.input.longitude}°` : undefined,
//           chart_data: chartData,
//           notes: JSON.stringify(chartData.metadata),
//           updated_at: new Date(),
//         },
//         { where: { derived_chart_id: derivedChartId } }
//       ),
//     ]);
//   } else {
//     await DerivedChart.create({
//       derived_chart_id: derivedChartId,
//       chart_code: chartType.chart_code,
//       api_endpoint: apiEndpoint,
//       user_id: user.user_id,
//       chart_type_id: chartType.chart_type_id,
//       calculation_parameters: calculationParameters,
//       ascendant_sign: derivedData.arudha_lagna || '',
//       ascendant_degree: derivedData.metadata?.input?.longitude || 0,
//       ascendant_degree_formatted: derivedData.metadata?.input?.longitude ? `${derivedData.metadata.input.longitude}°` : undefined,
//       chart_data: chartData,
//       notes: JSON.stringify(chartData.metadata),
//       created_at: new Date(),
//       updated_at: new Date(),
//     });
//   }

//   const planetData = derivedData.planets || {};
//   const planetPromises = Object.entries(planetData).map(([planet, data]: [string, any]) =>
//     DerivedChartPlanet.create({
//       position_id: uuidv4(),
//       derived_chart_id: derivedChartId,
//       planet: planet.toUpperCase() as Planet,
//       sign: data.sign || null,
//       house: data.house || null,
//       longitude: data.longitude || 0,
//       degree_formatted: data.longitude ? `${data.longitude}°` : undefined,
//       is_retrograde: data.retrograde || false,
//       retrograde_indicator: data.retrograde ? 'R' : '',
//     })
//   );

//   await Promise.all(planetPromises);
//   return derivedChartId;
// }

// function handleError(res: Response, error: any, defaultMessage: string) {
//   console.error(`Error: ${defaultMessage}`, error);
//   if (error instanceof ValidationError) {
//     res.status(400).json({
//       message: 'Validation error occurred',
//       errors: error.errors.map((e: any) => ({ field: e.path, message: e.message, value: e.value })),
//     });
//   } else {
//     const errorMessage = error.message.includes('Failed to call Astro API') ? error.message : `${defaultMessage}: ${error.message}`;
//     res.status(500).json({ message: errorMessage, error: error.message });
//   }
// }

// async function updateUserDetails(
//   user: User,
//   details: {
//     date_of_birth?: string;
//     time_of_birth?: string;
//     latitude?: number;
//     longitude?: number;
//     timezone_offset?: number;
//     birth_timezone?: string;
//     gender?: string;
//     full_name?: string;
//     place_of_birth?: string;
//   },
//   res: Response
// ): Promise<boolean> {
//   const { date_of_birth, time_of_birth, latitude, longitude, timezone_offset, birth_timezone, gender, full_name, place_of_birth } = details;

//   if (date_of_birth || time_of_birth || latitude !== undefined || longitude !== undefined || timezone_offset !== undefined) {
//     if (!date_of_birth || !time_of_birth || latitude === undefined || longitude === undefined || timezone_offset === undefined) {
//       res.status(400).json({ message: 'Incomplete birth details provided' });
//       return false;
//     }

//     const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//     const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
//     if (!dateRegex.test(date_of_birth) || !timeRegex.test(time_of_birth)) {
//       res.status(400).json({ message: 'Invalid date or time format' });
//       return false;
//     }

//     if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
//       res.status(400).json({ message: 'Invalid latitude or longitude values' });
//       return false;
//     }
//   }

//   // Validate gender
//   const validGenders = [Gender.Male, Gender.Female, Gender.Unknown];
//   const validatedGender = gender && validGenders.includes(gender as Gender) ? gender as Gender : user.gender || Gender.Unknown;

//   await user.update({
//     date_of_birth: date_of_birth || user.date_of_birth,
//     time_of_birth: time_of_birth || user.time_of_birth,
//     latitude: latitude !== undefined ? Number(latitude) : user.latitude,
//     longitude: longitude !== undefined ? Number(longitude) : user.longitude,
//     timezone_offset: timezone_offset !== undefined ? Number(timezone_offset) : user.timezone_offset,
//     birth_timezone: birth_timezone || user.birth_timezone,
//     // gender: validatedGender,
//     full_name: full_name || user.full_name,
//     place_of_birth: place_of_birth || user.place_of_birth,
//     updated_at: new Date(),
//   });

//   return true;
// }

// export const updateArudhaBhavaLagnaChart = async (
//   req: Request,
//   res: Response,
//   user: User,
//   chartType: any,
//   apiEndpoint: string,
//   existingChart?: any): Promise<string> => {
//   try {
//     const {
//       date_of_birth,
//       time_of_birth,
//       latitude,
//       longitude,
//       timezone_offset,
//       birth_timezone,
//       gender,
//       full_name,
//       place_of_birth,
//     } = req.body || {};

//     const updateSuccess = await updateUserDetails(
//       user,
//       { date_of_birth, time_of_birth, latitude, longitude, timezone_offset, birth_timezone, gender, full_name, place_of_birth },
//       res
//     );
//     if (!updateSuccess) throw new Error('Failed to update user details');

//     const updatedUser = await User.findOne({ where: { user_id: user.user_id } });
//     if (!updatedUser) throw new Error('Failed to retrieve updated user');

//     const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(updatedUser));
//     const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, updatedUser, apiEndpoint, existingChart);

//     const existingChartAfterUpdate = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
//     if (!existingChartAfterUpdate) throw new Error('Failed to retrieve updated Arudha Bhava Lagna chart');

//     const planets = await DerivedChartPlanet.findAll({ where: { derived_chart_id: existingChartAfterUpdate.derived_chart_id } });

//     const responseData = transformResponse(existingChartAfterUpdate, planets, updatedUser);

//     res.status(201).json({
//       message: 'Arudha Bhava Lagna chart updated successfully',
//       data: responseData,
//     });

//     return derivedChartId;
//   } catch (error) {
//     handleError(res, error, 'Failed to update Arudha Bhava Lagna chart');
//     throw error;
//   }
// };

// export const insertArudhaBhavaLagnaChart = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     console.log(`Processing insert request for userId: ${id}`);

//     const user = await validateRequest(id, res);
//     if (!user) return;

//     const chartType = await ChartType.findOne({ where: { chart_code: 'ARUDHA' } });
//     if (!chartType) throw new Error('Chart type Arudha Bhava Lagna not found');
//     const apiEndpoint = chartType.getDataValue('api_endpoint');
//     if (!apiEndpoint) throw new Error('API endpoint not configured for Arudha Bhava Lagna');

//     const existingChart = await DerivedChart.findOne({
//       where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
//     });

//     if (existingChart) {
//       res.status(400).json({ message: 'Arudha Bhava Lagna chart already exists for user' });
//       return;
//     }

//     if (!user.date_of_birth || !user.time_of_birth || user.latitude === null || user.longitude === null || user.timezone_offset === null) {
//       res.status(400).json({ message: 'Incomplete birth details for user' });
//       return;
//     }

//     const payload = buildApiPayload(user);
//     const derivedData = await callAstroApi(apiEndpoint, payload);
//     const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint);

//     const newChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
//     if (!newChart) throw new Error('Failed to retrieve new Arudha Bhava Lagna chart');

//     const planets = await DerivedChartPlanet.findAll({ where: { derived_chart_id: derivedChartId } });
//     const responseData = transformResponse(newChart, planets, user);

//     res.status(201).json({
//       message: 'Arudha Bhava Lagna chart inserted successfully',
//       data: responseData,
//     });
//   } catch (error) {
//     handleError(res, error, 'Failed to insert Arudha Bhava Lagna chart');
//   }
// };

// export const fetchArudhaBhavaLagnaChart = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     console.log(`Processing fetch request for userId: ${id}`);

//     const user = await validateRequest(id, res);
//     if (!user) return;

//     const chartType = await ChartType.findOne({ where: { chart_code: 'ARUDHA' } });
//     if (!chartType) throw new Error('Chart type Arudha Bhava Lagna not found');
//     const apiEndpoint = chartType.getDataValue('api_endpoint');
//     if (!apiEndpoint) throw new Error('API endpoint not configured for Arudha Bhava Lagna');

//     // Validate user details
//     if (!user.date_of_birth || !user.time_of_birth || user.latitude === null || user.longitude === null || user.timezone_offset === null) {
//       res.status(400).json({ message: 'Incomplete birth details for user' });
//       return;
//     }

//     // Check for update details in req.body
//     const {
//       date_of_birth,
//       time_of_birth,
//       latitude,
//       longitude,
//       timezone_offset,
//       birth_timezone,
//       gender,
//       full_name,
//       place_of_birth,
//     } = req.body || {};
//     const hasUpdateDetails = date_of_birth || time_of_birth || latitude !== undefined || longitude !== undefined || timezone_offset !== undefined || birth_timezone || gender || full_name || place_of_birth;

//     let existingChart = await DerivedChart.findOne({
//       where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
//     });

//     let message = 'Arudha Bhava Lagna chart fetched successfully';
//     let derivedChartId: string;
//     let targetUser = user;

//     if (!existingChart) {
//       // Create new chart if none exists
//       const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user));
//       derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint);
//       message = 'Arudha Bhava Lagna chart created and fetched successfully';
//     } else if (hasUserDetailsChanged(user, existingChart.calculation_parameters) || hasUpdateDetails) {
//       // Update chart if user details changed or update details provided
//       const updateSuccess = await updateUserDetails(
//         user,
//         { date_of_birth, time_of_birth, latitude, longitude, timezone_offset, birth_timezone, gender, full_name, place_of_birth },
//         res
//       );
//       if (!updateSuccess) return;

//       const updatedUser = await User.findOne({ where: { user_id: user.user_id } });
//       if (!updatedUser) throw new Error('Failed to retrieve updated user');

//       const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(updatedUser));
//       derivedChartId = await saveOrUpdateChartData(derivedData, chartType, updatedUser, apiEndpoint, existingChart);
//       targetUser = updatedUser;
//       message = 'Arudha Bhava Lagna chart updated and fetched successfully';
//     } else {
//       // Use existing chart
//       derivedChartId = existingChart.derived_chart_id;
//     }

//     // Fetch chart and planets
//     const chart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
//     if (!chart) throw new Error('Failed to retrieve Arudha Bhava Lagna chart');

//     const planets = await DerivedChartPlanet.findAll({ where: { derived_chart_id: derivedChartId } });
//     const responseData = transformResponse(chart, planets, targetUser);

//     res.status(200).json({
//       message,
//       data: responseData,
//     });
//   } catch (error) {
//     handleError(res, error, 'Failed to fetch Arudha Bhava Lagna chart');
//   }
// };

import { Request, Response } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ValidationError } from 'sequelize';
import ChartType from '../../models/ChartType';
import User from '../../../user-management/models/user';
import DerivedChart from '../../models/DerivedChartModel';
import DerivedChartPlanet, { Planet } from '../../models/derived_chart_planet';
import { redisClient } from '../../../../config/redis.config';
import dotenv from 'dotenv';
dotenv.config();

const ASTRO_ENGINE_URL = process.env.Astro_Url;

// Assuming Gender enum is defined in user.ts
enum Gender {
  Male = 'male',
  Female = 'female',
  Unknown = 'unknown',
}

// Helper function to transform chart and planets into desired response format
const transformResponse = (chart: any, planets: any[], user: any) => {
  const chartData = chart.chart_data || {};

  // Build planets object
  const planetaryPositions = planets.reduce((acc: any, planet: any) => {
    acc[planet.planet] = {
      house: planet.house || null,
      retrograde: planet.is_retrograde || false,
      sign: planet.sign || '',
    };
    return acc;
  }, {});

  return {
    birth_details: {
      birth_date: user.date_of_birth || '',
      birth_time: user.time_of_birth || '',
      latitude: user.latitude || 0,
      longitude: user.longitude || 0,
      timezone_offset: user.timezone_offset || 0,
    },
    arudha_lagna: chart.ascendant_sign || '',
    metadata: {
      ayanamsa: chartData.metadata?.ayanamsa || 'Lahiri',
      calculation_time: chartData.metadata?.calculation_time || new Date().toISOString(),
      input: chartData.metadata?.input || {},
    },
    planets: planetaryPositions,
    user_name: user.full_name || 'Unknown',
  };
};

async function validateRequest(id: string, res: Response): Promise<User | null> {
  if (!id) {
    res.status(400).json({ message: 'Missing userId' });
    return null;
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    res.status(400).json({ message: 'Invalid user ID format' });
    return null;
  }
  const user = await User.findOne({ where: { user_id: id } });
  if (!user) {
    res.status(404).json({ message: `No user found for userId: ${id}` });
    return null;
  }
  return user;
}

function buildApiPayload(user: User): any {
  return {
    chart_type: 'ARUDHA',
    birth_date: user.date_of_birth,
    birth_time: user.time_of_birth,
    latitude: parseFloat(user.latitude?.toString() || '0'),
    longitude: parseFloat(user.longitude?.toString() || '0'),
    timezone_offset: user.timezone_offset || 0,
    timezone: user.birth_timezone || 'Asia/Kolkata',
    ayanamsa: 'lahiri',
    house_system: 'arudha',
    zodiac_system: 'sidereal',
    gender: user.gender || Gender.Unknown,
    user_name: user.full_name || 'Unknown',
    place_of_birth: user.place_of_birth || 'Unknown',
    calculation_precision: 'high',
  };
}

function hasUserDetailsChanged(user: User, storedParams: any): boolean {
  const userLatitude = parseFloat(user.latitude?.toString() || '0');
  const userLongitude = parseFloat(user.longitude?.toString() || '0');
  const storedLatitude = parseFloat(storedParams?.latitude?.toString() || '0');
  const storedLongitude = parseFloat(storedParams?.longitude?.toString() || '0');

  return (
    user.date_of_birth !== (storedParams?.birth_date || '') ||
    user.time_of_birth !== (storedParams?.birth_time || '') ||
    Math.abs(userLatitude - storedLatitude) > 0.0001 ||
    Math.abs(userLongitude - storedLongitude) > 0.0001 ||
    (user.timezone_offset || 0) !== (storedParams?.timezone_offset || 0)
  );
}

async function callAstroApi(apiEndpoint: string, payload: any, cacheKey: string): Promise<any> {
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return JSON.parse(cached);
    }

    console.log(`Cache miss for key: ${cacheKey}`);
    const fullUrl = `${ASTRO_ENGINE_URL}${apiEndpoint}`;
    const response = await axios.post(fullUrl, payload, { timeout: 10000 });
    console.log('Calling Astro API:', fullUrl);
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error in callAstroApi:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Failed to call Astro API: ${error.response.data.error || error.message}`);
    }
    throw new Error('Failed to call Astro API');
  }
}

async function saveOrUpdateChartData(
  derivedData: any,
  chartType: any,
  user: User,
  apiEndpoint: string,
  existingChart?: any
): Promise<string> {
  const derivedChartId = existingChart?.derived_chart_id || uuidv4();

  const chartData = {
    arudha_lagna: derivedData.arudha_lagna || '',
    planets: derivedData.planets || {},
    metadata: {
      ayanamsa: derivedData.metadata?.ayanamsa || 'Lahiri',
      calculation_time: derivedData.metadata?.calculation_time || new Date().toISOString(),
      input: derivedData.metadata?.input || {},
      chart_type: derivedData.metadata?.chart_type || `${chartType.chart_name} (${chartType.chart_code})`,
      house_system: derivedData.metadata?.house_system || 'Arudha',
    },
  };

  const calculationParameters = {
    ayanamsa: 'lahiri',
    house_system: 'arudha',
    zodiac_system: 'sidereal',
    birth_date: user.date_of_birth,
    birth_time: user.time_of_birth,
    latitude: parseFloat(user.latitude?.toString() || '0'),
    longitude: parseFloat(user.longitude?.toString() || '0'),
    timezone_offset: user.timezone_offset || 0,
  };

  if (existingChart) {
    await Promise.all([
      DerivedChartPlanet.destroy({ where: { derived_chart_id: derivedChartId } }),
      DerivedChart.update(
        {
          chart_code: chartType.chart_code,
          api_endpoint: apiEndpoint,
          user_id: user.user_id,
          chart_type_id: chartType.chart_type_id,
          calculation_parameters: calculationParameters,
          ascendant_sign: derivedData.arudha_lagna || '',
          ascendant_degree: derivedData.metadata?.input?.longitude || 0,
          ascendant_degree_formatted: derivedData.metadata?.input?.longitude ? `${derivedData.metadata.input.longitude}°` : undefined,
          chart_data: chartData,
          notes: JSON.stringify(chartData.metadata),
          updated_at: new Date(),
        },
        { where: { derived_chart_id: derivedChartId } }
      ),
    ]);
  } else {
    await DerivedChart.create({
      derived_chart_id: derivedChartId,
      chart_code: chartType.chart_code,
      api_endpoint: apiEndpoint,
      user_id: user.user_id,
      chart_type_id: chartType.chart_type_id,
      calculation_parameters: calculationParameters,
      ascendant_sign: derivedData.arudha_lagna || '',
      ascendant_degree: derivedData.metadata?.input?.longitude || 0,
      ascendant_degree_formatted: derivedData.metadata?.input?.longitude ? `${derivedData.metadata.input.longitude}°` : undefined,
      chart_data: chartData,
      notes: JSON.stringify(chartData.metadata),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  const planetData = derivedData.planets || {};
  const planetPromises = Object.entries(planetData).map(([planet, data]: [string, any]) =>
    DerivedChartPlanet.create({
      position_id: uuidv4(),
      derived_chart_id: derivedChartId,
      planet: planet.toUpperCase() as Planet,
      sign: data.sign || null,
      house: data.house || null,
      longitude: data.longitude || 0,
      degree_formatted: data.longitude ? `${data.longitude}°` : undefined,
      is_retrograde: data.retrograde || false,
      retrograde_indicator: data.retrograde ? 'R' : '',
    })
  );

  await Promise.all(planetPromises);
  return derivedChartId;
}

function handleError(res: Response, error: any, defaultMessage: string) {
  console.error(`Error: ${defaultMessage}`, error);
  if (error instanceof ValidationError) {
    res.status(400).json({
      message: 'Validation error occurred',
      errors: error.errors.map((e: any) => ({ field: e.path, message: e.message, value: e.value })),
    });
  } else {
    const errorMessage = error.message.includes('Failed to call Astro API') ? error.message : `${defaultMessage}: ${error.message}`;
    res.status(500).json({ message: errorMessage, error: error.message });
  }
}

async function updateUserDetails(
  user: User,
  details: {
    date_of_birth?: string;
    time_of_birth?: string;
    latitude?: number;
    longitude?: number;
    timezone_offset?: number;
    birth_timezone?: string;
    gender?: string;
    full_name?: string;
    place_of_birth?: string;
  },
  res: Response
): Promise<boolean> {
  const { date_of_birth, time_of_birth, latitude, longitude, timezone_offset, birth_timezone, gender, full_name, place_of_birth } = details;

  if (date_of_birth || time_of_birth || latitude !== undefined || longitude !== undefined || timezone_offset !== undefined) {
    if (!date_of_birth || !time_of_birth || latitude === undefined || longitude === undefined || timezone_offset === undefined) {
      res.status(400).json({ message: 'Incomplete birth details provided' });
      return false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
    if (!dateRegex.test(date_of_birth) || !timeRegex.test(time_of_birth)) {
      res.status(400).json({ message: 'Invalid date or time format' });
      return false;
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      res.status(400).json({ message: 'Invalid latitude or longitude values' });
      return false;
    }
  }

  // Validate gender
  const validGenders = [Gender.Male, Gender.Female, Gender.Unknown];
  const validatedGender = gender && validGenders.includes(gender as Gender) ? gender as Gender : user.gender || Gender.Unknown;

  await user.update({
    date_of_birth: date_of_birth || user.date_of_birth,
    time_of_birth: time_of_birth || user.time_of_birth,
    latitude: latitude !== undefined ? Number(latitude) : user.latitude,
    longitude: longitude !== undefined ? Number(longitude) : user.longitude,
    timezone_offset: timezone_offset !== undefined ? Number(timezone_offset) : user.timezone_offset,
    birth_timezone: birth_timezone || user.birth_timezone,
    gender: validatedGender as any,
    full_name: full_name || user.full_name,
    place_of_birth: place_of_birth || user.place_of_birth,
    updated_at: new Date(),
  });

  return true;
}

export const updateArudhaBhavaLagnaChart = async (
  req: Request,
  res: Response,
  user: User,
  chartType: any,
  apiEndpoint: string,
  existingChart?: any
): Promise<string> => {
  try {
    const {
      date_of_birth,
      time_of_birth,
      latitude,
      longitude,
      timezone_offset,
      birth_timezone,
      gender,
      full_name,
      place_of_birth,
    } = req.body || {};

    const redisKey = `arudha_lagna_chart_user_${user.user_id}`;
    const cacheKey = `arudhalagnachart:${user.user_id}`;

    const updateSuccess = await updateUserDetails(
      user,
      { date_of_birth, time_of_birth, latitude, longitude, timezone_offset, birth_timezone, gender, full_name, place_of_birth },
      res
    );
    if (!updateSuccess) throw new Error('Failed to update user details');

    const updatedUser = await User.findOne({ where: { user_id: user.user_id } });
    if (!updatedUser) throw new Error('Failed to retrieve updated user');

    await redisClient.del(redisKey);
    await redisClient.del(cacheKey);

    const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(updatedUser), cacheKey);
    const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, updatedUser, apiEndpoint, existingChart);

    const existingChartAfterUpdate = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
    if (!existingChartAfterUpdate) throw new Error('Failed to retrieve updated Arudha Bhava Lagna chart');

    const planets = await DerivedChartPlanet.findAll({ where: { derived_chart_id: existingChartAfterUpdate.derived_chart_id } });

    const responseData = transformResponse(existingChartAfterUpdate, planets, updatedUser);
    // Remove birth_details from final response to match desired output
    const { birth_details, ...responseWithoutBirthDetails } = responseData;
    await redisClient.setEx(redisKey, 3600, JSON.stringify(responseData));

    res.status(201).json({
      message: 'Arudha Bhava Lagna chart updated successfully',
      data: responseWithoutBirthDetails,
    });

    return derivedChartId;
  } catch (error) {
    handleError(res, error, 'Failed to update Arudha Bhava Lagna chart');
    throw error;
  }
};

export const insertArudhaBhavaLagnaChart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`Processing insert request for userId: ${id}`);

    const user = await validateRequest(id, res);
    if (!user) return;

    const chartType = await ChartType.findOne({ where: { chart_code: 'ARUDHA' } });
    if (!chartType) throw new Error('Chart type Arudha Bhava Lagna not found');
    const apiEndpoint = chartType.getDataValue('api_endpoint');
    if (!apiEndpoint) throw new Error('API endpoint not configured for Arudha Bhava Lagna');

    const redisKey = `arudha_lagna_chart_user_${user.user_id}`;
    const cacheKey = `arudhalagnachart:${user.user_id}`;

    const existingChart = await DerivedChart.findOne({
      where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
    });

    if (existingChart) {
      res.status(400).json({ message: 'Arudha Bhava Lagna chart already exists for user' });
      return;
    }

    if (!user.date_of_birth || !user.time_of_birth || user.latitude === null || user.longitude === null || user.timezone_offset === null) {
      res.status(400).json({ message: 'Incomplete birth details for user' });
      return;
    }

    const payload = buildApiPayload(user);
    const derivedData = await callAstroApi(apiEndpoint, payload, cacheKey);
    const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint);

    const newChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
    if (!newChart) throw new Error('Failed to retrieve new Arudha Bhava Lagna chart');

    const planets = await DerivedChartPlanet.findAll({ where: { derived_chart_id: derivedChartId } });
    const responseData = transformResponse(newChart, planets, user);
    // Remove birth_details from final response to match desired output
    const { birth_details, ...responseWithoutBirthDetails } = responseData;
    await redisClient.setEx(redisKey, 3600, JSON.stringify(responseData));

    res.status(201).json({
      message: 'Arudha Bhava Lagna chart inserted successfully',
      data: responseWithoutBirthDetails,
    });
  } catch (error) {
    handleError(res, error, 'Failed to insert Arudha Bhava Lagna chart');
  }
};

export const fetchArudhaBhavaLagnaChart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`Processing fetch request for userId: ${id}`);

    const user = await validateRequest(id, res);
    if (!user) return;

    const chartType = await ChartType.findOne({ where: { chart_code: 'ARUDHA' } });
    if (!chartType) throw new Error('Chart type Arudha Bhava Lagna not found');
    const apiEndpoint = chartType.getDataValue('api_endpoint');
    if (!apiEndpoint) throw new Error('API endpoint not configured for Arudha Bhava Lagna');

    const redisKey = `arudha_lagna_chart_user_${user.user_id}`;
    const cacheKey = `arudhalagnachart:${user.user_id}`;

    // Check Redis cache first
    const cachedChart = await redisClient.get(redisKey);
    if (cachedChart) {
      const cachedData = JSON.parse(cachedChart);
      if (!hasUserDetailsChanged(user, cachedData.birth_details)) {
        console.log(`Serving Arudha Bhava Lagna Chart for userId ${user.user_id} from Redis cache`);
        // Remove birth_details from final response
        const { birth_details, ...responseWithoutBirthDetails } = cachedData;
        res.status(200).json({
          message: 'Arudha Bhava Lagna Chart fetched successfully from cache',
          data: responseWithoutBirthDetails,
        });
        return;
      }
      console.log(`Cache invalidated for userId ${user.user_id} due to changed details`);
    } else {
      console.log(`No cache found for key: ${redisKey}`);
    }

    // Validate user details
    if (!user.date_of_birth || !user.time_of_birth || user.latitude === null || user.longitude === null || user.timezone_offset === null) {
      res.status(400).json({ message: 'Incomplete birth details for user' });
      return;
    }

    // Check for update details in req.body
    const {
      date_of_birth,
      time_of_birth,
      latitude,
      longitude,
      timezone_offset,
      birth_timezone,
      gender,
      full_name,
      place_of_birth,
    } = req.body || {};
    const hasUpdateDetails = date_of_birth || time_of_birth || latitude !== undefined || longitude !== undefined || timezone_offset !== undefined || birth_timezone || gender || full_name || place_of_birth;

    let existingChart = await DerivedChart.findOne({
      where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
    });

    let message = 'Arudha Bhava Lagna chart fetched successfully';
    let derivedChartId: string;
    let targetUser = user;

    if (!existingChart) {
      // Create new chart if none exists
      const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user), cacheKey);
      derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint);
      message = 'Arudha Bhava Lagna chart created and fetched successfully';
    } else if (hasUserDetailsChanged(user, existingChart.calculation_parameters) || hasUpdateDetails) {
      // Update chart if user details changed or update details provided
      const updateSuccess = await updateUserDetails(
        user,
        { date_of_birth, time_of_birth, latitude, longitude, timezone_offset, birth_timezone, gender, full_name, place_of_birth },
        res
      );
      if (!updateSuccess) return;

      const updatedUser = await User.findOne({ where: { user_id: user.user_id } });
      if (!updatedUser) throw new Error('Failed to retrieve updated user');
      targetUser = updatedUser;

      await redisClient.del(redisKey);
      await redisClient.del(cacheKey);

      const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(targetUser), cacheKey);
      derivedChartId = await saveOrUpdateChartData(derivedData, chartType, targetUser, apiEndpoint, existingChart);
      message = 'Arudha Bhava Lagna chart updated and fetched successfully';
    } else {
      // Use existing chart
      derivedChartId = existingChart.derived_chart_id;
    }

    // Fetch chart and planets
    const chart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
    if (!chart) throw new Error('Failed to retrieve Arudha Bhava Lagna chart');

    const planets = await DerivedChartPlanet.findAll({ where: { derived_chart_id: derivedChartId } });
    const responseData = transformResponse(chart, planets, targetUser);
    // Remove birth_details from final response
    const { birth_details, ...responseWithoutBirthDetails } = responseData;
    await redisClient.setEx(redisKey, 3600, JSON.stringify(responseData));

    res.status(200).json({
      message,
      data: responseWithoutBirthDetails,
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch Arudha Bhava Lagna chart');
  }
};