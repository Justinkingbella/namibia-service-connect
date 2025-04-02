
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
}

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
