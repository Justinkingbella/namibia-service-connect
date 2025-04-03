
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { BookingStatus, PaymentStatus, Booking } from '@/types';
import { format } from 'date-fns';

// Mock booking data
const mockBookings: (Booking & { 
  serviceName: string;
  serviceImage: string;
  providerName?: string;
  customerName?: string;
  providerEmail?: string;
  customerEmail?: string;
  providerPhone?: string;
  customerPhone?: string;
  serviceAddress?: string;
})[] = [
  {
    id: '1',
    serviceId: '1',
    customerId: '1',
    providerId: '1',
    status: 'confirmed',
    date: new Date(),
    startTime: '14:00',
    endTime: '16:00',
    duration: 2,
    totalAmount: 500,
    commission: 50,
    paymentMethod: 'pay_today',
    paymentStatus: 'completed',
    notes: 'Please bring cleaning supplies. The house has 3 bedrooms and 2 bathrooms.',
    isUrgent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    serviceName: 'Home Cleaning Service',
    serviceImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    providerName: 'CleanHome Pro',
    customerName: 'Sarah Johnson',
    providerEmail: 'cleanhome@example.com',
    customerEmail: 'sarah@example.com',
    providerPhone: '+264 81 123 4567',
    customerPhone: '+264 81 234 5678',
    serviceAddress: '123 Independence Ave, Windhoek, Namibia'
  },
  {
    id: '2',
    serviceId: '2',
    customerId: '1',
    providerId: '2',
    status: 'pending',
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    startTime: '10:00',
    endTime: null,
    duration: null,
    totalAmount: 350,
    commission: 35,
    paymentMethod: 'e_wallet',
    paymentStatus: 'pending',
    notes: 'Urgent plumbing issue in the kitchen sink.',
    isUrgent: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    serviceName: 'Plumbing Repair',
    serviceImage: 'https://images.unsplash.com/photo-1573600073955-f15b3b6caab7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    providerName: 'Plumb Perfect',
    customerName: 'Sarah Johnson',
    providerEmail: 'plumber@example.com',
    customerEmail: 'sarah@example.com',
    providerPhone: '+264 81 345 6789',
    customerPhone: '+264 81 234 5678',
    serviceAddress: '123 Independence Ave, Windhoek, Namibia'
  }
];

const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case 'pending':
      return (
        <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full text-sm font-medium">
          <Clock className="h-4 w-4 mr-2" />
          Pending
        </div>
      );
    case 'confirmed':
      return (
        <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium">
          <CheckCircle className="h-4 w-4 mr-2" />
          Confirmed
        </div>
      );
    case 'in_progress':
      return (
        <div className="flex items-center text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full text-sm font-medium">
          <Clock className="h-4 w-4 mr-2" />
          In Progress
        </div>
      );
    case 'completed':
      return (
        <div className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium">
          <CheckCircle className="h-4 w-4 mr-2" />
          Completed
        </div>
      );
    case 'cancelled':
      return (
        <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full text-sm font-medium">
          <XCircle className="h-4 w-4 mr-2" />
          Cancelled
        </div>
      );
    case 'disputed':
      return (
        <div className="flex items-center text-red-600 bg-red-50 px-3 py-1.5 rounded-full text-sm font-medium">
          <AlertCircle className="h-4 w-4 mr-2" />
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
        <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full text-sm font-medium">
          <DollarSign className="h-4 w-4 mr-2" />
          Payment Pending
        </div>
      );
    case 'processing':
      return (
        <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium">
          <DollarSign className="h-4 w-4 mr-2" />
          Processing
        </div>
      );
    case 'completed':
      return (
        <div className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium">
          <DollarSign className="h-4 w-4 mr-2" />
          Paid
        </div>
      );
    case 'failed':
      return (
        <div className="flex items-center text-red-600 bg-red-50 px-3 py-1.5 rounded-full text-sm font-medium">
          <DollarSign className="h-4 w-4 mr-2" />
          Failed
        </div>
      );
    case 'refunded':
      return (
        <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full text-sm font-medium">
          <DollarSign className="h-4 w-4 mr-2" />
          Refunded
        </div>
      );
    default:
      return null;
  }
};

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState('');

  // Find the booking with the matching ID
  const booking = mockBookings.find(booking => booking.id === id);

  const isCustomer = user?.role === 'customer';
  const isProvider = user?.role === 'provider';
  const isAdmin = user?.role === 'admin';

  const canCancel = booking?.status === 'pending' || booking?.status === 'confirmed';
  const canComplete = isProvider && booking?.status === 'in_progress';
  const canStartService = isProvider && booking?.status === 'confirmed';
  const canDispute = (isCustomer || isProvider) && 
    (booking?.status === 'completed' || booking?.status === 'in_progress');
  
  const handleUpdateStatus = (newStatus: BookingStatus) => {
    // In a real app, this would make an API call to update the booking status
    toast({
      title: "Status Updated",
      description: `Booking status changed to ${newStatus}`,
    });

    // Redirect back to bookings page after a short delay
    setTimeout(() => navigate('/dashboard/bookings'), 1500);
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would send the message to the other party
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully",
    });
    setMessage('');
  };

  if (!booking) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
          <Button 
            onClick={() => navigate('/dashboard/bookings')}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/bookings')}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Booking #{booking.id}</h1>
            <p className="text-sm text-muted-foreground">
              Created on {format(new Date(booking.createdAt), 'PPP')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {getStatusBadge(booking.status)}
            {getPaymentBadge(booking.paymentStatus)}
            {booking.isUrgent && (
              <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full text-sm font-medium">
                <AlertCircle className="h-4 w-4 mr-2" />
                Urgent
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Service Details */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-xl font-medium mb-4">Service Details</h2>
              
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-lg overflow-hidden">
                  <img 
                    src={booking.serviceImage} 
                    alt={booking.serviceName}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="font-medium text-lg">{booking.serviceName}</h3>
                  <p className="text-muted-foreground">
                    Provider: {booking.providerName}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-muted-foreground">
                        {format(new Date(booking.date), 'PPPP')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-muted-foreground">
                        {booking.startTime} 
                        {booking.endTime ? ` - ${booking.endTime}` : ''}
                        {booking.duration ? ` (${booking.duration} hours)` : ''}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Service Location</p>
                      <p className="text-muted-foreground">
                        {booking.serviceAddress || 'Address not specified'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Payment</p>
                      <p className="text-muted-foreground">
                        N${booking.totalAmount.toFixed(2)} via {booking.paymentMethod.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {booking.notes && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className="font-medium mb-2">Special Instructions</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {booking.notes}
                  </p>
                </div>
              )}
            </div>
            
            {/* Contact Information */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-xl font-medium mb-4">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Customer</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <span>{booking.customerName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <span>{booking.customerEmail}</span>
                    </div>
                    
                    {booking.customerPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <span>{booking.customerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Service Provider</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <span>{booking.providerName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <span>{booking.providerEmail}</span>
                    </div>
                    
                    {booking.providerPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <span>{booking.providerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-xl font-medium mb-4">Messages</h2>
              
              <div className="min-h-[200px] max-h-[300px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg border">
                <div className="text-center text-gray-500 py-4">
                  No messages yet
                </div>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 p-3 border rounded-lg"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button 
                  onClick={handleSendMessage}
                  className="flex-shrink-0"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-xl font-medium mb-4">Actions</h2>
              
              <div className="space-y-3">
                {canCancel && (
                  <Button 
                    variant="primary" 
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => handleUpdateStatus('cancelled')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Booking
                  </Button>
                )}
                
                {canStartService && (
                  <Button 
                    className="w-full"
                    onClick={() => handleUpdateStatus('in_progress')}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Start Service
                  </Button>
                )}
                
                {canComplete && (
                  <Button 
                    className="w-full"
                    onClick={() => handleUpdateStatus('completed')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
                
                {canDispute && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleUpdateStatus('disputed')}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                )}
                
                {/* Admin-only actions */}
                {isAdmin && (
                  <>
                    <div className="pt-3 mt-3 border-t">
                      <h3 className="font-medium mb-3">Admin Actions</h3>
                      <div className="space-y-3">
                        <Button 
                          className="w-full"
                          onClick={() => handleUpdateStatus('confirmed')}
                        >
                          Confirm Booking
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            toast({
                              title: "Refund Processed",
                              description: "The customer has been refunded.",
                            });
                          }}
                        >
                          Process Refund
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Payment Details */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-xl font-medium mb-4">Payment Details</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Amount</span>
                  <span>N${booking.totalAmount.toFixed(2)}</span>
                </div>
                
                {isProvider && (
                  <div className="flex justify-between text-gray-600">
                    <span>Platform Fee</span>
                    <span>-N${booking.commission.toFixed(2)}</span>
                  </div>
                )}
                
                {isProvider && (
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Your Earnings</span>
                    <span>N${(booking.totalAmount - booking.commission).toFixed(2)}</span>
                  </div>
                )}
                
                {isAdmin && (
                  <div className="flex justify-between text-green-600 font-medium pt-2 border-t">
                    <span>Platform Commission</span>
                    <span>N${booking.commission.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="pt-2 mt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Payment Status</span>
                    {getPaymentBadge(booking.paymentStatus)}
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    Payment Method: <span className="font-medium capitalize">{booking.paymentMethod.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookingDetail;
