
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads an image to Supabase storage
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param folder Optional folder path within the bucket
 * @returns URL of the uploaded image or null if failed
 */
export const uploadImage = async (
  file: File,
  bucket: string = 'images',
  folder: string = ''
): Promise<string | null> => {
  try {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder ? `${folder}/` : ''}${uuidv4()}.${fileExt}`;
    
    // Ensure the bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucket);
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      await supabase.storage.createBucket(bucket, { public: true });
    }
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type,
      });
      
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Unexpected error in uploadImage:', error);
    return null;
  }
};

/**
 * Deletes an image from Supabase storage
 * @param url The URL of the image to delete
 * @returns true if successful, false otherwise
 */
export const deleteImage = async (url: string): Promise<boolean> => {
  try {
    // Extract the path from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // The bucket is the first part after storage/v1/object/public/
    const bucketIndex = pathParts.findIndex(part => part === 'public') + 1;
    if (bucketIndex < 1 || bucketIndex >= pathParts.length) {
      console.error('Invalid storage URL format');
      return false;
    }
    
    const bucket = pathParts[bucketIndex];
    // The path is everything after the bucket
    const path = pathParts.slice(bucketIndex + 1).join('/');
    
    const { error } = await supabase.storage
      .from(bucket)
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
};
