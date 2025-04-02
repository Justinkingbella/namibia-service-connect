
// Define types for wallet verification and payment methods
export type WalletVerificationStatus = 'pending' | 'submitted' | 'verified' | 'rejected' | 'expired';
export type NamibianMobileOperator = 'MTC' | 'TN Mobile';
export type NamibianBank = 'NED BANK' | 'FNB' | 'Bank Windhoek' | 'Standard Bank';
export type PaymentMethod = 'pay_today' | 'pay_fast' | 'e_wallet' | 'easy_wallet' | 'bank_transfer' | 'cash' | 'dop';

export interface WalletVerification {
  id: string;
  transactionId?: string;
  bookingId: string;
  customerId?: string;
  providerId?: string;
  amount: number;
  paymentMethod: 'e_wallet' | 'easy_wallet';
  referenceNumber: string;
  customerPhone: string;
  providerPhone?: string;
  dateSubmitted: Date;
  verificationStatus: WalletVerificationStatus;
  dateVerified?: Date;
  verifiedBy?: string;
  notes?: string;
  customerConfirmed: boolean;
  providerConfirmed: boolean;
  adminVerified: boolean;
  proofType: 'receipt' | 'screenshot' | 'reference';
  receiptImage?: string;
  mobileOperator?: NamibianMobileOperator;
  bankUsed?: NamibianBank;
  rejectionReason?: string;
}

export interface Transaction {
  id: string;
  bookingId: string;
  amount: number;
  fee: number;
  net: number;
  paymentMethod: string;
  status: string;
  date: Date;
  description: string;
  reference?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  lastUpdated: Date;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  fee: number;
  netAmount: number;
  transactionType: 'subscription' | 'booking' | 'payout' | string;
  paymentMethod: string;
  referenceId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderEarnings {
  id: string;
  providerId: string;
  periodStart: string;
  periodEnd: string;
  totalEarnings: number;
  totalBookings: number;
  commissionPaid: number;
  netEarnings: number;
  payoutStatus: 'pending' | 'processing' | 'completed' | 'failed';
  payoutDate?: string;
  payoutReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderPayout {
  id: string;
  providerId: string;
  amount: number;
  fee: number;
  netAmount: number;
  paymentMethod: string;
  bankAccountDetails?: Record<string, any>;
  mobilePaymentDetails?: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedAt?: string;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Additional types needed for the hooks
export interface PaymentHistory {
  id: string;
  transactionType: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  date: string;
  paymentMethod: string;
  description: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  status: 'open' | 'under_review' | 'resolved' | 'declined';
  reason: string;
  description: string;
  evidenceUrls: string[];
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}
