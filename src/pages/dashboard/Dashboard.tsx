
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Users, Calendar, CreditCard, TrendingUp, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const renderAdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              1,258
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              12% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Providers</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              284
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              8% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Bookings</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              3,879
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              15% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              N$ 42,589
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              23% from last month
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {item % 2 === 0 ? <Users size={16} /> : <Calendar size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {item % 2 === 0 
                        ? 'New service provider joined' 
                        : 'New booking completed'}
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
            <CardDescription>Most booked services this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Home Cleaning', 'Plumbing Repair', 'Electrical Work', 'Tutoring', 'Courier Delivery'].map((service, index) => (
                <div key={service} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                      <span className="font-medium text-primary">{index + 1}</span>
                    </div>
                    <span>{service}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                    <span>{Math.floor(Math.random() * 100) + 10}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderProviderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Earnings</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              N$ 4,258
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              8% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Bookings</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              32
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              12% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Rating</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              4.8/5
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Based on 48 reviews
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Bookings</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              5
              <Clock className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-amber-600 flex items-center">
              <ArrowDown className="h-4 w-4 mr-1" />
              3 need confirmation
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Bookings scheduled for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Home Cleaning', customer: 'John Smith', date: 'Today, 2:00 PM' },
                { name: 'Plumbing Repair', customer: 'Maria Garcia', date: 'Tomorrow, 10:00 AM' },
                { name: 'Electrical Work', customer: 'David Wilson', date: 'Apr 15, 3:30 PM' }
              ].map((booking, index) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-medium">{booking.name}</p>
                    <p className="text-sm text-muted-foreground">Customer: {booking.customer}</p>
                  </div>
                  <div className="text-sm font-medium">{booking.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>Feedback from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Emma Thompson', rating: 5, comment: 'Excellent service! Very professional and prompt.' },
                { name: 'Michael Brown', rating: 4, comment: 'Good work, would recommend to others.' },
                { name: 'Sophia Martinez', rating: 5, comment: 'Very satisfied with the quality of service.' }
              ].map((review, index) => (
                <div key={index} className="pb-4 border-b last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{review.name}</p>
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <svg key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderCustomerDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Bookings</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              2
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              1 scheduled for today
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Services</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              12
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              3 pending reviews
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Favorite Providers</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              5
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              3 new services available
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Services</CardTitle>
            <CardDescription>Your scheduled services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Home Cleaning', provider: 'Namibia Cleaners Ltd', date: 'Today, 2:00 PM', status: 'Confirmed' },
                { name: 'Plumbing Repair', provider: 'WaterWorks Plumbing', date: 'Apr 15, 10:00 AM', status: 'Confirmed' }
              ].map((booking, index) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-medium">{booking.name}</p>
                    <p className="text-sm text-muted-foreground">Provider: {booking.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{booking.date}</p>
                    <p className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-block">{booking.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recommended Services</CardTitle>
            <CardDescription>Based on your booking history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Garden Maintenance', provider: 'Green Fingers Ltd', rating: 4.8 },
                { name: 'Electrical Work', provider: 'PowerSafe Electric', rating: 4.9 },
                { name: 'House Painting', provider: 'Fresh Coat Painters', rating: 4.7 }
              ].map((service, index) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.provider}</p>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium">{service.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  // Render dashboard based on user role
  const renderDashboardContent = () => {
    if (user?.role === 'admin') {
      return renderAdminDashboard();
    } else if (user?.role === 'provider') {
      return renderProviderDashboard();
    } else {
      return renderCustomerDashboard();
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">
          {user?.role === 'admin' 
            ? 'View platform statistics and manage services' 
            : user?.role === 'provider'
              ? 'Track your bookings and earnings'
              : 'Find and book services in Namibia'}
        </p>
      </div>
      
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
