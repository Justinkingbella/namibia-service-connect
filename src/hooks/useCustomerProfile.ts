
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Customer, DbCustomerProfile } from '@/types/auth';

export interface CustomerData extends DbCustomerProfile {
  // Additional fields if needed
}

export function useCustomerProfile() {
  const { user } = useAuth();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        setCustomerData(data as CustomerData);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        toast.error('Failed to load customer data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [user?.id]);

  const updateCustomerData = async (updates: Partial<CustomerData>) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('customers')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setCustomerData(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Customer data updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating customer data:', error);
      toast.error('Failed to update customer data');
      return false;
    }
  };

  return { customerData, loading, updateCustomerData };
}
