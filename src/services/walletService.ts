
import { 
  WalletVerification,
  WalletVerificationRequest,
  WalletVerificationFilters,
  WalletVerificationStats,
  WalletVerificationComment,
  WalletProviderSettings,
  WalletVerificationDashboard,
  VerificationStatus
} from '@/types/wallet';

// Helper function to generate fake data
export const getVerifications = (): WalletVerification[] => {
  return [
    {
      id: '1',
      user_id: 'user123',
      amount: 250,
      verificationStatus: 'pending',
      date: '2024-03-15',
      method: 'mobile_money',
      paymentMethod: 'mobile_money',
      referenceNumber: 'MMTX-123456',
      customerPhone: '+264811234567',
      walletNumber: '+264811234567',
      walletName: 'John Doe',
    },
    {
      id: '2',
      user_id: 'user123',
      amount: 175, 
      verificationStatus: 'submitted',
      date: '2024-03-14',
      method: 'bank_transfer',
      paymentMethod: 'bank_transfer',
      referenceNumber: 'BT-789012',
      customerPhone: '+264821234567',
      walletNumber: '12345678910',
      walletName: 'Sarah Smith',
    },
    {
      id: '3',
      user_id: 'user123',
      amount: 350,
      verificationStatus: 'approved',
      date: '2024-03-10',
      method: 'mobile_money',
      paymentMethod: 'mobile_money',
      referenceNumber: 'MMTX-345678',
      customerPhone: '+264811234567',
      walletNumber: '+264811234567',
      walletName: 'John Doe',
      dateVerified: '2024-03-11',
    },
    {
      id: '4',
      user_id: 'user123',
      amount: 125,
      verificationStatus: 'rejected',
      date: '2024-03-08',
      method: 'bank_transfer',
      paymentMethod: 'bank_transfer',
      referenceNumber: 'BT-678901',
      customerPhone: '+264821234567',
      walletNumber: '12345678910',
      walletName: 'Sarah Smith',
      rejectionReason: 'Invalid reference number provided',
    },
    {
      id: '5',
      user_id: 'user456',
      amount: 500,
      verificationStatus: 'pending',
      date: '2024-03-14',
      method: 'mobile_money',
      paymentMethod: 'mobile_money',
      referenceNumber: 'MMTX-567890',
      customerPhone: '+264831234567',
      walletNumber: '+264831234567',
      walletName: 'Michael Brown',
    },
  ];
};

// Get verification request details
export const getVerificationById = (id: string): WalletVerificationRequest => {
  return {
    id,
    booking_id: 'booking123',
    customer_id: 'customer123',
    provider_id: 'provider123',
    amount: 250,
    date_submitted: '2024-03-15',
    verification_status: 'pending',
    payment_method: 'mobile_money',
    reference_number: 'MMTX-123456',
    customer_phone: '+264811234567',
    provider_phone: '+264821234567',
    customer_confirmed: true,
    provider_confirmed: false,
    admin_verified: false,
    admin_comments: [],
    created_at: '2024-03-15',
    updated_at: '2024-03-15',
    walletNumber: '+264811234567',
    walletName: 'John Doe',
    userType: 'customer',
    paymentPurpose: 'Service Payment'
  };
};

// Get verification requests with filters
export const getVerificationRequests = (
  filters?: WalletVerificationFilters
): WalletVerificationRequest[] => {
  // Mock data that would normally be filtered from the database
  return [
    {
      id: '1',
      booking_id: 'booking123',
      customer_id: 'customer123',
      provider_id: 'provider123',
      amount: 250,
      date_submitted: '2024-03-15',
      verification_status: 'pending',
      payment_method: 'mobile_money',
      reference_number: 'MMTX-123456',
      customer_phone: '+264811234567',
      provider_phone: '+264821234567',
      customer_confirmed: true,
      provider_confirmed: false,
      admin_verified: false,
      admin_comments: [],
      created_at: '2024-03-15',
      updated_at: '2024-03-15',
      walletNumber: '+264811234567',
      walletName: 'John Doe',
    },
    {
      id: '2',
      booking_id: 'booking456',
      customer_id: 'customer456',
      provider_id: 'provider456',
      amount: 175,
      date_submitted: '2024-03-14',
      verification_status: 'submitted',
      payment_method: 'bank_transfer',
      reference_number: 'BT-789012',
      customer_phone: '+264821234567',
      provider_phone: '+264841234567',
      customer_confirmed: true,
      provider_confirmed: true,
      admin_verified: false,
      admin_comments: [],
      created_at: '2024-03-14',
      updated_at: '2024-03-14',
      walletNumber: '12345678910',
      walletName: 'Sarah Smith',
    },
    {
      id: '3',
      booking_id: 'booking789',
      customer_id: 'customer789',
      provider_id: 'provider789',
      amount: 350,
      date_submitted: '2024-03-10',
      date_verified: '2024-03-11',
      verified_by: 'admin123',
      verification_status: 'verified',
      payment_method: 'mobile_money',
      reference_number: 'MMTX-345678',
      customer_phone: '+264831234567',
      provider_phone: '+264851234567',
      customer_confirmed: true,
      provider_confirmed: true,
      admin_verified: true,
      admin_comments: [{ comment: 'Verified against MTC records' }],
      created_at: '2024-03-10',
      updated_at: '2024-03-11',
      walletNumber: '+264831234567',
      walletName: 'Michael Brown',
    },
    {
      id: '4',
      booking_id: 'booking012',
      customer_id: 'customer012',
      provider_id: 'provider012',
      amount: 125,
      date_submitted: '2024-03-08',
      date_verified: '2024-03-09',
      verified_by: 'admin456',
      verification_status: 'rejected',
      payment_method: 'bank_transfer',
      reference_number: 'BT-678901',
      rejection_reason: 'Invalid reference number provided',
      customer_phone: '+264861234567',
      provider_phone: '+264871234567',
      customer_confirmed: true,
      provider_confirmed: false,
      admin_verified: true,
      admin_comments: [{ comment: 'Reference number not found in bank records' }],
      created_at: '2024-03-08',
      updated_at: '2024-03-09',
      walletNumber: '09876543210',
      walletName: 'Emily Johnson',
    },
    {
      id: '5',
      booking_id: 'booking345',
      customer_id: 'customer345',
      provider_id: 'provider345',
      amount: 500,
      date_submitted: '2024-03-12',
      verification_status: 'pending',
      payment_method: 'e_wallet',
      reference_number: 'EW-123456',
      customer_phone: '+264881234567',
      provider_phone: '+264891234567',
      customer_confirmed: true,
      provider_confirmed: true,
      admin_verified: false,
      admin_comments: [],
      created_at: '2024-03-12',
      updated_at: '2024-03-12',
      walletName: 'David Wilson',
    },
  ];
};

// Get verification statistics
export const getVerificationStats = (): WalletVerificationStats => {
  return {
    total: 185,
    pending: 42,
    verified: 128,
    rejected: 15,
    totalAmount: 46250,
    averageAmount: 250,
    averageProcessingTime: '1.5 days',
    totalPending: 42,
    totalApproved: 128,
    totalRejected: 15,
    totalExpired: 0,
    totalAmountPending: 10500,
    totalAmountProcessed: 35750
  };
};

// Submit a verification request
export const submitVerificationRequest = async (
  data: Partial<WalletVerificationRequest>
): Promise<{ success: boolean; verificationId: string }> => {
  // Simulate an API request with a timeout
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real implementation, this would insert data into the database
  console.log('Submitting verification request:', data);
  
  // Return a fake success response with a random ID
  return {
    success: true,
    verificationId: `verification-${Math.random().toString(36).substring(2, 10)}`
  };
};

// Update a verification status
export const updateVerificationStatus = async (
  id: string,
  status: VerificationStatus,
  comment?: string
): Promise<{ success: boolean }> => {
  // Simulate an API request with a timeout
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`Updating verification ${id} to status: ${status}`);
  if (comment) {
    console.log(`Comment: ${comment}`);
  }
  
  // Return a fake success response
  return { success: true };
};

// Get verification comments
export const getVerificationComments = (verificationId: string): WalletVerificationComment[] => {
  return [
    {
      id: '1',
      verification_id: verificationId,
      user_id: 'admin123',
      user_role: 'admin',
      comment: 'Checking with bank for reference verification',
      timestamp: '2024-03-15T10:30:00Z',
    },
    {
      id: '2',
      verification_id: verificationId,
      user_id: 'provider456',
      user_role: 'provider',
      comment: 'Payment received but pending confirmation',
      timestamp: '2024-03-15T11:15:00Z',
    },
    {
      id: '3',
      verification_id: verificationId,
      user_id: 'customer789',
      user_role: 'customer',
      comment: 'I\'ve submitted all required details',
      timestamp: '2024-03-15T12:00:00Z',
    }
  ];
};

// Add a comment to a verification
export const addVerificationComment = async (
  data: Partial<WalletVerificationComment>
): Promise<{ success: boolean; commentId: string }> => {
  // Simulate an API request with a timeout
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real implementation, this would insert data into the database
  console.log('Adding verification comment:', data);
  
  // Return a fake success response with a random ID
  return {
    success: true,
    commentId: `comment-${Math.random().toString(36).substring(2, 10)}`
  };
};

// Get wallet provider settings
export const getWalletProviderSettings = (): WalletProviderSettings[] => {
  return [
    {
      id: '1',
      provider_id: 'mtc',
      walletProvider: 'MTC Mobile Money',
      isEnabled: true,
      accountNumber: '12345678',
      phoneNumber: '+264811234567',
      processingFee: 2.5,
      processingFeeType: 'percentage',
      currency: 'NAD',
      updatedAt: '2024-03-01T00:00:00Z',
      processingTime: '1-2 business days',
      displayName: 'MTC Mobile Money',
    },
    {
      id: '2',
      provider_id: 'telecom',
      walletProvider: 'Telecom Mobile Money',
      isEnabled: true,
      accountNumber: '87654321',
      phoneNumber: '+264821234567',
      processingFee: 2.0,
      processingFeeType: 'percentage',
      currency: 'NAD',
      updatedAt: '2024-03-01T00:00:00Z',
      processingTime: '1-2 business days',
      displayName: 'Telecom Mobile Money',
    },
    {
      id: '3',
      provider_id: 'bluewallet',
      walletProvider: 'Blue Wallet',
      isEnabled: true,
      accountNumber: 'blue123456',
      phoneNumber: '+264831234567',
      processingFee: 1.5,
      processingFeeType: 'percentage',
      currency: 'NAD',
      updatedAt: '2024-03-01T00:00:00Z',
      processingTime: '1 business day',
      displayName: 'Blue Wallet',
    },
    {
      id: '4',
      provider_id: 'standardbank',
      walletProvider: 'Standard Bank',
      isEnabled: true,
      accountNumber: '9012345678',
      processingFee: 3.0,
      processingFeeType: 'percentage',
      currency: 'NAD',
      updatedAt: '2024-03-01T00:00:00Z',
      processingTime: '2-3 business days',
      displayName: 'Standard Bank',
    },
    {
      id: '5',
      provider_id: 'firstnational',
      walletProvider: 'First National Bank',
      isEnabled: true,
      accountNumber: '1098765432',
      processingFee: 3.0,
      processingFeeType: 'percentage',
      currency: 'NAD',
      updatedAt: '2024-03-01T00:00:00Z',
      processingTime: '2-3 business days',
      displayName: 'First National Bank',
    }
  ];
};

// Get verification dashboard
export const getVerificationDashboard = async (): Promise<WalletVerificationDashboard> => {
  // In a real implementation, this would fetch data from the database
  return {
    stats: getVerificationStats(),
    recentVerifications: getVerificationRequests().slice(0, 5),
    providers: [
      { 
        id: 'mtc', 
        name: 'MTC Mobile Money', 
        code: 'mtc_money', 
        type: 'mobile',
        processingFee: 2.5,
        processingTime: '1-2 business days',
        isEnabled: true,
        logoUrl: '/path/to/mtc-logo.png'
      },
      { 
        id: 'telecom', 
        name: 'Telecom Mobile Money', 
        code: 'telecom_money', 
        type: 'mobile',
        processingFee: 2.0,
        processingTime: '1-2 business days',
        isEnabled: true,
        logoUrl: '/path/to/telecom-logo.png'
      },
      { 
        id: 'standardbank', 
        name: 'Standard Bank', 
        code: 'standard_bank', 
        type: 'bank',
        processingFee: 3.0,
        processingTime: '2-3 business days',
        isEnabled: true,
        logoUrl: '/path/to/standard-bank-logo.png'
      }
    ]
  };
};
