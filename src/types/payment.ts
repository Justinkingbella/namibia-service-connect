
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
  walletNumber?: string; // Additional field used in forms
  paymentPurpose?: string; // Additional field used in forms
  walletName?: string; // Additional field used in forms
  userId?: string; // Additional field for referencing the user
  userName?: string; // For displaying user names
  userEmail?: string; // For contacting users
  transactionReference?: string; // For tracking transactions
  walletProvider?: string; // For wallet provider information
  userType?: string; // To distinguish between customer and provider
  reviewerId?: string; // For tracking who reviewed the verification
  reviewerName?: string; // For displaying reviewer names
  reviewDate?: string; // When the review happened
  status?: string; // Additional status information
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
