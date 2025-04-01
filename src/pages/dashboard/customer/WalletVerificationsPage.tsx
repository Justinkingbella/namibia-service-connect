
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { WalletVerification, NamibianMobileOperator, NamibianBank } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarClock, FileText, CheckCircle, XCircle, Clock, Upload, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const WalletVerificationsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedVerification, setSelectedVerification] = useState<WalletVerification | null>(null);
  const [isNewVerificationOpen, setIsNewVerificationOpen] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  
  // New verification form state
  const [newVerification, setNewVerification] = useState({
    bookingId: '',
    providerId: '',
    paymentMethod: 'e_wallet' as 'e_wallet' | 'easy_wallet',
    amount: '',
    referenceNumber: '',
    customerPhone: '',
    providerPhone: '',
    proofType: 'receipt' as 'receipt' | 'screenshot' | 'reference',
    mobileOperator: 'MTC' as NamibianMobileOperator | undefined,
    bankUsed: undefined as NamibianBank | undefined,
    notes: ''
  });

  // Fetch bookings to use when creating a new verification
  const { data: bookings = [] } = useQuery({
    queryKey: ['customerBookings', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select('id, provider_id, service_id, total_amount')
        .eq('customer_id', user.id)
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        return [];
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch verifications
  const { data: verifications = [], isLoading } = useQuery({
    queryKey: ['customerWalletVerifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('wallet_verification_requests')
        .select('*')
        .eq('customer_id', user.id);
      
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

  const createVerificationMutation = useMutation({
    mutationFn: async (verification: typeof newVerification) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('wallet_verification_requests')
        .insert({
          booking_id: verification.bookingId,
          customer_id: user.id,
          provider_id: verification.providerId,
          amount: parseFloat(verification.amount),
          payment_method: verification.paymentMethod,
          reference_number: verification.referenceNumber,
          customer_phone: verification.customerPhone,
          provider_phone: verification.providerPhone || null,
          proof_type: verification.proofType,
          mobile_operator: verification.mobileOperator || null,
          bank_used: verification.bankUsed || null,
          receipt_image: uploadedImageUrl,
          notes: verification.notes,
          verification_status: 'submitted',
          customer_confirmed: true,
          provider_confirmed: false,
          admin_verified: false
        });
      
      if (error) throw error;
      
      return verification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerWalletVerifications'] });
      toast.success("Payment verification submitted successfully");
      setIsNewVerificationOpen(false);
      resetNewVerificationForm();
    },
    onError: (error) => {
      console.error('Error submitting verification:', error);
      toast.error("Failed to submit verification");
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploadingFile(true);
    
    try {
      // Create a bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .getBucket('receipts');
      
      if (bucketError && bucketError.message.includes('not found')) {
        await supabase.storage.createBucket('receipts', {
          public: true
        });
      }
      
      // Upload file
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('receipts')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase
        .storage
        .from('receipts')
        .getPublicUrl(filePath);
      
      setUploadedImageUrl(data.publicUrl);
      toast.success("Receipt uploaded successfully");
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Failed to upload receipt");
    } finally {
      setUploadingFile(false);
    }
  };

  const resetNewVerificationForm = () => {
    setNewVerification({
      bookingId: '',
      providerId: '',
      paymentMethod: 'e_wallet',
      amount: '',
      referenceNumber: '',
      customerPhone: '',
      providerPhone: '',
      proofType: 'receipt',
      mobileOperator: 'MTC',
      bankUsed: undefined,
      notes: ''
    });
    setUploadedImageUrl(null);
  };

  const handleBookingSelect = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setNewVerification({
        ...newVerification,
        bookingId: booking.id,
        providerId: booking.provider_id,
        amount: booking.total_amount.toString()
      });
    }
  };

  const handleSubmitNewVerification = () => {
    // Validate required fields
    if (!newVerification.bookingId) {
      toast.error("Please select a booking");
      return;
    }
    
    if (!newVerification.referenceNumber) {
      toast.error("Please enter a reference number");
      return;
    }
    
    if (!newVerification.customerPhone) {
      toast.error("Please enter your phone number");
      return;
    }
    
    // Submit the verification
    createVerificationMutation.mutate(newVerification);
  };

  const filteredVerifications = verifications.filter(v => {
    if (activeTab === 'pending') return v.verificationStatus === 'pending' || v.verificationStatus === 'submitted';
    if (activeTab === 'verified') return v.verificationStatus === 'verified';
    if (activeTab === 'rejected') return v.verificationStatus === 'rejected';
    return true;
  });

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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">My Verifications</h1>
            <p className="text-muted-foreground">Track and submit wallet payment verifications.</p>
          </div>
          <Button onClick={() => setIsNewVerificationOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Verification
          </Button>
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
                <Button onClick={() => setIsNewVerificationOpen(true)} className="mt-4">
                  Submit New Verification
                </Button>
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
                      
                      {selectedVerification.verificationStatus === 'rejected' && selectedVerification.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                          <div className="flex items-start">
                            <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-red-700">Verification Rejected</h4>
                              <p className="text-sm text-red-600">{selectedVerification.rejectionReason}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
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
                          <Label>Your Phone</Label>
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

                      {selectedVerification.receiptImage && (
                        <div>
                          <Label>Receipt/Proof</Label>
                          <div className="mt-2 border rounded-md overflow-hidden">
                            <img 
                              src={selectedVerification.receiptImage} 
                              alt="Receipt" 
                              className="w-full max-h-64 object-contain"
                            />
                          </div>
                        </div>
                      )}
                      
                      {selectedVerification.verificationStatus === 'rejected' && (
                        <div className="mt-4">
                          <Button onClick={() => {
                            setIsNewVerificationOpen(true);
                            setNewVerification({
                              ...newVerification,
                              bookingId: selectedVerification.bookingId,
                              providerId: selectedVerification.providerId || '',
                              amount: selectedVerification.amount.toString(),
                              paymentMethod: selectedVerification.paymentMethod
                            });
                          }}>
                            Resubmit Verification
                          </Button>
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

      {/* New Verification Dialog */}
      <Dialog open={isNewVerificationOpen} onOpenChange={setIsNewVerificationOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit New Verification</DialogTitle>
            <DialogDescription>
              Provide details about your e-wallet or easy wallet payment to verify it with the provider.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="booking">Select Booking</Label>
              <Select 
                value={newVerification.bookingId} 
                onValueChange={handleBookingSelect}
              >
                <SelectTrigger id="booking">
                  <SelectValue placeholder="Select a booking to verify" />
                </SelectTrigger>
                <SelectContent>
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <SelectItem key={booking.id} value={booking.id}>
                        Booking #{booking.id.substring(0, 8)} - N${booking.total_amount}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-bookings" disabled>
                      No pending bookings available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup
                value={newVerification.paymentMethod}
                onValueChange={(value: 'e_wallet' | 'easy_wallet') => 
                  setNewVerification({
                    ...newVerification,
                    paymentMethod: value,
                    mobileOperator: value === 'e_wallet' ? 'MTC' : undefined,
                    bankUsed: value === 'easy_wallet' ? 'FNB' : undefined
                  })
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="e_wallet" id="e_wallet" />
                  <Label htmlFor="e_wallet">E-Wallet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy_wallet" id="easy_wallet" />
                  <Label htmlFor="easy_wallet">Easy Wallet</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount (N$)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newVerification.amount}
                  onChange={(e) => setNewVerification({...newVerification, amount: e.target.value})}
                  readOnly={!!newVerification.bookingId}
                />
              </div>
              
              <div>
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  id="reference"
                  placeholder="e.g., EW12345678"
                  value={newVerification.referenceNumber}
                  onChange={(e) => setNewVerification({...newVerification, referenceNumber: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="customerPhone">Your Phone Number</Label>
                <Input
                  id="customerPhone"
                  placeholder="+264 XX XXX XXXX"
                  value={newVerification.customerPhone}
                  onChange={(e) => setNewVerification({...newVerification, customerPhone: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="providerPhone">Provider Phone Number (Optional)</Label>
                <Input
                  id="providerPhone"
                  placeholder="+264 XX XXX XXXX"
                  value={newVerification.providerPhone}
                  onChange={(e) => setNewVerification({...newVerification, providerPhone: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="proof-type">Proof Type</Label>
                <Select 
                  value={newVerification.proofType} 
                  onValueChange={(value: 'receipt' | 'screenshot' | 'reference') => 
                    setNewVerification({...newVerification, proofType: value})
                  }
                >
                  <SelectTrigger id="proof-type">
                    <SelectValue placeholder="Select proof type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receipt">Receipt</SelectItem>
                    <SelectItem value="screenshot">Screenshot</SelectItem>
                    <SelectItem value="reference">Reference Number Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newVerification.paymentMethod === 'e_wallet' && (
                <div>
                  <Label htmlFor="mobile-operator">Mobile Operator</Label>
                  <Select 
                    value={newVerification.mobileOperator} 
                    onValueChange={(value: NamibianMobileOperator) => 
                      setNewVerification({...newVerification, mobileOperator: value})
                    }
                  >
                    <SelectTrigger id="mobile-operator">
                      <SelectValue placeholder="Select mobile operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MTC">MTC</SelectItem>
                      <SelectItem value="TN Mobile">TN Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {newVerification.paymentMethod === 'easy_wallet' && (
                <div>
                  <Label htmlFor="bank">Bank Used</Label>
                  <Select 
                    value={newVerification.bankUsed} 
                    onValueChange={(value: NamibianBank) => 
                      setNewVerification({...newVerification, bankUsed: value})
                    }
                  >
                    <SelectTrigger id="bank">
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NED BANK">NED BANK</SelectItem>
                      <SelectItem value="FNB">FNB</SelectItem>
                      <SelectItem value="Bank Windhoek">Bank Windhoek</SelectItem>
                      <SelectItem value="Standard Bank">Standard Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about the payment"
                value={newVerification.notes}
                onChange={(e) => setNewVerification({...newVerification, notes: e.target.value})}
                className="h-20"
              />
            </div>
            
            <div>
              <Label>Upload Receipt/Screenshot (Optional)</Label>
              <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                {uploadedImageUrl ? (
                  <div className="w-full">
                    <img src={uploadedImageUrl} alt="Uploaded receipt" className="mx-auto max-h-48 object-contain mb-2" />
                    <Button 
                      variant="outline" 
                      className="w-full mt-2" 
                      onClick={() => setUploadedImageUrl(null)}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG (max 2MB)</p>
                    <Input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/png, image/jpeg"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                    />
                    {uploadingFile && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
                  </>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsNewVerificationOpen(false);
                resetNewVerificationForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitNewVerification}
              disabled={createVerificationMutation.isPending || uploadingFile}
            >
              {createVerificationMutation.isPending ? 'Submitting...' : 'Submit Verification'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

// For TypeScript compatibility
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default WalletVerificationsPage;
