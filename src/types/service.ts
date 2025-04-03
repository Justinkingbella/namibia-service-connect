
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

export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';

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
