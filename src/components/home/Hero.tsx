
import React from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Container from '../common/Container';
import FadeIn from '../animations/FadeIn';
import { useAuth } from '@/contexts/AuthContext';

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  const { user } = useAuth();
  
  return (
    <section
      className={cn(
        'relative overflow-hidden py-20 sm:py-32',
        'bg-gradient-to-b from-white via-blue-50/30 to-white',
        className
      )}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-blue-100/30 blur-3xl"></div>
      </div>

      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Your One-Stop Marketplace for</span>
              <span className="block mt-1 text-gradient">Local Services in Namibia</span>
            </h1>
          </FadeIn>
          
          <FadeIn direction="up" delay={200}>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Instantly connect with trusted service providers for all your needs - from home repairs to errands, skilled professionals to transportation.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={400} className="mt-8 sm:mt-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm"
                  placeholder="What service are you looking for?"
                />
              </div>
              {user ? (
                <Button asChild>
                  <Link to="/dashboard" className="w-full sm:w-auto">
                    Find Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/auth/sign-up" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={600} className="mt-8">
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <span className="flex items-center">
                <span className="mr-2 w-6 h-6 rounded-full flex items-center justify-center bg-green-100 text-green-800">
                  ✓
                </span>
                Verified Providers
              </span>
              <span className="mx-4 h-1 w-1 rounded-full bg-gray-300"></span>
              <span className="flex items-center">
                <span className="mr-2 w-6 h-6 rounded-full flex items-center justify-center bg-blue-100 text-blue-800">
                  ✓
                </span>
                Secure Payments
              </span>
              <span className="mx-4 h-1 w-1 rounded-full bg-gray-300"></span>
              <span className="flex items-center">
                <span className="mr-2 w-6 h-6 rounded-full flex items-center justify-center bg-purple-100 text-purple-800">
                  ✓
                </span>
                Real-time Booking
              </span>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
