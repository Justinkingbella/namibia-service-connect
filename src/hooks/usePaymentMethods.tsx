
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethod } from '@/types/auth';
import {
  fetchUserPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod
} from '@/services/mockProfileService';

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
    setLoading(true);
    const success = await setDefaultPaymentMethod(methodId);
    
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
