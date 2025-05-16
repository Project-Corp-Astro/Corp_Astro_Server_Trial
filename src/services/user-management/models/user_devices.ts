// src/models/core/user_device.model.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';
import { sendPushNotification } from '../../../utils/pushNotification';
import { Request, Response } from 'express';



export interface UserDeviceAttributes {
  device_id?: string;
  user_id: string;
  device_token: string;
  device_type: string;
  device_model?: string;
  os_version?: string;
  app_version?: string;
  push_enabled: boolean;
  created_at?: Date;
  last_used_at?: Date;
}

class UserDevice extends Model<UserDeviceAttributes> implements UserDeviceAttributes {
  public device_id!: string;
  public user_id!: string;
  public device_token!: string;
  public device_type!: string;
  public device_model?: string;
  public os_version?: string;
  public app_version?: string;
  public push_enabled!: boolean;
  public created_at?: Date;
  public last_used_at?: Date;
}

UserDevice.init(
  {
    device_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      },
    device_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    device_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    device_model: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    os_version: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    app_version: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    push_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    last_used_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'user_devices',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'device_token'], // enforce uniqueness per device per user
      },
    ],
  }
);


export default UserDevice;

