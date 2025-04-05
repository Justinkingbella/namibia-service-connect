
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  AlertCircle,
  CreditCard,
  SmartphoneNfc,
  Bank,
  Wallet,
  Trash2,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PaymentProvider {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  logo?: string;
  commissionRate: number;
  fixedFee: number;
  setupDate: string;
}

interface WithdrawalMethod {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  minAmount: number;
  maxAmount: number;
  processingDays: string;
  fee: number;
}

const mockPaymentProviders: PaymentProvider[] = [
  {
    id: '1',
    name: 'MTC Mobile Money',
    type: 'mobile_money',
    isActive: true,
    logo: 'https://placehold.co/100x60?text=MTC',
    commissionRate: 2.5,
    fixedFee: 5,
    setupDate: '2023-05-12',
  },
  {
    id: '2',
    name: 'Bank Windhoek',
    type: 'bank_transfer',
    isActive: true,
    logo: 'https://placehold.co/100x60?text=Bank',
    commissionRate: 1.8,
    fixedFee: 10,
    setupDate: '2023-05-15',
  },
  {
    id: '3',
    name: 'Easy Wallet',
    type: 'e_wallet',
    isActive: true,
    logo: 'https://placehold.co/100x60?text=Wallet',
    commissionRate: 3.0,
    fixedFee: 2,
    setupDate: '2023-06-01',
  },
  {
    id: '4',
    name: 'Cash Payment',
    type: 'cash',
    isActive: true,
    logo: 'https://placehold.co/100x60?text=Cash',
    commissionRate: 0,
    fixedFee: 0,
    setupDate: '2023-04-20',
  },
];

const mockWithdrawalMethods: WithdrawalMethod[] = [
  {
    id: '1',
    name: 'Bank Transfer',
    type: 'bank_transfer',
    isActive: true,
    minAmount: 100,
    maxAmount: 100000,
    processingDays: '1-3 business days',
    fee: 15,
  },
  {
    id: '2',
    name: 'MTC Mobile Money',
    type: 'mobile_money',
    isActive: true,
    minAmount: 50,
    maxAmount: 5000,
    processingDays: 'Instant',
    fee: 10,
  },
  {
    id: '3',
    name: 'Easy Wallet',
    type: 'e_wallet',
    isActive: false,
    minAmount: 20,
    maxAmount: 10000,
    processingDays: 'Instant',
    fee: 5,
  },
];

const PaymentSettingsPage: React.FC = () => {
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>(mockPaymentProviders);
  const [withdrawalMethods, setWithdrawalMethods] = useState<WithdrawalMethod[]>(mockWithdrawalMethods);
  
  const [commissionRate, setCommissionRate] = useState(10);
  const [minWithdrawalAmount, setMinWithdrawalAmount] = useState(100);
  const [autoWithdrawals, setAutoWithdrawals] = useState(false);
  const [withdrawalSchedule, setWithdrawalSchedule] = useState('weekly');

  const toggleProviderStatus = (id: string) => {
    setPaymentProviders(providers =>
      providers.map(provider =>
        provider.id === id ? { ...provider, isActive: !provider.isActive } : provider
      )
    );
  };

  const toggleWithdrawalMethodStatus = (id: string) => {
    setWithdrawalMethods(methods =>
      methods.map(method =>
        method.id === id ? { ...method, isActive: !method.isActive } : method
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Settings</h1>
          <p className="text-muted-foreground">
            Configure payment providers, withdrawal methods, and commission rates
          </p>
        </div>

        <Tabs defaultValue="providers">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="providers">Payment Providers</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="commission">Commission Settings</TabsTrigger>
          </TabsList>

          {/* Payment Providers Tab */}
          <TabsContent value="providers">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-1">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Payment Providers</CardTitle>
                    <CardDescription>
                      Configure the payment options available to customers
                    </CardDescription>
                  </div>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Provider
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Provider</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Fixed Fee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentProviders.map((provider) => (
                        <TableRow key={provider.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {provider.logo ? (
                                <div className="h-10 w-16 bg-gray-100 flex items-center justify-center rounded border">
                                  <img
                                    src={provider.logo}
                                    alt={provider.name}
                                    className="max-h-8 max-w-14"
                                  />
                                </div>
                              ) : (
                                <div className="h-10 w-16 bg-gray-100 flex items-center justify-center rounded border">
                                  {provider.type === 'mobile_money' && <SmartphoneNfc className="h-5 w-5 text-gray-500" />}
                                  {provider.type === 'bank_transfer' && <Bank className="h-5 w-5 text-gray-500" />}
                                  {provider.type === 'e_wallet' && <Wallet className="h-5 w-5 text-gray-500" />}
                                  {provider.type === 'cash' && <CreditCard className="h-5 w-5 text-gray-500" />}
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{provider.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Set up: {provider.setupDate}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="capitalize" variant="outline">
                              {provider.type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{provider.commissionRate}%</TableCell>
                          <TableCell>N${provider.fixedFee}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {provider.isActive ? (
                                <Badge className="bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Disabled
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button
                                variant={provider.isActive ? "outline" : "default"}
                                size="sm"
                                onClick={() => toggleProviderStatus(provider.id)}
                              >
                                {provider.isActive ? 'Disable' : 'Enable'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Withdrawals Tab */}
          <TabsContent value="withdrawals">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Withdrawal Methods</CardTitle>
                      <CardDescription>
                        Configure how providers can withdraw their earnings
                      </CardDescription>
                    </div>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Method
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Method</TableHead>
                          <TableHead>Limits</TableHead>
                          <TableHead>Processing Time</TableHead>
                          <TableHead>Fee</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {withdrawalMethods.map((method) => (
                          <TableRow key={method.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  {method.type === 'mobile_money' && <SmartphoneNfc className="h-5 w-5 text-primary" />}
                                  {method.type === 'bank_transfer' && <Bank className="h-5 w-5 text-primary" />}
                                  {method.type === 'e_wallet' && <Wallet className="h-5 w-5 text-primary" />}
                                </div>
                                <div>
                                  <p className="font-medium">{method.name}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              N${method.minAmount} - N${method.maxAmount}
                            </TableCell>
                            <TableCell>{method.processingDays}</TableCell>
                            <TableCell>
                              {method.fee > 0 ? `N$${method.fee}` : 'Free'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {method.isActive ? (
                                  <Badge className="bg-green-50 text-green-700 border-green-200">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Disabled
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button
                                  variant={method.isActive ? "outline" : "default"}
                                  size="sm"
                                  onClick={() => toggleWithdrawalMethodStatus(method.id)}
                                >
                                  {method.isActive ? 'Disable' : 'Enable'}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Withdrawal Schedule</CardTitle>
                    <CardDescription>
                      Configure when automatic withdrawals are processed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-withdrawals">Automatic withdrawals</Label>
                      <Switch
                        id="auto-withdrawals"
                        checked={autoWithdrawals}
                        onCheckedChange={setAutoWithdrawals}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="min-amount">Minimum withdrawal amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          N$
                        </span>
                        <Input
                          id="min-amount"
                          type="number"
                          className="pl-8"
                          value={minWithdrawalAmount}
                          onChange={(e) => setMinWithdrawalAmount(parseInt(e.target.value))}
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="schedule">Payment schedule</Label>
                      <Select value={withdrawalSchedule} onValueChange={setWithdrawalSchedule}>
                        <SelectTrigger id="schedule">
                          <SelectValue placeholder="Select schedule" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly (Every Monday)</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly (1st of month)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button className="w-full">
                      Save Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Commission Settings Tab */}
          <TabsContent value="commission">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Commission</CardTitle>
                  <CardDescription>
                    Configure the commission rates charged to service providers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="commission-rate">Default commission rate (%)</Label>
                    <div className="relative">
                      <Input
                        id="commission-rate"
                        type="number"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(parseInt(e.target.value))}
                        min="0"
                        max="100"
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        %
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      This is the default commission rate for all providers. You can set custom rates for specific subscription tiers.
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h3 className="text-sm font-medium mb-4">Commission by Subscription Tier</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Free Tier</p>
                          <p className="text-sm text-muted-foreground">Basic access</p>
                        </div>
                        <div className="relative w-24">
                          <Input
                            type="number"
                            value="15"
                            min="0"
                            max="100"
                            className="pr-8 text-right"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            %
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Basic Tier</p>
                          <p className="text-sm text-muted-foreground">Standard features</p>
                        </div>
                        <div className="relative w-24">
                          <Input
                            type="number"
                            value="10"
                            min="0"
                            max="100"
                            className="pr-8 text-right"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            %
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Premium Tier</p>
                          <p className="text-sm text-muted-foreground">Advanced features</p>
                        </div>
                        <div className="relative w-24">
                          <Input
                            type="number"
                            value="8"
                            min="0"
                            max="100"
                            className="pr-8 text-right"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            %
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Professional Tier</p>
                          <p className="text-sm text-muted-foreground">All features</p>
                        </div>
                        <div className="relative w-24">
                          <Input
                            type="number"
                            value="5"
                            min="0"
                            max="100"
                            className="pr-8 text-right"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Update Commission Settings
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Custom Rates for Categories</CardTitle>
                  <CardDescription>
                    Set specific commission rates for different service categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Home Services</p>
                        <p className="text-sm text-muted-foreground">Cleaning, plumbing, etc.</p>
                      </div>
                      <div className="relative w-24">
                        <Input
                          type="number"
                          value="12"
                          min="0"
                          max="100"
                          className="pr-8 text-right"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          %
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Professional Services</p>
                        <p className="text-sm text-muted-foreground">Legal, accounting, etc.</p>
                      </div>
                      <div className="relative w-24">
                        <Input
                          type="number"
                          value="8"
                          min="0"
                          max="100"
                          className="pr-8 text-right"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          %
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Freelance</p>
                        <p className="text-sm text-muted-foreground">Design, writing, etc.</p>
                      </div>
                      <div className="relative w-24">
                        <Input
                          type="number"
                          value="10"
                          min="0"
                          max="100"
                          className="pr-8 text-right"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          %
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Transport</p>
                        <p className="text-sm text-muted-foreground">Rides, delivery, etc.</p>
                      </div>
                      <div className="relative w-24">
                        <Input
                          type="number"
                          value="15"
                          min="0"
                          max="100"
                          className="pr-8 text-right"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between">
                      <Button variant="outline">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                      <Button>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PaymentSettingsPage;
