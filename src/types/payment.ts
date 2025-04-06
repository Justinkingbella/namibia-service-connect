
import { WalletVerificationStatus, WalletPaymentType } from './schema';

export interface WalletVerification {
  id: string;
  status: WalletVerificationStatus;
  amount: number;
  date: string;
  reference: string;
  method: WalletPaymentType;
  user_id: string;
  receipt?: string;
  
  // Additional properties being used in components
  verificationStatus?: WalletVerificationStatus;
  bookingId?: string;
  customerId?: string;
  providerId?: string;
  paymentMethod?: WalletPaymentType;
  referenceNumber?: string;
  customerPhone?: string;
  providerPhone?: string;
  dateSubmitted?: string;
  dateVerified?: string;
  notes?: string;
  customerConfirmed?: boolean;
  providerConfirmed?: boolean;
  adminVerified?: boolean;
  proofType?: 'receipt' | 'screenshot' | 'reference' | '';
  receiptImage?: string;
  mobileOperator?: string;
  bankUsed?: string;
  rejectionReason?: string;
  verifiedBy?: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  is_verified: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  description?: string;
  reference?: string;
}

// Re-export types from schema to ensure backward compatibility
export { WalletPaymentType, WalletVerificationStatus } from './schema';
