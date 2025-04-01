
export * from './service';
export * from './booking';
export * from './payment';
export * from './subscription';

// Re-export Auth but exclude SubscriptionTier to avoid name conflicts
export type { User, UserRole, ProviderVerificationStatus, Customer, Provider, Admin, AuthContextType } from './auth';

// Re-export Transaction from payment and booking with explicit naming to resolve ambiguity
export { Transaction as PaymentTransaction } from './payment';
export { Transaction as BookingTransaction } from './booking';

export interface IResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
