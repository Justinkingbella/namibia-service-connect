
import {
  WalletVerificationRequest,
  WalletVerificationFilters,
  WalletVerificationStats,
  WalletVerificationComment,
  WalletProviderSettings,
  VerificationStatus
} from '@/types/wallet';

// Mock implementation - would be replaced with API calls in production
export const getWalletVerificationRequests = async (
  filters?: WalletVerificationFilters
): Promise<WalletVerificationRequest[]> => {
  console.log('Fetching wallet verification requests with filters:', filters);
  
  // Mock data
  const mockRequests: WalletVerificationRequest[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      userType: 'customer',
      walletProvider: 'eWallet',
      walletNumber: '264811234567',
      walletName: 'John Doe',
      amount: 450,
      currency: 'N$',
      transactionReference: 'TRX123456',
      dateSubmitted: '2023-06-15T08:30:00Z',
      status: 'pending',
      paymentPurpose: 'Payment for home cleaning service',
      isPayout: false
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Sarah Smith',
      userEmail: 'sarah@example.com',
      userType: 'customer',
      walletProvider: 'PayToday',
      walletNumber: '264811234568',
      walletName: 'Sarah Smith',
      amount: 650,
      currency: 'N$',
      transactionReference: 'TRX123457',
      dateSubmitted: '2023-06-14T10:45:00Z',
      status: 'approved',
      reviewerId: 'admin1',
      reviewerName: 'Admin User',
      reviewDate: '2023-06-15T09:30:00Z',
      paymentPurpose: 'Payment for plumbing repair',
      isPayout: false
    },
    {
      id: '3',
      userId: 'provider1',
      userName: 'CleanHome Pro',
      userEmail: 'cleanhome@example.com',
      userType: 'provider',
      walletProvider: 'BlueWallet',
      walletNumber: '264811234569',
      walletName: 'Clean Home Business',
      amount: 1250,
      currency: 'N$',
      transactionReference: 'TRX123458',
      dateSubmitted: '2023-06-13T14:20:00Z',
      status: 'pending',
      paymentPurpose: 'Payout for completed services',
      isPayout: true
    },
    {
      id: '4',
      userId: 'user3',
      userName: 'Michael Johnson',
      userEmail: 'michael@example.com',
      userType: 'customer',
      walletProvider: 'DOP',
      walletNumber: '264811234570',
      walletName: 'Michael Johnson',
      amount: 850,
      currency: 'N$',
      transactionReference: 'TRX123459',
      dateSubmitted: '2023-06-12T09:15:00Z',
      status: 'rejected',
      reviewerId: 'admin1',
      reviewerName: 'Admin User',
      reviewDate: '2023-06-13T11:45:00Z',
      notes: 'Transaction reference not found in provider system',
      paymentPurpose: 'Payment for electrical work',
      isPayout: false
    },
    {
      id: '5',
      userId: 'provider2',
      userName: 'Plumb Perfect',
      userEmail: 'plumbperfect@example.com',
      userType: 'provider',
      walletProvider: 'eWallet',
      walletNumber: '264811234571',
      walletName: 'Plumb Perfect',
      amount: 1850,
      currency: 'N$',
      transactionReference: 'TRX123460',
      dateSubmitted: '2023-06-11T16:30:00Z',
      status: 'approved',
      reviewerId: 'admin2',
      reviewerName: 'Admin Manager',
      reviewDate: '2023-06-12T10:20:00Z',
      paymentPurpose: 'Payout for completed services',
      isPayout: true
    }
  ];
  
  // Apply filters if provided
  let filteredRequests = [...mockRequests];
  
  if (filters) {
    if (filters.status && filters.status.length > 0) {
      filteredRequests = filteredRequests.filter(req => 
        filters.status?.includes(req.status)
      );
    }
    
    if (filters.walletProvider && filters.walletProvider.length > 0) {
      filteredRequests = filteredRequests.filter(req => 
        filters.walletProvider?.includes(req.walletProvider)
      );
    }
    
    if (filters.userType && filters.userType.length > 0) {
      filteredRequests = filteredRequests.filter(req => 
        filters.userType?.includes(req.userType)
      );
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredRequests = filteredRequests.filter(req => 
        req.userName.toLowerCase().includes(term) ||
        req.userEmail.toLowerCase().includes(term) ||
        req.walletNumber.includes(term) ||
        req.transactionReference.toLowerCase().includes(term)
      );
    }
  }
  
  return filteredRequests;
};

export const getWalletVerificationStats = async (): Promise<WalletVerificationStats> => {
  // This would be fetched from an API in a real implementation
  console.log('Fetching wallet verification stats');
  
  // Mock data
  return {
    total: 65,
    pending: 18,
    approved: 42,
    rejected: 5,
    expired: 0,
    totalAmountPending: 12450,
    totalAmountProcessed: 68500,
    averageProcessingTime: 18 // hours
  };
};

export const getWalletVerificationById = async (id: string): Promise<WalletVerificationRequest> => {
  console.log('Fetching wallet verification by ID:', id);
  
  // Mock implementation - would fetch from API in production
  // For now, return a mock object
  return {
    id,
    userId: 'user1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    userType: 'customer',
    walletProvider: 'eWallet',
    walletNumber: '264811234567',
    walletName: 'John Doe',
    amount: 450,
    currency: 'N$',
    transactionReference: 'TRX123456',
    dateSubmitted: '2023-06-15T08:30:00Z',
    status: 'pending',
    paymentPurpose: 'Payment for home cleaning service',
    isPayout: false
  };
};

export const updateWalletVerificationStatus = async (
  id: string, 
  status: VerificationStatus, 
  notes?: string
): Promise<WalletVerificationRequest> => {
  console.log(`Updating wallet verification ${id} to status ${status} with notes: ${notes}`);
  
  // Mock implementation - would update via API in production
  const verification = await getWalletVerificationById(id);
  verification.status = status;
  verification.notes = notes;
  verification.reviewerId = 'admin1';
  verification.reviewerName = 'Admin User';
  verification.reviewDate = new Date().toISOString();
  
  return verification;
};

export const addWalletVerificationComment = async (
  verificationId: string,
  comment: string,
  isInternal: boolean
): Promise<WalletVerificationComment> => {
  console.log(`Adding comment to verification ${verificationId}: ${comment} (Internal: ${isInternal})`);
  
  // Mock implementation - would create via API in production
  return {
    id: `comment-${Date.now()}`,
    verificationId,
    userId: 'admin1',
    userName: 'Admin User',
    userRole: 'admin',
    comment,
    createdAt: new Date().toISOString(),
    isInternal
  };
};

export const getWalletVerificationComments = async (
  verificationId: string
): Promise<WalletVerificationComment[]> => {
  console.log(`Fetching comments for verification ${verificationId}`);
  
  // Mock implementation - would fetch from API in production
  return [
    {
      id: 'comment1',
      verificationId,
      userId: 'admin1',
      userName: 'Admin User',
      userRole: 'admin',
      comment: 'Checking transaction details with the provider',
      createdAt: '2023-06-15T09:30:00Z',
      isInternal: true
    },
    {
      id: 'comment2',
      verificationId,
      userId: 'user1',
      userName: 'John Doe',
      userRole: 'customer',
      comment: 'I have uploaded the transaction confirmation from my eWallet app',
      createdAt: '2023-06-15T10:15:00Z',
      isInternal: false
    }
  ];
};

export const getWalletProviderSettings = async (): Promise<WalletProviderSettings[]> => {
  console.log('Fetching wallet provider settings');
  
  // Mock implementation - would fetch from API in production
  return [
    {
      id: '1',
      providerName: 'eWallet',
      isEnabled: true,
      displayName: 'Bank Windhoek eWallet',
      logo: '/images/wallets/ewallet-logo.png',
      processingFee: 2.5,
      processingFeeType: 'percentage',
      minAmount: 10,
      maxAmount: 5000,
      verificationRequired: true,
      supportedCurrencies: ['N$'],
      apiIntegration: false
    },
    {
      id: '2',
      providerName: 'PayToday',
      isEnabled: true,
      displayName: 'PayToday',
      logo: '/images/wallets/paytoday-logo.png',
      processingFee: 1.5,
      processingFeeType: 'percentage',
      minAmount: 5,
      maxAmount: 10000,
      verificationRequired: true,
      supportedCurrencies: ['N$'],
      apiIntegration: true,
      apiEndpoint: 'https://api.paytoday.com.na/v1',
      apiKey: 'pt_key_123456',
      webhookUrl: 'https://namibiaservicehub.com/api/webhooks/paytoday'
    },
    {
      id: '3',
      providerName: 'DOP',
      isEnabled: true,
      displayName: 'FNB Digital One Pocket',
      logo: '/images/wallets/dop-logo.png',
      processingFee: 2,
      processingFeeType: 'percentage',
      minAmount: 10,
      maxAmount: 8000,
      verificationRequired: true,
      supportedCurrencies: ['N$'],
      apiIntegration: false
    },
    {
      id: '4',
      providerName: 'BlueWallet',
      isEnabled: true,
      displayName: 'Standard Bank Blue Wallet',
      logo: '/images/wallets/bluewallet-logo.png',
      processingFee: 2.5,
      processingFeeType: 'percentage',
      minAmount: 10,
      maxAmount: 5000,
      verificationRequired: true,
      supportedCurrencies: ['N$'],
      apiIntegration: false
    },
    {
      id: '5',
      providerName: 'EasyWallet',
      isEnabled: true,
      displayName: 'Nedbank EasyWallet',
      logo: '/images/wallets/easywallet-logo.png',
      processingFee: 3,
      processingFeeType: 'percentage',
      minAmount: 10,
      maxAmount: 4000,
      verificationRequired: true,
      supportedCurrencies: ['N$'],
      apiIntegration: false
    }
  ];
};

export const updateWalletProviderSettings = async (
  providerId: string,
  settings: Partial<WalletProviderSettings>
): Promise<WalletProviderSettings> => {
  console.log(`Updating wallet provider ${providerId} settings:`, settings);
  
  // Mock implementation - would update via API in production
  const allSettings = await getWalletProviderSettings();
  const provider = allSettings.find(p => p.id === providerId);
  
  if (!provider) {
    throw new Error(`Wallet provider with ID ${providerId} not found`);
  }
  
  // Update the provider settings
  return {
    ...provider,
    ...settings
  };
};
