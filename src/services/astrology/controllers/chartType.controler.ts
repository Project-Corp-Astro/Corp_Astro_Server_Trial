import { Request, Response } from 'express';
import ChartType from '../models/ChartType';

export const insertChartType = async (req: Request, res: Response) => {
  try {
    const chartTypeData = req.body;

    const newChartType = await ChartType.create(chartTypeData);

    res.status(201).json({
      message: 'Chart type inserted successfully',
      data: newChartType
    });
  } catch (error) {
    console.error('Error inserting chart type:', error);
    res.status(500).json({ error: 'Failed to insert chart type' });
  }
};
