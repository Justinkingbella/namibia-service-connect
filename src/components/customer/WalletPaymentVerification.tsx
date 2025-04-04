
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WalletVerification, WalletVerificationStatus, NamibianMobileOperator, NamibianBank, WalletPaymentType } from '@/types/payment';

interface WalletPaymentVerificationProps {
  bookingId: string;
  amount: number;
  onVerificationSubmitted: (data: Partial<WalletVerification>) => Promise<void>;
}

const WalletPaymentVerification: React.FC<WalletPaymentVerificationProps> = ({
  bookingId,
  amount,
  onVerificationSubmitted
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<WalletPaymentType>("e_wallet");
  const [referenceNumber, setReferenceNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [mobileOperator, setMobileOperator] = useState<NamibianMobileOperator | ''>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!referenceNumber) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please provide a reference number',
      });
      return;
    }
    
    if (!phoneNumber) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please provide your phone number',
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
    
    setIsSubmitting(true);

    try {
      const verificationData: Partial<WalletVerification> = {
        bookingId,
        amount,
        paymentMethod,
        referenceNumber,
        customerPhone: phoneNumber,
        verificationStatus: 'submitted',
        dateSubmitted: new Date(),
        customerConfirmed: true,
        providerConfirmed: false,
        adminVerified: false,
      };
      
      if (paymentMethod === 'e_wallet' && mobileOperator) {
        verificationData.mobileOperator = mobileOperator;
      }
      
      await onVerificationSubmitted(verificationData);
      
      toast({
        title: 'Verification submitted',
        description: 'Your payment verification has been submitted',
      });
      
      // Reset form
      setReferenceNumber('');
      setMobileOperator('');
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: 'There was an error submitting your verification',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Payment Method</label>
            <Select 
              value={paymentMethod}
              onValueChange={(value: WalletPaymentType) => setPaymentMethod(value)}
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
          
          {paymentMethod === 'e_wallet' && (
            <div>
              <label className="text-sm font-medium">Mobile Operator</label>
              <Select 
                value={mobileOperator}
                onValueChange={(value: NamibianMobileOperator) => setMobileOperator(value)}
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
            <label className="text-sm font-medium">Transaction Reference Number</label>
            <Input 
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Enter reference number"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              This is the reference number provided by your mobile operator after completing the payment.
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Phone Number Used</label>
            <Input 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              The mobile number you used to make the payment.
            </p>
          </div>
          
          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Payment Verification'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WalletPaymentVerification;
