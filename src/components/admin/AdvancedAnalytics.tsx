
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/common/Button';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, TrendingUp, Users, CreditCard, Calendar } from 'lucide-react';

// Mock data for platform analytics
const platformData = [
  { name: 'Jan', users: 120, bookings: 80, revenue: 2400, providers: 45 },
  { name: 'Feb', users: 140, bookings: 95, revenue: 3000, providers: 50 },
  { name: 'Mar', users: 170, bookings: 110, revenue: 3500, providers: 57 },
  { name: 'Apr', users: 200, bookings: 140, revenue: 4200, providers: 65 },
  { name: 'May', users: 220, bookings: 160, revenue: 4800, providers: 72 },
  { name: 'Jun', users: 250, bookings: 180, revenue: 5500, providers: 80 },
  { name: 'Jul', users: 280, bookings: 200, revenue: 6200, providers: 87 },
  { name: 'Aug', users: 310, bookings: 225, revenue: 6800, providers: 93 },
  { name: 'Sep', users: 330, bookings: 240, revenue: 7200, providers: 98 },
  { name: 'Oct', users: 350, bookings: 260, revenue: 7800, providers: 105 },
  { name: 'Nov', users: 370, bookings: 275, revenue: 8300, providers: 112 },
  { name: 'Dec', users: 400, bookings: 300, revenue: 9000, providers: 120 },
];

// Mock data for key metrics
const keyMetrics = [
  { 
    title: 'Total Users', 
    value: '4,320', 
    change: '+12.5%', 
    trend: 'up',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-blue-500'
  },
  { 
    title: 'Active Providers', 
    value: '120', 
    change: '+8.3%', 
    trend: 'up',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-green-500'
  },
  { 
    title: 'Total Revenue', 
    value: 'N$85,400', 
    change: '+15.2%', 
    trend: 'up',
    icon: <CreditCard className="h-5 w-5" />,
    color: 'bg-purple-500'
  },
  { 
    title: 'Bookings', 
    value: '2,150', 
    change: '+10.7%', 
    trend: 'up',
    icon: <Calendar className="h-5 w-5" />,
    color: 'bg-orange-500'
  },
];

const AdvancedAnalytics = () => {
  const [timeframe, setTimeframe] = useState<string>('yearly');
  const [chartView, setChartView] = useState<string>('revenue');

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>
            Comprehensive analytics and key metrics overview
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <Tabs defaultValue="yearly" value={timeframe} onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {keyMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                    <div className="flex items-center mt-1">
                      <TrendingUp className={`h-4 w-4 mr-1 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={`text-xs ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {metric.change} from last period
                      </span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-full ${metric.color}`}>
                    {React.cloneElement(metric.icon as React.ReactElement, { className: "h-5 w-5 text-white" })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Tabs */}
        <Tabs defaultValue="revenue" value={chartView} onValueChange={setChartView}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="revenue" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Revenue Growth</CardTitle>
                <CardDescription>
                  Platform revenue in Namibian Dollars (N$)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={platformData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`N$${value}`, 'Revenue']} />
                      <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">User Growth</CardTitle>
                <CardDescription>
                  Total platform users over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={platformData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Booking Activity</CardTitle>
                <CardDescription>
                  Total bookings processed over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={platformData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="providers" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Service Provider Growth</CardTitle>
                <CardDescription>
                  Active service providers on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={platformData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="providers" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedAnalytics;
