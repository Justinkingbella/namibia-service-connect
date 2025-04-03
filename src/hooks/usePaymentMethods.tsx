
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentMethod } from '@/types/payments';
import { toast } from 'sonner';

export function usePaymentMethods() {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPaymentMethods = async () => {
    if (!user) {
      setPaymentMethods([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Convert database response to our PaymentMethod type
      const typedPaymentMethods = data.map(method => ({
        id: method.id,
        userId: method.user_id,
        name: method.name,
        type: method.type,
        details: method.details as unknown as Record<string, any>, // Type conversion for compatibility
        isDefault: method.is_default,
        createdAt: new Date(method.created_at)
      }));

      setPaymentMethods(typedPaymentMethods);
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch payment methods'));
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async (
    paymentMethodData: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>
  ) => {
    if (!user) {
      toast.error('You must be logged in to add a payment method');
      return null;
    }

    try {
      const newPaymentMethod = {
        user_id: user.id,
        name: paymentMethodData.name,
        type: paymentMethodData.type,
        details: paymentMethodData.details as any, // Type conversion for compatibility
        is_default: paymentMethodData.isDefault
      };

      const { data, error } = await supabase
        .from('payment_methods')
        .insert([newPaymentMethod])
        .select();

      if (error) throw error;

      // If this is set as default, update other payment methods
      if (paymentMethodData.isDefault) {
        await setDefaultPaymentMethod(data[0].id);
      }

      toast.success('Payment method added successfully');
      
      // Refetch payment methods to get the updated list
      await fetchPaymentMethods();
      
      return data[0];
    } catch (err) {
      console.error('Error adding payment method:', err);
      toast.error('Failed to add payment method');
      return null;
    }
  };

  const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>) => {
    if (!user) {
      toast.error('You must be logged in to update a payment method');
      return false;
    }

    try {
      const updateData: any = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.type) updateData.type = updates.type;
      if (updates.details) updateData.details = updates.details;
      if (updates.isDefault !== undefined) updateData.is_default = updates.isDefault;

      const { error } = await supabase
        .from('payment_methods')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // If this is set as default, update other payment methods
      if (updates.isDefault) {
        await setDefaultPaymentMethod(id);
      }

      toast.success('Payment method updated successfully');
      
      // Refetch payment methods to get the updated list
      await fetchPaymentMethods();
      
      return true;
    } catch (err) {
      console.error('Error updating payment method:', err);
      toast.error('Failed to update payment method');
      return false;
    }
  };

  const deletePaymentMethod = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete a payment method');
      return false;
    }

    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Payment method deleted successfully');
      
      // Update local state without refetching
      setPaymentMethods(current => current.filter(method => method.id !== id));
      
      return true;
    } catch (err) {
      console.error('Error deleting payment method:', err);
      toast.error('Failed to delete payment method');
      return false;
    }
  };

  const setDefaultPaymentMethod = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to set a default payment method');
      return false;
    }

    try {
      // First, set all payment methods to non-default
      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Then, set the selected one as default
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Default payment method updated');
      
      // Refetch payment methods to get the updated list
      await fetchPaymentMethods();
      
      return true;
    } catch (err) {
      console.error('Error setting default payment method:', err);
      toast.error('Failed to set default payment method');
      return false;
    }
  };

  // Load payment methods when the user changes
  useEffect(() => {
    fetchPaymentMethods();
  }, [user?.id]);

  return {
    paymentMethods,
    loading,
    error,
    fetchPaymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod
  };
}
