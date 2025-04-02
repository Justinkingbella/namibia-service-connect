
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/common/Container';
import { getPageContent } from '@/services/contentService';
import { ContentBlock } from '@/services/contentService';

const AboutPage = () => {
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const data = await getPageContent('about');
        setContent(data);
      } catch (error) {
        console.error('Error fetching about page content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">About Us</h1>
            
            {loading ? (
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-32 bg-gray-200 rounded animate-pulse mt-6"></div>
              </div>
            ) : content.length > 0 ? (
              <div className="space-y-8">
                {content.map((block) => (
                  <div key={block.id} className="prose max-w-none">
                    {block.title && <h2 className="text-2xl font-semibold mb-4">{block.title}</h2>}
                    {block.subtitle && <h3 className="text-xl mb-3 text-muted-foreground">{block.subtitle}</h3>}
                    {block.image_url && (
                      <img 
                        src={block.image_url} 
                        alt={block.title || 'About us'} 
                        className="rounded-lg w-full h-auto mb-6"
                      />
                    )}
                    {block.content && (
                      <div className="whitespace-pre-line">
                        {block.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No content available. Please check back later.</p>
              </div>
            )}
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
