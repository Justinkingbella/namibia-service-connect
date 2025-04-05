
// Using a regular enum instead of a string enum so it can be used as a value
export enum ServiceCategoryEnum {
  cleaning = 'cleaning',
  repair = 'repair',
  plumbing = 'plumbing',
  electrical = 'electrical',
  moving = 'moving',
  painting = 'painting',
  landscaping = 'landscaping',
  tutoring = 'tutoring',
  home = 'home',
  errand = 'errand',
  professional = 'professional',
  freelance = 'freelance',
  transport = 'transport',
  health = 'health',
  all = 'all'
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  slug?: string;
  parentCategoryId?: string;
  featured?: boolean;
  isActive?: boolean;
}

export interface ServiceData {
  id?: string;
  title: string;
  description: string;
  price: number;
  pricing_model: string;
  category: string;
  image?: string;
  location?: string;
  provider_id?: string;
  provider_name?: string;
  features?: string[];
  tags?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  slug?: string;
  featured?: boolean;
  availability?: Record<string, any>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  rating?: number;
  review_count?: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  pricingModel: string;
  category: string;
  image?: string;
  location?: string;
  providerId: string;
  providerName: string;
  features?: string[];
  tags?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  slug?: string;
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface ServiceListItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  pricingModel: string;
  providerId: string;
  providerName: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
}

export type PricingModel = 'fixed' | 'hourly' | 'daily' | 'project' | 'quote';

// Interface for service payment method information
export interface ServicePaymentMethod {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  processingFee?: number;
  processingFeeType?: 'fixed' | 'percentage';
}

// Explicitly export PaymentMethod to fix the import errors
export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer' | 'crypto' | 'cash' | 'mobile_money' | 'wallet';

// Interface for user's favorite services
export interface FavoriteService {
  id: string;
  service_id: string;
  user_id: string;
  service: {
    id: string;
    title: string;
    description: string;
    price: number;
    image?: string;
    provider_id: string;
    provider_name: string;
    category?: string;
    pricingModel?: string;
    rating?: number;
    reviewCount?: number;
    location?: string;
  };
}
