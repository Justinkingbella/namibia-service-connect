import { PaymentHistory, ProviderEarnings, ProviderPayout } from '@/types/payments';

// Mock payment history data
const mockPaymentHistory: PaymentHistory[] = [
  {
    id: '1',
    userId: 'user1',
    amount: 250,
    description: 'Home Cleaning Service',
    createdAt: '2023-01-15T10:30:00Z',
    status: 'completed',
    type: 'booking',
    reference: 'PAY-123456',
    paymentMethod: 'MTC E-Wallet',
    transactionId: 'TXN-123456'
  },
  {
    id: '2',
    userId: 'user1',
    amount: 150,
    description: 'Plumbing Repair',
    createdAt: '2023-02-20T14:45:00Z',
    status: 'completed',
    type: 'booking',
    reference: 'PAY-234567',
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN-234567'
  },
  // Add more mock data as needed
];

// New function to match the function signature used in components
export const fetchPaymentHistory = async (userId: string): Promise<PaymentHistory[]> => {
  console.log(`Fetching payment history for user ${userId}`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockPaymentHistory.filter(record => record.userId === userId);
};

// Keep the original mock data function as well
export const getMockPaymentHistory = (userId: string): PaymentHistory[] => {
  return mockPaymentHistory.filter(record => record.userId === userId);
};

// Mock provider earnings data
const mockProviderEarnings: ProviderEarnings[] = [
  {
    id: '1',
    providerId: 'provider1',
    periodStart: '2023-01-01T00:00:00Z',
    periodEnd: '2023-01-31T23:59:59Z',
    totalEarnings: 5000,
    totalBookings: 25,
    commissionPaid: 500,
    netEarnings: 4500,
    payoutStatus: 'paid',
    payoutDate: '2023-02-05T12:00:00Z',
    payoutReference: 'PAYOUT-123456',
    createdAt: '2023-02-05T12:00:00Z',
    updatedAt: '2023-02-05T12:00:00Z'
  },
  {
    id: '2',
    providerId: 'provider1',
    periodStart: '2023-02-01T00:00:00Z',
    periodEnd: '2023-02-28T23:59:59Z',
    totalEarnings: 6200,
    totalBookings: 31,
    commissionPaid: 620,
    netEarnings: 5580,
    payoutStatus: 'processing',
    payoutDate: '2023-03-05T12:00:00Z',
    payoutReference: 'PAYOUT-234567',
    createdAt: '2023-03-05T12:00:00Z',
    updatedAt: '2023-03-05T12:00:00Z'
  }
];

export const getProviderEarnings = (providerId: string): ProviderEarnings[] => {
  return mockProviderEarnings.filter(record => record.providerId === providerId);
};

// Mock provider payouts data
const mockProviderPayouts: ProviderPayout[] = [
  {
    id: '1',
    providerId: 'provider1',
    amount: 4500,
    fee: 45,
    netAmount: 4455,
    paymentMethod: 'bank_transfer',
    status: 'completed',
    reference: 'PAYOUT-123456',
    bankDetails: {
      accountName: 'Provider Name',
      accountNumber: '1234567890',
      bankName: 'First National Bank'
    },
    processedAt: '2023-02-05T12:00:00Z',
    createdAt: '2023-02-01T10:00:00Z',
    updatedAt: '2023-02-05T12:00:00Z'
  },
  {
    id: '2',
    providerId: 'provider1',
    amount: 5580,
    fee: 55.80,
    netAmount: 5524.20,
    paymentMethod: 'mobile_money',
    status: 'processing',
    reference: 'PAYOUT-234567',
    mobilePaymentDetails: {
      phoneNumber: '+264 81 123 4567',
      provider: 'MTC'
    },
    processedAt: '2023-03-05T12:00:00Z',
    createdAt: '2023-03-01T10:00:00Z',
    updatedAt: '2023-03-05T12:00:00Z'
  }
];

export const getProviderPayouts = (providerId: string): ProviderPayout[] => {
  return mockProviderPayouts.filter(record => record.providerId === providerId);
};

// Mock transaction data for a provider's dashboard
export const getMockTransactionData = (providerId: string, numRecords: number = 10) => {
  const transactionTypes = ['booking', 'payout', 'refund'];
  const statuses = ['pending', 'completed', 'failed'];
  const paymentMethods = ['e_wallet', 'bank_transfer', 'mobile_money', 'credit_card'];
  
  const transactions = [];
  
  for (let i = 0; i < numRecords; i++) {
    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const amount = Math.floor(Math.random() * 1000) + 100;
    
    transactions.push({
      id: `transaction-${i + 1}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      description: `${type === 'booking' ? 'Payment received' : type === 'payout' ? 'Payout to bank' : 'Refund issued'}`,
      amount: type === 'refund' ? -amount : amount,
      type,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    });
  }
  
  return transactions;
};
