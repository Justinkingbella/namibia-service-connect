
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, Clock, CheckCircle2, AlertTriangle, FileCheck, ListPlus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { WalletVerificationRequest, WalletVerificationStatus } from '@/types';
import { WalletPaymentType } from '@/types/schema';

// Mock verification data
const mockVerifications: WalletVerificationRequest[] = [
  {
    id: '1',
    booking_id: 'book123',
    customer_id: 'user123',
    provider_id: 'provider123',
    amount: 350,
    date_submitted: new Date().toISOString(),
    verification_status: 'pending' as WalletVerificationStatus,
    payment_method: 'mobile_money' as WalletPaymentType,
    reference_number: '123456789',
    customer_phone: '+264 81 123 4567',
    provider_phone: '+264 81 987 6543'
  },
  {
    id: '2',
    booking_id: 'book456',
    customer_id: 'user123',
    provider_id: 'provider456',
    amount: 500,
    date_submitted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    date_verified: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    verified_by: 'provider456',
    verification_status: 'verified' as WalletVerificationStatus,
    payment_method: 'bank_transfer' as WalletPaymentType,
    reference_number: 'BT98765432',
    customer_phone: '+264 81 123 4567',
    provider_phone: '+264 81 555 5555'
  },
  {
    id: '3',
    booking_id: 'book789',
    customer_id: 'user123',
    provider_id: 'provider789',
    amount: 200,
    date_submitted: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    verification_status: 'rejected' as WalletVerificationStatus,
    payment_method: 'e_wallet' as WalletPaymentType,
    reference_number: 'EW123987',
    rejection_reason: 'Reference number not found in our system',
    customer_phone: '+264 81 123 4567',
    provider_phone: '+264 81 333 3333'
  }
];

const WalletVerificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('submit');
  const [verifications, setVerifications] = useState<WalletVerificationRequest[]>(mockVerifications);
  const [form, setForm] = useState({
    bookingId: '',
    providerId: '',
    amount: '',
    paymentMethod: 'mobile_money' as WalletPaymentType,
    referenceNumber: '',
    mobileOperator: 'MTC',
    bankName: '',
    notes: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bookingId || !form.providerId || !form.amount || !form.referenceNumber) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newVerification: WalletVerificationRequest = {
        id: `v-${Date.now()}`,
        booking_id: form.bookingId,
        customer_id: user?.id || '',
        provider_id: form.providerId,
        amount: Number(form.amount),
        date_submitted: new Date().toISOString(),
        verification_status: 'submitted' as WalletVerificationStatus,
        payment_method: form.paymentMethod as WalletPaymentType,
        reference_number: form.referenceNumber,
        customer_phone: user?.phoneNumber || '',
        provider_phone: '',
        notes: form.notes
      };

      setVerifications([newVerification, ...verifications]);
      
      toast({
        title: "Verification Submitted",
        description: "Your payment verification request has been submitted successfully",
        variant: "default"
      });
      
      // Reset form
      setForm({
        bookingId: '',
        providerId: '',
        amount: '',
        paymentMethod: 'mobile_money' as WalletPaymentType,
        referenceNumber: '',
        mobileOperator: 'MTC',
        bankName: '',
        notes: '',
      });
      setFile(null);
      setActiveTab('history');
      setSubmitting(false);
    }, 1500);
  };

  const getStatusBadge = (status: WalletVerificationStatus) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><ListPlus className="h-3 w-3 mr-1" /> Submitted</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" /> Verified</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><AlertTriangle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Wallet Payment Verification</h1>
          <p className="text-muted-foreground">Submit and track your wallet payment verifications</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="submit">Submit Verification</TabsTrigger>
            <TabsTrigger value="history">Verification History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Submit Payment Verification</CardTitle>
                <CardDescription>
                  Provide details of the payment you've made to verify it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bookingId">Booking ID*</Label>
                        <Input
                          id="bookingId"
                          placeholder="Enter booking ID"
                          value={form.bookingId}
                          onChange={(e) => setForm({ ...form, bookingId: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="providerId">Provider ID*</Label>
                        <Input
                          id="providerId"
                          placeholder="Enter provider ID"
                          value={form.providerId}
                          onChange={(e) => setForm({ ...form, providerId: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (N$)*</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="Enter amount"
                          value={form.amount}
                          onChange={(e) => setForm({ ...form, amount: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method*</Label>
                        <Select
                          value={form.paymentMethod}
                          onValueChange={(value) => setForm({ ...form, paymentMethod: value as WalletPaymentType })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mobile_money">Mobile Money</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="e_wallet">E-Wallet</SelectItem>
                            <SelectItem value="payfast">PayFast</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="referenceNumber">Transaction Reference Number*</Label>
                      <Input
                        id="referenceNumber"
                        placeholder="Enter reference number from your transaction"
                        value={form.referenceNumber}
                        onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })}
                        required
                      />
                      <p className="text-sm text-muted-foreground">This is the unique reference number provided by your payment provider</p>
                    </div>
                    
                    {form.paymentMethod === 'mobile_money' && (
                      <div className="space-y-2">
                        <Label htmlFor="mobileOperator">Mobile Operator</Label>
                        <Select
                          value={form.mobileOperator}
                          onValueChange={(value) => setForm({ ...form, mobileOperator: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select mobile operator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MTC">MTC</SelectItem>
                            <SelectItem value="TN Mobile">TN Mobile</SelectItem>
                            <SelectItem value="Leo">Leo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {form.paymentMethod === 'bank_transfer' && (
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Select
                          value={form.bankName}
                          onValueChange={(value) => setForm({ ...form, bankName: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select bank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="First National Bank">First National Bank</SelectItem>
                            <SelectItem value="Standard Bank">Standard Bank</SelectItem>
                            <SelectItem value="Bank Windhoek">Bank Windhoek</SelectItem>
                            <SelectItem value="Nedbank">Nedbank</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="receipt">Upload Receipt (Optional)</Label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-medium">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PNG, JPG or PDF (MAX. 5MB)
                            </p>
                          </div>
                          <input 
                            id="receipt" 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setFile(e.target.files[0]);
                              }
                            }}
                            accept=".png,.jpg,.jpeg,.pdf" 
                          />
                        </label>
                      </div>
                      {file && (
                        <p className="text-sm mt-2">
                          File selected: {file.name} ({Math.round(file.size / 1024)} KB)
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Input
                        id="notes"
                        placeholder="Any additional information about the payment"
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Verification'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Verification History</CardTitle>
                <CardDescription>
                  Track the status of your payment verifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Your payment verification history.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verifications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">No verification records found</TableCell>
                      </TableRow>
                    ) : (
                      verifications.map((verification) => (
                        <TableRow key={verification.id}>
                          <TableCell>{formatDate(verification.date_submitted)}</TableCell>
                          <TableCell>{verification.booking_id?.substring(0, 8)}</TableCell>
                          <TableCell>{formatCurrency(verification.amount)}</TableCell>
                          <TableCell className="capitalize">
                            {verification.payment_method?.replace('_', ' ')}
                          </TableCell>
                          <TableCell>{verification.reference_number}</TableCell>
                          <TableCell>
                            {getStatusBadge(verification.verification_status)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-xl flex items-center">
                <Wallet className="h-5 w-5 mr-2 text-primary" />
                Wallet Verification Guide
              </CardTitle>
              <CardDescription>
                How to verify your wallet payments quickly and efficiently
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-green-600" />
                  Steps to Verify Your Payment
                </h3>
                <ol className="ml-9 mt-2 space-y-2 list-decimal">
                  <li>Make the payment using your preferred method (Mobile Money, Bank Transfer, etc.)</li>
                  <li>Keep the payment reference number or screenshot/receipt of the transaction</li>
                  <li>Submit a verification request with accurate payment details</li>
                  <li>The service provider will review and confirm receipt of your payment</li>
                  <li>Once verified, your booking will be automatically confirmed</li>
                </ol>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-medium text-amber-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                  Important Notes
                </h4>
                <ul className="ml-7 mt-2 space-y-1 list-disc text-amber-800">
                  <li>Always include the correct reference number from your transaction</li>
                  <li>Verification typically takes 1-24 hours depending on the payment method</li>
                  <li>For faster verification, upload a clear image of your payment receipt</li>
                  <li>Contact support if your verification is pending for more than 24 hours</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WalletVerificationsPage;
