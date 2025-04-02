
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
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

export type PaymentRecurring = 
  'one_time' | 
  'weekly' | 
  'monthly' | 
  'quarterly' | 
  'annually';

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
  metadata: Record<string, any>;
  gatewayResponse?: Record<string, any>;
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

export interface PayfastDetails {
  cardType?: string;
  cardLastFour?: string;
  merchantReference: string;
  pfPaymentId?: string;
}

export interface DPODetails {
  transactionToken?: string;
  recurringPayment: boolean;
  transactionRef: string;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  name: string;
  type: PaymentGateway;
  isDefault: boolean;
  details: BankTransferDetails | EWalletDetails | PayfastDetails | DPODetails;
  createdAt: string;
}

// Bank Transfer Functions
export async function initiateBankTransfer(
  userId: string,
  amount: number,
  details: BankTransferDetails,
  description: string
): Promise<PaymentTransaction | null> {
  try {
    // Generate a unique reference
    const reference = `BT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create a transaction record
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert([{
        user_id: userId,
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
    
    // Send notification to admin
    await notifyAdminForVerification(data.id, userId, 'bank_transfer', amount);
    
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
  } catch (error) {
    console.error('Error in initiateBankTransfer:', error);
    toast.error('Failed to initiate bank transfer');
    return null;
  }
}

export async function verifyBankTransfer(
  transactionId: string,
  adminId: string,
  verified: boolean,
  notes?: string
): Promise<PaymentTransaction | null> {
  try {
    const status = verified ? 'completed' : 'failed';
    const { data, error } = await supabase
      .from('payment_transactions')
      .update({
        status,
        updated_at: new Date().toISOString(),
        metadata: supabase.sql`jsonb_set(metadata, '{verificationNotes}', ${notes ? JSON.stringify(notes) : null}::jsonb)`,
        gateway_response: supabase.sql`jsonb_set(gateway_response, '{verifiedBy}', ${adminId}::jsonb)`
      })
      .eq('id', transactionId)
      .eq('gateway', 'bank_transfer')
      .select()
      .single();

    if (error) {
      console.error('Error verifying bank transfer:', error);
      toast.error('Failed to verify bank transfer');
      return null;
    }

    toast.success(`Bank transfer ${verified ? 'approved' : 'rejected'}`);
    
    // Notify user about the verification result
    await notifyUserForVerificationResult(data.user_id, data.id, verified, notes);
    
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
  } catch (error) {
    console.error('Error in verifyBankTransfer:', error);
    toast.error('Failed to verify bank transfer');
    return null;
  }
}

// E-Wallet Functions
export async function initiateEWalletPayment(
  userId: string,
  amount: number,
  details: EWalletDetails,
  description: string
): Promise<PaymentTransaction | null> {
  try {
    // Generate a unique reference
    const reference = `EW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create a transaction record
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert([{
        user_id: userId,
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
    
    // Send notification to admin
    await notifyAdminForVerification(data.id, userId, 'ewallet', amount);
    
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
  } catch (error) {
    console.error('Error in initiateEWalletPayment:', error);
    toast.error('Failed to initiate e-wallet payment');
    return null;
  }
}

export async function submitEWalletVerification(
  transactionId: string,
  userId: string,
  proofType: 'screenshot' | 'reference',
  proofData: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('payment_transactions')
      .update({
        metadata: supabase.sql`jsonb_set(
          jsonb_set(metadata, '{proofType}', ${proofType}::jsonb),
          '{proofData}', ${proofData}::jsonb
        )`,
        status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', transactionId)
      .eq('user_id', userId)
      .eq('gateway', 'ewallet');

    if (error) {
      console.error('Error submitting e-wallet verification:', error);
      toast.error('Failed to submit verification');
      return false;
    }

    toast.success('Verification submitted successfully');
    return true;
  } catch (error) {
    console.error('Error in submitEWalletVerification:', error);
    toast.error('Failed to submit verification');
    return false;
  }
}

// PayFast Integration
export async function initiatePayFastPayment(
  userId: string,
  amount: number,
  description: string,
  returnUrl: string,
  cancelUrl: string
): Promise<{ redirectUrl: string; transactionId: string } | null> {
  try {
    // Generate a unique merchant reference
    const merchantReference = `PF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create a transaction record
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert([{
        user_id: userId,
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
  } catch (error) {
    console.error('Error in initiatePayFastPayment:', error);
    toast.error('Failed to initiate PayFast payment');
    return null;
  }
}

export async function handlePayFastWebhook(
  pfData: Record<string, any>
): Promise<boolean> {
  try {
    // Verify the PayFast ITN (Instant Transaction Notification)
    // In a real implementation, you'd validate the signature and data
    
    const { data, error } = await supabase
      .from('payment_transactions')
      .update({
        status: pfData.payment_status === 'COMPLETE' ? 'completed' : 'failed',
        gateway_response: pfData,
        updated_at: new Date().toISOString()
      })
      .eq('id', pfData.m_payment_id)
      .eq('gateway', 'payfast')
      .select()
      .single();

    if (error) {
      console.error('Error handling PayFast webhook:', error);
      return false;
    }

    // Notify user about payment status
    if (pfData.payment_status === 'COMPLETE') {
      await notifyUserForPaymentSuccess(data.user_id, data.id, data.amount);
    } else {
      await notifyUserForPaymentFailure(data.user_id, data.id, data.amount);
    }
    
    return true;
  } catch (error) {
    console.error('Error in handlePayFastWebhook:', error);
    return false;
  }
}

// DPO Integration
export async function initiateDPOPayment(
  userId: string,
  amount: number,
  description: string,
  isRecurring: boolean,
  paymentDetails?: {
    companyRef?: string;
    customerEmail?: string;
    customerName?: string;
  }
): Promise<{ redirectUrl: string; transactionId: string } | null> {
  try {
    // Generate a unique transaction reference
    const transactionRef = `DPO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create a transaction record
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert([{
        user_id: userId,
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
  } catch (error) {
    console.error('Error in initiateDPOPayment:', error);
    toast.error('Failed to initiate DPO payment');
    return null;
  }
}

export async function handleDPOWebhook(
  dpoData: Record<string, any>
): Promise<boolean> {
  try {
    // Verify the DPO webhook data
    // In a real implementation, you'd validate the signature and data
    
    const { data, error } = await supabase
      .from('payment_transactions')
      .update({
        status: dpoData.TransactionApproved === '1' ? 'completed' : 'failed',
        gateway_response: dpoData,
        updated_at: new Date().toISOString()
      })
      .eq('reference', dpoData.CompanyRef)
      .eq('gateway', 'dpo')
      .select()
      .single();

    if (error) {
      console.error('Error handling DPO webhook:', error);
      return false;
    }

    // Notify user about payment status
    if (dpoData.TransactionApproved === '1') {
      await notifyUserForPaymentSuccess(data.user_id, data.id, data.amount);
    } else {
      await notifyUserForPaymentFailure(data.user_id, data.id, data.amount);
    }
    
    return true;
  } catch (error) {
    console.error('Error in handleDPOWebhook:', error);
    return false;
  }
}

// EasyWallet Integration
export async function initiateEasyWalletPayment(
  userId: string,
  amount: number,
  phoneNumber: string,
  description: string
): Promise<PaymentTransaction | null> {
  try {
    // Generate a unique reference
    const reference = `EW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create a transaction record
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert([{
        user_id: userId,
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
  } catch (error) {
    console.error('Error in initiateEasyWalletPayment:', error);
    toast.error('Failed to initiate EasyWallet payment');
    return null;
  }
}

// Utility Functions
async function notifyAdminForVerification(
  transactionId: string,
  userId: string,
  gateway: string,
  amount: number
): Promise<void> {
  try {
    await supabase
      .from('admin_notifications')
      .insert([{
        type: 'payment_verification',
        content: `New ${gateway} payment of NAD ${amount} requires verification`,
        metadata: {
          transactionId,
          userId,
          amount,
          gateway
        },
        status: 'unread',
        created_at: new Date().toISOString()
      }]);
  } catch (error) {
    console.error('Error notifying admin:', error);
  }
}

async function notifyUserForVerificationResult(
  userId: string,
  transactionId: string,
  verified: boolean,
  notes?: string
): Promise<void> {
  try {
    await supabase
      .from('user_notifications')
      .insert([{
        user_id: userId,
        type: 'payment_verification',
        content: verified 
          ? 'Your payment has been verified and processed successfully' 
          : `Your payment verification failed: ${notes || 'No reason provided'}`,
        metadata: {
          transactionId,
          verified,
          notes
        },
        status: 'unread',
        created_at: new Date().toISOString()
      }]);
  } catch (error) {
    console.error('Error notifying user:', error);
  }
}

async function notifyUserForPaymentSuccess(
  userId: string,
  transactionId: string,
  amount: number
): Promise<void> {
  try {
    await supabase
      .from('user_notifications')
      .insert([{
        user_id: userId,
        type: 'payment_success',
        content: `Your payment of NAD ${amount} has been processed successfully`,
        metadata: {
          transactionId,
          amount
        },
        status: 'unread',
        created_at: new Date().toISOString()
      }]);
  } catch (error) {
    console.error('Error notifying user for payment success:', error);
  }
}

async function notifyUserForPaymentFailure(
  userId: string,
  transactionId: string,
  amount: number
): Promise<void> {
  try {
    await supabase
      .from('user_notifications')
      .insert([{
        user_id: userId,
        type: 'payment_failure',
        content: `Your payment of NAD ${amount} has failed. Please try again or contact support.`,
        metadata: {
          transactionId,
          amount
        },
        status: 'unread',
        created_at: new Date().toISOString()
      }]);
  } catch (error) {
    console.error('Error notifying user for payment failure:', error);
  }
}

// Payment retrieval and management functions
export async function fetchUserPayments(userId: string): Promise<PaymentTransaction[]> {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user payments:', error);
      toast.error('Failed to load payment history');
      return [];
    }

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      amount: item.amount,
      currency: item.currency,
      description: item.description,
      reference: item.reference,
      gateway: item.gateway as PaymentGateway,
      method: item.method,
      status: item.status as PaymentStatus,
      metadata: item.metadata,
      gatewayResponse: item.gateway_response,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    console.error('Error in fetchUserPayments:', error);
    toast.error('Failed to load payment history');
    return [];
  }
}

export async function fetchPaymentDetails(paymentId: string): Promise<PaymentTransaction | null> {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (error) {
      console.error('Error fetching payment details:', error);
      toast.error('Failed to load payment details');
      return null;
    }

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
  } catch (error) {
    console.error('Error in fetchPaymentDetails:', error);
    toast.error('Failed to load payment details');
    return null;
  }
}

export async function retryFailedPayment(
  paymentId: string,
  userId: string
): Promise<{ success: boolean; redirectUrl?: string; newTransactionId?: string }> {
  try {
    // Fetch the original payment details
    const { data: originalPayment, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', paymentId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching original payment:', error);
      toast.error('Failed to retry payment');
      return { success: false };
    }

    // Different retry logic based on payment gateway
    switch (originalPayment.gateway) {
      case 'payfast': {
        const result = await initiatePayFastPayment(
          userId,
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
        const result = await initiateDPOPayment(
          userId,
          originalPayment.amount,
          originalPayment.description,
          originalPayment.metadata.isRecurring,
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
        const result = await initiateBankTransfer(
          userId,
          originalPayment.amount,
          originalPayment.metadata as BankTransferDetails,
          originalPayment.description
        );
        
        if (!result) return { success: false };
        
        return {
          success: true,
          newTransactionId: result.id
        };
      }
      
      case 'ewallet': {
        const result = await initiateEWalletPayment(
          userId,
          originalPayment.amount,
          originalPayment.metadata as EWalletDetails,
          originalPayment.description
        );
        
        if (!result) return { success: false };
        
        return {
          success: true,
          newTransactionId: result.id
        };
      }
      
      case 'easywallet': {
        const result = await initiateEasyWalletPayment(
          userId,
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
  } catch (error) {
    console.error('Error in retryFailedPayment:', error);
    toast.error('Failed to retry payment');
    return { success: false };
  }
}

export async function fetchAdminPaymentTransactions(
  filters?: {
    gateway?: PaymentGateway | PaymentGateway[];
    status?: PaymentStatus | PaymentStatus[];
    startDate?: string;
    endDate?: string;
    search?: string;
  }
): Promise<PaymentTransaction[]> {
  try {
    let query = supabase
      .from('payment_transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (filters) {
      if (filters.gateway) {
        if (Array.isArray(filters.gateway)) {
          query = query.in('gateway', filters.gateway);
        } else {
          query = query.eq('gateway', filters.gateway);
        }
      }
      
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }
      
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      
      if (filters.search) {
        query = query.or(`reference.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching payment transactions:', error);
      toast.error('Failed to load payment transactions');
      return [];
    }

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      amount: item.amount,
      currency: item.currency,
      description: item.description,
      reference: item.reference,
      gateway: item.gateway as PaymentGateway,
      method: item.method,
      status: item.status as PaymentStatus,
      metadata: item.metadata,
      gatewayResponse: item.gateway_response,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    console.error('Error in fetchAdminPaymentTransactions:', error);
    toast.error('Failed to load payment transactions');
    return [];
  }
}

export async function getPaymentDashboardStats(): Promise<{
  totalTransactions: number;
  totalAmount: number;
  pendingVerification: number;
  failedTransactions: number;
  gatewayBreakdown: Record<PaymentGateway, { count: number; amount: number }>;
  recentTransactions: PaymentTransaction[];
}> {
  try {
    // Get total counts
    const { count: totalCount, error: countError } = await supabase
      .from('payment_transactions')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    // Get total amount
    const { data: totalData, error: totalError } = await supabase
      .rpc('sum_payment_amounts');
    
    if (totalError) throw totalError;
    
    // Get pending verification count
    const { count: pendingCount, error: pendingError } = await supabase
      .from('payment_transactions')
      .select('*', { count: 'exact', head: true })
      .in('status', ['awaiting_verification', 'pending']);
    
    if (pendingError) throw pendingError;
    
    // Get failed count
    const { count: failedCount, error: failedError } = await supabase
      .from('payment_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed');
    
    if (failedError) throw failedError;
    
    // Get gateway breakdown
    const { data: gatewayData, error: gatewayError } = await supabase
      .rpc('get_gateway_breakdown');
    
    if (gatewayError) throw gatewayError;
    
    // Get recent transactions
    const { data: recentData, error: recentError } = await supabase
      .from('payment_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (recentError) throw recentError;
    
    // Format gateway breakdown
    const gatewayBreakdown = {} as Record<PaymentGateway, { count: number; amount: number }>;
    gatewayData.forEach((item: any) => {
      gatewayBreakdown[item.gateway as PaymentGateway] = {
        count: item.count,
        amount: item.total_amount
      };
    });
    
    // Format recent transactions
    const recentTransactions = recentData.map(item => ({
      id: item.id,
      userId: item.user_id,
      amount: item.amount,
      currency: item.currency,
      description: item.description,
      reference: item.reference,
      gateway: item.gateway as PaymentGateway,
      method: item.method,
      status: item.status as PaymentStatus,
      metadata: item.metadata,
      gatewayResponse: item.gateway_response,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
    
    return {
      totalTransactions: totalCount || 0,
      totalAmount: totalData?.sum || 0,
      pendingVerification: pendingCount || 0,
      failedTransactions: failedCount || 0,
      gatewayBreakdown,
      recentTransactions
    };
  } catch (error) {
    console.error('Error in getPaymentDashboardStats:', error);
    toast.error('Failed to load payment dashboard stats');
    
    // Return default empty stats
    return {
      totalTransactions: 0,
      totalAmount: 0,
      pendingVerification: 0,
      failedTransactions: 0,
      gatewayBreakdown: {} as Record<PaymentGateway, { count: number; amount: number }>,
      recentTransactions: []
    };
  }
}
