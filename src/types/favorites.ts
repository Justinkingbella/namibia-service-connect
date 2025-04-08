
import { Service } from './service';

export interface FavoriteService {
  id: string;
  user_id: string;
  service_id: string;
  created_at: string;
  userId?: string;     // Add camelCase variants for compatibility
  serviceId?: string;  // Add camelCase variants for compatibility
  createdAt?: string;  // Add camelCase variants for compatibility
  service?: Service | null;
}
