// import { Request, Response } from 'express';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import { ValidationError } from 'sequelize';
// import ChartType from '../../models/ChartType';
// import User from '../../../user-management/models/user';
// import DerivedChart from '../../models/DerivedChartModel';
// import DerivedChartPlanet, { Planet } from '../../models/derived_chart_planet';
// import DerivedChartHouse from '../../models/derived_chart_house';

// interface ChartResponse {
//   chart_type: string;
//   data: any;
// }

// // Validate request inputs
// async function validateRequest(id: string, res: Response): Promise<User | null> {
//   if (!id) {
//     res.status(400).json({ message: 'Missing userId' });
//     return null;
//   }
//   const user = await User.findOne({ where: { user_id: id } });
//   if (!user) {
//     res.status(404).json({ message: `No user found for userId: ${id}` });
//     return null;
//   }
//   return user;
// }

// // Build API payload
// function buildApiPayload(user: User): any {
//   return {
//     chart_type: 'D2',
//     birth_date: user.date_of_birth,
//     birth_time: user.time_of_birth,
//     latitude: parseFloat(user.latitude?.toString() || '0'),
//     longitude: parseFloat(user.longitude?.toString() || '0'),
//     timezone_offset: user.timezone_offset || 0,
//     timezone: user.birth_timezone || 'Asia/Kolkata',
//     ayanamsa: 'lahiri',
//     house_system: 'placidus',
//     zodiac_system: 'sidereal',
//     gender: user.gender || 'unknown',
//     name: user.full_name || 'Unknown',
//     place_of_birth: user.place_of_birth || 'Unknown',
//     divisional_factor: 2,
//     calculation_precision: 'high',
//   };
// }

// // Compare user details
// function hasUserDetailsChanged(user: User, storedParams: any): boolean {
//   return (
//     user.date_of_birth !== storedParams?.birth_date ||
//     user.time_of_birth !== storedParams?.birth_time ||
//     parseFloat(user.latitude?.toString() || '0') !== storedParams?.latitude ||
//     parseFloat(user.longitude?.toString() || '0') !== storedParams?.longitude ||
//     user.timezone_offset !== storedParams?.timezone_offset
//   );
// }

// // Call Python API
// async function callAstroApi(apiEndpoint: string, payload: any): Promise<any> {
//   const ASTRO_ENGINE_URL = process.env.ASTRO_ENGINE_URL || 'http://localhost:5000';
//   const response = await axios.post(`${ASTRO_ENGINE_URL}${apiEndpoint}`, payload, { timeout: 10000 });
//   console.log('DerivedData for D-2:', JSON.stringify(response.data, null, 2));
//   return response.data;
// }

// // Save or update chart data
// async function saveOrUpdateChartData(
//   derivedData: any,
//   chartType: any,
//   user: User,
//   apiEndpoint: string,
//   existingChart?: any
// ): Promise<string> {
//   const derivedChartId = existingChart?.derived_chart_id || uuidv4();
//   const chartData = {
//     ascendant: derivedData.d2_ascendant || derivedData.ascendant || {},
//     planetary_positions: derivedData.planetary_positions || derivedData.planets || {},
//     house_signs: derivedData.house_signs || [],
//     aspects: derivedData.aspects || {},
//     ayanamsa_value: derivedData.metadata?.ayanamsa || derivedData.notes?.ayanamsa_value || 'Lahiri',
//   };
//   const ascendantSign = derivedData.d2_ascendant?.sign || derivedData.ascendant?.d2_sign || derivedData.ascendant?.sign || '';
//   const metadata = {
//     ayanamsa: derivedData.metadata?.ayanamsa || 'Lahiri',
//     chart_type: derivedData.metadata?.chart_type || `${chartType.chart_name} (${chartType.chart_code})`,
//     house_system: derivedData.metadata?.house_system || 'Placidus',
//   };
//   const calculationParameters = {
//     ayanamsa: 'lahiri',
//     house_system: 'placidus',
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
//       DerivedChartHouse.destroy({ where: { derived_chart_id: derivedChartId } }),
//       DerivedChart.update(
//         {
//           chart_code: chartType.chart_code,
//           api_endpoint: apiEndpoint,
//           user_id: user.user_id,
//           chart_type_id: chartType.chart_type_id,
//           calculation_parameters: calculationParameters,
//           ascendant_sign: ascendantSign,
//           ascendant_degree:
//             derivedData.d2_ascendant?.degrees && typeof derivedData.d2_ascendant.degrees === 'string'
//               ? parseFloat(derivedData.d2_ascendant.degrees.split('°')[0])
//               : derivedData.ascendant?.degrees || 0,
//           ascendant_degree_formatted: derivedData.d2_ascendant?.degrees || derivedData.ascendant?.degrees || null,
//           chart_data: { ...chartData, metadata },
//           notes: JSON.stringify(metadata),
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
//       ascendant_sign: ascendantSign,
//       ascendant_degree:
//         derivedData.d2_ascendant?.degrees && typeof derivedData.d2_ascendant.degrees === 'string'
//           ? parseFloat(derivedData.d2_ascendant.degrees.split('°')[0])
//           : derivedData.ascendant?.degrees || 0,
//       ascendant_degree_formatted: derivedData.d2_ascendant?.degrees || derivedData.ascendant?.degrees || null,
//       chart_data: { ...chartData, metadata },
//       notes: JSON.stringify(metadata),
//       created_at: new Date(),
//       updated_at: new Date(),
//     });
//   }

//   // Save planets
//   const planetData = derivedData.planetary_positions || derivedData.planets || {};
//   const planetPromises = Object.entries(planetData).map(([planet, data]: [string, any]) =>
//     DerivedChartPlanet.create({
//       position_id: uuidv4(),
//       derived_chart_id: derivedChartId,
//       planet: planet.toUpperCase() as Planet,
//       sign: data.sign || data.d2_sign || null,
//       house: data.house || null,
//       longitude:
//         data.degrees && typeof data.degrees === 'string' ? parseFloat(data.degrees.split('°')[0]) : data.degrees || 0,
//       degree_formatted: data.degrees || null,
//       is_retrograde: data.retrograde === 'R',
//       retrograde_indicator: data.retrograde || '',
//       nakshatra: data.nakshatra || null,
//       deity: data.deity || null,
//       shashtiamsha: data.shashtiamsha || null,
//     })
//   );

//   // Save houses
//   const houseData = derivedData.house_signs || [];
//   const housePromises = houseData.map((data: any) =>
//     DerivedChartHouse.create({
//       house_id: uuidv4(),
//       derived_chart_id: derivedChartId,
//       house_number: data.house || parseInt(data.house),
//       sign: data.sign || data.d2_sign || null,
//       start_longitude:
//         data.start_longitude && typeof data.start_longitude === 'string'
//           ? parseFloat(data.start_longitude.split('°')[0])
//           : 0,
//       start_longitude_formatted: data.start_longitude || null,
//       house_lord: data.house_lord || '',
//     })
//   );

//   await Promise.all([...planetPromises, ...housePromises]);
//   return derivedChartId;
// }

// // Handle errors
// function handleError(res: Response, error: any, defaultMessage: string) {
//   console.error(`Error: ${defaultMessage}`, error);
//   if (error instanceof ValidationError) {
//     res.status(400).json({
//       message: 'Validation error occurred',
//       errors: error.errors.map((e: any) => ({ field: e.path, message: e.message, value: e.value })),
//     });
//   } else {
//     res.status(500).json({ message: defaultMessage, error: error.message });
//   }
// }

// // Update D-2 chart
// export const updateD2Chart = async (
//   user: User,
//   chartType: any,
//   apiEndpoint: string,
//   existingChart: any
// ): Promise<string> => {
//   const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user));
//   const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint, existingChart);
//   return derivedChartId;
// };

// // Insert D-2 chart
// export const insertD2Chart = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     console.log(`Processing insert request for userId: ${id}`);

//     const user = await validateRequest(id, res);
//     if (!user) return;

//     const chartType = await ChartType.findOne({ where: { chart_code: 'D-2' } });
//     if (!chartType) throw new Error('Chart type D-2 not found');
//     const apiEndpoint = chartType.getDataValue('api_endpoint');
//     if (!apiEndpoint) throw new Error('API endpoint not configured for D-2');

//     const existingChart = await DerivedChart.findOne({
//       where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
//     });
//     if (existingChart) {
//       res.status(400).json({ message: 'D-2 chart already exists for user' });
//       return;
//     }

//     const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user));
//     const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint);

//     res.status(200).json({
//       message: 'D2 chart inserted successfully',
//       data: { derived_chart_id: derivedChartId, chart_type: 'D-2', data: derivedData },
//     });
//   } catch (error) {
//     handleError(res, error, 'Failed to insert D-2 chart');
//   }
// };

// // Fetch D-2 chart
// export const fetchD2Chart = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     console.log(`Processing fetch request for userId: ${id}`);

//     const user = await validateRequest(id, res);
//     if (!user) return;

//     const chartType = await ChartType.findOne({ where: { chart_code: 'D-2' } });
//     if (!chartType) throw new Error('Chart type D-2 not found');
//     const apiEndpoint = chartType.getDataValue('api_endpoint');
//     if (!apiEndpoint) throw new Error('API endpoint not configured for D-2');

//     let existingChart = await DerivedChart.findOne({
//       where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
//     });
//     let message = 'D2 chart fetched successfully';

//     if (!existingChart) {
//       const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user));
//       const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint);
//       existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
//       message = 'D2 chart created and fetched successfully';
//     } else if (hasUserDetailsChanged(user, existingChart.calculation_parameters)) {
//       const derivedChartId = await updateD2Chart(user, chartType, apiEndpoint, existingChart);
//       existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
//       message = 'D2 chart updated and fetched successfully';
//     }

//     if (!existingChart) throw new Error('Failed to retrieve D-2 chart');

//     const [planets, houses] = await Promise.all([
//       DerivedChartPlanet.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
//       DerivedChartHouse.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
//     ]);

//     res.status(200).json({
//       message,
//       data: {
//         chart_type: 'D-2',
//         data: {
//           message: 'Derived chart data fetched from database',
//           data: { chart: existingChart, planets, houses },
//         },
//       },
//     });
//   } catch (error) {
//     handleError(res, error, 'Failed to fetch D-2 chart');
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
import DerivedChartHouse from '../../models/derived_chart_house';
import { redisClient } from '../../../../config/redis.config';
import dotenv from 'dotenv';
dotenv.config();

const ASTRO_ENGINE_URL = process.env.Astro_Url;

interface ChartResponse {
  chart_type: string;
  data: any;
}

async function validateRequest(id: string, res: Response): Promise<User | null> {
  if (!id) {
    res.status(400).json({ message: 'Missing userId' });
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
    chart_type: 'D2',
    birth_date: user.date_of_birth,
    birth_time: user.time_of_birth,
    latitude: parseFloat(user.latitude?.toString() || '0'),
    longitude: parseFloat(user.longitude?.toString() || '0'),
    timezone_offset: user.timezone_offset || 0,
    timezone: user.birth_timezone || 'Asia/Kolkata',
    ayanamsa: 'lahiri',
    house_system: 'placidus',
    zodiac_system: 'sidereal',
    gender: user.gender || 'unknown',
    name: user.full_name || 'Unknown',
    place_of_birth: user.place_of_birth || 'Unknown',
    divisional_factor: 2,
    calculation_precision: 'high',
  };
}

function hasUserDetailsChanged(user: User, storedParams: any): boolean {
  return (
    user.date_of_birth !== storedParams?.birth_date ||
    user.time_of_birth !== storedParams?.birth_time ||
    parseFloat(user.latitude?.toString() || '0') !== storedParams?.latitude ||
    parseFloat(user.longitude?.toString() || '0') !== storedParams?.longitude ||
    user.timezone_offset !== storedParams?.timezone_offset
  );
}

async function callAstroApi(apiEndpoint: string, payload: any, cacheKey: string): Promise<any> {
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    console.log('Returning D2 chart from Redis cache.');
    return JSON.parse(cached);
  }

  const fullUrl = `${ASTRO_ENGINE_URL}${apiEndpoint}`;
  const response = await axios.post(fullUrl, payload, { timeout: 10000 });
  console.log('DerivedData for D-2:', JSON.stringify(response.data, null, 2));
  await redisClient.set(cacheKey, JSON.stringify(response.data), { EX: 3600 });

  return response.data;
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
    ascendant: derivedData.d2_ascendant || derivedData.ascendant || {},
    planetary_positions: derivedData.planetary_positions || derivedData.planets || {},
    house_signs: derivedData.house_signs || [],
    aspects: derivedData.aspects || {},
    ayanamsa_value: derivedData.metadata?.ayanamsa || derivedData.notes?.ayanamsa_value || 'Lahiri',
  };

  const ascendantSign = derivedData.d2_ascendant?.sign || derivedData.ascendant?.d2_sign || derivedData.ascendant?.sign || '';
  const metadata = {
    ayanamsa: derivedData.metadata?.ayanamsa || 'Lahiri',
    chart_type: derivedData.metadata?.chart_type || `${chartType.chart_name} (${chartType.chart_code})`,
    house_system: derivedData.metadata?.house_system || 'Placidus',
  };

  const calculationParameters = {
    ayanamsa: 'lahiri',
    house_system: 'placidus',
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
      DerivedChartHouse.destroy({ where: { derived_chart_id: derivedChartId } }),
      DerivedChart.update(
        {
          chart_code: chartType.chart_code,
          api_endpoint: apiEndpoint,
          user_id: user.user_id,
          chart_type_id: chartType.chart_type_id,
          calculation_parameters: calculationParameters,
          ascendant_sign: ascendantSign,
          ascendant_degree:
            derivedData.d2_ascendant?.degrees && typeof derivedData.d2_ascendant.degrees === 'string'
              ? parseFloat(derivedData.d2_ascendant.degrees.split('°')[0])
              : derivedData.ascendant?.degrees || 0,
          ascendant_degree_formatted: derivedData.d2_ascendant?.degrees || derivedData.ascendant?.degrees || null,
          chart_data: { ...chartData, metadata },
          notes: JSON.stringify(metadata),
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
      ascendant_sign: ascendantSign,
      ascendant_degree:
        derivedData.d2_ascendant?.degrees && typeof derivedData.d2_ascendant.degrees === 'string'
          ? parseFloat(derivedData.d2_ascendant.degrees.split('°')[0])
          : derivedData.ascendant?.degrees || 0,
      ascendant_degree_formatted: derivedData.d2_ascendant?.degrees || derivedData.ascendant?.degrees || null,
      chart_data: { ...chartData, metadata },
      notes: JSON.stringify(metadata),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  const planetData = derivedData.planetary_positions || derivedData.planets || {};
  const planetPromises = Object.entries(planetData).map(([planet, data]: [string, any]) =>
    DerivedChartPlanet.create({
      position_id: uuidv4(),
      derived_chart_id: derivedChartId,
      planet: planet.toUpperCase() as Planet,
      sign: data.d2_sign || data.sign || null,
      house: data.house || null,
      longitude:
        data.degrees && typeof data.degrees === 'string' ? parseFloat(data.degrees.split('°')[0]) : data.degrees || 0,
      degree_formatted: data.degrees || null,
      is_retrograde: data.retrograde === 'R',
      retrograde_indicator: data.retrograde || '',
      nakshatra: data.nakshatra || null,
      deity: data.deity || null,
      shashtiamsha: data.shashtiamsha || null,
    })
  );

  const houseData = derivedData.house_signs || [];
  const housePromises = houseData.map((data: any) =>
    DerivedChartHouse.create({
      house_id: uuidv4(),
      derived_chart_id: derivedChartId,
      house_number: data.house || parseInt(data.house),
      sign: data.d2_sign || data.sign || null,
      start_longitude:
        data.start_longitude && typeof data.start_longitude === 'string'
          ? parseFloat(data.start_longitude.split('°')[0])
          : 0,
      start_longitude_formatted: data.start_longitude || null,
      house_lord: data.house_lord || '',
    })
  );

  await Promise.all([...planetPromises, ...housePromises]);
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
    res.status(500).json({ message: defaultMessage, error: error.message });
  }
}

export const updateD2Chart = async (
  user: User,
  chartType: any,
  apiEndpoint: string,
  existingChart: any
): Promise<string> => {
  const cacheKey = `d2chart:${user.user_id}`;
  const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user), cacheKey);
  const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint, existingChart);
  return derivedChartId;
};

export const insertD2Chart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`Processing insert request for userId: ${id}`);

    const user = await validateRequest(id, res);
    if (!user) return;

    const chartType = await ChartType.findOne({ where: { chart_code: 'D-2' } });
    if (!chartType) throw new Error('Chart type D-2 not found');
    const apiEndpoint = chartType.getDataValue('api_endpoint');
    if (!apiEndpoint) throw new Error('API endpoint not configured for D-2');

    const existingChart = await DerivedChart.findOne({
      where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
    });
    if (existingChart) {
      res.status(400).json({ message: 'D-2 chart already exists for user' });
      return;
    }

    const cacheKey = `d2chart:${user.user_id}`;
    const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user), cacheKey);
    const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint);

    res.status(200).json({
      message: 'D2 chart inserted successfully',
      data: { derived_chart_id: derivedChartId, chart_type: 'D-2', data: derivedData },
    });
  } catch (error) {
    handleError(res, error, 'Failed to insert D-2 chart');
  }
};

export const fetchD2Chart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
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

    console.log(`Processing fetch request for userId: ${id}`);

    const user = await validateRequest(id, res);
    if (!user) return;

    if (req.body && Object.keys(req.body).length > 0) {
      await User.update(
        {
          ...(date_of_birth && { date_of_birth }),
          ...(time_of_birth && { time_of_birth }),
          ...(latitude && { latitude }),
          ...(longitude && { longitude }),
          ...(timezone_offset && { timezone_offset }),
          ...(birth_timezone && { birth_timezone }),
          ...(gender && { gender }),
          ...(full_name && { full_name }),
          ...(place_of_birth && { place_of_birth }),
          updated_at: new Date(),
        },
        { where: { user_id: id } }
      );
    }

    const updatedUser = await User.findOne({ where: { user_id: id } });
    if (!updatedUser) throw new Error('Failed to retrieve user');

    const redisKey = `d2_chart_user_${updatedUser.user_id}`;
    const cacheKey = `d2chart:${updatedUser.user_id}`;

    const cachedChart = await redisClient.get(redisKey);
    if (
      cachedChart &&
      !hasUserDetailsChanged(updatedUser, JSON.parse(cachedChart)?.data?.data?.chart?.calculation_parameters)
    ) {
      console.log(`Serving D-2 chart for userId ${updatedUser.user_id} from Redis cache`);
      res.status(200).json({
        message: 'D2 chart fetched successfully from cache',
        data: JSON.parse(cachedChart),
      });
      return;
    }

    const chartType = await ChartType.findOne({ where: { chart_code: 'D-2' } });
    if (!chartType) throw new Error('Chart type D-2 not found');
    const apiEndpoint = chartType.getDataValue('api_endpoint');
    if (!apiEndpoint) throw new Error('API endpoint not configured for D-2');

    let existingChart = await DerivedChart.findOne({
      where: { user_id: updatedUser.user_id, chart_type_id: chartType.chart_type_id },
    });

    let message = 'D2 chart fetched successfully';

    await redisClient.del(redisKey);
    await redisClient.del(cacheKey);

    if (!existingChart) {
      const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(updatedUser), cacheKey);
      const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, updatedUser, apiEndpoint);
      existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
      message = 'D2 chart created and fetched successfully';
    } else if (hasUserDetailsChanged(updatedUser, existingChart.calculation_parameters)) {
      const derivedChartId = await updateD2Chart(updatedUser, chartType, apiEndpoint, existingChart);
      existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
      message = 'D2 chart updated and fetched successfully';
    }

    if (!existingChart) throw new Error('Failed to retrieve D-2 chart');

    const [planets, houses] = await Promise.all([
      DerivedChartPlanet.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
      DerivedChartHouse.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
    ]);

    const responseData = {
      chart_type: 'D-2',
      data: {
        message: 'Derived chart data fetched from database',
        data: { chart: existingChart, planets, houses },
      },
    };

    await redisClient.setEx(redisKey, 3600, JSON.stringify(responseData));

    res.status(200).json({
      message,
      data: responseData,
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch D-2 chart');
  }
};