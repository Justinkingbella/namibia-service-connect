
import { WalletVerificationStatus, WalletPaymentType } from './payment';

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
  userId?: string;
  walletProvider?: string;
  userType?: string;
  userName?: string;
  userEmail?: string;
  walletNumber?: string;
  transactionReference?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewDate?: string;
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
  // Add missing properties used in WalletService
  walletProvider?: string;
  userType?: string;
  searchTerm?: string;
}

export interface WalletVerificationStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  totalAmount: number;
  // Add missing property used in WalletService
  approved?: number;
  expired?: number;
}

export interface WalletVerificationComment {
  id: string;
  requestId: string;
  adminId: string;
  adminName: string;
  comment: string;
  timestamp: string;
  // Add missing property used in WalletService
  verificationId?: string;
  userId?: string;
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
  // Add missing property used in WalletService
  providerName?: string;
  isEnabled?: boolean;
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
  EXPIRED = 'expired',
  SUBMITTED = 'submitted',
  IN_REVIEW = 'in_review'
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
