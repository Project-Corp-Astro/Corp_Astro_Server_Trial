import { JwtPayload } from "../../../config/jwt.config";
import User, { AccountStatus, UserAttributes } from "../models/user";
import { Request, Response, RequestHandler } from 'express';
import { generateToken } from '../../../config/jwt.config';
import { AuthRequest } from "../../../middleware/auth.middleware";
import * as fs from 'fs';
import * as path from 'path';
import { createClient as supabaseClient } from '@supabase/supabase-js';
import { redisClient } from '../../../config/redis.config';
import { updateRelationalChart } from "../../business/controllers/relationalcontroler";
import { updateDashaChart } from "../../astrology/controllers/dashacontroler";
import { updateProgressedChartByUserId } from "../../business/controllers/userProgressedChart.controler";
import { updateAllCharts } from "../../../utils/userchartsUpdate";
import logger from "../../../utils/logger";
const supabase = supabaseClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}




export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      phone_number,
      email,
      full_name,
      gender,
      date_of_birth,
      time_of_birth,
      place_of_birth,
      birth_timezone,
      latitude,
      longitude,
      timezone_offset,
      subscriptionType
    } = req.body;

    const phoneRegex = /^\+\d{1,4}\d{7,12}$/;
    if (!phoneRegex.test(phone_number)) {
      logger.warn(`[UserController] Invalid phone format: ${phone_number}`);
      return res.status(400).json({ message: 'Invalid phone number format. Include country code like +91.' });
    }

    const phoneNumberExists = await User.findOne({ where: { phone_number } });
    if (phoneNumberExists) {
      logger.warn(`[UserController] Phone number already exists: ${phone_number}`);
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      logger.warn(`[UserController] Email already exists: ${email}`);
      return res.status(400).json({ message: 'Email already exists' });
    }

    const last_login = new Date();
    const user_role = 'user';

    const userData = {
      phone_number,
      email,
      full_name,
      gender,
      date_of_birth,
      time_of_birth,
      place_of_birth,
      birth_timezone,
      timezone_offset,
      last_login,
      preferred_language: 'en',
      account_status: AccountStatus.ACTIVE,
      subscriptionType,
      user_role,
      notification_preferences: {
        push: true,
        email: true,
        sms: true
      },
      latitude,
      longitude,
      location: latitude && longitude ? {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      } : null
    };

    const user = await User.create(userData as unknown as UserAttributes);
    logger.info(`[UserController] User created with ID: ${user.user_id}`);

    const tokenPayload = {
      userId: user.user_id,
      role: user.user_role,
      subscriptionType: user.subscriptionType
    };

    const token = generateToken(tokenPayload);

    await redisClient.set(`auth_token:${user.user_id}`, token);
    await redisClient.set(`user_data:${user.user_id}`, JSON.stringify(user));

    logger.info(`[UserController] User data stored in Redis for ID: ${user.user_id}`);

    const userDataFromRedis = await redisClient.get(`user_data:${user.user_id}`);
    logger.debug(`[UserController] Fetched from Redis: ${userDataFromRedis}`);

    return res.status(201).json({ user, token });
  } catch (error: any) {
    logger.error(`[UserController] Error creating user: ${error.message}`, { stack: error.stack });
    return res.status(500).json({ error: error.message });
  }
};  

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let userData: any;
//check user data from redis
    userData= await redisClient.get(`user_data:${id}`);
    if (userData) {
      return res.status(200).json({ user: JSON.parse(userData) });
    }
     userData = await User.findByPk(id); // Assuming Sequelize + user_id as PK
   
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }
    //store user data in redis
    await redisClient.set(`user_data:${userData.user_id}`, JSON.stringify(userData));
    //get user data from redis

    return res.status(200).json({ user: userData });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};


export const getUserByPhoneNumber = async (req: Request, res: Response) => {
    try {
      const { phone_number } = req.params; // Get phone number from URL params
      let userData: any;  
      //check user data from redis
      userData= await redisClient.get(`user_data:${phone_number}`);
      if (userData) {
        return res.status(200).json({ user: JSON.parse(userData) });
      }
      // Fetch user by phone number from the database
       userData = await User.findOne({ where: { phone_number } });
  
      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }
      //store user data in redis
      await redisClient.set(`user_data:${userData.user_id}`, JSON.stringify(userData));
      //get user data from redis
      const userDatafromredis= await redisClient.get(`user_data:${userData.user_id}`);
      console.log(`[UserController] User data: ${userDatafromredis}`);
        return res.status(200).json({user:userData});
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };




  
// export const updateUserByUserId = async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params; // Get user_id from URL params
//       const {
//         phone_number,
//         email,
//         full_name,
//         gender,
//         date_of_birth,
//         time_of_birth,
//         place_of_birth,
//         birth_timezone,
//         latitude, //latitude
//         longitude,
//         timezone_offset,
//         subscriptionType,
//         preferred_language,
//         notification_preferences
//       } = req.body; // Get update data from request body
  
//       // Find the user by user_id
//       const user = await User.findOne({ where: { user_id :id} });
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//     //check phoenumber changing or not if phone number chnage show  user friendly msg yu don't change phone number
//     if (phone_number && phone_number !== user.phone_number) {
//       return res.status(400).json({ message: 'You don\'t have permission to change phone number' });
//     }
  
//     const chartUpdateNeeded =
//       full_name !== user.full_name ||
//       date_of_birth !== user.date_of_birth ||
//       time_of_birth !== user.time_of_birth ||
//       place_of_birth !== user.place_of_birth ||
//       birth_timezone !== user.birth_timezone ||
//       latitude !== user.latitude ||
//       longitude !== user.longitude;

//       // Update user data with provided fields
//       user.phone_number = phone_number || user.phone_number;
//       user.email = email || user.email;
//       user.full_name = full_name || user.full_name;
//       user.gender = gender || user.gender;
//       user.date_of_birth = date_of_birth || user.date_of_birth;
//       user.time_of_birth = time_of_birth || user.time_of_birth;
//       user.place_of_birth = place_of_birth || user.place_of_birth;
//       user.birth_timezone = birth_timezone || user.birth_timezone;
//       user.latitude = latitude || user.latitude;
//       user.longitude = longitude || user.longitude;
//       user.timezone_offset = timezone_offset || user.timezone_offset;
//       user.subscriptionType = subscriptionType || user.subscriptionType;
//       user.preferred_language = preferred_language || user.preferred_language;
//       user.notification_preferences = notification_preferences || user.notification_preferences;
//       // Save the updated user
//       await user.save();
  
//       await redisClient.set(`user_data:${user.user_id }`, JSON.stringify(user));
//       //update synastry chart for a user
//       // await updateRelationalChart(user.user_id, 'user');
//       // //update dasha chart for a user
//       // await updateDashaChart(
//       //   { params: { userId: user.user_id } } as any,
//       //   { status: () => ({ json: () => {} }) } as any
//       // );
//       // //update progressed chart for a user
//       // await updateProgressedChartByUserId(user.user_id);
//       // Return the updated user data
//       if (chartUpdateNeeded) {
//         await updateAllCharts(user.user_id);
//       }
//       return res.status(200).json({ message: 'User updated successfully', user });
//     } catch (error: any) {
//       return res.status(500).json({ error: error.message });
//     }
//   };



export const updateUserByUserId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    logger.info(`[updateUserByUserId] Request received for user_id: ${id}`, { updateData });

    // Find the user by user_id
    const user = await User.findOne({ where: { user_id: id } });

    if (!user) {
      logger.warn(`[updateUserByUserId] User not found: ${id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    if (updateData.phone_number && updateData.phone_number !== user.phone_number) {
      logger.warn(`[updateUserByUserId] Attempt to change phone number for user_id: ${id}`);
      return res.status(400).json({ message: 'You don\'t have permission to change phone number' });
    }

    const chartUpdateNeeded =
      updateData.full_name !== user.full_name ||
      updateData.date_of_birth !== user.date_of_birth ||
      updateData.time_of_birth !== user.time_of_birth ||
      updateData.place_of_birth !== user.place_of_birth ||
      updateData.birth_timezone !== user.birth_timezone ||
      updateData.latitude !== user.latitude ||
      updateData.longitude !== user.longitude;

    // Update user fields (fallback to existing if not provided)
    user.phone_number = user.phone_number; // no change allowed
    user.email = updateData.email || user.email;
    user.full_name = updateData.full_name || user.full_name;
    user.gender = updateData.gender || user.gender;
    user.date_of_birth = updateData.date_of_birth || user.date_of_birth;
    user.time_of_birth = updateData.time_of_birth || user.time_of_birth;
    user.place_of_birth = updateData.place_of_birth || user.place_of_birth;
    user.birth_timezone = updateData.birth_timezone || user.birth_timezone;
    user.latitude = updateData.latitude || user.latitude;
    user.longitude = updateData.longitude || user.longitude;
    user.timezone_offset = updateData.timezone_offset || user.timezone_offset;
    user.subscriptionType = updateData.subscriptionType || user.subscriptionType;
    user.preferred_language = updateData.preferred_language || user.preferred_language;
    user.notification_preferences = updateData.notification_preferences || user.notification_preferences;

    await user.save();

    // Update user data cache in Redis
    await redisClient.set(`user_data:${user.user_id}`, JSON.stringify(user));
    logger.info(`[updateUserByUserId] User data cached in Redis for user_id: ${user.user_id}`);

    if (chartUpdateNeeded) {
      logger.info(`[updateUserByUserId] Chart update triggered for user_id: ${user.user_id}`);
      await updateAllCharts(user.user_id);
    }

    logger.info(`[updateUserByUserId] User updated successfully: ${user.user_id}`);

    return res.status(200).json({ message: 'User updated successfully', user });

  } catch (error: any) {
    logger.error(`[updateUserByUserId] Error updating user: ${error.message}`, { stack: error.stack });
    return res.status(500).json({ error: error.message });
  }
};



  // export const deleteUserByUserId = async (req: Request, res: Response) => {
  //   try {
  //     const { id } = req.params; // Get user_id from URL params
  
  //     // Find the user by user_id
  //     const user = await User.findOne({ where: { user_id :id} });
  
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  //     //delete user data from redis
  //     await redisClient.del(`user_data:${user.user_id}`); 

  //     await redisClient.del(`auth_token:${user.user_id}`);

  //     // Delete the user from the database
  //     await user.destroy(); // Destroy method for Sequelize models (if using Sequelize ORM)
  
  //     return res.status(200).json({ message: 'User deleted successfully' });
  //       } catch (error: any) {
  //         return res.status(500).json({ error: error.message });
  //   }
  // };

  export const deleteUserByUserId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      logger.info(`[deleteUserByUserId] Deletion request received for user_id: ${id}`);
  
      const user = await User.findOne({ where: { user_id: id } });
  
      if (!user) {
        logger.warn(`[deleteUserByUserId] User not found for user_id: ${id}`);
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Delete from Redis
      await redisClient.del(`user_data:${user.user_id}`);
      logger.info(`[deleteUserByUserId] Deleted user_data from Redis for user_id: ${user.user_id}`);
  
      await redisClient.del(`auth_token:${user.user_id}`);
      logger.info(`[deleteUserByUserId] Deleted auth_token from Redis for user_id: ${user.user_id}`);
  
      // Delete from DB
      await user.destroy();
      logger.info(`[deleteUserByUserId] Deleted user from DB for user_id: ${user.user_id}`);
  
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
      logger.error(`[deleteUserByUserId] Error deleting user_id: ${req.params.id} - ${error.message}`, {
        stack: error.stack,
      });
      return res.status(500).json({ error: error.message });
    }
  }; 

  
export const logoutUserById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }
    // Delete the token stored in Redis
    await redisClient.del(`auth_token:${userId}`);
    
    return res.status(200).json({ message: 'Logout successful. Token removed from Redis.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error during logout', error });
  }
};




export const updateProfileImageHandler: RequestHandler = async (req: MulterRequest, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      res.status(400).json({ error: 'Id is required' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'No image file uploaded' });
      return;
    }

    const user = await User.findOne({ where: { user_id: id } });

    if (!user) {
      // Clean up the temporary file if it exists
      if (req.file?.path) {
        await fs.promises.unlink(req.file.path);
      }
      res.status(404).json({ error: 'User not found' });
      return;
    }

    try {
      // Read file from disk
      const filePath = req.file.path;
      const fileBuffer = await fs.promises.readFile(filePath);
      const fileExt = path.extname(req.file.originalname);
      const fileName = `profile-${Date.now()}${fileExt}`;

      // Upload to Supabase bucket
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from(process.env.SUPABASE_BUCKET_NAME!)
        .upload(`users/${fileName}`, fileBuffer, {
          contentType: req.file.mimetype,
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Upload error: ${uploadError.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase
        .storage
        .from(process.env.SUPABASE_BUCKET_NAME!)
        .getPublicUrl(`users/${fileName}`);

      const imageUrl = publicUrlData?.publicUrl;

      if (!imageUrl) {
        throw new Error('Failed to generate image URL');
      }

      // Delete old image if exists
      if (user.profile_picture_url) {
        try {
          const oldImagePath = new URL(user.profile_picture_url).pathname.split('/').pop();
          if (oldImagePath) {
            await supabase
              .storage
              .from(process.env.SUPABASE_BUCKET_NAME!)
              .remove([`users/${oldImagePath}`]);
          }
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      // Update user's image URL in database
      await user.update({ profile_picture_url: imageUrl });

      // Clean up temporary file
      if (req.file?.path) {
        await fs.promises.unlink(req.file.path);
      }

      res.status(200).json({
        message: 'Profile image updated successfully',
        imageUrl: imageUrl
      });

    } catch (error) {
      // Clean up the temporary file if it exists
      if (req.file?.path) {
        await fs.promises.unlink(req.file.path);
      }
      throw error;
    }

  } catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).json({ error: 'Server error' });
  }
};




