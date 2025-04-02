
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PaymentTransaction, ProviderEarnings, ProviderPayout } from '@/types/payments';

// Fetch user's payment transactions
export async function fetchUserTransactions(userId: string): Promise<PaymentTransaction[]> {
  try {
    const { data, error } = await supabase
      .from('payment_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payment transactions:', error);
      toast.error('Failed to load payment history');
      return [];
    }

    // Adapt the existing data format to our PaymentTransaction interface
    return data.map(record => ({
      id: record.id,
      userId: record.user_id,
      amount: record.amount,
      fee: 0, // Default value as it might not exist in current schema
      netAmount: record.amount, // Use amount as net_amount for now
      transactionType: record.booking_id ? 'booking' : 'subscription',
      paymentMethod: record.payment_method,
      referenceId: record.booking_id || record.transaction_id,
      status: record.status as 'pending' | 'processing' | 'completed' | 'failed' | 'refunded',
      description: record.description,
      metadata: {},
      createdAt: record.created_at,
      updatedAt: record.created_at // Use created_at as updated_at for now
    }));
  } catch (error) {
    console.error('Error in fetchUserTransactions:', error);
    toast.error('Failed to load payment history');
    return [];
  }
}

// Fetch provider earnings (mock implementation until table is properly available)
export async function fetchProviderEarnings(providerId: string): Promise<ProviderEarnings[]> {
  try {
    // For now, return mock data
    // This should be replaced with proper database calls once tables are synced
    return [
      {
        id: '1',
        providerId,
        periodStart: '2023-07-01',
        periodEnd: '2023-07-31',
        totalEarnings: 3250,
        totalBookings: 15,
        commissionPaid: 325,
        netEarnings: 2925,
        payoutStatus: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        providerId,
        periodStart: '2023-08-01',
        periodEnd: '2023-08-31',
        totalEarnings: 4100,
        totalBookings: 18,
        commissionPaid: 410,
        netEarnings: 3690,
        payoutStatus: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error('Error in fetchProviderEarnings:', error);
    toast.error('Failed to load earnings data');
    return [];
  }
}

// Fetch provider payouts (mock implementation until table is properly available)
export async function fetchProviderPayouts(providerId: string): Promise<ProviderPayout[]> {
  try {
    // For now, return mock data
    // This should be replaced with proper database calls once tables are synced
    return [
      {
        id: '1',
        providerId,
        amount: 2925,
        fee: 29.25,
        netAmount: 2895.75,
        paymentMethod: 'bank_transfer',
        status: 'completed',
        processedAt: '2023-08-05T12:00:00Z',
        createdAt: '2023-08-01T10:00:00Z',
        updatedAt: '2023-08-05T12:00:00Z'
      }
    ];
  } catch (error) {
    console.error('Error in fetchProviderPayouts:', error);
    toast.error('Failed to load payout history');
    return [];
  }
}

// Record a new payment transaction
export async function recordPaymentTransaction(
  transaction: Omit<PaymentTransaction, 'id' | 'createdAt' | 'updatedAt'>
): Promise<PaymentTransaction | null> {
  try {
    const { data, error } = await supabase
      .from('payment_history')
      .insert([{
        user_id: transaction.userId,
        amount: transaction.amount,
        booking_id: transaction.referenceId,
        payment_method: transaction.paymentMethod,
        status: transaction.status,
        description: transaction.description || 'Payment transaction'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error recording payment transaction:', error);
      toast.error('Failed to record payment');
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      fee: 0,
      netAmount: data.amount,
      transactionType: data.booking_id ? 'booking' : 'subscription',
      paymentMethod: data.payment_method,
      referenceId: data.booking_id || data.transaction_id,
      status: data.status as 'pending' | 'processing' | 'completed' | 'failed' | 'refunded',
      description: data.description,
      metadata: {},
      createdAt: data.created_at,
      updatedAt: data.created_at
    };
  } catch (error) {
    console.error('Error in recordPaymentTransaction:', error);
    toast.error('Failed to record payment');
    return null;
  }
}

// Request a payout for a provider
export async function requestPayout(
  payout: Omit<ProviderPayout, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'processedAt'>
): Promise<ProviderPayout | null> {
  // Mock implementation - we'll save this as a regular payment transaction for now
  try {
    const { data, error } = await supabase
      .from('payment_history')
      .insert([{
        user_id: payout.providerId,
        amount: payout.amount,
        payment_method: payout.paymentMethod,
        status: 'pending',
        description: 'Payout request'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error requesting payout:', error);
      toast.error('Failed to request payout');
      return null;
    }

    // Convert to our ProviderPayout format
    return {
      id: data.id,
      providerId: data.user_id,
      amount: data.amount,
      fee: payout.fee || 0,
      netAmount: payout.netAmount || (data.amount - (payout.fee || 0)),
      paymentMethod: data.payment_method,
      bankAccountDetails: payout.bankAccountDetails,
      mobilePaymentDetails: payout.mobilePaymentDetails,
      status: 'pending',
      notes: payout.notes,
      createdAt: data.created_at,
      updatedAt: data.created_at
    };
  } catch (error) {
    console.error('Error in requestPayout:', error);
    toast.error('Failed to request payout');
    return null;
  }
}

// Calculate provider earnings for a specific period
export async function calculateEarningsForPeriod(
  providerId: string,
  startDate: string,
  endDate: string
): Promise<number> {
  try {
    // For now, we'll calculate this manually from bookings
    const { data, error } = await supabase
      .from('bookings')
      .select('total_amount')
      .eq('provider_id', providerId)
      .eq('payment_status', 'completed')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error('Error calculating earnings:', error);
      toast.error('Failed to calculate earnings');
      return 0;
    }

    // Sum up all booking amounts
    return data.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
  } catch (error) {
    console.error('Error in calculateEarningsForPeriod:', error);
    toast.error('Failed to calculate earnings');
    return 0;
  }
}

// Generate earnings report for a specific period
export async function generateEarningsReport(
  providerId: string,
  startDate: string,
  endDate: string
): Promise<ProviderEarnings | null> {
  try {
    // Calculate total earnings
    const totalEarnings = await calculateEarningsForPeriod(providerId, startDate, endDate);
    
    // Calculate commission (assuming 10%)
    const commissionRate = 0.1;
    const commissionPaid = totalEarnings * commissionRate;
    const netEarnings = totalEarnings - commissionPaid;

    // Count total bookings
    const { count, error: bookingError } = await supabase
      .from('bookings')
      .select('id', { count: 'exact' })
      .eq('provider_id', providerId)
      .eq('payment_status', 'completed')
      .gte('date', startDate)
      .lte('date', endDate);

    if (bookingError) {
      throw bookingError;
    }

    // Create a mock earnings report
    const reportId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    return {
      id: reportId,
      providerId,
      periodStart: startDate,
      periodEnd: endDate,
      totalEarnings,
      totalBookings: count || 0,
      commissionPaid,
      netEarnings,
      payoutStatus: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp
    };
  } catch (error) {
    console.error('Error generating earnings report:', error);
    toast.error('Failed to generate earnings report');
    return null;
  }
}

// Export the ProviderEarnings type for use in components
export type { ProviderEarnings, ProviderPayout, PaymentTransaction };
