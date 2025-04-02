
export type ServiceCategory = 
  | 'all' 
  | 'home' 
  | 'errand' 
  | 'professional' 
  | 'freelance' 
  | 'transport' 
  | 'health'
  | string; // Allow any string value

export type PricingModel = 'hourly' | 'fixed' | string; // Allow any string value

export type PaymentMethod = 
  | 'pay_today'
  | 'pay_fast'
  | 'e_wallet'
  | 'dop'
  | 'easy_wallet'
  | 'bank_transfer'
  | 'cash'
  | string; // Allow any string value

export interface ServiceListItem {
  id: string;
  title: string;
  category: ServiceCategory;
  pricingModel: PricingModel;
  price: number;
  providerName: string;
  providerId: string;
  rating: number;
  reviewCount: number;
  image: string;
  location: string;
  description?: string;
}

export interface Service extends ServiceListItem {
  description: string;
  availability?: {
    days: string[];
    hours: {
      start: string;
      end: string;
    }
  };
  features?: string[];
  faqs?: {
    question: string;
    answer: string;
  }[];
}

// Interface for database operations in profileService.ts
export interface ServiceData {
  id: string;
  title: string;
  description: string | null;
  price: number;
  provider_id: string;
  provider_name?: string | null;
  category: string;
  image: string | null;
  rating?: number | null;
  review_count?: number | null;
  location?: string | null;
  is_active?: boolean | null;
  pricing_model?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
