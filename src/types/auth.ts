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
  role?: UserRole;
  loyalty_points?: number;
  birth_date?: string;
  preferred_language?: string;
  favorites?: string[];
  is_verified?: boolean;
  verification_status?: string;
  preferred_categories?: string[];
  saved_services?: string[];
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
  subscription_tier?: SubscriptionTier;
  rating?: number;
  business_logo?: string;
  business_address?: string;
  business_hours?: Record<string, any>;
  categories?: string[];
  verification_documents?: string[];
  review_count?: number;
  bank_details?: Record<string, any>;
  rating_count?: number;
}

export type UserRole = 'admin' | 'provider' | 'customer' | string;
export type ProviderVerificationStatus = 'pending' | 'verified' | 'rejected' | 'unverified';
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'professional' | 'pro' | 'enterprise' | string;

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

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
  name?: string; // Added for compatibility
  avatar?: string; // Added for compatibility
  phoneNumber?: string;
}

// Update Customer type to include properties used in AuthContext
export interface Customer extends User {
  role: 'customer';
  loyaltyPoints: number;
  preferences?: Record<string, any>;
  favorites?: string[];
  preferredCategories?: string[]; // Added missing property
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  isVerified?: boolean; // Added missing property
}

// Update Provider type to include properties used in AuthContext
export interface Provider extends User {
  role: 'provider';
  businessName: string;
  businessDescription?: string; // Added missing property
  verificationStatus: ProviderVerificationStatus;
  description?: string;
  rating?: number;
  reviewCount?: number;
  categories?: string[]; // Added missing property
  locations?: string[];
  bankDetails?: Record<string, any>; // Added missing property
  subscriptionTier?: SubscriptionTier;
  isVerified?: boolean; // Added missing property
}

// Update Admin type to include properties used in AuthContext
export interface Admin extends User {
  role: 'admin';
  permissions: string[];
  isVerified?: boolean; // Added missing property
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  userProfile: Customer | Provider | Admin | null;
  loading: boolean; // Changed from isLoading for backward compatibility
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, role: UserRole, userData: Partial<Customer | Provider>) => Promise<{ error: any | null, data: any | null }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: any | null }>;
  resetPassword: (password: string) => Promise<{ error: any | null }>;
  updateProfile: (data: Partial<Customer | Provider | Admin>) => Promise<boolean>;
}
