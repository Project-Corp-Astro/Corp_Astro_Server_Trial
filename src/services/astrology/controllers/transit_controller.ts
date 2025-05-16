import { Request, Response } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import User from '../../user-management/models/user';
import TransitChart from '../models/transitChart';
import TransitChartPlanet from '../models/transit_chart_planet';
import { redisClient } from '../../../config/redis.config';
import dotenv from 'dotenv';
dotenv.config();

const ASTRO_ENGINE_URL = process.env.Astro_Url;

// Helper function to format date as "YYYY-MM-DD HH:mm:ss UTC"
const formatDateUTC = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`;
};

// Helper function to transform chart and planets into desired response format
const transformResponse = (chart: any, planets: any[], user: any) => {
  const chartData = chart.chart_data || {};
  const notes = chartData.notes || {};

  // Build transit_positions object
  const transitPositions = planets.reduce((acc: any, planet: any) => {
    acc[planet.planet] = {
      degrees: planet.degree_formatted || '',
      house: planet.house || null,
      retrograde: planet.retrograde_indicator || '',
      sign: planet.sign || null,
    };
    return acc;
  }, {});

  return {
    birth_details: {
      birth_date: user.date_of_birth || '',
      birth_time: user.time_of_birth || '',
      latitude: user.latitude,
      longitude: user.longitude,
      timezone_offset: user.timezone_offset || 0,
    },
    natal_ascendant: {
      degrees: chartData.natal_ascendant?.degrees || '',
      sign: chartData.natal_ascendant?.sign || '',
    },
    notes: {
      ayanamsa: notes.ayanamsa || 'Lahiri',
      ayanamsa_value_birth: notes.ayanamsa_value_birth || null,
      ayanamsa_value_transit: notes.ayanamsa_value_transit || null,
      chart_type: notes.chart_type || 'Transit',
      house_system: notes.house_system || 'Whole Sign',
    },
    transit_positions: transitPositions,
    transit_time: formatDateUTC(new Date(chart.transit_time)),
    user_name: user.full_name || 'Unknown',
  };
};

// Helper function to compare user details
function hasUserDetailsChanged(user: User, storedParams: any): boolean {
  return (
    user.date_of_birth !== storedParams?.birth_date ||
    user.time_of_birth !== storedParams?.birth_time ||
    user.latitude !== storedParams?.latitude ||
    user.longitude !== storedParams?.longitude ||
    user.timezone_offset !== storedParams?.timezone_offset
  );
}

// Helper function to save or update chart data to the database
async function saveChartData(derivedData: any, user: any, transitTime: Date): Promise<string> {
  const chartData = {
    natal_ascendant: derivedData.natal_ascendant || {},
    birth_details: derivedData.birth_details || {
      birth_date: user.date_of_birth,
      birth_time: user.time_of_birth,
      latitude: user.latitude,
      longitude: user.longitude,
      timezone_offset: user.timezone_offset,
    },
    notes: {
      ayanamsa: derivedData.notes?.ayanamsa || derivedData.ayanamsa || 'Lahiri',
      ayanamsa_value_birth: derivedData.ayanamsa_value_birth || derivedData.notes?.ayanamsa_value_birth || derivedData.metadata?.ayanamsa_value_birth || null,
      ayanamsa_value_transit: derivedData.ayanamsa_value_transit || derivedData.notes?.ayanamsa_value_transit || derivedData.metadata?.ayanamsa_value_transit || null,
      calculation_time: derivedData.transit_time || transitTime.toISOString(),
      chart_type: derivedData.notes?.chart_type || derivedData.chart_type || 'Transit',
      house_system: derivedData.notes?.house_system || derivedData.house_system || 'Whole Sign',
    },
  };

  let transitChart = await TransitChart.findOne({
    where: { user_id: user.user_id },
  });

  let transitChartId: string;

  if (transitChart) {
    transitChartId = transitChart.transit_chart_id;
    await transitChart.update({
      chart_data: chartData,
      transit_time: transitTime,
      notes: JSON.stringify(chartData.notes),
      updated_at: new Date(),
    });

    await TransitChartPlanet.destroy({
      where: { transit_id: transitChartId },
    });
  } else {
    transitChartId = uuidv4();
    transitChart = await TransitChart.create({
      transit_chart_id: transitChartId,
      user_id: user.user_id,
      chart_data: chartData,
      transit_time: transitTime,
      notes: JSON.stringify(chartData.notes),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  const planetData = derivedData.transit_positions || {};
  const planetPromises = Object.entries(planetData).map(([planet, data]: [string, any]) =>
    TransitChartPlanet.create({
      position_id: uuidv4(),
      transit_id: transitChartId,
      planet: planet,
      sign: data.sign || null,
      house: data.house || null,
      degree_formatted: data.degrees || data.degree_formatted || null,
      is_retrograde: data.retrograde === 'R' || data.is_retrograde || false,
      retrograde_indicator: data.retrograde || '',
      created_at: new Date(),
      updated_at: new Date(),
    })
  );
  await Promise.all(planetPromises);

  return transitChartId;
}

// Helper function to validate and update user details
async function updateUserDetails(
  user: any,
  details: {
    date_of_birth?: string;
    time_of_birth?: string;
    latitude?: number;
    longitude?: number;
    timezone_offset?: number;
    birth_timezone?: string;
    place_of_birth?: string;
    full_name?: string;
  },
  res: Response
): Promise<boolean> {
  const { date_of_birth, time_of_birth, latitude, longitude, timezone_offset, birth_timezone, place_of_birth, full_name } = details;

  if (!date_of_birth || !time_of_birth || latitude === undefined || longitude === undefined || timezone_offset === undefined) {
    res.status(400).json({ error: 'Incomplete birth details provided' });
    return false;
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
  if (!dateRegex.test(date_of_birth) || !timeRegex.test(time_of_birth)) {
    res.status(400).json({ error: 'Invalid date or time format' });
    return false;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    res.status(400).json({ error: 'Invalid latitude or longitude values' });
    return false;
  }

  await user.update({
    date_of_birth,
    time_of_birth,
    latitude: Number(latitude),
    longitude: Number(longitude),
    timezone_offset: Number(timezone_offset),
    birth_timezone: birth_timezone || user.birth_timezone,
    place_of_birth: place_of_birth || user.place_of_birth,
    full_name: full_name || user.full_name,
    updated_at: new Date(),
  });

  return true;
}

// Helper function to call astrology API with caching
async function callAstroApi(payload: any, cacheKey: string): Promise<any> {
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    console.log('Returning Transit Chart from Redis cache.');
    return JSON.parse(cached);
  }

  const fullUrl = `${ASTRO_ENGINE_URL}/transit`;
  try {
    console.log('Sending API request to:', fullUrl);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    const response = await axios.post(fullUrl, payload, { timeout: 10000 });
    console.log('API response:', JSON.stringify(response.data, null, 2));
    await redisClient.set(cacheKey, JSON.stringify(response.data), { EX: 3600 });
    return response.data;
  } catch (axiosError: any) {
    console.log('Retrying with /transit endpoint...');
    try {
      const response = await axios.post(fullUrl, payload, { timeout: 10000 });
      console.log('API response:', JSON.stringify(response.data, null, 2));
      await redisClient.set(cacheKey, JSON.stringify(response.data), { EX: 3600 });
      return response.data;
    } catch (retryError: any) {
      throw new Error(retryError?.response?.data?.error || retryError.message);
    }
  }
}

// Helper function to generate or update a Transit chart
async function generateTransitChart(user: any, cacheKey: string): Promise<any> {
  const currentTime = new Date();
  const userData = {
    chart_type: 'Transit',
    birth_date: user.date_of_birth,
    birth_time: user.time_of_birth,
    latitude: user.latitude,
    longitude: user.longitude,
    timezone_offset: user.timezone_offset || 0,
    lat: user.latitude,
    lon: user.longitude,
    tz_offset: user.timezone_offset || 0,
    timezone: user.birth_timezone || 'Asia/Kolkata',
    ayanamsa: 'lahiri',
    house_system: 'whole_sign',
    zodiac_system: 'sidereal',
    place_of_birth: user.place_of_birth || 'Unknown',
    user_name: user.full_name || 'Unknown',
    transit_time: currentTime.toISOString().replace('T', ' ').slice(0, 19),
  };

  const chartData = await callAstroApi(userData, cacheKey);
  if (!chartData) return null;

  const transitChartId = await saveChartData(chartData, user, currentTime);
  const updatedChart = await TransitChart.findOne({
    where: { transit_chart_id: transitChartId },
  });

  if (!updatedChart) return null;

  const planets = await TransitChartPlanet.findAll({
    where: { transit_id: transitChartId },
  });

  return { chart: updatedChart, planets };
}

// Fetch Transit chart with optional update
export const fetchTransitChart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      date_of_birth,
      time_of_birth,
      latitude,
      longitude,
      timezone_offset,
      birth_timezone,
      place_of_birth,
      full_name,
    } = req.body || {};

    if (!id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    const user = await User.findOne({ where: { user_id: id } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const redisKey = `transit_chart_user_${user.user_id}`;
    const cacheKey = `transitchart:${user.user_id}`;

    const cachedChart = await redisClient.get(redisKey);
    if (
      cachedChart &&
      !hasUserDetailsChanged(user, JSON.parse(cachedChart)?.birth_details)
    ) {
      console.log(`Serving Transit Chart for userId ${user.user_id} from Redis cache`);
      res.status(200).json({
        message: 'Transit Chart fetched successfully from cache',
        data: JSON.parse(cachedChart),
      });
      return;
    }

    const hasUpdateDetails = date_of_birth || time_of_birth || latitude !== undefined || longitude !== undefined || timezone_offset !== undefined || birth_timezone || place_of_birth || full_name;

    let updatedUser = user;
    if (hasUpdateDetails) {
      const updateSuccess = await updateUserDetails(
        user,
        { date_of_birth, time_of_birth, latitude, longitude, timezone_offset, birth_timezone, place_of_birth, full_name },
        res
      );
      if (!updateSuccess) return;

      updatedUser = (await User.findOne({ where: { user_id: id } }))!;

      await redisClient.del(redisKey);
      await redisClient.del(cacheKey);

      const result = await updateTransitChartInternal(updatedUser, res);
      if (!result) return;
      const responseData = transformResponse(result.chart, result.planets, updatedUser);
      await redisClient.setEx(redisKey, 3600, JSON.stringify(responseData));
      res.status(201).json({
        message: 'Transit Chart updated and fetched successfully',
        data: responseData,
      });
      return;
    }

    if (!user.date_of_birth || !user.time_of_birth || user.latitude === null || user.longitude === null || user.timezone_offset === null) {
      res.status(400).json({ error: 'Incomplete birth details for user' });
      return;
    }

    const existingChart = await TransitChart.findOne({
      where: { user_id: id },
    });

    if (existingChart) {
      if (user.updated_at && user.updated_at > existingChart.updated_at) {
        console.log('User details updated, updating Transit chart');
        await redisClient.del(redisKey);
        await redisClient.del(cacheKey);
        const result = await updateTransitChartInternal(user, res);
        if (!result) return;
        const responseData = transformResponse(result.chart, result.planets, user);
        await redisClient.setEx(redisKey, 3600, JSON.stringify(responseData));
        res.status(201).json({
          message: 'Transit Chart updated and fetched successfully',
          data: responseData,
        });
        return;
      }

      const planets = await TransitChartPlanet.findAll({
        where: { transit_id: existingChart.transit_chart_id },
      });
      const responseData = transformResponse(existingChart, planets, user);
      await redisClient.setEx(redisKey, 3600, JSON.stringify(responseData));
      res.status(200).json({
        message: 'Transit Chart fetched successfully',
        data: responseData,
      });
      return;
    }

    await redisClient.del(redisKey);
    await redisClient.del(cacheKey);
    const result = await generateTransitChart(user, cacheKey);
    if (!result) {
      res.status(500).json({ error: 'Failed to generate Transit chart' });
      return;
    }
    const responseData = transformResponse(result.chart, result.planets, user);
    await redisClient.setEx(redisKey, 3600, JSON.stringify(responseData));
    res.status(201).json({
      message: 'Transit Chart created and fetched successfully',
      data: responseData,
    });
  } catch (error: any) {
    console.error('Error in fetchTransitChart:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Internal helper for updateTransitChart to avoid duplication
async function updateTransitChartInternal(user: any, res: Response): Promise<any> {
  const result = await generateTransitChart(user, `transitchart:${user.user_id}`);
  if (!result) {
    res.status(500).json({ error: 'Failed to update Transit chart' });
    return null;
  }
  return result;
}

// Update Transit chart with new user details
export const updateTransitChart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      date_of_birth,
      time_of_birth,
      latitude,
      longitude,
      timezone_offset,
      birth_timezone,
      place_of_birth,
      full_name,
    } = req.body;

    if (!id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    const user = await User.findOne({ where: { user_id: id } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const updateSuccess = await updateUserDetails(
      user,
      { date_of_birth, time_of_birth, latitude, longitude, timezone_offset, birth_timezone, place_of_birth, full_name },
      res
    );
    if (!updateSuccess) return;

    const updatedUser = await User.findOne({ where: { user_id: id } });
    if (!updatedUser) {
      res.status(500).json({ error: 'Failed to retrieve updated user' });
      return;
    }

    if (!updatedUser.date_of_birth || !updatedUser.time_of_birth || updatedUser.latitude === null || updatedUser.longitude === null || updatedUser.timezone_offset === null) {
      res.status(400).json({ error: 'Incomplete birth details after update' });
      return;
    }

    const redisKey = `transit_chart_user_${updatedUser.user_id}`;
    const cacheKey = `transitchart:${updatedUser.user_id}`;

    await redisClient.del(redisKey);
    await redisClient.del(cacheKey);

    const result = await generateTransitChart(updatedUser, cacheKey);
    if (!result) {
      res.status(500).json({ error: 'Failed to update Transit chart' });
      return;
    }

    const responseData = transformResponse(result.chart, result.planets, updatedUser);
    await redisClient.setEx(redisKey, 3600, JSON.stringify(responseData));
    res.status(201).json({
      message: 'Transit Chart updated successfully',
      data: responseData,
    });
  } catch (error: any) {
    console.error('Error in updateTransitChart:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};