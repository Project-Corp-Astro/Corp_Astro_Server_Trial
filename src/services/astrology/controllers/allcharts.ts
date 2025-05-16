//create function to fetch all charts
import { Request, Response } from 'express';
import { fetchNatalData } from './natal_chart_controller';
import { fetchDerivedData } from './derived_chart_controller';

export const fetchAllCharts = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        // Create mock request objects with the correct parameter structure
        const natalReq = { ...req, params: { userId } } as unknown as Request;
        const derivedReq = { ...req, params: { id: userId } } as unknown as Request;

        // Create response objects that capture the data
        let natalResponse: any = null;
        let derivedResponse: any = null;

        const natalRes = {
            json: (data: any) => {
                natalResponse = data;
                return data;
            },
            status: (code: number) => ({
                json: (data: any) => {
                    natalResponse = data;
                    return data;
                }
            })
        } as Response;

        const derivedRes = {
            json: (data: any) => {
                derivedResponse = data;
                return data;
            },
            status: (code: number) => ({
                json: (data: any) => {
                    derivedResponse = data;
                    return data;
                }
            })
        } as Response;

        // Get the data from both controllers
        await fetchNatalData(natalReq, natalRes);
        await fetchDerivedData(derivedReq, derivedRes);

        // Send the combined response
        res.json({
            success: true,
            data: {
                natalChart: natalResponse,
                derivedCharts: derivedResponse
            }
        });
    } catch (error: any) {
        console.error('Error in fetchAllCharts:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching charts', 
            error: error.message 
        });
    }
};


