
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';
import { ServiceListItem, PricingModel } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
        "block bg-white border rounded-2xl overflow-hidden shadow-soft-sm hover:shadow-soft-md transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      <div className="relative aspect-[4/3]">
        <img 
          src={service.image || '/placeholder.svg'} 
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent text-white">
          <Badge className="bg-white/90 text-primary hover:bg-white/100">
            {formatPrice(service.price, service.pricingModel)}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="font-medium text-lg text-white">{service.title}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{service.location}</span>
        </div>
        
        <div className="flex items-center justify-between mt-4">
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
          
          <div className="flex items-center text-sm">
            <Badge variant="outline" className="flex items-center gap-1">
              {service.pricingModel === 'hourly' && <Clock className="h-3 w-3" />}
              <span>{service.pricingModel === 'hourly' ? 'Hourly' : 'Fixed'}</span>
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ServiceCard;
