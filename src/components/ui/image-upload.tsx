
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageIcon, TrashIcon } from 'lucide-react';

export interface ImageUploadProps {
  onChange: (file: File) => void;
  currentImage?: string;
  // Add the props used in the CreateServiceForm component
  initialImage?: string;
  onImageUpload?: (url: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onChange, 
  currentImage,
  initialImage,
  onImageUpload,
  className
}) => {
  const [image, setImage] = useState<string>(initialImage || currentImage || '');
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      onChange(file);
      
      // If this component is used with the onImageUpload prop pattern
      if (onImageUpload) {
        // Create a temporary URL for preview
        const fileUrl = URL.createObjectURL(file);
        setImage(fileUrl);
        // This is a simplified example - in a real app, 
        // you would upload the file to storage first
        onImageUpload(fileUrl);
      }
    }
  };

  // Use either the image state or the currentImage prop
  const displayImage = image || currentImage;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {displayImage ? (
        <div className="relative w-full h-40 bg-slate-100 rounded-md overflow-hidden">
          <img
            src={displayImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                onChange(new File([], ''));
                setImage('');
                if (onImageUpload) onImageUpload('');
              }}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-md p-6 bg-slate-50 w-full">
          <ImageIcon className="h-10 w-10 text-gray-400" />
          <div className="space-y-1 text-center">
            <p className="text-sm text-gray-600">Drag and drop an image, or click to select</p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
          <Button type="button" variant="outline" size="sm" className="mt-2" asChild>
            <label className="cursor-pointer">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
                Upload Image
              </span>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
