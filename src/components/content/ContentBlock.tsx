
import React, { useState, useEffect } from 'react';
import { getContentBlock, updateContentBlock, uploadContentImage, ContentBlock as ContentBlockType } from '@/services/contentService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import EditContentModal from './EditContentModal';
import FadeIn from '@/components/animations/FadeIn';

interface ContentBlockProps {
  pageName: string;
  blockName: string;
  showEditButton?: boolean;
  className?: string;
  children?: (content: ContentBlockType) => React.ReactNode;
}

const ContentBlock: React.FC<ContentBlockProps> = ({
  pageName,
  blockName,
  showEditButton = false,
  className = '',
  children,
}) => {
  const [content, setContent] = useState<ContentBlockType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const data = await getContentBlock(pageName, blockName);
      setContent(data);
    } catch (error) {
      console.error(`Error loading content block ${blockName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [pageName, blockName]);

  const handleContentUpdate = (updatedContent: ContentBlockType) => {
    setContent(updatedContent);
  };

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-12 rounded-md"></div>;
  }

  if (!content) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {isAdmin && showEditButton && (
        <Button
          size="sm"
          variant="outline"
          className="absolute top-2 right-2 p-2 z-10"
          onClick={() => setIsEditModalOpen(true)}
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
      )}
      
      <FadeIn>
        {children ? (
          children(content)
        ) : (
          <div>
            {content.title && <h2 className="text-2xl font-bold mb-4">{content.title}</h2>}
            {content.subtitle && <p className="text-muted-foreground mb-6">{content.subtitle}</p>}
            {content.content && <div className="prose">{content.content}</div>}
            {content.image_url && (
              <img 
                src={content.image_url} 
                alt={content.title || 'Content image'} 
                className="rounded-lg my-4"
              />
            )}
          </div>
        )}
      </FadeIn>

      {isAdmin && isEditModalOpen && (
        <EditContentModal
          content={content}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleContentUpdate}
        />
      )}
    </div>
  );
};

export default ContentBlock;
