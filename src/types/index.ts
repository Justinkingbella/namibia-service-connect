
// Export base types but exclude those with name conflicts
export * from './subscription';

// Export booking types (excluding ones that will be renamed)
export type { 
  BookingStatus, 
  PaymentStatus, 
  Booking, 
  BookingWithDetails,
  Dispute,
  Withdrawal,
  WalletVerificationRequest
} from './booking';

// Export payment types
export * from './payments';

// Re-export Auth types
export type { 
  DbUserProfile, 
  DbProviderProfile,
  UserRole, 
  ProviderVerificationStatus, 
  User,
  Customer,
  Provider,
  Admin,
  AuthContextType,
  SubscriptionTier,
  UserAddress
} from './auth';

// Export wallet verification types
export type {
  WalletVerificationStatus,
  NamibianMobileOperator,
  NamibianBank,
  WalletVerification,
  Wallet,
  Transaction
} from './payment';

// Explicitly re-export types with different names to resolve ambiguities
export type { PaymentMethod as ServicePaymentMethod } from './service';
export type { PaymentMethod as PaymentPaymentMethod } from './payment';
export type { Transaction as PaymentTransaction } from './payment';
export type { Transaction as BookingTransaction } from './booking';
export type { ServiceCategory, PricingModel, ServiceListItem, Service } from './service';

export interface IResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Export conversation and message types
export type { Conversation, Message } from './conversations';
