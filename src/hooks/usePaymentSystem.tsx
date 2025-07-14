import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Type definitions for our payment system
export type NamibianBank = 
  'FNB Namibia' | 
  'Standard Bank Namibia' | 
  'Bank Windhoek' | 
  'Nedbank Namibia' | 
  'Letshego Bank' | 
  'Other';

export type NamibianEWallet = 
  'FNB eWallet' | 
  'MTC Money' | 
  'Standard Bank BlueWallet' | 
  'Nedbank Send-iMali' | 
  'Bank Windhoek EasyWallet' | 
  'PayToday' | 
  'Other';

export type PaymentStatus = 
  'pending' | 
  'processing' | 
  'completed' | 
  'failed' | 
  'refunded' | 
  'cancelled' | 
  'awaiting_verification';

export type PaymentGateway = 
  'bank_transfer' | 
  'ewallet' | 
  'payfast' | 
  'dpo' | 
  'easywallet';

export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  description: string;
  reference: string;
  gateway: PaymentGateway;
  method: string;
  status: PaymentStatus;
  metadata: Record<string, string | number | boolean>;
  gatewayResponse?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BankTransferDetails {
  bankName: NamibianBank;
  accountNumber: string;
  accountType: 'savings' | 'checking' | 'business';
  branchCode: string;
  accountHolder: string;
  reference: string;
}

export interface EWalletDetails {
  provider: NamibianEWallet;
  phoneNumber: string;
  accountName?: string;
  reference: string;
}

// Type for direct database interactions to avoid TypeScript errors
interface PaymentTransactionRow {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  description: string;
  reference: string;
  gateway: string;
  method: string;
  status: string;
  metadata: Record<string, string | number | boolean> | null;
  gateway_response?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// Function to convert database row to our internal type
function mapTransactionRowToType(row: PaymentTransactionRow): PaymentTransaction {
  return {
    id: row.id,
    userId: row.user_id,
    amount: row.amount,
    currency: row.currency,
    description: row.description,
    reference: row.reference,
    gateway: row.gateway as PaymentGateway,
    method: row.method,
    status: row.status as PaymentStatus,
    metadata: row.metadata,
    gatewayResponse: row.gateway_response,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

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
        // Use 'as any' to bypass TypeScript since the table was created outside TypeScript
        const { data, error } = await (supabase as any)
          .from('payment_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedPayments = data.map(mapTransactionRowToType);
        setPayments(formattedPayments);
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
      // Use 'as any' to bypass TypeScript since the table was created outside TypeScript
      const { data, error } = await (supabase as any)
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPayments = data.map(mapTransactionRowToType);
      setPayments(formattedPayments);
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
        // Use 'as any' to bypass TypeScript since the table was created outside TypeScript
        const { data, error } = await (supabase as any)
          .from('payment_transactions')
          .select('*')
          .eq('id', paymentId)
          .single();

        if (error) throw error;

        setPayment(mapTransactionRowToType(data));
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
      // Generate a unique reference
      const reference = `BT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create a transaction record
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert([{
          user_id: user.id,
          amount,
          currency: 'NAD',
          description,
          reference,
          gateway: 'bank_transfer',
          method: details.bankName,
          status: 'pending',
          metadata: { ...details },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error initiating bank transfer:', error);
        toast.error('Failed to initiate bank transfer');
        return null;
      }

      toast.success('Bank transfer initiated successfully');
      
      // Send notification to admin for verification
      await supabase
        .from('admin_notifications')
        .insert([{
          type: 'payment_verification',
          content: `New bank_transfer payment of NAD ${amount} requires verification`,
          metadata: {
            transactionId: data.id,
            userId: user.id,
            amount,
            gateway: 'bank_transfer'
          },
          status: 'unread',
          created_at: new Date().toISOString()
        }]);
      
      return {
        id: data.id,
        userId: data.user_id,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        reference: data.reference,
        gateway: data.gateway as PaymentGateway,
        method: data.method,
        status: data.status as PaymentStatus,
        metadata: data.metadata,
        gatewayResponse: data.gateway_response,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (err) {
      console.error('Error in processBankTransfer:', err);
      toast.error('Failed to initiate bank transfer');
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
      // Generate a unique reference
      const reference = `EW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create a transaction record
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert([{
          user_id: user.id,
          amount,
          currency: 'NAD',
          description,
          reference,
          gateway: 'ewallet',
          method: details.provider,
          status: 'awaiting_verification',
          metadata: { ...details },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error initiating e-wallet payment:', error);
        toast.error('Failed to initiate e-wallet payment');
        return null;
      }

      toast.success('E-wallet payment initiated successfully');
      
      // Send notification to admin for verification
      await supabase
        .from('admin_notifications')
        .insert([{
          type: 'payment_verification',
          content: `New ewallet payment of NAD ${amount} requires verification`,
          metadata: {
            transactionId: data.id,
            userId: user.id,
            amount,
            gateway: 'ewallet'
          },
          status: 'unread',
          created_at: new Date().toISOString()
        }]);
      
      return {
        id: data.id,
        userId: data.user_id,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        reference: data.reference,
        gateway: data.gateway as PaymentGateway,
        method: data.method,
        status: data.status as PaymentStatus,
        metadata: data.metadata,
        gatewayResponse: data.gateway_response,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (err) {
      console.error('Error in processEWalletPayment:', err);
      toast.error('Failed to initiate e-wallet payment');
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
      // Generate a unique merchant reference
      const merchantReference = `PF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create a transaction record
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert([{
          user_id: user.id,
          amount,
          currency: 'NAD',
          description,
          reference: merchantReference,
          gateway: 'payfast',
          method: 'payfast',
          status: 'pending',
          metadata: { returnUrl, cancelUrl },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error initiating PayFast payment:', error);
        toast.error('Failed to initiate PayFast payment');
        return null;
      }

      // In a real implementation, you would construct the actual PayFast URL with parameters
      // This is a mock implementation
      const redirectUrl = `https://www.payfast.co.za/eng/process?merchant_id=YOUR_MERCHANT_ID&merchant_key=YOUR_MERCHANT_KEY&amount=${amount}&item_name=${encodeURIComponent(description)}&m_payment_id=${data.id}&return_url=${encodeURIComponent(returnUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}&notify_url=YOUR_WEBHOOK_URL`;
      
      return {
        redirectUrl,
        transactionId: data.id
      };
    } catch (err) {
      console.error('Error in processPayFastPayment:', err);
      toast.error('Failed to initiate PayFast payment');
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
      // Generate a unique transaction reference
      const transactionRef = `DPO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create a transaction record
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert([{
          user_id: user.id,
          amount,
          currency: 'NAD',
          description,
          reference: transactionRef,
          gateway: 'dpo',
          method: 'dpo',
          status: 'pending',
          metadata: { 
            isRecurring,
            ...paymentDetails
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error initiating DPO payment:', error);
        toast.error('Failed to initiate DPO payment');
        return null;
      }

      // In a real implementation, you would create a token with the DPO API
      // This is a mock implementation
      const redirectUrl = `https://secure.3gdirectpay.com/payv2.php?ID=YOUR_COMPANY_TOKEN&paymentAmount=${amount}&paymentCurrency=NAD&companyRef=${paymentDetails?.companyRef || transactionRef}&customerEmail=${paymentDetails?.customerEmail || ''}&customerName=${paymentDetails?.customerName || ''}&redirectURL=YOUR_REDIRECT_URL`;
      
      return {
        redirectUrl,
        transactionId: data.id
      };
    } catch (err) {
      console.error('Error in processDPOPayment:', err);
      toast.error('Failed to initiate DPO payment');
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
      // Generate a unique reference
      const reference = `EW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create a transaction record
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert([{
          user_id: user.id,
          amount,
          currency: 'NAD',
          description,
          reference,
          gateway: 'easywallet',
          method: 'Bank Windhoek EasyWallet',
          status: 'awaiting_verification',
          metadata: { phoneNumber },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error initiating EasyWallet payment:', error);
        toast.error('Failed to initiate EasyWallet payment');
        return null;
      }

      toast.success('EasyWallet payment initiated successfully');
      
      // In a real implementation, you would send an SMS or notification to the user with payment instructions
      
      return {
        id: data.id,
        userId: data.user_id,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        reference: data.reference,
        gateway: data.gateway as PaymentGateway,
        method: data.method,
        status: data.status as PaymentStatus,
        metadata: data.metadata,
        gatewayResponse: data.gateway_response,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (err) {
      console.error('Error in processEasyWalletPayment:', err);
      toast.error('Failed to initiate EasyWallet payment');
      return null;
    }
  }, [user?.id]);

  const submitEWalletVerification = useCallback(async (
    transactionId: string,
    proofType: 'screenshot' | 'reference',
    proofData: string
  ) => {
    if (!user?.id) {
      toast.error('You must be logged in to submit verification');
      return false;
    }
    
    try {
      // The PostgreSQL syntax needed here for jsonb_set requires us to use the raw SQL function
      const { error } = await (supabase as any)
        .from('payment_transactions')
        .update({
          metadata: {
            proofType,
            proofData
          },
          status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId)
        .eq('user_id', user.id)
        .eq('gateway', 'ewallet');

      if (error) {
        console.error('Error submitting e-wallet verification:', error);
        toast.error('Failed to submit verification');
        return false;
      }

      toast.success('Verification submitted successfully');
      return true;
    } catch (err) {
      console.error('Error in submitEWalletVerification:', err);
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
      // Fetch the original payment details
      const { data: originalPayment, error } = await (supabase as any)
        .from('payment_transactions')
        .select('*')
        .eq('id', paymentId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching original payment:', error);
        toast.error('Failed to retry payment');
        return { success: false };
      }

      // Different retry logic based on payment gateway
      switch (originalPayment.gateway) {
        case 'payfast': {
          // Retry PayFast payment
          const result = await processPayFastPayment(
            originalPayment.amount,
            originalPayment.description,
            originalPayment.metadata.returnUrl,
            originalPayment.metadata.cancelUrl
          );
          
          if (!result) return { success: false };
          
          return {
            success: true,
            redirectUrl: result.redirectUrl,
            newTransactionId: result.transactionId
          };
        }
        
        case 'dpo': {
          // Retry DPO payment
          const result = await processDPOPayment(
            originalPayment.amount,
            originalPayment.description,
            originalPayment.metadata.isRecurring || false,
            originalPayment.metadata
          );
          
          if (!result) return { success: false };
          
          return {
            success: true,
            redirectUrl: result.redirectUrl,
            newTransactionId: result.transactionId
          };
        }
        
        case 'bank_transfer': {
          // Retry bank transfer
          const result = await processBankTransfer(
            originalPayment.amount,
            originalPayment.metadata,
            originalPayment.description
          );
          
          if (!result) return { success: false };
          
          return {
            success: true,
            newTransactionId: result.id
          };
        }
        
        case 'ewallet': {
          // Retry e-wallet payment
          const result = await processEWalletPayment(
            originalPayment.amount,
            originalPayment.metadata,
            originalPayment.description
          );
          
          if (!result) return { success: false };
          
          return {
            success: true,
            newTransactionId: result.id
          };
        }
        
        case 'easywallet': {
          // Retry EasyWallet payment
          const result = await processEasyWalletPayment(
            originalPayment.amount,
            originalPayment.metadata.phoneNumber,
            originalPayment.description
          );
          
          if (!result) return { success: false };
          
          return {
            success: true,
            newTransactionId: result.id
          };
        }
        
        default:
          toast.error('This payment type cannot be retried');
          return { success: false };
      }
    } catch (err) {
      console.error('Error in retryPayment:', err);
      toast.error('Failed to retry payment');
      return { success: false };
    }
  }, [user?.id, processBankTransfer, processDPOPayment, processEWalletPayment, processEasyWalletPayment, processPayFastPayment]);

  return {
    processBankTransfer,
    processEWalletPayment,
    processPayFastPayment,
    processDPOPayment,
    processEasyWalletPayment,
    submitEWalletVerification,
    retryPayment
  };
}
