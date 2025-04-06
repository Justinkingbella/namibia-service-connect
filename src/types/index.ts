
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
  Withdrawal
} from './booking';

// Export payment types
export type {
  PaymentMethod,
  PaymentRecord,
  WalletVerification,
  WalletVerificationRequest,
  PaymentHistory,
  ProviderEarnings,
  ProviderPayout
} from './payments';

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
  UserAddress,
  AuthContextType
} from './auth';
export { SubscriptionTier } from './auth';

// Export wallet verification types
export type {
  WalletVerificationStatus,
  WalletPaymentType
} from './schema';
export type {
  Wallet,
  Transaction as WalletTransaction
} from './payment';

// Export schema types
export type { Json } from './schema';

// Explicitly re-export types from service
export { ServiceCategoryEnum, PricingModelEnum } from './service';
export type { 
  ServiceCategory, 
  PricingModel, 
  ServiceListItem, 
  Service,
  ServiceData,
  FavoriteService
} from './service';

// Explicitly export service payment method
export type { ServicePaymentMethod } from './service';

// Export transaction from booking
export type { Transaction as BookingTransaction } from './booking';

export interface IResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Export conversation and message types
export type { Conversation, Message } from './conversations';
