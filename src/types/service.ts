
export type ServiceCategory = 
  | 'all'
  | 'cleaning'
  | 'repair'
  | 'plumbing'
  | 'electrical'
  | 'moving'
  | 'painting'
  | 'landscaping'
  | 'tutoring'
  | 'home'
  | 'errand'
  | 'professional'
  | 'freelance'
  | 'transport'
  | 'health';

export type PricingModel = 'fixed' | 'hourly' | 'quote';

export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer' | 'cash' | 'pay_today' | 'pay_fast' | 'e_wallet' | 'dop' | 'easy_wallet';

export interface ServiceListItem {
  id: string;
  title: string;
  description: string;
  price: number;
  pricingModel: PricingModel;
  category: ServiceCategory;
  providerName: string;
  providerId: string;
  rating?: number;
  reviewCount?: number;
  image?: string;
  location?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  pricingModel: PricingModel;
  category: ServiceCategory;
  providerId: string;
  features?: string[];
  isActive: boolean;
  image?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  providerName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Adding ServiceData interface to fix missing type errors
export interface ServiceData {
  id: string;
  title: string;
  description: string;
  price: number;
  pricing_model: PricingModel;
  category: ServiceCategory;
  provider_id: string;
  provider_name?: string;
  image?: string;
  features?: string[];
  is_active: boolean;
  location?: string;
  rating?: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
}
