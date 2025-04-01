
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { WalletVerification } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { CalendarClock, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const WalletVerificationPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedVerification, setSelectedVerification] = useState<WalletVerification | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch wallet verifications from Supabase
  const { data: verifications = [], isLoading } = useQuery({
    queryKey: ['walletVerifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('wallet_verification_requests')
        .select('*')
        .eq('provider_id', user.id);
      
      if (error) {
        console.error('Error fetching verifications:', error);
        toast.error('Failed to load verifications');
        return [];
      }
      
      // Transform data to match our frontend type
      return data.map(v => ({
        id: v.id,
        bookingId: v.booking_id,
        customerId: v.customer_id,
        providerId: v.provider_id,
        amount: v.amount,
        paymentMethod: v.payment_method as 'e_wallet' | 'easy_wallet',
        referenceNumber: v.reference_number,
        customerPhone: v.customer_phone,
        providerPhone: v.provider_phone,
        dateSubmitted: new Date(v.date_submitted),
        verificationStatus: v.verification_status as WalletVerification['verificationStatus'],
        dateVerified: v.date_verified ? new Date(v.date_verified) : undefined,
        verifiedBy: v.verified_by,
        notes: v.notes,
        customerConfirmed: v.customer_confirmed,
        providerConfirmed: v.provider_confirmed,
        adminVerified: v.admin_verified,
        proofType: v.proof_type as 'receipt' | 'screenshot' | 'reference',
        receiptImage: v.receipt_image,
        mobileOperator: v.mobile_operator as any,
        bankUsed: v.bank_used as any,
        rejectionReason: v.rejection_reason
      }));
    },
    enabled: !!user?.id
  });

  // Mutation to confirm verification
  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('wallet_verification_requests')
        .update({
          provider_confirmed: true,
          verification_status: 'submitted',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletVerifications'] });
      toast.success("Payment verification confirmed");
      setSelectedVerification(null);
    },
    onError: (error) => {
      console.error('Error confirming verification:', error);
      toast.error("Failed to confirm verification");
    }
  });

  // Mutation to reject verification
  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string, reason: string }) => {
      const { error } = await supabase
        .from('wallet_verification_requests')
        .update({
          provider_confirmed: false,
          verification_status: 'rejected',
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletVerifications'] });
      toast.success("Payment verification rejected");
      setSelectedVerification(null);
      setRejectReason('');
    },
    onError: (error) => {
      console.error('Error rejecting verification:', error);
      toast.error("Failed to reject verification");
    }
  });

  const filteredVerifications = verifications.filter(v => {
    if (activeTab === 'pending') return v.verificationStatus === 'pending' || v.verificationStatus === 'submitted';
    if (activeTab === 'verified') return v.verificationStatus === 'verified';
    if (activeTab === 'rejected') return v.verificationStatus === 'rejected';
    return true;
  });

  const handleConfirmVerification = (id: string) => {
    confirmMutation.mutate(id);
  };

  const handleRejectVerification = (id: string) => {
    if (!rejectReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    rejectMutation.mutate({ id, reason: rejectReason });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'submitted':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Wallet Verifications</h1>
          <p className="text-muted-foreground">Manage and confirm your wallet payment verifications.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
                <CalendarClock className="h-10 w-10 mx-auto text-gray-400 animate-pulse" />
                <h3 className="mt-4 text-lg font-medium">Loading verifications...</h3>
              </div>
            ) : filteredVerifications.length === 0 ? (
              <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
                <CalendarClock className="h-10 w-10 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No verifications found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No {activeTab === 'all' ? '' : activeTab} wallet verifications at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 space-y-4">
                  {filteredVerifications.map((verification) => (
                    <div 
                      key={verification.id}
                      className={cn(
                        "bg-white rounded-xl border p-4 cursor-pointer hover:border-primary/50 transition-colors",
                        selectedVerification?.id === verification.id && "border-primary/50 shadow-sm"
                      )}
                      onClick={() => setSelectedVerification(verification)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium">{verification.paymentMethod === 'e_wallet' ? 'E-Wallet' : 'Easy Wallet'} Payment</div>
                          <div className="text-xs text-gray-500">Ref: {verification.referenceNumber}</div>
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                          getStatusBadgeClass(verification.verificationStatus)
                        )}>
                          {getStatusIcon(verification.verificationStatus)}
                          <span>
                            {verification.verificationStatus.charAt(0).toUpperCase() + verification.verificationStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Amount:</span>
                          <span className="font-medium">N${verification.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Date:</span>
                          <span>{verification.dateSubmitted.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="lg:col-span-2">
                  {selectedVerification ? (
                    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">
                          Verification Details
                        </h3>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                          getStatusBadgeClass(selectedVerification.verificationStatus)
                        )}>
                          {getStatusIcon(selectedVerification.verificationStatus)}
                          <span>
                            {selectedVerification.verificationStatus.charAt(0).toUpperCase() + selectedVerification.verificationStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Payment Method</Label>
                          <Input 
                            value={selectedVerification.paymentMethod === 'e_wallet' ? 'E-Wallet' : 'Easy Wallet'} 
                            readOnly 
                            className="bg-gray-50 mt-1"
                          />
                        </div>
                        <div>
                          <Label>Amount</Label>
                          <Input 
                            value={`N$${selectedVerification.amount.toLocaleString()}`} 
                            readOnly 
                            className="bg-gray-50 mt-1"
                          />
                        </div>
                        <div>
                          <Label>Reference Number</Label>
                          <Input 
                            value={selectedVerification.referenceNumber} 
                            readOnly 
                            className="bg-gray-50 mt-1"
                          />
                        </div>
                        <div>
                          <Label>Date Submitted</Label>
                          <Input 
                            value={selectedVerification.dateSubmitted.toLocaleDateString()} 
                            readOnly 
                            className="bg-gray-50 mt-1"
                          />
                        </div>
                        <div>
                          <Label>Customer Phone</Label>
                          <Input 
                            value={selectedVerification.customerPhone} 
                            readOnly 
                            className="bg-gray-50 mt-1"
                          />
                        </div>
                        {selectedVerification.providerPhone && (
                          <div>
                            <Label>Provider Phone</Label>
                            <Input 
                              value={selectedVerification.providerPhone} 
                              readOnly 
                              className="bg-gray-50 mt-1"
                            />
                          </div>
                        )}
                        <div>
                          <Label>Proof Type</Label>
                          <Input 
                            value={selectedVerification.proofType.charAt(0).toUpperCase() + selectedVerification.proofType.slice(1)} 
                            readOnly 
                            className="bg-gray-50 mt-1"
                          />
                        </div>
                        {selectedVerification.mobileOperator && (
                          <div>
                            <Label>Mobile Operator</Label>
                            <Input 
                              value={selectedVerification.mobileOperator} 
                              readOnly 
                              className="bg-gray-50 mt-1"
                            />
                          </div>
                        )}
                        {selectedVerification.bankUsed && (
                          <div>
                            <Label>Bank Used</Label>
                            <Input 
                              value={selectedVerification.bankUsed} 
                              readOnly 
                              className="bg-gray-50 mt-1"
                            />
                          </div>
                        )}
                      </div>

                      {selectedVerification.notes && (
                        <div>
                          <Label>Notes</Label>
                          <Textarea 
                            value={selectedVerification.notes} 
                            readOnly 
                            className="bg-gray-50 mt-1 h-20"
                          />
                        </div>
                      )}

                      {selectedVerification.verificationStatus === 'pending' && (
                        <div className="space-y-4">
                          <div className="flex space-x-2 mt-4">
                            <Button 
                              onClick={() => handleConfirmVerification(selectedVerification.id)}
                              disabled={confirmMutation.isPending}
                            >
                              {confirmMutation.isPending ? 'Confirming...' : 'Confirm Payment'}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                if (document.getElementById('reject-reason')) {
                                  // Toggle rejection form
                                  const form = document.getElementById('reject-form');
                                  if (form) {
                                    form.classList.toggle('hidden');
                                  }
                                }
                              }}
                            >
                              Reject Payment
                            </Button>
                          </div>
                          
                          <div id="reject-form" className="hidden space-y-4 border border-red-200 p-4 rounded-md">
                            <div>
                              <Label htmlFor="reject-reason">Reason for Rejection</Label>
                              <Textarea 
                                id="reject-reason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Please provide a reason for rejection"
                                className="h-20"
                              />
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                variant="destructive"
                                onClick={() => handleRejectVerification(selectedVerification.id)}
                                disabled={rejectMutation.isPending || !rejectReason}
                              >
                                {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  const form = document.getElementById('reject-form');
                                  if (form) {
                                    form.classList.add('hidden');
                                  }
                                  setRejectReason('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border shadow-sm p-8 text-center h-full flex flex-col items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium">No verification selected</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Select a verification from the list to view details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// For TypeScript compatibility
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default WalletVerificationPage;
