
import { PaymentHistory, PaymentMethod, ProviderEarnings, ProviderPayout } from "@/types/payments";

// Mock function to get payment history
export const getMockPaymentHistory = (userId: string): Promise<PaymentHistory[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const mockData: PaymentHistory[] = [
        {
          id: '1',
          userId: userId,
          amount: 250.00,
          description: 'Payment for House Cleaning Service',
          date: new Date().toISOString(),
          status: 'completed',
          type: 'payment',
          reference: 'PAY-123456789',
          paymentMethod: 'Credit Card',
          transactionId: 'TXID-123456',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          userId: userId,
          amount: 125.50,
          description: 'Subscription Plan Renewal - Basic',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          status: 'completed',
          type: 'subscription',
          reference: 'SUB-123456789',
          paymentMethod: 'Wallet',
          transactionId: 'TXID-234567',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          userId: userId,
          amount: 175.00,
          description: 'Plumbing Repair Service',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
          status: 'pending',
          type: 'payment',
          reference: 'PAY-345678901',
          paymentMethod: 'Bank Transfer',
          transactionId: 'TXID-345678',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          userId: userId,
          amount: 50.00,
          description: 'Refund for Cancelled Service',
          date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
          status: 'completed',
          type: 'refund',
          reference: 'REF-123456789',
          paymentMethod: 'Credit Card',
          transactionId: 'TXID-456789',
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '5',
          userId: userId,
          amount: 350.00,
          description: 'Home Renovation Consultation',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          status: 'failed',
          type: 'payment',
          reference: 'PAY-567890123',
          paymentMethod: 'Debit Card',
          transactionId: 'TXID-567890',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      resolve(mockData);
    }, 800); // Simulate network delay
  });
};

// Mock function to get payment methods
export const getMockPaymentMethods = (userId: string): Promise<PaymentMethod[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: PaymentMethod[] = [
        {
          id: '1',
          userId: userId,
          name: 'Visa Card ending in 4242',
          type: 'credit_card',
          details: {
            lastFour: '4242',
            expiryMonth: 12,
            expiryYear: 2025,
            cardType: 'Visa'
          },
          isDefault: true,
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          userId: userId,
          name: 'Mastercard ending in 5678',
          type: 'debit_card',
          details: {
            lastFour: '5678',
            expiryMonth: 9,
            expiryYear: 2024,
            cardType: 'Mastercard'
          },
          isDefault: false,
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          userId: userId,
          name: 'MTC Wallet',
          type: 'e_wallet',
          details: {
            walletId: 'MTC-12345678',
            provider: 'MTC'
          },
          isDefault: false,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      resolve(mockData);
    }, 600);
  });
};

// Mock function to get provider earnings
export const getMockProviderEarnings = (providerId: string): Promise<ProviderEarnings[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: ProviderEarnings[] = [
        {
          id: '1',
          providerId: providerId,
          periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          periodEnd: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          totalEarnings: 1250.00,
          totalBookings: 12,
          commissionPaid: 125.00,
          netEarnings: 1125.00,
          payoutStatus: 'completed',
          payoutDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          payoutReference: 'POUT-12345',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          providerId: providerId,
          periodStart: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          periodEnd: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          totalEarnings: 950.00,
          totalBookings: 9,
          commissionPaid: 95.00,
          netEarnings: 855.00,
          payoutStatus: 'completed',
          payoutDate: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString(),
          payoutReference: 'POUT-23456',
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          providerId: providerId,
          periodStart: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          periodEnd: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
          totalEarnings: 1680.00,
          totalBookings: 15,
          commissionPaid: 168.00,
          netEarnings: 1512.00,
          payoutStatus: 'completed',
          payoutDate: new Date(Date.now() - 74 * 24 * 60 * 60 * 1000).toISOString(),
          payoutReference: 'POUT-34567',
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 74 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      resolve(mockData);
    }, 700);
  });
};

// Mock function to get provider payouts
export const getMockProviderPayouts = (providerId: string): Promise<ProviderPayout[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: ProviderPayout[] = [
        {
          id: '1',
          providerId: providerId,
          amount: 1125.00,
          fee: 5.00,
          netAmount: 1120.00,
          paymentMethod: 'Bank Transfer',
          status: 'completed',
          reference: 'POUT-12345',
          bankDetails: {
            bankName: 'First National Bank',
            accountNumber: '****6789',
            accountType: 'Savings'
          },
          mobilePaymentDetails: {},
          notes: 'Monthly payout for April',
          processedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          providerId: providerId,
          amount: 855.00,
          fee: 5.00,
          netAmount: 850.00,
          paymentMethod: 'Mobile Money',
          status: 'completed',
          reference: 'POUT-23456',
          bankDetails: {},
          mobilePaymentDetails: {
            provider: 'MTC',
            phoneNumber: '****7890'
          },
          notes: 'Monthly payout for March',
          processedAt: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          providerId: providerId,
          amount: 1512.00,
          fee: 5.00,
          netAmount: 1507.00,
          paymentMethod: 'Bank Transfer',
          status: 'completed',
          reference: 'POUT-34567',
          bankDetails: {
            bankName: 'Bank Windhoek',
            accountNumber: '****4321',
            accountType: 'Current'
          },
          mobilePaymentDetails: {},
          notes: 'Monthly payout for February',
          processedAt: new Date(Date.now() - 74 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 76 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 74 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      resolve(mockData);
    }, 700);
  });
};
