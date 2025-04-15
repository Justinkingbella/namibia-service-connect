
export enum ServiceCategoryEnum {
  CLEANING = "CLEANING",
  PLUMBING = "PLUMBING",
  ELECTRICAL = "ELECTRICAL",
  CARPENTRY = "CARPENTRY",
  GARDENING = "GARDENING",
  IT_SUPPORT = "IT_SUPPORT",
  TUTORING = "TUTORING",
  FOOD_DELIVERY = "FOOD_DELIVERY",
  TRANSPORTATION = "TRANSPORTATION",
  OTHER = "OTHER",
  ALL = "ALL",
  // Additional categories
  MOVING = "MOVING",
  REPAIRS = "REPAIRS",
  CONSTRUCTION = "CONSTRUCTION",
  EVENT_PLANNING = "EVENT_PLANNING",
  INTERIOR_DESIGN = "INTERIOR_DESIGN"
}

export enum PricingModelEnum {
  HOURLY = "HOURLY",
  FIXED = "FIXED",
  QUOTE = "QUOTE",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY"
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  slug?: string;
  isActive?: boolean;
  featured?: boolean;
  parentCategoryId?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategoryEnum | string;
  pricingModel: PricingModelEnum | string;
  price: number;
  features?: string[];
  image?: string;
  providerId: string;
  providerName?: string;
  location?: string;
  isActive: boolean;
}

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  category: string;
  pricing_model: string;
  price: number;
  features?: string[];
  image?: string;
  provider_id: string;
  provider_name?: string;
  location?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  availability?: Record<string, any>;
  faqs?: Array<{ question: string; answer: string }>;
}

export interface ServiceListItem {
  id: string;
  title: string;
  description: string;
  category: string;
  pricing_model: string;
  price: number;
  provider_id: string;
  provider_name: string;
  rating?: number;
  review_count?: number;
  image?: string;
  location?: string;
  is_active: boolean;
  featured?: boolean;
}

export interface FavoriteService {
  id: string;
  userId: string;
  serviceId: string;
  createdAt: string;
  service?: ServiceListItem;
}
