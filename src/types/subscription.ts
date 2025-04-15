
// Enum for admin routes
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: string;
  isActive: boolean;
  isPopular?: boolean;
  features: Array<{
    name: string;
    included: boolean;
    details?: string;
    limit?: number;
  }>;
  credits: number;
  maxBookings: number;
  allowedServices: number;
  trialPeriodDays?: number;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  subscription_plan_id: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  payment_method: string;
  credits_used: number;
  credits_remaining: number;
  bookings_used: number;
  bookings_remaining: number;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan; // Added plan property for the relationship
  cancellation_date?: string;
  cancellation_reason?: string;
}

export interface SubscriptionTransaction {
  id: string;
  user_id: string;
  subscription_plan_id: string;
  amount: number;
  status: string;
  payment_method: string;
  payment_id?: string;
  created_at: string;
}

export interface ProviderEarnings {
  totalEarnings: number;
  monthToDateEarnings: number;
  weekToDateEarnings: number;
  pendingPayouts: number;
  completedBookings: number;
  subscriptionCost: number;
  subscriptionStatus: string;
  planName: string;
  nextPaymentDate: string;
  transactions: Array<{
    id: string;
    date: string;
    amount: number;
    description: string;
    status: string;
  }>;
  monthlyBreakdown: Array<{
    month: string;
    earnings: number;
  }>;
}
