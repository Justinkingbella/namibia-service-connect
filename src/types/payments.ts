
// Use export type for interfaces to prevent TS1205 error
export type PaymentTransaction = {
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
};

// Add missing types
export type PaymentMethod = {
  id: string;
  userId: string;
  name: string;
  type: string;
  details: Record<string, any>;
  isDefault: boolean;
  createdAt: Date;
};

// Add PaymentHistory type
export type PaymentHistory = {
  id: string;
  userId: string;
  amount: number;
  description: string;
  date: Date;
  status: string;
  type: string;
  reference?: string;
};

// Add new types
export type ProviderEarnings = {
  id: string;
  providerId: string;
  periodStart: Date;
  periodEnd: Date;
  totalEarnings: number;
  totalBookings: number;
  commissionPaid: number;
  netEarnings: number;
  payoutStatus: string;
  payoutDate?: Date;
  payoutReference?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProviderPayout = {
  id: string;
  providerId: string;
  amount: number;
  fee: number;
  netAmount: number;
  paymentMethod: string;
  status: string;
  reference?: string;
  bankDetails?: Record<string, any>;
  mobilePaymentDetails?: Record<string, any>;
  notes?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

// Re-export the Dispute type
export type { Dispute } from './booking';
