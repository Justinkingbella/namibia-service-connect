
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PaymentHistory, Dispute } from '@/types/payments';

// Fetch payment history for a user
export async function fetchPaymentHistory(userId: string): Promise<PaymentHistory[]> {
  try {
    const { data, error } = await supabase
      .from('payment_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payment history:', error);
      toast.error('Failed to load payment history');
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      transactionType: item.booking_id ? 'booking' : 'subscription',
      amount: item.amount,
      status: item.status as 'pending' | 'processing' | 'completed' | 'failed' | 'refunded',
      date: item.created_at,
      paymentMethod: item.payment_method,
      description: item.description
    }));
  } catch (error) {
    console.error('Error in fetchPaymentHistory:', error);
    toast.error('Failed to load payment history');
    return [];
  }
}

// Fetch disputes for a user
export async function fetchUserDisputes(userId: string): Promise<Dispute[]> {
  try {
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .or(`customer_id.eq.${userId},provider_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching disputes:', error);
      toast.error('Failed to load disputes');
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      bookingId: item.booking_id,
      customerId: item.customer_id,
      providerId: item.provider_id,
      status: item.status as 'open' | 'under_review' | 'resolved' | 'declined',
      reason: item.subject,
      description: item.description,
      evidenceUrls: [],
      resolution: item.resolution,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  } catch (error) {
    console.error('Error in fetchUserDisputes:', error);
    toast.error('Failed to load disputes');
    return [];
  }
}

// Create a new dispute
export async function createDispute(dispute: Omit<Dispute, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dispute | null> {
  try {
    const { data, error } = await supabase
      .from('disputes')
      .insert([{
        booking_id: dispute.bookingId,
        customer_id: dispute.customerId,
        provider_id: dispute.providerId,
        subject: dispute.reason,
        description: dispute.description,
        status: dispute.status || 'open'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating dispute:', error);
      toast.error('Failed to create dispute');
      return null;
    }

    toast.success('Dispute submitted successfully');
    
    return {
      id: data.id,
      bookingId: data.booking_id,
      customerId: data.customer_id,
      providerId: data.provider_id,
      status: data.status as 'open' | 'under_review' | 'resolved' | 'declined',
      reason: data.subject,
      description: data.description,
      evidenceUrls: [],
      resolution: data.resolution,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  } catch (error) {
    console.error('Error in createDispute:', error);
    toast.error('Failed to create dispute');
    return null;
  }
}
