import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export enum SubscriptionStatus {    
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
}

export interface UserSubscriptionAttributes {
  subscription_id: string;
  user_id: string;
  plan_id: number;
  start_date: Date;
  end_date: Date;
  billing_cycle: string;
  auto_renew: boolean;
  status: SubscriptionStatus;
  payment_method?: string;
  payment_reference?: string;
  cancellation_date?: Date;
  cancellation_reason?: string;
  created_at?: Date;
  updated_at?: Date;
}

type UserSubscriptionCreationAttributes = Optional<
  UserSubscriptionAttributes,
  'subscription_id' | 'payment_method' | 'payment_reference' | 'cancellation_date' | 'cancellation_reason' | 'created_at' | 'updated_at'
>;

class UserSubscription
  extends Model<UserSubscriptionAttributes, UserSubscriptionCreationAttributes>
  implements UserSubscriptionAttributes
{
  public subscription_id!: string;
  public user_id!: string;
  public plan_id!: number;
  public start_date!: Date;
  public end_date!: Date;
  public billing_cycle!: string;
  public auto_renew!: boolean;
  public status!: SubscriptionStatus;
  public payment_method?: string;
  public payment_reference?: string;
  public cancellation_date?: Date;
  public cancellation_reason?: string;
  public created_at?: Date;
  public updated_at?: Date;
}

UserSubscription.init(
  {
    subscription_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
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
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subscription_plans',
        key: 'plan_id',
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
    billing_cycle: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    auto_renew: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'inactive', 'expired'), // match the values defined in the database enum
      allowNull: false,    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    payment_reference: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
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
    tableName: 'user_subscriptions',  // Ensure this matches your table name in the database
    timestamps: true,
    underscored: true,
  }
);

export default UserSubscription;
