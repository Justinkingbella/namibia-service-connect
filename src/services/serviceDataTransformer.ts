
import { ServiceData, Service, ServiceListItem } from '@/types/service';

/**
 * Transforms a database service object to a frontend Service model
 * with proper type handling
 */
export const transformServiceData = (serviceData: ServiceData | null): Service | null => {
  if (!serviceData) return null;
  
  return {
    id: serviceData.id,
    title: serviceData.title || '',
    description: serviceData.description || '',
    category: serviceData.category || 'other',
    pricingModel: serviceData.pricing_model || 'hourly',
    price: typeof serviceData.price === 'number' ? serviceData.price : 0,
    providerName: serviceData.provider_name || 'Anonymous Provider',
    providerId: serviceData.provider_id,
    rating: typeof serviceData.rating === 'number' ? serviceData.rating : 0,
    reviewCount: typeof serviceData.review_count === 'number' ? serviceData.review_count : 0,
    image: serviceData.image || '',
    location: serviceData.location || 'Unknown Location'
  };
};

/**
 * Transforms database service data to frontend ServiceListItem
 */
export const transformToServiceListItem = (serviceData: ServiceData): ServiceListItem => {
  return {
    id: serviceData.id,
    title: serviceData.title || '',
    category: serviceData.category || 'other',
    pricingModel: serviceData.pricing_model || 'hourly',
    price: typeof serviceData.price === 'number' ? serviceData.price : 0,
    providerName: serviceData.provider_name || 'Anonymous Provider',
    providerId: serviceData.provider_id,
    rating: typeof serviceData.rating === 'number' ? serviceData.rating : 0,
    reviewCount: typeof serviceData.review_count === 'number' ? serviceData.review_count : 0,
    image: serviceData.image || '',
    location: serviceData.location || 'Unknown Location',
    description: serviceData.description || undefined
  };
};

/**
 * Transforms a frontend Service model to database ServiceData
 */
export const transformToServiceData = (service: Service): ServiceData => {
  return {
    id: service.id,
    title: service.title,
    description: service.description || null,
    price: service.price,
    provider_id: service.providerId,
    provider_name: service.providerName || null,
    category: service.category,
    image: service.image || null,
    rating: typeof service.rating === 'number' ? service.rating : null,
    review_count: typeof service.reviewCount === 'number' ? service.reviewCount : null,
    location: service.location || null,
    is_active: true,
    pricing_model: service.pricingModel || 'hourly'
  };
};
