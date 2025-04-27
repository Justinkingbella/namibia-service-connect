import { SubscriptionTierType } from './schema';

export enum UserRole {
  ADMIN = 'admin',
  PROVIDER = 'provider',
  CUSTOMER = 'customer',
}

export enum ProviderVerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

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
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

export interface User {
  id: string;
  email: string;
  role: UserRole | string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

// Base user profile with common fields
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
}

// Customer profile extends base user profile
export interface DbCustomerProfile extends DbUserProfile {
  preferred_categories?: string[];
  saved_services?: string[];
  notification_preferences?: Record<string, any>;
}

// Provider profile extends base user profile
export interface DbProviderProfile extends DbUserProfile {
  business_name?: string;
  business_description?: string;
  banner_url?: string;
  website?: string;
  verification_status?: ProviderVerificationStatus;
  rating?: number;
  rating_count?: number;
  services_count?: number;
  completed_bookings?: number;
  commission_rate?: number;
  verified_at?: string;
  verified_by?: string;
  subscription_tier?: SubscriptionTier;
  categories?: string[];
  services?: string[];
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  createdAt: string;
  role: UserRole | string;
  preferredCategories: string[];
  savedServices: string[];
  address?: string;
  city?: string;
  country?: string;
  active?: boolean;
}

export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole | string;
  businessName: string;
  businessDescription: string;
  rating: number;
  ratingCount: number;
  avatarUrl: string;
  bannerUrl: string;
  verificationStatus: ProviderVerificationStatus | string;
  address: string;
  city: string;
  country: string;
  createdAt: string;
  completedBookings: number;
  serviceCount: number;
  commissionRate: number;
  active?: boolean;
  subscriptionTier: SubscriptionTierType | string;
  categories?: string[];
}

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  permissions: string[];
  adminLevel: 'super' | 'manager' | 'support';
  department?: string;
  accessLevel: number;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  setUser: (user: User | null) => void;
  userProfile?: any; // Used in ProfileSummary
  userRole?: string; // Used in ProfileSummary
}
