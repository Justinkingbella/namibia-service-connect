
export type UserRole = 'customer' | 'provider' | 'admin';
export type ProviderVerificationStatus = 'pending' | 'verified' | 'rejected' | 'under_review';
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  avatarUrl?: string;
  isActive?: boolean;
  createdAt: Date;
  emailVerified?: boolean;
}

export interface DbUserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  avatar_url?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  role: UserRole;
  active: boolean;
  created_at: string;
  updated_at?: string;
  registration_completed?: boolean;
  email_verified?: boolean;
  last_active?: string;
  loyalty_points?: number;
  total_spent?: number;
  preferred_language?: string;
  birth_date?: string;
  user_preferences?: any;
  favorites?: string[];
}

export interface DbProviderProfile {
  id: string;
  email: string;
  business_name?: string;
  business_description?: string;
  verification_status: ProviderVerificationStatus;
  avatar_url?: string;
  banner_url?: string;
  address?: string;
  city?: string;
  country?: string;
  phone_number?: string;
  website?: string;
  created_at: string;
  updated_at?: string;
  verified_at?: string;
  verified_by?: string;
  is_active?: boolean;
  completed_bookings?: number;
  rating?: number;
  rating_count?: number;
  services_count?: number;
  commission_rate?: number;
  subscription_tier?: SubscriptionTier;
}

export interface DbCustomerProfile {
  id: string;
  notification_preferences?: { email: boolean; sms: boolean; push: boolean };
  preferred_categories?: string[];
  saved_services?: string[];
  created_at: string;
  updated_at?: string;
}

export interface Customer extends User {
  notificationPreferences?: { email: boolean; sms: boolean; push: boolean };
  preferredCategories?: string[];
  savedServices?: string[];
  loyaltyPoints?: number;
}

export interface Provider extends User {
  businessName?: string;
  businessDescription?: string;
  verificationStatus: ProviderVerificationStatus;
  bannerUrl?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  completedBookings?: number;
  rating?: number;
  ratingCount?: number;
  servicesCount?: number;
  commissionRate?: number;
  subscriptionTier: SubscriptionTier;
  isActive: boolean;
}

export interface Admin extends User {
  permissions?: string[];
  lastLogin?: Date;
  adminLevel?: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  name: string;
  street: string;
  city: string;
  region?: string;
  country: string;
  postal_code?: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: any;
  userRole: string;
  userProfile: Customer | Provider | Admin | null;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Customer | Provider | Admin>) => Promise<boolean>;
}
