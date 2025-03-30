
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, CreditCard, Star, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  providerName: string;
  providerAvatar?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  date: Date;
  time: string;
  duration: number;
  location: string;
  price: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  reviewed: boolean;
}

// Mock booking data
const mockBookings: Booking[] = [
  {
    id: '1',
    serviceId: '101',
    serviceName: 'Home Cleaning Service',
    providerName: 'CleanHome Pro',
    status: 'upcoming',
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    time: '10:00 AM',
    duration: 2,
    location: '123 Main St, Windhoek',
    price: 500,
    paymentStatus: 'paid',
    reviewed: false,
  },
  {
    id: '2',
    serviceId: '102',
    serviceName: 'Plumbing Repair',
    providerName: 'Plumb Perfect',
    status: 'upcoming',
    date: new Date(Date.now() + 86400000 * 5), // 5 days from now
    time: '2:00 PM',
    duration: 1,
    location: '456 Oak Avenue, Windhoek',
    price: 350,
    paymentStatus: 'pending',
    reviewed: false,
  },
  {
    id: '3',
    serviceId: '103',
    serviceName: 'Home Cleaning Service',
    providerName: 'CleanHome Pro',
    status: 'completed',
    date: new Date(Date.now() - 86400000 * 3), // 3 days ago
    time: '9:00 AM',
    duration: 3,
    location: '123 Main St, Windhoek',
    price: 750,
    paymentStatus: 'paid',
    reviewed: true,
  },
  {
    id: '4',
    serviceId: '104',
    serviceName: 'Errand Running',
    providerName: 'Swift Errands',
    status: 'completed',
    date: new Date(Date.now() - 86400000 * 10), // 10 days ago
    time: '3:00 PM',
    duration: 2,
    location: '789 Pine Road, Windhoek',
    price: 300,
    paymentStatus: 'paid',
    reviewed: false,
  },
  {
    id: '5',
    serviceId: '105',
    serviceName: 'House Painting',
    providerName: 'Perfect Paint',
    status: 'cancelled',
    date: new Date(Date.now() - 86400000 * 7), // 7 days ago
    time: '10:00 AM',
    duration: 6,
    location: '321 Elm Street, Windhoek',
    price: 1800,
    paymentStatus: 'refunded',
    reviewed: false,
  },
];

const BookingHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const filteredBookings = mockBookings.filter(booking => {
    if (activeTab === 'upcoming') return booking.status === 'upcoming';
    if (activeTab === 'completed') return booking.status === 'completed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: Booking['paymentStatus']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">My Bookings</h2>
          <p className="text-muted-foreground text-sm">Track and manage your service bookings</p>
        </div>
        
        <Button as="a" href="/dashboard/services">
          Book New Service
        </Button>
      </div>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full flex justify-start mb-4 bg-muted/50">
          <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">Upcoming</TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 sm:flex-none">Completed</TabsTrigger>
          <TabsTrigger value="cancelled" className="flex-1 sm:flex-none">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4 mt-2">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5 border-b">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="flex items-start space-x-4 mb-4 sm:mb-0">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {booking.providerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-lg">{booking.serviceName}</h3>
                          <p className="text-muted-foreground">{booking.providerName}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                        <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                          {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{formatDate(booking.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{booking.time} ({booking.duration} hr{booking.duration > 1 ? 's' : ''})</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{booking.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-medium">N${booking.price}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-5 pb-5 pt-0 border-t flex flex-wrap justify-end gap-2 mt-4">
                    {booking.status === 'upcoming' && (
                      <>
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          Cancel
                        </Button>
                      </>
                    )}
                    
                    {booking.status === 'completed' && !booking.reviewed && (
                      <Button size="sm">
                        <Star className="h-4 w-4 mr-2" /> Leave Review
                      </Button>
                    )}
                    
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" /> Contact
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="mt-4 text-lg font-medium">No {activeTab} bookings</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {activeTab === 'upcoming' 
                  ? 'You don\'t have any upcoming bookings. Browse services to book your first service.'
                  : `You don't have any ${activeTab} bookings.`
                }
              </p>
              {activeTab === 'upcoming' && (
                <Button as="a" href="/dashboard/services" className="mt-4">
                  Browse Services
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingHistory;
