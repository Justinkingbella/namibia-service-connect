import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ContentBlock, getPageContent } from '@/services/contentService';
import { Plus, PlusCircle, Trash2, Edit, FilePlus, FileText, Save, Image, ExternalLink } from 'lucide-react';

interface PageTab {
  id: string;
  label: string;
}

const ContentEditorPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [editingBlock, setEditingBlock] = useState<ContentBlock>({
    id: '',
    page_name: '',
    block_name: '',
    title: '',
    subtitle: '',
    content: '',
    order_index: 0,
    image_url: '',
    buttons: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  const pageTabs: PageTab[] = [
    { id: 'home', label: 'Home Page' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'faq', label: 'FAQ' },
    { id: 'how-it-works', label: 'How It Works' },
  ];

  useEffect(() => {
    loadContentBlocks(activeTab);
  }, [activeTab]);

  const loadContentBlocks = async (pageName: string) => {
    setIsLoading(true);
    try {
      const blocks = await getPageContent(pageName);
      setContentBlocks(blocks);
    } catch (error) {
      console.error('Error loading content blocks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load page content',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewBlock = () => {
    const newBlock: ContentBlock = {
      id: `new-${Date.now()}`,
      page_name: activeTab,
      block_name: `block-${Date.now()}`,
      title: '',
      subtitle: '',
      content: '',
      order_index: contentBlocks.length + 1,
      image_url: '',
      buttons: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setEditingBlock(newBlock);
    setIsEditing(true);
    setSelectedBlockId(newBlock.id);
  };

  const handleEditBlock = (block: ContentBlock) => {
    setEditingBlock(block);
    setIsEditing(true);
    setSelectedBlockId(block.id);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedBlockId(null);
  };

  const handleSaveBlock = async () => {
    try {
      const isNewBlock = editingBlock.id.startsWith('new-');
      
      if (isNewBlock) {
        setContentBlocks([...contentBlocks, editingBlock]);
      } else {
        setContentBlocks(
          contentBlocks.map(block => 
            block.id === editingBlock.id ? editingBlock : block
          )
        );
      }
      
      setIsEditing(false);
      setSelectedBlockId(null);
      
      toast({
        title: 'Success',
        description: `Content block ${isNewBlock ? 'created' : 'updated'} successfully`,
      });
    } catch (error) {
      console.error('Error saving content block:', error);
      toast({
        title: 'Error',
        description: 'Failed to save content block',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBlock = (block: ContentBlock) => {
    setEditingBlock(block);
    setShowDeleteDialog(true);
  };

  const confirmDeleteBlock = async () => {
    try {
      setContentBlocks(contentBlocks.filter(block => block.id !== editingBlock.id));
      
      setShowDeleteDialog(false);
      setSelectedBlockId(null);
      
      toast({
        title: 'Success',
        description: 'Content block deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting content block:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete content block',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Content Editor</h1>
          <p className="text-muted-foreground mt-1">
            Manage website content for different pages
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="overflow-x-auto w-auto no-scrollbar">
              {pageTabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="px-4">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <Button onClick={handleAddNewBlock} size="sm" className="ml-4">
              <Plus className="mr-2 h-4 w-4" /> Add Content Block
            </Button>
          </div>

          {pageTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {contentBlocks.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center h-64 p-6">
                        <FileText className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium">No content blocks found</h3>
                        <p className="text-sm text-gray-500 text-center mt-2 mb-4">
                          This page doesn't have any content blocks yet. Create your first one to get started.
                        </p>
                        <Button onClick={handleAddNewBlock}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create First Block
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {!isEditing ? (
                        <div className="space-y-4">
                          {contentBlocks.map((block) => (
                            <Card
                              key={block.id}
                              className={`overflow-hidden transition-all ${
                                selectedBlockId === block.id
                                  ? 'ring-2 ring-primary'
                                  : ''
                              }`}
                            >
                              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div>
                                  <CardTitle>{block.title || 'Untitled Block'}</CardTitle>
                                  {block.subtitle && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {block.subtitle}
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditBlock(block)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteBlock(block)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent>
                                {block.image_url && (
                                  <div className="mb-4 rounded-md overflow-hidden h-40 bg-gray-100">
                                    <img
                                      src={block.image_url}
                                      alt={block.title || 'Content image'}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="prose prose-sm max-w-none">
                                  <div className="whitespace-pre-line line-clamp-4">
                                    {block.content || <span className="text-gray-400 italic">No content</span>}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>
                              {editingBlock.id.startsWith('new-')
                                ? 'Add New Content Block'
                                : 'Edit Content Block'}
                            </CardTitle>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                                Cancel
                              </Button>
                              <Button size="sm" onClick={handleSaveBlock}>
                                <Save className="h-4 w-4 mr-2" /> Save
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <label htmlFor="title" className="text-sm font-medium">
                                Title
                              </label>
                              <Input
                                id="title"
                                value={editingBlock.title}
                                onChange={(e) =>
                                  setEditingBlock({
                                    ...editingBlock,
                                    title: e.target.value,
                                  })
                                }
                                placeholder="Enter title"
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="subtitle" className="text-sm font-medium">
                                Subtitle (optional)
                              </label>
                              <Input
                                id="subtitle"
                                value={editingBlock.subtitle}
                                onChange={(e) =>
                                  setEditingBlock({
                                    ...editingBlock,
                                    subtitle: e.target.value,
                                  })
                                }
                                placeholder="Enter subtitle"
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="imageUrl" className="text-sm font-medium">
                                Image URL (optional)
                              </label>
                              <div className="flex space-x-2">
                                <Input
                                  id="imageUrl"
                                  value={editingBlock.image_url}
                                  onChange={(e) =>
                                    setEditingBlock({
                                      ...editingBlock,
                                      image_url: e.target.value,
                                    })
                                  }
                                  placeholder="Enter image URL"
                                />
                                <Button variant="outline" size="sm" type="button">
                                  <Image className="h-4 w-4 mr-2" /> Browse
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="content" className="text-sm font-medium">
                                Content
                              </label>
                              <Textarea
                                id="content"
                                value={editingBlock.content}
                                onChange={(e) =>
                                  setEditingBlock({
                                    ...editingBlock,
                                    content: e.target.value,
                                  })
                                }
                                placeholder="Enter content"
                                rows={8}
                              />
                              <p className="text-xs text-muted-foreground">
                                You can use plain text formatting. Add blank lines for paragraphs.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this content block. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBlock} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ContentEditorPage;
