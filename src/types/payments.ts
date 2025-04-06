
export type PaymentMethodType = 'credit_card' | 'debit_card' | 'bank_transfer' | 'e_wallet' | 'cash' | 'mobile_money';

export interface PaymentMethod {
  id: string;
  userId: string;
  name: string;
  type: PaymentMethodType;
  details: Record<string, any>;
  isDefault: boolean;
  createdAt: Date;
}

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'canceled'
  | 'partially_refunded';

export type WalletPaymentType = 
  | 'e_wallet'
  | 'easy_wallet'
  | 'mobile_money'
  | 'bank_transfer'
  | 'credit_card'
  | 'debit_card';

export interface PaymentRecord {
  id: string;
  userId: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethodType;
  paymentDate: string;
  transactionId: string;
  receiptUrl?: string;
  metadata?: any;
}

export interface WalletVerification {
  id: string;
  user_id: string;
  booking_id: string;
  status: 'pending' | 'verified' | 'rejected';
  date: string;
  amount: number;
  reference: string;
  method: WalletPaymentType;
  screenshot_url?: string;
  receipt_url?: string;
  notes?: string;
  rejection_reason?: string;
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
  providerPhone: string;
  screenshotUrl?: string;
  receiptUrl?: string;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  submittedAt: string;
  verifiedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}
