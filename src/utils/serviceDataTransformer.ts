
import { Service, ServiceData } from '@/types';

/**
 * Transforms raw service data from the database to a properly formatted Service object
 */
export function transformServiceData(data: any): Service {
  // Handle missing data gracefully
  if (!data) {
    return {
      id: '',
      title: '',
      description: '',
      price: 0,
      image: '',
      provider_id: '',
      providerId: '',
      provider_name: '',
      providerName: '',
      category: '',
      pricingModel: '',
      rating: 0,
      reviewCount: 0,
      location: '',
      features: [],
      isActive: false,
      createdAt: '',
      updatedAt: '',
      tags: []
    };
  }

  // Transform to Service structure
  return {
    id: data.id || '',
    title: data.title || '',
    description: data.description || '',
    price: typeof data.price === 'number' ? data.price : 0,
    image: data.image || '',
    provider_id: data.provider_id || '',
    providerId: data.provider_id || '',
    provider_name: data.provider_name || '',
    providerName: data.provider_name || '',
    category: data.category || '',
    pricingModel: data.pricing_model || '',
    rating: typeof data.rating === 'number' ? data.rating : 0,
    reviewCount: typeof data.review_count === 'number' ? data.review_count : 0,
    location: data.location || '',
    features: Array.isArray(data.features) ? data.features : [],
    isActive: !!data.is_active,
    createdAt: data.created_at || '',
    updatedAt: data.updated_at || '',
    tags: Array.isArray(data.tags) ? data.tags : []
  };
}

/**
 * Transforms a Service object back to ServiceData format for database operations
 */
export function reverseTransformServiceData(service: Service): ServiceData {
  return {
    id: service.id,
    title: service.title,
    description: service.description,
    price: service.price,
    image: service.image,
    provider_id: service.provider_id,
    provider_name: service.provider_name,
    category: service.category,
    pricing_model: service.pricingModel,
    rating: service.rating,
    review_count: service.reviewCount,
    location: service.location,
    is_active: service.isActive,
    created_at: service.createdAt,
    updated_at: service.updatedAt,
    features: service.features,
    tags: service.tags
  };
}
