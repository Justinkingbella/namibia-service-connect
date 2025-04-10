
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentMethod } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface PaymentMethodInput {
  name: string;
  type: string;
  details: Record<string, any>;
  isDefault: boolean;
}

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

    fetchPaymentMethods();
  }, [user]);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      if (error) {
        throw error;
      }

      // Map database fields to our PaymentMethod interface
      const mappedMethods: PaymentMethod[] = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        name: item.name,
        type: item.type,
        details: typeof item.details === 'object' ? item.details : {},
        isDefault: item.is_default,
        createdAt: item.created_at
      }));

      setPaymentMethods(mappedMethods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast({
        title: "Error",
        description: "Failed to load payment methods",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async (method: Omit<PaymentMethod, "id" | "createdAt" | "userId">): Promise<PaymentMethod> => {
    try {
      // If setting as default, update all others to not default
      if (method.isDefault) {
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', user?.id);
      }

      // Insert new payment method
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user?.id,
          name: method.name,
          type: method.type,
          details: method.details || {},
          is_default: method.isDefault
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      const newMethod: PaymentMethod = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        type: data.type,
        details: data.details,
        isDefault: data.is_default,
        createdAt: data.created_at
      };

      // Update local state
      setPaymentMethods(prev => 
        method.isDefault 
          ? [newMethod, ...prev.map(m => ({ ...m, isDefault: false }))]
          : [...prev, newMethod]
      );

      toast({
        title: "Payment Method Added",
        description: `${method.name} has been added to your payment methods.`,
      });

      return newMethod;
    } catch (error: any) {
      console.error('Error adding payment method:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add payment method",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    try {
      // If setting as default, update all others to not default
      if (updates.isDefault) {
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', user?.id);
      }

      // Update the specified payment method
      const { data, error } = await supabase
        .from('payment_methods')
        .update({
          name: updates.name,
          type: updates.type,
          details: updates.details,
          is_default: updates.isDefault
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      const updatedMethod: PaymentMethod = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        type: data.type,
        details: data.details,
        isDefault: data.is_default,
        createdAt: data.created_at
      };

      // Update local state
      setPaymentMethods(prev => {
        let newMethods = [...prev];
        const index = newMethods.findIndex(m => m.id === id);
        
        if (index !== -1) {
          newMethods[index] = updatedMethod;
        }
        
        // If setting as default, update all others
        if (updates.isDefault) {
          newMethods = newMethods.map(m => 
            m.id === id ? m : { ...m, isDefault: false }
          );
        }
        
        return newMethods;
      });

      toast({
        title: "Payment Method Updated",
        description: `${updatedMethod.name} has been updated.`,
      });

      return updatedMethod;
    } catch (error: any) {
      console.error('Error updating payment method:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update payment method",
        variant: "destructive"
      });
      throw error;
    }
  };

  const removePaymentMethod = async (id: string): Promise<boolean> => {
    try {
      // Check if this is the default method
      const method = paymentMethods.find(m => m.id === id);
      if (!method) throw new Error("Payment method not found");
      
      if (method.isDefault && paymentMethods.length > 1) {
        toast({
          title: "Error",
          description: "Cannot delete default payment method. Set another method as default first.",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setPaymentMethods(prev => prev.filter(m => m.id !== id));

      toast({
        title: "Payment Method Removed",
        description: `${method.name} has been removed from your payment methods.`,
      });

      return true;
    } catch (error: any) {
      console.error('Error removing payment method:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove payment method",
        variant: "destructive"
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
