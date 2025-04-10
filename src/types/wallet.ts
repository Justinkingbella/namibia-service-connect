
import { WalletVerificationStatus as SchemaWalletVerificationStatus, WalletPaymentType as SchemaWalletPaymentType } from './schema';

export type WalletVerificationStatus = SchemaWalletVerificationStatus;
export type WalletPaymentType = SchemaWalletPaymentType;

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
  customer_confirmed: boolean;
  provider_confirmed: boolean;
  admin_verified: boolean;
  admin_comments: any;
  created_at: string;
  updated_at: string;
  proof_type?: string;
  mobile_operator?: string;
  bank_used?: string;
  receipt_image?: string;
  notes?: string;
  // Additional fields used in components
  status?: WalletVerificationStatus;
  walletNumber?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  transactionReference?: string;
  walletProvider?: string;
  userType?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewDate?: string;
  paymentPurpose?: string;
  walletName?: string;
}

export interface WalletVerification {
  id: string;
  user_id: string;
  verificationStatus?: WalletVerificationStatus;
  status?: WalletVerificationStatus;
  date?: string;
  reference?: string;
  method?: WalletPaymentType;
  amount: number;
  provider_id?: string;
  customer_id?: string;
  booking_id?: string;
  paymentMethod?: WalletPaymentType;
  customerPhone?: string;
  providerPhone?: string;
  referenceNumber?: string;
  dateSubmitted?: string;
  dateVerified?: string | null;
  rejectionReason?: string;
  notes?: string;
  receiptImage?: string;
  mobileOperator?: string;
  bankUsed?: string;
  customerConfirmed?: boolean;
  providerConfirmed?: boolean;
  adminVerified?: boolean;
  adminComments?: any;
  walletNumber?: string;
  paymentPurpose?: string;
  walletName?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  transactionReference?: string;
  walletProvider?: string;
  userType?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewDate?: string;
}

export interface WalletVerificationFilters {
  status?: WalletVerificationStatus;
  paymentMethod?: WalletPaymentType;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  searchTerm?: string;
  // Additional fields used in filters
  walletProvider?: string;
  userType?: string;
}

export interface WalletVerificationStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  totalAmount: number;
  averageAmount: number;
  // Additional fields
  averageProcessingTime?: string;
  totalPending?: number;
  totalApproved?: number;
  totalRejected?: number;
  totalExpired?: number;
  totalAmountPending?: number;
  totalAmountProcessed?: number;
}

export interface WalletVerificationComment {
  id: string;
  verification_id: string;
  user_id: string;
  user_role: string;
  comment: string;
  timestamp: string;
  // Additional fields
  verificationId?: string;
  content?: string;
  createdAt?: string;
  userId?: string; // Add this to fix errors
}

export interface WalletProviderSettings {
  id: string;
  provider_id: string;
  walletProvider: string;
  isEnabled: boolean;
  accountNumber?: string;
  phoneNumber?: string;
  processingFee: number;
  processingFeeType?: string;
  currency: string;
  notes?: string;
  updatedAt: string;
  // Additional fields
  providerName?: string;
  apiKey?: string;
  secretKey?: string;
  endpoint?: string;
  displayName?: string;
  processingTime?: string;
  logo?: string; // Add this to fix errors
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
