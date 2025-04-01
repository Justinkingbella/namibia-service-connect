
// Define types for wallet verification and payment methods
export type WalletVerificationStatus = 'pending' | 'submitted' | 'verified' | 'rejected' | 'expired';
export type NamibianMobileOperator = 'MTC' | 'TN Mobile';
export type NamibianBank = 'NED BANK' | 'FNB' | 'Bank Windhoek' | 'Standard Bank';

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
