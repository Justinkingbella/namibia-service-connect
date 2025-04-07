
import { Json } from './schema';

// Export this type to fix WalletPaymentType not being exported
export type WalletPaymentType = 'e_wallet' | 'easy_wallet' | 'bank_transfer';
export type WalletVerificationStatus = 'pending' | 'submitted' | 'verified' | 'rejected' | 'expired';

export interface WalletVerification {
  id: string;
  status: WalletVerificationStatus;
  date: string;
  amount: number;
  reference: string;
  method: WalletPaymentType;
  user_id: string;
  receipts?: string[];
  
  // Add all the properties being used in components
  bookingId?: string;
  customerId?: string;
  providerId?: string;
  verificationStatus?: WalletVerificationStatus;
  dateSubmitted?: string | Date;
  dateVerified?: string | Date;
  customerPhone?: string;
  providerPhone?: string;
  referenceNumber?: string;
  paymentMethod?: WalletPaymentType;
  customerConfirmed?: boolean;
  providerConfirmed?: boolean;
  adminVerified?: boolean;
  verifiedBy?: string;
  adminComments?: any[];
  mobileOperator?: string;
  bank?: string;
  proofType?: string;
  receiptImage?: string;
  notes?: string;
  rejectionReason?: string;
}

export interface WalletVerificationRequest {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  amount: number;
  paymentMethod: WalletPaymentType;
  referenceNumber: string;
  customerPhone: string;
  providerPhone?: string;
  mobileOperator?: string;
  bank?: string;
  status: WalletVerificationStatus;
  dateSubmitted: string;
  dateVerified?: string;
  verifiedBy?: string;
  customerConfirmed: boolean;
  providerConfirmed: boolean;
  adminVerified: boolean;
  adminComments?: any[];
  proofType?: string;
  receiptImage?: string;
  notes?: string;
  rejectionReason?: string;
  // Add missing properties used in WalletService
  userId?: string;
  walletProvider?: string;
  userType?: string;
  userName?: string;
  userEmail?: string;
  walletNumber?: string;
  transactionReference?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewDate?: string;
}

export interface NamibianMobileOperator {
  id: string;
  name: string;
  logo: string;
  isActive: boolean;
}

export interface NamibianBank {
  id: string;
  name: string;
  logo: string;
  isActive: boolean;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  isVerified: boolean;
}

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  transactionType: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'refund';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  referenceId?: string;
  createdAt: string;
}

export interface PaymentMethodType {
  id: string;
  name: string;
  type: string;
}
