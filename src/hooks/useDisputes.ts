
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dispute, DisputeStatus, DisputePriority } from '@/types/booking';

export interface DisputeFormData {
  subject: string;
  description: string;
  bookingId: string;
  evidenceUrls?: string[];
  priority?: DisputePriority;
  reason?: string;
}

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
      
      let query;
      
      if (user.role === 'admin') {
        // Admins can see all disputes
        query = supabase
          .from('disputes')
          .select('*')
          .order('created_at', { ascending: false });
      } else if (user.role === 'provider') {
        // Providers can only see disputes related to their services
        query = supabase
          .from('disputes')
          .select('*')
          .eq('provider_id', user.id)
          .order('created_at', { ascending: false });
      } else {
        // Customers can only see their own disputes
        query = supabase
          .from('disputes')
          .select('*')
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false });
      }
      
      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching disputes:', fetchError);
        setError(fetchError.message);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load disputes',
        });
      } else {
        // Convert data to match the Dispute interface
        const formattedDisputes: Dispute[] = data.map((item: any) => ({
          id: item.id,
          bookingId: item.booking_id,
          customerId: item.customer_id,
          providerId: item.provider_id,
          subject: item.subject,
          description: item.description,
          status: item.status as DisputeStatus, // Type cast to ensure compatibility
          resolution: item.resolution,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
          priority: item.priority as DisputePriority, // Type cast to ensure compatibility
          evidenceUrls: item.evidence_urls || [],
          refundAmount: item.refund_amount || 0,
          reason: item.admin_notes // Use admin_notes as reason
        }));
        
        setDisputes(formattedDisputes);
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

  const createDispute = async (data: DisputeFormData): Promise<boolean> => {
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

      // Get booking details to get provider ID
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('provider_id, customer_id')
        .eq('id', data.bookingId)
        .single();

      if (bookingError) {
        console.error('Error fetching booking data:', bookingError);
        throw new Error('Could not find booking details');
      }

      // Ensure the user is the customer of this booking
      if (bookingData.customer_id !== user.id && user.role !== 'admin') {
        throw new Error('You can only create disputes for your own bookings');
      }

      // Create the dispute record
      const disputeData = {
        booking_id: data.bookingId,
        customer_id: user.role === 'admin' ? bookingData.customer_id : user.id,
        provider_id: bookingData.provider_id,
        subject: data.subject,
        description: data.description,
        status: 'pending' as DisputeStatus,
        evidence_urls: data.evidenceUrls || [],
        priority: data.priority || 'medium' as DisputePriority,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        admin_notes: data.reason || '' // Use admin_notes for reason
      };

      const { error: insertError } = await supabase
        .from('disputes')
        .insert(disputeData);

      if (insertError) {
        throw insertError;
      }

      // Refetch to get the latest data
      await fetchDisputes();
      
      toast({
        title: 'Dispute created',
        description: 'Your dispute has been submitted',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error creating dispute:', err);
      setError(err.message || 'Failed to create dispute');
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: err.message || 'There was an error creating your dispute',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateDisputeStatus = async (
    disputeId: string, 
    status: DisputeStatus, 
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

      // Check if the user has permission to update this dispute
      if (user.role !== 'admin') {
        const { data: disputeData, error: disputeError } = await supabase
          .from('disputes')
          .select('*')
          .eq('id', disputeId)
          .single();

        if (disputeError) {
          throw disputeError;
        }

        // Only the provider or admin can update dispute status
        if (user.role === 'provider' && disputeData.provider_id !== user.id) {
          throw new Error('You can only update disputes for your own services');
        }

        // Customers cannot change dispute status
        if (user.role === 'customer') {
          throw new Error('Customers cannot update dispute status');
        }
      }

      // Update the dispute status
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (resolution) {
        updateData.resolution = resolution;
      }

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
        description: `Dispute status updated to ${status}`,
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

  // Initial fetch
  useEffect(() => {
    fetchDisputes();
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
    refreshData,
  };
}
