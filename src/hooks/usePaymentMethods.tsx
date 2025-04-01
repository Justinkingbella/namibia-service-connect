
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethod } from '@/types/auth';
import { 
  fetchUserPaymentMethods, 
  addPaymentMethod, 
  deletePaymentMethod, 
  setDefaultPaymentMethod 
} from '@/services/profileService';

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

  const addMethod = async (method: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>) => {
    if (!user?.id) return null;

    setLoading(true);
    const newMethod = await addPaymentMethod(user.id, method);
    
    if (newMethod) {
      // If the new method is default, update existing methods
      if (newMethod.isDefault) {
        setPaymentMethods(prev => prev.map(m => ({
          ...m,
          isDefault: m.id === newMethod.id
        })));
      } else {
        setPaymentMethods(prev => [...prev, newMethod]);
      }
      
      toast({
        title: "Payment method added",
        description: "Your payment method has been successfully added."
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
      setPaymentMethods(prev => prev.filter(m => m.id !== methodId));
      
      toast({
        title: "Payment method removed",
        description: "Your payment method has been successfully removed."
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

  const setDefault = async (methodId: string) => {
    if (!user?.id) return false;

    setLoading(true);
    const success = await setDefaultPaymentMethod(methodId, user.id);
    
    if (success) {
      setPaymentMethods(prev => prev.map(m => ({
        ...m,
        isDefault: m.id === methodId
      })));
      
      toast({
        title: "Default payment method updated",
        description: "Your default payment method has been updated."
      });
      setLoading(false);
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to update default payment method",
      description: "There was an error updating your default payment method. Please try again."
    });
    
    setLoading(false);
    return false;
  };

  return {
    paymentMethods,
    loading,
    addMethod,
    removeMethod,
    setDefault
  };
}
