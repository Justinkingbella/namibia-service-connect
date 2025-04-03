
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
