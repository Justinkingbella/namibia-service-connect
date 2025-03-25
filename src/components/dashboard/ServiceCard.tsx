
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';
import { ServiceListItem, PricingModel } from '@/types';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: ServiceListItem;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  const formatPrice = (price: number, model: PricingModel) => {
    return `N$${price}${model === 'hourly' ? '/hr' : ''}`;
  };

  return (
    <Link
      to={`/dashboard/services/${service.id}`}
      className={cn(
        "block bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all",
        className
      )}
    >
      <div className="relative aspect-[4/3]">
        <img 
          src={service.image || '/placeholder.svg'} 
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-sm font-medium">
          {formatPrice(service.price, service.pricingModel)}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-lg line-clamp-1">{service.title}</h3>
        
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{service.location}</span>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <div className="flex items-center text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm font-medium">
                {service.rating.toFixed(1)}
              </span>
            </div>
            <span className="mx-1 text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {service.reviewCount} reviews
            </span>
          </div>
          
          <div className="flex items-center text-sm text-primary">
            {service.pricingModel === 'hourly' && <Clock className="h-4 w-4 mr-1" />}
            <span>{service.pricingModel === 'hourly' ? 'Hourly' : 'Fixed'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ServiceCard;
