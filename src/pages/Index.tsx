
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import ServiceCategories from '@/components/home/ServiceCategories';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/layout/Footer';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/common/Container';
import FadeIn from '@/components/animations/FadeIn';

const HowItWorks = () => (
  <section className="py-20 bg-gray-50" id="how-it-works">
    <Container>
      <div className="text-center mb-16">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Booking a service with Namibia Service Hub is simple and efficient
          </p>
        </FadeIn>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FadeIn delay={100}>
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center relative">
            <div className="w-12 h-12 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center mx-auto mb-6">
              1
            </div>
            <h3 className="text-xl font-bold mb-4">Search for a Service</h3>
            <p className="text-muted-foreground">
              Browse through our wide range of services or use the search function to find exactly what you need.
            </p>
          </div>
        </FadeIn>
        
        <FadeIn delay={200}>
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center relative">
            <div className="w-12 h-12 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center mx-auto mb-6">
              2
            </div>
            <h3 className="text-xl font-bold mb-4">Book a Time Slot</h3>
            <p className="text-muted-foreground">
              Select your preferred service provider and choose a convenient time slot from their available schedule.
            </p>
          </div>
        </FadeIn>
        
        <FadeIn delay={300}>
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center relative">
            <div className="w-12 h-12 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center mx-auto mb-6">
              3
            </div>
            <h3 className="text-xl font-bold mb-4">Enjoy Quality Service</h3>
            <p className="text-muted-foreground">
              The verified service provider will arrive at the scheduled time. Rate and review after the service.
            </p>
          </div>
        </FadeIn>
      </div>
      
      <div className="mt-12 text-center">
        <Button 
          asChild
          size="lg"
        >
          <Link to="/auth/sign-up">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </Container>
  </section>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ServiceCategories />
        <HowItWorks />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
