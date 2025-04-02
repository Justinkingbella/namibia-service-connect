
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { User, X, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
  onAvatarChange: (url: string | null) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  userId, 
  currentAvatarUrl, 
  onAvatarChange 
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl || null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (currentAvatarUrl !== avatarUrl) {
      setAvatarUrl(currentAvatarUrl || null);
    }
  }, [currentAvatarUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Math.random().toString(36).slice(2)}.${fileExt}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const newAvatarUrl = data.publicUrl;
      setAvatarUrl(newAvatarUrl);
      onAvatarChange(newAvatarUrl);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully."
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload image"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!avatarUrl) return;
    
    try {
      setUploading(true);
      
      // Extract the file path from the URL
      const urlParts = avatarUrl.split('/');
      const bucketParts = urlParts.slice(urlParts.indexOf('avatars') + 1);
      const filePath = bucketParts.join('/');
      
      if (filePath) {
        const { error } = await supabase.storage
          .from('avatars')
          .remove([filePath]);
          
        if (error) {
          console.error('Error removing avatar:', error);
        }
      }
      
      setAvatarUrl(null);
      onAvatarChange(null);
      
      toast({
        title: "Avatar removed",
        description: "Your profile picture has been removed."
      });
    } catch (error) {
      console.error('Error removing avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <Avatar className="w-32 h-32 border-4 border-white shadow-md">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="bg-primary/10 text-primary w-full h-full flex items-center justify-center">
              <User className="h-16 w-16" />
            </div>
          )}
        </Avatar>
        {avatarUrl && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 w-full justify-center">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <div className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            <Upload className="mr-2 h-4 w-4" />
            <span>{avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
          </div>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
