import { WalletPaymentType } from './schema';

export interface WalletVerification {
  id?: string;
  bookingId?: string;
  providerId?: string;
  customerId?: string;
  amount: number;
  date: string;
  dateSubmitted?: string;
  dateVerified?: string;
  verificationStatus: string;
  method: WalletPaymentType;
  reference?: string;
  referenceNumber?: string;
  paymentMethod?: WalletPaymentType;
  customerPhone?: string;
  providerPhone?: string;
  mobileOperator?: string;
  bankUsed?: string;
  receiptImage?: string;
  notes?: string;
  rejectionReason?: string;
  customerConfirmed?: boolean;
  providerConfirmed?: boolean;
  adminVerified?: boolean;
}

export interface WalletVerificationRequest {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  amount: number;
  paymentMethod: string;
  referenceNumber: string;
  customerPhone: string;
  dateSubmitted: string;
  verificationStatus: string;
  mobileOperator?: string;
  bankUsed?: string;
  notes?: string;
  adminVerified: boolean;
  customerConfirmed: boolean;
  providerConfirmed: boolean;
}

export interface WalletVerificationFilters {
  status?: string;
  dateRange?: [Date | null, Date | null];
  provider?: string;
  customer?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface WalletVerificationStats {
  totalPending: number;
  totalVerified: number;
  totalRejected: number;
  averageVerificationTime: number;
}

export interface WalletVerificationComment {
  id: string;
  verificationId: string;
  userId: string;
  userRole: string;
  content: string;
  createdAt: string;
}

export interface WalletProviderSettings {
  id: string;
  providerId: string;
  allowsEWallet: boolean;
  allowsBankTransfer: boolean;
  preferredVerificationMethod: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  mobileWalletDetails?: {
    provider: string;
    number: string;
    name: string;
  };
}

export interface WalletVerificationDashboard {
  stats: WalletVerificationStats;
  recentVerifications: WalletVerificationRequest[];
  pendingCount: number;
}

export interface WalletVerificationSummary {
  totalVerifications: number;
  pendingCount: number;
  completedCount: number;
  rejectedCount: number;
  totalAmount: number;
  pendingAmount: number;
  verifiedAmount: number;
}

export enum VerificationAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  COMMENT = 'comment',
  REQUEST_INFO = 'request_info',
  RESUBMIT = 'resubmit',
  CANCEL = 'cancel'
}

export interface WalletVerificationReport {
  timeframe: string;
  totalVerifications: number;
  totalApproved: number;
  totalRejected: number;
  approvalRate: number;
  averageVerificationTime: number;
  byProvider: Array<{
    providerId: string;
    providerName: string;
    count: number;
    approvalRate: number;
  }>;
  byPaymentMethod: Array<{
    method: string;
    count: number;
    approvalRate: number;
  }>;
}

export interface VerificationStatus {
  customer: boolean;
  provider: boolean;
  admin: boolean;
}

export interface WalletProvider {
  id: string;
  name: string;
  logo: string;
  isActive: boolean;
  supportedCountries: string[];
  fees: {
    percentage: number;
    fixed: number;
  };
}

export enum UserType {
  CUSTOMER = 'customer',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}
