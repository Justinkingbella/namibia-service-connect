
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
  WalletVerificationStatus,
  NamibianMobileOperator,
  NamibianBank,
  WalletVerification,
  Wallet,
  WalletPaymentType,
  Transaction as WalletTransaction
} from './payment';

// Explicitly re-export types with different names to resolve ambiguities
export { ServiceCategoryEnum } from './service';
export type { 
  ServiceCategory, 
  PricingModel, 
  ServiceListItem, 
  Service,
  ServiceData,
  FavoriteService,
  ServicePaymentMethod,
  PaymentMethod
} from './service';
export type { Transaction as BookingTransaction } from './booking';
export type { ProviderEarnings as SubProviderEarnings } from './subscription';

export interface IResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Export conversation and message types
export type { Conversation, Message } from './conversations';
