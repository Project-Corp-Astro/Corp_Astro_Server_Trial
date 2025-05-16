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
// // //   // Transform planetary_positions array to object
// // //   const planetaryPositions = (derivedData.planetary_positions || []).reduce((acc: any, pos: any) => {
// // //     acc[pos.planet.toUpperCase()] = {
// // //       house: pos.house,
// // //       longitude: pos.longitude,
// // //       retrograde: pos.retrograde ? 'R' : '',
// // //       sign: pos.sign,
// // //     };
// // //     return acc;
// // //   }, {});
  
// // //   const chartData = {
// // //     ascendant: derivedData.chandra_lagna || {},
// // //     planetary_positions: planetaryPositions,
// // //     house_signs: (derivedData.house_cusps || []).map((cusp: any) => ({
// // //       house: cusp.house,
// // //       sign: cusp.sign,
// // //       start_longitude_formatted: cusp.cusp,
// // //     })),
// // //     aspects: derivedData.aspects || {}, // Empty if not provided by API
// // //     ayanamsa_value: derivedData.metadata?.ayanamsa || 'Lahiri', // Use metadata.ayanamsa
// // //   };

// // //   // Determine ascendant_sign
// // //   const ascendantSign = derivedData.chandra_lagna?.sign || '';

// // //   // Prepare metadata
// // //   const metadata = {
// // //     ayanamsa: derivedData.metadata?.ayanamsa || 'Lahiri',
// // //     calculation_time: derivedData.metadata?.calculation_time || null,
// // //     house_system: derivedData.metadata?.house_system || 'Whole Sign',
// // //     input: derivedData.metadata?.input || {},
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
// // //     ascendant_degree: derivedData.chandra_lagna?.longitude && typeof derivedData.chandra_lagna.longitude === 'string'
// // //       ? parseFloat(derivedData.chandra_lagna.longitude.split('°')[0])
// // //       : 0,
// // //     ascendant_degree_formatted: derivedData.chandra_lagna?.longitude || null,
// // //     chart_data: { ...chartData, metadata }, // Include metadata in chart_data
// // //     notes: JSON.stringify(metadata), // Store as JSON string in notes
// // //     created_at: new Date(),
// // //     updated_at: new Date(),
// // //   });

// // //   // Save planets
// // //   const planetPromises = (derivedData.planetary_positions || []).map((data: any) =>
// // //     DerivedChartPlanet.create({
// // //       position_id: uuidv4(),
// // //       derived_chart_id: derivedChartId,
// // //       planet: data.planet.toUpperCase() as Planet,
// // //       sign: data.sign || null,
// // //       house: data.house || null,
// // //       longitude: data.longitude && typeof data.longitude === 'string' ? parseFloat(data.longitude.split('°')[0]) : 0,
// // //       degree_formatted: data.longitude || null,
// // //       is_retrograde: data.retrograde || false,
// // //       retrograde_indicator: data.retrograde ? 'R' : '',
// // //       nakshatra: undefined,
// // //       deity: data.deity || null,
// // //       shashtiamsha: data.shashtiamsha || null,
// // //     })
// // //   );
// // //   await Promise.all(planetPromises);

// // //   // Save houses
// // //   const houseData = derivedData.house_cusps || [];
// // //   if (houseData.length > 0) {
// // //     const housePromises = houseData.map((data: any) =>
// // //       DerivedChartHouse.create({
// // //         house_id: uuidv4(),
// // //         derived_chart_id: derivedChartId,
// // //         house_number: data.house,
// // //         sign: data.sign || null,
// // //         start_longitude: data.cusp && typeof data.cusp === 'string' ? parseFloat(data.cusp.split('°')[0]) : 0,
// // //         start_longitude_formatted: data.cusp || null,
// // //         house_lord: '',
// // //       })
// // //     );
// // //     await Promise.all(housePromises);
// // //   }

// // //   return derivedChartId;
// // // }

// // // // Helper function to fetch Moon Chart
// // // export async function fetchMoonChart(user: any): Promise<ChartResponse> {
// // //   const chartType = await ChartType.findOne({ where: { chart_code: 'MOON' } });
// // //   if (!chartType) throw new Error('Chart type MOON not found');
// // //   const apiEndpoint = chartType.getDataValue('api_endpoint');
// // //   if (!apiEndpoint) throw new Error('API endpoint not configured for Moon Chart');

// // //   // Check for existing chart
// // //   let existingChart = await DerivedChart.findOne({
// // //     where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
// // //   });

// // //   if (!existingChart) {
// // //     // Prepare payload for Moon Chart
// // //     const userData = {
// // //       chart_type: 'MOON',
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
// // //       calculation_precision: 'high',
// // //     };

// // //     // Call Python API
// // //     const fullUrl = `${ASTRO_ENGINE_URL}${apiEndpoint}`;
// // //     const response = await axios.post(fullUrl, userData, { timeout: 10000 });
// // //     const derivedData = response.data;

// // //     // Log API response for debugging
// // //     console.log('DerivedData for Moon Chart:', JSON.stringify(derivedData, null, 2));

// // //     // Save chart data
// // //     const derivedChartId = await saveChartData(derivedData, chartType, user, apiEndpoint);

// // //     // Fetch the newly saved chart
// // //     existingChart = await DerivedChart.findOne({
// // //       where: { derived_chart_id: derivedChartId },
// // //     });
// // //     if (!existingChart) {
// // //       throw new Error('Failed to retrieve newly saved Moon Chart');
// // //     }
// // //   }

// // //   // Fetch planets and houses
// // //   const planets = await DerivedChartPlanet.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } });
// // //   const houses = await DerivedChartHouse.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } });

// // //   return {
// // //     chart_type: 'MOON',
// // //     data: {
// // //       message: 'Derived chart data fetched from database',
// // //       data: { chart: existingChart, planets, houses },
// // //     },
// // //   };
// // // }

// // // // Main controller
// // // export const fetchMoonChartData = async (req: Request, res: Response): Promise<void> => {
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

// // //     // Fetch Moon Chart
// // //     const chartResults = await fetchMoonChart(user);

// // //     res.status(200).json({
// // //       message: 'Moon Chart data fetched successfully',
// // //       data: chartResults,
// // //     });
// // //   } catch (error: any) {
// // //     console.error('Error in fetchMoonChartData:', error);
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
// // //       res.status(500).json({ message: 'Failed to fetch Moon Chart data', error: error.message });
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
// //     chart_type: 'MOON',
// //     birth_date: user.date_of_birth ,
// //     birth_time: user.time_of_birth ,
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
// //   console.log('DerivedData for Moon Chart:', JSON.stringify(response.data, null, 2));
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
// //   // Transform planetary_positions array to object
// //   const planetaryPositions = (derivedData.planetary_positions || []).reduce((acc: any, pos: any) => {
// //     acc[pos.planet.toUpperCase()] = {
// //       house: pos.house,
// //       longitude: pos.longitude,
// //       retrograde: pos.retrograde ? 'R' : '',
// //       sign: pos.sign,
// //       deity: pos.deity,
// //       shashtiamsha: pos.shashtiamsha,
// //     };
// //     return acc;
// //   }, {});
// //   const chartData = {
// //     chandra_lagna: {
// //       degree: derivedData.chandra_lagna?.degree || derivedData.chandra_lagna?.longitude || '',
// //       longitude: derivedData.chandra_lagna?.longitude || '',
// //       sign: derivedData.chandra_lagna?.sign || '',
// //     },
// //     planetary_positions: planetaryPositions,
// //     house_cusps: (derivedData.house_cusps || []).map((cusp: any) => ({
// //       house: cusp.house,
// //       sign: cusp.sign,
// //       cusp: cusp.cusp,
// //     })),
// //     aspects: derivedData.aspects || {},
// //     ayanamsa_value: derivedData.metadata?.ayanamsa || derivedData.notes?.ayanamsa || 'Lahiri',
// //     user_name: derivedData.user_name || user.full_name || 'Unknown',
// //   };
// //   const ascendantSign = derivedData.chandra_lagna?.sign || '';
// //   const metadata = {
// //     ayanamsa: derivedData.metadata?.ayanamsa || derivedData.notes?.ayanamsa || 'Lahiri',
// //     chart_type: derivedData.metadata?.chart_type || derivedData.notes?.chart_type || `${chartType.chart_name} (${chartType.chart_code})`,
// //     house_system: derivedData.metadata?.house_system || derivedData.notes?.house_system || 'Whole Sign',
// //     calculation_time: derivedData.metadata?.calculation_time || derivedData.notes?.calculation_time || null,
// //     input: derivedData.metadata?.input || derivedData.notes?.input || {
// //       birth_date: user.date_of_birth || '1990-01-01',
// //       birth_time: user.time_of_birth || '12:00',
// //       latitude: parseFloat(user.latitude?.toString() || '0'),
// //       longitude: parseFloat(user.longitude?.toString() || '0'),
// //       timezone_offset: user.timezone_offset || 0,
// //     },
// //   };
// //   const calculationParameters = {
// //     ayanamsa: 'lahiri',
// //     house_system: 'whole_sign',
// //     zodiac_system: 'sidereal',
// //     birth_date: user.date_of_birth || '1990-01-01',
// //     birth_time: user.time_of_birth || '12:00',
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
// //           ascendant_degree: parseDMSToDecimal(derivedData.chandra_lagna?.longitude),
// //           ascendant_degree_formatted: derivedData.chandra_lagna?.longitude || null,
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
// //       ascendant_degree: parseDMSToDecimal(derivedData.chandra_lagna?.longitude),
// //       ascendant_degree_formatted: derivedData.chandra_lagna?.longitude || null,
// //       chart_data: { ...chartData, metadata },
// //       notes: JSON.stringify(metadata),
// //       created_at: new Date(),
// //       updated_at: new Date(),
// //     });
// //   }

// //   // Save planets
// //   const planetPromises = (derivedData.planetary_positions || []).map((data: any) =>
// //     DerivedChartPlanet.create({
// //       position_id: uuidv4(),
// //       derived_chart_id: derivedChartId,
// //       planet: data.planet.toUpperCase() as Planet,
// //       sign: data.sign || null,
// //       house: data.house || null,
// //       longitude: parseDMSToDecimal(data.longitude),
// //       degree_formatted: data.longitude || null,
// //       is_retrograde: data.retrograde || false,
// //       retrograde_indicator: data.retrograde ? 'R' : '',
// //       nakshatra: undefined, // Not provided per original code
// //       deity: data.deity || null,
// //       shashtiamsha: data.shashtiamsha || null,
// //     })
// //   );

// //   // Save houses
// //   const houseData = derivedData.house_cusps || [];
// //   const housePromises = houseData.map((data: any) =>
// //     DerivedChartHouse.create({
// //       house_id: uuidv4(),
// //       derived_chart_id: derivedChartId,
// //       house_number: data.house,
// //       sign: data.sign || null,
// //       start_longitude: parseDMSToDecimal(data.cusp),
// //       start_longitude_formatted: data.cusp || null,
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

// // // Update Moon Chart
// // export const updateMoonChart = async (
// //   user: User,
// //   chartType: any,
// //   apiEndpoint: string,
// //   existingChart: any
// // ): Promise<string> => {
// //   const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user));
// //   const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint, existingChart);
// //   return derivedChartId;
// // };

// // // Insert Moon Chart
// // export const insertMoonChart = async (req: Request, res: Response): Promise<void> => {
// //   try {
// //     const { id } = req.params;
// //     console.log(`Processing insert request for userId: ${id}`);

// //     const user = await validateRequest(id, res);
// //     if (!user) return;

// //     const chartType = await ChartType.findOne({ where: { chart_code: 'MOON' } });
// //     if (!chartType) throw new Error('Chart type MOON not found');
// //     const apiEndpoint = chartType.getDataValue('api_endpoint');
// //     if (!apiEndpoint) throw new Error('API endpoint not configured for Moon Chart');

// //     const existingChart = await DerivedChart.findOne({
// //       where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
// //     });
// //     if (existingChart) {
// //       res.status(400).json({ message: 'Moon Chart already exists for user' });
// //       return;
// //     }

// //     const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user));
// //     const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint);

// //     res.status(200).json({
// //       message: 'Moon Chart inserted successfully',
// //       data: { derived_chart_id: derivedChartId, chart_type: 'MOON', data: derivedData },
// //     });
// //   } catch (error) {
// //     handleError(res, error, 'Failed to insert Moon Chart');
// //   }
// // };

// // // Fetch Moon Chart
// // export const fetchMoonChart = async (req: Request, res: Response): Promise<void> => {
// //   try {
// //     const { id } = req.params;
// //     console.log(`Processing fetch request for userId: ${id}`);

// //     const user = await validateRequest(id, res);
// //     if (!user) return;

// //     const chartType = await ChartType.findOne({ where: { chart_code: 'MOON' } });
// //     if (!chartType) throw new Error('Chart type MOON not found');
// //     const apiEndpoint = chartType.getDataValue('api_endpoint');
// //     if (!apiEndpoint) throw new Error('API endpoint not configured for Moon Chart');

// //     let existingChart = await DerivedChart.findOne({
// //       where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
// //     });
// //     let message = 'Moon Chart fetched successfully';

// //     if (!existingChart) {
// //       const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user));
// //       const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint);
// //       existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
// //       message = 'Moon Chart created and fetched successfully';
// //     } else if (hasUserDetailsChanged(user, existingChart.calculation_parameters)) {
// //       const derivedChartId = await updateMoonChart(user, chartType, apiEndpoint, existingChart);
// //       existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
// //       message = 'Moon Chart updated and fetched successfully';
// //     }

// //     if (!existingChart) throw new Error('Failed to retrieve Moon Chart');

// //     const [planets, houses] = await Promise.all([
// //       DerivedChartPlanet.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
// //       DerivedChartHouse.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
// //     ]);

// //     // Construct response to match expected output
// //     const responseData = {
// //       chandra_lagna: {
// //         degree: (existingChart.chart_data as any).chandra_lagna?.degree || '',
// //         longitude: (existingChart.chart_data as any).chandra_lagna?.longitude || '',
// //         sign: (existingChart.chart_data as any).chandra_lagna?.sign || '',
// //       },
// //       planetary_positions: planets.map((planet: any) => ({
// //         planet: planet.planet,
// //         house: planet.house,
// //         longitude: planet.degree_formatted,
// //         retrograde: planet.is_retrograde,
// //         sign: planet.sign,
// //         deity: planet.deity,
// //         shashtiamsha: planet.shashtiamsha,
// //       })),
// //       house_cusps: houses.map((house: any) => ({
// //         house: house.house_number,
// //         sign: house.sign,
// //         cusp: house.start_longitude_formatted,
// //       })),
// //       metadata: (existingChart.chart_data as any).metadata || {},
// //       user_name: (existingChart.chart_data as any).user_name || user.full_name || 'Unknown',
// //     };

// //     res.status(200).json({
// //       message,
// //       data: {
// //         chart_type: 'MOON',
// //         data: responseData,
// //       },
// //     });
// //   } catch (error) {
// //     handleError(res, error, 'Failed to fetch Moon Chart');
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
//     chart_type: 'MOON',
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
//     console.log('Returning Moon Chart from Redis cache.');
//     return JSON.parse(cached);
//   }

//   const fullUrl = `${ASTRO_ENGINE_URL}${apiEndpoint}`;
//   const response = await axios.post(fullUrl, payload, { timeout: 10000 });
//   console.log('DerivedData for Moon Chart:', JSON.stringify(response.data, null, 2));
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

//   // Transform planetary_positions array to object
//   const planetaryPositions = (derivedData.planetary_positions || []).reduce((acc: any, pos: any) => {
//     acc[pos.planet.toUpperCase()] = {
//       house: pos.house,
//       longitude: pos.longitude,
//       retrograde: pos.retrograde ? 'R' : '',
//       sign: pos.sign,
//       deity: pos.deity,
//       shashtiamsha: pos.shashtiamsha,
//     };
//     return acc;
//   }, {});

//   const chartData = {
//     chandra_lagna: {
//       degree: derivedData.chandra_lagna?.degree || derivedData.chandra_lagna?.longitude || '',
//       longitude: derivedData.chandra_lagna?.longitude || '',
//       sign: derivedData.chandra_lagna?.sign || '',
//     },
//     planetary_positions: planetaryPositions,
//     house_cusps: (derivedData.house_cusps || []).map((cusp: any) => ({
//       house: cusp.house,
//       sign: cusp.sign,
//       cusp: cusp.cusp,
//     })),
//     aspects: derivedData.aspects || {},
//     ayanamsa_value: derivedData.metadata?.ayanamsa || derivedData.notes?.ayanamsa || 'Lahiri',
//     user_name: derivedData.user_name || user.full_name || 'Unknown',
//   };

//   const ascendantSign = derivedData.chandra_lagna?.sign || '';
//   const metadata = {
//     ayanamsa: derivedData.metadata?.ayanamsa || derivedData.notes?.ayanamsa || 'Lahiri',
//     chart_type: derivedData.metadata?.chart_type || derivedData.notes?.chart_type || `${chartType.chart_name} (${chartType.chart_code})`,
//     house_system: derivedData.metadata?.house_system || derivedData.notes?.house_system || 'Whole Sign',
//     calculation_time: derivedData.metadata?.calculation_time || derivedData.notes?.calculation_time || null,
//     input: derivedData.metadata?.input || derivedData.notes?.input || {
//       birth_date: user.date_of_birth,
//       birth_time: user.time_of_birth,
//       latitude: parseFloat(user.latitude?.toString() || '0'),
//       longitude: parseFloat(user.longitude?.toString() || '0'),
//       timezone_offset: user.timezone_offset || 0,
//     },
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
//           ascendant_degree: parseDMSToDecimal(derivedData.chandra_lagna?.longitude),
//           ascendant_degree_formatted: derivedData.chandra_lagna?.longitude || null,
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
//       ascendant_degree: parseDMSToDecimal(derivedData.chandra_lagna?.longitude),
//       ascendant_degree_formatted: derivedData.chandra_lagna?.longitude || null,
//       chart_data: { ...chartData, metadata },
//       notes: JSON.stringify(metadata),
//       created_at: new Date(),
//       updated_at: new Date(),
//     });
//   }

//   const planetPromises = (derivedData.planetary_positions || []).map((data: any) =>
//     DerivedChartPlanet.create({
//       position_id: uuidv4(),
//       derived_chart_id: derivedChartId,
//       planet: data.planet.toUpperCase() as Planet,
//       sign: data.sign || null,
//       house: data.house || null,
//       longitude: parseDMSToDecimal(data.longitude),
//       degree_formatted: data.longitude || null,
//       is_retrograde: data.retrograde || false,
//       retrograde_indicator: data.retrograde ? 'R' : '',
//       nakshatra: undefined, // Not provided per original code
//       deity: data.deity || null,
//       shashtiamsha: data.shashtiamsha || null,
//     })
//   );

//   const houseData = derivedData.house_cusps || [];
//   const housePromises = houseData.map((data: any) =>
//     DerivedChartHouse.create({
//       house_id: uuidv4(),
//       derived_chart_id: derivedChartId,
//       house_number: data.house,
//       sign: data.sign || null,
//       start_longitude: parseDMSToDecimal(data.cusp),
//       start_longitude_formatted: data.cusp || null,
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

// export const insertMoonChart = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     console.log(`Processing insert request for userId: ${id}`);

//     const user = await validateRequest(id, res);
//     if (!user) return;

//     const chartType = await ChartType.findOne({ where: { chart_code: 'MOON' } });
//     if (!chartType) throw new Error('Chart type MOON not found');
//     const apiEndpoint = chartType.getDataValue('api_endpoint');
//     if (!apiEndpoint) throw new Error('API endpoint not configured for Moon Chart');

//     const existingChart = await DerivedChart.findOne({
//       where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
//     });
//     if (existingChart) {
//       res.status(400).json({ message: 'Moon Chart already exists for user' });
//       return;
//     }

//     const cacheKey = `moonchart:${user.user_id}`;
//     const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user), cacheKey);
//     const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint);

//     res.status(200).json({
//       message: 'Moon Chart inserted successfully',
//       data: { derived_chart_id: derivedChartId, chart_type: 'MOON', data: derivedData },
//     });
//   } catch (error) {
//     handleError(res, error, 'Failed to insert Moon Chart');
//   }
// };

// export const fetchMoonChart = async (req: Request, res: Response): Promise<void> => {
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

//     const redisKey = `moon_chart_user_${updatedUser.user_id}`;
//     const cacheKey = `moonchart:${updatedUser.user_id}`;

//     const cachedChart = await redisClient.get(redisKey);
//     if (
//       cachedChart &&
//       !hasUserDetailsChanged(updatedUser, JSON.parse(cachedChart)?.data?.metadata?.input)
//     ) {
//       console.log(`Serving Moon Chart for userId ${updatedUser.user_id} from Redis cache`);
//       res.status(200).json({
//         message: 'Moon Chart fetched successfully from cache',
//         data: JSON.parse(cachedChart),
//       });
//       return;
//     }

//     const chartType = await ChartType.findOne({ where: { chart_code: 'MOON' } });
//     if (!chartType) throw new Error('Chart type MOON not found');
//     const apiEndpoint = chartType.getDataValue('api_endpoint');
//     if (!apiEndpoint) throw new Error('API endpoint not configured for Moon Chart');

//     let existingChart = await DerivedChart.findOne({
//       where: { user_id: updatedUser.user_id, chart_type_id: chartType.chart_type_id },
//     });

//     let message = 'Moon Chart fetched successfully';

//     await redisClient.del(redisKey);
//     await redisClient.del(cacheKey);

//     if (!existingChart) {
//       const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(updatedUser), cacheKey);
//       const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, updatedUser, apiEndpoint);
//       existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
//       message = 'Moon Chart created and fetched successfully';
//     } else {
//       const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(updatedUser), cacheKey);
//       const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, updatedUser, apiEndpoint, existingChart);
//       existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
//       message = 'Moon Chart updated and fetched successfully';
//     }

//     if (!existingChart) throw new Error('Failed to retrieve Moon Chart');

//     const [planets, houses] = await Promise.all([
//       DerivedChartPlanet.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
//       DerivedChartHouse.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
//     ]);

//     const responseData = {
//       chandra_lagna: {
//         degree: (existingChart.chart_data as any).chandra_lagna?.degree || '',
//         longitude: (existingChart.chart_data as any).chandra_lagna?.longitude || '',
//         sign: (existingChart.chart_data as any).chandra_lagna?.sign || '',
//       },
//       planetary_positions: planets.map((planet: any) => ({
//         planet: planet.planet,
//         house: planet.house,
//         longitude: planet.degree_formatted,
//         retrograde: planet.is_retrograde,
//         sign: planet.sign,
//         deity: planet.deity,
//         shashtiamsha: planet.shashtiamsha,
//       })),
//       house_cusps: houses.map((house: any) => ({
//         house: house.house_number,
//         sign: house.sign,
//         cusp: house.start_longitude_formatted,
//       })),
//       metadata: (existingChart.chart_data as any).metadata || {},
//       user_name: (existingChart.chart_data as any).user_name || updatedUser.full_name || 'Unknown',
//     };

//     await redisClient.setEx(redisKey, 3600, JSON.stringify({ chart_type: 'MOON', data: responseData }));

//     res.status(200).json({
//       message,
//       data: {
//         chart_type: 'MOON',
//         data: responseData,
//       },
//     });
//   } catch (error) {
//     handleError(res, error, 'Failed to fetch Moon Chart');
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
    chart_type: 'MOON',
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
    console.log('Returning Moon Chart from Redis cache.');
    return JSON.parse(cached);
  }

  const fullUrl = `${ASTRO_ENGINE_URL}${apiEndpoint}`;
  const response = await axios.post(fullUrl, payload, { timeout: 10000 });
  console.log('DerivedData for Moon Chart:', JSON.stringify(response.data, null, 2));
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

  // Transform planetary_positions array to object
  const planetaryPositions = (derivedData.planetary_positions || []).reduce((acc: any, pos: any) => {
    acc[pos.planet.toUpperCase()] = {
      house: pos.house,
      longitude: pos.longitude,
      retrograde: pos.retrograde ? 'R' : '',
      sign: pos.sign,
      deity: pos.deity,
      shashtiamsha: pos.shashtiamsha,
    };
    return acc;
  }, {});

  const chartData = {
    chandra_lagna: {
      degree: derivedData.chandra_lagna?.degree || derivedData.chandra_lagna?.longitude || '',
      longitude: derivedData.chandra_lagna?.longitude || '',
      sign: derivedData.chandra_lagna?.sign || '',
    },
    planetary_positions: planetaryPositions,
    house_cusps: (derivedData.house_cusps || []).map((cusp: any) => ({
      house: cusp.house,
      sign: cusp.sign,
      cusp: cusp.cusp,
    })),
    aspects: derivedData.aspects || {},
    ayanamsa_value: derivedData.metadata?.ayanamsa || derivedData.notes?.ayanamsa || 'Lahiri',
    user_name: derivedData.user_name || user.full_name || 'Unknown',
  };

  const ascendantSign = derivedData.chandra_lagna?.sign || '';
  const metadata = {
    ayanamsa: derivedData.metadata?.ayanamsa || derivedData.notes?.ayanamsa || 'Lahiri',
    chart_type: derivedData.metadata?.chart_type || derivedData.notes?.chart_type || `${chartType.chart_name} (${chartType.chart_code})`,
    house_system: derivedData.metadata?.house_system || derivedData.notes?.house_system || 'Whole Sign',
    calculation_time: derivedData.metadata?.calculation_time || derivedData.notes?.calculation_time || null,
    input: derivedData.metadata?.input || derivedData.notes?.input || {
      birth_date: user.date_of_birth,
      birth_time: user.time_of_birth,
      latitude: parseFloat(user.latitude?.toString() || '0'),
      longitude: parseFloat(user.longitude?.toString() || '0'),
      timezone_offset: user.timezone_offset || 0,
    },
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
          ascendant_degree: parseDMSToDecimal(derivedData.chandra_lagna?.longitude),
          ascendant_degree_formatted: derivedData.chandra_lagna?.longitude || null,
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
      ascendant_degree: parseDMSToDecimal(derivedData.chandra_lagna?.longitude),
      ascendant_degree_formatted: derivedData.chandra_lagna?.longitude || null,
      chart_data: { ...chartData, metadata },
      notes: JSON.stringify(metadata),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  const planetPromises = (derivedData.planetary_positions || []).map((data: any) =>
    DerivedChartPlanet.create({
      position_id: uuidv4(),
      derived_chart_id: derivedChartId,
      planet: data.planet.toUpperCase() as Planet,
      sign: data.sign || null,
      house: data.house || null,
      longitude: parseDMSToDecimal(data.longitude),
      degree_formatted: data.longitude || null,
      is_retrograde: data.retrograde || false,
      retrograde_indicator: data.retrograde ? 'R' : '',
      nakshatra: undefined, // Not provided per original code
      deity: data.deity || null,
      shashtiamsha: data.shashtiamsha || null,
    })
  );

  const houseData = derivedData.house_cusps || [];
  const housePromises = houseData.map((data: any) =>
    DerivedChartHouse.create({
      house_id: uuidv4(),
      derived_chart_id: derivedChartId,
      house_number: data.house,
      sign: data.sign || null,
      start_longitude: parseDMSToDecimal(data.cusp),
      start_longitude_formatted: data.cusp || null,
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

export const updateMoonChart = async (
  user: User,
  chartType: any,
  apiEndpoint: string,
  existingChart: any
): Promise<string> => {
  const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user), `moonchart:${user.user_id}`);
  const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint, existingChart);
  return derivedChartId;
};

export const insertMoonChart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`Processing insert request for userId: ${id}`);

    const user = await validateRequest(id, res);
    if (!user) return;

    const chartType = await ChartType.findOne({ where: { chart_code: 'MOON' } });
    if (!chartType) throw new Error('Chart type MOON not found');
    const apiEndpoint = chartType.getDataValue('api_endpoint');
    if (!apiEndpoint) throw new Error('API endpoint not configured for Moon Chart');

    const existingChart = await DerivedChart.findOne({
      where: { user_id: user.user_id, chart_type_id: chartType.chart_type_id },
    });
    if (existingChart) {
      res.status(400).json({ message: 'Moon Chart already exists for user' });
      return;
    }

    const cacheKey = `moonchart:${user.user_id}`;
    const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(user), cacheKey);
    const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, user, apiEndpoint);

    res.status(200).json({
      message: 'Moon Chart inserted successfully',
      data: { derived_chart_id: derivedChartId, chart_type: 'MOON', data: derivedData },
    });
  } catch (error) {
    handleError(res, error, 'Failed to insert Moon Chart');
  }
};

export const fetchMoonChart = async (req: Request, res: Response): Promise<void> => {
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

    const redisKey = `moon_chart_user_${updatedUser.user_id}`;
    const cacheKey = `moonchart:${updatedUser.user_id}`;

    const cachedChart = await redisClient.get(redisKey);
    if (
      cachedChart &&
      !hasUserDetailsChanged(updatedUser, JSON.parse(cachedChart)?.data?.metadata?.input)
    ) {
      console.log(`Serving Moon Chart for userId ${updatedUser.user_id} from Redis cache`);
      res.status(200).json({
        message: 'Moon Chart fetched successfully from cache',
        data: JSON.parse(cachedChart),
      });
      return;
    }

    const chartType = await ChartType.findOne({ where: { chart_code: 'MOON' } });
    if (!chartType) throw new Error('Chart type MOON not found');
    const apiEndpoint = chartType.getDataValue('api_endpoint');
    if (!apiEndpoint) throw new Error('API endpoint not configured for Moon Chart');

    let existingChart = await DerivedChart.findOne({
      where: { user_id: updatedUser.user_id, chart_type_id: chartType.chart_type_id },
    });

    let message = 'Moon Chart fetched successfully';

    await redisClient.del(redisKey);
    await redisClient.del(cacheKey);

    if (!existingChart) {
      const derivedData = await callAstroApi(apiEndpoint, buildApiPayload(updatedUser), cacheKey);
      const derivedChartId = await saveOrUpdateChartData(derivedData, chartType, updatedUser, apiEndpoint);
      existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
      message = 'Moon Chart created and fetched successfully';
    } else if (hasUserDetailsChanged(updatedUser, existingChart.calculation_parameters)) {
      const derivedChartId = await updateMoonChart(updatedUser, chartType, apiEndpoint, existingChart);
      existingChart = await DerivedChart.findOne({ where: { derived_chart_id: derivedChartId } });
      message = 'Moon Chart updated and fetched successfully';
    }

    if (!existingChart) throw new Error('Failed to retrieve Moon Chart');

    const [planets, houses] = await Promise.all([
      DerivedChartPlanet.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
      DerivedChartHouse.findAll({ where: { derived_chart_id: existingChart.derived_chart_id } }),
    ]);

    const responseData = {
      chandra_lagna: {
        degree: (existingChart.chart_data as any).chandra_lagna?.degree || '',
        longitude: (existingChart.chart_data as any).chandra_lagna?.longitude || '',
        sign: (existingChart.chart_data as any).chandra_lagna?.sign || '',
      },
      planetary_positions: planets.map((planet: any) => ({
        planet: planet.planet,
        house: planet.house,
        longitude: planet.degree_formatted,
        retrograde: planet.is_retrograde,
        sign: planet.sign,
        deity: planet.deity,
        shashtiamsha: planet.shashtiamsha,
      })),
      house_cusps: houses.map((house: any) => ({
        house: house.house_number,
        sign: house.sign,
        cusp: house.start_longitude_formatted,
      })),
      metadata: (existingChart.chart_data as any).metadata || {},
    };

    await redisClient.setEx(redisKey, 3600, JSON.stringify({ chart_type: 'MOON', data: responseData }));

    res.status(200).json({
      message,
      data: {
        chart_type: 'MOON',
        data: responseData,
      },
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch Moon Chart');
  }
};