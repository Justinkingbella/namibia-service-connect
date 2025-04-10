
import { Json } from "./schema";
import { WalletPaymentType as SchemaWalletPaymentType, WalletVerificationStatus as SchemaWalletVerificationStatus } from "./schema";

// Use the schema types directly to avoid conflicts
export type WalletVerificationStatus = SchemaWalletVerificationStatus;
export type WalletPaymentType = SchemaWalletPaymentType;

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  isVerified: boolean;
  verificationStatus: WalletVerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  description?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface NamibianMobileOperator {
  id: string;
  name: string;
  code: string;
  active: boolean;
}

export interface NamibianBank {
  id: string;
  name: string;
  code: string;
  active: boolean;
}

// Updated WalletVerification interface to match the fields used in components
export interface WalletVerification {
  id: string;
  user_id: string;
  verificationStatus?: WalletVerificationStatus;
  date?: string;
  reference?: string;
  method?: WalletPaymentType;
  amount: number;
  provider_id?: string;
  customer_id?: string;
  booking_id?: string;
  paymentMethod?: WalletPaymentType;
  customerPhone?: string;
  providerPhone?: string;
  referenceNumber?: string;
  dateSubmitted?: string;
  dateVerified?: string | null;
  rejectionReason?: string;
  notes?: string;
  receiptImage?: string;
  mobileOperator?: string;
  bankUsed?: string;
  customerConfirmed?: boolean;
  providerConfirmed?: boolean;
  adminVerified?: boolean;
  adminComments?: Json;
  walletNumber?: string;
  paymentPurpose?: string;
  walletName?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  transactionReference?: string;
  walletProvider?: string;
  userType?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewDate?: string;
}

// WalletVerificationRequest interface with all needed fields
export interface WalletVerificationRequest {
  id: string;
  booking_id?: string;
  customer_id?: string;
  provider_id?: string;
  amount: number;
  date_submitted?: string;
  date_verified?: string;
  verified_by?: string;
  verification_status?: WalletVerificationStatus;
  payment_method?: WalletPaymentType;
  reference_number?: string;
  customer_phone?: string;
  provider_phone?: string;
  rejection_reason?: string;
  customer_confirmed?: boolean;
  provider_confirmed?: boolean;
  admin_verified?: boolean;
  admin_comments?: Json;
  created_at?: string;
  updated_at?: string;
  proof_type?: string;
  mobile_operator?: string;
  bank_used?: string;
  receipt_image?: string;
  notes?: string;
  // Additional fields used in components
  walletNumber?: string;
  walletName?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  transactionReference?: string;
  walletProvider?: string;
  userType?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewDate?: string;
  status?: WalletVerificationStatus;
  paymentPurpose?: string;
}

// Updated PaymentHistory type to include date field
export interface PaymentHistory {
  id: string;
  userId: string;
  bookingId?: string;
  amount: number;
  description: string;
  createdAt: string; // Use string instead of Date
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type: string;
  reference: string;
  paymentMethod: string;
  transactionId: string;
  date?: string; // Added date field that was missing
}
