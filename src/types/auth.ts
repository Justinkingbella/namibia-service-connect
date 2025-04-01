
export type UserRole = 'admin' | 'provider' | 'customer';

export type ProviderVerificationStatus = 'unverified' | 'pending' | 'verified';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phoneNumber?: string;
  createdAt: Date;
  isVerified: boolean;
  providerDetails?: ProviderProfile;
  customerDetails?: CustomerProfile;
}

export interface Customer extends User {
  role: 'customer';
  favorites: string[]; // Array of service provider IDs
  bookingCount: number;
  totalSpent: number;
  referralCode?: string;
  referredBy?: string;
  loyaltyPoints: number;
}

export interface Provider extends User {
  role: 'provider';
  businessName: string;
  description: string;
  verificationStatus: ProviderVerificationStatus;
  categories: string[];
  locations: string[];
  subscriptionTier: SubscriptionTier;
  rating: number;
  reviewCount: number;
  earnings: number;
  balance: number;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  availability?: {
    days: string[];
    hours: {
      start: string;
      end: string;
    };
  };
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}

// Provider profile data
export interface ProviderProfile {
  id: string;
  business_name: string;
  description?: string;
  verification_status: ProviderVerificationStatus;
  categories?: string[];
  locations?: string[];
  subscription_tier?: string;
  rating?: number;
  review_count?: number;
  earnings?: number;
  balance?: number;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
}

// Customer profile data
export interface CustomerProfile {
  id: string;
  favorites?: string[];
  booking_count?: number;
  total_spent?: number;
  referral_code?: string;
  referred_by?: string;
  loyalty_points?: number;
}

// Extended profile types for working with database
export interface DbUserProfile {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
  is_verified?: boolean;
  avatar_url?: string;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
  first_name?: string;
  last_name?: string;
}

export interface DbProviderProfile {
  id: string;
  business_name: string;
  business_description?: string;
  verification_status?: ProviderVerificationStatus;
  categories?: string[];
  locations?: string[];
  subscription_tier?: string;
  rating?: number;
  rating_count?: number;
  earnings?: number;
  balance?: number;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
}
