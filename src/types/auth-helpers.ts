
import { User, UserRole } from '@/types';

// Custom session type that aligns with our app needs
export interface CustomSessionUser {
  id: string;
  email: string;
  role: UserRole;
}

// Custom session used in our application
export interface CustomSession {
  id: string;
  user_id: string;
  expires_in: number;
  token_type: string;
  created_at: string;
  expires_at: number; 
  access_token: string;
  refresh_token: string;
  user: CustomSessionUser;
}

// Helper function to transform Supabase Session to our CustomSession
export function createCustomSession(supabaseSession: any): CustomSession {
  return {
    id: supabaseSession.user.id,
    user_id: supabaseSession.user.id,
    expires_in: supabaseSession.expires_in || 0,
    token_type: supabaseSession.token_type || 'bearer',
    created_at: new Date().toISOString(),
    expires_at: supabaseSession.expires_at || 0,
    access_token: supabaseSession.access_token,
    refresh_token: supabaseSession.refresh_token || '',
    user: {
      id: supabaseSession.user.id,
      email: supabaseSession.user.email || '',
      role: (supabaseSession.user.user_metadata?.role as UserRole) || 'customer'
    }
  };
}

// Helper function to handle provider profiles from Supabase
export function transformProviderData(providerData: any) {
  // Safely handle arrays and optional fields
  const categories = Array.isArray(providerData.categories) ? providerData.categories : [];
  const services = Array.isArray(providerData.services) ? providerData.services : [];
  const taxId = providerData.tax_id || '';
  const reviewCount = providerData.review_count || 0;
  
  return {
    categories,
    services,
    taxId,
    reviewCount
  };
}
