
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/common/Container';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getPageContent } from '@/services/contentService';
import { ContentBlock } from '@/services/contentService';

const FAQPage = () => {
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const data = await getPageContent('faq');
        setContent(data);
      } catch (error) {
        console.error('Error fetching FAQ page content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Helper function to parse FAQ content into Q&A format
  const parseFAQContent = (contentText: string): Array<{question: string, answer: string}> => {
    try {
      // First try to parse as JSON if it's in that format
      try {
        const parsed = JSON.parse(contentText);
        if (Array.isArray(parsed) && parsed.every(item => item.question && item.answer)) {
          return parsed;
        }
      } catch (e) {
        // Not valid JSON, continue with text parsing
      }
      
      // Fall back to text parsing with special format
      // Assumes format like "Q: Question here\nA: Answer here\n\nQ: Next question\nA: Next answer"
      const faqs: Array<{question: string, answer: string}> = [];
      const lines = contentText.split('\n\n'); // Split by empty lines
      
      lines.forEach(section => {
        const parts = section.split('\n');
        if (parts.length >= 2) {
          const questionLine = parts[0];
          const answerLines = parts.slice(1).join('\n');
          
          if (questionLine.startsWith('Q:') || questionLine.startsWith('Question:')) {
            const question = questionLine.replace(/^(Q:|Question:)\s*/, '').trim();
            const answer = answerLines.replace(/^(A:|Answer:)\s*/, '').trim();
            faqs.push({ question, answer });
          }
        }
      });
      
      return faqs;
    } catch (error) {
      console.error('Error parsing FAQ content:', error);
      return [];
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h1>
            
            {loading ? (
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-24 bg-gray-200 rounded animate-pulse mt-4"></div>
                <div className="h-24 bg-gray-200 rounded animate-pulse mt-2"></div>
                <div className="h-24 bg-gray-200 rounded animate-pulse mt-2"></div>
              </div>
            ) : content.length > 0 ? (
              <div className="space-y-8">
                {content.map((block) => (
                  <div key={block.id}>
                    {block.title && <h2 className="text-2xl font-semibold mb-4">{block.title}</h2>}
                    {block.subtitle && <h3 className="text-xl mb-3 text-muted-foreground">{block.subtitle}</h3>}
                    
                    {block.content && (
                      <Accordion type="single" collapsible className="w-full">
                        {parseFAQContent(block.content).map((faq, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-medium">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No FAQ content available. Please check back later.</p>
              </div>
            )}
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
