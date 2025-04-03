
import { ServiceCategory, PricingModel, PaymentMethod, ServiceData } from './service';
import { UserRole, ProviderVerificationStatus, SubscriptionTier } from './auth';
import { BookingStatus, PaymentStatus } from './booking';
import { WalletVerificationStatus, NamibianMobileOperator, NamibianBank } from './payment';
import { VerificationStatus, WalletProvider, UserType } from './wallet';

/**
 * This file serves as a central location for defining and understanding
 * the relationships between different entities in our application.
 */

// Database Schema and Relationships
export interface DatabaseSchema {
  // User-related tables
  profiles: {
    id: string; // references auth.users.id
    first_name: string | null;
    last_name: string | null;
    role: UserRole;
    avatar_url: string | null;
    phone_number: string | null;
    birth_date: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    active: boolean | null;
    preferred_language: string | null;
    bio: string | null;
    created_at: string;
    updated_at: string;
  };

  customer_profiles: {
    id: string; // references profiles.id
    favorites: string[] | null; // Array of service IDs
    loyalty_points: number | null;
    preferred_categories: string[] | null;
    notification_preferences: Record<string, boolean> | null;
    is_verified: boolean;
  };

  admin_profiles: {
    id: string; // references profiles.id
    permissions: string[];
    department: string | null;
    access_level: string;
    last_login: string | null;
    is_super_admin: boolean;
  };
  
  service_providers: {
    id: string; // references profiles.id
    business_name: string;
    business_description: string | null;
    email: string;
    phone_number: string | null;
    website: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    verification_status: ProviderVerificationStatus;
    subscription_tier: SubscriptionTier | null;
    rating: number | null;
    rating_count: number | null;
    services_count: number | null;
    completed_bookings: number | null;
    commission_rate: number | null;
    avatar_url: string | null;
    banner_url: string | null;
  };
  
  // Service-related tables
  services: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    provider_id: string; // references service_providers.id
    category: ServiceCategory;
    image: string | null;
    location: string | null;
    is_active: boolean | null;
    pricing_model: PricingModel;
    created_at: string;
    updated_at: string;
  };
  
  service_categories: {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    is_active: boolean | null;
    order_index: number | null;
  };
  
  // Booking-related tables
  bookings: {
    id: string;
    service_id: string; // references services.id
    customer_id: string; // references profiles.id
    provider_id: string; // references service_providers.id
    status: BookingStatus;
    date: string;
    start_time: string;
    end_time: string | null;
    duration: number | null;
    total_amount: number;
    commission: number;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    notes: string | null;
    is_urgent: boolean | null;
  };
  
  // Payment and financial tables
  payment_history: {
    id: string;
    user_id: string | null; // references profiles.id
    booking_id: string | null; // references bookings.id
    amount: number;
    payment_method: string;
    status: string;
    description: string;
    transaction_id: string | null;
  };
  
  payment_methods: {
    id: string;
    user_id: string | null; // references profiles.id
    type: string;
    name: string;
    details: Record<string, any>;
    is_default: boolean | null;
  };
  
  wallet_verification_requests: {
    id: string;
    booking_id: string; // references bookings.id
    customer_id: string; // references profiles.id
    provider_id: string; // references profiles.id
    amount: number;
    payment_method: string;
    reference_number: string;
    customer_phone: string;
    provider_phone: string | null;
    verification_status: WalletVerificationStatus;
    date_submitted: string;
    date_verified: string | null;
    verified_by: string | null;
    customer_confirmed: boolean;
    provider_confirmed: boolean;
    admin_verified: boolean;
    proof_type: string;
    receipt_image: string | null;
    mobile_operator: NamibianMobileOperator | null;
    bank_used: NamibianBank | null;
    rejection_reason: string | null;
    notes: string | null;
  };
  
  // Reviews and feedback
  reviews: {
    id: string;
    service_id: string; // references services.id
    booking_id: string | null; // references bookings.id
    customer_id: string; // references profiles.id
    provider_id: string; // references profiles.id
    rating: number;
    comment: string | null;
    response: string | null;
    is_published: boolean | null;
  };
  
  // User preferences and settings
  favorite_services: {
    id: string;
    user_id: string | null; // references profiles.id
    service_id: string; // references services.id
  };
  
  user_addresses: {
    id: string;
    user_id: string | null; // references profiles.id
    name: string;
    street: string;
    city: string;
    region: string | null;
    postal_code: string | null;
    country: string;
    is_default: boolean | null;
  };
  
  // Security and authentication
  user_2fa: {
    id: string;
    user_id: string | null; // references profiles.id
    is_enabled: boolean | null;
    secret: string | null;
    backup_codes: string[] | null;
  };
  
  // Support and communication
  disputes: {
    id: string;
    booking_id: string | null; // references bookings.id
    customer_id: string | null; // references profiles.id
    provider_id: string | null; // references profiles.id
    subject: string;
    description: string;
    status: string | null;
    resolution: string | null;
    admin_notes: string | null;
  };
  
  // Messaging
  conversations: {
    id: string;
    last_message: string | null;
    last_message_date: string | null;
    unread_count: number | null;
  };
  
  conversation_participants: {
    id: string;
    conversation_id: string; // references conversations.id
    user_id: string; // references profiles.id
  };
  
  messages: {
    id: string;
    conversation_id: string | null; // references conversations.id
    sender_id: string | null; // references profiles.id
    recipient_id: string | null; // references profiles.id
    content: string;
    read: boolean | null;
    attachments: string[] | null;
  };
  
  // Subscription and billing
  subscription_plans: {
    id: string;
    name: string;
    description: string;
    price: number;
    billing_cycle: string;
    features: Record<string, any>;
    credits: number;
    max_bookings: number;
    is_active: boolean | null;
    is_popular: boolean | null;
  };
  
  user_subscriptions: {
    id: string;
    user_id: string; // references profiles.id
    subscription_plan_id: string; // references subscription_plans.id
    status: string;
    start_date: string;
    end_date: string;
    payment_method: string;
    payment_id: string | null;
  };
  
  subscription_transactions: {
    id: string;
    user_id: string; // references profiles.id
    subscription_plan_id: string; // references subscription_plans.id
    amount: number;
    payment_method: string;
    status: string;
    payment_id: string | null;
  };
  
  // Additional custom data
  payment_transactions: {
    id: string;
    user_id: string;
    amount: number;
    currency: string;
    gateway: string;
    method: string;
    reference: string;
    status: string;
    description: string;
    metadata: Record<string, any>;
    gateway_response: Record<string, any> | null;
  };
}

// Entity Relationship Summary
export const EntityRelationships = {
  profiles: {
    hasOne: ['service_providers'],
    hasMany: [
      'bookings (as customer)',
      'payment_history',
      'payment_methods',
      'user_addresses',
      'user_2fa',
      'favorite_services',
      'disputes',
      'user_subscriptions',
      'subscription_transactions'
    ]
  },
  service_providers: {
    belongsTo: ['profiles'],
    hasMany: ['services', 'bookings (as provider)']
  },
  services: {
    belongsTo: ['service_providers', 'service_categories'],
    hasMany: ['bookings', 'reviews', 'favorite_services']
  },
  bookings: {
    belongsTo: ['services', 'profiles (as customer)', 'service_providers (as provider)'],
    hasMany: ['payment_history', 'disputes', 'wallet_verification_requests']
  },
  reviews: {
    belongsTo: ['services', 'bookings', 'profiles (as customer)', 'service_providers (as provider)']
  },
  conversations: {
    hasMany: ['conversation_participants', 'messages']
  },
  conversation_participants: {
    belongsTo: ['conversations', 'profiles']
  },
  messages: {
    belongsTo: ['conversations', 'profiles (as sender)', 'profiles (as recipient)']
  },
  subscription_plans: {
    hasMany: ['user_subscriptions', 'subscription_transactions']
  }
};
