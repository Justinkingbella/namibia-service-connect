
import { Json } from './schema';
import { PaymentMethodType } from './schema';

export interface PaymentMethod {
  id: string;
  userId: string;
  name: string;
  type: PaymentMethodType;
  details: Record<string, any>;
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  bookingId?: string;
  amount: number;
  description: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type: string;
  reference: string;
  paymentMethod?: string;
  transactionId?: string;
}

export interface PaymentHistory {
  id: string;
  userId: string;
  bookingId?: string;
  amount: number;
  description: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type: string;
  reference: string;
  paymentMethod: string;
  transactionId: string;
  date?: string; // Added date field for compatibility
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
  payoutStatus: string;
  payoutDate: string;
  payoutReference: string;
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
  status: string;
  reference: string;
  bankDetails?: Record<string, any>;
  mobilePaymentDetails?: Record<string, any>;
  notes?: string;
  processedAt: string;
  createdAt: string;
  updatedAt: string;
}
