
import { supabase } from '@/integrations/supabase/client';

export interface SiteSetting {
  id: string;
  key: string;
  value: any;
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

export const getSiteSettings = async (): Promise<Record<string, any>> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');
  
  if (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }
  
  // Convert array of settings to a key-value object
  return data.reduce((acc: Record<string, any>, setting: SiteSetting) => {
    try {
      acc[setting.key] = JSON.parse(setting.value);
    } catch (e) {
      acc[setting.key] = setting.value;
    }
    return acc;
  }, {});
};

export const getPageSections = async (pageName: string): Promise<PageSection[]> => {
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_name', pageName)
    .order('order_index');
  
  if (error) {
    console.error(`Error fetching sections for page ${pageName}:`, error);
    return [];
  }
  
  return data || [];
};

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
  
  return data;
};

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
  
  return data;
};

export const updateSiteSetting = async (key: string, value: any): Promise<SiteSetting | null> => {
  const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
  
  const { data, error } = await supabase
    .from('site_settings')
    .update({ value: jsonValue })
    .eq('key', key)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating site setting:', error);
    return null;
  }
  
  return data;
};

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
