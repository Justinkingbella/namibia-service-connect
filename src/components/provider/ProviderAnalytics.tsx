
import React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for charts
const revenueData = [
  { name: 'Jan', amount: 2400 },
  { name: 'Feb', amount: 1398 },
  { name: 'Mar', amount: 9800 },
  { name: 'Apr', amount: 3908 },
  { name: 'May', amount: 4800 },
  { name: 'Jun', amount: 3800 },
  { name: 'Jul', amount: 5000 },
];

const bookingsData = [
  { name: 'Mon', bookings: 4 },
  { name: 'Tue', bookings: 7 },
  { name: 'Wed', bookings: 5 },
  { name: 'Thu', bookings: 6 },
  { name: 'Fri', bookings: 9 },
  { name: 'Sat', bookings: 11 },
  { name: 'Sun', bookings: 3 },
];

const categoryData = [
  { name: 'Home Cleaning', value: 45 },
  { name: 'Deep Cleaning', value: 28 },
  { name: 'Post-Construction', value: 12 },
];

const ProviderAnalytics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>
            Your revenue over the past 7 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`N$${value}`, 'Revenue']}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  name="Revenue" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Weekly Bookings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Bookings</CardTitle>
          <CardDescription>
            Number of bookings this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bookingsData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="bookings" 
                  name="Bookings" 
                  fill="#82ca9d" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Service Performance */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Service Performance</CardTitle>
          <CardDescription>
            Booking distribution by service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{
                  top: 20,
                  right: 30,
                  left: 120,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={110} />
                <Tooltip 
                  formatter={(value) => [`${value} bookings`, 'Total']}
                />
                <Bar 
                  dataKey="value" 
                  name="Bookings" 
                  fill="#8884d8" 
                  radius={[0, 4, 4, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderAnalytics;
