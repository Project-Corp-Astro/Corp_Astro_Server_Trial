import { Request, Response } from 'express';
import BusinessProfile from '../models/businessProfile';
import BusinessPartner from '../models/business_partners';
import { Op } from 'sequelize';
import { redisClient } from '../../../config/redis.config'; 
import { updateRelationalChart } from './relationalcontroler';


export const createBusinessProfile = async (req: Request, res: Response) => {
  try {
    const {
      business_name,
      industry,
      corporate_time,
      incorporation_date,
      location,
      latitude,
      timezone_offset,
      longitude,
      user_id,
    } = req.body;

    if (!user_id || !business_name || !corporate_time || !incorporation_date || !location || !latitude || !timezone_offset || !longitude) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const business = await BusinessProfile.create({
      business_name,
      business_sector: industry,
      foundation_date: incorporation_date,
      foundation_time: corporate_time,
      foundation_place: location,
      latitude,
      timezone_offset,
      longitude,
      user_id,
    });

    //inser into redis cacheusing the business id and user id as key
    await redisClient.set(`business_profile_${business.business_id}_${business.user_id}`, JSON.stringify(business));
      await redisClient.set(`business_profile_${business.business_id}`,JSON.stringify(business));

    res.status(201).json(business);
  } catch (error) {
    console.error('Error creating business profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getBusinessProfileById = async (req: Request, res: Response) => {
  try {
    const { id, user_id  } = req.params;

    //check if the business profile is in redis cache
    const cachedBusiness = await redisClient.get(`business_profile_${id}_${user_id}`);
    if (cachedBusiness) {
      return res.status(200).json(JSON.parse(cachedBusiness));
    }
    const business = await BusinessProfile.findOne({ 
        where: { 
            business_id: id, 
            user_id 
        } 
    });
    if (!business) {
      return res.status(404).json({ message: 'Business profile not found.' });
    }
    //inser into redis cache
    await redisClient.set(`business_profile_${business.business_id}_${business.user_id}`, JSON.stringify(business));
    res.status(200).json(business); 
  } catch (error) {
    console.error('Error fetching business profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const updateBusinessProfile = async (req: Request, res: Response) => {
  try {
    const { business_id, user_id } = req.params;
    const updates = req.body;

    const business = await BusinessProfile.findOne({ 
        where: { 
            business_id: business_id, 
            user_id 
        } 
    });
    if (!business) {
      return res.status(404).json({ message: 'Business profile not found.' });
    }

    await business.update(updates);

    await updateRelationalChart(business_id, 'business');

    //inser into redis cache
    await redisClient.set(`business_profile_${business.business_id}_${business.user_id}`, JSON.stringify(business));

    res.status(200).json(business);
  } catch (error) {
    console.error('Error updating business profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const deleteBusinessProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, user_id } = req.params;
    console.log('Incoming params:', { id, user_id });

    const business = await BusinessProfile.findOne({ 
        where: { business_id: id, user_id }
    });

    if (!business) {
      console.log('No business profile found.');
      res.status(404).json({ message: 'Business profile not found.' });
      return;
    }

    console.log('Business found:', business);

    await business.destroy();
    console.log('Business profile deleted from DB.');

    // Delete from Redis
    const cacheKey = `business_profile_${business.business_id}_${business.user_id}`;
    try {
      const deleted = await redisClient.del(cacheKey);
      console.log(`Redis key deleted: ${cacheKey}, success: ${deleted}`);
    } catch (redisError) {
      console.error('Redis deletion error:', redisError);
    }

    res.status(204).send();
  } catch (error) {
    console.error('Unhandled error in deleteBusinessProfile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getAllBusinessProfilesAndPartnersByUser = async (req: Request, res: Response) => {
  try {
      const { user_id, business_id } = req.params;
      if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      if (!business_id) {
        return res.status(400).json({ error: 'Business ID is required' });
      } 
      //check if the business profile is in redis cache
      const cachedBusinessPartners = await redisClient.get(`business_partners_${user_id}_${business_id}`);
      if (cachedBusinessPartners) {
        return res.status(200).json(JSON.parse(cachedBusinessPartners));
      }
    const businessPartners = await BusinessPartner.findAll({ 
      where: { 
        user_id: user_id,
        business_id: business_id
      }
    });
    //inser into redis cache
    await redisClient.set(`business_partners_${user_id}_${business_id}`, JSON.stringify(businessPartners));

    res.status(200).json({ businessPartners });

  } catch (error) {
    console.error('Error fetching business profiles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const getAllBusinessProfiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const cacheKey = `business_profiles_${user_id}`;
    const cachedBusinesses = await redisClient.get(cacheKey);

    if (cachedBusinesses) {
      console.log(`Cache hit for ${cacheKey}`);
      res.status(200).json({ businesses: JSON.parse(cachedBusinesses) });
      return;
    }

    const businesses = await BusinessProfile.findAll({ where: { user_id } });

    if (businesses.length > 0) {
      await redisClient.set(cacheKey, JSON.stringify(businesses), { EX: 60 * 5 });
      res.status(200).json({ businesses });
      return;
    }

    const businessPartners = await BusinessPartner.findAll({ where: { user_id } });

    if (businessPartners.length > 0) {
      res.status(200).json({ businessPartners });
      return;
    }

    // If both are empty
    res.status(404).json({ message: 'No businesses or partners found for this user.' });
  } catch (error) {
    console.error('Error fetching business profiles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
