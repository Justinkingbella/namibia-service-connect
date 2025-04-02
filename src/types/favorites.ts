
export interface FavoriteService {
  id: string;
  userId: string;
  serviceId: string;
  createdAt: Date;
  serviceName?: string;
  serviceImage?: string;
}
