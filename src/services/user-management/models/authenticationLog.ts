// src/models/core/authentication_log.model.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface AuthenticationLogAttributes {
  log_id?: number;
  user_id?: string;
  authentication_type: string;
  ip_address: string;
  device_identifier?: string;
  success: boolean;
  failure_reason?: string;
  created_at?: Date;
}

class AuthenticationLog extends Model<AuthenticationLogAttributes> implements AuthenticationLogAttributes {
  public log_id!: number;
  public user_id?: string;
  public authentication_type!: string;
  public ip_address!: string;
  public device_identifier?: string;
  public success!: boolean;
  public failure_reason?: string;
  public created_at?: Date;
}

AuthenticationLog.init(
  {
    log_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
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
    authentication_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'otp',
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device_identifier: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    failure_reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    sequelize,
    tableName: 'authentication_logs',
    timestamps: true,
  }
);

export default AuthenticationLog;
