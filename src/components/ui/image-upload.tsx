
import React, { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon } from 'lucide-react';

export interface ImageUploadProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  currentImage?: string;
  label?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, currentImage, label = 'Upload image', className }) => {
  return (
    <div className={`w-full ${className}`}>
      {currentImage && (
        <div className="mb-2 relative">
          <img 
            src={currentImage} 
            alt="Current image" 
            className="w-full h-auto max-h-32 object-contain border rounded-md" 
          />
        </div>
      )}
      
      <div className="flex items-center justify-center w-full">
        <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-primary hover:text-white transition-colors">
          <Upload className="w-8 h-8" />
          <span className="mt-2 text-base leading-normal">{label}</span>
          <input type='file' accept="image/*" className="hidden" onChange={onChange} />
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
