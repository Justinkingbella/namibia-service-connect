
import { UserRole, PaymentStatus, WalletPaymentType } from './schema';

// Update with exact string union type to match actual values
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum DisputeStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export enum DisputePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface BookingData {
  id: string;
  service_id: string;
  service_name?: string;
  service_image?: string;
  customer_id: string;
  customer_name?: string;
  provider_id: string;
  provider_name?: string;
  date: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  status: BookingStatus;
  notes?: string;
  customer_notes?: string;
  provider_notes?: string;
  total_amount: number;
  commission?: number;
  payment_status: PaymentStatus;
  payment_method?: string;
  payment_receipt?: string;
  is_urgent?: boolean;
  created_at: string;
  updated_at?: string;
  cancellation_date?: string;
  cancellation_reason?: string;
  cancelled_by?: string;
  refund_amount?: number;
  rating?: number;
  feedback?: string;
  
  // Client-side utility properties
  serviceId?: string;
  serviceName?: string;
  serviceImage?: string;
  customerId?: string;
  customerName?: string;
  providerId?: string;
  providerName?: string;
  startTime?: string;
  endTime?: string;
  totalAmount?: number;
  paymentStatus?: string;
  createdAt?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  status: BookingStatus;
  amount: number;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
}

export interface BookingWithDetails extends Booking {
  customerName: string;
  serviceDetails: {
    title: string;
    description: string;
    image?: string;
  };
  providerDetails: {
    businessName: string;
    avatarUrl?: string;
    contactNumber: string;
  };
}

export interface VerificationStatus {
  customer: boolean;
  provider: boolean;
  admin: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  status: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  date: string;
  status: string;
  paymentMethod: WalletPaymentType;
  reference?: string;
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
  resolution?: string;
  resolvedAt?: string;
  refundAmount?: number;
  evidenceUrls?: string[];
  adminNotes?: string;
  adminAssignedTo?: string;
}
