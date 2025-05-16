// src/services/user/models/types/UserProfile.d.ts

import { Model } from 'sequelize';

export interface UserProfileAttributes {
  id?: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  zodiac_sign?: string;
  subscription_tier?: string;
  preferences?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

declare class UserProfile extends Model<UserProfileAttributes> implements UserProfileAttributes {
  public id!: string;
  public user_id!: string;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public birth_date!: string;
  public birth_time!: string;
  public birth_place!: string;
  public zodiac_sign?: string;
  public subscription_tier?: string;
  public preferences?: Record<string, any>;
  public created_at!: Date;
  public updated_at!: Date;
}

export default UserProfile;
