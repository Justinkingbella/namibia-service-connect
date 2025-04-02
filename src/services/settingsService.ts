
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SiteSetting {
  id: string;
  key: string;
  value: any;
}

// Fetch all site settings
export async function fetchSiteSettings(): Promise<Record<string, any>> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');

  if (error) {
    console.error('Error fetching site settings:', error);
    toast.error('Failed to load site settings');
    return {};
  }

  // Convert array of settings to an object
  return data.reduce((acc: Record<string, any>, setting: SiteSetting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});
}

// Fetch a specific site setting
export async function fetchSiteSetting(key: string): Promise<any> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error(`Error fetching site setting (${key}):`, error);
    return null;
  }

  return data.value;
}

// Update a site setting
export async function updateSiteSetting(key: string, value: any): Promise<boolean> {
  // Check if setting exists
  const { count, error: countError } = await supabase
    .from('site_settings')
    .select('*', { count: 'exact', head: true })
    .eq('key', key);

  if (countError) {
    console.error(`Error checking if setting exists (${key}):`, countError);
    toast.error('Failed to update setting');
    return false;
  }

  let result;

  if (count && count > 0) {
    // Update existing setting
    result = await supabase
      .from('site_settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key);
  } else {
    // Insert new setting
    result = await supabase
      .from('site_settings')
      .insert([{ key, value }]);
  }

  if (result.error) {
    console.error(`Error updating site setting (${key}):`, result.error);
    toast.error('Failed to update setting');
    return false;
  }

  toast.success('Setting updated successfully');
  return true;
}

// Delete a site setting
export async function deleteSiteSetting(key: string): Promise<boolean> {
  const { error } = await supabase
    .from('site_settings')
    .delete()
    .eq('key', key);

  if (error) {
    console.error(`Error deleting site setting (${key}):`, error);
    toast.error('Failed to delete setting');
    return false;
  }

  toast.success('Setting deleted successfully');
  return true;
}

// For SiteSettingsPage.tsx compatibility
export { fetchSiteSettings as getSiteSettings };

// Upload image to supabase storage
export async function uploadImage(file: File, path: string): Promise<string | null> {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('public')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('public')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error('Failed to upload image');
    return null;
  }
}
