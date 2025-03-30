
import React, { useState } from 'react';
import { Bell, CreditCard, Globe, Lock, Mail, Settings, User } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SettingsCard from '@/components/dashboard/SettingsCard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    darkMode: false,
    twoFactorAuth: false,
    shareBookingHistory: true
  });
  
  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Settings updated",
      description: "Your setting changes have been saved.",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SettingsCard 
                title="Profile Information" 
                description="Update your account profile information and avatar" 
                icon={<User className="h-5 w-5" />}
              />
              <SettingsCard 
                title="Email Address" 
                description="Change your email address" 
                icon={<Mail className="h-5 w-5" />}
              />
              <SettingsCard 
                title="Language & Region" 
                description="Set your preferred language and region" 
                icon={<Globe className="h-5 w-5" />}
              />
            </div>
            
            {user?.role === 'provider' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Provider Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SettingsCard 
                    title="Service Categories" 
                    description="Update the categories you provide services in" 
                    icon={<Settings className="h-5 w-5" />}
                  />
                  <SettingsCard 
                    title="Business Hours" 
                    description="Set your regular business hours and availability" 
                  />
                  <SettingsCard 
                    title="Service Areas" 
                    description="Define the geographic areas you serve" 
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about your account via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={() => handleToggle('emailNotifications')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important notifications via SMS
                      </p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={settings.smsNotifications}
                      onCheckedChange={() => handleToggle('smsNotifications')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive promotional emails and special offers
                      </p>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={settings.marketingEmails}
                      onCheckedChange={() => handleToggle('marketingEmails')}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Notification Events</h3>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">When to notify you:</h4>
                  <ul className="ml-6 list-disc text-sm space-y-1 text-muted-foreground">
                    <li>New booking requests</li>
                    <li>Booking status changes</li>
                    <li>Messages from service providers or customers</li>
                    <li>Payment confirmations</li>
                    <li>Service reminders</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={settings.twoFactorAuth}
                      onCheckedChange={() => handleToggle('twoFactorAuth')}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline">
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Login Activity</h3>
                <div className="rounded-md border">
                  <div className="p-4 border-b">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Windhoek, Namibia</p>
                        <p className="text-sm text-muted-foreground">Today at 2:30 PM</p>
                      </div>
                      <span className="text-green-600 text-sm">Current Session</span>
                    </div>
                  </div>
                  <div className="p-4 border-b">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Windhoek, Namibia</p>
                        <p className="text-sm text-muted-foreground">Yesterday at 10:15 AM</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Windhoek, Namibia</p>
                        <p className="text-sm text-muted-foreground">June 15, 2023 at 8:45 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SettingsCard 
                    title="Add Payment Method" 
                    description="Add a new credit card or debit card" 
                    icon={<CreditCard className="h-5 w-5" />}
                  />
                  
                  {user?.role === 'provider' && (
                    <SettingsCard 
                      title="Payout Settings" 
                      description="Set up your payout method and frequency" 
                    />
                  )}
                </div>
              </div>
              
              {user?.role === 'provider' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Tax Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingsCard 
                      title="Tax Documents" 
                      description="Upload and manage your tax documents" 
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="share-history">Share Booking History</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow service providers to see your previous bookings
                      </p>
                    </div>
                    <Switch
                      id="share-history"
                      checked={settings.shareBookingHistory}
                      onCheckedChange={() => handleToggle('shareBookingHistory')}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Privacy Information</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    We take your privacy seriously. Your data is protected according to our Privacy Policy.
                  </p>
                  <Button variant="outline" className="mt-2">View Privacy Policy</Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Data Export & Deletion</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    You can export or request deletion of your account data at any time.
                  </p>
                  <div className="flex flex-col md:flex-row gap-2 mt-2">
                    <Button variant="outline">Export My Data</Button>
                    <Button variant="destructive">Request Account Deletion</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Appearance Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark modes
                      </p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={settings.darkMode}
                      onCheckedChange={() => handleToggle('darkMode')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
