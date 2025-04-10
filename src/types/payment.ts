
import { Json } from './schema';

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  MOBILE_MONEY = 'mobile_money',
  CASH = 'cash',
  WALLET = 'wallet'
}

export enum NamibianMobileOperator {
  MTC = 'mtc',
  TELECOM = 'telecom',
  OTHER = 'other'
}

export enum NamibianBank {
  BANK_WINDHOEK = 'bank_windhoek',
  STANDARD_BANK = 'standard_bank',
  FIRST_NATIONAL_BANK = 'first_national_bank',
  NEDBANK = 'nedbank',
  OTHER = 'other'
}

export interface PaymentMethod {
  id: string;
  userId: string;
  name: string;
  type: PaymentMethodType;
  details: Record<string, any>;
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  amount: number;
  description: string;
  status: string;
  paymentMethod: string;
  transactionId?: string;
  bookingId?: string;
  createdAt: string;
}

export interface PaymentHistory {
  transactions: PaymentRecord[];
  totalAmount: number;
  successCount: number;
  failedCount: number;
}

export interface ProviderEarnings {
  id: string;
  providerId: string;
  periodStart: string;
  periodEnd: string;
  totalEarnings: number;
  commissionPaid: number;
  netEarnings: number;
  totalBookings: number;
  payoutStatus: string;
  payoutDate?: string;
  payoutReference?: string;
}

export interface ProviderPayout {
  id: string;
  providerId: string;
  amount: number;
  fee: number;
  netAmount: number;
  paymentMethod: string;
  status: string;
  processedAt?: string;
  referenceNumber?: string;
  notes?: string;
  bankAccountDetails?: Record<string, any>;
  mobilePaymentDetails?: Record<string, any>;
}
