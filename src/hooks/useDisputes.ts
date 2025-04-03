
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dispute } from '@/types/booking';

export function useDisputes() {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDisputes = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Determine which field to filter by based on user role
      const filterField = user.role === 'provider' ? 'provider_id' : 'customer_id';

      const { data, error: fetchError } = await supabase
        .from('disputes')
        .select('*')
        .eq(filterField, user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching disputes:', fetchError);
        setError(fetchError.message);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load disputes',
        });
      } else {
        // Transform data to match Dispute type
        const transformedDisputes: Dispute[] = data.map(item => ({
          id: item.id,
          bookingId: item.booking_id,
          customerId: item.customer_id,
          providerId: item.provider_id,
          subject: item.subject,
          description: item.description,
          status: item.status,
          resolution: item.resolution,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
          priority: item.priority,
          evidenceUrls: item.evidence_urls || [],
          refundAmount: item.refund_amount,
          reason: item.reason
        }));
        
        setDisputes(transformedDisputes);
      }
    } catch (err: any) {
      console.error('Unexpected error in fetchDisputes:', err);
      setError(err.message || 'An unexpected error occurred');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred while loading disputes',
      });
    } finally {
      setLoading(false);
    }
  };

  const createDispute = async (disputeData: Partial<Dispute>): Promise<boolean> => {
    if (!user?.id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to create a dispute',
      });
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Transform data to match database structure
      const dataToInsert = {
        booking_id: disputeData.bookingId,
        customer_id: user.role === 'customer' ? user.id : disputeData.customerId,
        provider_id: user.role === 'provider' ? user.id : disputeData.providerId,
        subject: disputeData.subject,
        description: disputeData.description,
        status: 'pending',
        priority: disputeData.priority || 'medium',
        evidence_urls: disputeData.evidenceUrls || [],
        refund_amount: disputeData.refundAmount || 0,
        reason: disputeData.reason
      };

      const { error: insertError } = await supabase
        .from('disputes')
        .insert([dataToInsert]);

      if (insertError) {
        throw insertError;
      }

      // Refetch to get the latest data
      await fetchDisputes();
      
      toast({
        title: 'Dispute created',
        description: 'Your dispute has been submitted successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error creating dispute:', err);
      setError(err.message || 'Failed to create dispute');
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: err.message || 'There was an error submitting your dispute',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateDisputeStatus = async (
    disputeId: string, 
    status: string, 
    resolution?: string
  ): Promise<boolean> => {
    if (!user?.id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to update a dispute',
      });
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };
      
      if (resolution) {
        updateData.resolution = resolution;
      }
      
      // If status is resolved, add resolution date
      if (status === 'resolved') {
        updateData.resolution_date = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('disputes')
        .update(updateData)
        .eq('id', disputeId);

      if (updateError) {
        throw updateError;
      }

      // Refetch to get the latest data
      await fetchDisputes();
      
      toast({
        title: 'Dispute updated',
        description: 'The dispute status has been updated successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error updating dispute:', err);
      setError(err.message || 'Failed to update dispute');
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: err.message || 'There was an error updating the dispute',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchDisputeById = async (disputeId: string): Promise<Dispute | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('disputes')
        .select('*')
        .eq('id', disputeId)
        .single();

      if (fetchError) {
        console.error('Error fetching dispute:', fetchError);
        setError(fetchError.message);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load dispute details',
        });
        return null;
      }

      // Transform data to match Dispute type
      const transformedDispute: Dispute = {
        id: data.id,
        bookingId: data.booking_id,
        customerId: data.customer_id,
        providerId: data.provider_id,
        subject: data.subject,
        description: data.description,
        status: data.status,
        resolution: data.resolution,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        priority: data.priority,
        evidenceUrls: data.evidence_urls || [],
        refundAmount: data.refund_amount,
        reason: data.reason
      };
      
      return transformedDispute;
    } catch (err: any) {
      console.error('Unexpected error in fetchDisputeById:', err);
      setError(err.message || 'An unexpected error occurred');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred while loading dispute details',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
      fetchDisputes();
    }
  }, [user?.id]);

  // Function to manually refetch data
  const refreshData = () => {
    fetchDisputes();
  };

  return {
    disputes,
    loading,
    error,
    createDispute,
    updateDisputeStatus,
    fetchDisputeById,
    refreshData,
  };
}
