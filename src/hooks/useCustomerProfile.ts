import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Customer } from '@/types/auth';
import { toast } from 'sonner';

export function useCustomerProfile() {
  const { user } = useAuth();
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchCustomerData = async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setCustomerData(data);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        toast.error('Failed to load customer profile');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [user?.id]);

  const updateCustomerData = async (newData: Partial<Customer>) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('customers')
        .update(newData)
        .eq('id', user.id);

      if (error) throw error;

      setCustomerData(prev => prev ? { ...prev, ...newData } : null);
      return true;
    } catch (error) {
      console.error('Error updating customer data:', error);
      return false;
    }
  };

  return { customerData, loading, updateCustomerData };
}