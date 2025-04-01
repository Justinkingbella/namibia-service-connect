
import { supabase } from '@/integrations/supabase/client';

export interface ContentBlock {
  id: string;
  page_name: string;
  block_name: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  buttons: any[] | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// Get all content blocks for a specific page
export const getPageContent = async (pageName: string): Promise<ContentBlock[]> => {
  const { data, error } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('page_name', pageName)
    .order('order_index');
  
  if (error) {
    console.error(`Error fetching content for page ${pageName}:`, error);
    return [];
  }
  
  return data as ContentBlock[];
};

// Get a specific content block
export const getContentBlock = async (pageName: string, blockName: string): Promise<ContentBlock | null> => {
  const { data, error } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('page_name', pageName)
    .eq('block_name', blockName)
    .single();
  
  if (error) {
    console.error(`Error fetching content block ${blockName} for page ${pageName}:`, error);
    return null;
  }
  
  return data as ContentBlock;
};

// Update a content block (admin only)
export const updateContentBlock = async (id: string, updates: Partial<ContentBlock>): Promise<ContentBlock | null> => {
  const { data, error } = await supabase
    .from('content_blocks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating content block:', error);
    return null;
  }
  
  return data as ContentBlock;
};

// Upload an image for content blocks
export const uploadContentImage = async (file: File, path: string): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from('site_images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });
  
  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }
  
  const { data: urlData } = supabase.storage
    .from('site_images')
    .getPublicUrl(data.path);
  
  return urlData.publicUrl;
};
