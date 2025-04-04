
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
  onAvatarChange: (url: string | null) => Promise<void>;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  userId, 
  currentAvatarUrl, 
  onAvatarChange 
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Upload the avatar to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-avatar.${fileExt}`;
      
      // Check if avatars bucket exists, if not create one
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarsBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
      
      if (!avatarsBucketExists) {
        await supabase.storage.createBucket('avatars', { public: true });
      }
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });
        
      if (error) throw error;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      const publicUrl = urlData.publicUrl;
      
      // Update profile with new avatar URL
      await onAvatarChange(publicUrl);
    } catch (error) {
      console.error('Error updating avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className="w-32 h-32 border-4 border-white shadow-md">
        {currentAvatarUrl ? (
          <AvatarImage src={currentAvatarUrl} alt="Profile" />
        ) : (
          <AvatarFallback className="bg-primary text-white text-2xl">
            {userId.charAt(0).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      
      <label
        htmlFor="avatar-upload"
        className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
      </label>
      
      <input
        id="avatar-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  );
};
