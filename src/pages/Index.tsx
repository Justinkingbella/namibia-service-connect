
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import ServiceCategories from '@/components/home/ServiceCategories';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ServiceCategories />
        <Features />
        <CTASection />
      </main>
      <footer className="bg-gray-50 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Namibia Service Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
