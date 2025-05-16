import { Request, Response } from 'express';
import User from '../models/user';
import { sendOtp, verifyOtp } from '../services/otp.service';
import { JwtPayload } from '../../../config/jwt.config';
import { generateToken } from '../../../config/jwt.config';
import AuthenticationLog from '../models/authenticationLog';

export const loginOrSignupController = async (req: Request, res: Response) => {
  const { mobileNumber, otp, action, orderId } = req.body;  // action can be 'sendOtp', 'verifyOtp'

  if (action === 'sendOtp') {
    // Step 1: Send OTP to the mobile number
    try {
        //mobileOTPRouter use this for send otp
        const { success, orderId: newOrderId } = await sendOtp(mobileNumber);
      if (success) {
        return res.status(200).json({ message: 'OTP sent successfully!', orderId: newOrderId });
      } else {
        return res.status(500).json({ error: 'Failed to send OTP' });
      }
    } catch (error: any) {
      return res.status(500).json({ error: 'Error sending OTP', details: error.message });
    }
  }

  if (action === 'verifyOtp') {
    // Step 2: Verify OTP and handle login or signup
    try {
      if (!orderId) {
        return res.status(400).json({ error: 'Order ID is required for verification' });
      }
    //mobileOTPRouter use this for verify otp   
    const { success } = await verifyOtp(mobileNumber, otp, orderId);

      if (!success) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }

      // Step 3: Check if the user already exists
      let user = await User.findOne({ where: { phone_number: mobileNumber } });

      if (user) {
        // If the user exists, return login success 
        //generate token
        const tokenPayload: JwtPayload = {
            userId: user.user_id,
            role: user.user_role,
            subscriptionType: user.subscriptionType
          };
          const token = generateToken(tokenPayload);
          // user.last_login = new Date(); // Sets current time
          // await user.save(); // Saves it to DB
            await User.update(
              { last_login: new Date() },
              { where: { user_id: user.user_id } }
            );
          
        return res.status(200).json({ message: 'Login successful!', user, token });
      } else {
        // If the user does not exist, return a response to prompt the user to fill in their details
        return res.status(200).json({ message: 'OTP verified. Please fill in your details to sign up.', needSignup: true });
      }
    } catch (error: any) {
      return res.status(500).json({ error: 'Error verifying OTP', details: error.message });
    }
  }

  return res.status(400).json({ error: 'Invalid action. Use "sendOtp" or "verifyOtp".' });
};




export const createAuthenticationLog = async (req: Request, res: Response) => {
  try {
    const { user_id, success } = req.body;

    // Validate incoming data
    if (!user_id || typeof success !== 'boolean') {
      return res.status(400).json({ error: 'Missing or invalid parameters' });
    }

    // Detect IP address and device identifier
    const ip_address = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';
    const device_identifier = req.headers['user-agent'] || 'unknown';
    const authentication_type = 'otp';
    const failure_reason = success ? null : 'OTP verification failed';

    // Create the authentication log
    const log = await AuthenticationLog.create({
      user_id,
      authentication_type,
      ip_address,
      device_identifier,
      success,
      failure_reason: failure_reason || undefined, // If failure_reason is null, do not store it
    });

    // Return a more concise response
    res.status(201).json({
      message: 'Authentication log created successfully',
      logId: log.log_id, // Send only necessary info (e.g., logId, status)
      user_id: log.user_id,
      success: log.success,
    });
  } catch (error:any) {
    // Log error for debugging purposes (could be improved with a logger)
    console.error('Error creating authentication log:', error);

    res.status(500).json({ error: 'Failed to create authentication log', detail: error.message });
  }
};
// Get all logs


export const getAllAuthenticationLogs = async (_req: Request, res: Response) => {
  try {
    const logs = await AuthenticationLog.findAll();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};



// Get log by ID
export const getAuthenticationLogById = async (req: Request, res: Response) => {
  try {
    const log = await AuthenticationLog.findByPk(req.params.id);
    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving log' });
  }
};

// Delete log by ID
export const deleteAuthenticationLog = async (req: Request, res: Response) => {
  try {
    const deleted = await AuthenticationLog.destroy({ where: { log_id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Log not found' });
    res.status(200).json({ message: 'Log deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting log' });
  }
};
