
import { WalletVerificationStatus, WalletPaymentType } from './schema';

export interface WalletVerificationRequest {
  id: string;
  booking_id: string;
  customer_id: string;
  provider_id: string;
  amount: number;
  date_submitted: string;
  date_verified?: string;
  verified_by?: string;
  verification_status: WalletVerificationStatus;
  payment_method: WalletPaymentType;
  reference_number: string;
  customer_phone: string;
  provider_phone?: string;
  rejection_reason?: string;
  paymentPurpose?: string; // Add missing property
  walletNumber?: string; // Add missing property
}

export interface WalletVerificationFilters {
  status?: WalletVerificationStatus;
  paymentMethod?: WalletPaymentType;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  searchTerm?: string;
}

export interface WalletVerificationStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  totalAmount: number;
  averageAmount: number;
  averageProcessingTime?: string; // Add missing property
}

export interface WalletVerificationComment {
  id: string;
  verification_id: string;
  user_id: string;
  user_role: string;
  comment: string;
  timestamp: string;
  createdAt?: string; // Add missing property
}

export interface WalletProviderSettings {
  id: string;
  provider_id: string;
  walletProvider: string;
  isEnabled: boolean;
  accountNumber?: string;
  phoneNumber?: string;
  processingFee: number;
  processingFeeType?: string; // Add this property
  currency: string;
  notes?: string;
  updatedAt: string;
}

export interface WalletVerificationDashboard {
  stats: WalletVerificationStats;
  recentVerifications: WalletVerificationRequest[];
  providers: WalletProvider[];
}

export interface WalletVerificationSummary {
  totalVerifications: number;
  pendingVerifications: number;
  approvedVerifications: number;
  rejectedVerifications: number;
  totalAmountProcessed: number;
  avgProcessingTime: string;
}

export interface VerificationAction {
  id: string;
  verification_id: string;
  action_type: 'approve' | 'reject' | 'comment';
  performed_by: string;
  user_role: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface WalletVerificationReport {
  period: string;
  verificationCount: number;
  totalAmount: number;
  approvalRate: number;
  avgProcessingTime: string;
}

export type VerificationStatus = 'pending' | 'submitted' | 'verified' | 'rejected' | 'expired' | 'approved';

export interface WalletProvider {
  id: string;
  name: string;
  code: string;
  type: 'mobile' | 'bank' | 'wallet';
  processingFee: number;
  processingTime: string;
  isEnabled: boolean;
  logoUrl?: string;
}

export type UserType = 'customer' | 'provider' | 'admin';
