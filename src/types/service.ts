
import { Json } from "./schema";

export enum ServiceCategoryEnum {
  CLEANING = 'cleaning',
  CONSTRUCTION = 'construction',
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  GARDENING = 'gardening',
  MOVING = 'moving',
  REPAIRS = 'repairs',
  INTERIOR_DESIGN = 'interior_design',
  EVENT_PLANNING = 'event_planning',
  TUTORING = 'tutoring',
  OTHER = 'other'
}

export enum PricingModelEnum {
  HOURLY = 'hourly',
  FIXED = 'fixed',
  QUOTE = 'quote',
  DAILY = 'daily',
  MONTHLY = 'monthly',
  PER_UNIT = 'per_unit'
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  slug?: string;
  parentId?: string;
  isActive?: boolean;
  featured?: boolean;
  orderIndex?: number;
}

export interface PricingModel {
  type: PricingModelEnum;
  label: string;
  description: string;
}

export interface ServiceListItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  providerId?: string;
  providerName?: string;
  location?: string;
  isActive?: boolean;
  featured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  provider_id: string; // Use snake_case for DB fields
  provider_name: string; // Use snake_case for DB fields
  category: string;
  pricingModel: string;
  rating: number;
  reviewCount: number;
  location: string;
  // Add camel case variants for client-side consistency
  providerId: string;
  providerName: string;
}

// Updated to include provider_name
export interface ServiceData {
  id: string;
  title: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  pricing_model: string;
  provider_id: string;
  provider_name: string; // Added to match required field
  rating?: number;
  review_count?: number;
  location?: string;
  is_active?: boolean;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
  availability?: Json;
  faqs?: Json;
  features?: string[];
  tags?: string[];
  slug?: string;
}

export interface FavoriteService {
  id: string;
  user_id: string;
  service_id: string;
  created_at: string;
  userId?: string;     // Add camelCase variants for compatibility
  serviceId?: string;  // Add camelCase variants for compatibility
  createdAt?: string;  // Add camelCase variants for compatibility
  service?: Service | null;
}
