
import { ServiceData, Service, PricingModel } from '@/types';

// Convert from database ServiceData format to frontend Service format
export function transformServiceData(data: ServiceData): Service {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    price: data.price,
    pricingModel: data.pricing_model,
    category: data.category,
    providerId: data.provider_id,
    providerName: data.provider_name,
    image: data.image,
    features: data.features || [],
    isActive: data.is_active,
    location: data.location,
    rating: data.rating,
    reviewCount: data.review_count,
    createdAt: data.created_at ? new Date(data.created_at) : undefined,
    updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    featured: false // Default value
  };
}

// Convert from frontend Service format to database ServiceData format
export function reverseTransformServiceData(service: Service): ServiceData {
  return {
    id: service.id,
    title: service.title,
    description: service.description,
    price: service.price,
    pricing_model: service.pricingModel as string,
    category: service.category as string,
    provider_id: service.providerId,
    provider_name: service.providerName,
    image: service.image,
    features: service.features,
    is_active: service.isActive,
    location: service.location,
    rating: service.rating,
    review_count: service.reviewCount,
    created_at: service.createdAt?.toISOString(),
    updated_at: service.updatedAt?.toISOString()
  };
}
