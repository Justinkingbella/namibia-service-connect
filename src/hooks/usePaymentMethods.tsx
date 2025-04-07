
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentMethod, PaymentMethodType } from '@/types';

export function usePaymentMethods() {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        // Transform the data to match the PaymentMethod interface
        const transformedData: PaymentMethod[] = data.map(item => ({
          id: item.id,
          userId: item.user_id,
          name: item.name,
          type: item.type as PaymentMethodType, // Apply type assertion
          details: item.details,
          isDefault: item.is_default || false,
          createdAt: item.created_at,
        }));
        
        setPaymentMethods(transformedData);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [user?.id]);

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>) => {
    if (!user?.id) return null;

    try {
      setLoading(true);
      
      // Check if this should be the default method
      let isDefault = method.isDefault;
      if (isDefault && paymentMethods.some(m => m.isDefault)) {
        // We need to update the existing default method
        const { error: updateError } = await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .eq('is_default', true);
          
        if (updateError) throw updateError;
      }

      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          name: method.name,
          type: method.type,
          details: method.details,
          is_default: isDefault,
        })
        .select();

      if (error) throw error;
      
      const newMethod: PaymentMethod = {
        id: data[0].id,
        userId: user.id,
        name: data[0].name,
        type: data[0].type as PaymentMethodType, // Apply type assertion
        details: data[0].details,
        isDefault: data[0].is_default,
        createdAt: data[0].created_at,
      };
      
      setPaymentMethods([...paymentMethods, newMethod]);
      return newMethod;
    } catch (error) {
      console.error('Error adding payment method:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentMethod = async (id: string, method: Partial<Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>>) => {
    if (!user?.id) return false;

    try {
      setLoading(true);
      
      // Check if this should be the default method
      if (method.isDefault) {
        // We need to update the existing default method
        const { error: updateError } = await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .eq('is_default', true);
          
        if (updateError) throw updateError;
      }

      const updateData: Record<string, any> = {};
      if (method.name) updateData.name = method.name;
      if (method.type) updateData.type = method.type;
      if (method.details) updateData.details = method.details;
      if (method.isDefault !== undefined) updateData.is_default = method.isDefault;

      const { error } = await supabase
        .from('payment_methods')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update the local state
      setPaymentMethods(methods => 
        methods.map(m => 
          m.id === id 
            ? { ...m, ...method, type: method.type as PaymentMethodType || m.type } 
            : method.isDefault ? { ...m, isDefault: false } : m
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error updating payment method:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removePaymentMethod = async (id: string) => {
    if (!user?.id) return false;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update the local state
      setPaymentMethods(methods => methods.filter(m => m.id !== id));
      
      return true;
    } catch (error) {
      console.error('Error removing payment method:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    paymentMethods,
    loading,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
  };
}
