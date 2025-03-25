
export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'disputed';

export type PaymentMethod = 
  | 'pay_today' 
  | 'pay_fast' 
  | 'e_wallet' 
  | 'dop' 
  | 'easy_wallet' 
  | 'bank_transfer' 
  | 'cash';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed'
  | 'refunded';

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  providerId: string;
  status: BookingStatus;
  date: Date;
  startTime: string;
  endTime: string | null;
  duration: number | null; // In hours or minutes
  totalAmount: number;
  commission: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes: string | null;
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
}
