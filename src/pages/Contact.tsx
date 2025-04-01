
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/common/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Mail, MapPin, Phone } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getPageSections, PageSection } from '@/services/contentService';
import DynamicSection from '@/components/common/DynamicSection';

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageSections, setPageSections] = useState<PageSection[]>([]);
  const [contactInfo, setContactInfo] = useState({
    address: "Innovation Hub, Windhoek, Namibia",
    email: "info@namibiaservicehub.com",
    phone: "+264 81 234 5678"
  });

  useEffect(() => {
    const fetchPageSections = async () => {
      try {
        const sections = await getPageSections('contact');
        setPageSections(sections);
        
        // Extract contact info if available
        const contactInfoSection = sections.find(s => s.section_name === 'contact_info');
        if (contactInfoSection && contactInfoSection.content) {
          try {
            const parsedInfo = JSON.parse(contactInfoSection.content);
            setContactInfo({
              address: parsedInfo.address || contactInfo.address,
              email: parsedInfo.email || contactInfo.email,
              phone: parsedInfo.phone || contactInfo.phone
            });
          } catch (e) {
            console.error('Error parsing contact info:', e);
          }
        }
      } catch (error) {
        console.error('Error fetching contact page sections:', error);
      }
    };

    fetchPageSections();
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', data);
      setIsSubmitting(false);
      
      toast({
        title: "Message sent",
        description: "We've received your message and will get back to you soon.",
      });
      
      form.reset();
    }, 1500);
  };

  const contactInfoItems = [
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Address",
      content: contactInfo.address,
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email",
      content: contactInfo.email,
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone",
      content: contactInfo.phone,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <Container>
            <DynamicSection 
              pageName="contact" 
              sectionName="hero"
              showEditButton
              className="text-center"
            >
              {(section) => (
                <>
                  <h1 className="text-4xl md:text-5xl font-bold">{section.title}</h1>
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {section.subtitle}
                  </p>
                </>
              )}
            </DynamicSection>
          </Container>
        </section>

        {/* Contact Form and Info */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <FadeIn>
                <div className="lg:col-span-1 space-y-6">
                  <DynamicSection 
                    pageName="contact" 
                    sectionName="contact_info"
                    showEditButton
                  >
                    {(section) => (
                      <div>
                        <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
                        <p className="text-muted-foreground mb-8">
                          {section.subtitle}
                        </p>
                      </div>
                    )}
                  </DynamicSection>

                  {contactInfoItems.map((info, index) => (
                    <Card key={index}>
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                          {info.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{info.title}</h3>
                          <p className="text-muted-foreground">{info.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={200} className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <DynamicSection 
                      pageName="contact" 
                      sectionName="form"
                      showEditButton
                    >
                      {(section) => (
                        <>
                          <CardTitle>{section.title}</CardTitle>
                          <CardDescription>
                            {section.subtitle}
                          </CardDescription>
                        </>
                      )}
                    </DynamicSection>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="Message subject" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="How can we help you?" 
                                  rows={6} 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* Map Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <Container>
            <DynamicSection 
              pageName="contact" 
              sectionName="map"
              showEditButton
              className="text-center mb-12"
            >
              {(section) => (
                <>
                  <h2 className="text-3xl font-bold">{section.title}</h2>
                  <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                    {section.subtitle}
                  </p>
                </>
              )}
            </DynamicSection>
            
            <FadeIn delay={200}>
              <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
                {/* This would be a Google Map or other map embed */}
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <span className="text-muted-foreground">Interactive Map Here</span>
                </div>
              </div>
            </FadeIn>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
