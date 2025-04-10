import { 
  WalletVerification, 
  WalletVerificationFilters, 
  WalletVerificationStats, 
  WalletVerificationComment, 
  WalletProviderSettings,
  WalletVerificationDashboard,
  WalletVerificationSummary,
  WalletVerificationRequest
} from '@/types';

// Mock wallet verification data for pending verifications
const mockPendingVerifications: WalletVerificationRequest[] = [
  {
    id: '1',
    booking_id: 'book-123',
    amount: 250,
    date_submitted: '2024-03-15T12:30:00Z',
    customer_id: 'user-123',
    provider_id: 'provider-456',
    verification_status: 'pending',
    payment_method: 'mobile_money',
    reference_number: 'MMTX-123456',
    customer_phone: '+264811234567',
    provider_phone: '+264821234567',
    customer_confirmed: true,
    provider_confirmed: false,
    admin_verified: false,
    // Additional fields used in components 
    walletNumber: '+264811234567',
    walletName: 'John Doe',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    userType: 'customer'
  },
  {
    id: '2',
    booking_id: 'book-124',
    amount: 175,
    date_submitted: '2024-03-14T10:15:00Z',
    customer_id: 'user-234',
    provider_id: 'provider-567',
    verification_status: 'submitted',
    payment_method: 'bank_transfer',
    reference_number: 'BT-789012',
    customer_phone: '+264821234567',
    customer_confirmed: true,
    provider_confirmed: true,
    admin_verified: false,
    // Additional fields used in components
    walletNumber: '12345678910',
    walletName: 'Sarah Smith',
    userName: 'Sarah Smith',
    userEmail: 'sarah@example.com',
    userType: 'customer'
  },
  {
    id: '3',
    booking_id: 'book-125',
    amount: 350,
    date_submitted: '2024-03-13T16:45:00Z',
    customer_id: 'user-345',
    provider_id: 'provider-678',
    verification_status: 'verified',
    payment_method: 'easy_wallet',
    reference_number: 'EW-456789',
    customer_phone: '+264831234567',
    provider_phone: '+264841234567',
    customer_confirmed: true,
    provider_confirmed: true,
    admin_verified: true,
    // Additional fields used in components
    walletNumber: 'wallet-345678',
    walletName: 'Mark Johnson',
    userName: 'Mark Johnson',
    userEmail: 'mark@example.com',
    userType: 'customer'
  },
  {
    id: '4',
    booking_id: 'book-126',
    amount: 120,
    date_submitted: '2024-03-12T09:20:00Z',
    customer_id: 'user-456',
    provider_id: 'provider-789',
    verification_status: 'rejected',
    payment_method: 'MTC E-Wallet',
    reference_number: 'MTC-123789',
    rejection_reason: 'Invalid reference number',
    customer_phone: '+264851234567',
    customer_confirmed: true,
    provider_confirmed: false,
    admin_verified: true,
    // Additional fields used in components
    walletNumber: 'mtc-123456',
    walletName: 'Lisa Brown',
    userName: 'Lisa Brown',
    userEmail: 'lisa@example.com',
    userType: 'customer'
  },
  {
    id: '5',
    booking_id: 'book-127',
    amount: 200,
    date_submitted: '2024-03-11T14:10:00Z',
    customer_id: 'user-567',
    provider_id: 'provider-890',
    verification_status: 'pending',
    payment_method: 'Bank Transfer',
    reference_number: 'BT-345678',
    customer_phone: '+264861234567',
    provider_phone: '+264871234567',
    customer_confirmed: true,
    provider_confirmed: false,
    admin_verified: false,
    // Additional fields used in components
    walletNumber: '9876543210',
    walletName: 'David Wilson',
    userName: 'David Wilson',
    userEmail: 'david@example.com',
    userType: 'customer'
  },
];

export const getVerificationById = (id: string): WalletVerificationRequest | null => {
  return mockPendingVerifications.find(v => v.id === id) || null;
};

export const getVerifications = (filters?: WalletVerificationFilters): WalletVerificationRequest[] => {
  let filteredVerifications = [...mockPendingVerifications];

  if (filters) {
    if (filters.status) {
      filteredVerifications = filteredVerifications.filter(v => v.verification_status === filters.status);
    }

    if (filters.paymentMethod) {
      filteredVerifications = filteredVerifications.filter(v => v.payment_method === filters.paymentMethod);
    }

    if (filters.dateFrom) {
      filteredVerifications = filteredVerifications.filter(v => 
        new Date(v.date_submitted || '') >= new Date(filters.dateFrom!)
      );
    }

    if (filters.dateTo) {
      filteredVerifications = filteredVerifications.filter(v => 
        new Date(v.date_submitted || '') <= new Date(filters.dateTo!)
      );
    }

    if (filters.amountMin) {
      filteredVerifications = filteredVerifications.filter(v => v.amount >= (filters.amountMin || 0));
    }

    if (filters.amountMax) {
      filteredVerifications = filteredVerifications.filter(v => v.amount <= (filters.amountMax || 0));
    }

    if (filters.walletProvider && filters.walletProvider !== 'all') {
      filteredVerifications = filteredVerifications.filter(v => 
        v.walletProvider === filters.walletProvider
      );
    }

    if (filters.userType && filters.userType !== 'all') {
      filteredVerifications = filteredVerifications.filter(v => 
        v.userType === filters.userType
      );
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredVerifications = filteredVerifications.filter(v => 
        v.userName?.toLowerCase().includes(term) ||
        v.userEmail?.toLowerCase().includes(term) ||
        v.reference_number?.toLowerCase().includes(term) ||
        v.walletNumber?.toLowerCase().includes(term)
      );
    }
  }

  // Add additional fields for display
  return filteredVerifications.map(v => ({
    ...v,
    transactionReference: v.reference_number
  }));
};

export const getVerificationStats = (): WalletVerificationStats => {
  const total = mockPendingVerifications.length;
  const pending = mockPendingVerifications.filter(v => v.verification_status === 'pending').length;
  const verified = mockPendingVerifications.filter(v => v.verification_status === 'verified' || v.verification_status === 'approved').length;
  const rejected = mockPendingVerifications.filter(v => v.verification_status === 'rejected').length;
  
  const totalAmount = mockPendingVerifications.reduce((sum, v) => sum + v.amount, 0);
  const averageAmount = totalAmount / total;
  
  return {
    total,
    pending,
    verified,
    rejected,
    totalAmount,
    averageAmount: Math.round(averageAmount * 100) / 100,
    averageProcessingTime: '1.5 days',
    totalPending: pending,
    totalApproved: verified,
    totalRejected: rejected,
    totalExpired: 0,
    totalAmountPending: pending * averageAmount,
    totalAmountProcessed: verified * averageAmount
  };
};

export const approveVerification = (id: string): WalletVerificationRequest => {
  const index = mockPendingVerifications.findIndex(v => v.id === id);
  
  if (index !== -1) {
    mockPendingVerifications[index] = {
      ...mockPendingVerifications[index],
      verification_status: 'verified',
      date_verified: new Date().toISOString(),
      admin_verified: true,
      notes: 'Verified by admin',
      reviewerId: 'admin-123',
      reviewerName: 'Admin User',
      reviewDate: new Date().toISOString()
    };
  }
  
  return mockPendingVerifications[index];
};

export const rejectVerification = (id: string, reason: string): WalletVerificationRequest => {
  const index = mockPendingVerifications.findIndex(v => v.id === id);
  if (index !== -1) {
    mockPendingVerifications[index] = {
      ...mockPendingVerifications[index],
      verification_status: 'rejected',
      rejection_reason: reason,
      date_verified: new Date().toISOString(),
      admin_verified: true,
      notes: 'Rejected by admin',
      reviewerId: 'admin-123',
      reviewerName: 'Admin User',
      reviewDate: new Date().toISOString()
    };
    return mockPendingVerifications[index];
  }
  return {} as WalletVerificationRequest;
};

export const addComment = (verificationId: string, comment: string, userId: string, userRole: string): WalletVerificationComment => {
  const newComment: WalletVerificationComment = {
    id: Math.random().toString(36).substring(7),
    verification_id: verificationId,
    user_id: userId,
    user_role: userRole,
    comment,
    timestamp: new Date().toISOString()
  };
  
  return newComment;
};

export const getComments = (verificationId: string): WalletVerificationComment[] => {
  return [
    {
      id: '1',
      verification_id: verificationId,
      user_id: 'admin-123',
      user_role: 'admin',
      comment: 'Please provide clearer image of the receipt',
      timestamp: '2024-03-14T14:23:00Z'
    },
    {
      id: '2',
      user_id: 'user-123',
      verification_id: verificationId,
      user_role: 'customer',
      comment: 'I have uploaded a new receipt image',
      timestamp: '2024-03-14T15:10:00Z'
    }
  ];
};

export const getVerificationDashboard = (): WalletVerificationDashboard => {
  const stats: WalletVerificationStats = getVerificationStats();
  const recentVerifications: WalletVerificationRequest[] = mockPendingVerifications.slice(0, 5);

  const dashboard: WalletVerificationDashboard = {
    stats,
    recentVerifications,
    providers: [
      {
        id: 'mtc-ewallet',
        name: 'MTC E-Wallet',
        code: 'MTC',
        type: 'mobile',
        processingFee: 2.5,
        processingTime: '24 hours',
        isEnabled: true,
        logoUrl: '/mtc-logo.png'
      },
      {
        id: 'bank-namibia',
        name: 'Bank Windhoek',
        code: 'BW',
        type: 'bank',
        processingFee: 5,
        processingTime: '48 hours',
        isEnabled: true,
        logoUrl: '/bank-windhoek-logo.png'
      },
      {
        id: 'standard-bank',
        name: 'Standard Bank',
        code: 'SB',
        type: 'bank',
        processingFee: 5,
        processingTime: '48 hours',
        isEnabled: true,
        logoUrl: '/standard-bank-logo.png'
      },
      {
        id: 'fnb-namibia',
        name: 'FNB Namibia',
        code: 'FNB',
        type: 'bank',
        processingFee: 5,
        processingTime: '48 hours',
        isEnabled: true,
        logoUrl: '/fnb-logo.png'
      }
    ]
  };

  return dashboard;
};

// Mock wallet providers
const mockWalletProviders: WalletProviderSettings[] = [
  {
    id: '1',
    provider_id: 'mtc-ewallet',
    walletProvider: 'MTC E-Wallet',
    isEnabled: true,
    accountNumber: 'provider-acc-123',
    phoneNumber: '+264861234567',
    processingFee: 2.5,
    processingFeeType: 'percentage',
    currency: 'NAD',
    updatedAt: '2024-01-15T10:30:00Z',
    providerName: 'MTC E-Wallet', 
    displayName: 'MTC E-Wallet',
    processingTime: '24 hours'
  },
  {
    id: '2',
    provider_id: 'bank-namibia',
    walletProvider: 'Bank Namibia',
    isEnabled: true,
    accountNumber: 'bank-acc-456',
    processingFee: 5,
    processingFeeType: 'flat',
    currency: 'NAD',
    updatedAt: '2024-01-20T14:15:00Z',
    providerName: 'Bank Namibia',
    displayName: 'Bank Namibia',
    processingTime: '48 hours'
  },
  {
    id: '3',
    provider_id: 'easy-wallet',
    walletProvider: 'Easy Wallet',
    isEnabled: true,
    phoneNumber: '+264891234567',
    accountNumber: 'easy-acc-789',
    processingFee: 1.5,
    processingFeeType: 'percentage',
    currency: 'NAD',
    updatedAt: '2024-01-25T09:45:00Z',
    providerName: 'Easy Wallet',
    displayName: 'Easy Wallet',
    processingTime: '2 hours'
  },
  {
    id: '4',
    provider_id: 'payfast',
    walletProvider: 'PayFast',
    isEnabled: false,
    accountNumber: 'payfast-acc-012',
    processingFee: 3.0,
    processingFeeType: 'percentage',
    currency: 'NAD',
    updatedAt: '2024-02-01T11:30:00Z',
    providerName: 'PayFast',
    displayName: 'PayFast',
    processingTime: '12 hours'
  },
  {
    id: '5',
    provider_id: 'telecom-pay',
    walletProvider: 'Telecom Pay',
    isEnabled: true,
    phoneNumber: '+264871234567',
    accountNumber: 'telecom-acc-345',
    processingFee: 2.0,
    processingFeeType: 'percentage',
    currency: 'NAD',
    updatedAt: '2024-02-05T13:20:00Z',
    providerName: 'Telecom Pay',
    displayName: 'Telecom Pay',
    processingTime: '6 hours'
  }
];

export const getWalletProviders = (): WalletProviderSettings[] => {
  return mockWalletProviders;
};

export const getWalletProviderById = (id: string): WalletProviderSettings | undefined => {
  return mockWalletProviders.find(provider => provider.provider_id === id);
};

export const updateWalletProviderSettings = (id: string, settings: Partial<WalletProviderSettings>): WalletProviderSettings | undefined => {
  const index = mockWalletProviders.findIndex(provider => provider.provider_id === id);
  if (index !== -1) {
    mockWalletProviders[index] = {
      ...mockWalletProviders[index],
      ...settings,
      updatedAt: new Date().toISOString()
    };
    return mockWalletProviders[index];
  }
  return undefined;
};
