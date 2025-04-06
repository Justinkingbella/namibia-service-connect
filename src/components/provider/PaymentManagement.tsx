
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, CreditCard, Wallet, Phone } from 'lucide-react';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { PaymentMethod, PaymentMethodType } from '@/types';
import { useToast } from '@/hooks/use-toast';

const PaymentManagement = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const { paymentMethods, addPaymentMethod, removePaymentMethod, setDefault, isLoading } = usePaymentMethods();
  const { toast } = useToast();

  // Mock data for new payment method
  const [newMethod, setNewMethod] = useState<PaymentMethod>({
    id: '', // Will be generated on save
    userId: 'current-user', // Will be replaced with actual user ID
    name: '',
    type: 'credit_card' as PaymentMethodType,
    details: {},
    isDefault: false,
    createdAt: new Date().toISOString(),
  });

  // For storing form values
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  const [walletNumber, setWalletNumber] = useState('');
  const [walletProvider, setWalletProvider] = useState('e_wallet' as PaymentMethodType);
  const [walletName, setWalletName] = useState('');

  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankBranch, setBankBranch] = useState('');

  const [payfastId, setPayfastId] = useState('');
  const [payfastEmail, setPayfastEmail] = useState('');

  const resetForm = () => {
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    setWalletNumber('');
    setWalletProvider('e_wallet');
    setWalletName('');
    setBankName('');
    setAccountNumber('');
    setAccountName('');
    setBankBranch('');
    setPayfastId('');
    setPayfastEmail('');
    
    setNewMethod({
      id: '',
      userId: 'current-user',
      name: '',
      type: 'credit_card',
      details: {},
      isDefault: false,
      createdAt: new Date().toISOString(),
    });
  };

  const handleMethodSelect = (value: string) => {
    setSelectedMethod(value);
    
    // Update the payment method type
    setNewMethod({
      ...newMethod,
      type: value as PaymentMethodType,
    });
  };

  const handleSavePaymentMethod = () => {
    let details: Record<string, any> = {};
    let name = '';
    
    if (newMethod.type === 'credit_card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast({
          title: "Missing information",
          description: "Please fill in all card details",
          variant: "destructive"
        });
        return;
      }
      
      details = {
        cardNumber: cardNumber.replace(/\s/g, '').substring(0, 4) + " **** **** " + cardNumber.replace(/\s/g, '').slice(-4),
        cardName,
        expiryDate,
      };
      
      name = `${cardName}'s Card ending in ${cardNumber.replace(/\s/g, '').slice(-4)}`;
    } else if (newMethod.type === 'e_wallet' || newMethod.type === 'easy_wallet' || newMethod.type === 'mobile_money') {
      if (!walletNumber || !walletName) {
        toast({
          title: "Missing information",
          description: "Please fill in all e-wallet details",
          variant: "destructive"
        });
        return;
      }
      
      details = {
        walletNumber,
        walletProvider,
        walletName,
      };
      
      name = `${walletProvider} - ${walletName}`;
    } else if (newMethod.type === 'bank_transfer') {
      if (!bankName || !accountNumber || !accountName) {
        toast({
          title: "Missing information",
          description: "Please fill in all bank details",
          variant: "destructive"
        });
        return;
      }
      
      details = {
        bankName,
        accountNumber,
        accountName,
        bankBranch,
      };
      
      name = `${bankName} - ${accountName}`;
    } else if (newMethod.type === 'payfast') {
      if (!payfastId || !payfastEmail) {
        toast({
          title: "Missing information",
          description: "Please fill in all PayFast details",
          variant: "destructive"
        });
        return;
      }
      
      details = {
        payfastId,
        payfastEmail,
      };
      
      name = `PayFast - ${payfastEmail}`;
    }
    
    const paymentMethod: PaymentMethod = {
      ...newMethod,
      name,
      details,
    };
    
    addPaymentMethod(paymentMethod);
    resetForm();
    setSelectedMethod('');
    
    toast({
      title: "Payment method added",
      description: "Your new payment method has been saved",
      variant: "success"
    });
  };

  const handleRemovePaymentMethod = (id: string) => {
    removePaymentMethod(id);
    
    toast({
      title: "Payment method removed",
      description: "The payment method has been deleted",
      variant: "default"
    });
  };

  const handleSetDefault = (id: string) => {
    setDefault(id);
    
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated",
      variant: "success"
    });
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .substring(0, 5);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethods.map((method) => (
          <Card key={method.id} className={`${method.isDefault ? 'border-primary' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  {method.type === 'credit_card' && <CreditCard className="h-6 w-6 text-primary" />}
                  {(method.type === 'e_wallet' || method.type === 'easy_wallet') && <Wallet className="h-6 w-6 text-primary" />}
                  {method.type === 'mobile_money' && <Phone className="h-6 w-6 text-primary" />}
                  {method.type === 'bank_transfer' && <CreditCard className="h-6 w-6 text-primary" />}
                  {method.type === 'payfast' && <CreditCard className="h-6 w-6 text-primary" />}
                </div>
                {method.isDefault && (
                  <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Default
                  </div>
                )}
              </div>
              <CardTitle className="text-lg">{method.name}</CardTitle>
              <CardDescription>
                {method.type === 'credit_card' && 'Credit/Debit Card'}
                {method.type === 'e_wallet' && 'E-Wallet'}
                {method.type === 'easy_wallet' && 'Easy Wallet'}
                {method.type === 'mobile_money' && 'Mobile Money'}
                {method.type === 'bank_transfer' && 'Bank Transfer'}
                {method.type === 'payfast' && 'PayFast'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {method.type === 'credit_card' && (
                <div>
                  <p className="text-sm text-muted-foreground">Card Number</p>
                  <p className="font-medium">{method.details.cardNumber}</p>
                  <p className="text-sm text-muted-foreground mt-2">Expires</p>
                  <p className="font-medium">{method.details.expiryDate}</p>
                </div>
              )}
              {(method.type === 'e_wallet' || method.type === 'easy_wallet' || method.type === 'mobile_money') && (
                <div>
                  <p className="text-sm text-muted-foreground">Wallet Number</p>
                  <p className="font-medium">{method.details.walletNumber}</p>
                  <p className="text-sm text-muted-foreground mt-2">Provider</p>
                  <p className="font-medium">{method.details.walletProvider}</p>
                </div>
              )}
              {method.type === 'bank_transfer' && (
                <div>
                  <p className="text-sm text-muted-foreground">Bank</p>
                  <p className="font-medium">{method.details.bankName}</p>
                  <p className="text-sm text-muted-foreground mt-2">Account Number</p>
                  <p className="font-medium">**** **** {method.details.accountNumber?.slice(-4)}</p>
                </div>
              )}
              {method.type === 'payfast' && (
                <div>
                  <p className="text-sm text-muted-foreground">PayFast ID</p>
                  <p className="font-medium">{method.details.payfastId}</p>
                  <p className="text-sm text-muted-foreground mt-2">Email</p>
                  <p className="font-medium">{method.details.payfastEmail}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {!method.isDefault && (
                <Button 
                  variant="outline" 
                  onClick={() => handleSetDefault(method.id)}
                  disabled={isLoading}
                >
                  Set as Default
                </Button>
              )}
              <Button 
                variant="ghost" 
                onClick={() => handleRemovePaymentMethod(method.id)}
                disabled={isLoading}
              >
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {/* Add New Payment Method Card */}
        <Card>
          <CardHeader>
            <CardTitle>Add Payment Method</CardTitle>
            <CardDescription>Add a new way to get paid</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment-type">Payment Method Type</Label>
                <Select value={selectedMethod} onValueChange={handleMethodSelect}>
                  <SelectTrigger id="payment-type">
                    <SelectValue placeholder="Select payment method type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit/Debit Card</SelectItem>
                    <SelectItem value="e_wallet">E-Wallet</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="payfast">PayFast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedMethod === 'credit_card' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input 
                      id="card-number" 
                      placeholder="1234 5678 9012 3456" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input 
                      id="card-name" 
                      placeholder="John Doe" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY" 
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123" 
                        type="password" 
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {(selectedMethod === 'e_wallet' || selectedMethod === 'mobile_money') && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wallet-provider">Wallet Provider</Label>
                    <Select
                      value={walletProvider}
                      onValueChange={(value) => setWalletProvider(value as PaymentMethodType)}
                    >
                      <SelectTrigger id="wallet-provider">
                        <SelectValue placeholder="Select wallet provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="e_wallet">E-Wallet</SelectItem>
                        <SelectItem value="easy_wallet">Easy Wallet</SelectItem>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        <SelectItem value="MTC E-Wallet">MTC E-Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wallet-number">Wallet Number / Mobile Number</Label>
                    <Input 
                      id="wallet-number" 
                      placeholder="e.g. +264 81 123 4567" 
                      value={walletNumber}
                      onChange={(e) => setWalletNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wallet-name">Account Name</Label>
                    <Input 
                      id="wallet-name" 
                      placeholder="e.g. John Doe" 
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {selectedMethod === 'bank_transfer' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank-name">Bank Name</Label>
                    <Input 
                      id="bank-name" 
                      placeholder="e.g. Bank Windhoek" 
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input 
                      id="account-number" 
                      placeholder="e.g. 1234567890" 
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-name">Account Holder Name</Label>
                    <Input 
                      id="account-name" 
                      placeholder="e.g. John Doe" 
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank-branch">Branch Code (Optional)</Label>
                    <Input 
                      id="bank-branch" 
                      placeholder="e.g. 123456" 
                      value={bankBranch}
                      onChange={(e) => setBankBranch(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {selectedMethod === 'payfast' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payfast-id">PayFast Merchant ID</Label>
                    <Input 
                      id="payfast-id" 
                      placeholder="e.g. 10000100" 
                      value={payfastId}
                      onChange={(e) => setPayfastId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payfast-email">PayFast Email</Label>
                    <Input 
                      id="payfast-email" 
                      placeholder="e.g. merchant@example.com" 
                      value={payfastEmail}
                      onChange={(e) => setPayfastEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          {selectedMethod && (
            <CardFooter>
              <Button 
                variant="default" 
                className="w-full" 
                onClick={handleSavePaymentMethod}
                disabled={isLoading}
              >
                Save Payment Method
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PaymentManagement;
