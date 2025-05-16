// // import axios from 'axios';
// // import { Request, Response } from 'express';
// // import { z } from 'zod';
// // import User from '../../user-management/models/user';
// // import NatalChart from '../models/natal_chart';
// // import { EntityType, Ayanamsa,  HouseSystem, ZodiacSystem } from '../models/natal_chart';
// // import { Planet } from '../models/natal_planets';
// // import { NatalHouse } from '../models/natal_houses';
// // import { NatalPlanet } from '../models/natal_planets';
// // import { v4 as uuidv4 } from 'uuid';
// // import dotenv from 'dotenv';
// // dotenv.config();

// // //astro engine url
// // const ASTRO_ENGINE_URL = process.env.Astro_Url;

// // const natalChartInputSchema = z.object({
// //   ayanamsa: z.enum(['LAHIRI', 'RAMAN', 'KP', 'TROPICAL']).optional().default('LAHIRI'),
// //   house_system: z.enum(['WHOLE_SIGN', 'PLACIDUS', 'KOCH', 'EQUAL']).optional().default('WHOLE_SIGN'),
// //   zodiac_system: z.enum(['SIDEREAL', 'TROPICAL']).optional().default('SIDEREAL')
// // }).optional();

// // interface PythonApiResponse {
// //   ascendant: { degrees: string; sign: string };
// //   birth_details: { birth_date: string; birth_time: string; latitude: number; longitude: number; timezone_offset: number };
// //   house_signs: Record<string, { sign: string; start_longitude: string }>;
// //   notes: { ayanamsa: string; ayanamsa_value: string; chart_type: string; house_system: string };
// //   planetary_positions: Record<string, { degrees: string; house: number; retrograde: string; sign: string }>;
// // }

// // // Helper function to check if user details have changed
// // const haveUserDetailsChanged = (user: User, chart: NatalChart): boolean => {
// //   const [latitude, longitude] = chart.birth_location.split(',').map(coord => parseFloat(coord.trim()));
// //   return (
// //     user.date_of_birth !== chart.birth_date ||
// //     user.time_of_birth !== chart.birth_time ||
// //     user.latitude !== latitude ||
// //     user.longitude !== longitude ||
// //     user.timezone_offset !== chart.timezone_offset ||
// //     user.place_of_birth !== chart.birth_location // Optional: Include if place_of_birth is relevant
// //   );
// // };

// // // Helper function to update natal chart
// // const updateNatalChart = async (
// //   chart: NatalChart,
// //   natalData: PythonApiResponse,
// //   userData: any,
// //   userId: string
// // ): Promise<NatalChart> => {
// //   // Update chart details
// //   await chart.update({
// //     birth_date: natalData.birth_details.birth_date,
// //     birth_time: natalData.birth_details.birth_time,
// //     birth_location: `${natalData.birth_details.latitude}, ${natalData.birth_details.longitude}`,
// //     birth_coordinates: `POINT(${natalData.birth_details.longitude} ${natalData.birth_details.latitude})`,
// //     timezone_offset: natalData.birth_details.timezone_offset,
// //     ayanamsa: (natalData.notes.ayanamsa.toUpperCase() as Ayanamsa) || Ayanamsa.LAHIRI,
// //     ayanamsa_value: parseFloat(natalData.notes.ayanamsa_value),
// //     house_system: getHouseSystem(natalData.notes.house_system),
// //     zodiac_system: (userData.zodiac_system.toUpperCase() as ZodiacSystem) || ZodiacSystem.SIDEREAL,
// //     ascendant_sign: natalData.ascendant.sign,
// //     ascendant_degree: parseDegreesToDecimal(natalData.ascendant.degrees),
// //     ascendant_degree_formatted: natalData.ascendant.degrees,
// //     chart_data: {
// //       house_signs: natalData.house_signs,
// //       planetary_positions: natalData.planetary_positions
// //     },
// //     updated_at: new Date()
// //   });

// //   // Delete existing houses and planets
// //   await NatalHouse.destroy({ where: { chart_id: chart.chart_id } });
// //   await NatalPlanet.destroy({ where: { chart_id: chart.chart_id } });

// //   // Create new houses
// //   await Promise.all(
// //     Object.entries(natalData.house_signs).map(([houseKey, { sign, start_longitude }]) => {
// //       const house_number = parseInt(houseKey.replace('House ', ''));
// //       return createNatalHouse(chart.chart_id, house_number, sign, start_longitude);
// //     })
// //   );

// //   // Create new planets
// //   await Promise.all(
// //     Object.entries(natalData.planetary_positions).map(([planet, { degrees, house, retrograde, sign }]) => {
// //       return createNatalPlanet(chart.chart_id, planet, sign, house, degrees, retrograde);
// //     })
// //   );

// //   return chart;
// // };

// // export const fetchNatalData = async (req: Request, res: Response): Promise<void> => {
// //   console.log('✅ Route reached:', req.params.userId);
// //   try {
// //     const userId = req.params.userId;
// //     const input = natalChartInputSchema.parse(req.body || {});
// //     const user = await User.findOne({ where: { user_id: userId } });

// //     if (!user) {
// //       res.status(404).json({ message: 'User not found' });
// //       return;
// //     }

// //     // Fetch natal chart from database (if exists)
// //     const natalCharts = await NatalChart.findAll({
// //       where: { user_id: userId },
// //       order: [['updated_at', 'DESC']] // Get the most recent chart
// //     });

// //     if (natalCharts.length > 0) {
// //       const natalChart = natalCharts[0];
// //       const chartId = natalChart.chart_id;

// //       // Check if user details have changed
// //       if (haveUserDetailsChanged(user, natalChart)) {
// //         // User details have changed, update the chart
// //         const userData = {
// //           user_name: user.full_name,
// //           birth_date: user.date_of_birth,
// //           birth_time: user.time_of_birth,
// //           latitude: user.latitude,
// //           longitude: user.longitude,
// //           timezone_offset: user.timezone_offset,
// //           ayanamsa: input?.ayanamsa ?? 'LAHIRI',
// //           house_system: input?.house_system ?? 'WHOLE_SIGN',
// //           zodiac_system: input?.zodiac_system ?? 'SIDEREAL'
// //         };

// //         // Call Python API for updated natal chart data
// //         console.log('Sending API request with payload:', JSON.stringify(userData, null, 2));
// //         const fullUrl = `${ASTRO_ENGINE_URL}/natal`;
// //         const response = await axios.post<PythonApiResponse>(fullUrl, userData);
// //         const natalData = response.data;

// //         if (!natalData || !natalData.planetary_positions || !natalData.house_signs || !natalData.ascendant) {
// //           res.status(400).json({ message: 'Invalid natal data received from Astro Engine' });
// //           return;
// //         }

// //         // Update the existing chart
// //         const updatedChart = await updateNatalChart(natalChart, natalData, userData, userId);

// //         // Fetch updated houses and planets
// //         const houses = await getHousesByChartId(chartId);
// //         const planets = await getPlanetsByChartId(chartId);
// //         const formattedData = formatNatalData(user, updatedChart, houses, planets);

// //         res.status(200).json({
// //           message: 'Natal chart updated successfully due to changed user details',
// //           data: formattedData
// //         });
// //         return;
// //       }

// //       // No changes in user details, return existing chart
// //       const houses = await getHousesByChartId(chartId);
// //       const planets = await getPlanetsByChartId(chartId);
// //       const formattedData = formatNatalData(user, natalChart, houses, planets);
// //       res.status(200).json({
// //         message: 'Natal data fetched successfully from database',
// //         data: formattedData
// //       });
// //       return;
// //     }

// //     // No existing chart, create a new one
// //     const userData = {
// //       user_name: user.full_name,
// //       birth_date: user.date_of_birth,
// //       birth_time: user.time_of_birth,
// //       latitude: user.latitude,
// //       longitude: user.longitude,
// //       timezone_offset: user.timezone_offset,
// //       ayanamsa: input?.ayanamsa ?? 'LAHIRI',
// //       house_system: input?.house_system ?? 'WHOLE_SIGN',
// //       zodiac_system: input?.zodiac_system ?? 'SIDEREAL'
// //     };

// //     // Call Python API for natal chart data
// //     console.log('Sending API request with payload:', JSON.stringify(userData, null, 2));
// //     const fullUrl = `${ASTRO_ENGINE_URL}/natal`;
// //     const response = await axios.post<PythonApiResponse>(fullUrl, userData);
// //     const natalData = response.data;

// //     if (!natalData || !natalData.planetary_positions || !natalData.house_signs || !natalData.ascendant) {
// //       res.status(400).json({ message: 'Invalid natal data received from Astro Engine' });
// //       return;
// //     }

// //     // Save new natal chart to the database
// //     const newNatalChart = await NatalChart.create({
// //       chart_id: uuidv4(),
// //       entity_type: EntityType.USER,
// //       user_id: userId,
// //       birth_date: natalData.birth_details.birth_date,
// //       birth_time: natalData.birth_details.birth_time,
// //       birth_location: `${natalData.birth_details.latitude}, ${natalData.birth_details.longitude}`,
// //       birth_coordinates: `POINT(${natalData.birth_details.longitude} ${natalData.birth_details.latitude})`,
// //       timezone_offset: natalData.birth_details.timezone_offset,
// //       ayanamsa: (natalData.notes.ayanamsa.toUpperCase() as Ayanamsa) || Ayanamsa.LAHIRI,
// //       ayanamsa_value: parseFloat(natalData.notes.ayanamsa_value),
// //       house_system: getHouseSystem(natalData.notes.house_system),
// //       zodiac_system: (userData.zodiac_system.toUpperCase() as ZodiacSystem) || ZodiacSystem.SIDEREAL,
// //       ascendant_sign: natalData.ascendant.sign,
// //       ascendant_degree: parseDegreesToDecimal(natalData.ascendant.degrees),
// //       ascendant_degree_formatted: natalData.ascendant.degrees,
// //       chart_data: {
// //         house_signs: natalData.house_signs,
// //         planetary_positions: natalData.planetary_positions
// //       },
// //       created_at: new Date(),
// //       updated_at: new Date()
// //     });

// //     // Save houses and planets data
// //     await Promise.all(
// //       Object.entries(natalData.house_signs).map(([houseKey, { sign, start_longitude }]) => {
// //         const house_number = parseInt(houseKey.replace('House ', ''));
// //         return createNatalHouse(newNatalChart.chart_id, house_number, sign, start_longitude);
// //       })
// //     );

// //     await Promise.all(
// //       Object.entries(natalData.planetary_positions).map(([planet, { degrees, house, retrograde, sign }]) => {
// //         return createNatalPlanet(newNatalChart.chart_id, planet, sign, house, degrees, retrograde);
// //       })
// //     );

// //     const houses = await getHousesByChartId(newNatalChart.chart_id);
// //     const planets = await getPlanetsByChartId(newNatalChart.chart_id);
// //     const formattedData = formatNatalData(user, newNatalChart, houses, planets);

// //     res.status(201).json({
// //       message: 'Natal chart created successfully',
// //       data: formattedData
// //     });
// //   } catch (error: any) {
// //     if (error instanceof z.ZodError) {
// //       res.status(400).json({ message: 'Invalid input', details: error.errors });
// //     } else {
// //       console.error('Error fetching natal data:', error);
// //       res.status(500).json({ message: 'Failed to fetch natal data', error: error.message });
// //     }
// //   }
// // };

// // // Utility functions for handling houses, planets, and house system
// // const getHousesByChartId = async (chartId: string) => {
// //   return await NatalHouse.findAll({ where: { chart_id: chartId } });
// // };

// // const getPlanetsByChartId = async (chartId: string) => {
// //   return await NatalPlanet.findAll({ where: { chart_id: chartId } });
// // };

// // const createNatalHouse = async (chartId: string, houseNumber: number, sign: string, startLongitude: string) => {
// //   return await NatalHouse.create({
// //     chart_id: chartId,
// //     house_number: houseNumber,
// //     sign: sign,
// //     start_longitude: parseDegreesToDecimal(startLongitude),
// //     start_longitude_formatted: startLongitude,
// //     created_at: new Date(),
// //     house_id: uuidv4()
// //   });
// // };

// // const createNatalPlanet = async (chartId: string, planet: string, sign: string, house: number, degrees: string, retrograde: string) => {
// //   return await NatalPlanet.create({
// //     position_id: uuidv4(),
// //     chart_id: chartId,
// //     planet: planet.toUpperCase() as Planet,
// //     sign,
// //     house,
// //     longitude: parseDegreesToDecimal(degrees),
// //     degree_formatted: degrees,
// //     is_retrograde: retrograde === 'R',
// //     retrograde_indicator: retrograde,
// //     created_at: new Date(),
// //   });
// // };

// // const getHouseSystem = (houseSystem: string) => {
// //   const systemName = houseSystem.toUpperCase().replace(/\s+/g, '_');
// //   return Object.values(HouseSystem).includes(systemName as HouseSystem)
// //     ? (systemName as HouseSystem)
// //     : HouseSystem.WHOLE_SIGN;
// // };

// // function formatNatalData(user: User, natalChart: NatalChart, houses: any[], planets: any[]): any {
// //   return {
// //     user_name: user.full_name,
// //     birth_details: {
// //       birth_date: natalChart.birth_date,
// //       birth_time: natalChart.birth_time,
// //       latitude: parseFloat(natalChart.birth_location.split(',')[0]),
// //       longitude: parseFloat(natalChart.birth_location.split(',')[1]),
// //       timezone_offset: natalChart.timezone_offset
// //     },
// //     ascendant: {
// //       sign: natalChart.ascendant_sign,
// //       degrees: natalChart.ascendant_degree_formatted
// //     },
// //     house_signs: houses.reduce((acc, house) => ({
// //       ...acc,
// //       [`House ${house.house_number}`]: {
// //         sign: house.sign,
// //         start_longitude: house.start_longitude_formatted
// //       }
// //     }), {}),
// //     planetary_positions: planets.reduce((acc, planet) => ({
// //       ...acc,
// //       [planet.planet]: {
// //         sign: planet.sign,
// //         house: planet.house,
// //         degrees: planet.degree_formatted,
// //         retrograde: planet.retrograde_indicator
// //       }
// //     }), {}),
// //     notes: {
// //       ayanamsa: natalChart.ayanamsa,
// //       ayanamsa_value: natalChart.ayanamsa_value.toString(),
// //       chart_type: 'Rasi',
// //       house_system: natalChart.house_system
// //     }
// //   };
// // }

// // function parseDegreesToDecimal(dms: string): number {
// //   const regex = /(\d+)°\s*(\d+)'(?:\s*(\d+(?:\.\d+)?)")?/;
// //   const match = dms.match(regex);
// //   if (!match) {
// //     throw new Error(`Invalid degree format: ${dms}`);
// //   }
// //   const degrees = parseInt(match[1]);
// //   const minutes = parseInt(match[2]);
// //   const seconds = match[3] ? parseFloat(match[3]) : 0;
// //   return degrees + minutes / 60 + seconds / 3600;
// // }


import axios from 'axios';
import { Request, Response } from 'express';
import { z } from 'zod';
import User from '../../user-management/models/user';
import NatalChart from '../models/natal_chart';
import { EntityType, Ayanamsa,  HouseSystem, ZodiacSystem } from '../models/natal_chart';
import { Planet } from '../models/natal_planets';
import { NatalHouse } from '../models/natal_houses';
import { NatalPlanet } from '../models/natal_planets';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

//astro engine url
const ASTRO_ENGINE_URL = process.env.Astro_Url;

const natalChartInputSchema = z.object({
  ayanamsa: z.enum(['LAHIRI', 'RAMAN', 'KP', 'TROPICAL']).optional().default('LAHIRI'),
  house_system: z.enum(['WHOLE_SIGN', 'PLACIDUS', 'KOCH', 'EQUAL']).optional().default('WHOLE_SIGN'),
  zodiac_system: z.enum(['SIDEREAL', 'TROPICAL']).optional().default('SIDEREAL')
}).optional();

interface PythonApiResponse {
  ascendant: { degrees: string; sign: string };
  birth_details: { birth_date: string; birth_time: string; latitude: number; longitude: number; timezone_offset: number };
  house_signs: Record<string, { sign: string; start_longitude: string }>;
  notes: { ayanamsa: string; ayanamsa_value: string; chart_type: string; house_system: string };
  planetary_positions: Record<string, { degrees: string; house: number; retrograde: string; sign: string }>;
}

// Helper function to check if user details have changed
const haveUserDetailsChanged = (user: User, chart: NatalChart): boolean => {
  const [latitude, longitude] = chart.birth_location.split(',').map(coord => parseFloat(coord.trim()));
  return (
    user.date_of_birth !== chart.birth_date ||
    user.time_of_birth !== chart.birth_time ||
    user.latitude !== latitude ||
    user.longitude !== longitude ||
    user.timezone_offset !== chart.timezone_offset ||
    user.place_of_birth !== chart.birth_location // Optional: Include if place_of_birth is relevant
  );
};

// Helper function to update natal chart
const updateNatalChart = async (
  chart: NatalChart,
  natalData: PythonApiResponse,
  userData: any,
  userId: string
): Promise<NatalChart> => {
  // Update chart details
  await chart.update({
    birth_date: natalData.birth_details.birth_date,
    birth_time: natalData.birth_details.birth_time,
    birth_location: `${natalData.birth_details.latitude}, ${natalData.birth_details.longitude}`,
    birth_coordinates: `POINT(${natalData.birth_details.longitude} ${natalData.birth_details.latitude})`,
    timezone_offset: natalData.birth_details.timezone_offset,
    ayanamsa: (natalData.notes.ayanamsa.toUpperCase() as Ayanamsa) || Ayanamsa.LAHIRI,
    ayanamsa_value: parseFloat(natalData.notes.ayanamsa_value),
    house_system: getHouseSystem(natalData.notes.house_system),
    zodiac_system: (userData.zodiac_system.toUpperCase() as ZodiacSystem) || ZodiacSystem.SIDEREAL,
    ascendant_sign: natalData.ascendant.sign,
    ascendant_degree: parseDegreesToDecimal(natalData.ascendant.degrees),
    ascendant_degree_formatted: natalData.ascendant.degrees,
    chart_data: {
      ascendant: natalData.ascendant,
      birth_details: natalData.birth_details,       
      house_signs: natalData.house_signs,
      notes: natalData.notes,
      planetary_positions: natalData.planetary_positions
    },
    updated_at: new Date()
  });

  // Delete existing houses and planets
  await NatalHouse.destroy({ where: { chart_id: chart.chart_id } });
  await NatalPlanet.destroy({ where: { chart_id: chart.chart_id } });

  // Create new houses
  await Promise.all(
    Object.entries(natalData.house_signs).map(([houseKey, { sign, start_longitude }]) => {
      const house_number = parseInt(houseKey.replace('House ', ''));
      return createNatalHouse(chart.chart_id, house_number, sign, start_longitude);
    })
  );

  // Create new planets
  await Promise.all(
    Object.entries(natalData.planetary_positions).map(([planet, { degrees, house, retrograde, sign }]) => {
      return createNatalPlanet(chart.chart_id, planet, sign, house, degrees, retrograde);
    })
  );

  return chart;
};

export const fetchNatalData = async (req: Request, res: Response): Promise<void> => {
  console.log('✅ Route reached:', req.params.userId);
  try {
    const userId = req.params.userId;
    const input = natalChartInputSchema.parse(req.body || {});
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Fetch natal chart from database (if exists)
    const natalCharts = await NatalChart.findAll({
      where: { user_id: userId },
      order: [['updated_at', 'DESC']] // Get the most recent chart
    });

    if (natalCharts.length > 0) {
      const natalChart = natalCharts[0];
      const chartId = natalChart.chart_id;

      // Check if user details have changed
      if (haveUserDetailsChanged(user, natalChart)) {
        // User details have changed, update the chart
        const userData = {
          user_name: user.full_name,
          birth_date: user.date_of_birth,
          birth_time: user.time_of_birth,
          latitude: user.latitude,
          longitude: user.longitude,
          timezone_offset: user.timezone_offset,
          ayanamsa: input?.ayanamsa ?? 'LAHIRI',
          house_system: input?.house_system ?? 'WHOLE_SIGN',
          zodiac_system: input?.zodiac_system ?? 'SIDEREAL'
        };

        // Call Python API for updated natal chart data
        console.log('Sending API request with payload:', JSON.stringify(userData, null, 2));
        const fullUrl = `${ASTRO_ENGINE_URL}/lahairi_natal`;
        const response = await axios.post<PythonApiResponse>(fullUrl, userData);
        const natalData = response.data;

        if (!natalData || !natalData.planetary_positions || !natalData.house_signs || !natalData.ascendant) {
          res.status(400).json({ message: 'Invalid natal data received from Astro Engine' });
          return;
        }

        // Update the existing chart
        const updatedChart = await updateNatalChart(natalChart, natalData, userData, userId);

        // Fetch updated houses and planets
        const houses = await getHousesByChartId(chartId);
        const planets = await getPlanetsByChartId(chartId);
        const formattedData = formatNatalData(user, updatedChart, houses, planets);

        res.status(200).json({
          message: 'Natal chart updated successfully due to changed user details',
          data: formattedData
        });
        return;
      }

      // No changes in user details, return existing chart
      const houses = await getHousesByChartId(chartId);
      const planets = await getPlanetsByChartId(chartId);
      const formattedData = formatNatalData(user, natalChart, houses, planets);
      res.status(200).json({
        message: 'Natal data fetched successfully from database',
        data: formattedData
      });
      return;
    }

    // No existing chart, create a new one
    const userData = {
      user_name: user.full_name,
      birth_date: user.date_of_birth,
      birth_time: user.time_of_birth,
      latitude: user.latitude,
      longitude: user.longitude,
      timezone_offset: user.timezone_offset,
      ayanamsa: input?.ayanamsa ?? 'LAHIRI',
      house_system: input?.house_system ?? 'WHOLE_SIGN',
      zodiac_system: input?.zodiac_system ?? 'SIDEREAL'
    };

    // Call Python API for natal chart data
    console.log('Sending API request with payload:', JSON.stringify(userData, null, 2));
    const fullUrl = `${ASTRO_ENGINE_URL}/lahairi_natal`;
    const response = await axios.post<PythonApiResponse>(fullUrl, userData);
    const natalData = response.data;

    if (!natalData || !natalData.planetary_positions || !natalData.house_signs || !natalData.ascendant) {
      res.status(400).json({ message: 'Invalid natal data received from Astro Engine' });
      return;
    }

    // Save new natal chart to the database
    const newNatalChart = await NatalChart.create({
      chart_id: uuidv4(),
      entity_type: EntityType.USER,
      user_id: userId,
      birth_date: natalData.birth_details.birth_date,
      birth_time: natalData.birth_details.birth_time,
      birth_location: `${natalData.birth_details.latitude}, ${natalData.birth_details.longitude}`,
      birth_coordinates: `POINT(${natalData.birth_details.longitude} ${natalData.birth_details.latitude})`,
      timezone_offset: natalData.birth_details.timezone_offset,
      ayanamsa: (natalData.notes.ayanamsa.toUpperCase() as Ayanamsa) || Ayanamsa.LAHIRI,
      ayanamsa_value: parseFloat(natalData.notes.ayanamsa_value),
      house_system: getHouseSystem(natalData.notes.house_system),
      zodiac_system: (userData.zodiac_system.toUpperCase() as ZodiacSystem) || ZodiacSystem.SIDEREAL,
      ascendant_sign: natalData.ascendant.sign,
      ascendant_degree: parseDegreesToDecimal(natalData.ascendant.degrees),
      ascendant_degree_formatted: natalData.ascendant.degrees,
      chart_data: {
      ascendant: natalData.ascendant,
      birth_details: natalData.birth_details,       
      house_signs: natalData.house_signs,
      notes: natalData.notes,
      planetary_positions: natalData.planetary_positions
    },
      created_at: new Date(),
      updated_at: new Date()
    });

    // Save houses and planets data
    await Promise.all(
      Object.entries(natalData.house_signs).map(([houseKey, { sign, start_longitude }]) => {
        const house_number = parseInt(houseKey.replace('House ', ''));
        return createNatalHouse(newNatalChart.chart_id, house_number, sign, start_longitude);
      })
    );

    await Promise.all(
      Object.entries(natalData.planetary_positions).map(([planet, { degrees, house, retrograde, sign }]) => {
        return createNatalPlanet(newNatalChart.chart_id, planet, sign, house, degrees, retrograde);
      })
    );

    const houses = await getHousesByChartId(newNatalChart.chart_id);
    const planets = await getPlanetsByChartId(newNatalChart.chart_id);
    const formattedData = formatNatalData(user, newNatalChart, houses, planets);

    res.status(201).json({
      message: 'Natal chart created successfully',
      data: formattedData
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid input', details: error.errors });
    } else {
      console.error('Error fetching natal data:', error);
      res.status(500).json({ message: 'Failed to fetch natal data', error: error.message });
    }
  }
};

// Utility functions for handling houses, planets, and house system
const getHousesByChartId = async (chartId: string) => {
  return await NatalHouse.findAll({ where: { chart_id: chartId } });
};

const getPlanetsByChartId = async (chartId: string) => {
  return await NatalPlanet.findAll({ where: { chart_id: chartId } });
};

const createNatalHouse = async (chartId: string, houseNumber: number, sign: string, startLongitude: string) => {
  return await NatalHouse.create({
    chart_id: chartId,
    house_number: houseNumber,
    sign: sign,
    start_longitude: parseDegreesToDecimal(startLongitude),
    start_longitude_formatted: startLongitude,
    created_at: new Date(),
    house_id: uuidv4()
  });
};

const createNatalPlanet = async (chartId: string, planet: string, sign: string, house: number, degrees: string, retrograde: string) => {
  return await NatalPlanet.create({
    position_id: uuidv4(),
    chart_id: chartId,
    planet: planet.toUpperCase() as Planet,
    sign,
    house,
    longitude: parseDegreesToDecimal(degrees),
    degree_formatted: degrees,
    is_retrograde: retrograde === 'R',
    retrograde_indicator: retrograde,
    created_at: new Date(),
  });
};

const getHouseSystem = (houseSystem: string) => {
  const systemName = houseSystem.toUpperCase().replace(/\s+/g, '_');
  return Object.values(HouseSystem).includes(systemName as HouseSystem)
    ? (systemName as HouseSystem)
    : HouseSystem.WHOLE_SIGN;
};

function formatNatalData(user: User, natalChart: NatalChart, houses: any[], planets: any[]): any {
  return {
    user_name: user.full_name,
    birth_details: {
      birth_date: natalChart.birth_date,
      birth_time: natalChart.birth_time,
      latitude: parseFloat(natalChart.birth_location.split(',')[0]),
      longitude: parseFloat(natalChart.birth_location.split(',')[1]),
      timezone_offset: natalChart.timezone_offset
    },
    ascendant: {
      sign: natalChart.ascendant_sign,
      degrees: natalChart.ascendant_degree_formatted
    },
    house_signs: houses.reduce((acc, house) => ({
      ...acc,
      [`House ${house.house_number}`]: {
        sign: house.sign,
        start_longitude: house.start_longitude_formatted
      }
    }), {}),
    planetary_positions: planets.reduce((acc, planet) => ({
      ...acc,
      [planet.planet]: {
        sign: planet.sign,
        house: planet.house,
        degrees: planet.degree_formatted,
        retrograde: planet.retrograde_indicator
      }
    }), {}),
    notes: {
      ayanamsa: natalChart.ayanamsa,
      ayanamsa_value: natalChart.ayanamsa_value.toString(),
      chart_type: 'Rasi',
      house_system: natalChart.house_system
    }
  };
}

function parseDegreesToDecimal(dms: string): number {
  const regex = /(\d+)°\s*(\d+)'(?:\s*(\d+(?:\.\d+)?)")?/;
  const match = dms.match(regex);
  if (!match) {
    throw new Error(`Invalid degree format: ${dms}`);
  }
  const degrees = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const seconds = match[3] ? parseFloat(match[3]) : 0;
  return degrees + minutes / 60 + seconds / 3600;
}
