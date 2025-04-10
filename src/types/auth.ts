
import { Json } from "./schema";
import { SubscriptionTierType } from "./schema";

export type ProviderVerificationStatus = 'pending' | 'verified' | 'rejected' | 'unverified';

export type UserRole = 'admin' | 'provider' | 'customer';

export interface UserAddress {
  id: string;
  user_id: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  created_at: string;
  expires_at: number; // Changed to number to match Supabase's typing
  expires_in: number;
  token_type: string;
  access_token: string;
  refresh_token: string; // Make refresh_token required
  user?: {
    id: string;
    email: string;
    role: UserRole;
  }
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
  createdAt?: string;
  updatedAt?: string;
  birthDate?: string;
  bio?: string;
  loyaltyPoints?: number;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface DbUserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  avatar_url?: string;
  email_verified: boolean;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  birth_date?: string;
  loyalty_points?: number;
  notification_preferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface DbCustomerProfile extends DbUserProfile {
  preferred_categories: string[];
  saved_services: string[];
}

// Fix the DbProviderProfile interface to match properly
export interface DbProviderProfile extends DbUserProfile {
  business_name?: string;
  business_description?: string;
  banner_url?: string;
  website?: string;
  commission_rate?: number;
  verification_status?: ProviderVerificationStatus;
  completed_bookings?: number;
  rating?: number;
  rating_count?: number;
  services_count?: number;
  tax_id?: string;
  review_count?: number;
  categories?: string[];
  services?: string[];
}

export interface Provider extends User {
  businessName: string;
  businessDescription: string;
  categories: string[];
  services: string[];
  rating: number;
  commission: number;
  verificationStatus: ProviderVerificationStatus;
  bannerUrl?: string;
  website?: string;
  taxId?: string;
  reviewCount?: number;
  subscriptionTier?: string;
  isVerified?: boolean;
  bankDetails?: Record<string, any>;
}

export interface Customer extends User {
  preferredCategories: string[];
  savedServices: string[];
}

export interface Admin extends User {
  permissions: string[];
  adminLevel: number;
  isVerified?: boolean;
  accessLevel?: number;
}

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  PREMIUM = 'premium',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise'
}

export interface AuthContextType {
  user: User | null;
  userProfile: Customer | Provider | Admin | null;
  userRole: UserRole | null;
  isLoading: boolean;
  loading?: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{error: any | null}>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{error: any | null, data: any | null}>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  setUserProfile: (profile: Customer | Provider | Admin | null) => void;
  uploadAvatar: (file: File) => Promise<string>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  checkAuth: () => Promise<User | null>;
}
