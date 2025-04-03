
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CustomerData {
  id: string;
  preferred_categories?: string[];
  notification_preferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  saved_services?: string[];
  recent_searches?: string[];
  created_at?: string;
  updated_at?: string;
}

export function useCustomerProfile() {
  const { user } = useAuth();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCustomerData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching customer data:', fetchError);
        setError(fetchError.message);
        if (fetchError.code !== 'PGRST116') { // No data found is not displayed as an error
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to load customer profile',
          });
        }
      } else if (data) {
        setCustomerData(data);
      }
    } catch (err: any) {
      console.error('Unexpected error in fetchCustomerData:', err);
      setError(err.message || 'An unexpected error occurred');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred while loading your profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCustomerData = async (
    updatedData: Partial<CustomerData>
  ): Promise<boolean> => {
    if (!user?.id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to update your profile',
      });
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Add updated_at timestamp
      const dataToUpdate = {
        ...updatedData,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('customers')
        .update(dataToUpdate)
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Refetch to get the latest data
      await fetchCustomerData();
      
      toast({
        title: 'Profile updated',
        description: 'Your customer profile has been updated successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error updating customer data:', err);
      setError(err.message || 'Failed to update profile');
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: err.message || 'There was an error updating your profile',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCustomerData();
  }, [user?.id]);

  // Function to manually refetch data
  const refreshData = () => {
    fetchCustomerData();
  };

  return {
    customerData,
    loading,
    error,
    updateCustomerData,
    refreshData,
  };
}
