
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface ImageUploadProps {
  currentImage?: string | null;
  onChange: (file: File | null) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onChange }) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="max-h-[200px] object-cover rounded-md"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Input
          type="file"
          accept="image/*"
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export const ImageUploadPreview: React.FC<{ src: string }> = ({ src }) => {
  return (
    <div className="w-full">
      <img 
        src={src} 
        alt="Image preview" 
        className="max-h-[200px] object-cover rounded-md"
      />
    </div>
  );
};
