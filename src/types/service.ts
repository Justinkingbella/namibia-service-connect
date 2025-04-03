
export type ServiceCategory = 
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
  | 'health'
  | 'all';

export type PricingModel = 'hourly' | 'fixed' | string;

export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'wallet'
  | 'cash'
  | 'pay_today'
  | 'pay_fast'
  | 'e_wallet'
  | 'dop'
  | 'easy_wallet'
  | string;

export interface ServiceListItem {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  pricingModel: PricingModel;
  price: number;
  providerName: string;
  providerId: string;
  rating: number;
  reviewCount: number;
  image: string;
  location: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  pricingModel: PricingModel;
  category: ServiceCategory;
  providerId: string;
  providerName?: string;
  features: string[];
  image?: string;
  isActive: boolean;
  location?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

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
  created_at: string;
  updated_at: string;
}
