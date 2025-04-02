
import { Service } from './service';

export interface FavoriteService {
  id: string;
  userId: string;
  serviceId: string;
  createdAt: Date;
  service?: {
    id: string;
    title: string;
    description: string;
    price: number;
    providerId: string;
    providerName: string;
    categoryId: string;
    imageUrl?: string;
    rating: number;
    reviewCount: number;
  };
}
