
import { PaymentMethod } from './service';
import { Dispute as BaseDispute } from './booking';

export interface PaymentHistory {
  id: string;
  userId: string;
  bookingId?: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: PaymentMethod;
  description: string;
  transactionId?: string;
  createdAt: Date;
}

export interface Dispute extends BaseDispute {
  subject?: string;
  priority?: 'low' | 'medium' | 'high';
  adminNotes?: string;
  adminAssignedTo?: string;
  refundAmount?: number;
}
