
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DollarSign, CreditCard, Smartphone, Building, Wallet, Edit, Trash, PlusCircle } from 'lucide-react';
import { PaymentMethod } from '@/types';

interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
  fee: number;
  processingTime: string;
}

const PaymentMethodsControl: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([
    {
      id: 'pay_today',
      name: 'PayToday',
      description: 'Direct online payment via PayToday gateway',
      enabled: true,
      icon: <CreditCard className="h-6 w-6" />,
      fee: 2.5,
      processingTime: 'Instant',
    },
    {
      id: 'pay_fast',
      name: 'PayFast',
      description: 'Secure payment through PayFast',
      enabled: true,
      icon: <DollarSign className="h-6 w-6" />,
      fee: 3.0,
      processingTime: 'Instant',
    },
    {
      id: 'e_wallet',
      name: 'E-Wallet',
      description: 'Pay via mobile E-Wallet',
      enabled: true,
      icon: <Smartphone className="h-6 w-6" />,
      fee: 1.5,
      processingTime: 'Instant',
    },
    {
      id: 'dop',
      name: 'DOP',
      description: 'Digital online payments via DOP',
      enabled: false,
      icon: <Wallet className="h-6 w-6" />,
      fee: 2.0,
      processingTime: 'Instant',
    },
    {
      id: 'easy_wallet',
      name: 'EasyWallet',
      description: 'Mobile money payments',
      enabled: true,
      icon: <Smartphone className="h-6 w-6" />,
      fee: 1.8,
      processingTime: 'Instant',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank transfers',
      enabled: true,
      icon: <Building className="h-6 w-6" />,
      fee: 0.5,
      processingTime: '1-2 business days',
    },
    {
      id: 'cash',
      name: 'Cash',
      description: 'Cash payment on delivery',
      enabled: true,
      icon: <DollarSign className="h-6 w-6" />,
      fee: 0,
      processingTime: 'On delivery',
    },
  ]);

  const togglePaymentMethod = (id: PaymentMethod) => {
    setPaymentMethods(methods => 
      methods.map(method => 
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Manage available payment options for users
            </CardDescription>
          </div>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  {method.icon}
                </div>
                <div>
                  <h3 className="font-medium">{method.name}</h3>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                  <div className="flex items-center mt-1 space-x-4">
                    <span className="text-xs text-muted-foreground">Fee: {method.fee}%</span>
                    <span className="text-xs text-muted-foreground">Processing: {method.processingTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
                <div className="flex items-center">
                  <Switch
                    id={`method-${method.id}`}
                    checked={method.enabled}
                    onCheckedChange={() => togglePaymentMethod(method.id)}
                  />
                  <Label htmlFor={`method-${method.id}`} className="ml-2">
                    {method.enabled ? 'Enabled' : 'Disabled'}
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsControl;
