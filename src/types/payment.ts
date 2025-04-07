
import { Json, WalletPaymentType, WalletVerificationStatus } from './schema';

export interface WalletVerification {
  id: string;
  status: WalletVerificationStatus;
  date: string;
  amount: number;
  reference: string;
  method: WalletPaymentType;
  user_id: string;
  receipts?: string[];
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
