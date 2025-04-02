import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileUpload } from '@/components/ui/file-upload';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPageContent, getContentBlock, updateContentBlock, ContentBlock, uploadContentImage } from '@/services/contentService';

// Create a schema for the content form
const contentFormSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

const ContentEditorPage = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [activePage, setActivePage] = useState('home');
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      content: '',
    },
  });

  // Query to fetch content for the active page
  const { data: pageContent, isLoading } = useQuery({
    queryKey: ['page-content', activePage],
    queryFn: () => getPageContent(activePage),
  });

  // Mutation to update content
  const updateMutation = useMutation({
    mutationFn: (values: ContentBlock) => updateContentBlock(values),
    onSuccess: (data) => {
      toast({
        title: 'Content updated',
        description: 'The content has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['page-content', activePage] });

      // Update the local state as well
      setContentBlocks(prevBlocks => 
        prevBlocks.map(block => block.id === data.id ? data : block)
      );
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating content',
        description: error.message || 'There was an error updating the content. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Set content blocks when page data changes
  useEffect(() => {
    if (pageContent) {
      setContentBlocks(pageContent);
    }
  }, [pageContent]);

  // Load the selected block into the form
  const loadBlockContent = async (blockId: string) => {
    setActiveBlockId(blockId);
    
    try {
      const blockContent = await getContentBlock(activePage, blockId);
      form.reset({
        title: blockContent.title || '',
        subtitle: blockContent.subtitle || '',
        content: blockContent.content || '',
      });
    } catch (err) {
      console.error('Error loading content block:', err);
      toast({
        title: 'Error loading content',
        description: 'Could not load the selected content block.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = (values: ContentFormValues) => {
    if (!activeBlockId) return;
    
    // Find the current block to preserve other values
    const currentBlock = contentBlocks.find(block => block.id === activeBlockId);
    
    if (!currentBlock) {
      toast({
        title: 'Error updating content',
        description: 'The selected block could not be found.',
        variant: 'destructive',
      });
      return;
    }
    
    // Merge the form values with the current block
    const updatedBlock: ContentBlock = {
      ...currentBlock,
      title: values.title,
      subtitle: values.subtitle,
      content: values.content,
    };
    
    updateMutation.mutate(updatedBlock);
  };

  const handleImageUpload = async (file: File) => {
    if (!activeBlockId) {
      toast({
        title: 'Error uploading image',
        description: 'Please select a content block first.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Find the current block
      const currentBlock = contentBlocks.find(block => block.id === activeBlockId);
      
      if (!currentBlock) {
        throw new Error('Content block not found');
      }
      
      // Upload the image and get the URL
      const imageUrl = await uploadContentImage(file, activePage, activeBlockId);
      
      // Update the block with the new image URL
      const updatedBlock: ContentBlock = {
        ...currentBlock,
        image_url: imageUrl,
      };
      
      updateMutation.mutate(updatedBlock);
      
      toast({
        title: 'Image uploaded',
        description: 'The image has been successfully uploaded and assigned to the content block.',
      });
    } catch (err: any) {
      console.error('Error uploading image:', err);
      toast({
        title: 'Error uploading image',
        description: err.message || 'There was an error uploading the image. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Content Editor</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            {/* Home page content */}
            <TabsContent value="home" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Blocks</CardTitle>
                      <CardDescription>
                        Select a content block to edit
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="space-y-2">
                          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                        </div>
                      ) : contentBlocks.length > 0 ? (
                        <div className="space-y-2">
                          {contentBlocks.map((block) => (
                            <Button 
                              key={block.id}
                              variant={activeBlockId === block.id ? "default" : "outline"}
                              className="w-full justify-start"
                              onClick={() => loadBlockContent(block.id)}
                            >
                              {block.block_name || `Block ${block.id}`}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No content blocks found</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Content</CardTitle>
                      <CardDescription>
                        Update the selected content block
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {activeBlockId ? (
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter title" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="subtitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subtitle</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter subtitle" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="content"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Content</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Enter content" 
                                      className="min-h-32" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Image</label>
                              <FileUpload 
                                onUpload={handleImageUpload}
                                acceptTypes="image/*"
                                label="Upload block image"
                                buttonText="Select Image"
                              />
                              
                              {contentBlocks.find(block => block.id === activeBlockId)?.image_url && (
                                <div className="mt-4">
                                  <p className="text-sm font-medium mb-2">Current Image</p>
                                  <img 
                                    src={contentBlocks.find(block => block.id === activeBlockId)?.image_url} 
                                    alt="Current content" 
                                    className="max-w-full h-auto max-h-48 rounded-md border" 
                                  />
                                </div>
                              )}
                            </div>
                            
                            <Button 
                              type="submit"
                              disabled={updateMutation.isPending}
                            >
                              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                          </form>
                        </Form>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <p className="text-muted-foreground mb-4">Select a content block to edit</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* About page content - Similar structure */}
            <TabsContent value="about" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Blocks</CardTitle>
                      <CardDescription>
                        Select a content block to edit
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="space-y-2">
                          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                        </div>
                      ) : contentBlocks.length > 0 ? (
                        <div className="space-y-2">
                          {contentBlocks.map((block) => (
                            <Button 
                              key={block.id}
                              variant={activeBlockId === block.id ? "default" : "outline"}
                              className="w-full justify-start"
                              onClick={() => loadBlockContent(block.id)}
                            >
                              {block.block_name || `Block ${block.id}`}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No content blocks found</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Content</CardTitle>
                      <CardDescription>
                        Update the selected content block
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {activeBlockId ? (
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter title" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="subtitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subtitle</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter subtitle" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="content"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Content</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Enter content" 
                                      className="min-h-32" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Image</label>
                              <FileUpload 
                                onUpload={handleImageUpload}
                                acceptTypes="image/*"
                                label="Upload block image"
                                buttonText="Select Image"
                              />
                              
                              {contentBlocks.find(block => block.id === activeBlockId)?.image_url && (
                                <div className="mt-4">
                                  <p className="text-sm font-medium mb-2">Current Image</p>
                                  <img 
                                    src={contentBlocks.find(block => block.id === activeBlockId)?.image_url} 
                                    alt="Current content" 
                                    className="max-w-full h-auto max-h-48 rounded-md border" 
                                  />
                                </div>
                              )}
                            </div>
                            
                            <Button 
                              type="submit"
                              disabled={updateMutation.isPending}
                            >
                              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                          </form>
                        </Form>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <p className="text-muted-foreground mb-4">Select a content block to edit</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Services page content - Similar structure */}
            <TabsContent value="services" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Blocks</CardTitle>
                      <CardDescription>
                        Select a content block to edit
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="space-y-2">
                          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                        </div>
                      ) : contentBlocks.length > 0 ? (
                        <div className="space-y-2">
                          {contentBlocks.map((block) => (
                            <Button 
                              key={block.id}
                              variant={activeBlockId === block.id ? "default" : "outline"}
                              className="w-full justify-start"
                              onClick={() => loadBlockContent(block.id)}
                            >
                              {block.block_name || `Block ${block.id}`}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No content blocks found</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Content</CardTitle>
                      <CardDescription>
                        Update the selected content block
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {activeBlockId ? (
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter title" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="subtitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subtitle</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter subtitle" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="content"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Content</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Enter content" 
                                      className="min-h-32" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Image</label>
                              <FileUpload 
                                onUpload={handleImageUpload}
                                acceptTypes="image/*"
                                label="Upload block image"
                                buttonText="Select Image"
                              />
                              
                              {contentBlocks.find(block => block.id === activeBlockId)?.image_url && (
                                <div className="mt-4">
                                  <p className="text-sm font-medium mb-2">Current Image</p>
                                  <img 
                                    src={contentBlocks.find(block => block.id === activeBlockId)?.image_url} 
                                    alt="Current content" 
                                    className="max-w-full h-auto max-h-48 rounded-md border" 
                                  />
                                </div>
                              )}
                            </div>
                            
                            <Button 
                              type="submit"
                              disabled={updateMutation.isPending}
                            >
                              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                          </form>
                        </Form>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <p className="text-muted-foreground mb-4">Select a content block to edit</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Legal page content - Similar structure */}
            <TabsContent value="legal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Blocks</CardTitle>
                      <CardDescription>
                        Select a content block to edit
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="space-y-2">
                          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                        </div>
                      ) : contentBlocks.length > 0 ? (
                        <div className="space-y-2">
                          {contentBlocks.map((block) => (
                            <Button 
                              key={block.id}
                              variant={activeBlockId === block.id ? "default" : "outline"}
                              className="w-full justify-start"
                              onClick={() => loadBlockContent(block.id)}
                            >
                              {block.block_name || `Block ${block.id}`}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No content blocks found</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Content</CardTitle>
                      <CardDescription>
                        Update the selected content block
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {activeBlockId ? (
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter title" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="subtitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subtitle</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter subtitle" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="content"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Content</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Enter content" 
                                      className="min-h-32" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Image</label>
                              <FileUpload 
                                onUpload={handleImageUpload}
                                acceptTypes="image/*"
                                label="Upload block image"
                                buttonText="Select Image"
                              />
                              
                              {contentBlocks.find(block => block.id === activeBlockId)?.image_url && (
                                <div className="mt-4">
                                  <p className="text-sm font-medium mb-2">Current Image</p>
                                  <img 
                                    src={contentBlocks.find(block => block.id === activeBlockId)?.image_url} 
                                    alt="Current content" 
                                    className="max-w-full h-auto max-h-48 rounded-md border" 
                                  />
                                </div>
                              )}
                            </div>
                            
                            <Button 
                              type="submit"
                              disabled={updateMutation.isPending}
                            >
                              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                          </form>
                        </Form>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <p className="text-muted-foreground mb-4">Select a content block to edit</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ContentEditorPage;
