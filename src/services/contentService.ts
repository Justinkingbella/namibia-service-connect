
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

export interface PageSection {
  id: string;
  page_name: string;
  section_name: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  buttons: any[] | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
}

export interface BookingSetting {
  id: string;
  key: string;
  value: any;
  description: string | null;
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

// Get all page sections for a specific page
export const getSectionsByName = async (pageName: string, sectionName: string): Promise<PageSection | null> => {
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_name', pageName)
    .eq('section_name', sectionName)
    .single();
  
  if (error) {
    console.error(`Error fetching section ${sectionName} for page ${pageName}:`, error);
    return null;
  }
  
  return data as PageSection;
};

// Update a page section (admin only)
export const updatePageSection = async (id: string, updates: Partial<PageSection>): Promise<PageSection | null> => {
  const { data, error } = await supabase
    .from('page_sections')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating page section:', error);
    return null;
  }
  
  return data as PageSection;
};

// General image upload function
export const uploadImage = async (file: File, path: string): Promise<string | null> => {
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

// Get service categories
export const getServiceCategories = async (): Promise<ServiceCategory[]> => {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .order('order_index');
  
  if (error) {
    console.error('Error fetching service categories:', error);
    return [];
  }
  
  return data as ServiceCategory[];
};

// Create a service category (admin only)
export const createServiceCategory = async (category: Partial<ServiceCategory>): Promise<ServiceCategory | null> => {
  const { data, error } = await supabase
    .from('service_categories')
    .insert(category)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating service category:', error);
    return null;
  }
  
  return data as ServiceCategory;
};

// Update a service category (admin only)
export const updateServiceCategory = async (id: string, updates: Partial<ServiceCategory>): Promise<ServiceCategory | null> => {
  const { data, error } = await supabase
    .from('service_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating service category:', error);
    return null;
  }
  
  return data as ServiceCategory;
};

// Delete a service category (admin only)
export const deleteServiceCategory = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('service_categories')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting service category:', error);
    return false;
  }
  
  return true;
};

// Get site settings
export const getSiteSettings = async (): Promise<Record<string, any>> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');
  
  if (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }
  
  // Convert array of settings to key-value object
  return data.reduce((acc: Record<string, any>, setting: SiteSetting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});
};

// Update a site setting (admin only)
export const updateSiteSetting = async (key: string, value: any): Promise<boolean> => {
  const { data: existingSetting } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .single();
  
  if (existingSetting) {
    // Update existing setting
    const { error } = await supabase
      .from('site_settings')
      .update({ value })
      .eq('key', key);
    
    if (error) {
      console.error('Error updating site setting:', error);
      return false;
    }
  } else {
    // Create new setting
    const { error } = await supabase
      .from('site_settings')
      .insert({ key, value });
    
    if (error) {
      console.error('Error creating site setting:', error);
      return false;
    }
  }
  
  return true;
};

// Get booking settings
export const getBookingSettings = async (): Promise<BookingSetting[]> => {
  const { data, error } = await supabase
    .from('booking_settings')
    .select('*');
  
  if (error) {
    console.error('Error fetching booking settings:', error);
    return [];
  }
  
  return data as BookingSetting[];
};

// Update a booking setting (admin only)
export const updateBookingSetting = async (id: string, updates: Partial<BookingSetting>): Promise<BookingSetting | null> => {
  const { data, error } = await supabase
    .from('booking_settings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating booking setting:', error);
    return null;
  }
  
  return data as BookingSetting;
};

// Create a booking setting (admin only)
export const createBookingSetting = async (setting: Partial<BookingSetting>): Promise<BookingSetting | null> => {
  const { data, error } = await supabase
    .from('booking_settings')
    .insert(setting)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating booking setting:', error);
    return null;
  }
  
  return data as BookingSetting;
};
