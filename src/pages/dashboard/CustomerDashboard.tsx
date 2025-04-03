
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, DollarSign, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ServiceCategory, PricingModel } from '@/types/service';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Add mock upcoming bookings
const upcomingBookings = [
  {
    id: '1',
    serviceName: 'House Cleaning',
    providerName: 'CleanCo Services',
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    status: 'confirmed'
  },
  {
    id: '2',
    serviceName: 'Lawn Mowing',
    providerName: 'Green Gardens',
    date: new Date(Date.now() + 86400000 * 5), // 5 days from now
    status: 'pending'
  }
];

// Fixing the mock service cards to include description
const serviceCards = [
  {
    id: '1',
    title: 'Home Cleaning',
    description: 'Professional home cleaning services',
    category: 'home' as ServiceCategory,
    pricingModel: 'hourly' as PricingModel,
    price: 25,
    providerName: 'CleanCo',
    providerId: 'prov1',
    rating: 4.8,
    reviewCount: 120,
    image: '/images/services/cleaning.jpg',
    location: 'Windhoek',
  },
  {
    id: '2',
    title: 'Furniture Assembly',
    description: 'Expert furniture assembly service',
    category: 'home' as ServiceCategory,
    pricingModel: 'fixed' as PricingModel,
    price: 100,
    providerName: 'BuildIt',
    providerId: 'prov2',
    rating: 4.6,
    reviewCount: 85,
    image: '/images/services/assembly.jpg',
    location: 'Windhoek',
  }
];

// Add mock recent bookings
const recentBookings = [
  {
    id: '3',
    serviceName: 'Plumbing Repair',
    providerName: 'Fix-It Plumbing',
    date: new Date(Date.now() - 86400000 * 3), // 3 days ago
    status: 'completed',
    rating: 5
  },
  {
    id: '4',
    serviceName: 'Window Cleaning',
    providerName: 'Clear View Services',
    date: new Date(Date.now() - 86400000 * 7), // 7 days ago
    status: 'completed',
    rating: 4
  }
];

const CustomerDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">4 pending bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Services</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Next service in 2 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N$2,350</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Upcoming Bookings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
            <Link to="/dashboard/bookings">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingBookings.map(booking => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{booking.serviceName}</h3>
                        <p className="text-sm text-muted-foreground">{booking.providerName}</p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{booking.date.toLocaleDateString()} at {booking.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <Link to={`/dashboard/bookings/${booking.id}`}>
                      <Button variant="outline" size="sm" className="w-full">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You have no upcoming bookings.</p>
                <Link to="/services">
                  <Button className="mt-4">Book a Service</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Recommended Services */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recommended for You</h2>
            <Link to="/services">
              <Button variant="outline" size="sm">View All Services</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceCards.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <div className="h-40 bg-gray-100">
                  {service.image && (
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                  <div className="flex items-center text-sm mb-2">
                    <span className="font-medium mr-1">
                      {service.pricingModel === 'hourly' 
                        ? `N$${service.price}/hr` 
                        : `N$${service.price}`}
                    </span>
                    <span className="text-muted-foreground">
                      {service.pricingModel === 'fixed' ? ' (fixed price)' : ''}
                    </span>
                  </div>
                  <div className="flex items-center text-sm mb-4">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{service.rating} ({service.reviewCount} reviews)</span>
                  </div>
                  <Link to={`/services/${service.id}`}>
                    <Button variant="outline" size="sm" className="w-full">View Service</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Recent Bookings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Bookings</h2>
            <Link to="/dashboard/bookings">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          {recentBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentBookings.map(booking => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{booking.serviceName}</h3>
                        <p className="text-sm text-muted-foreground">{booking.providerName}</p>
                      </div>
                      <div className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                        Completed
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{booking.date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      <span>You rated this service {booking.rating}/5</span>
                    </div>
                    <Link to={`/dashboard/bookings/${booking.id}`}>
                      <Button variant="outline" size="sm" className="w-full">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You have no recent bookings.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
