
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/common/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, MapPin, Phone } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ContentBlock from '@/components/content/ContentBlock';

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
  const [contactInfo, setContactInfo] = useState({
    address: "Innovation Hub, Windhoek, Namibia",
    email: "info@namibiaservicehub.com",
    phone: "+264 81 234 5678"
  });

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
        <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-blue-100">
          <Container>
            <ContentBlock 
              pageName="contact" 
              blockName="hero"
              showEditButton
              className="text-center"
            >
              {(content) => (
                <>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{content.title}</h1>
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {content.subtitle}
                  </p>
                </>
              )}
            </ContentBlock>
          </Container>
        </section>

        {/* Contact Form and Info */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <FadeIn>
                <div className="lg:col-span-1 space-y-6">
                  <ContentBlock 
                    pageName="contact" 
                    blockName="contact_info"
                    showEditButton
                  >
                    {(content) => {
                      // Parse JSON content if it exists
                      if (content.content) {
                        try {
                          const parsedInfo = JSON.parse(content.content);
                          setContactInfo({
                            address: parsedInfo.address || contactInfo.address,
                            email: parsedInfo.email || contactInfo.email,
                            phone: parsedInfo.phone || contactInfo.phone
                          });
                        } catch (e) {
                          console.error('Error parsing contact info:', e);
                        }
                      }
                      
                      return (
                        <div>
                          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{content.title}</h2>
                          <p className="text-muted-foreground mb-8">
                            {content.subtitle}
                          </p>
                        </div>
                      );
                    }}
                  </ContentBlock>

                  {contactInfoItems.map((info, index) => (
                    <Card key={index} className="border border-blue-100 shadow-md hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="flex-shrink-0 bg-blue-100 text-blue-600 p-3 rounded-full">
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
                <Card className="border border-blue-100 shadow-lg">
                  <CardHeader>
                    <ContentBlock 
                      pageName="contact" 
                      blockName="form"
                      showEditButton
                    >
                      {(content) => (
                        <>
                          <CardTitle className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{content.title}</CardTitle>
                          <CardDescription>
                            {content.subtitle}
                          </CardDescription>
                        </>
                      )}
                    </ContentBlock>
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
                                  <Input placeholder="Your name" {...field} className="border-blue-200 focus:border-blue-500" />
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
                                  <Input placeholder="Your email" {...field} className="border-blue-200 focus:border-blue-500" />
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
                                <Input placeholder="Message subject" {...field} className="border-blue-200 focus:border-blue-500" />
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
                                  className="border-blue-200 focus:border-blue-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full md:w-auto bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600" disabled={isSubmitting}>
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
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
          <Container>
            <ContentBlock 
              pageName="contact" 
              blockName="map"
              showEditButton
              className="text-center mb-12"
            >
              {(content) => (
                <>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{content.title}</h2>
                  <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                    {content.subtitle}
                  </p>
                </>
              )}
            </ContentBlock>
            
            <FadeIn delay={200}>
              <div className="w-full h-96 rounded-lg overflow-hidden shadow-xl border border-blue-100">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233867.8248755433!2d16.957805749999998!3d-22.5698138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1c0b1b5cb30c01ed%3A0xe4b84940cc445d3b!2sWindhoek%2C%20Namibia!5e0!3m2!1sen!2sus!4v1646862937726!5m2!1sen!2sus"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                ></iframe>
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
