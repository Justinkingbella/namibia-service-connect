
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { BookingStatus } from '@/types/booking';

interface BookingCardProps {
  id: string;
  serviceName: string;
  serviceImage?: string;
  providerName?: string;
  customerName?: string;
  date: Date;
  status: BookingStatus;
  location?: string;
  totalAmount: number;
  showProviderInfo?: boolean;
  showCustomerInfo?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  id,
  serviceName,
  serviceImage,
  providerName,
  customerName,
  date,
  status,
  location,
  totalAmount,
  showProviderInfo = false,
  showCustomerInfo = false
}) => {
  // Update the status comparison to use the updated BookingStatus type
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'disputed':
        return 'bg-orange-100 text-orange-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      case 'rescheduled':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-medium line-clamp-1">{serviceName}</h3>
            {showProviderInfo && providerName && (
              <p className="text-sm text-muted-foreground">Provider: {providerName}</p>
            )}
            {showCustomerInfo && customerName && (
              <p className="text-sm text-muted-foreground">Customer: {customerName}</p>
            )}
          </div>
          <Badge className={getStatusColor(status)}>
            {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>
        
        <div className="mb-4 space-y-2 flex-1">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{date.toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formatDistanceToNow(date, { addSuffix: true })}</span>
          </div>
          
          {location && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{new Intl.NumberFormat('en-NA', { style: 'currency', currency: 'NAD' }).format(totalAmount)}</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <Link to={`/dashboard/bookings/${id}`}>
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export { BookingCard };
