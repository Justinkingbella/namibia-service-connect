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

// Change from type to enum so it can be used as values
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
  
  // Added camelCase properties for easier component usage
  pricingModel?: string;
  providerId?: string;
  providerName?: string;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
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

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  processingFee?: number;
  processingFeeType?: 'fixed' | 'percentage';
}

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
