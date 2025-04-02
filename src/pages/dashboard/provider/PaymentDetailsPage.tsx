
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CreditCard, Wallet, Building, AlertTriangle } from 'lucide-react';

const PaymentDetailsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Payment Methods</h1>
          <p className="text-muted-foreground mt-1">Manage your payment methods and preferences</p>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Payout Methods</h2>
          <p className="text-muted-foreground">How you receive your payment from service bookings</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-200 shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <Building className="h-5 w-5 mr-2 text-primary" />
                    Bank Transfer
                  </CardTitle>
                  <div className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">Default</div>
                </div>
                <CardDescription>Direct transfer to your bank account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Name:</span>
                    <span className="font-medium">First National Bank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Type:</span>
                    <span>Checking</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Number:</span>
                    <span>**** **** 4321</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">Remove</Button>
                <Button variant="outline" size="sm">Edit</Button>
              </CardFooter>
            </Card>
            
            <Card className="border-dashed border-2 border-gray-200 flex flex-col items-center justify-center p-6">
              <div className="mb-4 p-3 bg-gray-50 rounded-full">
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">Add Payment Method</h3>
              <p className="text-center text-muted-foreground text-sm mb-4">Set up another way to receive your payments</p>
              <Button>Add Payment Method</Button>
            </Card>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Wallet Verification</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Verify Customer Payments</CardTitle>
                <CardDescription>
                  Confirm customer payments made via mobile wallets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wallet-number">Your Wallet Number</Label>
                    <div className="flex mt-1">
                      <Input id="wallet-number" className="rounded-r-none" placeholder="Enter your wallet number" />
                      <Button className="rounded-l-none" variant="secondary">Verify</Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">This is the number customers will pay to</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-amber-50 rounded border border-amber-200">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800">Verification Required</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      To receive payments via mobile wallets, you need to verify your account details.
                      This helps us ensure secure and timely payments.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Wallet className="h-4 w-4 mr-2" />
                  Manage Wallet Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Payment Preferences</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Automatic Payouts</CardTitle>
                <CardDescription>
                  Configure how and when you receive your earnings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col">
                  <Label htmlFor="payout-threshold" className="mb-2">Minimum Payout Amount</Label>
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input
                      type="number"
                      id="payout-threshold"
                      placeholder="Enter amount"
                      defaultValue="100"
                    />
                    <Button type="submit">Save</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll automatically process your payout when your balance reaches this amount
                  </p>
                </div>
                
                <div className="flex flex-col">
                  <Label htmlFor="payout-schedule" className="mb-2">Payout Schedule</Label>
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <select 
                      id="payout-schedule"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="weekly">Weekly (Every Friday)</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <Button type="submit">Save</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose how often you want to receive your payments
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentDetailsPage;
