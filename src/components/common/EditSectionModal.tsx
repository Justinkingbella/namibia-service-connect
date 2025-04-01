
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
import { updatePageSection, uploadImage, PageSection } from '@/services/contentService';
import { ImageUpload } from '@/components/ui/image-upload';

interface EditSectionModalProps {
  section: PageSection;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (section: PageSection) => void;
}

const EditSectionModal: React.FC<EditSectionModalProps> = ({
  section,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [title, setTitle] = useState(section.title || '');
  const [subtitle, setSubtitle] = useState(section.subtitle || '');
  const [content, setContent] = useState(section.content || '');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(section.image_url);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = section.image_url;

      // Upload new image if selected
      if (image) {
        const path = `${section.page_name}/${section.section_name}/${image.name}`;
        const uploadedUrl = await uploadImage(image, path);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      // Update section in database
      const updatedSection = await updatePageSection(section.id, {
        title,
        subtitle,
        content,
        image_url: imageUrl,
      });

      if (updatedSection) {
        onUpdate(updatedSection);
        toast({
          title: 'Success',
          description: 'Section updated successfully',
        });
        onClose();
      }
    } catch (error) {
      console.error('Error updating section:', error);
      toast({
        title: 'Error',
        description: 'Failed to update section',
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
          <DialogTitle>Edit {section.section_name} Section</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Section title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Section subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Section content"
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Section Image</Label>
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

export default EditSectionModal;
