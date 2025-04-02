
import { PaymentMethod } from '@/types/payment';

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
