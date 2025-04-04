
export interface PaymentMethod {
  id: string;
  user_id: string;
  type: string;
  name: string;
  details: any;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  date: Date;
  status: string;
  type: string;
  reference: string;
}

export type WalletVerificationStatus = 'pending' | 'submitted' | 'verified' | 'rejected' | 'expired';
export type NamibianMobileOperator = 'MTC' | 'TN Mobile' | 'Other';
export type NamibianBank = 'Bank Windhoek' | 'First National Bank' | 'Standard Bank' | 'Nedbank' | 'Other';

export interface WalletVerification {
  id: string;
  bookingId: string;
  customerId?: string;
  providerId?: string;
  amount: number;
  paymentMethod: string;
  referenceNumber: string;
  customerPhone: string;
  providerPhone?: string;
  dateSubmitted: Date;
  dateVerified?: Date;
  verificationStatus: WalletVerificationStatus;
  customerConfirmed: boolean;
  providerConfirmed: boolean;
  adminVerified: boolean;
  notes?: string;
  rejectionReason?: string;
  proofType?: string;
  receiptImage?: string;
  mobileOperator?: NamibianMobileOperator;
  bankUsed?: NamibianBank;
  verifiedBy?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  isVerified: boolean;
  verificationStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
