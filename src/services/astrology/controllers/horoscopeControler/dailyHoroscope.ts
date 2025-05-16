import DailyHoroscope from "../../models/dailyHoroscope";
import DailyTransit from "../../models/dailyTransit";
import cron from 'node-cron';
import { Request, Response } from 'express';

const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] as const;

type ZodiacSign = typeof signs[number];

const rulers = {
  'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon', 'Leo': 'Sun', 'Virgo': 'Mercury',
  'Libra': 'Venus', 'Scorpio': 'Mars', 'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
} as const;

type Planet = typeof rulers[ZodiacSign];

const planetNumbers = { 'Sun': 1, 'Moon': 2, 'Mars': 9, 'Mercury': 5, 'Jupiter': 3, 'Venus': 6, 'Saturn': 8 } as const;

const moodMap = {
  'Aries': 'energetic', 'Taurus': 'calm', 'Gemini': 'curious', 'Cancer': 'emotional', 'Leo': 'confident', 'Virgo': 'analytical',
  'Libra': 'harmonious', 'Scorpio': 'intense', 'Sagittarius': 'optimistic', 'Capricorn': 'disciplined', 'Aquarius': 'innovative', 'Pisces': 'dreamy'
} as const;

type Mood = typeof moodMap[ZodiacSign];

const colorMap = {
  'Aries': 'red', 'Taurus': 'green', 'Gemini': 'yellow', 'Cancer': 'silver', 'Leo': 'gold', 'Virgo': 'brown',
  'Libra': 'pink', 'Scorpio': 'black', 'Sagittarius': 'purple', 'Capricorn': 'gray', 'Aquarius': 'blue', 'Pisces': 'sea green'
} as const;

type Color = typeof colorMap[ZodiacSign];

type HouseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type PlanetHouseInterpretations = {
  [key in Planet]: {
    [key in HouseNumber]: string;
  };
};

const planetHouseInterpretations: PlanetHouseInterpretations = {
  'Sun': {
    1: 'You may feel more confident and expressive today.',
    2: 'Financial matters come into focus.',
    3: 'Communication and learning are highlighted.',
    4: 'Home life feels vibrant and central.',
    5: 'Creativity and romance shine today.',
    6: 'Focus on health and daily routines.',
    7: 'Relationships take the spotlight.',
    8: 'Transformation and shared resources are key.',
    9: 'Adventure and growth inspire you.',
    10: 'Career ambitions rise to the surface.',
    11: 'Friends and dreams energize you.',
    12: 'A day for reflection and inner peace.'
  },
  'Moon': {
    1: 'Emotions are heightened; trust your instincts.',
    2: 'Seek comfort in material security.',
    3: 'Your mind feels restless and curious.',
    4: 'Home and family take center stage.',
    5: 'Emotions fuel your creative side.',
    6: 'Attend to your well-being today.',
    7: 'Partnerships stir your feelings.',
    8: 'Deep emotions may surface.',
    9: 'Seek emotional growth through exploration.',
    10: 'Your public image feels personal.',
    11: 'Connect emotionally with friends.',
    12: 'A quiet, introspective mood prevails.'
  },
  'Mercury': {
    1: 'Your mind is sharp and active.',
    2: 'Financial discussions or planning are favored.',
    3: 'Communication flows easily; great for learning.',
    4: 'Thoughts turn to home and family matters.',
    5: 'Creative ideas come quickly.',
    6: 'Organize your routines and health plans.',
    7: 'Partnerships benefit from clear communication.',
    8: 'Delve into deep or taboo subjects.',
    9: 'Expand your mind through study or travel.',
    10: 'Career-related communication is key.',
    11: 'Networking and group discussions thrive.',
    12: 'Reflect on your thoughts and dreams.'
  },
  'Venus': {
    1: 'Love and charm radiate from you.',
    2: 'Financial gains or indulgences are possible.',
    3: 'Pleasant conversations and short trips.',
    4: 'Beautify your home or enjoy family time.',
    5: 'Romance and creativity are highlighted.',
    6: 'Harmony in daily work and health routines.',
    7: 'Relationships feel loving and balanced.',
    8: 'Shared finances or intimacy deepen.',
    9: 'Love for adventure or learning grows.',
    10: 'Your public image is charming.',
    11: 'Social life and friendships blossom.',
    12: 'Find beauty in solitude or spiritual pursuits.'
  },
  'Mars': {
    1: 'You might feel more assertive or impatient.',
    2: 'Push forward on financial goals.',
    3: 'Debates or quick decisions arise.',
    4: 'Energy focuses on home projects.',
    5: 'Passion drives fun and romance.',
    6: 'Tackle tasks with vigor.',
    7: 'Relationships may spark some friction.',
    8: 'Confront challenges head-on.',
    9: 'Boldly pursue new horizons.',
    10: 'Ambition fuels your career moves.',
    11: 'Team efforts get a boost.',
    12: 'Channel energy inwardly today.'
  },
  'Jupiter': {
    1: 'Optimism opens new doors.',
    2: 'Financial opportunities may arise.',
    3: 'Learning and communication expand.',
    4: 'Home life feels abundant.',
    5: 'Creativity and joy increase.',
    6: 'Health and work benefit from positivity.',
    7: 'Partnerships grow and thrive.',
    8: 'Transformation brings growth.',
    9: 'Travel or study brings wisdom.',
    10: 'Career advancements are possible.',
    11: 'Friendships and goals align.',
    12: 'Spiritual growth is favored.'
  },
  'Saturn': {
    1: 'Duty calls; stay disciplined.',
    2: 'Financial responsibilities weigh on you.',
    3: 'Communication requires careful thought.',
    4: 'Home matters need attention.',
    5: 'Creativity may feel blocked; persevere.',
    6: 'Health and work demand discipline.',
    7: 'Relationships face tests or commitments.',
    8: 'Shared resources require management.',
    9: 'Learning may feel challenging but rewarding.',
    10: 'Career responsibilities are prominent.',
    11: 'Group efforts need structure.',
    12: 'Inner work and solitude are necessary.'
  }
};

type Transit = {
  planet: Planet;
  zodiac_sign: ZodiacSign;
};

// Helper function to calculate house number
function getHouse(transitSign: ZodiacSign, zodiacSign: ZodiacSign): HouseNumber {
  const transitIndex = signs.indexOf(transitSign);
  const signIndex = signs.indexOf(zodiacSign);
  return ((transitIndex - signIndex + 12) % 12 + 1) as HouseNumber;
}

// Generate prediction based on multiple planets
function generatePrediction(sign: ZodiacSign, transits: Transit[]): string {
  const ruler = rulers[sign];
  let prediction = '';

  // Include Sun, Moon, ruling planet, and Mars for a balanced yet detailed prediction
  const planetsToInclude: Planet[] = ['Sun', 'Moon', ruler, 'Mars'];
  for (const planet of planetsToInclude) {
    const transit = transits.find(t => t.planet === planet);
    if (transit) {
      const house = getHouse(transit.zodiac_sign, sign);
      const interpretation = planetHouseInterpretations[planet]?.[house];
      if (interpretation) {
        prediction += `${planet} in your ${house}th house: ${interpretation} `;
      }
    }
  }
  return prediction.trim() || 'A day of balance and steady progress.';
}

// Generate lucky number
function generateLuckyNumber(sign: ZodiacSign, date: Date): number {
  const ruler = rulers[sign];
  const baseNumber = planetNumbers[ruler as keyof typeof planetNumbers] || 1;
  const day = date.getDate();
  return (baseNumber + day) % 10 + 1; // Returns 1-10
}

// Generate lucky color
function generateLuckyColor(sign: ZodiacSign): Color {
  return colorMap[sign];
}

// Main function to generate and store horoscopes
export async function generateDailyHoroscopes(date = new Date()): Promise<void> {
  try {
    const transits = await DailyTransit.findAll({ where: { transit_timestamp: date } });
    if (!transits.length) throw new Error('No transit data available for this date.');

    const moonTransit = transits.find(t => t.planet === 'Moon');
    const moonSign = moonTransit ? moonTransit.zodiac_sign as ZodiacSign : 'Aries';
    const mood = moodMap[moonSign];

    for (const sign of signs) {
      const prediction = generatePrediction(sign, transits as Transit[]);
      const luckyNumber = generateLuckyNumber(sign, date);
      const luckyColor = generateLuckyColor(sign);

      const [horoscope, created] = await DailyHoroscope.findOrCreate({
        where: { zodiac_sign: sign, prediction_date: date },
        defaults: {
          horoscope_id: 0,
          zodiac_sign: sign,
          prediction_date: date,
          prediction,
          lucky_number: luckyNumber,
          lucky_color: luckyColor,
          mood,
          status: 'published',
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      if (!created) {
        await horoscope.update({
          prediction,
          lucky_number: luckyNumber,
          lucky_color: luckyColor,
          mood,
          status: 'published'
        });
      }
    }
    console.log(`Horoscopes generated for ${date.toISOString().split('T')[0]}`);
  } catch (error: any) {
    console.error(`Error generating horoscopes: ${error.message}`);
    throw error;
  }
}

// Setup cron job to run daily at midnight
export function setupHoroscopeCronJob(): void {
  // Schedule to run at 00:00 (midnight) every day
  cron.schedule('0 0 * * *', async () => {
    try {
      const today = new Date();
      console.log(`Starting daily horoscope generation for ${today.toISOString().split('T')[0]}`);
      await generateDailyHoroscopes(today);
      console.log(`Completed daily horoscope generation for ${today.toISOString().split('T')[0]}`);
    } catch (error: any) {
      console.error('Error in daily horoscope cron job:', error.message);
    }
  }, {
    timezone: 'UTC' // Run in UTC timezone
  });
}


export const getHoroscopeBySignName = async (req: Request, res: Response) => {
  try { 
    const { signName } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day for consistency

    const horoscope = await DailyHoroscope.findOne({
      where: {
        zodiac_sign: signName,
        prediction_date: today
      }
    });

    if (!horoscope) {
      console.warn(`No horoscope found for ${signName} on ${today.toISOString().split('T')[0]}`);
    }

    return horoscope;
  } catch (error: any) {
    console.error('Error in getHoroscopeBySignName:', error.message);
    throw new Error('Failed to retrieve horoscope');
  }
}