
export interface DbUserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  avatar_url?: string;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  created_at: string;
  updated_at: string;
  active?: boolean;
  role?: string;
  loyalty_points?: number;
  birth_date?: string;
  preferred_language?: string;
  favorites?: string[];
  is_verified?: boolean;
}

export interface DbProviderProfile {
  id: string;
  business_name: string;
  business_description?: string;
  email: string;
  phone_number?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  avatar_url?: string;
  banner_url?: string;
  verification_status: ProviderVerificationStatus;
  subscription_tier?: string;
  rating?: number;
  business_logo?: string;
  business_address?: string;
  business_hours?: Record<string, any>;
  categories?: string[];
  verification_documents?: string[];
  review_count?: number;
  bank_details?: Record<string, any>;
}

export type UserRole = 'admin' | 'provider' | 'customer';
export type ProviderVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface UserAddress {
  id: string;
  userId: string;
  name: string;
  street: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  name: string;
  type: string;
  details: any;
  isDefault: boolean;
  createdAt: Date;
}

export interface User2FA {
  userId: string;
  isEnabled: boolean;
  secret?: string;
  backupCodes?: string[];
}

// Add the missing interfaces required by index.ts
export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Customer extends User {
  loyaltyPoints: number;
  preferences?: Record<string, any>;
}

export interface Provider extends User {
  businessName: string;
  verificationStatus: ProviderVerificationStatus;
  rating?: number;
}

export interface Admin extends User {
  permissions: string[];
}

export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'professional';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  signUp: (userData: any) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
}
