
import { 
  PaymentHistory, 
  ProviderEarnings, 
  ProviderPayout 
} from '@/types/payments';

// Mock payment history data
export const getMockPaymentHistory = async (userId: string): Promise<PaymentHistory[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Create mock payment history data
  const paymentHistory: PaymentHistory[] = [
    {
      id: 'payment1',
      userId: userId,
      amount: 150,
      description: 'Payment for cleaning service',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      status: 'completed',
      type: 'booking',
      reference: 'ref123',
      bookingId: 'book123',
      paymentMethod: 'credit_card',
      transactionId: 'tx123'
    },
    {
      id: 'payment2',
      userId: userId,
      amount: 200,
      description: 'Payment for plumbing service',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
      status: 'completed',
      type: 'booking',
      reference: 'ref456',
      bookingId: 'book456',
      paymentMethod: 'e_wallet',
      transactionId: 'tx456'
    },
    {
      id: 'payment3',
      userId: userId,
      amount: 50,
      description: 'Refund for canceled service',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      status: 'completed',
      type: 'refund',
      reference: 'ref789',
      bookingId: 'book789',
      paymentMethod: 'e_wallet',
      transactionId: 'tx789'
    }
  ];

  return paymentHistory;
};

// Process a payment
export const processPayment = async (userId: string, bookingId: string, amount: number, paymentMethod: string): Promise<{success: boolean; paymentId?: string; error?: string}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  try {
    // In a real app, this would call a payment gateway API
    console.log(`Processing payment: User ${userId}, Booking ${bookingId}, Amount ${amount}, Method ${paymentMethod}`);
    
    // Simulate successful payment (95% success rate)
    const isSuccessful = Math.random() > 0.05;
    
    if (isSuccessful) {
      // Create a new payment record
      const paymentRecord: PaymentHistory = {
        id: `payment-${Date.now()}`,
        userId: userId,
        bookingId: bookingId,
        amount: amount,
        description: `Payment for booking #${bookingId.substring(0, 5)}`,
        createdAt: new Date().toISOString(),
        status: 'completed',
        type: 'booking',
        reference: `REF-${Date.now().toString().substring(5)}`,
        paymentMethod: paymentMethod,
        transactionId: `TX-${Date.now()}`
      };
      
      // In a real app, you'd save this to the database
      
      return {
        success: true,
        paymentId: paymentRecord.id
      };
    } else {
      return {
        success: false,
        error: 'Payment processing failed. Please try again or use a different payment method.'
      };
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while processing your payment.'
    };
  }
};

// Create refund
export const processRefund = async (userId: string, bookingId: string, amount: number, reason: string): Promise<{success: boolean; refundId?: string; error?: string}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // In a real app, this would call a payment gateway API refund endpoint
    console.log(`Processing refund: User ${userId}, Booking ${bookingId}, Amount ${amount}, Reason: ${reason}`);
    
    // Simulate successful refund (98% success rate)
    const isSuccessful = Math.random() > 0.02;
    
    if (isSuccessful) {
      // Create a new refund record
      const refundRecord: PaymentHistory = {
        id: `refund-${Date.now()}`,
        userId: userId,
        bookingId: bookingId,
        amount: amount,
        description: `Refund for booking #${bookingId.substring(0, 5)}: ${reason}`,
        createdAt: new Date().toISOString(), 
        status: 'completed',
        type: 'refund',
        reference: `REF-${Date.now().toString().substring(5)}`,
        paymentMethod: 'original_payment_method',
        transactionId: `TX-R-${Date.now()}`
      };
      
      // In a real app, you'd save this to the database
      
      return {
        success: true,
        refundId: refundRecord.id
      };
    } else {
      return {
        success: false,
        error: 'Refund processing failed. Please try again later.'
      };
    }
  } catch (error) {
    console.error('Error processing refund:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while processing the refund.'
    };
  }
};

// Get provider earnings
export const getProviderEarnings = async (providerId: string): Promise<ProviderEarnings[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  // Create mock earnings data
  const earnings: ProviderEarnings[] = [
    {
      id: 'earnings1',
      providerId: providerId,
      periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(), // Start of current month
      periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(), // End of current month
      totalEarnings: 5200,
      totalBookings: 12,
      commissionPaid: 520,
      netEarnings: 4680,
      payoutStatus: 'pending',
      payoutDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5).toISOString(), // 5th of next month
      payoutReference: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'earnings2',
      providerId: providerId,
      periodStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString(), // Start of last month
      periodEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString(), // End of last month
      totalEarnings: 4800,
      totalBookings: 10,
      commissionPaid: 480,
      netEarnings: 4320,
      payoutStatus: 'completed',
      payoutDate: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString(), // 5th of current month
      payoutReference: 'PO-12345',
      createdAt: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      updatedAt: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString()
    }
  ];
  
  return earnings;
};

// Get provider payouts
export const getProviderPayouts = async (providerId: string): Promise<ProviderPayout[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create mock payout data
  const payouts: ProviderPayout[] = [
    {
      id: 'payout1',
      providerId: providerId,
      amount: 4320,
      fee: 0,
      netAmount: 4320,
      paymentMethod: 'bank_transfer',
      status: 'completed',
      reference: 'PO-12345',
      bankDetails: {
        bankName: 'First National Bank',
        accountNumber: '****6789',
        accountType: 'Checking'
      },
      notes: 'Monthly payout for April 2023',
      processedAt: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString(), // 5th of current month
      createdAt: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(), // 1st of current month
      updatedAt: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString() // 5th of current month
    },
    {
      id: 'payout2',
      providerId: providerId,
      amount: 3950,
      fee: 0,
      netAmount: 3950,
      paymentMethod: 'mobile_money',
      status: 'completed',
      reference: 'PO-67890',
      mobilePaymentDetails: {
        provider: 'MTC Money',
        phoneNumber: '+264 81 123 4567'
      },
      notes: 'Monthly payout for March 2023',
      processedAt: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 5).toISOString(), // 5th of last month
      createdAt: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString(), // 1st of last month
      updatedAt: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 5).toISOString() // 5th of last month
    }
  ];
  
  return payouts;
};
