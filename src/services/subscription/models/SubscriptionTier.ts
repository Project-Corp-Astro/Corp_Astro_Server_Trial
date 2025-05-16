// src/services/subscription/models/SubscriptionTier.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface SubscriptionTierAttributes {
  id?: string;
  tier_name: string;
  tier_code: string;
  price: number;
  currency: string;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

class SubscriptionTier extends Model<SubscriptionTierAttributes> implements SubscriptionTierAttributes {
  public id!: string;
  public tier_name!: string;
  public tier_code!: string;
  public price!: number;
  public currency!: string;
  public billing_cycle!: 'monthly' | 'quarterly' | 'yearly';
  public features!: string[];
  public active!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

SubscriptionTier.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    tier_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    tier_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    billing_cycle: {
      type: DataTypes.ENUM('monthly', 'quarterly', 'yearly'),
      allowNull: false,
      defaultValue: 'monthly',
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: 'subscription_tiers',
    timestamps: false,
    indexes: [
      {
        fields: ['tier_code'],
      },
      {
        fields: ['active'],
      },
    ],
  }
);

export { SubscriptionTier };
export default SubscriptionTier;
