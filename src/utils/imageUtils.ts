
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads an image to Supabase storage
 * @param file The file to upload
 * @param path The path to upload to (without filename)
 * @returns Object with success status and URL if successful
 */
export async function uploadImage(file: File, path: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    
    return { success: true, url: data.publicUrl };
  } catch (error) {
    console.error('Unexpected error in uploadImage:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Deletes an image from Supabase storage
 * @param url The full public URL of the image
 * @returns Success status
 */
export async function deleteImage(url: string): Promise<boolean> {
  try {
    // Extract the path from the URL
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/images\/(.*)/);
    
    if (!pathMatch || !pathMatch[1]) {
      console.error('Invalid image URL format:', url);
      return false;
    }
    
    const path = pathMatch[1];
    
    const { error } = await supabase.storage
      .from('images')
      .remove([path]);
      
    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error in deleteImage:', error);
    return false;
  }
}
