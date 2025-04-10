
import { ServiceData, Service } from '@/types/service';

// Convert from database ServiceData format to frontend Service format
export function transformServiceData(data: ServiceData): Service {
  return {
    id: data.id || '', // Ensure id exists
    title: data.title || '',
    description: data.description || '',
    price: data.price || 0,
    pricingModel: data.pricing_model || 'fixed',
    category: data.category || '',
    providerId: data.provider_id || '',
    providerName: data.provider_name || '',
    image: data.image || '',
    rating: data.rating || 0,
    reviewCount: data.review_count || 0,
    location: data.location || '',
    provider_id: data.provider_id || '', // Keep the snake_case variant
    provider_name: data.provider_name || '', // Keep the snake_case variant
    // Add the additional properties needed
    features: data.features || [],
    isActive: data.is_active || false,
    createdAt: data.created_at || '',
    updatedAt: data.updated_at || '',
    tags: data.tags || []
  };
}

// Convert from frontend Service format to database ServiceData format
export function reverseTransformServiceData(service: Service): ServiceData {
  return {
    id: service.id,
    title: service.title,
    description: service.description,
    price: service.price,
    pricing_model: service.pricingModel,
    category: service.category,
    provider_id: service.providerId || service.provider_id,
    provider_name: service.providerName || service.provider_name,
    image: service.image,
    rating: service.rating,
    review_count: service.reviewCount,
    location: service.location,
    features: service.features || [],
    is_active: service.isActive || false,
    created_at: service.createdAt || '',
    updated_at: service.updatedAt || '',
    tags: service.tags || []
  };
}
