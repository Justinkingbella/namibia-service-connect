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
  phoneNumber?: string;
  emailVerified?: boolean;
  createdAt?: string;
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
  emailVerified?: boolean;
  preferredCategories: string[];
  savedServices: string[];
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
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
  emailVerified?: boolean;
  businessName: string;
  businessDescription: string;
  rating: number;
  commission: number;
  avatarUrl: string;
  bannerUrl: string;
  website?: string;
  taxId?: string;
  reviewCount: number;
  verificationStatus: ProviderVerificationStatus | string;
  address?: string;
  city?: string;
  country?: string;
  createdAt: string;
  completedBookings?: number;
  serviceCount?: number;
  isVerified?: boolean;
  active?: boolean;
  subscriptionTier: SubscriptionTierType | string;
  categories?: string[];
  services?: string[];
}

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  permissions: string[];
  adminLevel: number;
  department?: string;
  accessLevel: number;
}

export interface AuthContextType {
  user: User | null;
  userProfile: Customer | Provider | Admin | null;
  userRole: UserRole | string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{error: any | null}>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{error: any | null, data?: any}>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<string>;
  setUserProfile: (profile: Customer | Provider | Admin | null) => void;
  navigate: (path: string, options?: { replace?: boolean }) => void;
  checkAuth: () => Promise<User | null>;
}
