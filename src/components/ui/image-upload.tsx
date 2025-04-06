
import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

export interface ImageUploadProps {
  initialImage?: string;
  onImageUpload: (url: string) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const ImageUpload = ({
  initialImage,
  onImageUpload,
  onChange,
  className = '',
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | undefined>(initialImage);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a temporary preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Handle file upload
    handleFileUpload(file);
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      // In a real implementation, this would upload to a storage service
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a fake URL as if we uploaded the image
      const fakeUploadedUrl = URL.createObjectURL(file);
      onImageUpload(fakeUploadedUrl);
      setLoading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageUpload('');
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Uploaded preview" 
            className="max-w-full max-h-64 object-contain rounded-md" 
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div 
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 w-full h-40 cursor-pointer hover:bg-gray-50"
          onClick={handleButtonClick}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-500 border-t-transparent"></div>
          ) : (
            <>
              <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload an image</p>
            </>
          )}
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {!preview && (
        <Button
          type="button"
          onClick={handleButtonClick}
          variant="outline"
          className="mt-2"
          disabled={loading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {loading ? 'Uploading...' : 'Upload Image'}
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
