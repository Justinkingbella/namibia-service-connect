
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '../common/Button';
import Container from '../common/Container';
import FadeIn from '../animations/FadeIn';

interface CTASectionProps {
  className?: string;
}

export function CTASection({ className }: CTASectionProps) {
  return (
    <section
      className={cn(
        'py-20 md:py-28 relative overflow-hidden',
        className
      )}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/3 bottom-0 h-[500px] w-[500px] translate-y-1/2 rounded-full bg-blue-100/40 blur-3xl"></div>
        <div className="absolute right-1/3 top-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <Container>
        <div className="glass rounded-3xl overflow-hidden">
          <div className="px-6 py-12 md:p-12 lg:p-16 text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold max-w-3xl mx-auto">
                Ready to Transform Your Service Experience in Namibia?
              </h2>
            </FadeIn>
            
            <FadeIn delay={200}>
              <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto">
                Join thousands of customers and service providers already using Namibia Service Hub for seamless service connections.
              </p>
            </FadeIn>
            
            <FadeIn delay={400} className="mt-10">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                  Find a Service
                </Button>
                <Button variant="outline" size="lg">
                  Become a Provider
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CTASection;
