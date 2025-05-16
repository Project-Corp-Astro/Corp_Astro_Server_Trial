import { Request, Response } from 'express';
import UserDevice from '../models/user_devices';
import { sendPushNotification } from '../../../utils/pushNotification';
import User from '../models/user';
interface NotificationRequest extends Request {
  body: {
    user_id: string;
    title: string;
    body: string;
  }
}
export const registerDevice = async (req: Request, res: Response) => {
  try {
    const {
      user_id,
      device_token,
      device_type,
      device_model,
      os_version,
      app_version,
      push_enabled
    } = req.body;

    if (!user_id || !device_token || !device_type) {
      return res.status(400).json({ message: 'user_id, device_token, and device_type are required' });
    }

    // Check if device already exists for this user (same device_token)
    const existing = await UserDevice.findOne({ where: { user_id, device_token } });

    if (existing) {
      // Device already exists → update it
      await existing.update({
        device_type,
        device_model,
        os_version,
        app_version,
        push_enabled,
        last_used_at: new Date(),
      });

      return res.status(200).json({
        message: 'Device updated successfully',
        data: existing,
      });
    }

    // Create new device entry
    const newDevice = await UserDevice.create({
      user_id,
      device_token,
      device_type,
      device_model,
      os_version,
      app_version,
      push_enabled,
      last_used_at: new Date(),
    });

    return res.status(201).json({
      message: 'Device registered successfully',
      data: newDevice,
    });

  } catch (error) {
    console.error('Register device error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: (error as Error).message,
    });
  }
};



export const notifyUser = async (req: NotificationRequest, res: Response) => {
 
  try {
    const { user_id, title, body } = req.body;

    if (!user_id || !title || !body) {
      return res.status(400).json({ message: 'user_id, title, and body are required' });
    }
  //check user id from database
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const device = await UserDevice.findOne({
      where: { user_id },
      order: [['last_used_at', 'DESC']],
    });

    if (!device) {
      return res.status(404).json({ message: 'No device token found for this user' });
    }

    const result = await sendPushNotification(device.device_token, title, body);

    return res.status(200).json({
      message: 'Notification sent successfully',
      firebaseResponse: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to send notification', error });
  }
};
