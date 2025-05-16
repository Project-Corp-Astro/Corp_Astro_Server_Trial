import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum Role {
  User = 'user',
  Admin = 'admin'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

export interface UserAttributes {
  user_id: string;
  phone_number: string;
  email?: string;
  full_name: string;
  gender?: Gender;
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
  birth_timezone: string;
  latitude?: number;
  longitude?: number;
  timezone_offset: number;
  profile_picture_url?: string;
  preferred_language: string;
  created_at?: Date;
  updated_at?: Date;
  last_login?: Date;
  account_status: AccountStatus;
  notification_preferences: object;
  user_role: Role;
  subscriptionType: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public user_id!: string;
  public phone_number!: string;
  public email?: string;
  public full_name!: string;
  public gender?: Gender;
  public date_of_birth!: string;
  public time_of_birth!: string;
  public place_of_birth!: string;
  public latitude?: number;
  public longitude?: number;
  public birth_timezone!: string;
  public timezone_offset!: number;
  public profile_picture_url?: string;
  public preferred_language!: string;
  public created_at?: Date;
  public updated_at?: Date;
  public last_login?: Date;
  public account_status!: AccountStatus;
  public notification_preferences!: object;
  public user_role!: Role;
  public subscriptionType!: string;
}

User.init(
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.fn('uuid_generate_v4')
    },
    phone_number: {
      type: DataTypes.STRING(15),
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time_of_birth: {
      type: DataTypes.TIME,
      allowNull: false
    },
    place_of_birth: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: true
    },
    birth_timezone: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    timezone_offset: {
      type: DataTypes.FLOAT, // Same here, ensure this is a number type
      allowNull: false,
    },
    profile_picture_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    preferred_language: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: 'en'
    },
    user_role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    account_status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED'),
      defaultValue: 'ACTIVE',
      allowNull: false
    },
    notification_preferences: {
      type: DataTypes.JSONB,
      defaultValue: { push: true, email: true, sms: true }
    },
    subscriptionType: {
      type: DataTypes.STRING,
      defaultValue: 'free',
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    //indexing user_id
    indexes: [
      {
        unique: true,
        fields: ['user_id','phone_number']
      }
    ] 
  }
);

export default User;
