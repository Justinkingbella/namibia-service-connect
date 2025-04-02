
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Save, Upload, Trash2, Edit, Settings, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ImageUpload } from '@/components/ui/image-upload';

interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  order_index: number;
}

const AppEditorPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [appSettings, setAppSettings] = useState<Record<string, any>>({});
  const [footerLinks, setFooterLinks] = useState<any[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Fetch site settings from the database
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // Fetch app settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('*');

        if (settingsError) throw settingsError;

        if (settingsData) {
          const settings: Record<string, any> = {};
          settingsData.forEach((setting) => {
            settings[setting.key] = setting.value;
          });
          setAppSettings(settings);
          
          // Set footer links if available
          if (settings.footer_links) {
            setFooterLinks(settings.footer_links);
          }
        }

        // Fetch service categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('service_categories')
          .select('*')
          .order('order_index');

        if (categoriesError) throw categoriesError;

        if (categoriesData) {
          setServiceCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching app settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load app settings',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleSaveSetting = async (key: string, value: any) => {
    setIsSaving(true);
    try {
      // Check if the setting already exists
      const { data: existingData, error: existingError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .maybeSingle();

      if (existingError) throw existingError;

      if (existingData) {
        // Update existing setting
        const { error } = await supabase
          .from('site_settings')
          .update({ value })
          .eq('key', key);

        if (error) throw error;
      } else {
        // Insert new setting
        const { error } = await supabase
          .from('site_settings')
          .insert({ key, value });

        if (error) throw error;
      }

      // Update local state
      setAppSettings({
        ...appSettings,
        [key]: value
      });

      toast({
        title: 'Setting saved',
        description: `The ${key} setting has been updated successfully.`
      });
    } catch (error) {
      console.error('Error saving setting:', error);
      toast({
        title: 'Save failed',
        description: 'Failed to save setting. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    setIsSaving(true);
    try {
      // Upload logo to storage
      const fileName = `logos/logo-${Date.now()}-${logoFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('site_images')
        .upload(fileName, logoFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      if (uploadData) {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('site_images')
          .getPublicUrl(uploadData.path);

        if (urlData) {
          await handleSaveSetting('logo_url', urlData.publicUrl);
        }
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload logo. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFooterLinks = async () => {
    await handleSaveSetting('footer_links', footerLinks);
  };

  const handleAddFooterLink = () => {
    setFooterLinks([...footerLinks, { label: '', url: '' }]);
  };

  const handleRemoveFooterLink = (index: number) => {
    const newLinks = [...footerLinks];
    newLinks.splice(index, 1);
    setFooterLinks(newLinks);
  };

  const handleFooterLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...footerLinks];
    newLinks[index][field] = value;
    setFooterLinks(newLinks);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .insert({
          name: newCategoryName.trim(),
          description: newCategoryDescription.trim() || null,
          order_index: serviceCategories.length
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setServiceCategories([...serviceCategories, data]);
        setNewCategoryName('');
        setNewCategoryDescription('');
        toast({
          title: 'Category added',
          description: 'The service category has been added successfully.'
        });
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: 'Save failed',
        description: 'Failed to add category. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('service_categories')
        .update({
          name: editingCategory.name.trim(),
          description: editingCategory.description?.trim() || null,
          is_active: editingCategory.is_active
        })
        .eq('id', editingCategory.id);

      if (error) throw error;

      // Update local state
      setServiceCategories(serviceCategories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      ));

      setEditingCategory(null);
      toast({
        title: 'Category updated',
        description: 'The service category has been updated successfully.'
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update category. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('service_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setServiceCategories(serviceCategories.filter(cat => cat.id !== id));
      toast({
        title: 'Category deleted',
        description: 'The service category has been deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Delete failed',
        description: 'Failed to delete category. Please try again.',
        variant: 'destructive'
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
          <h1 className="text-2xl font-bold">App Editor</h1>
          <p className="text-muted-foreground mt-1">
            Customize all aspects of your application
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
            <TabsTrigger value="categories">Service Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Application Settings</CardTitle>
                <CardDescription>
                  Update application name, contact information, and other global settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="app_name">Application Name</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="app_name"
                      value={appSettings.app_name || ''}
                      onChange={(e) => setAppSettings({...appSettings, app_name: e.target.value})}
                      placeholder="Namibia Service Hub"
                    />
                    <Button
                      onClick={() => handleSaveSetting('app_name', appSettings.app_name)}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="contact_email"
                      value={appSettings.contact_email || ''}
                      onChange={(e) => setAppSettings({...appSettings, contact_email: e.target.value})}
                      placeholder="contact@example.com"
                    />
                    <Button
                      onClick={() => handleSaveSetting('contact_email', appSettings.contact_email)}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="contact_phone"
                      value={appSettings.contact_phone || ''}
                      onChange={(e) => setAppSettings({...appSettings, contact_phone: e.target.value})}
                      placeholder="+264 61 123 4567"
                    />
                    <Button
                      onClick={() => handleSaveSetting('contact_phone', appSettings.contact_phone)}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <div className="space-y-2">
                    <Textarea
                      id="address"
                      value={appSettings.address || ''}
                      onChange={(e) => setAppSettings({...appSettings, address: e.target.value})}
                      placeholder="123 Main Street, Windhoek, Namibia"
                      rows={3}
                    />
                    <Button
                      onClick={() => handleSaveSetting('address', appSettings.address)}
                      disabled={isSaving}
                      className="mt-2"
                    >
                      {isSaving ? 'Saving...' : 'Save Address'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="copyright">Copyright Text</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="copyright"
                      value={appSettings.copyright || ''}
                      onChange={(e) => setAppSettings({...appSettings, copyright: e.target.value})}
                      placeholder="© 2023 Namibia Service Hub. All rights reserved."
                    />
                    <Button
                      onClick={() => handleSaveSetting('copyright', appSettings.copyright)}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Branding & Design</CardTitle>
                <CardDescription>
                  Customize your brand colors, logo, and other visual elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      {appSettings.logo_url && (
                        <div className="border p-4 rounded-md">
                          <img
                            src={appSettings.logo_url}
                            alt="Logo"
                            className="max-h-[100px] object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                        accept="image/*"
                      />
                      <Button
                        onClick={handleLogoUpload}
                        disabled={isSaving || !logoFile}
                        className="w-full"
                      >
                        {isSaving ? 'Uploading...' : 'Upload Logo'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 flex space-x-2">
                      <Input
                        id="primary_color"
                        type="text"
                        value={appSettings.primary_color || '#000000'}
                        onChange={(e) => setAppSettings({...appSettings, primary_color: e.target.value})}
                        placeholder="#000000"
                      />
                      <Input
                        type="color"
                        value={appSettings.primary_color || '#000000'}
                        onChange={(e) => setAppSettings({...appSettings, primary_color: e.target.value})}
                        className="w-12 p-1 h-10"
                      />
                    </div>
                    <Button
                      onClick={() => handleSaveSetting('primary_color', appSettings.primary_color)}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 flex space-x-2">
                      <Input
                        id="secondary_color"
                        type="text"
                        value={appSettings.secondary_color || '#000000'}
                        onChange={(e) => setAppSettings({...appSettings, secondary_color: e.target.value})}
                        placeholder="#000000"
                      />
                      <Input
                        type="color"
                        value={appSettings.secondary_color || '#000000'}
                        onChange={(e) => setAppSettings({...appSettings, secondary_color: e.target.value})}
                        className="w-12 p-1 h-10"
                      />
                    </div>
                    <Button
                      onClick={() => handleSaveSetting('secondary_color', appSettings.secondary_color)}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Footer Configuration</CardTitle>
                <CardDescription>
                  Manage your website footer content and links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg">Footer Links</Label>
                    <Button variant="outline" size="sm" onClick={handleAddFooterLink}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                  
                  <div className="border rounded-md p-4 space-y-2">
                    {footerLinks.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No footer links added yet. Add your first link using the button above.
                      </div>
                    ) : (
                      footerLinks.map((link, index) => (
                        <div key={index} className="flex space-x-2 items-center">
                          <Input
                            value={link.label}
                            onChange={(e) => handleFooterLinkChange(index, 'label', e.target.value)}
                            placeholder="Link Label"
                            className="flex-1"
                          />
                          <Input
                            value={link.url}
                            onChange={(e) => handleFooterLinkChange(index, 'url', e.target.value)}
                            placeholder="URL"
                            className="flex-1"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveFooterLink(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                    
                    {footerLinks.length > 0 && (
                      <Button 
                        onClick={handleSaveFooterLinks} 
                        disabled={isSaving}
                        className="mt-4"
                      >
                        {isSaving ? 'Saving...' : 'Save Footer Links'}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_links">Social Media Links</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook_url">Facebook</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="facebook_url"
                          value={appSettings.facebook_url || ''}
                          onChange={(e) => setAppSettings({...appSettings, facebook_url: e.target.value})}
                          placeholder="https://facebook.com/yourpage"
                        />
                        <Button
                          onClick={() => handleSaveSetting('facebook_url', appSettings.facebook_url)}
                          disabled={isSaving}
                          size="sm"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="twitter_url">Twitter/X</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="twitter_url"
                          value={appSettings.twitter_url || ''}
                          onChange={(e) => setAppSettings({...appSettings, twitter_url: e.target.value})}
                          placeholder="https://twitter.com/yourhandle"
                        />
                        <Button
                          onClick={() => handleSaveSetting('twitter_url', appSettings.twitter_url)}
                          disabled={isSaving}
                          size="sm"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instagram_url">Instagram</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="instagram_url"
                          value={appSettings.instagram_url || ''}
                          onChange={(e) => setAppSettings({...appSettings, instagram_url: e.target.value})}
                          placeholder="https://instagram.com/yourhandle"
                        />
                        <Button
                          onClick={() => handleSaveSetting('instagram_url', appSettings.instagram_url)}
                          disabled={isSaving}
                          size="sm"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url">LinkedIn</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="linkedin_url"
                          value={appSettings.linkedin_url || ''}
                          onChange={(e) => setAppSettings({...appSettings, linkedin_url: e.target.value})}
                          placeholder="https://linkedin.com/company/yourcompany"
                        />
                        <Button
                          onClick={() => handleSaveSetting('linkedin_url', appSettings.linkedin_url)}
                          disabled={isSaving}
                          size="sm"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Categories</CardTitle>
                <CardDescription>
                  Manage the service categories available in your platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <div className="flex-1">
                      <Label htmlFor="new_category_name">New Category Name</Label>
                      <Input
                        id="new_category_name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter category name"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="new_category_description">Description (Optional)</Label>
                      <Input
                        id="new_category_description"
                        value={newCategoryDescription}
                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                        placeholder="Brief description"
                      />
                    </div>
                    <div className="md:pt-8">
                      <Button
                        onClick={handleAddCategory}
                        disabled={isSaving || !newCategoryName.trim()}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Existing Categories</h3>
                  {serviceCategories.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                      <p className="text-muted-foreground">No categories have been added yet.</p>
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {serviceCategories.map((category) => (
                            <TableRow key={category.id}>
                              <TableCell className="font-medium">
                                {editingCategory?.id === category.id ? (
                                  <Input
                                    value={editingCategory.name}
                                    onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                                  />
                                ) : (
                                  category.name
                                )}
                              </TableCell>
                              <TableCell>
                                {editingCategory?.id === category.id ? (
                                  <Input
                                    value={editingCategory.description || ''}
                                    onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                                  />
                                ) : (
                                  category.description || 'No description'
                                )}
                              </TableCell>
                              <TableCell>
                                {category.is_active ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Inactive
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {editingCategory?.id === category.id ? (
                                  <div className="flex justify-end space-x-2">
                                    <Button size="sm" onClick={handleUpdateCategory}>
                                      <Save className="h-4 w-4 mr-1" />
                                      Save
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => setEditingCategory(null)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex justify-end space-x-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => setEditingCategory(category)}
                                    >
                                      <Edit className="h-4 w-4 mr-1" />
                                      Edit
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive" 
                                      onClick={() => handleDeleteCategory(category.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AppEditorPage;
