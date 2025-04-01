import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { Booking, BookingStatus, PaymentStatus } from '@/types';
import { cn } from '@/lib/utils';
import { format, isValid } from 'date-fns';

interface BookingCardProps {
  booking: Booking & {
    serviceName: string;
    serviceImage: string;
    providerName?: string;
    customerName?: string;
  };
  viewAs: 'customer' | 'provider' | 'admin';
  className?: string;
}

export function BookingCard({ booking, viewAs, className }: BookingCardProps) {
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-medium">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </div>
        );
      case 'confirmed':
        return (
          <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs font-medium">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded text-xs font-medium">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </div>
        );
      case 'disputed':
        return (
          <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-medium">
            <AlertCircle className="h-3 w-3 mr-1" />
            Disputed
          </div>
        );
      default:
        return null;
    }
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-medium">
            <DollarSign className="h-3 w-3 mr-1" />
            Payment Pending
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium">
            <DollarSign className="h-3 w-3 mr-1" />
            Processing
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium">
            <DollarSign className="h-3 w-3 mr-1" />
            Paid
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-medium">
            <DollarSign className="h-3 w-3 mr-1" />
            Failed
          </div>
        );
      case 'refunded':
        return (
          <div className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded text-xs font-medium">
            <DollarSign className="h-3 w-3 mr-1" />
            Refunded
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isValid(date)) {
        return format(date, 'MMM dd, yyyy');
      }
      return dateString;
    } catch (error) {
      console.error('Invalid date:', dateString);
      return dateString;
    }
  };

  return (
    <Link
      to={`/dashboard/bookings/${booking.id}`}
      className={cn(
        "block bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all",
        className
      )}
    >
      <div className="flex">
        <div className="w-24 h-24 shrink-0">
          <img 
            src={booking.serviceImage || '/placeholder.svg'} 
            alt={booking.serviceName}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-4 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-base line-clamp-1">{booking.serviceName}</h3>
            <div className="flex space-x-2">
              {getStatusBadge(booking.status)}
            </div>
          </div>
          
          {viewAs === 'provider' && booking.customerName && (
            <p className="text-sm mt-1 text-muted-foreground">Customer: {booking.customerName}</p>
          )}
          
          {viewAs === 'customer' && booking.providerName && (
            <p className="text-sm mt-1 text-muted-foreground">Provider: {booking.providerName}</p>
          )}
          
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(booking.date)}</span>
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>{typeof booking.startTime === 'string' ? booking.startTime : '(time not available)'}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div>
              {getPaymentBadge(booking.paymentStatus)}
            </div>
            <div className="text-lg font-medium">
              N${booking.totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BookingCard;
