
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CreditCard, Wallet, DollarSign, BanknoteIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentSettingsPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Payment Gateway Settings
  const [paymentGateways, setPaymentGateways] = useState([
    {
      id: 'credit_card',
      name: 'Credit Card',
      enabled: true,
      commission: 2.9,
      fixedFee: 0.3,
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      enabled: true,
      commission: 1.5,
      fixedFee: 0.1,
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      enabled: false,
      commission: 1.0,
      fixedFee: 0.5,
      icon: <BanknoteIcon className="h-5 w-5" />,
    },
    {
      id: 'payfast',
      name: 'PayFast',
      enabled: false,
      commission: 3.5,
      fixedFee: 0.0,
      icon: <DollarSign className="h-5 w-5" />,
    },
  ]);

  // Commission Settings
  const [defaultCommission, setDefaultCommission] = useState(10);
  const [commissionTiers, setCommissionTiers] = useState([
    { tier: 'Basic', commission: 15, minMonthlyBookings: 0 },
    { tier: 'Standard', commission: 10, minMonthlyBookings: 5 },
    { tier: 'Premium', commission: 7, minMonthlyBookings: 20 },
    { tier: 'Elite', commission: 5, minMonthlyBookings: 50 },
  ]);

  // Payout Settings
  const [payoutSettings, setPayoutSettings] = useState({
    minimumPayout: 100,
    payoutFrequency: 'weekly',
    autoPayout: true,
    payoutDay: '1', // For monthly payouts, the day of the month
    payoutWeekday: 'friday', // For weekly payouts, the day of the week
  });

  // Currency Settings
  const [currencySettings, setCurrencySettings] = useState({
    primaryCurrency: 'NAD',
    displayFormat: 'symbol',
    decimalPlaces: 2,
  });

  const handleSavePaymentGateways = () => {
    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings saved!",
        description: "Payment gateway settings have been updated.",
      });
    }, 1000);
  };

  const handleSaveCommissionSettings = () => {
    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings saved!",
        description: "Commission settings have been updated.",
      });
    }, 1000);
  };

  const handleSavePayoutSettings = () => {
    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings saved!",
        description: "Payout settings have been updated.",
      });
    }, 1000);
  };

  const handleSaveCurrencySettings = () => {
    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings saved!",
        description: "Currency settings have been updated.",
      });
    }, 1000);
  };

  const toggleGatewayStatus = (id: string) => {
    setPaymentGateways(paymentGateways.map(gateway => 
      gateway.id === id ? { ...gateway, enabled: !gateway.enabled } : gateway
    ));
  };

  const updateGatewayCommission = (id: string, value: number) => {
    setPaymentGateways(paymentGateways.map(gateway => 
      gateway.id === id ? { ...gateway, commission: value } : gateway
    ));
  };

  const updateGatewayFixedFee = (id: string, value: number) => {
    setPaymentGateways(paymentGateways.map(gateway => 
      gateway.id === id ? { ...gateway, fixedFee: value } : gateway
    ));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Settings</h1>
          <p className="text-muted-foreground">
            Configure payment gateways, commission rates, and payout options.
          </p>
        </div>
        
        <Tabs defaultValue="gateways">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gateways">Payment Gateways</TabsTrigger>
            <TabsTrigger value="commission">Commission</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gateways" className="space-y-4 mt-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {paymentGateways.map(gateway => (
                <Card key={gateway.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      {gateway.icon}
                      <CardTitle className="text-lg">{gateway.name}</CardTitle>
                    </div>
                    <Switch 
                      checked={gateway.enabled} 
                      onCheckedChange={() => toggleGatewayStatus(gateway.id)} 
                    />
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${gateway.id}-commission`}>Commission (%)</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id={`${gateway.id}-commission`}
                          type="number" 
                          value={gateway.commission}
                          onChange={(e) => updateGatewayCommission(gateway.id, parseFloat(e.target.value))}
                          step="0.1"
                          min="0"
                          max="100"
                          disabled={!gateway.enabled}
                        />
                        <span>%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${gateway.id}-fixed-fee`}>Fixed Fee (N$)</Label>
                      <div className="flex items-center space-x-2">
                        <span>N$</span>
                        <Input 
                          id={`${gateway.id}-fixed-fee`}
                          type="number" 
                          value={gateway.fixedFee}
                          onChange={(e) => updateGatewayFixedFee(gateway.id, parseFloat(e.target.value))}
                          step="0.01"
                          min="0"
                          disabled={!gateway.enabled}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button onClick={handleSavePaymentGateways} disabled={loading}>
              {loading ? 'Saving...' : 'Save Gateway Settings'}
            </Button>
          </TabsContent>
          
          <TabsContent value="commission" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Default Commission Rate</CardTitle>
                <CardDescription>This is the default commission percentage taken from each transaction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 max-w-sm">
                  <Input 
                    type="number" 
                    value={defaultCommission}
                    onChange={(e) => setDefaultCommission(parseInt(e.target.value))}
                    step="1"
                    min="0"
                    max="100"
                  />
                  <span>%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Commission Tiers</CardTitle>
                <CardDescription>Set different commission rates based on provider activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-12 font-medium text-sm border-b pb-2">
                  <div className="col-span-3">Tier</div>
                  <div className="col-span-4">Min. Monthly Bookings</div>
                  <div className="col-span-5">Commission Rate</div>
                </div>
                {commissionTiers.map((tier, index) => (
                  <div key={index} className="grid grid-cols-12 items-center">
                    <div className="col-span-3">
                      <Input 
                        value={tier.tier} 
                        onChange={(e) => {
                          const newTiers = [...commissionTiers];
                          newTiers[index].tier = e.target.value;
                          setCommissionTiers(newTiers);
                        }}
                        className="h-9"
                      />
                    </div>
                    <div className="col-span-4 px-2">
                      <Input 
                        type="number"
                        value={tier.minMonthlyBookings}
                        onChange={(e) => {
                          const newTiers = [...commissionTiers];
                          newTiers[index].minMonthlyBookings = parseInt(e.target.value);
                          setCommissionTiers(newTiers);
                        }}
                        min="0"
                        className="h-9"
                      />
                    </div>
                    <div className="col-span-4 px-2">
                      <div className="flex items-center space-x-2">
                        <Input 
                          type="number"
                          value={tier.commission}
                          onChange={(e) => {
                            const newTiers = [...commissionTiers];
                            newTiers[index].commission = parseInt(e.target.value);
                            setCommissionTiers(newTiers);
                          }}
                          min="0"
                          max="100"
                          step="0.5"
                          className="h-9"
                        />
                        <span>%</span>
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newTiers = commissionTiers.filter((_, i) => i !== index);
                          setCommissionTiers(newTiers);
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCommissionTiers([
                      ...commissionTiers,
                      { tier: 'New Tier', commission: 10, minMonthlyBookings: 0 }
                    ]);
                  }}
                >
                  Add Tier
                </Button>
                <Button onClick={handleSaveCommissionSettings} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Commission Settings'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="payouts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
                <CardDescription>Configure how and when service providers receive payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="minimum-payout">Minimum Payout Amount (N$)</Label>
                  <div className="flex items-center space-x-2 max-w-sm">
                    <span>N$</span>
                    <Input 
                      id="minimum-payout"
                      type="number" 
                      value={payoutSettings.minimumPayout}
                      onChange={(e) => setPayoutSettings({...payoutSettings, minimumPayout: parseFloat(e.target.value)})}
                      min="0"
                      step="10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payout-frequency">Payout Frequency</Label>
                  <Select 
                    value={payoutSettings.payoutFrequency}
                    onValueChange={(value) => setPayoutSettings({...payoutSettings, payoutFrequency: value})}
                  >
                    <SelectTrigger id="payout-frequency" className="max-w-sm">
                      <SelectValue placeholder="Select payout frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {payoutSettings.payoutFrequency === 'weekly' && (
                  <div className="space-y-2">
                    <Label htmlFor="payout-weekday">Payout Day</Label>
                    <Select 
                      value={payoutSettings.payoutWeekday}
                      onValueChange={(value) => setPayoutSettings({...payoutSettings, payoutWeekday: value})}
                    >
                      <SelectTrigger id="payout-weekday" className="max-w-sm">
                        <SelectValue placeholder="Select payout day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                        <SelectItem value="saturday">Saturday</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {payoutSettings.payoutFrequency === 'monthly' && (
                  <div className="space-y-2">
                    <Label htmlFor="payout-day">Payout Day of Month</Label>
                    <Select 
                      value={payoutSettings.payoutDay}
                      onValueChange={(value) => setPayoutSettings({...payoutSettings, payoutDay: value})}
                    >
                      <SelectTrigger id="payout-day" className="max-w-sm">
                        <SelectValue placeholder="Select day of month" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(28)].map((_, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                        <SelectItem value="last">Last day of month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="auto-payout"
                    checked={payoutSettings.autoPayout}
                    onCheckedChange={(checked) => setPayoutSettings({...payoutSettings, autoPayout: checked})}
                  />
                  <Label htmlFor="auto-payout">Automatic Payouts</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePayoutSettings} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Payout Settings'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="currency" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Currency Settings</CardTitle>
                <CardDescription>Configure how currencies are displayed and processed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="primary-currency">Primary Currency</Label>
                  <Select 
                    value={currencySettings.primaryCurrency}
                    onValueChange={(value) => setCurrencySettings({...currencySettings, primaryCurrency: value})}
                  >
                    <SelectTrigger id="primary-currency" className="max-w-sm">
                      <SelectValue placeholder="Select primary currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NAD">Namibian Dollar (NAD)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="display-format">Display Format</Label>
                  <Select 
                    value={currencySettings.displayFormat}
                    onValueChange={(value) => setCurrencySettings({...currencySettings, displayFormat: value})}
                  >
                    <SelectTrigger id="display-format" className="max-w-sm">
                      <SelectValue placeholder="Select display format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="symbol">Symbol (N$)</SelectItem>
                      <SelectItem value="code">Code (NAD)</SelectItem>
                      <SelectItem value="both">Both (NAD N$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="decimal-places">Decimal Places</Label>
                  <Select 
                    value={currencySettings.decimalPlaces.toString()}
                    onValueChange={(value) => setCurrencySettings({...currencySettings, decimalPlaces: parseInt(value)})}
                  >
                    <SelectTrigger id="decimal-places" className="max-w-sm">
                      <SelectValue placeholder="Select decimal places" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 (N$ 100)</SelectItem>
                      <SelectItem value="2">2 (N$ 100.00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveCurrencySettings} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Currency Settings'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PaymentSettingsPage;
