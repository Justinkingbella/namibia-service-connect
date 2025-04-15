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
import { BookingData, BookingStatus } from '@/types/booking';
import { toast } from 'sonner';
import { formatBookingStatus, formatCurrency, getStatusColor } from '@/lib/utils';
import BookingStatusUpdate from '@/components/bookings/BookingStatusUpdate';
import { ArrowLeft, Calendar, Clock, MapPin, User, CreditCard } from 'lucide-react';

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { userRole } = useAuth();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [service, setService] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          const bookingData: BookingData = {
            id: data.id,
            service_id: data.service_id,
            customer_id: data.customer_id,
            provider_id: data.provider_id,
            date: data.date,
            start_time: data.start_time,
            end_time: data.end_time,
            status: data.status as BookingStatus,
            notes: data.notes,
            customer_notes: data.customer_notes,
            provider_notes: data.provider_notes,
            total_amount: data.total_amount,
            commission: data.commission,
            payment_status: data.payment_status,
            payment_method: data.payment_method,
            payment_receipt: data.payment_receipt,
            is_urgent: data.is_urgent,
            created_at: data.created_at,
            updated_at: data.updated_at,
            cancellation_date: data.cancellation_date,
            cancellation_reason: data.cancellation_reason,
            cancelled_by: data.cancelled_by,
            refund_amount: data.refund_amount,
            rating: data.rating,
            feedback: data.feedback,
          };
          
          setBooking(bookingData);
          
          // Fetch provider details
          const { data: providerData } = await supabase
            .from('service_providers')
            .select('*')
            .eq('id', data.provider_id)
            .single();
            
          if (providerData) {
            setProvider({ businessName: providerData.business_name });
          }
          
          // Fetch service details
          const { data: serviceData } = await supabase
            .from('services')
            .select('*')
            .eq('id', data.service_id)
            .single();
            
          if (serviceData) {
            setService(serviceData);
          }
          
          // Fetch customer details
          const { data: customerData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.customer_id)
            .single();
            
          if (customerData) {
            const fullName = `${customerData.first_name || ''} ${customerData.last_name || ''}`.trim();
            setCustomer({
              name: fullName || 'Customer',
              email: customerData.email || '',
              phone: customerData.phone_number || ''
            });
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading booking:', error);
        setLoading(false);
      }
    };

    if (id) {
      loadBookingData();
    }
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

  if (!booking || !service) {
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
                {service.image ? (
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {provider?.businessName || 'Service Provider'}
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
                    <p>{customer.name}</p>
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
