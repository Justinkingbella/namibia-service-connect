
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentHistory } from '@/types/payments';
import { getMockPaymentHistory } from '@/services/paymentService';

export function usePaymentHistory() {
  const { user } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPaymentHistory([]);
      setLoading(false);
      return;
    }

    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using mock data service - this should be replaced with actual API call
        const data = await getMockPaymentHistory();
        
        // Filter by user ID if needed
        const userHistory = data.filter(payment => payment.userId === user.id);
        setPaymentHistory(userHistory.length > 0 ? userHistory : data);
        
      } catch (err: any) {
        console.error('Error fetching payment history:', err);
        setError(err.message || 'Failed to fetch payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [user]);

  return { paymentHistory, loading, error };
}
