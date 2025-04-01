
import React, { useState } from 'react';
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

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Address",
      content: "Innovation Hub, Windhoek, Namibia",
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email",
      content: "info@namibiaservicehub.com",
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone",
      content: "+264 81 234 5678",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <Container>
            <div className="text-center">
              <FadeIn>
                <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                  Have questions or feedback? We'd love to hear from you. Our team is here to help.
                </p>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* Contact Form and Info */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <FadeIn>
                <div className="lg:col-span-1 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                    <p className="text-muted-foreground mb-8">
                      We're here to help with any questions about our services, partnerships, or anything else. Reach out to us using the information below or fill out the contact form.
                    </p>
                  </div>

                  {contactInfo.map((info, index) => (
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
                    <CardTitle>Send Us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
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
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">Our Location</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                  Find us at our central office in Windhoek.
                </p>
              </div>
            </FadeIn>
            
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
