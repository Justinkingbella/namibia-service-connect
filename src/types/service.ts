
export type PricingModel = 'fixed' | 'hourly' | 'daily' | 'quote';
export type PaymentMethod = 'credit_card' | 'mobile_money' | 'bank_transfer' | 'cash' | 'wallet';
export type ServiceCategory = 'cleaning' | 'repair' | 'plumbing' | 'electrical' | 'gardening' | 'moving' | 'painting' | 'other';

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
  available?: boolean;
  isFeatured?: boolean;
}
