import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/common/Container';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import ContentBlock from '@/components/content/ContentBlock';

const HowItWorksPage = () => {
  const steps = [
    {
      number: 1,
      title: "Create an Account",
      description: "Sign up as a customer or service provider in just a few minutes. Verify your email to activate your account.",
      image: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    },
    {
      number: 2,
      title: "Browse Services",
      description: "Explore services by category or search for specific services you need. Compare providers, check ratings and reviews.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    },
    {
      number: 3,
      title: "Book a Service",
      description: "Select your preferred service provider, choose a convenient time slot, and confirm your booking with secure payment.",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    },
    {
      number: 4,
      title: "Enjoy Quality Service",
      description: "The provider will arrive at the scheduled time. After service completion, rate your experience and leave a review.",
      image: "https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
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
              pageName="how_it_works" 
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

        {/* Process Steps */}
        <section className="py-16 md:py-24">
          <Container>
            <ContentBlock 
              pageName="how_it_works" 
              blockName="process"
              showEditButton
              className="text-center mb-12"
            >
              {(content) => (
                <>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{content.title}</h2>
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {content.subtitle}
                  </p>
                </>
              )}
            </ContentBlock>

            <div className="space-y-16">
              {steps.map((step, index) => (
                <FadeIn key={step.number} delay={index * 100}>
                  <div className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 !== 0 && 'md:flex-row-reverse'}`}>
                    <div className="flex-1">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 font-bold rounded-full flex items-center justify-center mb-6">
                        {step.number}
                      </div>
                      <h2 className="text-2xl font-bold mb-4 text-blue-800">{step.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                    <div className="flex-1 rounded-lg overflow-hidden shadow-lg border border-blue-100">
                      <img 
                        src={step.image} 
                        alt={step.title} 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* For Service Providers */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-blue-100">
          <Container>
            <ContentBlock 
              pageName="how_it_works" 
              blockName="for_providers"
              showEditButton
              className="text-center mb-12"
            >
              {(content) => (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{content.title}</h2>
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {content.subtitle}
                  </p>
                </>
              )}
            </ContentBlock>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <FadeIn delay={100}>
                <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">Create Your Profile</h3>
                  <p className="text-muted-foreground mb-6">
                    Sign up as a service provider, create a detailed profile showcasing your skills and expertise.
                  </p>
                  <ul className="space-y-2">
                    {["Easy registration", "Upload portfolio", "Set your availability"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check size={16} className="text-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
              
              <FadeIn delay={200}>
                <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">Manage Bookings</h3>
                  <p className="text-muted-foreground mb-6">
                    Receive booking requests, communicate with customers, and manage your schedule efficiently.
                  </p>
                  <ul className="space-y-2">
                    {["Real-time notifications", "Flexible scheduling", "Direct messaging"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check size={16} className="text-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
              
              <FadeIn delay={300}>
                <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">Get Paid Securely</h3>
                  <p className="text-muted-foreground mb-6">
                    Receive payments directly into your account with our secure payment processing system.
                  </p>
                  <ul className="space-y-2">
                    {["Multiple payment options", "Fast transfers", "Transaction tracking"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check size={16} className="text-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>

            <div className="mt-12 text-center">
              <Button 
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600"
              >
                <Link to="/auth/sign-up?role=provider" className="inline-flex items-center gap-2">
                  Become a Service Provider
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </Container>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <Container>
            <ContentBlock 
              pageName="how_it_works" 
              blockName="faq"
              showEditButton
              className="text-center mb-12"
            >
              {(content) => (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{content.title}</h2>
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {content.subtitle}
                  </p>
                </>
              )}
            </ContentBlock>

            <div className="max-w-3xl mx-auto mt-12">
              {[
                {
                  question: "How do I book a service?",
                  answer: "Browse through our available services, select a provider, choose a time slot that works for you, and complete the booking with payment. You'll receive a confirmation email with all the details."
                },
                {
                  question: "What payment methods are accepted?",
                  answer: "We accept multiple payment methods including PayToday, PayFast, E-Wallet, credit/debit cards, and bank transfers for your convenience."
                },
                {
                  question: "Can I reschedule or cancel a booking?",
                  answer: "Yes, you can reschedule or cancel a booking through your dashboard. Please note that cancellation policies may vary by service provider."
                },
                {
                  question: "How are service providers verified?",
                  answer: "All service providers undergo a thorough verification process including identity verification, qualification checks, and background checks to ensure quality and reliability."
                },
                {
                  question: "Is there a fee to use the platform?",
                  answer: "The platform is free for customers to use. Service providers pay a small commission on completed bookings."
                }
              ].map((faq, index) => (
                <FadeIn key={index} delay={index * 100}>
                  <div className="mb-6 bg-white p-6 rounded-lg shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-lg font-semibold mb-2 text-blue-800">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
