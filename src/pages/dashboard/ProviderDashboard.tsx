
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ProfileSummary } from '@/components/dashboard/ProfileSummary';
import { DisputeSummary } from '@/components/dashboard/DisputeSummary';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Briefcase, DollarSign, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/container';

const ProviderDashboard = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Please Sign In</h2>
            <p className="text-muted-foreground mb-4">You need to sign in to access your dashboard</p>
            <Button asChild>
              <Link to="/auth/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <Container>
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Provider Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.firstName}! Here's an overview of your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Total bookings received</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$0.00</div>
                <p className="text-xs text-muted-foreground">Total earnings</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Unique customers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Services</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Active services</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileSummary />
            <DisputeSummary />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Performance</CardTitle>
                <CardDescription>How your services are performing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground mb-4">You don't have any services listed yet</p>
                  <Button asChild>
                    <Link to="/dashboard/provider/services/create">Create a Service</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default ProviderDashboard;
