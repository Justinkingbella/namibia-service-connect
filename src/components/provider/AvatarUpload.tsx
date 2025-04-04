
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AvatarUploadProps {
  currentAvatarUrl: string;
  onAvatarChange: (url: string) => Promise<void>;
  userId: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatarUrl, onAvatarChange, userId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setSelectedFile(file);
    
    // Create local preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const uploadAvatar = async () => {
    if (!selectedFile || !userId) return;
    
    setIsUploading(true);
    try {
      // Upload the file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, selectedFile, {
          upsert: true,
          cacheControl: '3600',
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      if (!urlData.publicUrl) throw new Error('Failed to get public URL');
      
      // Update profile with new avatar URL
      await onAvatarChange(urlData.publicUrl);
      
      // Reset state
      setSelectedFile(null);
      setPreviewUrl(null);
      
      toast.success('Avatar updated successfully');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };
  
  const cancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };
  
  return (
    <div className="flex flex-col items-center">
      <Avatar className="h-24 w-24 mb-4">
        <AvatarImage src={previewUrl || currentAvatarUrl || ''} />
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
      
      {selectedFile ? (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={uploadAvatar} 
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Save'}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={cancelUpload}
            disabled={isUploading}
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        </div>
      ) : (
        <div>
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <label htmlFor="avatar-upload">
            <Button 
              variant="outline" 
              size="sm" 
              className="cursor-pointer"
              asChild
            >
              <span>
                <Upload className="h-4 w-4 mr-1" /> Change
              </span>
            </Button>
          </label>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
