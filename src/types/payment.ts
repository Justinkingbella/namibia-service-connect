
import { Json } from "./schema";
import { PaymentMethodType, WalletPaymentType, WalletVerificationStatus } from "./schema";

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
