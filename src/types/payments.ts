
export interface PaymentTransaction {
  id: string;
  userId: string;
  bookingId?: string;
  amount: number;
  fee: number;
  netAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  method: string;
  gateway: string;
  reference: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  // Additional properties needed
  transactionType?: string;
  paymentMethod?: string;
  referenceId?: string;
}

export interface ProviderEarnings {
  id: string;
  providerId: string;
  periodStart: Date;
  periodEnd: Date;
  totalEarnings: number;
  commissionPaid: number;
  netEarnings: number;
  totalBookings: number;
  payoutStatus: 'pending' | 'processing' | 'completed';
  payoutDate?: Date;
  payoutReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderPayout {
  id: string;
  providerId: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: string;
  referenceNumber?: string;
  bankAccountDetails?: Record<string, any>;
  mobilePaymentDetails?: Record<string, any>;
  processedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentHistory {
  id: string;
  userId: string;
  bookingId?: string;
  amount: number;
  description: string;
  transactionId?: string;
  status: string;
  paymentMethod: string;
  createdAt: Date;
}
