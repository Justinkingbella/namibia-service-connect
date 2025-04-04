
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected' | 'in_progress';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export interface BookingData {
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
  is_urgent?: boolean;
  created_at: string;
  updated_at: string;
  cancellation_date?: string;
  cancellation_reason?: string;
  cancelled_by?: string;
  notes?: string;
  customer_notes?: string;
  provider_notes?: string;
  duration?: number;
  refund_amount?: number;
  payment_receipt?: string;
  feedback?: string;
  rating?: number;
}

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  providerId: string;
  date: Date;
  startTime: string;
  endTime?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  totalAmount: number;
  commission: number;
  isUrgent?: boolean;
  createdAt: Date;
  updatedAt: Date;
  cancellationDate?: Date;
  cancellationReason?: string;
  cancelledBy?: string;
  notes?: string;
  customerNotes?: string;
  providerNotes?: string;
  duration?: number;
  refundAmount?: number;
  paymentReceipt?: string;
  feedback?: string;
  rating?: number;
}

export interface BookingWithDetails extends Booking {
  serviceName: string;
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
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  resolutionDate?: Date;
  resolution?: string;
  adminAssignedTo?: string;
  refundAmount?: number;
  adminNotes?: string;
  evidenceUrls?: string[];
}

export interface Transaction {
  id: string;
  bookingId: string;
  amount: number;
  type: string;
  description: string;
  status: string;
  createdAt: Date;
}

export interface Withdrawal {
  id: string;
  providerId: string;
  amount: number;
  status: string;
  createdAt: Date;
  processedAt?: Date;
  method: string;
  reference?: string;
  notes?: string;
}

export interface WalletVerificationRequest {
  id: string;
  bookingId: string;
  providerId: string;
  customerId: string;
  amount: number;
  referenceNumber: string;
  status: string;
  createdAt: Date;
  verifiedAt?: Date;
  attachments?: string[];
}
