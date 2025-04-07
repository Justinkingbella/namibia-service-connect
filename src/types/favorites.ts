
import { Service } from './service';

export interface FavoriteService {
  id: string;
  user_id: string;
  service_id: string;
  created_at: string;
  service?: {
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
    providerId?: string; 
    providerName?: string;
  };
}
