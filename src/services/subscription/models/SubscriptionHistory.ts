// models/SubscriptionHistory.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../../config/sequelize.config';
import UserSubscription from './UserSubscription ';

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING'
}

export interface SubscriptionHistoryAttributes {
  history_id: string;
  subscription_id: string;
  user_id: string;
  plan_id: number;
  start_date: Date;
  end_date: Date;
  status: SubscriptionStatus;
  cancellation_date?: Date;
  cancellation_reason?: string;
  created_at?: Date;
}

type SubscriptionHistoryCreationAttributes = Optional<
  SubscriptionHistoryAttributes,
  'history_id' | 'created_at'
>;

class SubscriptionHistory
  extends Model<SubscriptionHistoryAttributes, SubscriptionHistoryCreationAttributes>
  implements SubscriptionHistoryAttributes
{
  public history_id!: string;
  public subscription_id!: string;
  public user_id!: string;
  public plan_id!: number;
  public start_date!: Date;
  public end_date!: Date;
  public status!: SubscriptionStatus;
  public cancellation_date?: Date;
  public cancellation_reason?: string;
  public created_at?: Date;
}

SubscriptionHistory.init(
  {
    history_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
    },
    subscription_id: {
      type: DataTypes.UUID,
      allowNull: false,
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
//planid references  subscription plan
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subscription_plans',
        key: 'plan_id',
      },
      onDelete: 'CASCADE',
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
 type: DataTypes.ENUM('pending', 'active', 'inactive', 'expired'), // match the values defined in the database enum
  allowNull: false,    },
  
    cancellation_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancellation_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'subscription_history',
    timestamps: true,
  }
);

export default SubscriptionHistory;
