
export type UserRole = 'customer' | 'provider' | 'admin';
export type ProviderVerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'pro' | 'enterprise';

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type?: string; // Added to support Supabase sessions
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface DbUserProfile {
  id: string;
  firstName?: string; // camelCase for TypeScript
  lastName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  address?: string;
  city?: string;
  country?: string;
  active?: boolean;
  preferredLanguage?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
  birthDate?: Date;
  email?: string;
  emailVerified?: boolean;
  role: UserRole;
  loyaltyPoints?: number;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  // DB column names for mapping
  first_name?: string; // snake_case for DB
  last_name?: string;
  phone_number?: string;
  avatar_url?: string;
  birth_date?: string | Date;
  preferred_language?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  loyalty_points?: number;
  email_verified?: boolean;
}

export interface DbCustomerProfile {
  id: string;
  saved_services?: string[];
  preferred_categories?: string[];
  notification_preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export interface DbProviderProfile {
  id: string;
  email: string;
  phone_number?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  verification_status: ProviderVerificationStatus;
  subscription_tier: SubscriptionTier;
  commission_rate?: number | null;
  business_name?: string | null;
  business_description?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  completed_bookings?: number;
  rating?: number | null;
  rating_count?: number | null;
  services_count?: number | null;
  verified_at?: string | null;
  verified_by?: string | null;
}

export interface UserAddress {
  id: string;
  user_id: string;
  name: string;
  street: string;
  city: string;
  region?: string;
  postal_code?: string;
  country: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  address?: string;
  city?: string;
  country?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface Customer extends User {
  loyaltyPoints?: number;
  preferredCategories?: string[];
  savedServices?: string[];
}

export interface Provider extends User {
  businessName?: string;
  businessDescription?: string;
  website?: string;
  verificationStatus: ProviderVerificationStatus;
  subscriptionTier: SubscriptionTier;
  commissionRate?: number;
  completedBookings?: number;
  rating?: number;
  ratingCount?: number;
  servicesCount?: number;
  bannerUrl?: string;
  isActive?: boolean;
  categories?: string[];
  isVerified?: boolean;
  bankDetails?: Record<string, any>;
}

export interface Admin extends User {
  permissions?: string[];
  department?: string;
  accessLevel?: string;
  lastLogin?: Date;
  isSuperAdmin?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  userProfile: Customer | Provider | Admin | null;
  loading: boolean;
  isLoading: boolean; // Alias for loading
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, role: UserRole, userData: Partial<Customer | Provider>) => Promise<{ error: any | null, data: any | null }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: any | null }>;
  resetPassword: (password: string) => Promise<{ error: any | null }>;
  updateProfile: (data: Partial<Customer | Provider | Admin>) => Promise<boolean>;
  isAuthenticated: boolean;
}
