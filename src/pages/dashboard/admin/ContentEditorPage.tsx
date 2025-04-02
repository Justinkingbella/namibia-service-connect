
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PlusCircle, Edit, Trash2, Save } from 'lucide-react';
import ContentBlock from '@/components/content/ContentBlock';
import EditContentModal from '@/components/content/EditContentModal';
import { supabase } from '@/integrations/supabase/client';

type ContentBlock = {
  id: string;
  title: string;
  content: string;
  pageName: string;
  position: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

const ContentEditorPage = () => {
  const [activeTab, setActiveTab] = useState('homepage');
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch content blocks from database
  useEffect(() => {
    const fetchContentBlocks = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('content_blocks')
          .select('*')
          .order('order_index');

        if (error) {
          throw error;
        }

        if (data) {
          // Map the data from DB format to our component format
          const formattedBlocks: ContentBlock[] = data.map(block => ({
            id: block.id,
            title: block.title || '',
            content: block.content || '',
            pageName: block.page_name,
            position: block.order_index,
            isPublished: true,
            createdAt: block.created_at,
            updatedAt: block.updated_at
          }));
          setBlocks(formattedBlocks);
        }
      } catch (error) {
        console.error('Error fetching content blocks:', error);
        toast({
          title: 'Error',
          description: 'Failed to load content blocks',
          variant: 'destructive'
        });
        
        // Fallback to default blocks if fetch fails
        setBlocks([
          {
            id: '1',
            title: 'Welcome to Namibia Service Hub',
            content: 'Find trusted service providers in your area...',
            pageName: 'homepage',
            position: 1,
            isPublished: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'About Us',
            content: 'Learn more about our mission and values...',
            pageName: 'about',
            position: 1,
            isPublished: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContentBlocks();
  }, [toast]);

  const handleEditBlock = (block: ContentBlock) => {
    setEditingBlock(block);
    setIsModalOpen(true);
  };

  const handleSaveBlock = async (updatedBlock: ContentBlock) => {
    try {
      // Update the block in the database
      const { error } = await supabase
        .from('content_blocks')
        .update({
          title: updatedBlock.title,
          content: updatedBlock.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedBlock.id);

      if (error) throw error;

      // Update local state
      setBlocks(blocks.map(block => 
        block.id === updatedBlock.id ? updatedBlock : block
      ));
      
      setIsModalOpen(false);
      toast({
        title: "Content updated",
        description: "The content block has been updated successfully."
      });
    } catch (error) {
      console.error('Error saving content block:', error);
      toast({
        title: "Update failed",
        description: "Failed to update content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddBlock = async () => {
    try {
      const position = blocks.filter(block => block.pageName === activeTab).length + 1;
      
      // Create new block in the database
      const { data, error } = await supabase
        .from('content_blocks')
        .insert({
          title: 'New Content Block',
          content: 'Add your content here...',
          page_name: activeTab,
          block_name: `block-${Date.now()}`,
          order_index: position
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        const newBlock: ContentBlock = {
          id: data.id,
          title: data.title || 'New Content Block',
          content: data.content || 'Add your content here...',
          pageName: data.page_name,
          position: data.order_index,
          isPublished: true,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        setBlocks([...blocks, newBlock]);
        handleEditBlock(newBlock);
      }
    } catch (error) {
      console.error('Error creating new content block:', error);
      toast({
        title: "Creation failed",
        description: "Failed to create new content block. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteBlock = async (id: string) => {
    try {
      // Delete the block from the database
      const { error } = await supabase
        .from('content_blocks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setBlocks(blocks.filter(block => block.id !== id));
      toast({
        title: "Content deleted",
        description: "The content block has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting content block:', error);
      toast({
        title: "Deletion failed",
        description: "Failed to delete content block. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const filteredBlocks = blocks.filter(block => block.pageName === activeTab);

  // Custom content rendering function for ContentBlock
  const renderCustomContent = (block: ContentBlock) => {
    return (
      <div>
        {block.title && <h2 className="text-2xl font-bold mb-4">{block.title}</h2>}
        {block.content && <div className="prose">{block.content}</div>}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Content Editor</h1>
          <p className="text-muted-foreground mt-1">Manage website content for various pages</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Edit Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="homepage">Homepage</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>
              
              {['homepage', 'about', 'services', 'contact', 'how-it-works', 'faq'].map((pageName) => (
                <TabsContent value={pageName} key={pageName} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium capitalize">{pageName.replace('-', ' ')} Content</h2>
                    <Button onClick={handleAddBlock} size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Content Block
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : filteredBlocks.length > 0 ? (
                      filteredBlocks.map(block => (
                        <Card key={block.id} className="relative">
                          <CardContent className="pt-6">
                            <ContentBlock 
                              pageName={block.pageName}
                              blockName={block.id}
                              showEditButton={false}
                            >
                              {() => renderCustomContent(block)}
                            </ContentBlock>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditBlock(block)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteBlock(block.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                        <p className="text-muted-foreground">No content blocks for this page yet.</p>
                        <Button onClick={handleAddBlock} variant="outline" className="mt-4">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Content Block
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {isModalOpen && editingBlock && (
        <EditContentModal
          content={{
            id: editingBlock.id,
            page_name: editingBlock.pageName,
            block_name: editingBlock.id,
            title: editingBlock.title,
            content: editingBlock.content,
            image_url: '',
            subtitle: '',
            buttons: null,
            order_index: editingBlock.position,
            created_at: editingBlock.createdAt,
            updated_at: editingBlock.updatedAt
          }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={(updatedContent) => {
            const updatedBlock: ContentBlock = {
              ...editingBlock,
              title: updatedContent.title || '',
              content: updatedContent.content || '',
              updatedAt: new Date().toISOString()
            };
            handleSaveBlock(updatedBlock);
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default ContentEditorPage;
