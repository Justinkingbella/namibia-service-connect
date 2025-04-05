
// Define Payment Method types to avoid confusion with other types
export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer' | 'crypto' | 'cash' | 'mobile_money' | 'wallet';

export interface PaymentProvider {
  id: string;
  name: string;
  type: PaymentMethod;
  isActive: boolean;
  config: Record<string, any>;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  userId: string;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  reference: string;
  description?: string;
}
