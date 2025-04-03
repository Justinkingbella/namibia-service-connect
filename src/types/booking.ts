
export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress'
  | 'completed' 
  | 'cancelled' 
  | 'disputed'
  | 'no_show' 
  | 'rescheduled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'refunded' 
  | 'failed'
  | 'partial';

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  date: Date;
  startTime: string;
  endTime?: string;
  status: BookingStatus;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  rating?: number;
  isUrgent?: boolean;
}

export interface BookingWithDetails extends Booking {
  serviceName: string;
  serviceImage?: string;
  customerName: string;
  providerName: string;
  location?: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  subject: string;
  description: string;
  status: 'pending' | 'in_review' | 'resolved' | 'rejected';
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  evidenceUrls?: string[];
  refundAmount?: number;
}

// Re-export from types/index.ts
export interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  createdAt: Date;
  reference: string;
}

export interface Withdrawal {
  id: string;
  providerId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  bankDetails: any;
  createdAt: Date;
  processedAt?: Date;
}

export interface WalletVerificationRequest {
  id: string;
  bookingId: string;
  providerId: string;
  customerId: string;
  amount: number;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  paymentMethod: string;
  proofType?: 'receipt' | 'screenshot' | 'reference';
  proofData?: string;
}
