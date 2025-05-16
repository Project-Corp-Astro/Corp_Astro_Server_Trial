import { DailyTransit } from '../../models/dailyTransit';
import cron from 'node-cron';
import axios from 'axios';

// Mapping of planets to unique transit_ids
const planetIds = {
  'Sun': 1,
  'Moon': 2,
  'Mercury': 3,
  'Venus': 4,
  'Mars': 5,
  'Jupiter': 6,
  'Saturn': 7,
  'Uranus': 8,
  'Neptune': 9,
  'Pluto': 10
} as const;

type Planet = keyof typeof planetIds;
type TransitData = {
  planet: Planet;
  longitude: number;
  latitude: number;
  speed: number;
  acceleration: number;
  is_retrograde: boolean;
  is_station: boolean;
  station_type: 'direct' | 'retrograde';
  zodiac_sign: string;
  zodiac_degree: number;
  degree_formatted: string;
  nakshatra: string;
  nakshatra_pada: number;
  ayanamsa: string;
  ayanamsa_value: number;
  zodiac_system: string;
};

// Service function to insert daily transits
export async function insertDailyTransits(transits: TransitData[], timestamp: Date) {
  for (const transit of transits) {
    const transit_id = planetIds[transit.planet];
    if (!transit_id) {
      throw new Error(`Unknown planet: ${transit.planet}`);
    }
    await DailyTransit.create({
      transit_id,
      transit_timestamp: timestamp,
      planet: transit.planet,
      longitude: transit.longitude,
      latitude: transit.latitude,
      speed: transit.speed,
      acceleration: transit.acceleration,
      is_retrograde: transit.is_retrograde,
      is_station: transit.is_station,
      station_type: transit.station_type,
      zodiac_sign: transit.zodiac_sign,
      zodiac_degree: transit.zodiac_degree,
      degree_formatted: transit.degree_formatted,
      nakshatra: transit.nakshatra,
      nakshatra_pada: transit.nakshatra_pada,
      ayanamsa: transit.ayanamsa,
      ayanamsa_value: transit.ayanamsa_value,
      zodiac_system: transit.zodiac_system,
      created_at: new Date(),
      updated_at: new Date()
    });
  }
}

// Function to fetch transit data from the API
export async function getTransitData(timestamp: Date): Promise<TransitData[]> {
  try {
    const response = await axios.post(`${process.env.ASTRO_ENGINE_URL}/calculate_transits`, {
      timestamp: timestamp.toISOString(),
      zodiac_system: 'SIDEREAL',
      ayanamsa: 'LAHIRI'
    });

    if (!response.data || !Array.isArray(response.data.transits)) {
      throw new Error('Invalid response from transit calculation service');
    }

    return response.data.transits.map((transit: any) => ({
      planet: transit.planet,
      longitude: transit.longitude,
      latitude: transit.latitude,
      speed: transit.speed,
      acceleration: transit.acceleration,
      is_retrograde: transit.is_retrograde,
      is_station: transit.is_station,
      station_type: transit.station_type,
      zodiac_sign: transit.zodiac_sign,
      zodiac_degree: transit.zodiac_degree,
      degree_formatted: transit.degree_formatted,
      nakshatra: transit.nakshatra,
      nakshatra_pada: transit.nakshatra_pada,
      ayanamsa: transit.ayanamsa,
      ayanamsa_value: transit.ayanamsa_value,
      zodiac_system: transit.zodiac_system
    }));
  } catch (error) {
    console.error('Error fetching transit data:', error);
    throw error;
  }
}

// Cron job setup to run at midnight UTC daily
export function setupdailyTransitCronJobs() {
  // Schedule to run at 00:00 (midnight) every day
  cron.schedule('0 0 * * *', async () => {
    const now = new Date();
    const timestamp = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
    //call astrological api to get transit data
    const transits = await getTransitData(timestamp);
    //insert transits into database
    try {
      await insertDailyTransits(transits, timestamp);
      console.log(`Successfully inserted transits for ${timestamp}`);
    } catch (error: any) {
      console.error(`Error inserting transits for ${timestamp}:`, error);
    }
  }, {
    timezone: 'UTC'
  });
}