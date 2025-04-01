
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentHistory } from '@/types/payments';
import { fetchPaymentHistory } from '@/services/profileService';

export function usePaymentHistory() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPaymentHistory = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await fetchPaymentHistory(user.id);
      setPayments(data);
      setLoading(false);
    };

    loadPaymentHistory();
  }, [user?.id]);

  return {
    payments,
    loading
  };
}
