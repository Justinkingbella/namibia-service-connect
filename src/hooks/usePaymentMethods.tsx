
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethod } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

// Define the actual implementations to replace the imports
const fetchUserPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
    
    return data.map(method => ({
      id: method.id,
      userId: method.user_id,
      name: method.name,
      type: method.type,
      details: method.details,
      isDefault: method.is_default,
      createdAt: new Date(method.created_at)
    }));
  } catch (err) {
    console.error('Error in fetchUserPaymentMethods:', err);
    return [];
  }
};

const addPaymentMethod = async (userId: string, methodData: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>): Promise<PaymentMethod | null> => {
  try {
    // If the new method is set as default, update all other methods to not be default
    if (methodData.isDefault) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);
    }
    
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        name: methodData.name,
        type: methodData.type,
        details: methodData.details,
        is_default: methodData.isDefault
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding payment method:', error);
      return null;
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      type: data.type,
      details: data.details,
      isDefault: data.is_default,
      createdAt: new Date(data.created_at)
    };
  } catch (err) {
    console.error('Error in addPaymentMethod:', err);
    return null;
  }
};

const deletePaymentMethod = async (methodId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', methodId);
    
    if (error) {
      console.error('Error deleting payment method:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in deletePaymentMethod:', err);
    return false;
  }
};

const setDefaultPaymentMethod = async (methodId: string, userId: string): Promise<boolean> => {
  try {
    // First, set all methods for this user to non-default
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);
    
    // Then set the selected method as default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', methodId);
    
    if (error) {
      console.error('Error setting default payment method:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in setDefaultPaymentMethod:', err);
    return false;
  }
};

export function usePaymentMethods() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await fetchUserPaymentMethods(user.id);
      setPaymentMethods(data);
      setLoading(false);
    };

    loadPaymentMethods();
  }, [user?.id]);

  const addMethod = async (methodData: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>) => {
    if (!user?.id) return null;

    setLoading(true);
    const newMethod = await addPaymentMethod(user.id, methodData);
    
    if (newMethod) {
      // If the new method is default, update all other methods
      if (newMethod.isDefault) {
        setPaymentMethods(prev => 
          prev.map(method => ({
            ...method,
            isDefault: method.id === newMethod.id
          }))
        );
      } else {
        setPaymentMethods(prev => [...prev, newMethod]);
      }
      
      toast({
        title: "Payment method added",
        description: "Your new payment method has been added successfully."
      });
      
      setLoading(false);
      return newMethod;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to add payment method",
      description: "There was an error adding your payment method. Please try again."
    });
    
    setLoading(false);
    return null;
  };

  const removeMethod = async (methodId: string) => {
    setLoading(true);
    const success = await deletePaymentMethod(methodId);
    
    if (success) {
      // Remove the method from state
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
      
      toast({
        title: "Payment method removed",
        description: "Your payment method has been removed successfully."
      });
      
      setLoading(false);
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to remove payment method",
      description: "There was an error removing your payment method. Please try again."
    });
    
    setLoading(false);
    return false;
  };

  const setDefaultMethod = async (methodId: string) => {
    if (!user?.id) return false;
    
    setLoading(true);
    const success = await setDefaultPaymentMethod(methodId, user.id);
    
    if (success) {
      // Update the payment methods in state
      setPaymentMethods(prev => 
        prev.map(method => ({
          ...method,
          isDefault: method.id === methodId
        }))
      );
      
      toast({
        title: "Default payment method set",
        description: "Your default payment method has been updated successfully."
      });
      
      setLoading(false);
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to set default payment method",
      description: "There was an error updating your default payment method. Please try again."
    });
    
    setLoading(false);
    return false;
  };

  return {
    paymentMethods,
    loading,
    addPaymentMethod: addMethod,
    removePaymentMethod: removeMethod,
    setDefaultPaymentMethod: setDefaultMethod
  };
}
