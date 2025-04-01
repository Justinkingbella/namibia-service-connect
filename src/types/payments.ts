
import { PaymentMethod } from '@/types/payment';

export interface PaymentHistory {
  id: string;
  userId: string;
  bookingId?: string;
  amount: number;
  description: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded' | string;
  transactionId?: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  subject: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected' | string;
  resolution?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethodType = 'credit_card' | 'e_wallet' | 'bank_transfer' | string;
