
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getSiteSettings, updateSiteSetting, uploadImage } from '@/services/contentService';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ui/image-upload';

const SiteSettingsPage = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load site settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = async (settingKey: string) => {
    setIsSaving(true);
    try {
      // Handle logo upload if there's a file
      if (settingKey === 'logo_url' && logoFile) {
        const path = `settings/logo-${Date.now()}-${logoFile.name}`;
        const uploadedUrl = await uploadImage(logoFile, path);
        
        if (uploadedUrl) {
          await updateSiteSetting('logo_url', uploadedUrl);
          setSettings((prev) => ({
            ...prev,
            logo_url: uploadedUrl,
          }));
        }
      } else {
        // Handle other settings
        await updateSiteSetting(settingKey, settings[settingKey]);
      }

      toast({
        title: 'Success',
        description: 'Setting updated successfully',
      });
    } catch (error) {
      console.error('Error saving setting:', error);
      toast({
        title: 'Error',
        description: 'Failed to update setting',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">
            Customize your website's appearance and content
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Update your site name and other general settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="app_name">Site Name</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="app_name"
                      value={settings.app_name || ''}
                      onChange={(e) => handleSettingChange('app_name', e.target.value)}
                    />
                    <Button
                      onClick={() => handleSaveSettings('app_name')}
                      disabled={isSaving}
                    >
                      Save
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="copyright">Copyright Text</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="copyright"
                      value={settings.copyright || ''}
                      onChange={(e) => handleSettingChange('copyright', e.target.value)}
                    />
                    <Button
                      onClick={() => handleSaveSettings('copyright')}
                      disabled={isSaving}
                    >
                      Save
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font_family">Font Family</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="font_family"
                      value={settings.font_family || ''}
                      onChange={(e) => handleSettingChange('font_family', e.target.value)}
                    />
                    <Button
                      onClick={() => handleSaveSettings('font_family')}
                      disabled={isSaving}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Branding Settings</CardTitle>
                <CardDescription>
                  Customize your brand colors and logo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex space-x-2">
                    <div className="flex-1 flex space-x-2">
                      <Input
                        id="primary_color"
                        value={settings.primary_color || '#000000'}
                        onChange={(e) => handleSettingChange('primary_color', e.target.value)}
                      />
                      <div
                        className="w-10 h-10 rounded-md border"
                        style={{ backgroundColor: settings.primary_color || '#000000' }}
                      ></div>
                    </div>
                    <Button
                      onClick={() => handleSaveSettings('primary_color')}
                      disabled={isSaving}
                    >
                      Save
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="flex space-x-2">
                    <div className="flex-1 flex space-x-2">
                      <Input
                        id="secondary_color"
                        value={settings.secondary_color || '#000000'}
                        onChange={(e) => handleSettingChange('secondary_color', e.target.value)}
                      />
                      <div
                        className="w-10 h-10 rounded-md border"
                        style={{ backgroundColor: settings.secondary_color || '#000000' }}
                      ></div>
                    </div>
                    <Button
                      onClick={() => handleSaveSettings('secondary_color')}
                      disabled={isSaving}
                    >
                      Save
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      {settings.logo_url && (
                        <img
                          src={settings.logo_url}
                          alt="Logo"
                          className="max-h-[100px] object-contain"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                      />
                      <Button
                        onClick={() => handleSaveSettings('logo_url')}
                        disabled={isSaving || !logoFile}
                        className="w-full"
                      >
                        {isSaving ? 'Uploading...' : 'Upload Logo'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Footer Settings</CardTitle>
                <CardDescription>
                  Manage the links and content in your site footer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Footer Links</Label>
                    <div className="border rounded-md p-4 mt-2">
                      {Array.isArray(settings.footer_links) && settings.footer_links.map((link: any, index: number) => (
                        <div key={index} className="flex space-x-2 items-center mb-2">
                          <Input
                            value={link.label}
                            onChange={(e) => {
                              const newLinks = [...settings.footer_links];
                              newLinks[index].label = e.target.value;
                              handleSettingChange('footer_links', newLinks);
                            }}
                            placeholder="Link Label"
                            className="flex-1"
                          />
                          <Input
                            value={link.url}
                            onChange={(e) => {
                              const newLinks = [...settings.footer_links];
                              newLinks[index].url = e.target.value;
                              handleSettingChange('footer_links', newLinks);
                            }}
                            placeholder="URL"
                            className="flex-1"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newLinks = [...settings.footer_links];
                              newLinks.splice(index, 1);
                              handleSettingChange('footer_links', newLinks);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <div className="flex justify-between mt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const newLinks = [...(settings.footer_links || [])];
                            newLinks.push({ label: '', url: '' });
                            handleSettingChange('footer_links', newLinks);
                          }}
                        >
                          Add Link
                        </Button>
                        <Button
                          onClick={() => handleSaveSettings('footer_links')}
                          disabled={isSaving}
                        >
                          Save Footer Links
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SiteSettingsPage;
