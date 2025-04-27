
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Booking, BookingStatus, PaymentStatus } from '@/types';
import { Calendar, Clock, DollarSign, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BookingCardProps {
  booking: Booking & {
    serviceName: string;
    serviceImage?: string;
    providerName?: string;
    customerName?: string;
    commission?: number;
  };
  viewAs?: 'provider' | 'customer';
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, viewAs = 'customer' }) => {
  const getStatusBadgeColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.CONFIRMED: return 'bg-blue-100 text-blue-800';
      case BookingStatus.IN_PROGRESS: return 'bg-purple-100 text-purple-800';
      case BookingStatus.COMPLETED: return 'bg-green-100 text-green-800';
      case BookingStatus.CANCELLED: return 'bg-red-100 text-red-800';
      case BookingStatus.DISPUTED: return 'bg-orange-100 text-orange-800';
      case BookingStatus.NO_SHOW: return 'bg-gray-100 text-gray-800';
      case BookingStatus.RESCHEDULED: return 'bg-teal-100 text-teal-800';
      case BookingStatus.REJECTED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl">{booking.serviceName}</CardTitle>
          <Badge className={getStatusBadgeColor(booking.status)}>
            {booking.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{formatDate(booking.date)}</span>
          <Clock className="h-4 w-4 text-muted-foreground ml-2" />
          <span className="text-sm">{booking.time || booking.startTime}</span>
        </div>
        
        {viewAs === 'provider' && booking.customerName && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.customerName}</span>
          </div>
        )}
        
        {viewAs === 'customer' && booking.providerName && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.providerName}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{formatCurrency(booking.totalAmount || booking.amount)}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t flex justify-between">
        <Link to={`/dashboard/bookings/${booking.id}`}>
          <Button variant="outline" size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BookingCard;
