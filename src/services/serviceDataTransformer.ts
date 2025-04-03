
import { Service, ServiceData, ServiceListItem, ServiceCategory, PricingModel } from '@/types/service';

export function transformServiceListResponse(data: any[]): ServiceListItem[] {
  return data.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || '',
    category: (item.category || 'all') as ServiceCategory,
    pricingModel: (item.pricing_model || 'fixed') as PricingModel,
    price: item.price,
    providerName: item.provider_name || '',
    providerId: item.provider_id,
    rating: item.rating || 0,
    reviewCount: item.review_count || 0,
    image: item.image || '',
    location: item.location || '',
    isFeatured: item.featured || false
  }));
}

export function transformServiceResponse(data: any): Service {
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    price: data.price,
    pricingModel: (data.pricing_model || 'fixed') as PricingModel,
    category: (data.category || 'all') as ServiceCategory,
    providerId: data.provider_id,
    providerName: data.provider_name,
    features: data.features || [],
    image: data.image,
    isActive: data.is_active ?? true,
    location: data.location,
    rating: data.rating,
    reviewCount: data.review_count,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    available: true,
    isFeatured: data.featured || false
  };
}

export function transformServiceToApiFormat(service: Partial<Service>): Partial<ServiceData> {
  return {
    id: service.id,
    title: service.title,
    description: service.description,
    price: service.price,
    provider_id: service.providerId,
    provider_name: service.providerName,
    category: service.category,
    image: service.image,
    rating: service.rating,
    review_count: service.reviewCount,
    location: service.location,
    is_active: service.isActive ?? true,
    pricing_model: service.pricingModel,
    features: service.features,
    created_at: service.createdAt ? service.createdAt.toISOString() : new Date().toISOString(),
    updated_at: service.updatedAt ? service.updatedAt.toISOString() : new Date().toISOString()
  };
}
