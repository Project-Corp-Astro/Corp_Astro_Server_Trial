import { Request, Response } from 'express';
import BusinessProfile from '../models/businessProfile';
import BusinessPartner from '../models/business_partners';
import { setCache, getCache, deleteCache } from '../../../services/caching/cache.controller';
import { updateRelationalChart } from './relationalcontroler';
export const createPartner = async (req: Request, res: Response) => {
  try {
    const {
      partner_name,
      role,
      business_id,
      date_of_birth,
      birth_time,
      location,
      latitude,
      longitude,
      timezone_offset,
      user_id,
    } = req.body;

    if (!partner_name || !user_id || timezone_offset === undefined) {
      return res.status(400).json({ error: 'Missing required fields: partner_name, user_id, timezone_offset' });
    }

    // If business_id is provided, validate it
    if (business_id) {
      const business = await BusinessProfile.findOne({
        where: {
          business_id,
          user_id,
        },
      });

      if (!business) {
        return res.status(400).json({ error: 'Business not found for this user.' });
      }
    }

    const partner = await BusinessPartner.create({
      partner_name,
      role,
      user_id,
      date_of_birth,
      birth_time,
      location,
      latitude,
      longitude,
      timezone_offset,
      ...(business_id && { business_id }) // ✅ include only if present
    });
    //inser into redis cache
    await setCache(`business_partners_${partner.user_id}_${partner.business_id}`, partner);
    //inert into redis using partner id
    await setCache(`business_partners_${partner.partner_id}`, partner);
    //inert into redis using user id
    await setCache(`business_partners_${partner.user_id}`, partner);
    //inert into redis using business id
    await setCache(`business_partners_${partner.business_id}`, partner);
    //inser in redis userid and partner id
    await setCache(`business_partners_${partner.user_id}_${partner.partner_id}`, partner);

    return res.status(201).json(partner);
  } catch (error) {
    console.error('Create Partner Error:', error);
    return res.status(500).json({
      error: 'Failed to create partner',
      details: (error as Error).message,
    });
  }
};

// 2. Get All Partners
export const getAllPartners = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Try to get from Redis cache
    const cachedPartners = await getCache(`business_partners_${user_id}`);

    if (cachedPartners) {
      return res.status(200).json(cachedPartners);
    }

    // Fallback to DB if not in cache
    const partnersFromDB = await BusinessPartner.findAll({ where: { user_id } });

    if (partnersFromDB.length === 0) {
      return res.status(404).json({ error: 'No partners found' });
    }

    // Save to Redis cache
    await setCache(`business_partners_${user_id}`, partnersFromDB);

    return res.status(200).json(partnersFromDB);
  } catch (error) {
    console.error('Get All Partners Error:', error);
    return res.status(500).json({ error: 'Failed to fetch partners' });
  }
};

// 3. Get Single Partner
export const getPartner = async (req: Request, res: Response) => {

    const { partner_id, user_id } = req.params;
    try {
    if (!partner_id) {
      return res.status(400).json({ error: 'Partner ID is required' });
    }
        //check user id 
        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        //get from redis cache by user id and partner id
        const partnerfromcache = await getCache(`business_partners_${user_id}_${partner_id}`);
        if (partnerfromcache) {
            return res.status(200).json(partnerfromcache);
        }
    const partner = await BusinessPartner.findOne({ 
        where: { 
            partner_id, 
            user_id 
        } 
    });

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }
    //save to redis cache
    await setCache(`business_partners_${user_id}_${partner_id}`, partner);
    return res.status(200).json(partner);

  } catch (error) {
    console.error('Get Partner Error:', error);
    return res.status(500).json({ error: 'Failed to fetch partner' });
  }
};


export const getAllPartnersByBusinessId = async (req: Request, res: Response) => {
  try {
    const { business_id, user_id } = req.params;
    
    if (business_id) {
      //check businessid and user id
      if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
      } 
      //get from redis cache
      const partnerfromcache = await getCache(`business_partners_${user_id}_${business_id}`);
      if (partnerfromcache) {
        return res.status(200).json(partnerfromcache);
      }
      const partner = await BusinessPartner.findOne({
        where: {
          business_id,
          user_id
        }
      });
      if (!partner) {
        return res.status(404).json({ error: 'Partner not found' });
      }
      //save to redis cache by user id and business id  
      await setCache(`business_partners_${user_id}_${business_id}`, partner);
      return res.status(200).json(partner);
    } 
  
    //user_id is required
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    //get from redis cache
    const partnersfromcache = await getCache(`business_partners_${user_id}_${business_id}`);
    if (partnersfromcache) {
      return res.status(200).json(partnersfromcache);
    }
    const partners = await BusinessPartner.findAll({ where: { user_id, business_id } });
    if (!partners) {
      return res.status(404).json({ error: 'No partners found' });
    }
    //save to redis cache by user id and business id
    await setCache(`business_partners_${user_id}_${business_id}`, partners);
    return res.status(200).json({partners, business_id} );
  } catch (error) {
    console.error('Get All Partners Error:', error);
    return res.status(500).json({ error: 'Failed to fetch partners' });
  }
};


// 4. Update Business Partner
export const updatePartner = async (req: Request, res: Response) => {

  const { partner_id, user_id } = req.params;

    const { partner_name, role, business_id, date_of_birth, birth_time, location, latitude, longitude } = req.body;

  try {
    if (!partner_id) {
      return res.status(400).json({ error: 'Partner ID is required' });
    }

    const partner = await BusinessPartner.findOne({ 
        where: { 
            partner_id, 
            user_id 
        } 
    });
    
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    partner.partner_name = partner_name || partner.partner_name;
    partner.role = role || partner.role;
    partner.business_id = business_id || partner.business_id;
    partner.date_of_birth = date_of_birth || partner.date_of_birth;
    partner.birth_time = birth_time || partner.birth_time;
    partner.location = location || partner.location;
    partner.latitude = latitude || partner.latitude;
    partner.longitude = longitude || partner.longitude;

    await partner.save();
    //update relational chart for a partner
    await updateRelationalChart(partner_id, 'partner');
    //save to redis cache by user id and partner id
    await setCache(`business_partners_${user_id}_${partner_id}`, partner);
    return res.status(200).json(partner);
  } catch (error) {
    console.error('Update Partner Error:', error);
    return res.status(500).json({ error: 'Failed to update partner' });
  }
};

// 5. Delete Business Partner
export const deletePartner = async (req: Request, res: Response) => {
    const { partner_id, user_id  } = req.params;
  
  try {
    const partner = await BusinessPartner.findOne({ 
        where: { 
            partner_id, 
            user_id 
        } 
    });
    
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    await partner.destroy();
    //delete from redis cache by user id and partner id
    await deleteCache(`business_partners_${user_id}_${partner_id}`);
    
    return res.status(200).json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Delete Partner Error:', error);
    return res.status(500).json({ error: 'Failed to delete partner' });
  }
};
