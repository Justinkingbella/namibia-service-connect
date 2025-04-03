
import { supabase } from '@/integrations/supabase/client';
import { PaymentHistory, ProviderEarnings, ProviderPayout } from '@/types/payments';

// Function to fetch payment history for a user
export const fetchPaymentHistory = async (userId: string): Promise<PaymentHistory[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payment history:', error);
      throw new Error(error.message);
    }

    return data.map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      amount: item.amount,
      description: item.description,
      date: new Date(item.created_at),
      status: item.status,
      type: item.payment_method,
      reference: item.transaction_id
    }));
  } catch (error) {
    console.error('Unexpected error in fetchPaymentHistory:', error);
    throw error;
  }
};

// Function to fetch provider earnings
export const fetchProviderEarnings = async (providerId: string): Promise<ProviderEarnings[]> => {
  try {
    const { data, error } = await supabase
      .from('provider_earnings')
      .select('*')
      .eq('provider_id', providerId)
      .order('period_end', { ascending: false });

    if (error) {
      console.error('Error fetching provider earnings:', error);
      throw new Error(error.message);
    }

    return data.map((item: any) => ({
      id: item.id,
      providerId: item.provider_id,
      periodStart: new Date(item.period_start),
      periodEnd: new Date(item.period_end),
      totalEarnings: item.total_earnings,
      totalBookings: item.total_bookings,
      commissionPaid: item.commission_paid,
      netEarnings: item.net_earnings,
      payoutStatus: item.payout_status,
      payoutDate: item.payout_date ? new Date(item.payout_date) : undefined,
      payoutReference: item.payout_reference,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  } catch (error) {
    console.error('Unexpected error in fetchProviderEarnings:', error);
    throw error;
  }
};

// Function to fetch provider payouts
export const fetchProviderPayouts = async (providerId: string): Promise<ProviderPayout[]> => {
  try {
    const { data, error } = await supabase
      .from('provider_payouts')
      .select('*')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching provider payouts:', error);
      throw new Error(error.message);
    }

    return data.map((item: any) => ({
      id: item.id,
      providerId: item.provider_id,
      amount: item.amount,
      fee: item.fee,
      netAmount: item.net_amount,
      paymentMethod: item.payment_method,
      status: item.status,
      reference: item.reference_number,
      bankDetails: item.bank_account_details,
      mobilePaymentDetails: item.mobile_payment_details,
      notes: item.notes,
      processedAt: item.processed_at ? new Date(item.processed_at) : undefined,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  } catch (error) {
    console.error('Unexpected error in fetchProviderPayouts:', error);
    throw error;
  }
};
