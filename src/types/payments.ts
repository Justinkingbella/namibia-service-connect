
export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  fee: number;
  netAmount: number;
  currency: string;
  method: string;
  gateway: string;
  reference: string;
  referenceId?: string;
  transactionType: string;
  paymentMethod?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  description: string;
  metadata: Record<string, any>;
  gatewayResponse?: Record<string, any>;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProviderEarnings {
  id: string;
  providerId: string;
  periodStart: string | Date;
  periodEnd: string | Date;
  totalEarnings: number;
  totalBookings: number;
  commissionPaid: number;
  netEarnings: number;
  payoutStatus: 'pending' | 'processing' | 'completed';
  createdAt: string | Date;
  updatedAt: string | Date;
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
  notes?: string;
  processedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Re-export the Dispute type from booking since it's used in payments context too
export { Dispute } from './booking';
