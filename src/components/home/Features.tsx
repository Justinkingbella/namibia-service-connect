
import React from 'react';
import { 
  Clock, 
  Shield, 
  CreditCard, 
  MapPin, 
  Star, 
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Container from '../common/Container';
import FeatureCard from '../common/FeatureCard';
import FadeIn from '../animations/FadeIn';

interface FeaturesProps {
  className?: string;
}

const features = [
  {
    title: 'Real-Time Bookings',
    description: 'Book services instantly with our real-time availability system. No more waiting for confirmations.',
    icon: <Clock className="h-6 w-6" />,
  },
  {
    title: 'Verified Providers',
    description: 'All service providers undergo thorough verification to ensure quality and reliability.',
    icon: <Shield className="h-6 w-6" />,
  },
  {
    title: 'Secure Payments',
    description: 'Multiple payment options including PayToday, PayFast, EWallet, and bank transfers.',
    icon: <CreditCard className="h-6 w-6" />,
  },
  {
    title: 'Location-Based',
    description: 'Find services near you with our location-based search functionality.',
    icon: <MapPin className="h-6 w-6" />,
  },
  {
    title: 'Ratings & Reviews',
    description: 'Make informed decisions based on honest reviews from other customers.',
    icon: <Star className="h-6 w-6" />,
  },
  {
    title: 'Direct Communication',
    description: 'Chat directly with service providers to discuss requirements.',
    icon: <MessageSquare className="h-6 w-6" />,
  },
];

export function Features({ className }: FeaturesProps) {
  return (
    <section
      className={cn(
        'py-20 md:py-28 bg-gray-50/50 relative',
        className
      )}
    >
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold">Features That Make Us Different</h2>
            <p className="mt-4 text-muted-foreground">
              Designed to make finding and booking services in Namibia effortless, secure, and reliable.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Features;
