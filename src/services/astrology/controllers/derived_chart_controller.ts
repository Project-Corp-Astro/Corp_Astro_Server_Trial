import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import User from '../../user-management/models/user';
import { fetchD7Chart } from './derivedControllers/d7Chart';
import { fetchD2Chart } from './derivedControllers/d2Chart';
import { fetchD3Chart } from './derivedControllers/d3Chart';
import { fetchD4Chart } from './derivedControllers/d4Chart';
import { fetchD9Chart } from './derivedControllers/d9Chart';
import { fetchD10Chart } from './derivedControllers/d10Chart';
import { fetchD12Chart } from './derivedControllers/d12Chart';
import { fetchD16Chart } from './derivedControllers/d16Chart';  
import { fetchD24Chart } from './derivedControllers/d24Chart';
import { fetchD20Chart } from './derivedControllers/d20Chart';
import { fetchD45Chart } from './derivedControllers/d45Chart';
import { fetchD60Chart } from './derivedControllers/d60Chart';
import { fetchMoonChart } from './derivedControllers/moonChart';
import { fetchSunChart } from './derivedControllers/sunChart';
import { fetchD40Chart } from './derivedControllers/d40Chart';

interface ChartResponse {
  chart_type: string;
  data: any;
}
// Main function to fetch all charts
async function fetchAllCharts(user: any): Promise<ChartResponse[]> {
  const chartFunctions = [
    fetchD2Chart,
    fetchD3Chart,
    fetchD4Chart,
    fetchD7Chart,
    fetchD9Chart,
    fetchD10Chart,
    fetchD12Chart,
    fetchD16Chart,
    fetchD20Chart,
    fetchD24Chart,
    fetchD40Chart,
    fetchD45Chart,
    fetchD60Chart,
    fetchMoonChart,
    fetchSunChart
  ];

  const results: ChartResponse[] = [];
  for (const fetchChart of chartFunctions) {
    try {
      const mockReq = {
        params: { id: user.user_id }
      } as unknown as Request;
      
      const mockRes = {
        status: () => mockRes,
        json: (data: any) => {
          results.push(data);
          return mockRes;
        },
        send: () => mockRes,
        sendStatus: () => mockRes,
        links: () => mockRes,
      } as unknown as Response;

      await fetchChart(mockReq, mockRes);
    } catch (error: any) {
      console.error(`Error fetching chart in ${fetchChart.name}:`, error.message);
      results.push({
        chart_type: fetchChart.name.replace('fetch', ''),
        data: { message: `Failed to fetch chart`, error: error.message },
      });
    }
  }
  return results;
}

// Main controller
export const fetchDerivedData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    console.log(`Processing request for userId: ${id}`);

    // Validate inputs
    if (!id) {
      res.status(400).json({ message: 'Missing required parameter: userId' });
      return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      res.status(400).json({ message: 'Invalid userId format' });
      return;
    }

    // Find user for birth details
    const user = await User.findOne({ where: { user_id: id } });
    if (!user) {
      res.status(404).json({ message: `No user found for userId: ${id}` });
      return;
    }

    // Validate required birth details
    if (!user.date_of_birth || !user.time_of_birth || !user.latitude || !user.longitude || !user.timezone_offset) {
      res.status(400).json({ message: 'Incomplete birth details for user' });
      return;
    }

    // Fetch all charts
    const chartResults = await fetchAllCharts(user);

    res.status(200).json({
      message: 'All charts processed successfully',
      data: chartResults,
    });
  } catch (error: any) {
    console.error('Error in fetchDerivedData:', error);
    if (error instanceof ValidationError) {
      res.status(400).json({
        message: 'Validation error occurred',
        errors: error.errors.map((e: any) => ({
          field: e.path,
          message: e.message,
          value: e.value,
        })),
      });
    } else {
      res.status(500).json({ message: 'Failed to fetch derived chart data', error: error.message });
    }
  }
};
