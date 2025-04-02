
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  fetchUserPayments,
  fetchPaymentDetails,
  initiateBankTransfer,
  initiateEWalletPayment,
  initiatePayFastPayment,
  initiateDPOPayment,
  initiateEasyWalletPayment,
  submitEWalletVerification,
  retryFailedPayment,
  PaymentTransaction,
  BankTransferDetails,
  EWalletDetails,
  PaymentGateway,
  PaymentStatus
} from '@/services/namibiaPaymentService';

export function useUserPayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayments = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fetchUserPayments(user.id);
        setPayments(data);
      } catch (err) {
        console.error('Error loading payments:', err);
        setError('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [user?.id]);

  const refreshPayments = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserPayments(user.id);
      setPayments(data);
    } catch (err) {
      console.error('Error refreshing payments:', err);
      setError('Failed to refresh payment history');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  return {
    payments,
    loading,
    error,
    refreshPayments
  };
}

export function usePaymentDetails(paymentId: string) {
  const [payment, setPayment] = useState<PaymentTransaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPaymentDetails = async () => {
      if (!paymentId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fetchPaymentDetails(paymentId);
        setPayment(data);
      } catch (err) {
        console.error('Error loading payment details:', err);
        setError('Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };

    loadPaymentDetails();
  }, [paymentId]);

  return {
    payment,
    loading,
    error
  };
}

export function usePaymentMethods() {
  const { user } = useAuth();
  
  const processBankTransfer = useCallback(async (
    amount: number,
    details: BankTransferDetails,
    description: string
  ) => {
    if (!user?.id) {
      toast.error('You must be logged in to make a payment');
      return null;
    }
    
    try {
      const result = await initiateBankTransfer(user.id, amount, details, description);
      return result;
    } catch (err) {
      console.error('Error processing bank transfer:', err);
      toast.error('Failed to process bank transfer');
      return null;
    }
  }, [user?.id]);

  const processEWalletPayment = useCallback(async (
    amount: number,
    details: EWalletDetails,
    description: string
  ) => {
    if (!user?.id) {
      toast.error('You must be logged in to make a payment');
      return null;
    }
    
    try {
      const result = await initiateEWalletPayment(user.id, amount, details, description);
      return result;
    } catch (err) {
      console.error('Error processing e-wallet payment:', err);
      toast.error('Failed to process e-wallet payment');
      return null;
    }
  }, [user?.id]);

  const processPayFastPayment = useCallback(async (
    amount: number,
    description: string,
    returnUrl: string,
    cancelUrl: string
  ) => {
    if (!user?.id) {
      toast.error('You must be logged in to make a payment');
      return null;
    }
    
    try {
      const result = await initiatePayFastPayment(user.id, amount, description, returnUrl, cancelUrl);
      return result;
    } catch (err) {
      console.error('Error processing PayFast payment:', err);
      toast.error('Failed to process PayFast payment');
      return null;
    }
  }, [user?.id]);

  const processDPOPayment = useCallback(async (
    amount: number,
    description: string,
    isRecurring: boolean,
    paymentDetails?: {
      companyRef?: string;
      customerEmail?: string;
      customerName?: string;
    }
  ) => {
    if (!user?.id) {
      toast.error('You must be logged in to make a payment');
      return null;
    }
    
    try {
      const result = await initiateDPOPayment(user.id, amount, description, isRecurring, paymentDetails);
      return result;
    } catch (err) {
      console.error('Error processing DPO payment:', err);
      toast.error('Failed to process DPO payment');
      return null;
    }
  }, [user?.id]);

  const processEasyWalletPayment = useCallback(async (
    amount: number,
    phoneNumber: string,
    description: string
  ) => {
    if (!user?.id) {
      toast.error('You must be logged in to make a payment');
      return null;
    }
    
    try {
      const result = await initiateEasyWalletPayment(user.id, amount, phoneNumber, description);
      return result;
    } catch (err) {
      console.error('Error processing EasyWallet payment:', err);
      toast.error('Failed to process EasyWallet payment');
      return null;
    }
  }, [user?.id]);

  const submitEWalletProof = useCallback(async (
    transactionId: string,
    proofType: 'screenshot' | 'reference',
    proofData: string
  ) => {
    if (!user?.id) {
      toast.error('You must be logged in to submit verification');
      return false;
    }
    
    try {
      const result = await submitEWalletVerification(transactionId, user.id, proofType, proofData);
      return result;
    } catch (err) {
      console.error('Error submitting e-wallet verification:', err);
      toast.error('Failed to submit verification');
      return false;
    }
  }, [user?.id]);

  const retryPayment = useCallback(async (paymentId: string) => {
    if (!user?.id) {
      toast.error('You must be logged in to retry a payment');
      return { success: false };
    }
    
    try {
      const result = await retryFailedPayment(paymentId, user.id);
      return result;
    } catch (err) {
      console.error('Error retrying payment:', err);
      toast.error('Failed to retry payment');
      return { success: false };
    }
  }, [user?.id]);

  return {
    processBankTransfer,
    processEWalletPayment,
    processPayFastPayment,
    processDPOPayment,
    processEasyWalletPayment,
    submitEWalletProof,
    retryPayment
  };
}
