
import { Json } from './schema';
import { PaymentMethodType } from './schema';

export interface ServiceData {
  id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  provider_id: string;
  provider_name: string;
  image?: string;
  features?: string[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  pricing_model: string;
  location?: string;
  rating?: number;
  review_count?: number;
  availability?: Json;
  featured?: boolean;
  faqs?: Json;
  tags?: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string; 
  providerId: string;
  providerName: string;
  image?: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  pricingModel: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  availability?: Record<string, any>;
  featured?: boolean;
  faqs?: Record<string, any>;
  tags?: string[];
}

export interface ServiceListItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  pricingModel: string;
  providerName: string;
  providerId: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
}

export interface ServiceBookingData {
  serviceId: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  price: number;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface FavoriteService {
  id: string;
  service_id: string;
  user_id: string;
  created_at: string;
  service: {
    id: string;
    title: string;
    description: string;
    price: number;
    image?: string;
    provider_id: string;
    provider_name: string;
    // Additional fields needed by components
    category?: string;
    pricingModel?: string;
    rating?: number;
    reviewCount?: number;
    location?: string;
    // Additional fields with property names used in components
    providerId?: string;
    providerName?: string;
  };
}

// Add enums for categories
export enum ServiceCategoryEnum {
  HOME = 'HOME',
  CLEANING = 'CLEANING',
  REPAIR = 'REPAIR',
  PLUMBING = 'PLUMBING',
  ELECTRICAL = 'ELECTRICAL',
  MOVING = 'MOVING',
  PAINTING = 'PAINTING',
  LANDSCAPING = 'LANDSCAPING',
  TUTORING = 'TUTORING',
  ERRAND = 'ERRAND',
  PROFESSIONAL = 'PROFESSIONAL',
  FREELANCE = 'FREELANCE',
  TRANSPORT = 'TRANSPORT',
  HEALTH = 'HEALTH',
  ALL = 'ALL'
}

// Export ServiceCategory type
export type ServiceCategory = keyof typeof ServiceCategoryEnum;

// Pricing model enum
export enum PricingModelEnum {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  PROJECT = 'PROJECT',
  QUOTE = 'QUOTE'
}

// Export PricingModel type
export type PricingModel = keyof typeof PricingModelEnum;

// Export payment method type
export type ServicePaymentMethod = PaymentMethodType;
