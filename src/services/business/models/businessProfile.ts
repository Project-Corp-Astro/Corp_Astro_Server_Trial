// src/services/business/models/businessProfile.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface BusinessProfileAttributes {
  business_id?: string;
  business_name: string;
  business_sector?: string;
  foundation_date?: string;
  foundation_time?: string;
  foundation_place?: string;
  latitude?: number;
  longitude?: number;
  user_id: string;
  timezone_offset?: number;
  created_at?: Date;
  updated_at?: Date;
}

class BusinessProfile extends Model<BusinessProfileAttributes> implements BusinessProfileAttributes {
  public business_id!: string;
  public business_name!: string;
  public business_sector?: string;
  public foundation_date?: string;
  public foundation_time?: string;
  public foundation_place?: string;
  public latitude?: number;
  public longitude?: number;
  public user_id!: string;
  public timezone_offset?: number;
  public created_at!: Date;
  public updated_at!: Date;
}

BusinessProfile.init(
  {
    business_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    business_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    business_sector: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    foundation_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    foundation_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    foundation_place: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    timezone_offset: {
      type: DataTypes.FLOAT,
      allowNull: true,
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
        fields: ['business_id'],
      },
      {
        fields: ['user_id'],
      },
      {
        fields: ['business_sector'],
      },
    ],
  }
);

export { BusinessProfile };
export default BusinessProfile;
