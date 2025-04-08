
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
  status: WalletVerificationStatus;
  date: string;
  reference: string;
  method: WalletPaymentType;
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
  verificationStatus?: WalletVerificationStatus;
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
}

// Separate interface to represent the wallet verification request from the database
export interface WalletVerificationRequest {
  id: string;
  booking_id: string;
  customer_id: string;
  provider_id: string;
  amount: number;
  payment_method: WalletPaymentType;
  reference_number: string;
  customer_phone: string;
  provider_phone?: string;
  proof_type?: string;
  mobile_operator?: string;
  bank_used?: string;
  receipt_image?: string;
  notes?: string;
  date_submitted: string;
  date_verified?: string;
  verified_by?: string;
  customer_confirmed: boolean;
  provider_confirmed: boolean;
  admin_verified: boolean;
  verification_status: WalletVerificationStatus;
  rejection_reason?: string;
  admin_comments: Json;
  created_at: string;
  updated_at: string;
  // Add any missing fields used by the wallet service
  walletNumber?: string;
  transactionReference?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  walletProvider?: string;
  userType?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewDate?: string;
  walletName?: string;
  currency?: string;
  paymentPurpose?: string;
  status?: string;
}

export interface WalletVerificationFilters {
  status?: WalletVerificationStatus;
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
  userId?: string;
  // Add additional fields used in filtering
  walletProvider?: string;
  userType?: string;
  searchTerm?: string;
}

export interface WalletVerificationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  expired?: number;
  averageProcessingTime?: string;
  // Fields used in service
  totalPending?: number;
  totalApproved?: number;
  totalRejected?: number;
  totalExpired?: number;
  totalAmountPending?: number;
  totalAmountProcessed?: number;
}

export interface WalletVerificationComment {
  id: string;
  verification_id?: string;
  verificationId?: string;
  content: string;
  createdAt?: string;
  created_at?: string;
  userId?: string;
  userName?: string;
  userRole?: string;
}

export interface WalletProviderSettings {
  id: string;
  providerName?: string;
  provider_id?: string;
  apiKey?: string;
  secretKey?: string;
  endpoint?: string;
  isActive: boolean;
  processingFee: number;
  processingFeeType?: string;
  // Additional fields used
  displayName?: string;
  isEnabled?: boolean;
  processingTime?: string;
  updatedAt: string;
  currency?: string;
}
