
export enum ServiceCategoryEnum {
  CLEANING = 'cleaning',
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  CARPENTRY = 'carpentry',
  GARDENING = 'gardening',
  IT_SUPPORT = 'it_support',
  TUTORING = 'tutoring',
  FOOD_DELIVERY = 'food_delivery',
  TRANSPORTATION = 'transportation',
  OTHER = 'other'
}

export enum PricingModelEnum {
  FIXED = 'fixed',
  HOURLY = 'hourly',
  DAILY = 'daily',
  SQUARE_METER = 'square_meter',
  CUSTOM = 'custom'
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  slug?: string;
  isActive: boolean;
  orderIndex?: number;
  featured?: boolean;
  parentCategoryId?: string;
}

export interface ServiceListItem {
  id: string;
  title: string;
  description: string;
  price: number;
  provider_id: string;
  provider_name: string;
  category: string;
  pricingModel: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  provider_id: string;
  providerId: string; 
  provider_name: string;
  providerName: string;
  category: string;
  pricingModel: string;
  pricing_model?: string; // For backend compatibility
  rating: number;
  reviewCount: number;
  location?: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface ServiceData {
  id: string;
  title: string;
  description?: string;
  price: number;
  image?: string;
  provider_id: string;
  category: string;
  pricing_model: string;
  features?: string[];
  tags?: string[];
  location?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FavoriteService {
  id: string;
  user_id: string;
  service_id: string;
  created_at: string;
}

export type PricingModel = keyof typeof PricingModelEnum;
