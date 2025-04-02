
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentManagement from '@/components/provider/PaymentManagement';
import { Wallet, CreditCard, CircleDollarSign, Building } from 'lucide-react';

const PaymentDetailsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your payment methods and wallet
          </p>
        </div>

        <Tabs defaultValue="payment-methods" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="payment-methods" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payment Methods</span>
            </TabsTrigger>
            <TabsTrigger value="bank-accounts" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Bank Accounts</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="payment-settings" className="flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Payment Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payment-methods">
            <PaymentManagement type="payment-methods" />
          </TabsContent>
          <TabsContent value="bank-accounts">
            <PaymentManagement type="bank-accounts" />
          </TabsContent>
          <TabsContent value="wallet">
            <PaymentManagement type="wallet" />
          </TabsContent>
          <TabsContent value="payment-settings">
            <PaymentManagement type="payment-settings" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PaymentDetailsPage;
