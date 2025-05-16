import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface PaymentTransactionAttributes {
  transaction_id: string;
  user_id: string;
  subscription_id?: string;
  transaction_date?: Date;
  amount: number;
  currency: string;
  payment_method: string;
  gateway_name?: string;
  gateway_reference: string;
  gateway_response?: object;
  status: PaymentStatus;
  failure_reason?: string;
  metadata?: object;
  created_at?: Date;
  updated_at?: Date;
}

class PaymentTransaction extends Model<PaymentTransactionAttributes> implements PaymentTransactionAttributes {
  public transaction_id!: string;
  public user_id!: string;
  public subscription_id?: string;
  public transaction_date?: Date;
  public amount!: number;
  public currency!: string;
  public payment_method!: string;
  public gateway_name?: string;
  public gateway_reference!: string;
  public gateway_response?: object;
  public status!: PaymentStatus;
  public failure_reason?: string;
  public metadata?: object;
  public created_at?: Date;
  public updated_at?: Date;
}

PaymentTransaction.init(
  {
    transaction_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.fn('uuid_generate_v4')
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onDelete: 'CASCADE'
    },
    subscription_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'subscriptions',
        key: 'subscription_id'
      },
      onDelete: 'CASCADE'
    },
    transaction_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'INR',
      allowNull: false
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    gateway_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    gateway_reference: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    gateway_response: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'),
      allowNull: false
    },
    failure_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'payment_transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['subscription_id']
      },
      {
        fields: ['status']
      }
    ]
  }
);

export default PaymentTransaction;
