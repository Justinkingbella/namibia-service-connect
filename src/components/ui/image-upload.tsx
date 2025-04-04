
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  className?: string;
  initialImage?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, className = '', initialImage = '' }) => {
  const [previewUrl, setPreviewUrl] = useState<string>(initialImage);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // Show preview
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      fileReader.readAsDataURL(file);

      // Upload to Supabase
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      // Check if services-images bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'services-images');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('services-images', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
      }

      const { data, error } = await supabase.storage
        .from('services-images')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('services-images')
        .getPublicUrl(fileName);

      if (publicUrlData) {
        onImageUpload(publicUrlData.publicUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    onImageUpload('');
  };

  return (
    <div className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center ${className}`}>
      {previewUrl ? (
        <div className="relative w-full h-full">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <ImageIcon className="h-10 w-10 text-gray-300 mb-2" />
          <p className="text-sm text-gray-500 mb-4">Upload service image</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="relative"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/*"
              disabled={uploading}
            />
          </Button>
        </>
      )}
    </div>
  );
};
