
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, Wallet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { WalletVerification, WalletPaymentType, WalletVerificationStatus } from '@/types';

// Move the date formatting function to module level
const formatDate = (date: string | Date | undefined) => {
  if (!date) return 'N/A';
  
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

interface WalletVerificationRequest {
  id: string;
  booking_id: string;
  provider_id: string;
  customer_id: string;
  amount: number;
  payment_method: WalletPaymentType;
  reference_number: string;
  customer_phone: string;
  provider_phone: string;
  screenshot_url?: string;
  receipt_url?: string;
  status: string;
  notes?: string;
  date_submitted: string;
  date_verified?: string;
  rejected_at?: string;
  rejection_reason?: string;
}

const AdminWalletVerificationPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<WalletVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const loadVerifications = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('wallet_verification_requests')
          .select('*')
          .order('date_submitted', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        // Transform the data to match WalletVerification type
        const transformedData: WalletVerification[] = data.map(item => ({
          id: item.id,
          user_id: item.customer_id || item.provider_id,
          status: item.verification_status as WalletVerificationStatus,
          date: item.date_submitted,
          reference: item.reference_number,
          method: item.payment_method as WalletPaymentType,
          amount: item.amount,
          provider_id: item.provider_id,
          customer_id: item.customer_id,
          booking_id: item.booking_id,
          paymentMethod: item.payment_method as WalletPaymentType,
          customerPhone: item.customer_phone,
          providerPhone: item.provider_phone,
          referenceNumber: item.reference_number,
          dateSubmitted: item.date_submitted,
          dateVerified: item.date_verified,
          verificationStatus: item.verification_status as WalletVerificationStatus,
          rejectionReason: item.rejection_reason,
          notes: item.notes,
          receiptImage: item.receipt_image,
          mobileOperator: item.mobile_operator,
          bankUsed: item.bank_used,
          customerConfirmed: item.customer_confirmed,
          providerConfirmed: item.provider_confirmed,
          adminVerified: item.admin_verified,
          adminComments: item.admin_comments,
        }));

        setVerifications(transformedData);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadVerifications();
  }, [toast]);

  const handleApprove = async (verification: WalletVerification) => {
    try {
      // Optimistically update the UI
      setVerifications((prevVerifications) =>
        prevVerifications.map((v) =>
          v.id === verification.id ? { ...v, status: 'verified' as WalletVerificationStatus, verificationStatus: 'verified' as WalletVerificationStatus } : v
        )
      );

      // Call Supabase function to verify payment
      const { error } = await supabase
        .from('wallet_verification_requests')
        .update({ verification_status: 'verified' })
        .eq('id', verification.id);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Success',
        description: 'Payment verification approved.',
      });
    } catch (error: any) {
      // Revert the UI on error
      setVerifications((prevVerifications) =>
        prevVerifications.map((v) =>
          v.id === verification.id ? { ...v, status: 'pending' as WalletVerificationStatus, verificationStatus: 'pending' as WalletVerificationStatus } : v
        )
      );

      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (verification: WalletVerification) => {
    try {
      // Optimistically update the UI
      setVerifications((prevVerifications) =>
        prevVerifications.map((v) =>
          v.id === verification.id ? { ...v, status: 'rejected' as WalletVerificationStatus, verificationStatus: 'rejected' as WalletVerificationStatus } : v
        )
      );

      // Call Supabase function to reject payment
      const { error } = await supabase
        .from('wallet_verification_requests')
        .update({ verification_status: 'rejected' })
        .eq('id', verification.id);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Success',
        description: 'Payment verification rejected.',
      });
    } catch (error: any) {
      // Revert the UI on error
      setVerifications((prevVerifications) =>
        prevVerifications.map((v) =>
          v.id === verification.id ? { ...v, status: 'pending' as WalletVerificationStatus, verificationStatus: 'pending' as WalletVerificationStatus } : v
        )
      );

      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const filteredVerifications = activeTab === 'all'
    ? verifications
    : verifications.filter((verification) => (verification.status === activeTab || verification.verificationStatus === activeTab));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Submitted</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Verified</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Wallet Verification</h1>
          <p className="text-muted-foreground mt-1">Manage customer payment verifications</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="submitted">Submitted</TabsTrigger>
                <TabsTrigger value="verified">Verified</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : filteredVerifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium">No verification requests</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      There are no payment verification requests matching the selected filter.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Reference</th>
                          <th className="text-left py-3 px-4">Booking ID</th>
                          <th className="text-left py-3 px-4">Customer</th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVerifications.map((verification) => (
                          <tr key={verification.id} className="border-b hover:bg-slate-50">
                            <td className="py-3 px-4">{formatDate(verification.date)}</td>
                            <td className="py-3 px-4">{verification.reference}</td>
                            <td className="py-3 px-4">{verification.booking_id?.substring(0, 8) || ''}</td>
                            <td className="py-3 px-4">{verification.customerPhone}</td>
                            <td className="py-3 px-4">N${verification.amount.toLocaleString()}</td>
                            <td className="py-3 px-4">{getStatusBadge(verification.status)}</td>
                            <td className="py-3 px-4">
                              {(verification.status === 'submitted' || verification.verificationStatus === 'submitted') && (
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleApprove(verification)}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleReject(verification)}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                              {(verification.status === 'verified' || verification.verificationStatus === 'verified') && (
                                <div className="flex items-center">
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                  <span className="text-sm">Verified</span>
                                </div>
                              )}
                              {(verification.status === 'rejected' || verification.verificationStatus === 'rejected') && (
                                <div className="flex items-center">
                                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                                  <span className="text-sm">Rejected</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminWalletVerificationPage;
