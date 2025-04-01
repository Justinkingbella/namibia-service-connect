
import { PaymentMethod } from './service';

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'disputed';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'disputed';

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  providerId: string;
  status: BookingStatus;
  date: Date;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  totalAmount: number;
  commission: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes: string | null;
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
  serviceName?: string;
  serviceImage?: string;
  customerName?: string;
}

export interface BookingWithDetails extends Booking {
  service: {
    title: string;
    image: string;
    category: string;
    price: number;
    pricingModel: string;
  };
  customer: {
    name: string;
    email: string;
    phoneNumber?: string;
    avatar?: string;
  };
  provider: {
    businessName: string;
    email: string;
    phoneNumber?: string;
    avatar?: string;
  };
}

export interface Transaction {
  id: string;
  bookingId: string;
  amount: number;
  fee: number;
  net: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  date: Date;
  description: string;
  reference?: string;
}

export interface Withdrawal {
  id: string;
  providerId: string;
  amount: number;
  fee: number;
  net: number;
  method: PaymentMethod;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  accountDetails: string;
  date: Date;
  reference?: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  status: 'open' | 'under_review' | 'resolved' | 'declined';
  reason: string;
  description: string;
  evidenceUrls: string[];
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Use export type for re-exporting types
export type { PaymentMethod } from './service';
