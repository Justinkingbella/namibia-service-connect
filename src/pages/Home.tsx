
import React from 'react';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import ServiceCategories from '@/components/home/ServiceCategories';
import CTASection from '@/components/home/CTASection';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ServiceCategories />
      <Features />
      <CTASection />
    </div>
  );
};

export default Home;
