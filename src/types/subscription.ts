
import { Json } from './index';

export interface SubscriptionFeature {
  name: string;
  included: boolean;
  limit?: number;
  description?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  features: SubscriptionFeature[];
  isActive: boolean;
  isPopular?: boolean;
  trial_period_days?: number;
  allowed_services?: number;
  credits?: number;
  max_bookings?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  subscription_plan_id: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  start_date: string;
  end_date: string;
  payment_method: string;
  payment_id?: string;
  auto_renew?: boolean;
  credits_used?: number;
  credits_remaining?: number;
  bookings_used?: number;
  bookings_remaining?: number;
  created_at?: string;
  updated_at?: string;
  cancellation_date?: string;
  cancellation_reason?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  userId?: string;
  planId?: string;
  planName?: string;
}

export interface SubscriptionTransaction {
  id: string;
  user_id: string;
  subscription_plan_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  payment_id?: string;
  created_at?: string;
  userId?: string;
  userName?: string;
}

export interface ProviderEarnings {
  totalEarnings: number;
  monthToDateEarnings: number;
  weekToDateEarnings: number;
  pendingPayouts: number;
  completedBookings: number;
  subscriptionCost: number;
  subscriptionStatus: 'active' | 'expired' | 'cancelled' | 'pending' | 'none';
  planName: string;
  nextPaymentDate?: string;
  transactions: {
    id: string;
    date: string;
    amount: number;
    description: string;
    status: 'completed' | 'pending' | 'failed';
  }[];
  monthlyBreakdown: {
    month: string;
    earnings: number;
  }[];
}
