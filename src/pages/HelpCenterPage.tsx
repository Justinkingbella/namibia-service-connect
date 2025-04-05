
import React, { useState } from 'react';
import { Layout } from '@/components/common/Container';
import { Search, ChevronDown, ChevronRight, Phone, Mail, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HelpCenterPage: React.FC = () => {
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({});

  const toggleFaq = (id: string) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqCategories = [
    {
      id: 'general',
      title: 'General Questions',
      faqs: [
        {
          id: 'what-is',
          question: 'What is NamibiaService.com?',
          answer: 'NamibiaService.com is a platform that connects service providers in Namibia with customers who need their services. We make it easy to discover, book, and manage service appointments across various categories.'
        },
        {
          id: 'cost',
          question: 'How much does it cost to use the platform?',
          answer: 'For customers, using our platform to find and book services is completely free. Service providers pay a small commission on completed bookings and have the option to subscribe to premium tiers for additional features.'
        },
        {
          id: 'locations',
          question: 'Which locations in Namibia do you serve?',
          answer: 'We currently operate in major cities including Windhoek, Swakopmund, and Walvis Bay, with plans to expand to more locations across Namibia. Service availability may vary by location.'
        }
      ]
    },
    {
      id: 'customers',
      title: 'For Customers',
      faqs: [
        {
          id: 'book-service',
          question: 'How do I book a service?',
          answer: 'Browse through our service categories or search for specific services, select a provider, choose your preferred date and time, and complete the booking process. You'll receive a confirmation once the provider accepts your booking.'
        },
        {
          id: 'payments',
          question: 'What payment methods are available?',
          answer: 'We support multiple payment options including mobile money (MTC, TN Mobile), bank transfers, cash payments, and digital wallets. Choose your preferred method during checkout.'
        },
        {
          id: 'cancel-booking',
          question: 'How do I cancel or reschedule a booking?',
          answer: 'You can cancel or reschedule bookings through your dashboard. Go to "My Bookings," select the booking you want to modify, and follow the prompts. Please note that cancellation policies may vary by provider.'
        }
      ]
    },
    {
      id: 'providers',
      title: 'For Service Providers',
      faqs: [
        {
          id: 'become-provider',
          question: 'How do I become a service provider?',
          answer: 'Sign up for an account, choose "Service Provider" as your role, complete your profile information, add your services, and submit the necessary verification documents. Our team will review your application and activate your provider account.'
        },
        {
          id: 'fees',
          question: 'What fees do providers pay?',
          answer: 'Providers pay a commission of 10-15% on completed bookings, depending on their subscription tier. We also offer subscription plans with reduced commission rates and additional features.'
        },
        {
          id: 'get-paid',
          question: 'How and when do I get paid?',
          answer: 'Payments are processed within 24-48 hours after service completion and customer confirmation. You can withdraw funds to your bank account or mobile money wallet through your dashboard.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      faqs: [
        {
          id: 'account-issues',
          question: 'I can\'t log into my account',
          answer: 'Try resetting your password using the "Forgot Password" link. If you still can\'t access your account, contact our support team with your account email for assistance.'
        },
        {
          id: 'app-problems',
          question: 'The website/app is not working properly',
          answer: 'Try clearing your browser cache or updating the app to the latest version. If problems persist, please report the specific issue to our technical support team with screenshots if possible.'
        },
        {
          id: 'notifications',
          question: 'I\'m not receiving notifications',
          answer: 'Check your notification settings in your account preferences. Also verify that our emails aren\'t going to your spam folder. For app notifications, ensure that notifications are enabled in your device settings.'
        }
      ]
    }
  ];

  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Help Center</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Find answers to common questions or reach out to our support team for assistance.
            </p>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Search for answers..." 
                className="pl-12 py-6 text-lg rounded-full bg-white"
              />
            </div>
          </div>
          
          <Tabs defaultValue="faqs" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="faqs">Frequently Asked Questions</TabsTrigger>
              <TabsTrigger value="contact">Contact Support</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faqs">
              <Card>
                <CardContent className="pt-6">
                  {faqCategories.map((category) => (
                    <div key={category.id} className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
                      <div className="space-y-3">
                        {category.faqs.map((faq) => (
                          <div 
                            key={faq.id} 
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <button
                              onClick={() => toggleFaq(faq.id)}
                              className="flex justify-between items-center w-full text-left px-4 py-3 bg-white hover:bg-gray-50"
                            >
                              <span className="font-medium">{faq.question}</span>
                              {expandedFaqs[faq.id] ? (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-gray-500" />
                              )}
                            </button>
                            {expandedFaqs[faq.id] && (
                              <div className="px-4 py-3 bg-gray-50 border-t">
                                <p className="text-gray-700">{faq.answer}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contact">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center p-6 text-center border rounded-lg">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Phone Support</h3>
                      <p className="text-gray-600 mb-4">Available Mon-Fri, 8am to 5pm</p>
                      <p className="font-medium">+264 61 123 4567</p>
                    </div>
                    
                    <div className="flex flex-col items-center p-6 text-center border rounded-lg">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Email Support</h3>
                      <p className="text-gray-600 mb-4">Response within 24 hours</p>
                      <p className="font-medium">support@namibiaservice.com</p>
                    </div>
                    
                    <div className="flex flex-col items-center p-6 text-center border rounded-lg">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Live Chat</h3>
                      <p className="text-gray-600 mb-4">Available 24/7</p>
                      <Button variant="outline">Start Chat</Button>
                    </div>
                  </div>
                  
                  <div className="mt-8 border rounded-lg p-6">
                    <h3 className="text-xl font-medium mb-4">Send us a message</h3>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                          <Input id="name" type="text" />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                          <Input id="email" type="email" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                        <Input id="subject" type="text" />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        ></textarea>
                      </div>
                      <Button type="submit">Submit Request</Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenterPage;
