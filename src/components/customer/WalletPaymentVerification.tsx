
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WalletVerification, WalletVerificationStatus } from '@/types/payment';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Upload, RefreshCcw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WalletPaymentVerificationProps {
  bookingId: string;
  providerPhone: string;
  amount: number;
  onVerificationSubmit: (verification: Partial<WalletVerification>) => void;
  existingVerification?: WalletVerification;
}

const WalletPaymentVerification: React.FC<WalletPaymentVerificationProps> = ({
  bookingId,
  providerPhone,
  amount,
  onVerificationSubmit,
  existingVerification
}) => {
  const [uploading, setUploading] = useState(false);
  const [walletType, setWalletType] = useState<'e_wallet' | 'easy_wallet'>(
    existingVerification?.paymentMethod || 'easy_wallet'
  );
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      referenceNumber: existingVerification?.referenceNumber || '',
      customerPhone: existingVerification?.customerPhone || '',
      notes: existingVerification?.notes || '',
      proofType: existingVerification?.proofType || 'receipt'
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setUploading(false);
      toast.success("Receipt uploaded successfully");
    }, 1500);
  };

  const onSubmit = (data: any) => {
    const verification: Partial<WalletVerification> = {
      bookingId,
      paymentMethod: walletType,
      amount,
      referenceNumber: data.referenceNumber,
      customerPhone: data.customerPhone,
      providerPhone,
      notes: data.notes,
      proofType: data.proofType,
      customerConfirmed: true,
      providerConfirmed: false,
      adminVerified: false,
      verificationStatus: 'submitted',
      dateSubmitted: new Date()
    };
    
    onVerificationSubmit(verification);
    toast.success("Payment verification submitted successfully");
  };

  const getStatusBadge = (status: WalletVerificationStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700"><Upload className="h-3 w-3 mr-1" /> Submitted</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-50 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Verified</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700"><AlertCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700"><RefreshCcw className="h-3 w-3 mr-1" /> Expired</Badge>;
      default:
        return null;
    }
  };

  if (existingVerification?.verificationStatus === 'verified') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Verification - Approved</CardTitle>
          <CardDescription>
            Your payment has been verified and confirmed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-center my-4">
              <div className="p-4 bg-green-50 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Wallet Type</Label>
                <div className="font-medium mt-1">
                  {existingVerification.paymentMethod === 'e_wallet' ? 'E-Wallet' : 'EasyWallet'}
                </div>
              </div>
              
              <div>
                <Label>Reference Number</Label>
                <div className="font-medium mt-1">
                  {existingVerification.referenceNumber}
                </div>
              </div>
              
              <div>
                <Label>Amount</Label>
                <div className="font-medium mt-1">
                  N${existingVerification.amount.toFixed(2)}
                </div>
              </div>
              
              <div>
                <Label>Date Verified</Label>
                <div className="font-medium mt-1">
                  {existingVerification.dateVerified ? 
                    new Date(existingVerification.dateVerified).toLocaleDateString() : 'Not verified yet'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Wallet Payment Verification
          {existingVerification && (
            <span className="ml-2">{getStatusBadge(existingVerification.verificationStatus)}</span>
          )}
        </CardTitle>
        <CardDescription>
          Verify your wallet payment for this booking
        </CardDescription>
      </CardHeader>
      <CardContent>
        {existingVerification?.verificationStatus === 'rejected' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-700">Verification Rejected</h4>
                <p className="text-sm text-red-600">
                  {existingVerification.notes || 'Please check your details and try again.'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-type">Wallet Type</Label>
              <Select 
                value={walletType} 
                onValueChange={(value) => setWalletType(value as 'e_wallet' | 'easy_wallet')}
                disabled={!!existingVerification}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy_wallet">EasyWallet</SelectItem>
                  <SelectItem value="e_wallet">E-Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reference">Reference/Transaction Number</Label>
              <Input 
                id="reference"
                {...register('referenceNumber', { required: "Reference number is required" })}
                disabled={!!existingVerification}
                className={errors.referenceNumber ? "border-red-500" : ""}
              />
              {errors.referenceNumber && (
                <p className="text-sm text-red-500">{errors.referenceNumber.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Your Phone Number</Label>
              <Input 
                id="phone"
                {...register('customerPhone', { 
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Please enter a valid 10-digit phone number"
                  }
                })}
                disabled={!!existingVerification}
                className={errors.customerPhone ? "border-red-500" : ""}
              />
              {errors.customerPhone && (
                <p className="text-sm text-red-500">{errors.customerPhone.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount"
                value={`N$${amount.toFixed(2)}`}
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proof-type">Proof Type</Label>
              <Select defaultValue="receipt" disabled={!!existingVerification}>
                <SelectTrigger>
                  <SelectValue placeholder="Select proof type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receipt">Receipt</SelectItem>
                  <SelectItem value="screenshot">Screenshot</SelectItem>
                  <SelectItem value="reference">Reference Number Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="receipt">Upload Receipt (Optional)</Label>
              <div className="mt-1">
                <Input
                  id="receipt" 
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading || !!existingVerification}
                  accept="image/*"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea 
                id="notes"
                {...register('notes')}
                placeholder="Add any additional information about your payment"
                disabled={!!existingVerification}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        {!existingVerification && (
          <Button 
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || uploading}
          >
            Submit Verification
          </Button>
        )}
        
        {existingVerification?.verificationStatus === 'rejected' && (
          <Button 
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || uploading}
          >
            Resubmit Verification
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WalletPaymentVerification;
