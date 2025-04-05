
export type WalletVerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired';

export interface WalletVerification {
  id: string;
  status: WalletVerificationStatus;
  amount: number;
  date: Date;
  reference: string;
  method: string;
  user_id: string;
  receipt?: string;
}

export type NamibianMobileOperator = 'mtn' | 'telecom' | 'other';

export type NamibianBank = 'bank_windhoek' | 'standard_bank' | 'fnb_namibia' | 'nedbank_namibia' | 'other';

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  is_verified: boolean;
  created_at: string;
}

export type WalletPaymentType = 'mobile_money' | 'bank_transfer' | 'cash';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  description?: string;
  reference?: string;
}
