import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle, DollarSign, Loader2, Edit, MessageSquare } from 'lucide-react';
import { Booking, BookingStatus, PaymentStatus } from '@/types';
import { cn } from '@/lib/utils';
import { format, isValid, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BookingDetailProps { }

const BookingDetail: React.FC<BookingDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking & {
    serviceName: string;
    serviceImage: string;
    providerName?: string;
    customerName?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
  const [disputeDescription, setDisputeDescription] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) {
        setError('Booking ID is missing');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            services (title, image),
            profiles (first_name, last_name)
          `)
          .eq('id', id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error('Booking not found');
        }

        // Extract service and profile data
        const serviceName = data.services?.title || 'Unknown Service';
        const serviceImage = data.services?.image || '/placeholder.svg';
        const customerName = `${data.profiles?.first_name} ${data.profiles?.last_name}`.trim();

        // Format the booking data
        setBooking({
          ...data,
          serviceName,
          serviceImage,
          customerName,
          date: parseISO(data.date),
          startTime: data.startTime,
          totalAmount: data.total_amount,
          paymentStatus: data.payment_status,
          status: data.status,
        } as any);
      } catch (err: any) {
        console.error('Error fetching booking:', err);
        setError(err.message || 'Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-0">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-purple-100 text-purple-800 border-0">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-0">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      case 'disputed':
        return (
          <Badge className="bg-orange-100 text-orange-800 border-0">
            <AlertCircle className="h-3 w-3 mr-1" />
            Disputed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary">
            <DollarSign className="h-3 w-3 mr-1" />
            Payment Pending
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-0">
            <DollarSign className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-0">
            <DollarSign className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <DollarSign className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case 'refunded':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-0">
            <DollarSign className="h-3 w-3 mr-1" />
            Refunded
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateValue: string | Date) => {
    try {
      const date = typeof dateValue === 'string' ? parseISO(dateValue) : dateValue;

      if (isValid(date)) {
        return format(date, 'MMM dd, yyyy');
      }
      return typeof dateValue === 'string' ? dateValue : dateValue.toISOString();
    } catch (error) {
      console.error('Invalid date:', dateValue);
      return String(dateValue);
    }
  };

  const canCancel = (status: BookingStatus): boolean => {
    return status === 'pending' || status === 'confirmed';
  };

  const canComplete = (status: BookingStatus): boolean => {
    return status === 'confirmed' || status === 'in_progress';
  };

  const canDispute = (status: BookingStatus): boolean => {
    return status === 'completed';
  };

  const updateBookingStatus = async (newStatus: BookingStatus) => {
    if (!id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Booking ID is missing',
      });
      return;
    }

    setIsCanceling(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Optimistically update the local state
      setBooking((prevBooking) => {
        if (prevBooking) {
          return { ...prevBooking, status: newStatus };
        }
        return prevBooking;
      });

      toast({
        title: 'Success',
        description: `Booking status updated to ${newStatus}`,
      });
    } catch (err: any) {
      console.error('Error updating booking status:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to update booking status',
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Booking ID is missing',
      });
      return;
    }

    if (!cancelReason) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide a reason for cancellation',
      });
      return;
    }

    setIsCanceling(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', notes: cancelReason })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Optimistically update the local state
      setBooking((prevBooking) => {
        if (prevBooking) {
          return { ...prevBooking, status: 'cancelled', notes: cancelReason };
        }
        return prevBooking;
      });

      toast({
        title: 'Success',
        description: 'Booking cancelled successfully',
      });
    } catch (err: any) {
      console.error('Error canceling booking:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to cancel booking',
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const handleCompleteBooking = async () => {
    if (!id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Booking ID is missing',
      });
      return;
    }

    setIsCompleting(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Optimistically update the local state
      setBooking((prevBooking) => {
        if (prevBooking) {
          return { ...prevBooking, status: 'completed' };
        }
        return prevBooking;
      });

      toast({
        title: 'Success',
        description: 'Booking completed successfully',
      });
    } catch (err: any) {
      console.error('Error completing booking:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to complete booking',
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSubmitDispute = async () => {
    if (!id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Booking ID is missing',
      });
      return;
    }

    if (!disputeDescription) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide a description for the dispute',
      });
      return;
    }

    setIsSubmittingDispute(true);

    try {
      // Mock implementation - replace with actual dispute submission logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Optimistically update the local state
      setBooking((prevBooking) => {
        if (prevBooking) {
          return { ...prevBooking, status: 'disputed' };
        }
        return prevBooking;
      });

      toast({
        title: 'Success',
        description: 'Dispute submitted successfully',
      });
    } catch (err: any) {
      console.error('Error submitting dispute:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to submit dispute',
      });
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        Booking not found
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Booking Details</h2>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Booking Information</h3>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 rounded-md overflow-hidden">
              <img
                src={booking.serviceImage || '/placeholder.svg'}
                alt={booking.serviceName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-md font-medium">{booking.serviceName}</h4>
              <p className="text-sm text-gray-500">Customer: {booking.customerName}</p>
            </div>
          </div>

          <div className="mb-2">
            <span className="font-semibold">Status:</span> {getStatusBadge(booking.status)}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Payment Status:</span> {getPaymentBadge(booking.paymentStatus)}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Date:</span> {formatDate(booking.date)}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Time:</span> {booking.startTime}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Total Amount:</span> N${booking.totalAmount.toFixed(2)}
          </div>
          {booking.notes && (
            <div className="mb-2">
              <span className="font-semibold">Notes:</span> {booking.notes}
            </div>
          )}

          <Separator className="my-4" />

          {/* Action Buttons */}
          <div className="flex justify-start space-x-4">
            {canCancel(booking.status) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isCanceling}>
                    {isCanceling ? (
                      <>
                        Canceling <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        Cancel Booking <XCircle className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. Please enter a reason for
                      cancellation.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reason" className="text-right">
                        Reason
                      </Label>
                      <Input
                        id="reason"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isCanceling} onClick={handleCancelBooking}>
                      {isCanceling ? (
                        <>
                          Canceling <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        "Confirm Cancel"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {canComplete(booking.status) && (
              <Button variant="secondary" disabled={isCompleting} onClick={handleCompleteBooking}>
                {isCompleting ? (
                  <>
                    Completing <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Mark as Completed <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}

            {canDispute(booking.status) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isSubmittingDispute}>
                    {isSubmittingDispute ? (
                      <>
                        Submitting <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        Submit Dispute <AlertCircle className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Submit Dispute</AlertDialogTitle>
                    <AlertDialogDescription>
                      Please describe the reason for the dispute.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={disputeDescription}
                        onChange={(e) => setDisputeDescription(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isSubmittingDispute} onClick={handleSubmitDispute}>
                      {isSubmittingDispute ? (
                        <>
                          Submitting <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        "Confirm Dispute"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Additional Details (Mock Data) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
          <p className="text-gray-600">
            This section could include additional details about the booking, such as
            specific requirements, customer notes, or provider information.
          </p>
          <Separator className="my-4" />
          <div className="flex justify-start space-x-4">
            <Button variant="secondary">
              <Edit className="mr-2 h-4 w-4" />
              Edit Booking
            </Button>
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact Customer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
