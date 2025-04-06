import { Json } from "./schema";

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
  expires_at: string;
  user_agent?: string;
  ip_address?: string;
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
  notification_preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface DbCustomerProfile extends DbUserProfile {
  preferred_categories: string[];
  saved_services: string[];
  birth_date?: string;
  notification_preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface DbProviderProfile extends DbUserProfile {
  business_name: string;
  business_description: string;
  categories: string[];
  services: string[];
  rating: number;
  review_count: number;
  completed_bookings: number;
  commission_rate: number;
  verification_status: ProviderVerificationStatus;
  banner_url?: string;
  website?: string;
  tax_id?: string;
  business_license?: string;
  id_document_url?: string;
  proof_of_address_url?: string;
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
}

export interface Customer extends User {
  preferredCategories: string[];
  savedServices: string[];
}

export interface Admin extends User {
  permissions: string[];
  adminLevel: number;
}

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
  PROFESSIONAL = 'professional'
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  checkAuth: () => Promise<User | null>;
  session: Session | null;
}
