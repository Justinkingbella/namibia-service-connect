
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Calendar, Clock, Check, X, MessageSquare, Home, MapPin, User, Bookmark, DollarSign, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatBookingStatus, formatCurrency, getStatusColor } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { BookingStatusUpdate } from '@/components/bookings/BookingStatusUpdate';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookingData } from '@/types/booking';
import { toast } from 'sonner';

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [booking, setBooking] = useState<any | null>(null);
  const [service, setService] = useState<any | null>(null);
  const [provider, setProvider] = useState<any | null>(null);
  const [customer, setCustomer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        
        // Fetch booking
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*, profiles!inner(*)')
          .eq('id', id)
          .single();
        
        if (bookingError) throw bookingError;
        
        // Check permission - user should be the customer, provider, or admin
        if (userRole !== 'admin' && 
            bookingData.customer_id !== user.id && 
            bookingData.provider_id !== user.id) {
          setError('You do not have permission to view this booking');
          setLoading(false);
          return;
        }
        
        setBooking(bookingData);
        
        // Set notes based on user role
        if (userRole === 'customer' || user.id === bookingData.customer_id) {
          setNotes(bookingData.customer_notes || '');
        } else if (userRole === 'provider' || user.id === bookingData.provider_id) {
          setNotes(bookingData.provider_notes || '');
        }
        
        // Fetch service details
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('*')
          .eq('id', bookingData.service_id)
          .single();
          
        if (!serviceError) {
          setService(serviceData);
        }
        
        // Fetch provider details
        const { data: providerData, error: providerError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', bookingData.provider_id)
          .single();
          
        if (!providerError) {
          setProvider(providerData);
        }
        
        // Fetch customer details
        const { data: customerData, error: customerError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', bookingData.customer_id)
          .single();
          
        if (!customerError) {
          setCustomer(customerData);
        }
        
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [id, user, userRole]);

  const saveNotes = async () => {
    if (!booking || !user) return;
    
    try {
      setSavingNotes(true);
      
      const updateData: any = {};
      
      // Set the appropriate notes field based on user role
      if (userRole === 'customer' || user.id === booking.customer_id) {
        updateData.customer_notes = notes;
      } else if (userRole === 'provider' || user.id === booking.provider_id) {
        updateData.provider_notes = notes;
      }
      
      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', booking.id);
        
      if (error) throw error;
      
      toast.success('Notes saved successfully');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !booking) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Booking not found'}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate(-1)} className="mt-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/dashboard/bookings">Bookings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Details</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <p className="text-muted-foreground">
              {service?.title && `Service: ${service.title}`}
              {provider && ` • Provider: ${provider.first_name} ${provider.last_name}`}
            </p>
          </div>
          
          <Badge className={`${getStatusColor(booking.status)} px-3 py-1`}>
            {formatBookingStatus(booking.status)}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Booking Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Information</CardTitle>
                <CardDescription>Details about this booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                    <p className="flex items-center mt-1">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Time</h3>
                    <p className="flex items-center mt-1">
                      <Clock className="mr-2 h-4 w-4 text-primary" />
                      {booking.start_time} {booking.end_time && `- ${booking.end_time}`}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Amount</h3>
                    <p className="flex items-center mt-1">
                      <DollarSign className="mr-2 h-4 w-4 text-primary" />
                      {formatCurrency(booking.total_amount)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Payment Status</h3>
                    <p className="flex items-center mt-1">
                      {booking.payment_status === 'paid' ? (
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                      ) : (
                        <X className="mr-2 h-4 w-4 text-red-500" />
                      )}
                      {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                    </p>
                  </div>
                </div>

                {/* Additional booking details */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                  <Textarea
                    placeholder="Add notes about this booking..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                  <Button 
                    onClick={saveNotes} 
                    className="mt-2"
                    disabled={savingNotes}
                  >
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </Button>
                </div>
                
                {/* Service details if available */}
                {service && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Service Details</h3>
                    <div className="flex items-start space-x-4">
                      {service.image && (
                        <img 
                          src={service.image} 
                          alt={service.title} 
                          className="w-16 h-16 object-cover rounded" 
                        />
                      )}
                      <div>
                        <h4 className="font-medium">{service.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                        <p className="text-sm mt-1">
                          <span className="font-medium">Price:</span> {formatCurrency(service.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-6">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/dashboard/bookings')}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Bookings
                  </Button>
                  
                  {/* Action buttons based on role and status */}
                  {userRole === 'provider' && booking.status === 'pending' && (
                    <BookingStatusUpdate 
                      bookingId={booking.id} 
                      currentStatus={booking.status}
                      onUpdate={() => {
                        // Refresh booking data
                        window.location.reload();
                      }}
                    />
                  )}
                  
                  {/* Message button */}
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            {/* Add additional cards for reviews, dispute options, etc. */}
          </div>
          
          {/* Right column - Sidebar */}
          <div className="space-y-6">
            {/* Provider Info */}
            {provider && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Provider Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{provider.first_name} {provider.last_name}</p>
                      <p className="text-sm text-muted-foreground">Service Provider</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {provider.phone_number && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{provider.phone_number}</span>
                      </div>
                    )}
                    
                    {provider.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{provider.email}</span>
                      </div>
                    )}
                    
                    {provider.address && (
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{provider.address}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Customer Info */}
            {customer && userRole !== 'customer' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{customer.first_name} {customer.last_name}</p>
                      <p className="text-sm text-muted-foreground">Customer</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {customer.phone_number && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{customer.phone_number}</span>
                      </div>
                    )}
                    
                    {customer.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Booking Timeline / Status History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Booking Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-4 mt-1 bg-green-500 rounded-full p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Booking Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.created_at).toLocaleDateString()} at {new Date(booking.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Add other status updates based on booking history */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookingDetail;
