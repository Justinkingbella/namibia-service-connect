
export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'disputed' 
  | 'no_show'
  | 'rescheduled'
  | 'rejected';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partial' | 'completed';

export type DisputeStatus = 'pending' | 'in_review' | 'resolved' | 'rejected';
export type DisputePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Booking {
  id: string;
  service_id: string;
  customer_id: string;
  provider_id: string;
  date: string;
  start_time: string;
  end_time?: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  total_amount: number;
  commission: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  is_urgent?: boolean;
}

export interface BookingData extends Booking {
  customer_notes?: string;
  provider_notes?: string;
  cancellation_reason?: string;
  cancellation_date?: string;
  cancelled_by?: string;
  duration?: number;
  rating?: number;
  feedback?: string;
  refund_amount?: number;
  payment_receipt?: string;
  // Additional properties for UI display
  serviceName?: string;
  serviceImage?: string;
  providerName?: string;
  customerName?: string;
}

export interface BookingWithDetails {
  id: string;
  serviceId: string;
  customerId: string;
  providerId: string;
  date: string;
  startTime: string;
  endTime?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  totalAmount: number;
  commission: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  isUrgent?: boolean;
  customerNotes?: string;
  providerNotes?: string;
  cancellationReason?: string;
  cancellationDate?: Date;
  cancelledBy?: string;
  duration?: number;
  rating?: number;
  feedback?: string;
  refundAmount?: number;
  paymentReceipt?: string;
  serviceName?: string;
  serviceImage?: string;
  providerName?: string;
  customerName?: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  subject: string;
  description: string;
  status: DisputeStatus;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  priority: DisputePriority;
  evidenceUrls?: string[];
  refundAmount?: number;
  reason?: string;
}

export interface Withdrawal {
  id: string;
  providerId: string;
  amount: number;
  status: string;
  date: Date;
  paymentMethod: string;
  reference?: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  bookingId?: string;
  userId: string;
  amount: number;
  type: 'payout' | 'refund' | 'payment' | 'deposit' | 'withdrawal';
  status: string;
  date: Date;
  description: string;
  reference?: string;
}

export interface WalletVerificationRequest {
  id: string;
  bookingId: string;
  amount: number;
  status: string;
  dateSubmitted: Date;
  verifiedBy?: string;
  dateVerified?: Date;
  paymentMethod: string;
  referenceNumber: string;
  notes?: string;
}
