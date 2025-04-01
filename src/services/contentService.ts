

import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

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
  buttons: any[] | null;  // Keep as any[] | null to match existing code
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  order_index: number;
  is_active: boolean;
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

// Site Settings
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

export const createSiteSetting = async (key: string, value: any): Promise<SiteSetting | null> => {
  const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
  
  const { data, error } = await supabase
    .from('site_settings')
    .insert({ key, value: jsonValue })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating site setting:', error);
    return null;
  }
  
  return data;
};

export const deleteSiteSetting = async (key: string): Promise<boolean> => {
  const { error } = await supabase
    .from('site_settings')
    .delete()
    .eq('key', key);
  
  if (error) {
    console.error('Error deleting site setting:', error);
    return false;
  }
  
  return true;
};

// Page Sections
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
  
  // Process the data to ensure buttons is an array or null
  return data.map(section => ({
    ...section,
    // Convert JSON buttons to array if needed
    buttons: section.buttons ? (Array.isArray(section.buttons) ? section.buttons : [section.buttons]) : null
  })) as PageSection[];
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
  
  // Process the data to ensure buttons is an array or null
  return {
    ...data,
    // Convert JSON buttons to array if needed
    buttons: data.buttons ? (Array.isArray(data.buttons) ? data.buttons : [data.buttons]) : null
  } as PageSection;
};

export const createPageSection = async (section: Omit<PageSection, 'id' | 'created_at' | 'updated_at'>): Promise<PageSection | null> => {
  // Ensure buttons is properly formatted for the database
  const sectionData = { ...section };
  if (sectionData.buttons !== undefined) {
    sectionData.buttons = sectionData.buttons === null ? null : sectionData.buttons;
  }
  
  const { data, error } = await supabase
    .from('page_sections')
    .insert(sectionData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating page section:', error);
    return null;
  }
  
  // Process the data to ensure buttons is an array or null
  return {
    ...data,
    // Convert JSON buttons to array if needed
    buttons: data.buttons ? (Array.isArray(data.buttons) ? data.buttons : [data.buttons]) : null
  } as PageSection;
};

export const updatePageSection = async (id: string, updates: Partial<PageSection>): Promise<PageSection | null> => {
  // Create a copy to prevent modifying the original object
  const updateData = { ...updates };
  
  // Ensure buttons is properly formatted for the database
  if (updateData.buttons !== undefined) {
    updateData.buttons = updateData.buttons === null ? null : updateData.buttons;
  }
  
  const { data, error } = await supabase
    .from('page_sections')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating page section:', error);
    return null;
  }
  
  // Process the data to ensure buttons is an array or null
  return {
    ...data,
    // Convert JSON buttons to array if needed
    buttons: data.buttons ? (Array.isArray(data.buttons) ? data.buttons : [data.buttons]) : null
  } as PageSection;
};

export const deletePageSection = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('page_sections')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting page section:', error);
    return false;
  }
  
  return true;
};

// Service Categories
export const getServiceCategories = async (): Promise<ServiceCategory[]> => {
  // Using type assertion to work around the type checking issues
  const { data, error } = await supabase
    .from('service_categories' as any)
    .select('*')
    .order('order_index');
  
  if (error) {
    console.error('Error fetching service categories:', error);
    return [];
  }
  
  return data as ServiceCategory[];
};

export const getActiveServiceCategories = async (): Promise<ServiceCategory[]> => {
  // Using type assertion to work around the type checking issues
  const { data, error } = await supabase
    .from('service_categories' as any)
    .select('*')
    .eq('is_active', true)
    .order('order_index');
  
  if (error) {
    console.error('Error fetching active service categories:', error);
    return [];
  }
  
  return data as ServiceCategory[];
};

export const getServiceCategory = async (id: string): Promise<ServiceCategory | null> => {
  // Using type assertion to work around the type checking issues
  const { data, error } = await supabase
    .from('service_categories' as any)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching service category ${id}:`, error);
    return null;
  }
  
  return data as ServiceCategory;
};

export const createServiceCategory = async (category: Omit<ServiceCategory, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceCategory | null> => {
  // Using type assertion to work around the type checking issues
  const { data, error } = await supabase
    .from('service_categories' as any)
    .insert(category as any)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating service category:', error);
    return null;
  }
  
  return data as ServiceCategory;
};

export const updateServiceCategory = async (id: string, updates: Partial<ServiceCategory>): Promise<ServiceCategory | null> => {
  // Using type assertion to work around the type checking issues
  const { data, error } = await supabase
    .from('service_categories' as any)
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating service category:', error);
    return null;
  }
  
  return data as ServiceCategory;
};

export const deleteServiceCategory = async (id: string): Promise<boolean> => {
  // Using type assertion to work around the type checking issues
  const { error } = await supabase
    .from('service_categories' as any)
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting service category:', error);
    return false;
  }
  
  return true;
};

// Booking Settings
export const getBookingSettings = async (): Promise<Record<string, any>> => {
  // Using type assertion to work around the type checking issues
  const { data, error } = await supabase
    .from('booking_settings' as any)
    .select('*');
  
  if (error) {
    console.error('Error fetching booking settings:', error);
    return {};
  }
  
  // Convert array of settings to a key-value object
  return data.reduce((acc: Record<string, any>, setting: BookingSetting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});
};

export const updateBookingSetting = async (key: string, value: any, description?: string): Promise<BookingSetting | null> => {
  // Using type assertion to work around the type checking issues
  const { data, error } = await supabase
    .from('booking_settings' as any)
    .update({ value, ...(description && { description }) })
    .eq('key', key)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating booking setting:', error);
    return null;
  }
  
  return data as BookingSetting;
};

export const createBookingSetting = async (key: string, value: any, description?: string): Promise<BookingSetting | null> => {
  // Using type assertion to work around the type checking issues
  const { data, error } = await supabase
    .from('booking_settings' as any)
    .insert({ key, value, ...(description && { description }) })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating booking setting:', error);
    return null;
  }
  
  return data as BookingSetting;
};

export const deleteBookingSetting = async (key: string): Promise<boolean> => {
  // Using type assertion to work around the type checking issues
  const { error } = await supabase
    .from('booking_settings' as any)
    .delete()
    .eq('key', key);
  
  if (error) {
    console.error('Error deleting booking setting:', error);
    return false;
  }
  
  return true;
};

// Image Upload
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

