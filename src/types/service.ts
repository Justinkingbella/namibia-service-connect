
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
  OTHER = 'other',
  ALL = 'all' // Adding ALL for filter purposes
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
  pricingModel?: string; // Add missing property for ServiceCard
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  provider_id: string;
  provider_name: string;
  category: string;
  pricingModel: string;
  rating: number;
  reviewCount: number;
  location: string;
  // Add camel case variants for client-side consistency
  providerId: string;
  providerName: string;
  // Add missing properties needed in the codebase
  features?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
}

export interface ServiceData {
  id: string;
  title: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  pricing_model: string;
  provider_id: string;
  provider_name: string; // Required field
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
