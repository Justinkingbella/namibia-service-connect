
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
