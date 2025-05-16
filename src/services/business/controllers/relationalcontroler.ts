//create a function to fetch the relational chart
import { Request, Response } from "express";
import RelationshipChart from "../models/relationchart";
import BusinessPartner from "../models/business_partners";
import User from "../../user-management/models/user";
import axios from "axios";
import sequelize from "../../../config/postgres.config";
import ChartType from "../../astrology/models/ChartType";
import dotenv from "dotenv";
import { Op } from "sequelize";
import business from "..";
import BusinessProfile from "../models/businessProfile";
import { redisClient } from "../../../config/redis.config";
dotenv.config();

//astro engine url
const ASTRO_ENGINE_URL = process.env.Astro_Url;

// export const insertRelationalChart = async (req: Request, res: Response) => {
//     try {
//       // Get chart type from the ChartType table
//       const chartType = await ChartType.findOne({ where: { chart_name: 'Synastry Chart' } });
//       console.log('Chart Type:', chartType);

//       if (!chartType) {
//         return res.status(400).json({ error: 'Chart type not found' });
//       }

//       // Get partner id and user id from the request body
//       const { partnerId, userId } = req.body;
//       console.log('Partner ID:', partnerId);
//       console.log('User ID:', userId);

//       // Check if the partner id and user id are valid
//       const user = await User.findOne({ where: { user_id: userId } });
//       const partner = await BusinessPartner.findOne({ where: { partner_id: partnerId } });

//       if (!partner || !user) {
//         return res.status(400).json({ error: 'Invalid partner or user id' });
//       }
//       //console the user and partner data
//       console.log('User:', user);
//       console.log('Partner:', partner);

//       // Ensure tz_offset is a number (parse it if it's a string)
//       const person_a = {
//         name: user.full_name,
//         date: user.date_of_birth,
//         time: user.time_of_birth,
//         lat: isNaN(Number(user.latitude)) ? 0 : Number(user.latitude),
//         lon: isNaN(Number(user.longitude)) ? 0 : Number(user.longitude),
//         tz_offset: isNaN(Number(user.timezone_offset)) ? 0 : Number(user.timezone_offset)
//       };

//       const person_b = {
//         name: partner.partner_name,
//         date: partner.date_of_birth,
//         time: partner.birth_time,
//         lat: isNaN(Number(partner.latitude)) ? 0 : Number(partner.latitude),
//         lon: isNaN(Number(partner.longitude)) ? 0 : Number(partner.longitude),
//         tz_offset: isNaN(Number(partner.timezone_offset)) ? 0 : Number(partner.timezone_offset)
//       };

//       // Log the details for debugging
//       console.log('Person A Details:', person_a);
//       console.log('Person B Details:', person_b);

//       // Validation: Make sure time, date, and other required fields are not null
//       if (!person_a.time || !person_b.time || !person_a.date || !person_b.date) {
//         return res.status(400).json({ error: 'Missing required birth time or date' });
//       }

//       // Log before sending the request
//       console.log('Sending request to synastry API with data:', { person_a, person_b });

//       // Call the synastry API
//       let chartData;
//       try {
//         chartData = await axios.post('http://localhost:5000/synastry', { person_a, person_b });
//         console.log('Synastry API response:', chartData.data);
//       } catch (axiosError: any) {
//         const errorMessage = axiosError?.response?.data?.error || axiosError.message;
//         console.error('Error calling the synastry API:', errorMessage);
//         return res.status(500).json({
//           error: 'Error fetching synastry chart data',
//           details: errorMessage
//         });
//       }

//       // Check if a relational chart already exists
//       const existingChart = await RelationshipChart.findOne({
//         where: { entity_ids: [userId, partnerId], chart_type_id: chartType.chart_type_id }
//       });

//       if (existingChart) {
//         return res.status(400).json({ error: 'Relational chart already exists for this pair' });
//       }

//       // Insert the chart data into the relational chart
//       const relationalChart = await RelationshipChart.create({
//         chart_data: chartData.data,
//         chart_name: chartType.chart_name,
//         entity_ids: [userId, partnerId],
//         chart_type_id: chartType.chart_type_id
//       });

//       res.status(201).json(relationalChart);

//     } catch (error: any) {
//       console.error('Error in insertRelationalChart:', error);
//       res.status(500).json({ error: 'Internal server error', details: error.message });
//     }
//   };

//fetch the relational chart

//   export const fetchRelationalChart = async (req: Request, res: Response) => {
//   const { entityId, entityType } = req.params;
//   try {
//     const relationalChart = await RelationshipChart.findOne({
//       where: { entity_ids: [entityId, entityType] }
//     });
//     if (!relationalChart) {
//       return res.status(404).json({ error: 'Relational chart not found' });
//     }
//     res.status(200).json(relationalChart);
//   } catch (error) {
//     console.error('Error fetching relational chart:', error);
//     res.status(500).json({ error: 'Failed to fetch relational chart' });
//   }
// };

const toPerson = (entity: any) => ({
  name: entity?.full_name || entity?.partner_name || entity?.business_name,
  date:
    entity?.date_of_birth || entity?.birth_date || entity?.incorporation_date,
  time: entity?.time_of_birth || entity?.birth_time || entity?.corporate_time,
  lat: Number(entity?.latitude),
  lon: Number(entity?.longitude),
  tz_offset: Number(entity?.timezone_offset),
});

// export const insertSynastryChart = async (req: Request, res: Response): Promise<void> => {
//   try {

//     // Get entities for the synastry chart from the request body
//     const { user_id, partner_id, business_id ,chart_type_id} = req.body;

//     const chartType = await ChartType.findOne({ where: { chart_type_id: chart_type_id } });

//     if (!chartType) {
//       res.status(400).json({ error: 'Chart type not found' });
//       return;
//     }
//     // Validate the request body based on the type of synastry requested
//     let user, partner, businessPartner;

//     if (user_id) {
//       user = await User.findOne({ where: { user_id: user_id } });
//       if (!user) {
//         res.status(400).json({ error: 'Invalid user ID' });
//         return;
//       }
//     }

//     if (partner_id) {
//       partner = await BusinessPartner.findOne({ where: { partner_id: partner_id } });
//       if (!partner) {
//         //controler send to to next if block
//         return;
//       }
//     }

//     if (business_id) {
//       businessPartner = await BusinessPartner.findOne({ where: { business_id: business_id } });
//       if (!businessPartner) {
//         res.status(400).json({ error: 'Invalid business partner ID' });
//         return;
//       }
//     }

//     // Prepare the synastry chart generation details
//     let personA, personB;

//     if (user_id && partner_id) {
//       personA = {
//         name: user?.full_name,
//         date: user?.date_of_birth,
//         time: user?.time_of_birth,
//         lat: isNaN(Number(user?.latitude)) ? 0 : Number(user?.latitude),
//         lon: isNaN(Number(user?.longitude)) ? 0 : Number(user?.longitude),
//         tz_offset: isNaN(Number(user?.timezone_offset)) ? 0 : Number(user?.timezone_offset)
//       };

//       personB = {
//         name: partner?.partner_name,
//         date: partner?.date_of_birth,
//         time: partner?.birth_time,
//         lat: isNaN(Number(partner?.latitude)) ? 0 : Number(partner?.latitude),
//         lon: isNaN(Number(partner?.longitude)) ? 0 : Number(partner?.longitude),
//         tz_offset: isNaN(Number(partner?.timezone_offset)) ? 0 : Number(partner?.timezone_offset)
//       };
//     }

//     if (user_id && business_id) {
//       personA = {
//         name: user?.full_name,
//         date: user?.date_of_birth,
//         time: user?.time_of_birth,
//         lat: isNaN(Number(user?.latitude)) ? 0 : Number(user?.latitude),
//         lon: isNaN(Number(user?.longitude)) ? 0 : Number(user?.longitude),
//         tz_offset: isNaN(Number(user?.timezone_offset)) ? 0 : Number(user?.timezone_offset)
//       };

//       personB = {
//         name: businessPartner?.partner_name,
//         date: businessPartner?.date_of_birth,
//         time: businessPartner?.birth_time,
//         lat: isNaN(Number(businessPartner?.latitude)) ? 0 : Number(businessPartner?.latitude),
//         lon: isNaN(Number(businessPartner?.longitude)) ? 0 : Number(businessPartner?.longitude),
//         tz_offset: isNaN(Number(businessPartner?.timezone_offset)) ? 0 : Number(businessPartner?.timezone_offset)
//       };
//     }

//     if (partner_id && business_id) {
//       personA = {
//         name: partner?.partner_name,
//         date: partner?.date_of_birth,
//         time: partner?.birth_time,
//         lat: isNaN(Number(partner?.latitude)) ? 0 : Number(partner?.latitude),
//         lon: isNaN(Number(partner?.longitude)) ? 0 : Number(partner?.longitude),
//         tz_offset: isNaN(Number(partner?.timezone_offset)) ? 0 : Number(partner?.timezone_offset)
//       };

//       personB = {
//         name: businessPartner?.partner_name,
//         date: businessPartner?.date_of_birth,
//         time: businessPartner?.birth_time,
//         lat: isNaN(Number(businessPartner?.latitude)) ? 0 : Number(businessPartner?.latitude),
//         lon: isNaN(Number(businessPartner?.longitude)) ? 0 : Number(businessPartner?.longitude),
//         tz_offset: isNaN(Number(businessPartner?.timezone_offset)) ? 0 : Number(businessPartner?.timezone_offset)
//       };
//     }

//     // Check if a chart already exists
//     let existingChart;

//     if (user_id && partner_id && !business_id) {
//       existingChart = await RelationshipChart.findOne({
//         where: {
//           entity_ids: [user_id, partner_id],
//           chart_type_id: chart_type_id
//         }
//       });
//     } else if (user_id && business_id && !partner_id) {
//       existingChart = await RelationshipChart.findOne({
//         where: {
//           entity_ids: [user_id, business_id],
//           chart_type_id: chart_type_id
//         }
//       });
//     } else if (partner_id && business_id && !user_id) {
//       existingChart = await RelationshipChart.findOne({
//         where: {
//           entity_ids: [partner_id, business_id],
//           chart_type_id: chart_type_id
//         }
//       });
//     }

//     if (existingChart) {
//       res.status(200).json(existingChart);
//       return;
//     }

//     // Call external API to generate chart
//     let chartData;
//     try {
//       chartData = await axios.post(`${ASTRO_ENGINE_URL}/synastry`, { person_a: personA, person_b: personB });
//     } catch (axiosError: any) {
//       const errorMessage = axiosError?.response?.data?.error || axiosError.message;
//       res.status(500).json({
//         error: 'Error fetching synastry chart data',
//         details: errorMessage
//       });
//       return;
//     }

//     // Store new chart
//     const relationalChart = await RelationshipChart.create({
//       chart_data: chartData.data,
//       chart_name: chartType.chart_name,
//       entity_ids: [user_id || partner_id, partner_id || business_id],
//       chart_type_id: chartType.chart_type_id
//     });

//     res.status(201).json(relationalChart);
//   } catch (error: any) {
//     console.error('Error in insertRelationalChart:', error);
//     res.status(500).json({ error: 'Internal server error', details: error.message });
//   }
// };

export const insertSynastryChart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { user_id, partner_id, business_id, chart_type_id } = req.body;

    const chartType = await ChartType.findOne({ where: { chart_type_id } });
    if (!chartType) {
      return res.status(400).json({ error: "Chart type not found" });
    }

    let user, partner, businessProfile;

    if (user_id && !partner_id && business_id) {
      user = await User.findOne({ where: { user_id } });
      if (!user) return res.status(400).json({ error: "Invalid user ID" });

      businessProfile = await BusinessProfile.findOne({
        where: { business_id },
      });
      if (!businessProfile)
        return res.status(400).json({ error: "Invalid business ID" });
    } else if (user_id && partner_id && !business_id) {
      user = await User.findOne({ where: { user_id } });
      if (!user) return res.status(400).json({ error: "Invalid user ID" });

      partner = await BusinessPartner.findOne({ where: { partner_id } });
      if (!partner)
        return res.status(400).json({ error: "Invalid partner ID" });
    } else if (!user_id && partner_id && business_id) {
      partner = await BusinessPartner.findOne({ where: { partner_id } });
      if (!partner)
        return res.status(400).json({ error: "Invalid partner ID" });

      businessProfile = await BusinessProfile.findOne({
        where: { business_id },
      });
      if (!businessProfile)
        return res.status(400).json({ error: "Invalid business ID" });
    } else {
      return res.status(400).json({
        error:
          "Invalid combination of IDs. Provide exactly two: (user_id + partner_id) OR (user_id + business_id) OR (partner_id + business_id)",
      });
    }

    let personA = user ? toPerson(user) : toPerson(partner);
    let personB = businessProfile
      ? toPerson(businessProfile)
      : toPerson(partner);

    let ids: string[] = [];
    if (user_id && partner_id && !business_id) {
      ids = [user_id, partner_id];
    } else if (user_id && !partner_id && business_id) {
      ids = [user_id, business_id];
    } else if (!user_id && partner_id && business_id) {
      ids = [partner_id, business_id];
    }
    ids.sort();
    //check in redis if alredy exist
    // const redisKey = `synastry_chart_${ids.join("_")}_${chart_type_id}`;

    // const cachedChart = await redisClient.get(redisKey);
    // if (cachedChart) {
    //   return res.status(200).json(JSON.parse(cachedChart));
    // }

    const existingChart = await RelationshipChart.findOne({
      where: {
        entity_ids: ids,
        chart_type_id,
      },
    });

    if (existingChart) {
      return res.status(200).json(existingChart);
    }

    // Generate chart via external API (only change is here: /synastry instead of /composite)
    let chartData;
    try {
      chartData = await axios.post(`${ASTRO_ENGINE_URL}/synastry`, {
        person_a: personA,
        person_b: personB,
      });
    } catch (axiosError: any) {
      const errorMessage =
        axiosError?.response?.data?.error || axiosError.message;
      return res.status(500).json({
        error: "Error fetching synastry chart data",
        details: errorMessage,
      });
    }

    const relationalChart = await RelationshipChart.create({
      chart_data: chartData.data,
      chart_name: chartType.chart_name,
      entity_ids: ids,
      chart_type_id: chartType.chart_type_id,
    });

    const redisKey = `synastry_chart_${ids.join("_")}_${chart_type_id}`;
    await redisClient.set(redisKey, JSON.stringify(relationalChart)); // Cache for 1 hour

    return res.status(201).json(relationalChart);
  } catch (error: any) {
    console.error("Error in insertSynastryChart:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const fetchRelationalChart = async (req: Request, res: Response) => {
  try {
    const { user_id, partner_id, business_id, chart_type_id } = req.body;
    const entityIds = [user_id, partner_id, business_id].filter(Boolean);
    if (entityIds.length < 2) {
      return res.status(400).json({
        error: "Provide exactly two of: user_id, partner_id, business_id",
      });
    }
    if (chart_type_id === 25) {
      const redisKey = `synastry_chart_${entityIds.join("_")}_${chart_type_id}`;
      const cachedChart = await redisClient.get(redisKey);
      if (cachedChart) return res.status(200).json(JSON.parse(cachedChart));
    } else if (chart_type_id === 26) {
      const redisKey = `composite_chart_${entityIds.join(
        "_"
      )}_${chart_type_id}`;
      const cachedChart = await redisClient.get(redisKey);
      if (cachedChart) return res.status(200).json(JSON.parse(cachedChart));
    }
    const existingChart = await RelationshipChart.findOne({
      where: {
        chart_type_id,
        entity_ids: { [Op.contains]: entityIds },
      },
    });
    if (existingChart) {
      if (chart_type_id === 25) {
        const redisKey = `synastry_chart_${entityIds.join(
          "_"
        )}_${chart_type_id}`;
        await redisClient.set(redisKey, JSON.stringify(existingChart));
      } else if (chart_type_id === 26) {
        const redisKey = `composite_chart_${entityIds.join(
          "_"
        )}_${chart_type_id}`;
        await redisClient.set(redisKey, JSON.stringify(existingChart));
      }
      return res.status(200).json(existingChart);
    }
    const chartTypeIdNumber = Number(chart_type_id);

    if (chartTypeIdNumber === 25) {
      const newChart = await insertSynastryChart(
        {
          body: { user_id, partner_id, business_id, chart_type_id },
        } as Request,
        res
      );
      return res.status(201).json(newChart);
    } else if (chartTypeIdNumber === 26) {
      const newChart = await insertCompositeChart(
        {
          body: { user_id, partner_id, business_id, chart_type_id },
        } as Request,
        res
      );
      return res.status(201).json(newChart);
    } else {
      return res.status(400).json({ error: "Invalid chart type ID" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// export const insertCompositeChart = async (req: Request, res: Response): Promise<void> => {
//     try {

//       // Get entities for the synastry chart from the request body
//       const { user_id, partner_id, business_id ,chart_type_id} = req.body;

//       const chartType = await ChartType.findOne({ where: { chart_type_id: chart_type_id } });
//       if (!chartType) {
//         res.status(400).json({ error: 'Chart type not found' });
//         return;
//       }
//       // Validate the request body based on the type of synastry requested
//       let user, partner, businessPartner;

//       if (user_id) {
//         user = await User.findOne({ where: { user_id: user_id } });
//         if (!user) {
//           res.status(400).json({ error: 'Invalid user ID' });
//           return;
//         }
//       }

//       if (partner_id) {
//         partner = await BusinessPartner.findOne({ where: { partner_id: partner_id } });
//         if (!partner) {
//           res.status(400).json({ error: 'Invalid partner ID' });
//           return;
//         }
//       }

//       if (business_id) {
//         businessPartner = await BusinessPartner.findOne({ where: { business_id: business_id } });
//         if (!businessPartner) {
//           res.status(400).json({ error: 'Invalid business partner ID' });
//           return;
//         }
//       }

//       // Prepare the synastry chart generation details
//       let personA, personB;

//       if (user_id && partner_id) {
//         personA = {
//           name: user?.full_name,
//           date: user?.date_of_birth,
//           time: user?.time_of_birth,
//           lat: isNaN(Number(user?.latitude)) ? 0 : Number(user?.latitude),
//           lon: isNaN(Number(user?.longitude)) ? 0 : Number(user?.longitude),
//           tz_offset: isNaN(Number(user?.timezone_offset)) ? 0 : Number(user?.timezone_offset)
//         };

//         personB = {
//           name: partner?.partner_name,
//           date: partner?.date_of_birth,
//           time: partner?.birth_time,
//           lat: isNaN(Number(partner?.latitude)) ? 0 : Number(partner?.latitude),
//           lon: isNaN(Number(partner?.longitude)) ? 0 : Number(partner?.longitude),
//           tz_offset: isNaN(Number(partner?.timezone_offset)) ? 0 : Number(partner?.timezone_offset)
//         };
//       }

//       if (user_id && business_id) {
//         personA = {
//           name: user?.full_name,
//           date: user?.date_of_birth,
//           time: user?.time_of_birth,
//           lat: isNaN(Number(user?.latitude)) ? 0 : Number(user?.latitude),
//           lon: isNaN(Number(user?.longitude)) ? 0 : Number(user?.longitude),
//           tz_offset: isNaN(Number(user?.timezone_offset)) ? 0 : Number(user?.timezone_offset)
//         };

//         personB = {
//           name: businessPartner?.partner_name,
//           date: businessPartner?.date_of_birth,
//           time: businessPartner?.birth_time,
//           lat: isNaN(Number(businessPartner?.latitude)) ? 0 : Number(businessPartner?.latitude),
//           lon: isNaN(Number(businessPartner?.longitude)) ? 0 : Number(businessPartner?.longitude),
//           tz_offset: isNaN(Number(businessPartner?.timezone_offset)) ? 0 : Number(businessPartner?.timezone_offset)
//         };
//       }

//       if (partner_id && business_id) {
//         personA = {
//           name: partner?.partner_name,
//           date: partner?.date_of_birth,
//           time: partner?.birth_time,
//           lat: isNaN(Number(partner?.latitude)) ? 0 : Number(partner?.latitude),
//           lon: isNaN(Number(partner?.longitude)) ? 0 : Number(partner?.longitude),
//           tz_offset: isNaN(Number(partner?.timezone_offset)) ? 0 : Number(partner?.timezone_offset)
//         };

//         personB = {
//           name: businessPartner?.partner_name,
//           date: businessPartner?.date_of_birth,
//           time: businessPartner?.birth_time,
//           lat: isNaN(Number(businessPartner?.latitude)) ? 0 : Number(businessPartner?.latitude),
//           lon: isNaN(Number(businessPartner?.longitude)) ? 0 : Number(businessPartner?.longitude),
//           tz_offset: isNaN(Number(businessPartner?.timezone_offset)) ? 0 : Number(businessPartner?.timezone_offset)
//         };
//       }

//       // Check if a chart already exists
//       let existingChart;

//       if (user_id && partner_id && !business_id) {
//         existingChart = await RelationshipChart.findOne({
//           where: {
//             entity_ids: [user_id, partner_id],
//             chart_type_id: chart_type_id
//           }
//         });
//       } else if (user_id && business_id && !partner_id) {
//         existingChart = await RelationshipChart.findOne({
//           where: {
//             entity_ids: [user_id, business_id],
//             chart_type_id: chart_type_id
//           }
//         });
//       } else if (partner_id && business_id && !user_id) {
//         existingChart = await RelationshipChart.findOne({
//           where: {
//             entity_ids: [partner_id, business_id],
//             chart_type_id: chart_type_id
//           }
//         });
//       }

//       if (existingChart) {
//         res.status(200).json(existingChart);
//         return;
//       }

//       // Call external API to generate chart
//       let chartData;
//       try {
//         chartData = await axios.post(`${ASTRO_ENGINE_URL}/composite`, { person_a: personA, person_b: personB });
//       } catch (axiosError: any) {
//         const errorMessage = axiosError?.response?.data?.error || axiosError.message;
//         res.status(500).json({
//           error: 'Error fetching composite chart data',
//           details: errorMessage
//         });
//         return;
//       }

//       // Store new chart
//       const relationalChart = await RelationshipChart.create({
//         chart_data: chartData.data,
//         chart_name: chartType.chart_name,
//         entity_ids: [user_id || partner_id, partner_id || business_id],
//         chart_type_id: chartType.chart_type_id
//       });

//       res.status(201).json(relationalChart);
//     } catch (error: any) {
//       console.error('Error in insertCompositeChart:', error);
//       res.status(500).json({ error: 'Internal server error', details: error.message });
//     }
//   };

export const insertCompositeChart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { user_id, partner_id, business_id, chart_type_id } = req.body;

    const chartType = await ChartType.findOne({ where: { chart_type_id } });
    if (!chartType) {
      return res.status(400).json({ error: "Chart type not found" });
    }

    let user, partner, businessProfile;

    // Load and validate only the provided relevant IDs
    if (user_id && !partner_id && business_id) {
      // user + business
      user = await User.findOne({ where: { user_id } });
      if (!user) return res.status(400).json({ error: "Invalid user ID" });

      businessProfile = await BusinessProfile.findOne({
        where: { business_id },
      });
      if (!businessProfile)
        return res.status(400).json({ error: "Invalid business ID" });
    } else if (user_id && partner_id && !business_id) {
      // user + partner
      user = await User.findOne({ where: { user_id } });
      if (!user) return res.status(400).json({ error: "Invalid user ID" });

      partner = await BusinessPartner.findOne({ where: { partner_id } });
      if (!partner)
        return res.status(400).json({ error: "Invalid partner ID" });
    } else if (!user_id && partner_id && business_id) {
      // partner + business
      partner = await BusinessPartner.findOne({ where: { partner_id } });
      if (!partner)
        return res.status(400).json({ error: "Invalid partner ID" });

      businessProfile = await BusinessProfile.findOne({
        where: { business_id },
      });
      if (!businessProfile)
        return res.status(400).json({ error: "Invalid business ID" });
    } else {
      return res.status(400).json({
        error:
          "Invalid combination of IDs. Provide exactly two: (user_id + partner_id) OR (user_id + business_id) OR (partner_id + business_id)",
      });
    }

    let personA = user ? toPerson(user) : toPerson(partner);
    let personB = businessProfile
      ? toPerson(businessProfile)
      : toPerson(partner);

    // Check for existing chart by user_id and partner_id and business_id and chart_type_id
    let ids: string[] = [];
    if (user_id && partner_id && !business_id) {
      ids = [user_id, partner_id];
    } else if (user_id && !partner_id && business_id) {
      ids = [user_id, business_id];
    } else if (!user_id && partner_id && business_id) {
      ids = [partner_id, business_id];
    }
    ids.sort();
    //check in redis if alredy exist
    // const redisKey = `composite_chart_${ids.join("_")}_${chart_type_id}`;
    // const cachedChart = await redisClient.get(redisKey);
    // if (cachedChart) {
    //   return res.status(200).json(JSON.parse(cachedChart));
    // }
    const existingChart = await RelationshipChart.findOne({
      where: {
        entity_ids: ids,
        chart_type_id,
      },
    });

    if (existingChart) {
      //await redisClient.set(redisKey, JSON.stringify(existingChart)); // Cache for 1 hour
      return res.status(200).json(existingChart);
    }

    // Generate chart via external API
    let chartData;
    try {
      chartData = await axios.post(`${ASTRO_ENGINE_URL}/composite`, {
        person_a: personA,
        person_b: personB,
      });
    } catch (axiosError: any) {
      const errorMessage =
        axiosError?.response?.data?.error || axiosError.message;
      return res.status(500).json({
        error: "Error fetching composite chart data",
        details: errorMessage,
      });
    }

    // Save new chart
    const relationalChart = await RelationshipChart.create({
      chart_data: chartData.data,
      chart_name: chartType.chart_name,
      entity_ids: ids,
      chart_type_id: chartType.chart_type_id,
    });
    const redisKey = `composite_chart_${ids.join("_")}_${chart_type_id}`;
    await redisClient.set(redisKey, JSON.stringify(relationalChart)); // Cache for 1 hour

    return res.status(201).json(relationalChart);
  } catch (error: any) {
    console.error("Error in insertCompositeChart:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

// export const updateRelationalChart = async (id: string, type: string) => {
//   try {

//     const charts = await RelationshipChart.findAll({
//       where: {
//         entity_ids: {
//           [Op.contains]: [id]
//         }
//       },
//       order: [['created_at', 'DESC']]
//     });
//     console.log(`[DEBUG] Found ${charts.length} charts containing entity ${id}`);

//     // Fetch the entity that was updated
//     const currentEntity = await fetchEntityById(id, type);
//     console.log(`[DEBUG] Current entity data:`, JSON.stringify(currentEntity, null, 2));

//     if (!currentEntity) {
//       console.log(`[DEBUG] No entity found for id: ${id}, type: ${type}`);
//       return;
//     }

//     const personA = formatEntity(currentEntity);
//     console.log(`[DEBUG] Formatted personA data:`, JSON.stringify(personA, null, 2));

//     // Iterate through all charts and check for combinations
//     for (const chart of charts) {
//       console.log(`[DEBUG] Processing chart:`, JSON.stringify(chart.relationship_chart_id, null, 2));
//       const  relationship_chart_id=chart.relationship_chart_id;
//       const [id1, id2] = chart.entity_ids;
//       const otherId = id1 === id ? id2 : id1;
//       console.log(`[DEBUG] Other entity ID: ${otherId}`);

//       let otherEntity;

//       // Determine the entity type of the other side
//       if (type === 'user') {
//         console.log(`[DEBUG] Current entity is user, searching for partner or user with id: ${otherId}`);
//         otherEntity = await BusinessPartner.findOne({ where: { partner_id: otherId } }) ||
//                       await User.findOne({ where: { user_id: otherId } });
//       } else if (type === 'partner') {
//         console.log(`[DEBUG] Current entity is partner, searching for user or business with id: ${otherId}`);
//         otherEntity = await User.findOne({ where: { user_id: otherId } }) ||
//                       await BusinessPartner.findOne({ where: { partner_id: otherId } });
//       } else if (type === 'business') {
//         console.log(`[DEBUG] Current entity is business, searching for user or partner with id: ${otherId}`);
//         otherEntity = await User.findOne({ where: { user_id: otherId } }) ||
//                       await BusinessPartner.findOne({ where: { partner_id: otherId } });
//       }

//       console.log(`[DEBUG] Found other entity:`, JSON.stringify(otherEntity, null, 2));

//       if (!otherEntity) {
//         console.log(`[DEBUG] No other entity found for id: ${otherId}`);
//         continue;
//       }

//       const personB = formatEntity(otherEntity);
//       console.log(`[DEBUG] Formatted personB data:`, JSON.stringify(personB, null, 2));

//       // Re-generate chart from external engine
//       let chartData;
//       try {
//         console.log(`[DEBUG] Sending request to astro engine with:`, {
//           person_a: personA,
//           person_b: personB
//         });

//         const response = await axios.post(`${ASTRO_ENGINE_URL}/synastry`, {
//           person_a: personA,
//           person_b: personB,
//         });

//         chartData = response.data;

//         console.log(`[DEBUG] Received chart data from astro engine:`, JSON.stringify(chartData, null, 2));
//       } catch (apiError: any) {
//         console.error(`[ERROR] Failed to regenerate chart for ${id} with ${otherId}:`, apiError.message);
//         console.error(`[ERROR] API Error details:`, apiError.response?.data || 'No additional error details');
//         continue;
//       }

//       // Update chart in DB
//       console.log(`[DEBUG] Updating chart in database with new data`);
//       await RelationshipChart.update({
//         chart_data: chartData,
//         updated_at: new Date(),
//       },{
//         where: {
//           relationship_chart_id: relationship_chart_id
//         }
//       });
//       console.log(`[DEBUG] Chart updated successfully`);
//     }
//   } catch (error: any) {
//     console.error(`[ERROR] Error in updateRelationalChart:`, error);
//     console.error(`[ERROR] Stack trace:`, error.stack);
//     throw new Error(error.message || 'Internal server error');
//   }
// };

const fetchEntityById = async (id: string, type: string): Promise<any> => {
  if (type === "user") {
    return await User.findOne({ where: { user_id: id } });
  } else if (type === "partner") {
    return await BusinessPartner.findOne({ where: { partner_id: id } });
  } else if (type === "business") {
    return await BusinessProfile.findOne({ where: { business_id: id } });
  }
  return null;
};
const formatEntity = (entity: any) => {
  return {
    name:
      entity.full_name ||
      entity.partner_name ||
      entity.business_name ||
      "Unknown",
    date:
      entity.date_of_birth ||
      entity.birth_date ||
      entity.incorporation_date ||
      null,
    time:
      entity.time_of_birth ||
      entity.birth_time ||
      entity.corporate_time ||
      null,
    lat: entity.latitude ? Number(entity.latitude) : 0,
    lon: entity.longitude ? Number(entity.longitude) : 0,
    tz_offset: entity.timezone_offset ? Number(entity.timezone_offset) : 0,
  };
};

const findOtherEntity = async (otherId: string) => {
  const partner = await BusinessPartner.findOne({
    where: { partner_id: otherId },
  });
  if (partner) return partner;

  const user = await User.findOne({ where: { user_id: otherId } });
  if (user) return user;

  const business = await BusinessProfile.findOne({
    where: { business_id: otherId },
  });
  if (business) return business;

  console.warn(`[WARN] No entity found for ID: ${otherId}`);
  return null;
};

export const updateRelationalChart = async (id: string, type: string) => {
  try {
    //check in redis if alredy exist
    const charts = await RelationshipChart.findAll({
      where: {
        entity_ids: { [Op.contains]: [id] },
      },
    });

    console.info(
      `[INFO] Found ${charts.length} relational charts for entity ID: ${id}`
    );

    if (!charts.length) return;

    const currentEntity = await fetchEntityById(id, type);
    if (!currentEntity) {
      console.warn(`[WARN] Current entity (${id}) not found`);
      return;
    }

    const personA = formatEntity(currentEntity);
    console.log("[DEBUG] person_a:", JSON.stringify(personA, null, 2));

    for (const chart of charts) {
      const { relationship_chart_id, chart_type_id, entity_ids } = chart;

      console.log(
        `[DEBUG] Processing Chart ID: ${relationship_chart_id}, Entity IDs: ${entity_ids}`
      );

      const uniqueIds = Array.from(new Set(entity_ids));
      if (uniqueIds.length !== 2) {
        console.warn(
          `[WARN] Chart ${relationship_chart_id} has invalid entity IDs: ${entity_ids}`
        );
        continue;
      }

      const otherId = uniqueIds.find((eid) => eid !== id);
      if (!otherId) {
        console.warn(
          `[WARN] Could not determine other entity for chart ${relationship_chart_id}`
        );
        continue;
      }

      const otherEntity = await findOtherEntity(otherId);
      if (!otherEntity) {
        console.warn(
          `[WARN] Skipping chart ${relationship_chart_id} because other entity (${otherId}) was not found.`
        );
        continue;
      }

      console.log(
        "[DEBUG] otherEntity:",
        JSON.stringify(otherEntity.toJSON(), null, 2)
      );
      const personB = formatEntity(otherEntity);
      console.log("[DEBUG] person_b:", JSON.stringify(personB, null, 2));
      //we have check the chat typeid and we have to check the charttypeid is synastry or composite
      if (chart_type_id === 25) {
        try {
          const { data: chartData } = await axios.post(
            `${ASTRO_ENGINE_URL}/synastry`,
            {
              person_a: personA,
              person_b: personB,
            }
          );
          await RelationshipChart.update(
            {
              chart_data: chartData,
              updated_at: new Date(),
            },
            {
              where: { relationship_chart_id },
            }
          );
          //redis key is same as insertSynastryChart
          const redisKey = `synastry_chart_${entity_ids.join(
            "_"
          )}_${chart_type_id}`;
          await redisClient.set(redisKey, JSON.stringify(chartData));

          console.info(`[UPDATED] Chart ID ${relationship_chart_id} updated`);
        } catch (apiError: any) {
          const msg =
            apiError.response?.data || apiError.message || "Unknown API error";
          console.error(
            `Failed to update chart ID ${relationship_chart_id}:`,
            msg
          );
          console.error(
            "API Error Details:",
            JSON.stringify(apiError.response?.data, null, 2)
          );
        }
      } else if (chart_type_id === 26) {
        try {
          const { data: chartData } = await axios.post(
            `${ASTRO_ENGINE_URL}/composite`,
            {
              person_a: personA,
              person_b: personB,
            }
          );
          await RelationshipChart.update(
            {
              chart_data: chartData,
              updated_at: new Date(),
            },
            {
              where: { relationship_chart_id },
            }
          );
          //redis key is same as insertCompositeChart
          const redisKey = `composite_chart_${entity_ids.join(
            "_"
          )}_${chart_type_id}`;
          await redisClient.set(redisKey, JSON.stringify(chartData));

          console.info(`[UPDATED] Chart ID ${relationship_chart_id} updated`);
        } catch (apiError: any) {
          const msg =
            apiError.response?.data || apiError.message || "Unknown API error";
          console.error(
            `Failed to update chart ID ${relationship_chart_id}:`,
            msg
          );
          console.error(
            "API Error Details:",
            JSON.stringify(apiError.response?.data, null, 2)
          );
        }
      }
    }
  } catch (err: any) {
    console.error(
      `[FATAL] updateRelationalChart failed: ${err.message}`,
      err.stack
    );
    throw new Error("Internal Server Error");
  }
};
