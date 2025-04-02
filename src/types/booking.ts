
export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export type DisputeStatus = 
  | 'open' 
  | 'under_review' 
  | 'resolved' 
  | 'declined';

export interface Dispute {
  id: string;
  bookingId?: string;
  customerId?: string;
  providerId?: string;
  status: DisputeStatus;
  reason: string;
  subject?: string;
  description: string;
  evidenceUrls?: string[];
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  providerId: string;
  status: BookingStatus;
  date: Date;
  startTime: string;
  endTime?: string;
  duration: number;
  totalAmount: number;
  commission: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  notes?: string;
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingWithDetails extends Booking {
  serviceName: string;
  serviceImage: string;
  providerName?: string;
  customerName?: string;
}

export interface Withdrawal {
  id: string;
  providerId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  paymentMethod: string;
  paymentDetails: Record<string, any>;
  requestedAt: Date;
  processedAt?: Date;
  notes?: string;
}

export interface WalletVerificationRequest {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  amount: number;
  status: 'pending' | 'verified' | 'rejected';
  paymentMethod: string;
  referenceNumber: string;
  dateSubmitted: Date;
  dateVerified?: Date;
  verifiedBy?: string;
  notes?: string;
  receiptImage?: string;
}

export interface Transaction {
  id: string;
  bookingId?: string;
  userId: string;
  type: 'payment' | 'refund' | 'payout' | 'commission';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  createdAt: Date;
}
