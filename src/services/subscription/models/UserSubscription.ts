// src/services/subscription/models/UserSubscription.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';
import SubscriptionTier from './SubscriptionTier';

export interface UserSubscriptionAttributes {
  id?: string;
  user_id: string;
  subscription_tier_id: string;
  start_date: Date;
  end_date: Date;
  auto_renew: boolean;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  transaction_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

class UserSubscription extends Model<UserSubscriptionAttributes> implements UserSubscriptionAttributes {
  public id!: string;
  public user_id!: string;
  public subscription_tier_id!: string;
  public start_date!: Date;
  public end_date!: Date;
  public auto_renew!: boolean;
  public payment_status!: 'pending' | 'completed' | 'failed' | 'refunded';
  public payment_method!: string;
  public transaction_id?: string;
  public created_at!: Date;
  public updated_at!: Date;
}

UserSubscription.init(
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
    subscription_tier_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'subscription_tiers',
        key: 'id',
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    auto_renew: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    transaction_id: {
      type: DataTypes.STRING(100),
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
    tableName: 'user_subscriptions',
    timestamps: false,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['subscription_tier_id'],
      },
      {
        fields: ['payment_status'],
      },
      {
        fields: ['end_date'],
      },
    ],
  }
);

// Define association with SubscriptionTier
UserSubscription.belongsTo(SubscriptionTier, {
  foreignKey: 'subscription_tier_id',
  as: 'subscriptionTier',
});

// Add association types
declare global {
  namespace Express {
    interface UserSubscription {
      subscriptionTier?: SubscriptionTier;
    }
  }
}

export { UserSubscription };
export default UserSubscription;
