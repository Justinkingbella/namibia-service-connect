
export interface FavoriteService {
  id: string;
  userId: string;
  serviceId: string;
  createdAt: string;
  service?: {
    id: string;
    title: string;
    category: string;
    pricingModel: string;
    price: number;
    providerName: string;
    providerId: string;
    rating: number;
    reviewCount: number;
    image: string;
    location: string;
    description: string;
  };
}
