
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/common/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail } from 'lucide-react';
import { getPageContent, getSiteSettings } from '@/services/contentService';
import { ContentBlock } from '@/services/contentService';
import { useToast } from '@/hooks/use-toast';

const ContactPage = () => {
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [contentData, settingsData] = await Promise.all([
          getPageContent('contact'),
          getSiteSettings()
        ]);
        setContent(contentData);
        setSettings(settingsData);
      } catch (error) {
        console.error('Error fetching contact page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitting(false);
    }, 1500);
  };

  const getContactInfo = () => {
    return [
      {
        icon: MapPin,
        label: 'Address',
        value: settings.address || 'Namibia'
      },
      {
        icon: Phone,
        label: 'Phone',
        value: settings.contact_phone || '+264 XX XXX XXXX'
      },
      {
        icon: Mail,
        label: 'Email',
        value: settings.contact_email || 'info@namibiaservicehub.com'
      }
    ];
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h1>
            
            {loading ? (
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        {getContactInfo().map((item, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{item.label}</h3>
                              <p className="text-muted-foreground">{item.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {content.length > 0 && content.find(block => block.block_name === 'contact_info') && (
                    <div className="mt-6 prose max-w-none">
                      {content.map(block => {
                        if (block.block_name === 'contact_info') {
                          return (
                            <div key={block.id}>
                              {block.title && <h2 className="text-xl font-semibold mb-3">{block.title}</h2>}
                              {block.content && <div className="whitespace-pre-line">{block.content}</div>}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input 
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input 
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea 
                            id="message"
                            name="message"
                            rows={5}
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={submitting}
                        >
                          {submitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
