// src/services/user/models/UserProfile.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface UserProfileAttributes {
  id?: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  zodiac_sign: string;
  subscription_tier: string;
  created_at?: Date;
  updated_at?: Date;
}

class UserProfile extends Model<UserProfileAttributes> implements UserProfileAttributes {
  public id!: string;
  public user_id!: string;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public birth_date!: string;
  public birth_time!: string;
  public birth_place!: string;
  public zodiac_sign!: string;
  public subscription_tier!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

UserProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    birth_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    birth_place: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zodiac_sign: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subscription_tier: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'free',
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
    tableName: 'user_profiles',
    timestamps: false,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['email'],
      },
      {
        fields: ['zodiac_sign'],
      },
      {
        fields: ['subscription_tier'],
      },
    ],
  }
);

export { UserProfile };
export default UserProfile;
