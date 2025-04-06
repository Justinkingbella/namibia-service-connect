
// Export base types but exclude those with name conflicts
export type { SubscriptionTierType } from './schema';

// Export booking types
export type { Booking, BookingWithDetails, BookingData, Dispute, Withdrawal } from './booking';
export { DisputeStatus, DisputePriority } from './booking';
export type { Transaction as BookingTransaction } from './booking';

// Export types from schema
export type { 
  BookingStatus, 
  PaymentStatus,
  PaymentMethodType
} from './schema';

// Export payment types
export type {
  PaymentMethod,
  PaymentRecord,
  PaymentHistory,
  ProviderEarnings,
  ProviderPayout
} from './payments';

export type {
  WalletVerification,
  WalletVerificationRequest,
  NamibianMobileOperator,
  NamibianBank
} from './payment';

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

export interface IResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Export conversation and message types
export type { Conversation, Message } from './conversations';

// Export wallet types from wallet.ts
export type {
  WalletVerificationRequest as WalletVerificationRequestDetail,
  WalletVerificationFilters,
  WalletVerificationStats,
  WalletVerificationComment,
  WalletProviderSettings,
  WalletVerificationDashboard,
  WalletVerificationSummary,
  VerificationAction,
  WalletVerificationReport,
  VerificationStatus,
  WalletProvider,
  UserType
} from './wallet';
