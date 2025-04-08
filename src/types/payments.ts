
import { Json } from './schema';
import { PaymentMethodType } from './schema';

export interface PaymentMethod {
  id: string;
  userId: string;
  name: string;
  type: PaymentMethodType;
  details: Record<string, any>; // Changed from Json to Record<string, any>
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
  createdAt: string; // Use string instead of Date
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type: string;
  reference: string;
  paymentMethod: string;
  transactionId: string;
}

export interface ProviderEarnings {
  id: string;
  providerId: string;
  periodStart: string; // Use string instead of Date
  periodEnd: string; // Use string instead of Date
  totalEarnings: number;
  totalBookings: number;
  commissionPaid: number;
  netEarnings: number;
  payoutStatus: string;
  payoutDate: string; // Use string instead of Date
  payoutReference: string;
  createdAt: string; // Use string instead of Date
  updatedAt: string; // Use string instead of Date
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
  processedAt: string; // Use string instead of Date
  createdAt: string; // Use string instead of Date
  updatedAt: string; // Use string instead of Date
}
