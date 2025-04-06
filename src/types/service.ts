
import { Json } from './schema';

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  provider_id: string;
  provider_name: string;
  image?: string;
  features?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  pricing_model: string;
  location?: string;
  rating?: number;
  review_count?: number;
  availability?: Json;
  featured?: boolean;
  faqs?: Json;
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
  };
}
