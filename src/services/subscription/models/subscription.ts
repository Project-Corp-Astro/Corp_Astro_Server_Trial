import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../../config/sequelize.config';
import { SubscriptionTierType } from '../constants/tiers';

export interface SubscriptionPlanAttributes {
  plan_id: number;
  plan_name: string;
  plan_description?: string;
  tier_type: SubscriptionTierType;
  monthly_price: number;
  quarterly_price?: number;
  biannual_price?: number;
  annual_price?: number;
  currency: string;
  features: Record<string, any>;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface SubscriptionPlanCreationAttributes extends Optional<SubscriptionPlanAttributes, 'plan_id' | 'created_at' | 'updated_at'> {}

class SubscriptionPlan extends Model<SubscriptionPlanAttributes, SubscriptionPlanCreationAttributes> implements SubscriptionPlanAttributes {
  public plan_id!: number;
  public plan_name!: string;
  public plan_description?: string;
  public tier_type!: SubscriptionTierType;
  public monthly_price!: number;
  public quarterly_price?: number;
  public biannual_price?: number;
  public annual_price?: number;
  public currency!: string;
  public features!: Record<string, any>;
  public is_active!: boolean;
  public created_at?: Date;
  public updated_at?: Date;
}

SubscriptionPlan.init(
  {
    plan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    plan_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    plan_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tier_type: {
      type: DataTypes.ENUM('free', 'subscription', 'premium'),
      allowNull: false,
    },
    monthly_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quarterly_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    biannual_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    annual_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'INR',
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'subscription_plans',
    timestamps: true,
    underscored: true,
  }
);

export default SubscriptionPlan;
