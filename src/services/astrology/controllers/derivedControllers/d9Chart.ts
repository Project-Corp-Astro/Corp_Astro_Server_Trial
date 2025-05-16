
// // // // import { Request, Response } from 'express';
// // // // import axios from 'axios';
// // // // import { v4 as uuidv4 } from 'uuid';
// // // // import { ValidationError } from 'sequelize';
// // // // import ChartType from '../../models/ChartType';
// // // // import User from '../../../user-management/models/user';
// // // // import DerivedChart from '../../models/DerivedChartModel';
// // // // import DerivedChartPlanet, { Planet } from '../../models/derived_chart_planet';
// // // // import DerivedChartHouse from '../../models/derived_chart_house';

// // // // interface ChartResponse {
// // // //   chart_type: string;
// // // //   data: any;
// // // // }

// // // // // Helper function to save chart data to the database
// // // // async function saveChartData(
// // // //   derivedData: any,
// // // //   chartType: any,
// // // //   user: any,   
// // // //   apiEndpoint: string
// // // // ): Promise<string> {
// // // //   const derivedChartId = uuidv4();
// // // //   const chartData = {
// // // //     ascendant: derivedData.ascendant || derivedData.d1_ascendant || derivedData.d12_ascendant || derivedData.d16_ascendant || derivedData.d24_ascendant || derivedData.d40_ascendant || derivedData.d3_ascendant || {},
// // // //     planetary_positions: derivedData.planetary_positions || derivedData.planets || {},
// // // //     house_signs: derivedData.house_signs || [],
// // // //     aspects: derivedData.aspects || {},
// // // //     ayanamsa_value: derivedData.notes?.ayanamsa_value || derivedData.metadata?.ayanamsa_value || null,
// // // //   };

// // // //   const newChart = await DerivedChart.create({
// // // //     derived_chart_id: derivedChartId,
// // // //     chart_code: chartType.chart_code,
// // // //     api_endpoint: apiEndpoint,
// // // //     user_id: user.user_id,
// // // //     chart_type_id: chartType.chart_type_id,
// // // //     calculation_parameters: {
// // // //       ayanamsa: 'lahiri',
// // // //       house_system: 'Whole Sign',
// // // //       zodiac_system: 'sidereal',
// // // //     },
// // // //     ascendant_sign: derivedData.ascendant?.d7_sign || derivedData.ascendant?.sign || derivedData.d1_ascendant?.sign || derivedData.d12_ascendant?.sign || derivedData.d16_ascendant?.sign || derivedData.d24_ascendant?.sign || derivedData.d40_ascendant?.d40_sign || derivedData.d40_ascendant?.sign || derivedData.d3_ascendant?.sign || '',
// // // //     ascendant_degree: (derivedData.ascendant?.degrees || derivedData.d1_ascendant?.degrees || derivedData.d12_ascendant?.degrees || derivedData.d16_ascendant?.degrees || derivedData.d24_ascendant?.degrees || derivedData.d40_ascendant?.degrees || derivedData.d3_ascendant?.degrees) && typeof (derivedData.ascendant?.degrees || derivedData.d1_ascendant?.degrees || derivedData.d12_ascendant?.degrees || derivedData.d16_ascendant?.degrees || derivedData.d24_ascendant?.degrees || derivedData.d40_ascendant?.degrees || derivedData.d3_ascendant?.degrees) === 'string'
// // // //       ? parseFloat((derivedData.ascendant?.degrees || derivedData.d1_ascendant?.degrees || derivedData.d12_ascendant?.degrees || derivedData.d16_ascendant?.degrees || derivedData.d24_ascendant?.degrees || derivedData.d40_ascendant?.degrees || derivedData.d3_ascendant?.degrees).split('°')[0])
// // // //       : derivedData.ascendant?.degrees || 0,
// // // //     ascendant_degree_formatted: derivedData.ascendant?.degrees || derivedData.d1_ascendant?.degrees || derivedData.d12_ascendant?.degrees || derivedData.d16_ascendant?.degrees || derivedData.d24_ascendant?.degrees || derivedData.d40_ascendant?.degrees || derivedData.d3_ascendant?.degrees || null,
// // // //     chart_data: chartData,
// // // //     notes: `Generated ${chartType.chart_name} chart`,
// // // //   });

// // // //   // Save planets
// // // //   const planetData = derivedData.planetary_positions || derivedData.planets || {};
// // // //   const planetPromises = Object.entries(planetData).map(([planet, data]: [string, any]) =>
// // // //     DerivedChartPlanet.create({
// // // //       position_id: uuidv4(),
// // // //       derived_chart_id: derivedChartId,
// // // //       planet: planet.toUpperCase() as Planet,
// // // //       sign: data.d7_sign || data.d3_sign || data.d40_sign || data.sign || null,
// // // //       house: data.house || null,
// // // //       longitude: data.degrees && typeof data.degrees === 'string' ? parseFloat(data.degrees.split('°')[0]) : data.degrees || 0,
// // // //       degree_formatted: data.degrees || null,
// // // //       is_retrograde: data.retrograde === 'R',
// // // //       retrograde_indicator: data.retrograde || '',
// // // //       nakshatra: data.nakshatra || null,
// // // //     })
// // // //   );
// // // //   await Promise.all(planetPromises);

// // // //   // Save houses (skip if house_signs is empty)
// // // //   const houseData = derivedData.house_signs || [];
// // // //   if (houseData.length > 0) {
// // // //     const housePromises = houseData.map((data: any) =>
// // // //       DerivedChartHouse.create({
// // // //         house_id: uuidv4(),
// // // //         derived_chart_id: derivedChartId,
// // // //         house_number: data.house || parseInt(data.house),
// // // //         sign: data.sign || data.d7_sign || data.d3_sign || data.d40_sign || null,
// // // //         start_longitude: data.start_longitude && typeof data.start_longitude === 'string' ? parseFloat(data.start_longitude.split('°')[0]) : 0,
// // // //         start_longitude_formatted: data.start_longitude || null,
// // // //         house_lord: data.house_lord || '',
// // // //       })
// // // //     );
// // // //     await Promise.all(housePromises);
// // // //   }

// // // //   return derivedChartId;
// // // // }


// // // // export async function fetchD9Chart(user: any): Promise<ChartResponse> {
// // // //     const chartType = await ChartType.findOne({ where: { chart_code: 'D-9' } });
// // // //     if (!chartType) throw new Error('Chart type D-9 not found');
// // // //     const apiEndpoint = chartType.getDataValue('api_endpoint');
// // // //     if (!apiEndpoint) throw new Error('API endpoint not configured for D-9');
  
// // // //     const existingChart = await DerivedChart.findOne({
// // // //       where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
// // // //     });
  
// // // //     if (existingChart) {
// // // //       const planets = await DerivedChartPlanet.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } });
// // // //       const houses = await DerivedChartHouse.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } });
// // // //       return {
// // // //         chart_type: 'D-9',
// // // //         data: { message: 'Derived chart data fetched from database', data: { chart: existingChart, planets, houses } },
// // // //       };
// // // //     }
  
// // // //     const userData = {
// // // //       chart_type: 'D9',
// // // //       birth_date: user.date_of_birth,
// // // //       birth_time: user.time_of_birth,
// // // //       latitude: parseFloat(user.latitude.toString()),
// // // //       longitude: parseFloat(user.longitude.toString()),
// // // //       timezone_offset: user.timezone_offset,
// // // //       timezone: user.birth_timezone || 'Asia/Kolkata',
// // // //       ayanamsa: 'lahiri',
// // // //       house_system: 'placidus',
// // // //       zodiac_system: 'sidereal',
// // // //       gender: user.gender || 'unknown',
// // // //       name: user.full_name || 'Unknown',
// // // //       place_of_birth: user.place_of_birth || 'Unknown',
// // // //       divisional_factor: 2,
// // // //       calculation_precision: 'high',
// // // //     };
  
// // // //     const ASTRO_ENGINE_URL = process.env.ASTRO_ENGINE_URL || 'http://localhost:5000';
// // // //     const fullUrl = `${ASTRO_ENGINE_URL}${apiEndpoint}`;
// // // //     const response = await axios.post(fullUrl, userData, { timeout: 10000 });
// // // //     const derivedData = response.data;
  
// // // //     await saveChartData(derivedData, chartType, user, apiEndpoint);
// // // //     return { chart_type: 'D-9', data: derivedData };
// // // //   }

  
// // // // // Main controller
// // // // export const fetchD9ChartData = async (req: Request, res: Response): Promise<void> => {
// // // //     try {
// // // //       const { id } = req.params;
  
// // // //       console.log(`Processing request for userId: ${id}`);
  
// // // //       // Validate inputs
// // // //       if (!id) {
// // // //         res.status(400).json({ message: 'Missing required parameter: userId' });
// // // //         return;
// // // //       }
  
// // // //       // Validate UUID format
// // // //       const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// // // //       if (!uuidRegex.test(id)) {
// // // //         res.status(400).json({ message: 'Invalid userId format' });
// // // //         return;
// // // //       }
  
// // // //       // Find user for birth details
// // // //       const user = await User.findOne({ where: { user_id: id } });
// // // //       if (!user) {
// // // //         res.status(404).json({ message: `No user found for userId: ${id}` });
// // // //         return;
// // // //       }
  
// // // //       // Validate required birth details
// // // //       if (!user.date_of_birth || !user.time_of_birth || !user.latitude || !user.longitude || !user.timezone_offset) {
// // // //         res.status(400).json({ message: 'Incomplete birth details for user' });
// // // //         return;
// // // //       }
  
// // // //       // Fetch all charts
// // // //       const chartResults = await fetchD9Chart(user);
  
// // // //       res.status(200).json({
// // // //         message: 'D9 chart data fetched successfully',
// // // //         data: chartResults,
// // // //       });
// // // //     } catch (error: any) {
// // // //       console.error('Error in fetchD9ChartData:', error);
// // // //       if (error instanceof ValidationError) {
// // // //         res.status(400).json({
// // // //           message: 'Validation error occurred',
// // // //           errors: error.errors.map((e: any) => ({
// // // //             field: e.path,
// // // //             message: e.message,
// // // //             value: e.value,
// // // //           })),
// // // //         });
// // // //       } else {
// // // //         res.status(500).json({ message: 'Failed to fetch D9 chart data', error: error.message });
// // // //       }
// // // //     }
// // // //   };

// // // import { Request, Response } from 'express';
// // // import axios from 'axios';
// // // import { v4 as uuidv4 } from 'uuid';
// // // import { ValidationError } from 'sequelize';
// // // import ChartType from '../../models/ChartType';
// // // import User from '../../../user-management/models/user';
// // // import DerivedChart from '../../models/DerivedChartModel';
// // // import DerivedChartPlanet, { Planet } from '../../models/derived_chart_planet';
// // // import DerivedChartHouse from '../../models/derived_chart_house';
// // // import dotenv from 'dotenv';
// // // dotenv.config();

// // // //astro engine url
// // // const ASTRO_ENGINE_URL = process.env.Astro_Url;

// // // interface ChartResponse {
// // //   chart_type: string;
// // //   data: any;
// // // }

// // // // Helper function to save chart data to the database
// // // async function saveChartData(
// // //   derivedData: any,
// // //   chartType: any,
// // //   user: any,
// // //   apiEndpoint: string
// // // ): Promise<string> {
// // //   const derivedChartId = uuidv4();
// // //   const chartData = {
// // //     ascendant: derivedData.ascendant || {},
// // //     planetary_positions: derivedData.planetary_positions || {},
// // //     house_signs: [], // No house_signs provided in API response
// // //     aspects: derivedData.aspects || {}, // Empty if not provided by API
// // //     ayanamsa_value: derivedData.notes?.ayanamsa || 'Lahiri', // Use notes.ayanamsa
// // //   };

// // //   // Determine ascendant_sign
// // //   const ascendantSign = derivedData.ascendant?.sign || '';

// // //   // Prepare metadata
// // //   const metadata = {
// // //     ayanamsa: derivedData.notes?.ayanamsa || 'Lahiri',
// // //     ayanamsa_value: derivedData.notes?.ayanamsa_value || derivedData.metadata?.ayanamsa_value || null,
// // //     chart_type: derivedData.notes?.chart_type || `${chartType.chart_name} (${chartType.chart_code})`,
// // //     house_system: derivedData.notes?.house_system || 'Whole Sign',
// // //   };

// // //   const newChart = await DerivedChart.create({
// // //     derived_chart_id: derivedChartId,
// // //     chart_code: chartType.chart_code,
// // //     api_endpoint: apiEndpoint,
// // //     user_id: user.user_id,
// // //     chart_type_id: chartType.chart_type_id,
// // //     calculation_parameters: {
// // //       ayanamsa: 'lahiri',
// // //       house_system: 'Whole Sign',
// // //       zodiac_system: 'sidereal',
// // //     },
// // //     ascendant_sign: ascendantSign,
// // //     ascendant_degree: derivedData.ascendant?.degrees && typeof derivedData.ascendant.degrees === 'string'
// // //       ? parseFloat(derivedData.ascendant.degrees.split('°')[0])
// // //       : 0,
// // //     ascendant_degree_formatted: derivedData.ascendant?.degrees || null,
// // //     chart_data: { ...chartData, metadata }, // Include metadata in chart_data
// // //     notes: JSON.stringify(metadata), // Store as JSON string in notes
// // //     created_at: new Date(),
// // //     updated_at: new Date(),
// // //   });

// // //   // Save planets
// // //   const planetData = derivedData.planetary_positions || {};
// // //   const planetPromises = Object.entries(planetData).map(([planet, data]: [string, any]) =>
// // //     DerivedChartPlanet.create({
// // //       position_id: uuidv4(),
// // //       derived_chart_id: derivedChartId,
// // //       planet: planet.toUpperCase() as Planet,
// // //       sign: data.sign || null,
// // //       house: data.house || null,
// // //       longitude: data.degrees && typeof data.degrees === 'string' ? parseFloat(data.degrees.split('°')[0]) : 0,
// // //       degree_formatted: data.degrees || null,
// // //       is_retrograde: data.retrograde === 'R',
// // //       retrograde_indicator: data.retrograde || '',
// // //       nakshatra: undefined, // Not provided
// // //       deity: data.deity || null,
// // //       shashtiamsha: data.shashtiamsha || null,
// // //     })
// // //   );
// // //   await Promise.all(planetPromises);

// // //   // No houses to save (house_signs is empty)
// // //   return derivedChartId;
// // // }

// // // // Helper function to fetch D-9 chart
// // // export async function fetchD9Chart(user: any): Promise<ChartResponse> {
// // //   const chartType = await ChartType.findOne({ where: { chart_code: 'D-9' } });
// // //   if (!chartType) throw new Error('Chart type D-9 not found');
// // //   const apiEndpoint = chartType.getDataValue('api_endpoint');
// // //   if (!apiEndpoint) throw new Error('API endpoint not configured for D-9');

// // //   // Check for existing chart
// // //   let existingChart = await DerivedChart.findOne({
// // //     where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
// // //   });

// // //   if (!existingChart) {
// // //     // Prepare payload for D-9 chart
// // //     const userData = {
// // //       chart_type: 'D9',
// // //       birth_date: user.date_of_birth,
// // //       birth_time: user.time_of_birth,
// // //       latitude: parseFloat(user.latitude.toString()),
// // //       longitude: parseFloat(user.longitude.toString()),
// // //       timezone_offset: user.timezone_offset,
// // //       timezone: user.birth_timezone || 'Asia/Kolkata',
// // //       ayanamsa: 'lahiri',
// // //       house_system: 'whole_sign',
// // //       zodiac_system: 'sidereal',
// // //       gender: user.gender || 'unknown',
// // //       name: user.full_name || 'Unknown',
// // //       place_of_birth: user.place_of_birth || 'Unknown',
// // //       divisional_factor: 9,
// // //       calculation_precision: 'high',
// // //     };

// // //     // Call Python API
// // //     const fullUrl = `${ASTRO_ENGINE_URL}${apiEndpoint}`;
// // //     const response = await axios.post(fullUrl, userData, { timeout: 10000 });
// // //     const derivedData = response.data;

// // //     // Log API response for debugging
// // //     console.log('DerivedData for D-9:', JSON.stringify(derivedData, null, 2));

// // //     // Save chart data
// // //     const derivedChartId = await saveChartData(derivedData, chartType, user, apiEndpoint);

// // //     // Fetch the newly saved chart
// // //     existingChart = await DerivedChart.findOne({
// // //       where: { derived_chart_id: derivedChartId },
// // //     });
// // //     if (!existingChart) {
// // //       throw new Error('Failed to retrieve newly saved D-9 chart');
// // //     }
// // //   }

// // //   // Fetch planets (no houses, as house_signs is empty)
// // //   const planets = await DerivedChartPlanet.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } });
// // //   const houses = await DerivedChartHouse.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } });

// // //   return {
// // //     chart_type: 'D-9',
// // //     data: {
// // //       message: 'Derived chart data fetched from database',
// // //       data: { chart: existingChart, planets, houses },
// // //     },
// // //   };
// // // }

// // // // Main controller
// // // export const fetchD9ChartData = async (req: Request, res: Response): Promise<void> => {
// // //   try {
// // //     const { id } = req.params;

// // //     console.log(`Processing request for userId: ${id}`);

// // //     // Validate inputs
// // //     if (!id) {
// // //       res.status(400).json({ message: 'Missing required parameter: userId' });
// // //       return;
// // //     }

// // //     // Validate UUID format
// // //     const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// // //     if (!uuidRegex.test(id)) {
// // //       res.status(400).json({ message: 'Invalid userId format' });
// // //       return;
// // //     }

// // //     // Find user for birth details
// // //     const user = await User.findOne({ where: { user_id: id } });
// // //     if (!user) {
// // //       res.status(404).json({ message: `No user found for userId: ${id}` });
// // //       return;
// // //     }

// // //     // Validate required birth details
// // //     if (!user.date_of_birth || !user.time_of_birth || !user.latitude || !user.longitude || !user.timezone_offset) {
// // //       res.status(400).json({ message: 'Incomplete birth details for user' });
// // //       return;
// // //     }

// // //     // Fetch D-9 chart
// // //     const chartResults = await fetchD9Chart(user);

// // //     res.status(200).json({
// // //       message: 'D9 chart data fetched successfully',
// // //       data: chartResults,
// // //     });
// // //   } catch (error: any) {
// // //     console.error('Error in fetchD9ChartData:', error);
// // //     if (error instanceof ValidationError) {
// // //       res.status(400).json({
// // //         message: 'Validation error occurred',
// // //         errors: error.errors.map((e: any) => ({
// // //           field: e.path,
// // //           message: e.message,
// // //           value: e.value,
// // //         })),
// // //       });
// // //     } else {
// // //       res.status(500).json({ message: 'Failed to fetch D-9 chart data', error: error.message });
// // //     }
// // //   }
// // // };


// // import { Request, Response } from 'express';
// // import axios from 'axios';
// // import { v4 as uuidv4 } from 'uuid';
// // import { ValidationError } from 'sequelize';
// // import ChartType from '../../models/ChartType';
// // import User from '../../../user-management/models/user';
// // import DerivedChart from '../../models/DerivedChartModel';
// // import DerivedChartPlanet, { Planet } from '../../models/derived_chart_planet';
// // import DerivedChartHouse from '../../models/derived_chart_house';
// // import dotenv from 'dotenv';
// // import { redisClient } from '../../../../config/redis.config';

// // dotenv.config();

// // //astro engine url
// // const ASTRO_ENGINE_URL = process.env.Astro_Url;

// // interface ChartResponse {
// //   chart_type: string;
// //   data: any;
// // }

// // // Validate request inputs
// // async function validateRequest(id: string, res: Response): Promise<User | null> {
// //   if (!id) {
// //     res.status(400).json({ message: 'Missing userId' });
// //     return null;
// //   }
// //   const user = await User.findOne({ where: { user_id: id } });
// //   if (!user) {
// //     res.status(404).json({ message: `No user found for userId: ${id}` });
// //     return null;
// //   }
// //   return user;
// // }

// // // Build API payload
// // function buildApiPayload(user: User): any {
// //   return {
// //     chart_type: 'D9',
// //     birth_date: user.date_of_birth,
// //     birth_time: user.time_of_birth,
// //     latitude: parseFloat(user.latitude?.toString() || '0'),
// //     longitude: parseFloat(user.longitude?.toString() || '0'),
// //     timezone_offset: user.timezone_offset || 0,
// //     timezone: user.birth_timezone || 'Asia/Kolkata',
// //     ayanamsa: 'lahiri',
// //     house_system: 'whole_sign',
// //     zodiac_system: 'sidereal',
// //     gender: user.gender || 'unknown',
// //     name: user.full_name || 'Unknown',
// //     place_of_birth: user.place_of_birth || 'Unknown',
// //     divisional_factor: 9,
// //     calculation_precision: 'high',
// //   };
// // }

// // // Compare user details
// // function hasUserDetailsChanged(user: User, storedParams: any): boolean {
// //   return (
// //     user.date_of_birth !== storedParams?.birth_date ||
// //     user.time_of_birth !== storedParams?.birth_time ||
// //     parseFloat(user.latitude?.toString() || '0') !== storedParams?.latitude ||
// //     parseFloat(user.longitude?.toString() || '0') !== storedParams?.longitude ||
// //     user.timezone_offset !== storedParams?.timezone_offset
// //   );
// // }

// // // Parse DMS (Degrees, Minutes, Seconds) to decimal degrees
// // function parseDMSToDecimal(dms: string | undefined): number {
// //   if (!dms) return 0;
// //   try {
// //     // Regular expression to match DMS format, e.g., "5° 18' 16.73""
// //     const dmsRegex = /(\d+)°\s*(\d+)?'?\s*(\d*\.?\d*)"?/;
// //     const match = dms.match(dmsRegex);
// //     if (!match) {
// //       // Try parsing as a simple number if no DMS format
// //       const num = parseFloat(dms);
// //       return isNaN(num) ? 0 : num;
// //     }

// //     const degrees = parseFloat(match[1]) || 0;
// //     const minutes = parseFloat(match[2]) || 0;
// //     const seconds = parseFloat(match[3]) || 0;

// //     // Convert DMS to decimal: degrees + (minutes / 60) + (seconds / 3600)
// //     return degrees + minutes / 60 + seconds / 3600;
// //   } catch (error) {
// //     console.error(`Failed to parse DMS string: ${dms}`, error);
// //     return 0;
// //   }
// // }

// // // Call Python API
// // async function callAstroApi(apiEndpoint: string, payload: any): Promise<any> {
// //   const fullUrl = `${ASTRO_ENGINE_URL}${apiEndpoint}`;
// //   const response = await axios.post(fullUrl, payload, { timeout: 10000 });
// //   console.log('DerivedData for D-9:', JSON.stringify(response.data, null, 2));
// //   return response.data;
// // }

// // // Save or update chart data
// // async function saveOrUpdateChartData(
// //   derivedData: any,
// //   chartType: any,
// //   user: User,
// //   apiEndpoint: string,
// //   existingChart?: any
// // ): Promise<string> {
// //   const derivedChartId = existingChart?.derived_chart_id || uuidv4();
// //   const chartData = {
// //     ascendant: derivedData.d9_ascendant || derivedData.ascendant || {},
// //     planetary_positions: derivedData.planetary_positions || {},
// //     house_signs: derivedData.house_signs || [],
// //     aspects: derivedData.aspects || {},
// //     ayanamsa_value: derivedData.notes?.ayanamsa || derivedData.metadata?.ayanamsa || 'Lahiri',
// //   };
// //   const ascendantSign = derivedData.d9_ascendant?.sign || derivedData.ascendant?.sign || '';
// //   const metadata = {
// //     ayanamsa: derivedData.notes?.ayanamsa || derivedData.metadata?.ayanamsa || 'Lahiri',
// //     chart_type: derivedData.notes?.chart_type || derivedData.metadata?.chart_type || `${chartType.chart_name} (${chartType.chart_code})`,
// //     house_system: derivedData.notes?.house_system || derivedData.metadata?.house_system || 'Whole Sign',
// //   };
// //   const calculationParameters = {
// //     ayanamsa: 'lahiri',
// //     house_system: 'whole_sign',
// //     zodiac_system: 'sidereal',
// //     birth_date: user.date_of_birth,
// //     birth_time: user.time_of_birth,
// //     latitude: parseFloat(user.latitude?.toString() || '0'),
// //     longitude: parseFloat(user.longitude?.toString() || '0'),
// //     timezone_offset: user.timezone_offset || 0,
// //   };

// //   if (existingChart) {
// //     await Promise.all([
// //       DerivedChartPlanet.destroy({ where: { derived_chart_id: derivedChartId } }),
// //       DerivedChartHouse.destroy({ where: { derived_chart_id: derivedChartId } }),
// //       DerivedChart.update(
// //         {
// //           chart_code: chartType.chart_code,
// //           api_endpoint: apiEndpoint,
// //           user_id: user.user_id,
// //           chart_type_id: chartType.chart_type_id,
// //           calculation_parameters: calculationParameters,
// //           ascendant_sign: ascendantSign,
// //           ascendant_degree: parseDMSToDecimal(derivedData.d9_ascendant?.degrees || derivedData.ascendant?.degrees),
// //           ascendant_degree_formatted: derivedData.d9_ascendant?.degrees || derivedData.ascendant?.degrees || null,
// //           chart_data: { ...chartData, metadata },
// //           notes: JSON.stringify(metadata),
// //           updated_at: new Date(),
// //         },
// //         { where: { derived_chart_id: derivedChartId } }
// //       ),
// //     ]);
// //   } else {
// //     await DerivedChart.create({
// //       derived_chart_id: derivedChartId,
// //       chart_code: chartType.chart_code,
// //       api_endpoint: apiEndpoint,
// //       user_id: user.user_id,
// //       chart_type_id: chartType.chart_type_id,
// //       calculation_parameters: calculationParameters,
// //       ascendant_sign: ascendantSign,
// //       ascendant_degree: parseDMSToDecimal(derivedData.d9_ascendant?.degrees || derivedData.ascendant?.degrees),
// //       ascendant_degree_formatted: derivedData.d9_ascendant?.degrees || derivedData.ascendant?.degrees || null,
// //       chart_data: { ...chartData, metadata },
// //       notes: JSON.stringify(metadata),
// //       created_at: new Date(),
// //       updated_at: new Date(),
// //     });
// //   }

// //   // Save planets
// //   const planetData = derivedData.planetary_positions || {};
// //   const planetPromises = Object.entries(planetData).map(([planet, data]: [string, any]) =>
// //     DerivedChartPlanet.create({
// //       position_id: uuidv4(),
// //       derived_chart_id: derivedChartId,
// //       planet: planet.toUpperCase() as Planet,
// //       sign: data.sign || null,
// //       house: data.house || null,
// //       longitude: parseDMSToDecimal(data.degrees),
// //       degree_formatted: data.degrees || null,
// //       is_retrograde: data.retrograde === 'R',
// //       retrograde_indicator: data.retrograde || '',
// //       nakshatra: data.nakshatra || null,
// //       deity: data.deity || null,
// //       shashtiamsha: data.shashtiamsha || null,
// //     })
// //   );

// //   // Save houses
// //   const houseData = derivedData.house_signs || [];
// //   const housePromises = houseData.map((data: any) =>
// //     DerivedChartHouse.create({
// //       house_id: uuidv4(),
// //       derived_chart_id: derivedChartId,
// //       house_number: data.house || parseInt(data.house),
// //       sign: data.sign || null,
// //       start_longitude: parseDMSToDecimal(data.start_longitude),
// //       start_longitude_formatted: data.start_longitude || null,
// //       house_lord: data.house_lord || '',
// //     })
// //   );

// //   await Promise.all([...planetPromises, ...housePromises]);
// //   return derivedChartId;
// // }

// // // Handle errors
// // function handleError(res: Response, error: any, defaultMessage: string) {
// //   console.error(`Error: ${defaultMessage}`, error);
// //   if (error instanceof ValidationError) {
// //     res.status(400).json({
// //       message: 'Validation error occurred',
// //       errors: error.errors.map((e: any) => ({ field: e.path, message: e.message, value: e.value })),
// //     });
// //   } else {
// //     res.status(500).json({ message: defaultMessage, error: error.message });
// //   }
// // }

// // // Update D-9 chart
// // export const updateD9Chart = async (
// //   user: User,
// //   chartType: any,
// //   apiEndpoint: string,
// //   existingChart: any
// // ): Promise<string> => {
// //   const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user));
// //   const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint, existingChart);
// //   return derivedChartId;
// // };

// // // Insert D-9 chart
// // export const insertD9Chart = async (req: Request, res: Response): Promise<void> => {
// //   try {
// //     const { id } = req.params;
// //     console.log(`Processing insert request for userId: ${id}`);

// //     const user = await validateRequest(id, res);
// //     if (!user) return;

// //     const chartType = await ChartType.findOne({ where: { chart_code: 'D-9' } });
// //     if (!chartType) throw new Error('Chart type D-9 not found');
// //     const apiEndpoint = chartType.getDataValue('api_endpoint');
// //     if (!apiEndpoint) throw new Error('API endpoint not configured for D-9');

// //     const existingChart = await DerivedChart.findOne({
// //       where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
// //     });
// //     if (existingChart) {
// //       res.status(400).json({ message: 'D-9 chart already exists for user' });
// //       return;
// //     }

// //     const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user));
// //     const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint);

// //     res.status(200).json({
// //       message: 'D9 chart inserted successfully',
// //       data: { derived_chart_id: derivedChartId, chart_type: 'D-9', data: derivedData },
// //     });
// //   } catch (error) {
// //     handleError(res, error, 'Failed to insert D-9 chart');
// //   }
// // };

// // // Fetch D-9 chart
// // export const fetchD9Chart = async (req: Request, res: Response): Promise<void> => {
// //   try {
// //     const { id } = req.params;
// //     console.log(`Processing fetch request for userId: ${id}`);

// //     const user = await validateRequest(id, res);
// //     if (!user) return;

// //     const chartType = await ChartType.findOne({ where: { chart_code: 'D-9' } });
// //     if (!chartType) throw new Error('Chart type D-9 not found');
// //     const apiEndpoint = chartType.getDataValue('api_endpoint');
// //     if (!apiEndpoint) throw new Error('API endpoint not configured for D-9');

// //     let existingChart = await DerivedChart.findOne({
// //       where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
// //     });
// //     let message = 'D9 chart fetched successfully';

// //     if (!existingChart) {
// //       const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user));
// //       const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint);
// //       existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
// //       message = 'D9 chart created and fetched successfully';
// //     } else if (hasUserDetailsChanged(user, existingChart.calculation_parameters)) {
// //       const derivedChartId = await updateD9Chart(user, chartType, apiEndpoint, existingChart);
// //       existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
// //       message = 'D9 chart updated and fetched successfully';
// //     }

// //     if (!existingChart) throw new Error('Failed to retrieve D-9 chart');

// //     const [planets, houses] = await Promise.all([
// //       DerivedChartPlanet.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
// //       DerivedChartHouse.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
// //     ]);

// //     res.status(200).json({
// //       message,
// //       data: {
// //         chart_type: 'D-9',
// //         data: {
// //           message: 'Derived chart data fetched from database',
// //           data: { chart: existingChart },
// //         },
// //       },
// //     });
// //   } catch (error) {
// //     handleError(res, error, 'Failed to fetch D-9 chart');
// //   }
// // };

// import { Request, Response } from 'express';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import { ValidationError } from 'sequelize';
// import ChartType from '../../models/ChartType';
// import User from '../../../user-management/models/user';
// import DerivedChart from '../../models/DerivedChartModel';
// import DerivedChartPlanet, { Planet } from '../../models/derived_chart_planet';
// import DerivedChartHouse from '../../models/derived_chart_house';
// import { redisClient } from '../../../../config/redis.config';
// import dotenv from 'dotenv';
// dotenv.config();

// const ASTRO_ENGINE_URL = process.env.Astro_Url;

// interface ChartResponse {
//   chart_type: string;
//   data: any;
// }

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

// function buildApiPayload(user: User): any {
//   return {
//     chart_type: 'D9',
//     birth_date: user.date_of_birth,
//     birth_time: user.time_of_birth,
//     latitude: parseFloat(user.latitude?.toString() || '0'),
//     longitude: parseFloat(user.longitude?.toString() || '0'),
//     timezone_offset: user.timezone_offset || 0,
//     timezone: user.birth_timezone || 'Asia/Kolkata',
//     ayanamsa: 'lahiri',
//     house_system: 'whole_sign',
//     zodiac_system: 'sidereal',
//     gender: user.gender || 'unknown',
//     name: user.full_name || 'Unknown',
//     place_of_birth: user.place_of_birth || 'Unknown',
//     divisional_factor: 9,
//     calculation_precision: 'high',
//   };
// }

// function hasUserDetailsChanged(user: User, storedParams: any): boolean {
//   return (
//     user.date_of_birth !== storedParams?.birth_date ||
//     user.time_of_birth !== storedParams?.birth_time ||
//     parseFloat(user.latitude?.toString() || '0') !== storedParams?.latitude ||
//     parseFloat(user.longitude?.toString() || '0') !== storedParams?.longitude ||
//     user.timezone_offset !== storedParams?.timezone_offset
//   );
// }

// function parseDMSToDecimal(dms: string | undefined): number {
//   if (!dms) return 0;
//   try {
//     const dmsRegex = /(\d+)°\s*(\d+)?'?\s*(\d*\.?\d*)"?/;
//     const match = dms.match(dmsRegex);
//     if (!match) {
//       const num = parseFloat(dms);
//       return isNaN(num) ? 0 : num;
//     }

//     const degrees = parseFloat(match[1]) || 0;
//     const minutes = parseFloat(match[2]) || 0;
//     const seconds = parseFloat(match[3]) || 0;

//     return degrees + minutes / 60 + seconds / 3600;
//   } catch (error) {
//     console.error(`Failed to parse DMS string: ${dms}`, error);
//     return 0;
//   }
// }

// async function callAstroApi(apiEndpoint: string, payload: any, cacheKey: string): Promise<any> {
//   const cached = await redisClient.get(cacheKey);
//   if (cached) {
//     console.log('Returning D9 chart from Redis cache.');
//     return JSON.parse(cached);
//   }

//   const fullUrl = `${ASTRO_ENGINE_URL}${apiEndpoint}`;
//   const response = await axios.post(fullUrl, payload, { timeout: 10000 });
//   console.log('DerivedData for D-9:', JSON.stringify(response.data, null, 2));
//   await redisClient.set(cacheKey, JSON.stringify(response.data), { EX: 3600 });

//   return response.data;
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
//     ascendant: derivedData.d9_ascendant || derivedData.ascendant || {},
//     planetary_positions: derivedData.planetary_positions || {},
//     house_signs: derivedData.house_signs || [],
//     aspects: derivedData.aspects || {},
//     ayanamsa_value: derivedData.notes?.ayanamsa || derivedData.metadata?.ayanamsa || 'Lahiri',
//   };

//   const ascendantSign = derivedData.d9_ascendant?.sign || derivedData.ascendant?.sign || '';
//   const metadata = {
//     ayanamsa: derivedData.notes?.ayanamsa || derivedData.metadata?.ayanamsa || 'Lahiri',
//     chart_type: derivedData.notes?.chart_type || derivedData.metadata?.chart_type || `${chartType.chart_name} (${chartType.chart_code})`,
//     house_system: derivedData.notes?.house_system || derivedData.metadata?.house_system || 'Whole Sign',
//   };

//   const calculationParameters = {
//     ayanamsa: 'lahiri',
//     house_system: 'whole_sign',
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
//           ascendant_degree: parseDMSToDecimal(derivedData.d9_ascendant?.degrees || derivedData.ascendant?.degrees),
//           ascendant_degree_formatted: derivedData.d9_ascendant?.degrees || derivedData.ascendant?.degrees || null,
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
//       ascendant_degree: parseDMSToDecimal(derivedData.d9_ascendant?.degrees || derivedData.ascendant?.degrees),
//       ascendant_degree_formatted: derivedData.d9_ascendant?.degrees || derivedData.ascendant?.degrees || null,
//       chart_data: { ...chartData, metadata },
//       notes: JSON.stringify(metadata),
//       created_at: new Date(),
//       updated_at: new Date(),
//     });
//   }

//   const planetData = derivedData.planetary_positions || {};
//   const planetPromises = Object.entries(planetData).map(([planet, data]: [string, any]) =>
//     DerivedChartPlanet.create({
//       position_id: uuidv4(),
//       derived_chart_id: derivedChartId,
//       planet: planet.toUpperCase() as Planet,
//       sign: data.sign || null,
//       house: data.house || null,
//       longitude: parseDMSToDecimal(data.degrees),
//       degree_formatted: data.degrees || null,
//       is_retrograde: data.retrograde === 'R',
//       retrograde_indicator: data.retrograde || '',
//       nakshatra: data.nakshatra || null,
//       deity: data.deity || null,
//       shashtiamsha: data.shashtiamsha || null,
//     })
//   );

//   const houseData = derivedData.house_signs || [];
//   const housePromises = houseData.map((data: any) =>
//     DerivedChartHouse.create({
//       house_id: uuidv4(),
//       derived_chart_id: derivedChartId,
//       house_number: data.house || parseInt(data.house),
//       sign: data.sign || null,
//       start_longitude: parseDMSToDecimal(data.start_longitude),
//       start_longitude_formatted: data.start_longitude || null,
//       house_lord: data.house_lord || '',
//     })
//   );

//   await Promise.all([...planetPromises, ...housePromises]);
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
//     res.status(500).json({ message: defaultMessage, error: error.message });
//   }
// }

// export const insertD9Chart = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     console.log(`Processing insert request for userId: ${id}`);

//     const user = await validateRequest(id, res);
//     if (!user) return;

//     const chartType = await ChartType.findOne({ where: { chart_code: 'D-9' } });
//     if (!chartType) throw new Error('Chart type D-9 not found');
//     const apiEndpoint = chartType.getDataValue('api_endpoint');
//     if (!apiEndpoint) throw new Error('API endpoint not configured for D-9');

//     const existingChart = await DerivedChart.findOne({
//       where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
//     });
//     if (existingChart) {
//       res.status(400).json({ message: 'D-9 chart already exists for user' });
//       return;
//     }

//     const cacheKey = `d9chart:${user.user_id}`;
//     const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user), cacheKey);
//     const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint);

//     res.status(200).json({
//       message: 'D9 chart inserted successfully',
//       data: { derived_chart_id: derivedChartId, chart_type: 'D-9', data: derivedData },
//     });
//   } catch (error) {
//     handleError(res, error, 'Failed to insert D-9 chart');
//   }
// };

// export const fetchD9Chart = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
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

//     console.log(`Processing fetch request for userId: ${id}`);

//     const user = await validateRequest(id, res);
//     if (!user) return;

//     if (req.body && Object.keys(req.body).length > 0) {
//       await User.update(
//         {
//           ...(date_of_birth && { date_of_birth }),
//           ...(time_of_birth && { time_of_birth }),
//           ...(latitude && { latitude }),
//           ...(longitude && { longitude }),
//           ...(timezone_offset && { timezone_offset }),
//           ...(birth_timezone && { birth_timezone }),
//           ...(gender && { gender }),
//           ...(full_name && { full_name }),
//           ...(place_of_birth && { place_of_birth }),
//           updated_at: new Date(),
//         },
//         { where: { user_id: id } }
//       );
//     }

//     const updatedUser = await User.findOne({ where: { user_id: id } });
//     if (!updatedUser) throw new Error('Failed to retrieve user');

//     const redisKey = `d9_chart_user_${updatedUser.user_id}`;
//     const cacheKey = `d9chart:${updatedUser.user_id}`;

//     const cachedChart = await redisClient.get(redisKey);
//     if (
//       cachedChart &&
//       !hasUserDetailsChanged(updatedUser, JSON.parse(cachedChart)?.data?.data?.chart?.calculation_parameters)
//     ) {
//       console.log(`Serving D-9 chart for userId ${updatedUser.user_id} from Redis cache`);
//       res.status(200).json({
//         message: 'D9 chart fetched successfully from cache',
//         data: JSON.parse(cachedChart),
//       });
//       return;
//     }

//     const chartType = await ChartType.findOne({ where: { chart_code: 'D-9' } });
//     if (!chartType) throw new Error('Chart type D-9 not found');
//     const apiEndpoint = chartType.getDataValue('api_endpoint');
//     if (!apiEndpoint) throw new Error('API endpoint not configured for D-9');

//     let existingChart = await DerivedChart.findOne({
//       where: { user_id: updatedUser.user_id, chart_type_id: chartType.chart_type_id },
//     });

//     let message = 'D9 chart fetched successfully';

//     await redisClient.del(redisKey);
//     await redisClient.del(cacheKey);

//     if (!existingChart) {
//       const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(updatedUser), cacheKey);
//       const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, updatedUser, apiEndpoint);
//       existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
//       message = 'D9 chart created and fetched successfully';
//     } else {
//       const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(updatedUser), cacheKey);
//       const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, updatedUser, apiEndpoint, existingChart);
//       existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
//       message = 'D9 chart updated and fetched successfully';
//     }

//     if (!existingChart) throw new Error('Failed to retrieve D-9 chart');

//     const [planets, houses] = await Promise.all([
//       DerivedChartPlanet.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
//       DerivedChartHouse.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
//     ]);

//     const responseData = {
//       chart_type: 'D-9',
//       data: {
//         message: 'Derived chart data fetched from database',
//         data: { chart: existingChart, planets, houses },
//       },
//     };

//     await redisClient.setEx(redisKey, 3600, JSON.stringify(responseData));

//     res.status(200).json({
//       message,
//       data: responseData,
//     });
//   } catch (error) {
//     handleError(res, error, 'Failed to fetch D-9 chart');
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
    chart_type: 'D9',
    birth_date: user.date_of_birth,
    birth_time: user.time_of_birth,
    latitude: parseFloat(user.latitude?.toString() || '0'),
    longitude: parseFloat(user.longitude?.toString() || '0'),
    timezone_offset: user.timezone_offset || 0,
    timezone: user.birth_timezone || 'Asia/Kolkata',
    ayanamsa: 'lahiri',
    house_system: 'whole_sign',
    zodiac_system: 'sidereal',
    gender: user.gender || 'unknown',
    name: user.full_name || 'Unknown',
    place_of_birth: user.place_of_birth || 'Unknown',
    divisional_factor: 9,
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

function parseDMSToDecimal(dms: string | undefined): number {
  if (!dms) return 0;
  try {
    const dmsRegex = /(\d+)°\s*(\d+)?'?\s*(\d*\.?\d*)"?/;
    const match = dms.match(dmsRegex);
    if (!match) {
      const num = parseFloat(dms);
      return isNaN(num) ? 0 : num;
    }

    const degrees = parseFloat(match[1]) || 0;
    const minutes = parseFloat(match[2]) || 0;
    const seconds = parseFloat(match[3]) || 0;

    return degrees + minutes / 60 + seconds / 3600;
  } catch (error) {
    console.error(`Failed to parse DMS string: ${dms}`, error);
    return 0;
  }
}

async function callAstroApi(apiEndpoint: string, payload: any, cacheKey: string): Promise<any> {
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    console.log('Returning D9 chart from Redis cache.');
    return JSON.parse(cached);
  }

  const fullUrl = `${ASTRO_ENGINE_URL}${apiEndpoint}`;
  const response = await axios.post(fullUrl, payload, { timeout: 10000 });
  console.log('DerivedData for D-9:', JSON.stringify(response.data, null, 2));
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
    ascendant: derivedData.d9_ascendant || derivedData.ascendant || {},
    planetary_positions: derivedData.planetary_positions || {},
    house_signs: derivedData.house_signs || [],
    aspects: derivedData.aspects || {},
    ayanamsa_value: derivedData.notes?.ayanamsa || derivedData.metadata?.ayanamsa || 'Lahiri',
  };

  const ascendantSign = derivedData.d9_ascendant?.sign || derivedData.ascendant?.sign || '';
  const metadata = {
    ayanamsa: derivedData.notes?.ayanamsa || derivedData.metadata?.ayanamsa || 'Lahiri',
    chart_type: derivedData.notes?.chart_type || derivedData.metadata?.chart_type || `${chartType.chart_name} (${chartType.chart_code})`,
    house_system: derivedData.notes?.house_system || derivedData.metadata?.house_system || 'Whole Sign',
  };

  const calculationParameters = {
    ayanamsa: 'lahiri',
    house_system: 'whole_sign',
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
          ascendant_degree: parseDMSToDecimal(derivedData.d9_ascendant?.degrees || derivedData.ascendant?.degrees),
          ascendant_degree_formatted: derivedData.d9_ascendant?.degrees || derivedData.ascendant?.degrees || null,
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
      ascendant_degree: parseDMSToDecimal(derivedData.d9_ascendant?.degrees || derivedData.ascendant?.degrees),
      ascendant_degree_formatted: derivedData.d9_ascendant?.degrees || derivedData.ascendant?.degrees || null,
      chart_data: { ...chartData, metadata },
      notes: JSON.stringify(metadata),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  const planetData = derivedData.planetary_positions || {};
  const planetPromises = Object.entries(planetData).map(([planet, data]: [string, any]) =>
    DerivedChartPlanet.create({
      position_id: uuidv4(),
      derived_chart_id: derivedChartId,
      planet: planet.toUpperCase() as Planet,
      sign: data.sign || null,
      house: data.house || null,
      longitude: parseDMSToDecimal(data.degrees),
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
      sign: data.sign || null,
      start_longitude: parseDMSToDecimal(data.start_longitude),
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

export const updateD9Chart = async (
  user: User,
  chartType: any,
  apiEndpoint: string,
  existingChart: any,
  cacheKey: string
): Promise<string> => {
  const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user), cacheKey);
  const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint, existingChart);
  return derivedChartId;
};

export const insertD9Chart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`Processing insert request for userId: ${id}`);

    const user = await validateRequest(id, res);
    if (!user) return;

    const chartType = await ChartType.findOne({ where: { chart_code: 'D-9' } });
    if (!chartType) throw new Error('Chart type D-9 not found');
    const apiEndpoint = chartType.getDataValue('api_endpoint');
    if (!apiEndpoint) throw new Error('API endpoint not configured for D-9');

    const existingChart = await DerivedChart.findOne({
      where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
    });
    if (existingChart) {
      res.status(400).json({ message: 'D-9 chart already exists for user' });
      return;
    }

    const cacheKey = `d9chart:${user.user_id}`;
    const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user), cacheKey);
    const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint);

    res.status(200).json({
      message: 'D9 chart inserted successfully',
      data: { derived_chart_id: derivedChartId, chart_type: 'D-9', data: derivedData },
    });
  } catch (error) {
    handleError(res, error, 'Failed to insert D-9 chart');
  }
};

export const fetchD9Chart = async (req: Request, res: Response): Promise<void> => {
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

    const redisKey = `d9_chart_user_${updatedUser.user_id}`;
    const cacheKey = `d9chart:${updatedUser.user_id}`;

    const cachedChart = await redisClient.get(redisKey);
    if (
      cachedChart &&
      !hasUserDetailsChanged(updatedUser, JSON.parse(cachedChart)?.data?.data?.chart?.calculation_parameters)
    ) {
      console.log(`Serving D-9 chart for userId ${updatedUser.user_id} from Redis cache`);
      res.status(200).json({
        message: 'D9 chart fetched successfully from cache',
        data: JSON.parse(cachedChart),
      });
      return;
    }

    const chartType = await ChartType.findOne({ where: { chart_code: 'D-9' } });
    if (!chartType) throw new Error('Chart type D-9 not found');
    const apiEndpoint = chartType.getDataValue('api_endpoint');
    if (!apiEndpoint) throw new Error('API endpoint not configured for D-9');

    let existingChart = await DerivedChart.findOne({
      where: { user_id: updatedUser.user_id, chart_type_id: chartType.chart_type_id },
    });

    let message = 'D9 chart fetched successfully';

    await redisClient.del(redisKey);
    await redisClient.del(cacheKey);

    if (!existingChart) {
      const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(updatedUser), cacheKey);
      const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, updatedUser, apiEndpoint);
      existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
      message = 'D9 chart created and fetched successfully';
    } else if (hasUserDetailsChanged(updatedUser, existingChart.calculation_parameters)) {
      const derivedChartId = await updateD9Chart(updatedUser, chartType, apiEndpoint, existingChart, cacheKey);
      existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
      message = 'D9 chart updated and fetched successfully';
    }

    if (!existingChart) throw new Error('Failed to retrieve D-9 chart');

    const [planets, houses] = await Promise.all([
      DerivedChartPlanet.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
      DerivedChartHouse.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
    ]);

    const responseData = {
      chart_type: 'D-9',
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
    handleError(res, error, 'Failed to fetch D-9 chart');
  }
};