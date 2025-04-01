
export type ServiceCategory = 
  | 'all' 
  | 'home' 
  | 'errand' 
  | 'professional' 
  | 'freelance' 
  | 'transport' 
  | 'health';

export type PricingModel = 'hourly' | 'fixed';

export type PaymentMethod = 
  | 'pay_today'
  | 'pay_fast'
  | 'e_wallet'
  | 'dop'
  | 'easy_wallet'
  | 'bank_transfer'
  | 'cash';

export interface ServiceListItem {
  id: string;
  title: string;
  category: ServiceCategory | string; // Allow string for backward compatibility
  pricingModel: PricingModel | string; // Allow string for backward compatibility
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
