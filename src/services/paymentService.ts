
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  fee: number;
  netAmount: number;
  transactionType: 'subscription' | 'booking' | 'payout' | string;
  paymentMethod: string;
  referenceId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderEarnings {
  id: string;
  providerId: string;
  periodStart: string;
  periodEnd: string;
  totalEarnings: number;
  totalBookings: number;
  commissionPaid: number;
  netEarnings: number;
  payoutStatus: 'pending' | 'processing' | 'completed' | 'failed';
  payoutDate?: string;
  payoutReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderPayout {
  id: string;
  providerId: string;
  amount: number;
  fee: number;
  netAmount: number;
  paymentMethod: string;
  bankAccountDetails?: Record<string, any>;
  mobilePaymentDetails?: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedAt?: string;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Fetch user's payment transactions
export async function fetchUserTransactions(userId: string): Promise<PaymentTransaction[]> {
  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payment transactions:', error);
    toast.error('Failed to load payment history');
    return [];
  }

  return data.map(transformPaymentTransaction);
}

// Fetch provider earnings
export async function fetchProviderEarnings(providerId: string): Promise<ProviderEarnings[]> {
  const { data, error } = await supabase
    .from('provider_earnings')
    .select('*')
    .eq('provider_id', providerId)
    .order('period_start', { ascending: false });

  if (error) {
    console.error('Error fetching provider earnings:', error);
    toast.error('Failed to load earnings data');
    return [];
  }

  return data.map(transformProviderEarnings);
}

// Fetch provider payouts
export async function fetchProviderPayouts(providerId: string): Promise<ProviderPayout[]> {
  const { data, error } = await supabase
    .from('provider_payouts')
    .select('*')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching provider payouts:', error);
    toast.error('Failed to load payout history');
    return [];
  }

  return data.map(transformProviderPayout);
}

// Record a new payment transaction
export async function recordPaymentTransaction(
  transaction: Omit<PaymentTransaction, 'id' | 'createdAt' | 'updatedAt'>
): Promise<PaymentTransaction | null> {
  const { data, error } = await supabase
    .from('payment_transactions')
    .insert([{
      user_id: transaction.userId,
      amount: transaction.amount,
      fee: transaction.fee,
      net_amount: transaction.netAmount,
      transaction_type: transaction.transactionType,
      payment_method: transaction.paymentMethod,
      reference_id: transaction.referenceId,
      status: transaction.status,
      description: transaction.description,
      metadata: transaction.metadata
    }])
    .select()
    .single();

  if (error) {
    console.error('Error recording payment transaction:', error);
    toast.error('Failed to record payment');
    return null;
  }

  return transformPaymentTransaction(data);
}

// Request a payout for a provider
export async function requestPayout(
  payout: Omit<ProviderPayout, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'processedAt'>
): Promise<ProviderPayout | null> {
  const { data, error } = await supabase
    .from('provider_payouts')
    .insert([{
      provider_id: payout.providerId,
      amount: payout.amount,
      fee: payout.fee,
      net_amount: payout.netAmount,
      payment_method: payout.paymentMethod,
      bank_account_details: payout.bankAccountDetails,
      mobile_payment_details: payout.mobilePaymentDetails,
      notes: payout.notes
    }])
    .select()
    .single();

  if (error) {
    console.error('Error requesting payout:', error);
    toast.error('Failed to request payout');
    return null;
  }

  return transformProviderPayout(data);
}

// Calculate provider earnings for a specific period
export async function calculateEarningsForPeriod(
  providerId: string,
  startDate: string,
  endDate: string
): Promise<number> {
  const { data, error } = await supabase
    .rpc('calculate_provider_earnings', {
      provider: providerId,
      start_date: startDate,
      end_date: endDate
    });

  if (error) {
    console.error('Error calculating earnings:', error);
    toast.error('Failed to calculate earnings');
    return 0;
  }

  return data || 0;
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

    // Create earnings record
    const { data, error } = await supabase
      .from('provider_earnings')
      .insert([{
        provider_id: providerId,
        period_start: startDate,
        period_end: endDate,
        total_earnings: totalEarnings,
        total_bookings: count || 0,
        commission_paid: commissionPaid,
        net_earnings: netEarnings
      }])
      .select()
      .single();

    if (error) throw error;
    
    return transformProviderEarnings(data);
  } catch (error) {
    console.error('Error generating earnings report:', error);
    toast.error('Failed to generate earnings report');
    return null;
  }
}

// Helper functions to transform database records to our interfaces
function transformPaymentTransaction(record: any): PaymentTransaction {
  return {
    id: record.id,
    userId: record.user_id,
    amount: record.amount,
    fee: record.fee,
    netAmount: record.net_amount,
    transactionType: record.transaction_type,
    paymentMethod: record.payment_method,
    referenceId: record.reference_id,
    status: record.status,
    description: record.description,
    metadata: record.metadata,
    createdAt: record.created_at,
    updatedAt: record.updated_at
  };
}

function transformProviderEarnings(record: any): ProviderEarnings {
  return {
    id: record.id,
    providerId: record.provider_id,
    periodStart: record.period_start,
    periodEnd: record.period_end,
    totalEarnings: record.total_earnings,
    totalBookings: record.total_bookings,
    commissionPaid: record.commission_paid,
    netEarnings: record.net_earnings,
    payoutStatus: record.payout_status,
    payoutDate: record.payout_date,
    payoutReference: record.payout_reference,
    createdAt: record.created_at,
    updatedAt: record.updated_at
  };
}

function transformProviderPayout(record: any): ProviderPayout {
  return {
    id: record.id,
    providerId: record.provider_id,
    amount: record.amount,
    fee: record.fee,
    netAmount: record.net_amount,
    paymentMethod: record.payment_method,
    bankAccountDetails: record.bank_account_details,
    mobilePaymentDetails: record.mobile_payment_details,
    status: record.status,
    processedAt: record.processed_at,
    referenceNumber: record.reference_number,
    notes: record.notes,
    createdAt: record.created_at,
    updatedAt: record.updated_at
  };
}
