
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentMethod } from '@/types/payments';
import { getMockPaymentMethods } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethodType } from '@/types/schema';

export function usePaymentMethods() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // Use the mock service for demonstration purposes
        const data = await getMockPaymentMethods(user.id);
        setPaymentMethods(data);
      } catch (error: any) {
        console.error('Error loading payment methods:', error);
        toast({
          title: 'Error',
          description: 'Failed to load payment methods',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadPaymentMethods();
  }, [user, toast]);

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'createdAt' | 'userId'>) => {
    try {
      if (!user) throw new Error('User must be logged in');

      // Simulate API call
      // In a real app, this would call an API endpoint
      const newMethod = {
        id: `pm_${Date.now()}`,
        userId: user.id,
        createdAt: new Date().toISOString(),
        ...method
      };

      // Update state
      setPaymentMethods([...paymentMethods, newMethod]);

      toast({
        title: 'Success',
        description: 'Payment method added successfully',
      });

      return newMethod;
    } catch (error: any) {
      console.error('Error adding payment method:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add payment method',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updatePaymentMethod = async (id: string, method: Partial<PaymentMethod>) => {
    try {
      if (!user) throw new Error('User must be logged in');

      // Find the payment method
      const foundMethod = paymentMethods.find(pm => pm.id === id);
      if (!foundMethod) throw new Error('Payment method not found');

      // Simulate API call
      const updatedMethod = {
        ...foundMethod,
        ...method,
      };

      // Update state
      setPaymentMethods(paymentMethods.map(pm => pm.id === id ? updatedMethod : pm));

      toast({
        title: 'Success',
        description: 'Payment method updated successfully',
      });

      return updatedMethod;
    } catch (error: any) {
      console.error('Error updating payment method:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update payment method',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const removePaymentMethod = async (id: string) => {
    try {
      if (!user) throw new Error('User must be logged in');

      // Find the payment method
      const foundMethod = paymentMethods.find(pm => pm.id === id);
      if (!foundMethod) throw new Error('Payment method not found');

      // Check if this is the default payment method
      if (foundMethod.isDefault && paymentMethods.length > 1) {
        toast({
          title: 'Warning',
          description: 'Cannot delete default payment method',
          variant: 'destructive',
        });
        return false;
      }

      // Simulate API call
      // Update state
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));

      toast({
        title: 'Success',
        description: 'Payment method removed successfully',
      });

      return true;
    } catch (error: any) {
      console.error('Error removing payment method:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove payment method',
        variant: 'destructive',
      });
      return false;
    }
  };

  const setDefaultPaymentMethod = async (id: string) => {
    try {
      if (!user) throw new Error('User must be logged in');

      // Find the payment method
      const foundMethod = paymentMethods.find(pm => pm.id === id);
      if (!foundMethod) throw new Error('Payment method not found');

      // Update all payment methods - set isDefault=false for all except the selected one
      const updatedMethods = paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === id
      }));

      // Simulate API call
      // Update state
      setPaymentMethods(updatedMethods);

      toast({
        title: 'Success',
        description: 'Default payment method updated',
      });

      return true;
    } catch (error: any) {
      console.error('Error setting default payment method:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to set default payment method',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    paymentMethods,
    loading,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod
  };
}
