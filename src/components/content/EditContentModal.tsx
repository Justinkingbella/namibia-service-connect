
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { updateContentBlock, uploadContentImage, ContentBlock } from '@/services/contentService';

interface EditContentModalProps {
  content: ContentBlock;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (content: ContentBlock) => void;
}

const EditContentModal: React.FC<EditContentModalProps> = ({
  content,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [title, setTitle] = useState(content.title || '');
  const [subtitle, setSubtitle] = useState(content.subtitle || '');
  const [contentText, setContentText] = useState(content.content || '');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(content.image_url);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = content.image_url;

      // Upload new image if selected
      if (image) {
        const path = `${content.page_name}/${content.block_name}/${image.name}`;
        const uploadedUrl = await uploadContentImage(image, path);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      // Update content in database
      const updatedContent = await updateContentBlock(content.id, {
        title,
        subtitle,
        content: contentText,
        image_url: imageUrl,
      });

      if (updatedContent) {
        onUpdate(updatedContent);
        toast({
          title: 'Success',
          description: 'Content updated successfully',
        });
        onClose();
      }
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit {content.block_name} Content</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Content title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Content subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              placeholder="Content text"
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {imagePreview && (
                  <div className="mb-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-[200px] object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files ? e.target.files[0] : null)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a new image or keep the existing one
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContentModal;
