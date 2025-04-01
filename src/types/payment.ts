
export type WalletVerificationStatus = 
  | 'pending'
  | 'submitted'
  | 'verified'
  | 'rejected'
  | 'expired';

export type NamibianBank =
  | 'NED BANK'
  | 'FNB'
  | 'Bank Windhoek'
  | 'Standard Bank';

export type NamibianMobileOperator =
  | 'MTC'
  | 'TN Mobile';

export interface WalletVerification {
  id: string;
  transactionId: string;
  bookingId: string;
  paymentMethod: 'e_wallet' | 'easy_wallet';
  amount: number;
  referenceNumber: string;
  customerPhone: string;
  providerPhone: string;
  dateSubmitted: Date;
  dateVerified?: Date;
  verificationStatus: WalletVerificationStatus;
  verifiedBy?: string;
  notes?: string;
  customerConfirmed: boolean;
  providerConfirmed: boolean;
  adminVerified: boolean;
  receiptImage?: string;
  proofType: 'receipt' | 'screenshot' | 'reference';
  mobileOperator?: NamibianMobileOperator;
  bankUsed?: NamibianBank;
}

export interface WalletTransaction {
  id: string;
  walletType: 'e_wallet' | 'easy_wallet';
  referenceNumber: string;
  amount: number;
  senderPhone: string;
  receiverPhone: string;
  status: 'pending' | 'completed' | 'failed' | 'disputed';
  transactionDate: Date;
  description?: string;
  mobileOperator?: NamibianMobileOperator;
  bankUsed?: NamibianBank;
}

// Export PaymentMethod directly
export type { PaymentMethod } from './service';
