
// Fix the re-exporting issues with isolatedModules enabled
// Export base types but exclude those with name conflicts
export type { SubscriptionTierType } from './schema';

// Export booking types with proper 'export type' syntax
export type { Booking, BookingWithDetails, BookingData, Dispute, Withdrawal } from './booking';
export { DisputeStatus, DisputePriority } from './booking';
export type { Transaction as BookingTransaction } from './booking';

// Export types from schema
export type { 
  BookingStatus, 
  PaymentStatus,
  PaymentMethodType,
  WalletPaymentType,
  WalletVerificationStatus
} from './schema';

// Export payment types
export type {
  PaymentMethod,
  PaymentRecord,
  PaymentHistory,
  ProviderEarnings,
  ProviderPayout
} from './payments';

// Export wallet types
export type {
  WalletVerification,
  WalletVerificationRequest,
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
  UserType,
  Wallet,
  Transaction
} from './wallet';

// Export Auth types
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

// Export schema types
export type { Json } from './schema';

// Explicitly re-export types from service
export type { 
  ServiceCategory, 
  PricingModel, 
  ServiceListItem, 
  Service,
  ServiceData,
  FavoriteService
} from './service';
export { ServiceCategoryEnum, PricingModelEnum } from './service';

export interface IResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Export conversation and message types
export type { Conversation, Message } from './conversations';
