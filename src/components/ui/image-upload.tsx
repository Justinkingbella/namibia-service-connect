
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

export interface ImageUploadProps {
  initialImage?: string;
  onImageUpload: (url: string) => void;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  initialImage = '',
  onImageUpload,
  className = '',
  onChange
}) => {
  const [image, setImage] = useState<string>(initialImage);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
    
    setError('');
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create a temporary local URL for preview
      const localUrl = URL.createObjectURL(file);
      setImage(localUrl);
      
      // In a real app, here you'd upload to your storage service
      // For now, we'll simulate a successful upload
      setTimeout(() => {
        onImageUpload(localUrl); // In reality, this would be the URL from your storage service
        setIsUploading(false);
      }, 1000);
      
    } catch (error) {
      setError('Failed to upload image. Please try again.');
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage('');
    onImageUpload('');
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {image ? (
        <div className="relative w-full">
          <img 
            src={image} 
            alt="Uploaded" 
            className="rounded-lg object-cover w-full h-48" 
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full text-center">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="sr-only"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-500 mb-1">Click to upload image</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
          </label>
        </div>
      )}
      
      {isUploading && (
        <div className="mt-2 w-full">
          <div className="w-full h-2 bg-gray-200 rounded">
            <div className="h-full bg-blue-600 rounded animate-pulse"></div>
          </div>
          <p className="text-xs text-center mt-1 text-gray-500">Uploading...</p>
        </div>
      )}
      
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ImageUpload;
