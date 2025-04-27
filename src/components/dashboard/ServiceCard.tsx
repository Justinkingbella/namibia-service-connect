
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceListItem } from '@/types/service';
import { DollarSign, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/formatters';

interface ServiceCardProps {
  service: ServiceListItem;
  actionLink?: string;
  actionText?: string;
  showProvider?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  actionLink = `/services/${service.id}`,
  actionText = 'View Details',
  showProvider = true,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="relative h-48">
        <img
          src={service.image || '/placeholder.svg'}
          alt={service.title}
          className="w-full h-full object-cover rounded-t-lg"
        />
        {service.featured && (
          <Badge className="absolute top-2 right-2 bg-amber-500">Featured</Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg leading-tight">{service.title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{service.category}</Badge>
            <Badge variant="secondary">
              {formatCurrency(service.price)} / {service.pricing_model || service.pricingModel}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {service.description}
        </p>

        <div className="mt-3 flex items-center gap-2">
          {service.rating && (
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">
                {service.rating.toFixed(1)} ({service.review_count || service.reviewCount || 0})
              </span>
            </div>
          )}

          {service.location && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">{service.location}</span>
            </div>
          )}
        </div>

        {showProvider && service.provider_name && (
          <p className="mt-2 text-xs text-muted-foreground">
            By {service.provider_name}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t">
        <Button variant="outline" className="w-full" size="sm" asChild>
          <Link to={actionLink}>
            {actionText}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
