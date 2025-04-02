
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
