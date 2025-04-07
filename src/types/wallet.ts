
import { WalletVerificationStatus } from './schema';

export interface WalletVerificationRequest {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  customerPhone: string;
  providerPhone?: string;
  paymentMethod: string;
  amount: number;
  referenceNumber: string;
  status: string;
  dateSubmitted: string;
  dateVerified?: string;
  customerName?: string;
  providerName?: string;
  customerConfirmed: boolean;
  providerConfirmed: boolean;
  adminVerified: boolean;
  verifiedBy?: string;
  adminComments?: any[];
  mobileOperator?: string;
  bank?: string;
  proofType?: string;
  receiptImage?: string;
  notes?: string;
  rejectionReason?: string;
}

export interface WalletVerificationFilters {
  status?: string;
  paymentMethod?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  amount?: {
    min: number;
    max: number;
  };
  search?: string;
}

export interface WalletVerificationStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  totalAmount: number;
}

export interface WalletVerificationComment {
  id: string;
  requestId: string;
  adminId: string;
  adminName: string;
  comment: string;
  timestamp: string;
}

export interface WalletProviderSettings {
  id: string;
  name: string;
  type: 'bank' | 'mobile';
  isActive: boolean;
  logo?: string;
  processingTime?: string;
  minimumAmount?: number;
  maximumAmount?: number;
  instructions?: string;
}

export interface WalletVerificationDashboard {
  stats: WalletVerificationStats;
  recentRequests: WalletVerificationRequest[];
}

export interface WalletVerificationSummary {
  totalRequests: number;
  totalAmount: number;
  verificationRatePercentage: number;
  averageProcessingTime: string;
  mostCommonPaymentMethod: string;
  mostCommonMobileOperator?: string;
  mostCommonBank?: string;
}

export enum VerificationAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  REQUEST_MORE_INFO = 'request_more_info'
}

export interface WalletVerificationReport {
  dailyStats: {
    date: string;
    count: number;
    amount: number;
  }[];
  methodBreakdown: {
    method: string;
    count: number;
    amount: number;
  }[];
  statusBreakdown: {
    status: string;
    count: number;
    percentage: number;
  }[];
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export interface WalletProvider {
  id: string;
  name: string;
  logo?: string;
  type: 'bank' | 'mobile';
}

export enum UserType {
  CUSTOMER = 'customer',
  PROVIDER = 'provider'
}
