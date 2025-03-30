
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Download, BarChart2, PieChart, TrendingUp, Users, DollarSign } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Mock data for charts
const userGrowthData = [
  { name: 'Jan', users: 500 },
  { name: 'Feb', users: 650 },
  { name: 'Mar', users: 850 },
  { name: 'Apr', users: 1100 },
  { name: 'May', users: 1350 },
  { name: 'Jun', users: 1500 },
  { name: 'Jul', users: 1750 },
  { name: 'Aug', users: 1950 },
  { name: 'Sep', users: 2200 },
  { name: 'Oct', users: 2400 },
  { name: 'Nov', users: 2600 },
  { name: 'Dec', users: 2800 },
];

const revenueData = [
  { name: 'Jan', revenue: 12000, providers: 25 },
  { name: 'Feb', revenue: 15000, providers: 28 },
  { name: 'Mar', revenue: 18000, providers: 32 },
  { name: 'Apr', revenue: 22000, providers: 38 },
  { name: 'May', revenue: 26000, providers: 42 },
  { name: 'Jun', revenue: 32000, providers: 48 },
  { name: 'Jul', revenue: 38000, providers: 53 },
  { name: 'Aug', revenue: 42000, providers: 58 },
  { name: 'Sep', revenue: 48000, providers: 65 },
  { name: 'Oct', revenue: 55000, providers: 72 },
  { name: 'Nov', revenue: 62000, providers: 78 },
  { name: 'Dec', revenue: 70000, providers: 85 },
];

const userTypeData = [
  { name: 'Customers', value: 2100 },
  { name: 'Providers', value: 450 },
  { name: 'Admin', value: 15 },
];

const categoryData = [
  { name: 'Home Services', value: 42 },
  { name: 'Professional', value: 28 },
  { name: 'Health', value: 15 },
  { name: 'Transport', value: 10 },
  { name: 'Errands', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const PlatformAnalytics = () => {
  const [period, setPeriod] = useState('year');
  const [year, setYear] = useState('2023');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>Comprehensive insights into platform performance</CardDescription>
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
                  <LineChart
                    data={userGrowthData}
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
                    <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="quarter" className="space-y-8">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Q1', revenue: 45000, users: 2000 },
                      { name: 'Q2', revenue: 80000, users: 2500 },
                      { name: 'Q3', revenue: 128000, users: 3200 },
                      { name: 'Q4', revenue: 187000, users: 3800 },
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
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue (N$)" />
                    <Bar yAxisId="right" dataKey="users" fill="#82ca9d" name="Users" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="year" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">User Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={userGrowthData}
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
                          <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Revenue Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={revenueData}
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
                          <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="providers" stroke="#82ca9d" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">User Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={userTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {userTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Service Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,565</div>
            <p className="text-xs text-muted-foreground">
              +18.2% from last month
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={userGrowthData.slice(-6)}
                  margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N$440,000</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData.slice(-6)}
                  margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <Area type="monotone" dataKey="revenue" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Providers
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">
              +8.7% from last month
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData.slice(-6)}
                  margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <Area type="monotone" dataKey="providers" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
