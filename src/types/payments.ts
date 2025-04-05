
// Define Payment Method types to avoid confusion with other types
export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer' | 'crypto' | 'cash' | 'mobile_money' | 'wallet';

export interface PaymentProvider {
  id: string;
  name: string;
  type: PaymentMethod;
  isActive: boolean;
  config: Record<string, any>;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  userId: string;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  reference: string;
  description?: string;
}

// Add missing payment history type
export interface PaymentHistory {
  id: string;
  userId: string;
  amount: number;
  description: string;
  date: Date;
  status: string;
  type: string;
  reference: string;
}

// Add missing provider earnings type
export interface ProviderEarnings {
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
}

// Add missing provider payout type
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
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
