
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileSummary from '@/components/dashboard/ProfileSummary';

const CustomerDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <ProfileSummary />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">No bookings found</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Saved Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">No saved services</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Loyalty Points</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Earn points with bookings</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
