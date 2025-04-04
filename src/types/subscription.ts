
import { Json } from '@/integrations/supabase/types';

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
  limit?: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly' | string;
  credits: number;
  maxBookings: number;
  features: SubscriptionFeature[];
  isPopular?: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  trialPeriodDays?: number;
  allowedServices?: number;
  sortOrder?: number;
  stripePriceId?: string;
  visibleToRoles?: string[];
}

export interface SubscriptionState {
  loading: boolean;
  error: string | null;
  plans: SubscriptionPlan[];
}

export interface UserSubscription {
  id: string;
  userId: string;
  subscriptionPlanId: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  status: 'active' | 'pending' | 'cancelled' | 'expired';
  creditsUsed?: number;
  creditsRemaining?: number;
  bookingsUsed?: number;
  bookingsRemaining?: number;
  autoRenew?: boolean;
  cancellationReason?: string;
  cancellationDate?: string;
  trialEndDate?: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  plan?: SubscriptionPlan;
}

export interface SubscriptionUsage {
  id: string;
  subscriptionId: string;
  userId: string;
  metricName: string;
  usageCount: number;
  usageDate: string;
  referenceId?: string;
  createdAt: string;
}

export interface SubscriptionInvoice {
  id: string;
  subscriptionId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  invoiceDate: string;
  dueDate?: string;
  paidDate?: string;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  stripeInvoiceId?: string;
  paymentMethod?: string;
  invoiceNumber?: string;
  lineItems?: any[];
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionTier = 'Basic' | 'Professional' | 'Premium' | string;

// Helper function to convert Supabase Json features to SubscriptionFeature[]
export const convertJsonToFeatures = (jsonFeatures: Json): SubscriptionFeature[] => {
  if (!jsonFeatures || !Array.isArray(jsonFeatures)) {
    return [];
  }
  
  return jsonFeatures.map((feature: any) => ({
    id: feature.id || crypto.randomUUID(),
    name: feature.name || '',
    description: feature.description || '',
    included: feature.included !== undefined ? feature.included : true,
    limit: feature.limit
  }));
};

// Helper function to convert SubscriptionFeature[] to Json format for Supabase
export const convertFeaturesToJson = (features: SubscriptionFeature[]): Json => {
  return features as unknown as Json;
};

export interface ProviderEarnings {
  id?: string;
  providerId: string;
  periodStart: Date;
  periodEnd: Date;
  totalEarnings: number;
  totalBookings: number;
  completedBookings: number;
  commissionPaid: number;
  netEarnings: number;
  payoutStatus?: string;
  payoutDate?: Date;
  payoutReference?: string;
}
