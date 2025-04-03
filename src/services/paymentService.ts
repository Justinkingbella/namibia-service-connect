
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

// Function to generate a provider earnings report for a specific date range
export const generateEarningsReport = async (
  providerId: string, 
  startDate: string, 
  endDate: string
): Promise<ProviderEarnings> => {
  try {
    // First check if a report for this period already exists
    const { data: existingReport, error: checkError } = await supabase
      .from('provider_earnings')
      .select('*')
      .eq('provider_id', providerId)
      .eq('period_start', startDate)
      .eq('period_end', endDate)
      .single();

    if (existingReport) {
      return {
        id: existingReport.id,
        providerId: existingReport.provider_id,
        periodStart: new Date(existingReport.period_start),
        periodEnd: new Date(existingReport.period_end),
        totalEarnings: existingReport.total_earnings,
        totalBookings: existingReport.total_bookings,
        commissionPaid: existingReport.commission_paid,
        netEarnings: existingReport.net_earnings,
        payoutStatus: existingReport.payout_status,
        payoutDate: existingReport.payout_date ? new Date(existingReport.payout_date) : undefined,
        payoutReference: existingReport.payout_reference,
        createdAt: new Date(existingReport.created_at),
        updatedAt: new Date(existingReport.updated_at)
      };
    }

    // Get all completed bookings for the period
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('provider_id', providerId)
      .eq('status', 'completed')
      .gte('date', startDate)
      .lte('date', endDate);

    if (bookingsError) {
      throw new Error(`Error fetching bookings: ${bookingsError.message}`);
    }

    const totalBookings = bookings?.length || 0;
    const totalEarnings = bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;
    const commissionRate = 0.10; // 10% commission rate
    const commissionPaid = totalEarnings * commissionRate;
    const netEarnings = totalEarnings - commissionPaid;

    // Create a new earnings report
    const { data: newReport, error: insertError } = await supabase
      .from('provider_earnings')
      .insert({
        provider_id: providerId,
        period_start: startDate,
        period_end: endDate,
        total_earnings: totalEarnings,
        total_bookings: totalBookings,
        commission_paid: commissionPaid,
        net_earnings: netEarnings,
        payout_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Error creating earnings report: ${insertError.message}`);
    }

    return {
      id: newReport.id,
      providerId: newReport.provider_id,
      periodStart: new Date(newReport.period_start),
      periodEnd: new Date(newReport.period_end),
      totalEarnings: newReport.total_earnings,
      totalBookings: newReport.total_bookings,
      commissionPaid: newReport.commission_paid,
      netEarnings: newReport.net_earnings,
      payoutStatus: newReport.payout_status,
      payoutDate: newReport.payout_date ? new Date(newReport.payout_date) : undefined,
      payoutReference: newReport.payout_reference,
      createdAt: new Date(newReport.created_at),
      updatedAt: new Date(newReport.updated_at)
    };
    
  } catch (error) {
    console.error('Error generating earnings report:', error);
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
