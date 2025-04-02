
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getSiteSettings, updateSiteSetting, uploadImage, getContentBlock, updateContentBlock, getPageContent } from '@/services/contentService';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileUpload } from '@/components/ui/file-upload';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ContentBlock } from '@/services/contentService';
import { Pencil, Plus, Trash, Check, AlertCircle, Image } from 'lucide-react';

const ContentEditorPage = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
  const [contentBlocks, setContentBlocks] = useState<Record<string, ContentBlock[]>>({});
  const [activeTab, setActiveTab] = useState('general');
  const [selectedImage, setSelectedImage] = useState<Record<string, File | null>>({});
  const { toast } = useToast();

  // Available pages for content editing
  const pages = [
    { id: 'home', name: 'Home Page' },
    { id: 'about', name: 'About Page' },
    { id: 'contact', name: 'Contact Page' },
    { id: 'services', name: 'Services Page' },
    { id: 'how-it-works', name: 'How It Works' },
    { id: 'terms', name: 'Terms & Conditions' },
    { id: 'privacy', name: 'Privacy Policy' },
    { id: 'faq', name: 'FAQ Page' }
  ];

  useEffect(() => {
    loadSettings();
    loadContent('home');
  }, []);

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

  const loadContent = async (pageName: string) => {
    try {
      const data = await getPageContent(pageName);
      setContentBlocks(prev => ({
        ...prev,
        [pageName]: data
      }));
    } catch (error) {
      console.error(`Error loading content for ${pageName}:`, error);
      toast({
        title: 'Error',
        description: `Failed to load content for ${pageName}`,
        variant: 'destructive',
      });
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleBlockChange = (pageName: string, blockIndex: number, field: string, value: any) => {
    const updatedBlocks = [...(contentBlocks[pageName] || [])];
    updatedBlocks[blockIndex] = {
      ...updatedBlocks[blockIndex],
      [field]: value
    };
    
    setContentBlocks(prev => ({
      ...prev,
      [pageName]: updatedBlocks
    }));
  };

  const handleSaveSetting = async (key: string) => {
    setIsSaving(prev => ({ ...prev, [key]: true }));
    try {
      await updateSiteSetting(key, settings[key]);
      
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
      setIsSaving(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleUploadLogo = async () => {
    if (!selectedLogo) return;
    
    setIsSaving(prev => ({ ...prev, logo_url: true }));
    try {
      const path = `settings/logo-${Date.now()}-${selectedLogo.name}`;
      const uploadedUrl = await uploadImage(selectedLogo, path);
      
      if (uploadedUrl) {
        await updateSiteSetting('logo_url', uploadedUrl);
        setSettings(prev => ({
          ...prev,
          logo_url: uploadedUrl
        }));
        
        toast({
          title: 'Success',
          description: 'Logo updated successfully',
        });
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload logo',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(prev => ({ ...prev, logo_url: false }));
      setSelectedLogo(null);
    }
  };

  const handleUploadContentImage = async (pageName: string, blockIndex: number) => {
    const key = `${pageName}-${blockIndex}`;
    const file = selectedImage[key];
    if (!file) return;
    
    setIsSaving(prev => ({ ...prev, [key]: true }));
    try {
      const path = `content/${pageName}/${Date.now()}-${file.name}`;
      const uploadedUrl = await uploadImage(file, path);
      
      if (uploadedUrl) {
        const block = contentBlocks[pageName][blockIndex];
        
        const { error } = await updateContentBlock(block.id, {
          ...block,
          image_url: uploadedUrl
        });
        
        if (error) throw error;
        
        handleBlockChange(pageName, blockIndex, 'image_url', uploadedUrl);
        
        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
        });
      }
    } catch (error) {
      console.error('Error uploading content image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(prev => ({ ...prev, [key]: false }));
      setSelectedImage(prev => ({ ...prev, [key]: null }));
    }
  };

  const handleSaveContentBlock = async (pageName: string, blockIndex: number) => {
    const block = contentBlocks[pageName][blockIndex];
    const key = `save-${pageName}-${blockIndex}`;
    
    setIsSaving(prev => ({ ...prev, [key]: true }));
    try {
      await updateContentBlock(block.id, block);
      
      toast({
        title: 'Success',
        description: 'Content block updated successfully',
      });
    } catch (error) {
      console.error('Error saving content block:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content block',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value !== 'general' && value !== 'branding' && value !== 'footer') {
      // Load content for selected page if not already loaded
      if (!contentBlocks[value]) {
        loadContent(value);
      }
    }
  };

  const renderContentEditor = (pageName: string) => {
    const blocks = contentBlocks[pageName] || [];
    
    if (blocks.length === 0) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No content blocks found</AlertTitle>
          <AlertDescription>
            There are no content blocks defined for this page yet. You can add blocks using the content management system.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <div className="space-y-6">
        {blocks.map((block, index) => (
          <Card key={block.id}>
            <CardHeader>
              <CardTitle>{block.block_name || `Block ${index + 1}`}</CardTitle>
              <CardDescription>Edit the content for this section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${index}`}>Title</Label>
                <Input
                  id={`title-${index}`}
                  value={block.title || ''}
                  onChange={(e) => handleBlockChange(pageName, index, 'title', e.target.value)}
                />
              </div>
              
              {block.subtitle !== null && (
                <div className="space-y-2">
                  <Label htmlFor={`subtitle-${index}`}>Subtitle</Label>
                  <Input
                    id={`subtitle-${index}`}
                    value={block.subtitle || ''}
                    onChange={(e) => handleBlockChange(pageName, index, 'subtitle', e.target.value)}
                  />
                </div>
              )}
              
              {block.content !== null && (
                <div className="space-y-2">
                  <Label htmlFor={`content-${index}`}>Content</Label>
                  <Textarea
                    id={`content-${index}`}
                    value={block.content || ''}
                    onChange={(e) => handleBlockChange(pageName, index, 'content', e.target.value)}
                    rows={5}
                  />
                </div>
              )}
              
              {block.image_url !== null && (
                <div className="space-y-2">
                  <Label>Image</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {block.image_url && (
                      <div className="border rounded-md p-2">
                        <img
                          src={block.image_url}
                          alt="Content"
                          className="max-h-[120px] object-contain"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setSelectedImage(prev => ({
                            ...prev,
                            [`${pageName}-${index}`]: file
                          }));
                        }}
                      />
                      <Button
                        onClick={() => handleUploadContentImage(pageName, index)}
                        disabled={isSaving[`${pageName}-${index}`] || !selectedImage[`${pageName}-${index}`]}
                        className="w-full"
                      >
                        {isSaving[`${pageName}-${index}`] ? 'Uploading...' : 'Upload Image'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={() => handleSaveContentBlock(pageName, index)}
                disabled={isSaving[`save-${pageName}-${index}`]}
              >
                {isSaving[`save-${pageName}-${index}`] ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
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
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Edit your website content, appearance and settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <ScrollArea className="max-w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="general">General Settings</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="footer">Footer</TabsTrigger>
              <Separator orientation="vertical" className="h-6 mx-2" />
              {pages.map((page) => (
                <TabsTrigger key={page.id} value={page.id}>{page.name}</TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

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
                      onClick={() => handleSaveSetting('app_name')}
                      disabled={isSaving['app_name']}
                    >
                      {isSaving['app_name'] ? 'Saving...' : 'Save'}
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
                      onClick={() => handleSaveSetting('copyright')}
                      disabled={isSaving['copyright']}
                    >
                      {isSaving['copyright'] ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="contact_email"
                      value={settings.contact_email || ''}
                      onChange={(e) => handleSettingChange('contact_email', e.target.value)}
                    />
                    <Button
                      onClick={() => handleSaveSetting('contact_email')}
                      disabled={isSaving['contact_email']}
                    >
                      {isSaving['contact_email'] ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="contact_phone"
                      value={settings.contact_phone || ''}
                      onChange={(e) => handleSettingChange('contact_phone', e.target.value)}
                    />
                    <Button
                      onClick={() => handleSaveSetting('contact_phone')}
                      disabled={isSaving['contact_phone']}
                    >
                      {isSaving['contact_phone'] ? 'Saving...' : 'Save'}
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
                        type="color"
                        className="w-16"
                      />
                      <Input
                        value={settings.primary_color || '#000000'}
                        onChange={(e) => handleSettingChange('primary_color', e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={() => handleSaveSetting('primary_color')}
                      disabled={isSaving['primary_color']}
                    >
                      {isSaving['primary_color'] ? 'Saving...' : 'Save'}
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
                        type="color"
                        className="w-16"
                      />
                      <Input
                        value={settings.secondary_color || '#000000'}
                        onChange={(e) => handleSettingChange('secondary_color', e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={() => handleSaveSetting('secondary_color')}
                      disabled={isSaving['secondary_color']}
                    >
                      {isSaving['secondary_color'] ? 'Saving...' : 'Save'}
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
                        onChange={(e) => setSelectedLogo(e.target.files?.[0] || null)}
                      />
                      <Button
                        onClick={handleUploadLogo}
                        disabled={isSaving['logo_url'] || !selectedLogo}
                        className="w-full"
                      >
                        {isSaving['logo_url'] ? 'Uploading...' : 'Upload Logo'}
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
                            <Trash className="h-4 w-4" />
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
                          <Plus className="h-4 w-4 mr-2" /> Add Link
                        </Button>
                        <Button
                          onClick={() => handleSaveSetting('footer_links')}
                          disabled={isSaving['footer_links']}
                        >
                          {isSaving['footer_links'] ? 'Saving...' : 'Save Footer Links'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dynamic page content tabs */}
          {pages.map(page => (
            <TabsContent key={page.id} value={page.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{page.name} Content</CardTitle>
                  <CardDescription>
                    Edit the content sections for this page
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderContentEditor(page.id)}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ContentEditorPage;
