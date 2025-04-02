export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type WalletProvider = 'eWallet' | 'BlueWallet' | 'PayToday' | 'DOP' | 'EasyWallet' | 'OtherWallet';
export type UserType = 'customer' | 'provider';

export interface WalletVerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userType: UserType;
  walletProvider: WalletProvider;
  walletNumber: string;
  walletName: string;
  amount: number;
  currency: string;
  transactionReference: string;
  dateSubmitted: string;
  status: VerificationStatus;
  reviewerId?: string;
  reviewerName?: string;
  reviewDate?: string;
  notes?: string;
  attachments?: string[];
  bookingId?: string;
  paymentPurpose: string;
  isPayout: boolean;
}

export interface WalletVerificationFilters {
  status?: VerificationStatus[];
  walletProvider?: WalletProvider[];
  userType?: UserType[];
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
}

export interface WalletVerificationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  expired: number;
  totalAmountPending: number;
  totalAmountProcessed: number;
  averageProcessingTime: number;
}

export interface WalletVerificationComment {
  id: string;
  verificationId: string;
  userId: string;
  userName: string;
  userRole: string;
  comment: string;
  createdAt: string;
  isInternal: boolean;
}

export interface WalletProviderSettings {
  id: string;
  providerName: WalletProvider;
  isEnabled: boolean;
  displayName: string;
  logo: string;
  processingFee: number;
  processingFeeType: 'fixed' | 'percentage';
  minAmount: number;
  maxAmount: number;
  verificationRequired: boolean;
  supportedCurrencies: string[];
  apiIntegration: boolean;
  apiEndpoint?: string;
  apiKey?: string;
  webhookUrl?: string;
}

export interface WalletVerificationDashboard {
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
    totalAmount: number;
    pendingAmount: number;
  };
  recentVerifications: WalletVerificationRequest[];
  processingTime: {
    average: number;
    min: number;
    max: number;
  };
  byProvider: {
    provider: WalletProvider;
    count: number;
    amount: number;
  }[];
  byUserType: {
    userType: UserType;
    count: number;
    amount: number;
  }[];
}

export interface WalletVerificationSummary {
  totalVerifications: number;
  pendingVerifications: number;
  approvedVerifications: number;
  rejectedVerifications: number;
  totalAmount: number;
  pendingAmount: number;
  averageProcessingTime: number;
  recentVerifications: WalletVerificationRequest[];
}

export interface VerificationAction {
  id: string;
  verificationId: string;
  action: 'approve' | 'reject' | 'request_info' | 'resubmit';
  performedBy: string;
  performedByName: string;
  performedByRole: string;
  reason?: string;
  createdAt: string;
  additionalData?: Record<string, any>;
}

export interface WalletVerificationReport {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  totalVerifications: number;
  approvedVerifications: number;
  rejectedVerifications: number;
  totalAmount: number;
  byProvider: {
    provider: WalletProvider;
    count: number;
    amount: number;
    percentageOfTotal: number;
  }[];
  byUserType: {
    userType: UserType;
    count: number;
    amount: number;
    percentageOfTotal: number;
  }[];
  averageProcessingTime: number;
}
