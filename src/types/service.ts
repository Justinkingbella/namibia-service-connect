
export type ServiceCategory = 
  | 'errand' 
  | 'home' 
  | 'professional' 
  | 'freelance' 
  | 'transport' 
  | 'health';

export type ServiceStatus = 'active' | 'pending' | 'suspended';

export type PricingModel = 'hourly' | 'fixed';

export interface ServiceLocation {
  name: string;
  lat?: number;
  lng?: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  providerId: string;
  status: ServiceStatus;
  pricingModel: PricingModel;
  price: number; // In N$
  locations: ServiceLocation[];
  tags: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

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
}
