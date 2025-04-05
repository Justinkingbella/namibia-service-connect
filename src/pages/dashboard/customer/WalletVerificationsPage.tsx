import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WalletVerification, NamibianMobileOperator, NamibianBank, WalletPaymentType } from '@/types/payment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { WalletVerificationStatus } from '@/types';

const WalletVerificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<WalletVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [selectedVerification, setSelectedVerification] = useState<WalletVerification | null>(null);
  const [submissionData, setSubmissionData] = useState({
    paymentMethod: 'e_wallet' as WalletPaymentType,
    mobileOperator: '' as NamibianMobileOperator | '',
    bankUsed: '' as NamibianBank | '',
    referenceNumber: '',
    amount: 0,
    notes: '',
    phoneNumber: user?.phoneNumber || '',
  });
  
  const bookings = [
    { id: 'book-1', service: 'Professional Cleaning', date: '2023-04-15', amount: 250 },
    { id: 'book-2', service: 'Garden Maintenance', date: '2023-04-20', amount: 350 },
    { id: 'book-3', service: 'Plumbing Repair', date: '2023-04-25', amount: 500 },
  ];

  const mockVerifications: WalletVerification[] = [
    {
      id: 'ver-1',
      bookingId: 'book-1',
      customerId: user?.id || '',
      providerId: 'prov-1',
      amount: 250,
      paymentMethod: 'MTC E-Wallet',
      referenceNumber: 'EW12345678',
      customerPhone: '0811234567',
      providerPhone: '0812345678',
      dateSubmitted: new Date('2023-04-16T10:30:00'),
      verificationStatus: 'verified',
      customerConfirmed: true,
      providerConfirmed: true,
      adminVerified: true,
      dateVerified: new Date('2023-04-17T14:20:00'),
      verifiedBy: 'admin-user',
      proofType: 'screenshot',
      mobileOperator: 'MTC',
    },
    {
      id: 'ver-2',
      bookingId: 'book-2',
      customerId: user?.id || '',
      providerId: 'prov-2',
      amount: 350,
      paymentMethod: 'Bank Transfer',
      referenceNumber: 'BT98765432',
      customerPhone: '0811234567',
      dateSubmitted: new Date('2023-04-22T09:15:00'),
      verificationStatus: 'pending',
      customerConfirmed: true,
      providerConfirmed: false,
      adminVerified: false,
      proofType: 'receipt',
      bankUsed: 'First National Bank',
    },
  ];

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        setLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setVerifications(mockVerifications);
      } catch (error) {
        console.error('Error fetching verifications:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load payment verifications',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchVerifications();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubmissionData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSubmissionData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitVerification = async () => {
    try {
      const { paymentMethod, mobileOperator, bankUsed, referenceNumber, amount, notes, phoneNumber } = submissionData;
      
      if (!referenceNumber) {
        toast({
          variant: 'destructive',
          title: 'Missing information',
          description: 'Please provide a reference number',
        });
        return;
      }
      
      if (paymentMethod === 'e_wallet' && !mobileOperator) {
        toast({
          variant: 'destructive',
          title: 'Missing information',
          description: 'Please select your mobile operator',
        });
        return;
      }
      
      if (paymentMethod !== 'e_wallet' && !bankUsed) {
        toast({
          variant: 'destructive',
          title: 'Missing information',
          description: 'Please select your bank',
        });
        return;
      }
      
      console.log('Submitting verification:', {
        bookingId: selectedBookingId,
        customerId: user?.id,
        amount,
        paymentMethod,
        referenceNumber,
        customerPhone: phoneNumber,
        dateSubmitted: new Date(),
        verificationStatus: 'pending',
        customerConfirmed: true,
        providerConfirmed: false,
        adminVerified: false,
        notes,
        mobileOperator: paymentMethod === 'e_wallet' ? mobileOperator : undefined,
        bankUsed: paymentMethod !== 'e_wallet' ? bankUsed : undefined,
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newVerification: WalletVerification = {
        id: `ver-${Date.now()}`,
        bookingId: selectedBookingId,
        customerId: user?.id || '',
        amount,
        paymentMethod,
        referenceNumber,
        customerPhone: phoneNumber,
        dateSubmitted: new Date(),
        verificationStatus: 'pending',
        customerConfirmed: true,
        providerConfirmed: false,
        adminVerified: false,
        notes,
        mobileOperator: paymentMethod === 'e_wallet' ? mobileOperator as NamibianMobileOperator : undefined,
        bankUsed: paymentMethod !== 'e_wallet' ? bankUsed as NamibianBank : undefined,
        proofType: '',
      };
      
      setVerifications(prev => [...prev, newVerification]);
      setIsSubmitDialogOpen(false);
      
      setSubmissionData({
        paymentMethod: 'e_wallet' as WalletPaymentType,
        mobileOperator: '' as NamibianMobileOperator | '',
        bankUsed: '' as NamibianBank | '',
        referenceNumber: '',
        amount: 0,
        notes: '',
        phoneNumber: user?.phoneNumber || '',
      });
      
      toast({
        title: 'Verification submitted',
        description: 'Your payment verification has been submitted successfully',
      });
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: 'There was an error submitting your verification',
      });
    }
  };

  const viewVerificationDetails = (verification: WalletVerification) => {
    setSelectedVerification(verification);
    setIsDetailsDialogOpen(true);
  };

  const getStatusBadge = (status: WalletVerificationStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Verified</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unpaidBookings = bookings.filter(booking => 
    !verifications.some(v => v.bookingId === booking.id)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payment Verifications</h1>
          <p className="text-muted-foreground">
            Submit and track payment verifications for your bookings
          </p>
        </div>

        <Tabs defaultValue="verifications">
          <TabsList className="mb-4">
            <TabsTrigger value="verifications">My Verifications</TabsTrigger>
            <TabsTrigger value="submit">Submit Verification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="verifications">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : verifications.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    You haven't submitted any payment verifications yet.
                  </p>
                  <Button 
                    onClick={() => setIsSubmitDialogOpen(true)} 
                    className="mt-4"
                  >
                    Submit a Verification
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {verifications.map((verification) => {
                  const booking = bookings.find(b => b.id === verification.bookingId);
                  
                  return (
                    <Card key={verification.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {booking?.service || 'Unknown Service'}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Submitted on {formatDate(verification.dateSubmitted)}
                              </p>
                            </div>
                            {getStatusBadge(verification.verificationStatus)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Amount</p>
                              <p className="font-medium">N${verification.amount}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Payment Method</p>
                              <p className="font-medium">{verification.paymentMethod}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Reference</p>
                              <p className="font-medium">{verification.referenceNumber}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => viewVerificationDetails(verification)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Submit Payment Verification</CardTitle>
              </CardHeader>
              <CardContent>
                {unpaidBookings.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">You don't have any bookings that need payment verification.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-muted-foreground">
                      Select a booking and submit payment verification details for it.
                    </p>
                    
                    {unpaidBookings.map(booking => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{booking.service}</h3>
                              <p className="text-sm text-muted-foreground">
                                Date: {new Date(booking.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm font-medium mt-1">
                                Amount: N${booking.amount}
                              </p>
                            </div>
                            <Button 
                              onClick={() => {
                                setSelectedBookingId(booking.id);
                                setSubmissionData(prev => ({
                                  ...prev,
                                  amount: booking.amount,
                                }));
                                setIsSubmitDialogOpen(true);
                              }}
                            >
                              Verify Payment
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Payment Verification</DialogTitle>
            <DialogDescription>
              Provide details of your payment to verify it.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <Select 
                value={submissionData.paymentMethod}
                onValueChange={(value) => handleSelectChange('paymentMethod', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="e_wallet">MTC/TN Mobile E-Wallet</SelectItem>
                  <SelectItem value="easy_wallet">Easy Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {submissionData.paymentMethod === 'e_wallet' && (
              <div>
                <label className="text-sm font-medium">Mobile Operator</label>
                <Select 
                  value={submissionData.mobileOperator}
                  onValueChange={(value) => handleSelectChange('mobileOperator', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mobile operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MTC">MTC</SelectItem>
                    <SelectItem value="TN Mobile">TN Mobile</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium">Phone Number Used</label>
              <Input 
                name="phoneNumber"
                value={submissionData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Transaction Reference Number</label>
              <Input 
                name="referenceNumber"
                value={submissionData.referenceNumber}
                onChange={handleInputChange}
                placeholder="Enter reference number"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The reference number provided by your payment provider.
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Amount</label>
              <Input 
                name="amount"
                type="number"
                value={submissionData.amount || ''}
                onChange={handleInputChange}
                placeholder="Enter amount"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Additional Notes (Optional)</label>
              <Textarea 
                name="notes"
                value={submissionData.notes}
                onChange={handleInputChange}
                placeholder="Any additional information..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitVerification}>
              Submit Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Verification Details</DialogTitle>
          </DialogHeader>
          
          {selectedVerification && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium">
                  {getStatusBadge(selectedVerification.verificationStatus)}
                </span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">N${selectedVerification.amount}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium">{selectedVerification.paymentMethod}</span>
              </div>
              
              {selectedVerification.mobileOperator && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mobile Operator:</span>
                  <span className="font-medium">{selectedVerification.mobileOperator}</span>
                </div>
              )}
              
              {selectedVerification.bankUsed && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank:</span>
                  <span className="font-medium">{selectedVerification.bankUsed}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference Number:</span>
                <span className="font-medium">{selectedVerification.referenceNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date Submitted:</span>
                <span className="font-medium">{formatDate(selectedVerification.dateSubmitted)}</span>
              </div>
              
              {selectedVerification.dateVerified && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Verified:</span>
                  <span className="font-medium">{formatDate(selectedVerification.dateVerified)}</span>
                </div>
              )}
              
              {selectedVerification.verificationStatus === 'rejected' && selectedVerification.rejectionReason && (
                <div>
                  <span className="text-muted-foreground">Rejection Reason:</span>
                  <p className="mt-1 p-2 bg-red-50 rounded text-sm">
                    {selectedVerification.rejectionReason}
                  </p>
                </div>
              )}
              
              {selectedVerification.notes && (
                <div>
                  <span className="text-muted-foreground">Notes:</span>
                  <p className="mt-1 p-2 bg-gray-50 rounded text-sm">
                    {selectedVerification.notes}
                  </p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default WalletVerificationsPage;
