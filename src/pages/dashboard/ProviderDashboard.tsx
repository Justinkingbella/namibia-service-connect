
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, ChevronRight, LineChart, Briefcase, AlertTriangle, CreditCard } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import ServiceManagement from '@/components/provider/ServiceManagement';
import ProviderEarningsCard from '@/components/provider/ProviderEarningsCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingCard } from '@/components/dashboard/BookingCard';
import { SettingsCard } from '@/components/dashboard/SettingsCard';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans:subscription_plan_id (*)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching subscription:', error);
      }
      
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for recent bookings
  const recentBookings = [
    {
      id: '1',
      customer: 'John Smith',
      service: 'Home Cleaning',
      date: 'Today, 14:30',
      amount: 250,
      status: 'confirmed'
    },
    {
      id: '2',
      customer: 'Sarah Johnson',
      service: 'Garden Maintenance',
      date: 'Tomorrow, 09:00',
      amount: 350,
      status: 'pending'
    },
    {
      id: '3',
      customer: 'Alex Williams',
      service: 'Home Cleaning',
      date: 'Aug 15, 11:30',
      amount: 250,
      status: 'completed'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Provider Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your services and monitor performance</p>
        </div>
        
        {!isLoading && !subscription && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Subscription Required</AlertTitle>
            <AlertDescription>
              You need to subscribe to a plan to offer services on our platform.
              <Button variant="outline" asChild className="ml-2">
                <Link to="/dashboard/provider/subscription">Subscribe Now</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Bookings"
            value="124"
            icon={Calendar}
            trend={{ value: 12, positive: true }}
            description="vs. last month"
          />
          <StatsCard
            title="Total Customers"
            value="57"
            icon={Users}
            trend={{ value: 5, positive: true }}
            description="vs. last month"
          />
          <StatsCard
            title="This Month"
            value="N$5,240"
            icon={DollarSign}
            trend={{ value: 8, positive: true }}
            description="vs. last month"
          />
          <StatsCard
            title="Service Rating"
            value="4.8/5"
            icon={LineChart}
            trend={{ value: 0.2, positive: true }}
            description="vs. last month"
          />
        </div>
        
        {/* Service Management Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Services</h2>
            <Button 
              as={Link} 
              to="/dashboard/services/create" 
              variant="outline"
              size="sm"
            >
              Create New Service
            </Button>
          </div>
          
          <ServiceManagement />
        </div>
        
        {/* Two column layout for bookings and earnings */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Recent Bookings */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Bookings</h2>
              <Button 
                as={Link} 
                to="/dashboard/bookings" 
                variant="ghost" 
                size="sm"
                className="flex items-center"
              >
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </div>
          
          {/* Earnings Summary */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Earnings Summary</h2>
            <ProviderEarningsCard />
            
            {!isLoading && subscription && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Current Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{subscription.subscription_plans.name}</div>
                    <Badge className="bg-primary">{subscription.subscription_plans.billing_cycle}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    N${subscription.subscription_plans.price}/{subscription.subscription_plans.billing_cycle}
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Credits</span>
                    <span className="text-sm font-medium">
                      250/{subscription.subscription_plans.credits}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${Math.min(250 / subscription.subscription_plans.credits * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Bookings</span>
                    <span className="text-sm font-medium">
                      12/{subscription.subscription_plans.max_bookings}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${Math.min(12 / subscription.subscription_plans.max_bookings * 100, 100)}%` }}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm"
                    as={Link}
                    to="/dashboard/provider/subscription"
                  >
                    Manage Subscription
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <SettingsCard
              title="Add New Service"
              description="Create a new service listing"
              icon={<Briefcase className="h-5 w-5" />}
              onClick={() => navigate('/dashboard/services/create')}
            />
            
            <SettingsCard
              title="Earnings Reports"
              description="View detailed revenue reports"
              icon={<LineChart className="h-5 w-5" />}
              onClick={() => navigate('/dashboard/provider/reports')}
            />
            
            <SettingsCard
              title="Manage Subscription"
              description="Change or upgrade your plan"
              icon={<CreditCard className="h-5 w-5" />}
              onClick={() => navigate('/dashboard/provider/subscription')}
            />
            
            <SettingsCard
              title="Payment Settings"
              description="Update payment information"
              icon={<DollarSign className="h-5 w-5" />}
              onClick={() => navigate('/dashboard/provider/payment-details')}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProviderDashboard;
