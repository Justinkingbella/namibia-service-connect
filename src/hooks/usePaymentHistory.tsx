
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentHistory } from '@/types/payments';
import { fetchPaymentHistory } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';

export function usePaymentHistory() {
  const { user } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const loadPaymentHistory = async () => {
      try {
        setLoading(true);
        const data = await fetchPaymentHistory(user.id);
        setPaymentHistory(data);
        setError(null);
      } catch (err: any) {
        console.error('Error loading payment history:', err);
        setError(err.message || 'Failed to load payment history');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load payment history',
        });
      } finally {
        setLoading(false);
      }
    };

    loadPaymentHistory();
  }, [user?.id, toast]);

  return { paymentHistory, loading, error };
}
