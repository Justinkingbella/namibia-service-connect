
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';

export interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  acceptTypes?: string;
  maxSize?: number; // in bytes
  label?: string;
  buttonText?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  acceptTypes = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = 'Upload a file',
  buttonText = 'Select File',
  className = '',
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    // Check file size
    if (selectedFile.size > maxSize) {
      setError(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await onUpload(file);
      // Reset file after successful upload
      setFile(null);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept={acceptTypes}
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
            id="file-upload"
          />
          <label 
            htmlFor="file-upload"
            className="cursor-pointer flex-1 px-3 py-2 border border-input bg-background text-sm rounded-md truncate"
          >
            {file ? file.name : 'No file selected'}
          </label>
          <Button
            type="button"
            onClick={() => document.getElementById('file-upload')?.click()}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            {buttonText}
          </Button>
        </div>
      </div>
      
      {file && (
        <div className="flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={loading}
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};
