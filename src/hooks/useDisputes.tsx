
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Dispute } from '@/types/booking';
import { toast } from 'sonner';

export function useDisputes() {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all disputes related to the current user
  const fetchDisputes = async () => {
    if (!user) {
      setDisputes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase.from('disputes').select('*');
      
      if (user.role === 'customer') {
        query = query.eq('customer_id', user.id);
      } else if (user.role === 'provider') {
        query = query.eq('provider_id', user.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match our Dispute type
      const formattedDisputes: Dispute[] = data.map(dispute => ({
        id: dispute.id,
        bookingId: dispute.booking_id,
        customerId: dispute.customer_id,
        providerId: dispute.provider_id,
        subject: dispute.subject,
        description: dispute.description,
        status: dispute.status,
        resolution: dispute.resolution,
        createdAt: new Date(dispute.created_at),
        updatedAt: new Date(dispute.updated_at),
        priority: dispute.priority,
        evidenceUrls: dispute.evidence_urls,
        refundAmount: dispute.refund_amount,
        reason: dispute.reason
      }));

      setDisputes(formattedDisputes);
    } catch (err) {
      console.error('Error fetching disputes:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch disputes'));
    } finally {
      setLoading(false);
    }
  };

  // Create a new dispute
  const createDispute = async (disputeData: Omit<Dispute, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('You must be logged in to create a dispute');
      return null;
    }

    try {
      const newDispute = {
        booking_id: disputeData.bookingId,
        customer_id: disputeData.customerId,
        provider_id: disputeData.providerId,
        subject: disputeData.subject,
        description: disputeData.description,
        status: 'pending',
        priority: disputeData.priority || 'medium',
        evidence_urls: disputeData.evidenceUrls || [],
        refund_amount: disputeData.refundAmount || 0,
        reason: disputeData.reason
      };

      const { data, error } = await supabase
        .from('disputes')
        .insert([newDispute])
        .select();

      if (error) throw error;

      // Add new dispute to state
      setDisputes(prev => [...prev, {
        ...disputeData,
        id: data[0].id,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }]);

      toast.success('Dispute submitted successfully');
      return data[0].id;
    } catch (err) {
      console.error('Error creating dispute:', err);
      toast.error('Failed to submit dispute');
      return null;
    }
  };

  // Update an existing dispute
  const updateDispute = async (disputeId: string, updates: Partial<Dispute>) => {
    if (!user) {
      toast.error('You must be logged in to update a dispute');
      return false;
    }

    try {
      const updateData: any = {};
      
      if (updates.status) updateData.status = updates.status;
      if (updates.resolution) updateData.resolution = updates.resolution;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.evidenceUrls) updateData.evidence_urls = updates.evidenceUrls;
      if (updates.refundAmount !== undefined) updateData.refund_amount = updates.refundAmount;
      if (updates.reason) updateData.reason = updates.reason;
      
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('disputes')
        .update(updateData)
        .eq('id', disputeId);

      if (error) throw error;

      // Update the dispute in local state
      setDisputes(prev => prev.map(dispute => 
        dispute.id === disputeId 
          ? { ...dispute, ...updates, updatedAt: new Date() }
          : dispute
      ));

      toast.success('Dispute updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating dispute:', err);
      toast.error('Failed to update dispute');
      return false;
    }
  };

  // Load disputes when the user changes
  useEffect(() => {
    fetchDisputes();
  }, [user?.id]);

  return {
    disputes,
    loading,
    error,
    fetchDisputes,
    createDispute,
    updateDispute
  };
}
