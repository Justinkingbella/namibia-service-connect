
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Download, BarChart, LineChart } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Mock data for the charts
const monthlyData = [
  { name: 'Jan', earnings: 3400, bookings: 28 },
  { name: 'Feb', earnings: 2800, bookings: 22 },
  { name: 'Mar', earnings: 3200, bookings: 25 },
  { name: 'Apr', earnings: 4100, bookings: 32 },
  { name: 'May', earnings: 4800, bookings: 39 },
  { name: 'Jun', earnings: 5400, bookings: 42 },
  { name: 'Jul', earnings: 4900, bookings: 38 },
  { name: 'Aug', earnings: 5200, bookings: 40 },
  { name: 'Sep', earnings: 5800, bookings: 45 },
  { name: 'Oct', earnings: 6200, bookings: 48 },
  { name: 'Nov', earnings: 6800, bookings: 53 },
  { name: 'Dec', earnings: 7100, bookings: 56 },
];

const serviceData = [
  { name: 'Home Cleaning', value: 11250 },
  { name: 'Deep Cleaning', value: 8400 },
  { name: 'Post-Construction', value: 6000 },
  { name: 'Office Cleaning', value: 4800 },
  { name: 'Window Cleaning', value: 2200 },
];

const RevenueReports = () => {
  const [period, setPeriod] = useState('year');
  const [year, setYear] = useState('2023');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Revenue Reports</CardTitle>
              <CardDescription>Analyze your earnings and booking trends</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={period} onValueChange={setPeriod} className="space-y-4">
            <TabsList>
              <TabsTrigger value="month">Monthly</TabsTrigger>
              <TabsTrigger value="quarter">Quarterly</TabsTrigger>
              <TabsTrigger value="year">Yearly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="month" className="space-y-8">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyData}
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
                    <Area type="monotone" dataKey="earnings" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="quarter" className="space-y-8">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={[
                      { name: 'Q1', earnings: 9400 },
                      { name: 'Q2', earnings: 14300 },
                      { name: 'Q3', earnings: 15900 },
                      { name: 'Q4', earnings: 20100 },
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="earnings" fill="#8884d8" name="Revenue (N$)" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="year" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Monthly Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={monthlyData}
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
                          <Area type="monotone" dataKey="earnings" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Revenue by Service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={serviceData}
                          layout="vertical"
                          margin={{
                            top: 5,
                            right: 30,
                            left: 40,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#82ca9d" name="Revenue (N$)" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Statistics</CardTitle>
            <CardDescription>Number of bookings per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#82ca9d" name="Bookings" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue Summary</CardTitle>
            <CardDescription>Quick overview of your earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">N$59,700</p>
                  <p className="text-xs text-green-600">+12% vs last year</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Average Per Service</p>
                  <p className="text-2xl font-bold">N$271</p>
                  <p className="text-xs text-green-600">+5% vs last year</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">220</p>
                  <p className="text-xs text-green-600">+18% vs last year</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Commission Paid</p>
                  <p className="text-2xl font-bold">N$5,970</p>
                  <p className="text-xs text-muted-foreground">10% of revenue</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RevenueReports;
