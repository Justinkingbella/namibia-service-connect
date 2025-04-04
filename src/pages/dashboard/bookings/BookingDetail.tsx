
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BookingData } from '@/types/booking';
import { toast } from 'sonner';
import { formatBookingStatus, formatCurrency, getStatusColor } from '@/lib/utils';
import BookingStatusUpdate from '@/components/bookings/BookingStatusUpdate';
import { ArrowLeft, Calendar, Clock, MapPin, User, CreditCard } from 'lucide-react';

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { userRole } = useAuth();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [serviceDetails, setServiceDetails] = useState<{ title: string; image: string } | null>(null);
  const [customerDetails, setCustomerDetails] = useState<{ firstName: string; lastName: string } | null>(null);
  const [providerDetails, setProviderDetails] = useState<{ businessName: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (!id) return;

        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .single();

        if (bookingError) throw bookingError;
        setBooking(bookingData);

        // Fetch service details
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('title, image')
          .eq('id', bookingData.service_id)
          .single();

        if (serviceError) throw serviceError;
        setServiceDetails(serviceData);

        // Fetch customer details
        const { data: customerData, error: customerError } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', bookingData.customer_id)
          .single();

        if (customerError) throw customerError;
        setCustomerDetails({
          firstName: customerData.first_name,
          lastName: customerData.last_name
        });

        // Fetch provider details
        const { data: providerData, error: providerError } = await supabase
          .from('service_providers')
          .select('business_name')
          .eq('id', bookingData.provider_id)
          .single();

        if (providerError) throw providerError;
        setProviderDetails(providerData);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string, notes?: string) => {
    if (!booking) return;

    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (notes) {
        if (userRole === 'provider') {
          updateData.provider_notes = notes;
        } else if (userRole === 'customer') {
          updateData.customer_notes = notes;
        }
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', booking.id);

      if (error) throw error;

      // Update local state
      setBooking(prev => prev ? { ...prev, ...updateData } : null);
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!booking || !serviceDetails) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Booking Not Found</h2>
          <p className="text-muted-foreground mt-2">The booking you're looking for doesn't exist or you don't have access to it.</p>
          <Button className="mt-4" asChild>
            <Link to="/dashboard/bookings">Back to Bookings</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/dashboard/bookings">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Booking Details</h1>
          </div>
          
          <Badge className={getStatusColor(booking.status)}>
            {formatBookingStatus(booking.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                {serviceDetails.image ? (
                  <img 
                    src={serviceDetails.image} 
                    alt={serviceDetails.title} 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium">{serviceDetails.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {providerDetails?.businessName || 'Service Provider'}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Date</h4>
                    <p>{new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Time</h4>
                    <p>{booking.start_time} {booking.end_time ? `- ${booking.end_time}` : ''}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p>Provider Location</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Customer</h4>
                    <p>{customerDetails?.firstName} {customerDetails?.lastName}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground">
                  {booking.notes || 'No additional notes.'}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span>{formatCurrency(booking.total_amount)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    <span>{booking.payment_method}</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className={
                    booking.payment_status === 'completed' ? 'bg-green-50 text-green-700' :
                    booking.payment_status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-700'
                  }>
                    {booking.payment_status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Update</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Current status: 
                  <Badge className={`ml-2 ${getStatusColor(booking.status)}`}>
                    {formatBookingStatus(booking.status)}
                  </Badge>
                </p>

                <BookingStatusUpdate
                  currentStatus={booking.status}
                  onUpdateStatus={handleUpdateStatus}
                  userRole={userRole}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookingDetail;
