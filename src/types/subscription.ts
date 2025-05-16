// src/types/subscription.ts

/**
 * Subscription tier enum
 */
export enum SubscriptionTier {
  FREE = 'free',
  SUBSCRIPTION = 'subscription',
  PREMIUM = 'premium',
}

/**
 * Subscription plan interface
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  tier: SubscriptionTier;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

/**
 * User subscription interface
 */
export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  tier: SubscriptionTier;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  status: SubscriptionStatus;
  paymentMethod: string;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Subscription status enum
 */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
  FAILED = 'failed',
}

/**
 * Subscription history interface
 */
export interface SubscriptionHistory {
  id: string;
  userId: string;
  planId: string;
  action: SubscriptionAction;
  previousTier?: SubscriptionTier;
  newTier?: SubscriptionTier;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Subscription action enum
 */
export enum SubscriptionAction {
  SUBSCRIBE = 'subscribe',
  RENEW = 'renew',
  UPGRADE = 'upgrade',
  DOWNGRADE = 'downgrade',
  CANCEL = 'cancel',
  PAYMENT_FAILED = 'payment_failed',
  REFUND = 'refund',
}

/**
 * Feature access interface
 */
export interface FeatureAccess {
  featureId: string;
  featureName: string;
  tier: SubscriptionTier;
  accessLevel: 'full' | 'limited' | 'none';
  limitValue?: number;
  limitPeriod?: 'daily' | 'weekly' | 'monthly';
}

/**
 * Payment transaction interface
 */
export interface PaymentTransaction {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: PaymentStatus;
  transactionId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Payment status enum
 */
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}
