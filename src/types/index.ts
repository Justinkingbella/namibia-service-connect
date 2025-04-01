
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

// Re-export Auth but exclude SubscriptionTier to avoid name conflicts
export type { User, UserRole, ProviderVerificationStatus, Customer, Provider, Admin, AuthContextType } from './auth';

// Explicitly re-export types with different names to resolve ambiguities
export type { PaymentMethod as ServicePaymentMethod } from './service';
export type { PaymentMethod as PaymentPaymentMethod } from './payment';
export type { Transaction as PaymentTransaction } from './payment';
export type { Transaction as BookingTransaction } from './booking';
export type { ServiceCategory, PricingModel, ServiceListItem, Service } from './service';
export type { 
  WalletVerificationStatus, 
  NamibianMobileOperator, 
  NamibianBank, 
  WalletVerification, 
  Wallet 
} from './payment';

export interface IResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
