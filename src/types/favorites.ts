
import { Service } from './service';

export interface FavoriteService {
  id: string;
  userId: string;
  serviceId: string;
  createdAt: Date;
  // Add the service property for FavoritesPage
  service?: Service;
}
