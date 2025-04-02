
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

interface WalletVerification {
  id: string;
  bookingId: string;
  providerId: string;
  customerId: string;
  amount: number;
  verificationStatus: string;
  paymentMethod: string;
  dateSubmitted: Date;
  dateVerified?: Date;
  customerPhone: string;
  referenceNumber: string;
  notes?: string;
  rejectionReason?: string;
  receiptImage?: string;
}

const ProviderWalletVerificationPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<WalletVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const loadVerifications = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('wallet_verification_requests')
          .select('*')
          .eq('provider_id', user.id)
          .order('date_submitted', { ascending: false });
          
        if (error) throw error;
        
        const formattedData = data.map(item => ({
          id: item.id,
          bookingId: item.booking_id,
          providerId: item.provider_id,
          customerId: item.customer_id,
          amount: item.amount,
          verificationStatus: item.verification_status,
          paymentMethod: item.payment_method,
          dateSubmitted: new Date(item.date_submitted),
          dateVerified: item.date_verified ? new Date(item.date_verified) : undefined,
          customerPhone: item.customer_phone,
          referenceNumber: item.reference_number,
          notes: item.notes,
          rejectionReason: item.rejection_reason,
          receiptImage: item.receipt_image
        }));
        
        setVerifications(formattedData);
      } catch (error) {
        console.error('Failed to load wallet verifications:', error);
        toast({
          title: "Error",
          description: "Failed to load wallet verifications",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadVerifications();
  }, [user, toast]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const confirmVerification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('wallet_verification_requests')
        .update({ provider_confirmed: true, updated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the local state
      setVerifications(prev => prev.map(v => v.id === id ? { ...v, verificationStatus: 'verified' } : v));
      
      toast({
        title: "Success",
        description: "Payment verification confirmed",
      });
    } catch (error) {
      console.error('Error confirming verification:', error);
      toast({
        title: "Error",
        description: "Failed to confirm verification",
        variant: "destructive"
      });
    }
  };

  const filteredVerifications = activeTab === 'all' 
    ? verifications 
    : verifications.filter(v => v.verificationStatus === activeTab);

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
                            <td className="py-3 px-4">{formatDate(verification.dateSubmitted)}</td>
                            <td className="py-3 px-4">{verification.referenceNumber}</td>
                            <td className="py-3 px-4">{verification.bookingId.substring(0, 8)}</td>
                            <td className="py-3 px-4">{verification.customerPhone}</td>
                            <td className="py-3 px-4">N${verification.amount.toLocaleString()}</td>
                            <td className="py-3 px-4">{getStatusBadge(verification.verificationStatus)}</td>
                            <td className="py-3 px-4">
                              {verification.verificationStatus === 'submitted' && (
                                <Button 
                                  size="sm"
                                  onClick={() => confirmVerification(verification.id)}
                                >
                                  Confirm
                                </Button>
                              )}
                              {verification.verificationStatus === 'verified' && (
                                <div className="flex items-center">
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                  <span className="text-sm">Confirmed</span>
                                </div>
                              )}
                              {verification.verificationStatus === 'rejected' && (
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

export default ProviderWalletVerificationPage;
