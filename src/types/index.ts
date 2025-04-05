
// Export base types but exclude those with name conflicts
export * from './subscription';

// Export booking types
export type { 
  BookingStatus, 
  PaymentStatus, 
  Booking, 
  BookingWithDetails,
  BookingData,
  Dispute,
  DisputeStatus,
  DisputePriority,
  Withdrawal,
  WalletVerification,
  WalletVerificationStatus
} from './booking';

// Export payment types
export * from './payments';

// Re-export Auth types
export type { 
  DbUserProfile, 
  DbProviderProfile,
  DbCustomerProfile,
  UserRole, 
  ProviderVerificationStatus, 
  User,
  Customer,
  Provider,
  Admin,
  Session,
  SubscriptionTier,
  UserAddress,
  AuthContextType
} from './auth';

// Export wallet verification types
export type {
  WalletPaymentType,
  PaymentMethod as PaymentPaymentMethod,
  Transaction as PaymentTransaction
} from './payment';

// Explicitly re-export types with different names to resolve ambiguities
export type { PaymentMethod as ServicePaymentMethod } from './service';
export type { Transaction as BookingTransaction } from './booking';
export type { 
  ServiceCategory, 
  ServiceCategoryEnum,
  PricingModel, 
  ServiceListItem, 
  Service,
  ServiceData,
  FavoriteService
} from './service';

export interface IResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Export conversation and message types
export type { Conversation, Message } from './conversations';

// Export provider earnings from subscription separately to avoid naming conflicts
export { ProviderEarnings as SubscriptionProviderEarnings } from './subscription';
