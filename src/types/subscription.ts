
export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  credits: number;
  maxBookings: number;
  features: SubscriptionFeature[];
  isPopular?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionState {
  loading: boolean;
  error: string | null;
  plans: SubscriptionPlan[];
}
