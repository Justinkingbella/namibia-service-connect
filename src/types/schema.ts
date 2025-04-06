
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone_number?: string;
          avatar_url?: string;
          email_verified: boolean;
          role: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          notification_preferences: {
            email: boolean;
            sms: boolean;
            push: boolean;
          };
          birth_date?: string;
          address?: string;
          city?: string;
          country?: string;
          bio?: string;
          loyalty_points?: number;
        };
      };
      services: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          category: string;
          provider_id: string;
          provider_name: string;
          image?: string;
          features?: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
          pricing_model: string;
          location?: string;
          rating?: number;
          review_count?: number;
          availability?: Json;
          featured?: boolean;
          faqs?: Json;
        };
      };
      // ... additional tables can be defined here
    };
  };
}

// Additional types
export type ServiceCategory = string;
export type PricingModel = string;

// Define a type for payment method types
export type PaymentMethodType = 
  | 'credit_card' 
  | 'debit_card' 
  | 'bank_transfer' 
  | 'e_wallet' 
  | 'easy_wallet'
  | 'cash' 
  | 'mobile_money'
  | 'payfast';

// Define a type for wallet payment types
export type WalletPaymentType = 
  | 'e_wallet'
  | 'easy_wallet'
  | 'mobile_money'
  | 'bank_transfer'
  | 'credit_card'
  | 'debit_card'
  | 'MTC E-Wallet'
  | 'Bank Transfer';

// Define a type for payment status
export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'canceled'
  | 'partially_refunded';

// Define a type for booking status
export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'no_show'
  | 'disputed'
  | 'rescheduled';

// Define a type for subscription tier
export type SubscriptionTierType = 
  | 'free'
  | 'basic'
  | 'pro' 
  | 'premium'
  | 'professional'
  | 'enterprise';

// Define a type for provider verification status
export type ProviderVerificationStatus = 
  | 'pending'
  | 'verified'
  | 'rejected'
  | 'unverified';

export type WalletVerificationStatus = 
  | 'pending' 
  | 'submitted' 
  | 'verified' 
  | 'rejected' 
  | 'expired';
