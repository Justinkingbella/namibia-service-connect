
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProviderVerificationStatus } from '@/types/auth';

export interface ProviderData {
  id: string;
  business_name?: string;
  business_description?: string;
  business_logo?: string;
  business_address?: string;
  business_hours?: Record<string, any>;
  categories?: string[];
  verification_status?: ProviderVerificationStatus | string;
  verification_documents?: string[];
  rating?: number;
  review_count?: number;
  bank_details?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export function useProviderProfile() {
  const { user } = useAuth();
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProviderData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First ensure the provider exists
      const { data: providerExists, error: checkError } = await supabase
        .from('service_providers')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        // Provider doesn't exist, create it
        const { data: newProvider, error: createError } = await supabase
          .from('service_providers')
          .insert([
            { 
              id: user.id,
              business_name: '',
              verification_status: 'pending',
              rating: 0,
              review_count: 0
            }
          ])
          .select()
          .single();

        if (createError) throw createError;
        if (newProvider) return newProvider;
      }

      // Now fetch the full provider data
      const { data, error: fetchError } = await supabase
        .from('service_providers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching provider data:', fetchError);
        setError(fetchError.message);
        if (fetchError.code !== 'PGRST116') {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to load provider profile',
          });
        }
      } else if (data) {
        setProviderData(data as ProviderData);
      }
    } catch (err: any) {
      console.error('Unexpected error in fetchProviderData:', err);
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

  const updateProviderData = async (
    updatedData: Partial<ProviderData>
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

      const dataToUpdate = {
        ...updatedData,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('service_providers')
        .update(dataToUpdate)
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Refetch to get the latest data
      await fetchProviderData();
      
      toast({
        title: 'Profile updated',
        description: 'Your provider profile has been updated successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error updating provider data:', err);
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
    fetchProviderData();
  }, [user?.id]);

  return {
    providerData,
    loading,
    error,
    updateProviderData,
    refreshData: fetchProviderData,
  };
}
