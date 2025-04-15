
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
  plan?: SubscriptionPlan; // Add the plan property for the relationship
  cancellation_date?: string;
  cancellation_reason?: string;
}
