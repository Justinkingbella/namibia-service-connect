
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bank, Wallet, CreditCard, CircleDollarSign, Smartphone } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePaymentMethods } from '@/hooks/usePaymentSystem';
import { toast } from 'sonner';
import { 
  NamibianBank, 
  NamibianEWallet,
  BankTransferDetails,
  EWalletDetails
} from '@/services/namibiaPaymentService';

interface PaymentMethodSelectorProps {
  amount: number;
  description: string;
  onPaymentInitiated?: (result: any) => void;
  onCancel?: () => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  amount,
  description,
  onPaymentInitiated,
  onCancel
}) => {
  const { 
    processBankTransfer,
    processEWalletPayment,
    processPayFastPayment,
    processDPOPayment,
    processEasyWalletPayment
  } = usePaymentMethods();

  const [paymentTab, setPaymentTab] = useState('bank');
  const [loading, setLoading] = useState(false);

  // Bank Transfer State
  const [bankName, setBankName] = useState<NamibianBank>('FNB Namibia');
  const [accountType, setAccountType] = useState<'savings' | 'checking' | 'business'>('checking');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  // E-Wallet State
  const [walletProvider, setWalletProvider] = useState<NamibianEWallet>('FNB eWallet');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [walletName, setWalletName] = useState('');

  // Base URL for redirects
  const baseUrl = window.location.origin;

  const handleBankTransfer = async () => {
    if (!accountNumber || !branchCode || !accountHolder) {
      toast.error('Please fill in all required bank details');
      return;
    }

    setLoading(true);
    try {
      const bankDetails: BankTransferDetails = {
        bankName,
        accountNumber,
        accountType,
        branchCode,
        accountHolder,
        reference: `Payment-${Date.now()}`
      };

      const result = await processBankTransfer(amount, bankDetails, description);
      
      if (result) {
        toast.success('Bank transfer initiated successfully');
        onPaymentInitiated?.(result);
      }
    } catch (error) {
      console.error('Error processing bank transfer:', error);
      toast.error('Failed to process bank transfer');
    } finally {
      setLoading(false);
    }
  };

  const handleEWalletPayment = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      const walletDetails: EWalletDetails = {
        provider: walletProvider,
        phoneNumber,
        accountName: walletName || undefined,
        reference: `Payment-${Date.now()}`
      };

      const result = await processEWalletPayment(amount, walletDetails, description);
      
      if (result) {
        toast.success('E-Wallet payment initiated successfully');
        onPaymentInitiated?.(result);
      }
    } catch (error) {
      console.error('Error processing e-wallet payment:', error);
      toast.error('Failed to process e-wallet payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePayFastPayment = async () => {
    setLoading(true);
    try {
      const result = await processPayFastPayment(
        amount,
        description,
        `${baseUrl}/payment-success`,
        `${baseUrl}/payment-canceled`
      );
      
      if (result?.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    } catch (error) {
      console.error('Error processing PayFast payment:', error);
      toast.error('Failed to process PayFast payment');
    } finally {
      setLoading(false);
    }
  };

  const handleDPOPayment = async () => {
    setLoading(true);
    try {
      const result = await processDPOPayment(
        amount,
        description,
        false, // not recurring
        {
          customerEmail: 'user@example.com', // This should come from user's profile
          customerName: 'Customer Name' // This should come from user's profile
        }
      );
      
      if (result?.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    } catch (error) {
      console.error('Error processing DPO payment:', error);
      toast.error('Failed to process DPO payment');
    } finally {
      setLoading(false);
    }
  };

  const handleEasyWalletPayment = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      const result = await processEasyWalletPayment(amount, phoneNumber, description);
      
      if (result) {
        toast.success('EasyWallet payment initiated successfully');
        onPaymentInitiated?.(result);
      }
    } catch (error) {
      console.error('Error processing EasyWallet payment:', error);
      toast.error('Failed to process EasyWallet payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
        <CardDescription>
          Choose how you would like to pay N${amount.toFixed(2)} for {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={paymentTab} onValueChange={setPaymentTab}>
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="bank" className="flex flex-col items-center gap-1 py-3">
              <Bank className="h-5 w-5" />
              <span className="text-xs">Bank</span>
            </TabsTrigger>
            <TabsTrigger value="ewallet" className="flex flex-col items-center gap-1 py-3">
              <Wallet className="h-5 w-5" />
              <span className="text-xs">E-Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="payfast" className="flex flex-col items-center gap-1 py-3">
              <CreditCard className="h-5 w-5" />
              <span className="text-xs">PayFast</span>
            </TabsTrigger>
            <TabsTrigger value="dpo" className="flex flex-col items-center gap-1 py-3">
              <CircleDollarSign className="h-5 w-5" />
              <span className="text-xs">DPO</span>
            </TabsTrigger>
            <TabsTrigger value="easywallet" className="flex flex-col items-center gap-1 py-3">
              <Smartphone className="h-5 w-5" />
              <span className="text-xs">EasyWallet</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bank" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="bank-name">Bank</Label>
                <Select value={bankName} onValueChange={(value) => setBankName(value as NamibianBank)}>
                  <SelectTrigger id="bank-name">
                    <SelectValue placeholder="Select Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FNB Namibia">First National Bank Namibia</SelectItem>
                    <SelectItem value="Standard Bank Namibia">Standard Bank Namibia</SelectItem>
                    <SelectItem value="Bank Windhoek">Bank Windhoek</SelectItem>
                    <SelectItem value="Nedbank Namibia">Nedbank Namibia</SelectItem>
                    <SelectItem value="Letshego Bank">Letshego Bank</SelectItem>
                    <SelectItem value="Other">Other Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="account-type">Account Type</Label>
                <RadioGroup 
                  value={accountType} 
                  onValueChange={(value) => setAccountType(value as 'savings' | 'checking' | 'business')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="checking" id="checking" />
                    <Label htmlFor="checking">Checking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="savings" id="savings" />
                    <Label htmlFor="savings">Savings</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business">Business</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="account-number">Account Number</Label>
                <Input 
                  id="account-number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter your account number"
                />
              </div>

              <div>
                <Label htmlFor="branch-code">Branch Code</Label>
                <Input 
                  id="branch-code"
                  value={branchCode}
                  onChange={(e) => setBranchCode(e.target.value)}
                  placeholder="Enter branch code"
                />
              </div>

              <div>
                <Label htmlFor="account-holder">Account Holder Name</Label>
                <Input 
                  id="account-holder"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Enter account holder name"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ewallet" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="wallet-provider">E-Wallet Provider</Label>
                <Select value={walletProvider} onValueChange={(value) => setWalletProvider(value as NamibianEWallet)}>
                  <SelectTrigger id="wallet-provider">
                    <SelectValue placeholder="Select E-Wallet Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FNB eWallet">FNB eWallet</SelectItem>
                    <SelectItem value="MTC Money">MTC Money</SelectItem>
                    <SelectItem value="Standard Bank BlueWallet">Standard Bank BlueWallet</SelectItem>
                    <SelectItem value="Nedbank Send-iMali">Nedbank Send-iMali</SelectItem>
                    <SelectItem value="Bank Windhoek EasyWallet">Bank Windhoek EasyWallet</SelectItem>
                    <SelectItem value="PayToday">PayToday</SelectItem>
                    <SelectItem value="Other">Other Mobile Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input 
                  id="phone-number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number (e.g., 264811234567)"
                />
              </div>

              <div>
                <Label htmlFor="wallet-name">Name (Optional)</Label>
                <Input 
                  id="wallet-name"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  placeholder="Enter name associated with wallet (optional)"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payfast" className="space-y-4">
            <div className="space-y-4 text-center">
              <div className="py-4">
                <CreditCard className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-medium">Pay with PayFast</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Secure credit card and instant EFT payments through PayFast Namibia
                </p>
              </div>
              <p className="text-sm">
                You will be redirected to PayFast to complete your payment of N${amount.toFixed(2)}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="dpo" className="space-y-4">
            <div className="space-y-4 text-center">
              <div className="py-4">
                <CircleDollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-medium">Pay with DPO</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Secure payment using DPO Namibia
                </p>
              </div>
              <p className="text-sm">
                You will be redirected to DPO to complete your payment of N${amount.toFixed(2)}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="easywallet" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="easywallet-phone">Phone Number</Label>
                <Input 
                  id="easywallet-phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your EasyWallet phone number"
                />
              </div>
              <div className="py-2">
                <p className="text-sm text-muted-foreground">
                  You will receive an SMS with instructions to complete your payment of N${amount.toFixed(2)}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button 
          disabled={loading}
          onClick={() => {
            switch (paymentTab) {
              case 'bank':
                handleBankTransfer();
                break;
              case 'ewallet':
                handleEWalletPayment();
                break;
              case 'payfast':
                handlePayFastPayment();
                break;
              case 'dpo':
                handleDPOPayment();
                break;
              case 'easywallet':
                handleEasyWalletPayment();
                break;
            }
          }}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentMethodSelector;
