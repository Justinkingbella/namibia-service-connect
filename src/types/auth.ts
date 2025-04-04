
export type UserRole = 'customer' | 'provider' | 'admin';

export type ProviderVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  address?: string;
  city?: string;
  country?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: User;
}

export interface Customer extends User {
  role: 'customer';
  loyaltyPoints: number;
  preferredCategories?: string[];
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  savedServices?: string[];
}

export interface Provider extends User {
  role: 'provider';
  businessName: string;
  businessDescription: string;
  verificationStatus: ProviderVerificationStatus;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  categories?: string[];
  subscriptionTier?: string;
  bankDetails?: any;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
  isVerified: boolean;
}

export interface DbUserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  avatar_url?: string;
  address?: string;
  city?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
  registration_completed?: boolean;
  role?: UserRole;
  loyalty_points?: number;
}

export interface DbProviderProfile {
  id: string;
  business_name?: string;
  business_description?: string;
  verification_status?: ProviderVerificationStatus;
  email: string;
  avatar_url?: string;
  banner_url?: string;
  rating?: number;
  rating_count?: number;
  completed_bookings?: number;
  services_count?: number;
  commission_rate?: number;
  subscription_tier?: string;
  address?: string;
  city?: string;
  country?: string;
  phone_number?: string;
  website?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  verified_at?: string;
  verified_by?: string;
  categories?: string[];
  bank_details?: any;
}

export interface DbCustomerProfile {
  id: string;
  notification_preferences?: any;
  preferred_categories?: string[];
  saved_services?: string[];
  created_at?: string;
  updated_at?: string;
}
