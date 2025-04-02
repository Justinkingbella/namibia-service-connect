import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { fetchSiteSettings, updateSiteSetting, uploadImage } from '@/services/settingsService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/ui/avatar';
import { toast } from 'sonner';

const SiteSettingsPage = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      const data = await fetchSiteSettings();
      setSettings(data);
      setLoading(false);
    };

    loadSettings();
  }, []);

  const handleTextChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSetting = async (key: string) => {
    setSaving(true);
    const success = await updateSiteSetting(key, settings[key]);
    setSaving(false);
    
    if (success) {
      toast.success(`${key} updated successfully`);
    } else {
      toast.error(`Failed to update ${key}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const path = `site_settings/${key}`;
    
    setSaving(true);
    const imageUrl = await uploadImage(file, path);
    
    if (imageUrl) {
      setSettings(prev => ({ ...prev, [key]: imageUrl }));
      await updateSiteSetting(key, imageUrl);
      toast.success('Image uploaded successfully');
    } else {
      toast.error('Failed to upload image');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage global settings for your platform
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Information</CardTitle>
                <CardDescription>
                  Basic information about your platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Platform Name</Label>
                  <div className="flex gap-2">
                    <Input
                      id="site_name"
                      value={settings.site_name || ''}
                      onChange={(e) => handleTextChange('site_name', e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={() => handleSaveSetting('site_name')} disabled={saving}>
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site_description">Platform Description</Label>
                  <div className="flex gap-2">
                    <Textarea
                      id="site_description"
                      value={settings.site_description || ''}
                      onChange={(e) => handleTextChange('site_description', e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={() => handleSaveSetting('site_description')} disabled={saving}>
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="contact_email"
                      type="email"
                      value={settings.contact_email || ''}
                      onChange={(e) => handleTextChange('contact_email', e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={() => handleSaveSetting('contact_email')} disabled={saving}>
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site_maintenance_mode" className="flex items-center gap-2">
                    <Switch
                      id="site_maintenance_mode"
                      checked={settings.site_maintenance_mode || false}
                      onCheckedChange={(checked) => {
                        handleToggleChange('site_maintenance_mode', checked);
                        handleSaveSetting('site_maintenance_mode');
                      }}
                    />
                    <span>Maintenance Mode</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the site will display a maintenance page to all non-admin users.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>
                  Customize your platform's branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Platform Logo</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      {settings.site_logo ? (
                        <img src={settings.site_logo} alt="Platform Logo" />
                      ) : (
                        <div className="bg-primary text-primary-foreground flex items-center justify-center h-full w-full text-xl">
                          Logo
                        </div>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'site_logo')}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Recommended size: 200x200px
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <div className="flex gap-2 items-center flex-1">
                      <Input
                        type="color"
                        value={settings.primary_color || '#000000'}
                        onChange={(e) => handleTextChange('primary_color', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={settings.primary_color || '#000000'}
                        onChange={(e) => handleTextChange('primary_color', e.target.value)}
                      />
                    </div>
                    <Button onClick={() => handleSaveSetting('primary_color')} disabled={saving}>
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="booking" className="space-y-6">
            {/* Booking settings content */}
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            {/* Payment settings content */}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            {/* Notification settings content */}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SiteSettingsPage;
