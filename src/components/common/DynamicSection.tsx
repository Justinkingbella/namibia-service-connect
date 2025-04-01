
import React, { useState, useEffect } from 'react';
import { getSectionsByName } from '@/services/contentService';
import { PageSection } from '@/services/contentService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import EditSectionModal from './EditSectionModal';
import FadeIn from '@/components/animations/FadeIn';

interface DynamicSectionProps {
  pageName: string;
  sectionName: string;
  showEditButton?: boolean;
  className?: string;
  children?: (section: PageSection) => React.ReactNode;
}

const DynamicSection: React.FC<DynamicSectionProps> = ({
  pageName,
  sectionName,
  showEditButton = false,
  className = '',
  children,
}) => {
  const [section, setSection] = useState<PageSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  const fetchSection = async () => {
    setIsLoading(true);
    try {
      const data = await getSectionsByName(pageName, sectionName);
      setSection(data);
    } catch (error) {
      console.error(`Error loading section ${sectionName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSection();
  }, [pageName, sectionName]);

  const handleSectionUpdate = (updatedSection: PageSection) => {
    setSection(updatedSection);
  };

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-12 rounded-md"></div>;
  }

  if (!section) {
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
          children(section)
        ) : (
          <div>
            {section.title && <h2 className="text-2xl font-bold mb-4">{section.title}</h2>}
            {section.subtitle && <p className="text-muted-foreground mb-6">{section.subtitle}</p>}
            {section.content && <div className="prose">{section.content}</div>}
            {section.image_url && (
              <img 
                src={section.image_url} 
                alt={section.title || 'Section image'} 
                className="rounded-lg my-4"
              />
            )}
          </div>
        )}
      </FadeIn>

      {isAdmin && isEditModalOpen && (
        <EditSectionModal
          section={section}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleSectionUpdate}
        />
      )}
    </div>
  );
};

export default DynamicSection;
