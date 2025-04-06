
import { Json } from './schema';

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'no_show'
  | 'disputed'
  | 'rescheduled';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'canceled'
  | 'partially_refunded';

export interface BookingData {
  id?: string;
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
  created_at?: string;
  updated_at?: string;
  customer_notes?: string;
  provider_notes?: string;
  cancellation_reason?: string;
  cancelled_by?: string;
  cancellation_date?: string;
  serviceId?: string;
  serviceName?: string;
  serviceImage?: string;
  providerId?: string;
  providerName?: string;
  customerId?: string;
  customerName?: string;
  startTime?: string;
  endTime?: string;
  totalAmount?: number;
  createdAt?: string;
  duration?: number;
}

export interface Booking {
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
  createdAt: string;
  updatedAt: string;
}

export interface BookingWithDetails extends Booking {
  service?: {
    title: string;
    image?: string;
  };
  provider?: {
    businessName: string;
    avatarUrl?: string;
  };
  customer?: {
    name: string;
    avatarUrl?: string;
  };
}

export interface Dispute {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  subject: string;
  description: string;
  status: DisputeStatus;
  priority: DisputePriority;
  createdAt: string;
  updatedAt?: string;
  resolutionDate?: string;
  resolution?: string;
  refundAmount?: number;
  adminNotes?: string;
  adminAssignedTo?: string;
  evidenceUrls?: string[];
  reason?: string;
}

export type DisputeStatus = 'pending' | 'in_progress' | 'in_review' | 'resolved' | 'closed' | 'escalated' | 'rejected';
export type DisputePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  type: 'payment' | 'refund' | 'payout';
  description: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  reference?: string;
}

export interface FeedbackData {
  bookingId: string;
  rating: number;
  comment: string;
  providerId: string;
  customerId: string;
}
