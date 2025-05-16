// src/services/content/models/BusinessProfile.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface BusinessProfileAttributes {
  id?: string;
  user_id: string;
  business_name: string;
  founding_date?: Date;
  founding_time?: string;
  founding_location?: string;
  industry: string;
  business_description?: string;
  logo_url?: string;
  business_size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  key_personnel?: Record<string, any>[];
  metadata: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

class BusinessProfile extends Model<BusinessProfileAttributes> implements BusinessProfileAttributes {
  public id!: string;
  public user_id!: string;
  public business_name!: string;
  public founding_date?: Date;
  public founding_time?: string;
  public founding_location?: string;
  public industry!: string;
  public business_description?: string;
  public logo_url?: string;
  public business_size!: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  public key_personnel?: Record<string, any>[];
  public metadata!: Record<string, any>;
  public created_at!: Date;
  public updated_at!: Date;
}

BusinessProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    business_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    founding_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    founding_time: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    founding_location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    industry: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    business_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logo_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    business_size: {
      type: DataTypes.ENUM('startup', 'small', 'medium', 'large', 'enterprise'),
      allowNull: false,
      defaultValue: 'small',
    },
    key_personnel: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    sequelize,
    tableName: 'business_profiles',
    timestamps: false,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['business_name'],
      },
      {
        fields: ['industry'],
      },
    ],
  }
);

export { BusinessProfile };
export default BusinessProfile;
