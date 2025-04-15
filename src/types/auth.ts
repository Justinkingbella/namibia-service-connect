import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';
import { Json } from './schema';

// User roles enum - making these string values match the literal strings used in the codebase
export enum UserRole {
  CUSTOMER = 'customer',
  PROVIDER = 'provider',
  ADMIN = 'admin'
}

// Provider verification status enum
export enum ProviderVerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

// Subscription tier enum - adding string literals to match usage in components
export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
  PROFESSIONAL = 'professional',
  PRO = 'pro',          // Adding 'pro' to match string literals in code
  ENTERPRISE = 'enterprise' // Adding 'enterprise' to match string literals in code
}

// Base user interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole | string;
  phoneNumber: string;
  createdAt: string;
  avatarUrl?: string;
  emailVerified: boolean;
  birthDate?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
}

// Address interface
export interface UserAddress {
  id: string;
  userId: string;
  user_id?: string; // Allow both naming conventions
  name: string;
  street: string;
  city: string;
  region?: string;
  postalCode?: string;
  postal_code?: string; // Allow both naming conventions
  country: string;
  isDefault: boolean;
  is_default?: boolean; // Allow both naming conventions
}

// Customer interface
export interface Customer extends User {
  preferredCategories: string[];
  savedServices: string[];
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// Provider interface
export interface Provider extends User {
  businessName: string;
  businessDescription: string;
  categories: string[];
  services: string[];
  rating: number;
  commission: number;
  verificationStatus: ProviderVerificationStatus | string;
  bannerUrl?: string;
  website?: string;
  taxId?: string;
  reviewCount: number;
  isVerified: boolean;
  subscriptionTier: SubscriptionTier | string;
}

// Admin interface
export interface Admin extends User {
  permissions: string[];
  adminLevel: number;
  isVerified: boolean;
  accessLevel: number;
}

// Session interface extended from Supabase
export interface Session extends SupabaseSession {
  // Additional session properties if needed
}

// Database profile interface
export interface DbUserProfile {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  avatar_url?: string;
  email_verified?: boolean;
  role?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  birth_date?: string;
  favorites?: string[];
  loyalty_points?: number; // Adding this field to match usage in useProfile.tsx
  notification_preferences?: Json; // Adding this field to match usage in useProfile.tsx
}

// Database customer profile
export interface DbCustomerProfile extends DbUserProfile {
  preferred_categories?: string[];
  saved_services?: string[];
  notification_preferences?: Json;
}

// Database provider profile
export interface DbProviderProfile extends DbUserProfile {
  business_name?: string;
  business_description?: string;
  categories?: string[];
  services?: string[];
  rating?: number;
  commission_rate?: number;
  verification_status?: string;
  banner_url?: string;
  website?: string;
  tax_id?: string;
  review_count?: number;
  subscription_tier?: string;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  userProfile: Customer | Provider | Admin | null;
  userRole: UserRole | string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  
  signIn: (email: string, password: string) => Promise<{error: any | null, data?: any}>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{error: any | null, data?: any | null}>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  setUserProfile: (profile: Customer | Provider | Admin | null) => void;
  uploadAvatar: (file: File) => Promise<string>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  checkAuth: () => Promise<User | null>;
  
  // Navigation function
  navigate: (path: string, options?: { replace?: boolean }) => void;
}

// Export all types
export type {
  User,
  Customer,
  Provider,
  Admin,
  Session,
  UserAddress,
  DbUserProfile,
  DbCustomerProfile, 
  DbProviderProfile,
  AuthContextType
};

// Export enums
export {
  UserRole,
  ProviderVerificationStatus,
  SubscriptionTier
};
