
export type UserRole = 'customer' | 'provider' | 'admin';
export type ProviderVerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'pro' | 'enterprise';

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type?: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface DbUserProfile {
  id: string;
  firstName?: string;
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
}

export interface Admin extends User {
  permissions?: string[];
  department?: string;
  accessLevel?: string;
  lastLogin?: Date;
  isSuperAdmin?: boolean;
  isVerified?: boolean;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  userProfile: Customer | Provider | Admin | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, data: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Customer | Provider | Admin>) => Promise<boolean>;
  isAuthenticated: boolean;
}
