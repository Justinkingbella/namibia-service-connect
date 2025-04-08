
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/types/payments';

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPaymentMethods = useCallback(async () => {
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

      // Convert the data to match our PaymentMethod interface
      const mappedMethods: PaymentMethod[] = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        name: item.name,
        type: item.type,
        details: typeof item.details === 'string' ? JSON.parse(item.details) : item.details,
        isDefault: item.is_default,
        createdAt: item.created_at
      }));

      setPaymentMethods(mappedMethods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment methods',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const addPaymentMethod = useCallback(async (method: Omit<PaymentMethod, "id" | "createdAt" | "userId">): Promise<PaymentMethod> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newMethod = {
        user_id: user.id,
        name: method.name,
        type: method.type,
        details: method.details,
        is_default: method.isDefault
      };

      const { data, error } = await supabase
        .from('payment_methods')
        .insert(newMethod)
        .select()
        .single();

      if (error) throw error;

      const addedMethod: PaymentMethod = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        type: data.type,
        details: typeof data.details === 'string' ? JSON.parse(data.details) : data.details,
        isDefault: data.is_default,
        createdAt: data.created_at
      };

      setPaymentMethods(prev => [...prev, addedMethod]);
      
      toast({
        title: 'Success',
        description: 'Payment method added successfully',
      });
      
      return addedMethod;
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: 'Error',
        description: 'Failed to add payment method',
        variant: 'destructive',
      });
      throw error;
    }
  }, [user, toast]);

  const updatePaymentMethod = useCallback(async (id: string, method: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Convert to snake_case for database
      const updates: any = {};
      if (method.name) updates.name = method.name;
      if (method.type) updates.type = method.type;
      if (method.details) updates.details = method.details;
      if (method.isDefault !== undefined) updates.is_default = method.isDefault;

      const { data, error } = await supabase
        .from('payment_methods')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedMethod: PaymentMethod = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        type: data.type,
        details: typeof data.details === 'string' ? JSON.parse(data.details) : data.details,
        isDefault: data.is_default,
        createdAt: data.created_at
      };

      setPaymentMethods(prev => 
        prev.map(m => m.id === id ? updatedMethod : m)
      );
      
      toast({
        title: 'Success',
        description: 'Payment method updated successfully',
      });
      
      return updatedMethod;
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment method',
        variant: 'destructive',
      });
      throw error;
    }
  }, [user, toast]);

  const removePaymentMethod = useCallback(async (id: string): Promise<boolean> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setPaymentMethods(prev => 
        prev.filter(m => m.id !== id)
      );
      
      toast({
        title: 'Success',
        description: 'Payment method removed successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error removing payment method:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove payment method',
        variant: 'destructive',
      });
      return false;
    }
  }, [user, toast]);

  return {
    paymentMethods,
    loading,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    refreshPaymentMethods: fetchPaymentMethods,
    // For compatibility with existing code
    deletePaymentMethod: removePaymentMethod,
    setDefaultPaymentMethod: (id: string) => updatePaymentMethod(id, { isDefault: true })
  };
}
