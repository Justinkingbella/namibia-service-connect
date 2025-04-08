
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { PaymentMethod, PaymentMethodType } from '@/types/payments';

export function usePaymentMethods() {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setPaymentMethods([]);
      setLoading(false);
      return;
    }

    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        // Convert fetched data to match PaymentMethod type
        const methods: PaymentMethod[] = data.map(item => ({
          id: item.id,
          userId: item.user_id,
          name: item.name,
          type: item.type as PaymentMethodType, // Ensure correct typing
          details: typeof item.details === 'string' ? JSON.parse(item.details) : item.details,
          isDefault: item.is_default,
          createdAt: item.created_at
        }));

        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast({
          title: 'Error',
          description: 'Failed to load payment methods',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [user, toast]);

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'createdAt' | 'userId'>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const newMethod = {
        user_id: user.id,
        name: method.name,
        type: method.type as string, // Ensure it's a string for DB
        details: method.details,
        is_default: method.isDefault
      };

      const { data, error } = await supabase
        .from('payment_methods')
        .insert(newMethod)
        .select()
        .single();

      if (error) throw error;

      const createdMethod: PaymentMethod = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        type: data.type as PaymentMethodType,
        details: data.details,
        isDefault: data.is_default,
        createdAt: data.created_at
      };

      setPaymentMethods(prev => [...prev, createdMethod]);
      toast({
        title: 'Success',
        description: 'Payment method added successfully'
      });

      return createdMethod;
    } catch (error: any) {
      console.error('Error adding payment method:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add payment method',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updatePaymentMethod = async (id: string, method: Partial<PaymentMethod>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      // Convert to database format (snake_case)
      const methodUpdate: any = {};
      if (method.name) methodUpdate.name = method.name;
      if (method.type) methodUpdate.type = method.type as string;
      if (method.details) methodUpdate.details = method.details;
      if (method.isDefault !== undefined) methodUpdate.is_default = method.isDefault;

      const { error } = await supabase
        .from('payment_methods')
        .update(methodUpdate)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setPaymentMethods(prev => 
        prev.map(item => 
          item.id === id ? { ...item, ...method } : item
        )
      );

      toast({
        title: 'Success',
        description: 'Payment method updated successfully'
      });

      return true;
    } catch (error: any) {
      console.error('Error updating payment method:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update payment method',
        variant: 'destructive'
      });
      return false;
    }
  };

  const removePaymentMethod = async (id: string) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setPaymentMethods(prev => prev.filter(method => method.id !== id));

      toast({
        title: 'Success',
        description: 'Payment method removed successfully'
      });

      return true;
    } catch (error: any) {
      console.error('Error removing payment method:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove payment method',
        variant: 'destructive'
      });
      return false;
    }
  };

  return { 
    paymentMethods, 
    loading, 
    addPaymentMethod, 
    updatePaymentMethod, 
    removePaymentMethod 
  };
}
