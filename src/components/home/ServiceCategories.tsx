
import React from 'react';
import { 
  Truck, 
  Home, 
  Briefcase, 
  Palette, 
  Car, 
  Heart 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Container from '../common/Container';
import CategoryCard from '../common/CategoryCard';
import FadeIn from '../animations/FadeIn';

interface ServiceCategoriesProps {
  className?: string;
}

const categories = [
  {
    title: 'Errand Services',
    icon: <Truck className="h-7 w-7" />,
    description: 'Courier, document delivery, shopping assistance',
    link: '#',
  },
  {
    title: 'Home Services',
    icon: <Home className="h-7 w-7" />,
    description: 'Cleaning, plumbing, electrical work, repairs',
    link: '#',
  },
  {
    title: 'Skilled Professionals',
    icon: <Briefcase className="h-7 w-7" />,
    description: 'Mechanics, tutors, fitness trainers, event planners',
    link: '#',
  },
  {
    title: 'Freelancers',
    icon: <Palette className="h-7 w-7" />,
    description: 'Designers, photographers, writers, developers',
    link: '#',
  },
  {
    title: 'Transportation',
    icon: <Car className="h-7 w-7" />,
    description: 'Cab rentals, moving services, equipment rentals',
    link: '#',
  },
  {
    title: 'Health & Wellness',
    icon: <Heart className="h-7 w-7" />,
    description: 'Massage therapists, personal trainers, dietitians',
    link: '#',
  },
];

export function ServiceCategories({ className }: ServiceCategoriesProps) {
  return (
    <section
      id="services"
      className={cn('py-20 md:py-28 relative', className)}
    >
      <Container>
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Explore Our Service Categories
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              From home services to skilled professionals, find the help you need for any task in Namibia.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <FadeIn key={category.title} delay={index * 100}>
              <CategoryCard
                title={category.title}
                icon={category.icon}
                description={category.description}
                link={category.link}
              />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default ServiceCategories;
