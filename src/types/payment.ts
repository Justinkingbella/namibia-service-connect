
import { PaymentMethod } from './service';

export type WalletVerificationStatus = 
  | 'pending'
  | 'submitted'
  | 'verified'
  | 'rejected'
  | 'expired';

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
}

// Export PaymentMethod directly
export { PaymentMethod } from './service';
