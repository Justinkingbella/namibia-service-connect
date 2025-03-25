
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Briefcase, 
  Palette, 
  Truck, 
  Heart,
  LucideIcon
} from 'lucide-react';
import { ServiceCategory } from '@/types';
import { cn } from '@/lib/utils';

interface ServiceCategoryCardProps {
  category: ServiceCategory;
  count?: number;
  className?: string;
}

const getCategoryIcon = (category: ServiceCategory): LucideIcon => {
  switch (category) {
    case 'errand':
      return ShoppingBag;
    case 'home':
      return Home;
    case 'professional':
      return Briefcase;
    case 'freelance':
      return Palette;
    case 'transport':
      return Truck;
    case 'health':
      return Heart;
    default:
      return Briefcase;
  }
};

const getCategoryName = (category: ServiceCategory): string => {
  switch (category) {
    case 'errand':
      return 'Errands';
    case 'home':
      return 'Home Services';
    case 'professional':
      return 'Professional Services';
    case 'freelance':
      return 'Freelancers';
    case 'transport':
      return 'Transport & Rentals';
    case 'health':
      return 'Health & Wellness';
    default:
      return 'Other Services';
  }
};

export function ServiceCategoryCard({ category, count, className }: ServiceCategoryCardProps) {
  const Icon = getCategoryIcon(category);
  const name = getCategoryName(category);

  return (
    <Link
      to={`/dashboard/services/category/${category}`}
      className={cn(
        "block p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow",
        "group relative overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            {count !== undefined && (
              <p className="text-sm text-muted-foreground">{count} services</p>
            )}
          </div>
        </div>
        <div className="text-primary">
          <svg className="h-5 w-5 transform transition-transform group-hover:translate-x-1" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      {/* Decorative gradient */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary/5 to-transparent rounded-full transform translate-x-8 translate-y-8"></div>
    </Link>
  );
}

export default ServiceCategoryCard;
