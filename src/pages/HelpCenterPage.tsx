import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Container from '@/components/common/Container';
import Footer from '@/components/layout/Footer';
// Fix import issue
import { Link } from 'react-router-dom';
import { Search, ArrowRight, FileText, MessageSquare, HelpCircle, Phone, Calendar, CreditCard, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HelpCenterPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-blue-50 py-16 md:py-24">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-blue-900 mb-4">
                How can we help you?
              </h1>
              <p className="text-lg text-blue-700 mb-8">
                Find answers, guides and resources to help you get the most out of our services.
              </p>
              <div className="relative mx-auto max-w-2xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  type="text" 
                  placeholder="Search for help articles..." 
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>
          </Container>
        </section>
        
        {/* Topic categories */}
        <section className="py-16">
          <Container>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Browse help topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Getting Started",
                  description: "Learn the basics and set up your account",
                  icon: FileText,
                  link: "/help/getting-started"
                },
                {
                  title: "Booking Services",
                  description: "How to find and book the right services",
                  icon: Calendar,
                  link: "/help/booking"
                },
                {
                  title: "Provider Guidelines",
                  description: "Best practices for service providers",
                  icon: HelpCircle,
                  link: "/help/providers"
                },
                {
                  title: "Payments & Billing",
                  description: "Understand payment methods and issues",
                  icon: CreditCard,
                  link: "/help/payments"
                },
                {
                  title: "Account & Security",
                  description: "Manage your account and keep it secure",
                  icon: User,
                  link: "/help/account"
                },
                {
                  title: "Contact Support",
                  description: "Get in touch with our customer support team",
                  icon: MessageSquare,
                  link: "/contact"
                },
              ].map((topic, index) => (
                <Link 
                  key={index} 
                  to={topic.link}
                  className="flex flex-col items-center p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-3 rounded-full bg-blue-50 text-blue-600 mb-4">
                    <topic.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{topic.title}</h3>
                  <p className="text-gray-500 text-center">{topic.description}</p>
                  <Button variant="ghost" size="sm" className="mt-4">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQs section */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Frequently Asked Questions</h2>
              <p className="text-center text-gray-600 mb-12">Quick answers to the most common questions</p>
              
              <div className="space-y-6">
                {[
                  {
                    question: "How do I create an account?",
                    answer: "You can create an account by clicking the 'Sign Up' button on the top right of the homepage. Fill out the required information and follow the verification steps sent to your email."
                  },
                  {
                    question: "How do I book a service?",
                    answer: "Browse through our available services, select a provider, choose a time slot that works for you, and complete the booking with payment. You'll receive a confirmation email with all the details."
                  },
                  {
                    question: "What payment methods do you accept?",
                    answer: "We accept multiple payment methods including PayToday, PayFast, E-Wallet, credit/debit cards, and bank transfers for your convenience."
                  },
                  {
                    question: "Can I cancel or reschedule a booking?",
                    answer: "Yes, you can reschedule or cancel a booking through your dashboard. Please note that cancellation policies may vary by service provider, and some may charge a cancellation fee."
                  },
                  {
                    question: "How do I become a service provider?",
                    answer: "To become a service provider, create an account and select 'Provider' as your account type. Complete your profile, add your services, and submit verification documents. Our team will review your application."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button asChild>
                  <Link to="/faq">View all FAQs <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Contact section */}
        <section className="py-16">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Still need help?</h2>
              <p className="text-gray-600 mb-8">Our support team is ready to assist you</p>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <Button asChild variant="outline" size="lg" className="flex gap-2 items-center">
                  <Link to="/contact">
                    <MessageSquare className="h-5 w-5" />
                    <span>Send us a message</span>
                  </Link>
                </Button>
                <Button asChild size="lg" className="flex gap-2 items-center">
                  <a href="tel:+264612345678">
                    <Phone className="h-5 w-5" />
                    <span>Call Support: +264 61 234 5678</span>
                  </a>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenterPage;
