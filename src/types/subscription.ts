
import { Json } from '@/integrations/supabase/types';

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
    included: feature.included !== undefined ? feature.included : true
  }));
};

// Helper function to convert SubscriptionFeature[] to Json format for Supabase
export const convertFeaturesToJson = (features: SubscriptionFeature[]): Json => {
  return features as unknown as Json;
};
