
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/common/Button';
import { BarChart, LineChart, AreaChart, PieChart, ResponsiveContainer, XAxis, YAxis, Bar, Line, Area, Pie, Tooltip, Legend, Cell } from 'recharts';
import { Download, TrendingUp, Calendar, MapPin, User, Users, DollarSign, PieChart as PieChartIcon } from 'lucide-react';

const userEngagementData = [
  { month: 'Jan', customers: 120, providers: 45, bookings: 210 },
  { month: 'Feb', customers: 135, providers: 48, bookings: 240 },
  { month: 'Mar', customers: 155, providers: 52, bookings: 285 },
  { month: 'Apr', customers: 180, providers: 56, bookings: 310 },
  { month: 'May', customers: 205, providers: 60, bookings: 345 },
  { month: 'Jun', customers: 230, providers: 65, bookings: 390 },
];

const revenueData = [
  { month: 'Jan', totalRevenue: 25000, commissions: 5000 },
  { month: 'Feb', totalRevenue: 28000, commissions: 5600 },
  { month: 'Mar', totalRevenue: 32000, commissions: 6400 },
  { month: 'Apr', totalRevenue: 38000, commissions: 7600 },
  { month: 'May', totalRevenue: 45000, commissions: 9000 },
  { month: 'Jun', totalRevenue: 52000, commissions: 10400 },
];

const topCategoriesData = [
  { name: 'Home Services', value: 45 },
  { name: 'Errands', value: 25 },
  { name: 'Professional', value: 15 },
  { name: 'Freelance', value: 10 },
  { name: 'Transport', value: 5 },
];

const regionalData = [
  { name: 'Windhoek', bookings: 450, customers: 350, providers: 120 },
  { name: 'Swakopmund', bookings: 180, customers: 120, providers: 45 },
  { name: 'Walvis Bay', bookings: 160, customers: 110, providers: 40 },
  { name: 'Oshakati', bookings: 130, customers: 95, providers: 35 },
  { name: 'Rundu', bookings: 90, customers: 70, providers: 25 },
];

const topProvidersData = [
  { name: 'CleanHome Pro', bookings: 98, earnings: 24500, rating: 4.8 },
  { name: 'Plumb Perfect', bookings: 76, earnings: 19000, rating: 4.6 },
  { name: 'Swift Errands', bookings: 65, earnings: 13000, rating: 4.9 },
  { name: 'Elite Movers', bookings: 54, earnings: 13500, rating: 4.7 },
  { name: 'Tech Wizards', bookings: 48, earnings: 12000, rating: 4.5 },
];

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

const AdvancedAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('engagement');
  const [timeRange, setTimeRange] = useState('6m');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Advanced Analytics</CardTitle>
            <CardDescription>
              Comprehensive platform metrics and performance insights
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              className="p-2 border rounded-md text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
              <option value="all">All Time</option>
            </select>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="engagement" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="engagement">User Engagement</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
            <TabsTrigger value="providers">Top Providers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="engagement">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                        <h3 className="text-2xl font-bold">265</h3>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" /> +15% vs. previous period
                        </p>
                      </div>
                      <Users className="h-10 w-10 text-primary-foreground bg-primary rounded-full p-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Bookings</p>
                        <h3 className="text-2xl font-bold">390</h3>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" /> +12% vs. previous period
                        </p>
                      </div>
                      <Calendar className="h-10 w-10 text-primary-foreground bg-primary rounded-full p-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Providers</p>
                        <h3 className="text-2xl font-bold">65</h3>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" /> +8% vs. previous period
                        </p>
                      </div>
                      <User className="h-10 w-10 text-primary-foreground bg-primary rounded-full p-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">User Growth & Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={userEngagementData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="customers" stackId="1" stroke="#8884d8" fill="#8884d8" name="Customers" />
                        <Area type="monotone" dataKey="providers" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Providers" />
                        <Area type="monotone" dataKey="bookings" stackId="2" stroke="#ffc658" fill="#ffc658" name="Bookings" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <h3 className="text-2xl font-bold">N$220,000</h3>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" /> +18% vs. previous period
                        </p>
                      </div>
                      <DollarSign className="h-10 w-10 text-primary-foreground bg-primary rounded-full p-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Platform Commissions</p>
                        <h3 className="text-2xl font-bold">N$44,000</h3>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" /> +18% vs. previous period
                        </p>
                      </div>
                      <DollarSign className="h-10 w-10 text-primary-foreground bg-primary rounded-full p-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg. Booking Value</p>
                        <h3 className="text-2xl font-bold">N$564</h3>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" /> +5% vs. previous period
                        </p>
                      </div>
                      <DollarSign className="h-10 w-10 text-primary-foreground bg-primary rounded-full p-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Revenue & Commissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `N$${value}`} />
                        <Legend />
                        <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" name="Total Revenue" />
                        <Line type="monotone" dataKey="commissions" stroke="#82ca9d" name="Commissions" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="services">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Service Categories Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={topCategoriesData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {topCategoriesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Top 5 Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">SERVICE</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">BOOKINGS</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">REVENUE</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">AVG. RATING</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 px-4">Home Cleaning</td>
                            <td className="py-3 px-4">142</td>
                            <td className="py-3 px-4">N$35,500</td>
                            <td className="py-3 px-4">4.8</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4">Plumbing Services</td>
                            <td className="py-3 px-4">98</td>
                            <td className="py-3 px-4">N$29,400</td>
                            <td className="py-3 px-4">4.6</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4">Errand Running</td>
                            <td className="py-3 px-4">87</td>
                            <td className="py-3 px-4">N$13,050</td>
                            <td className="py-3 px-4">4.7</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4">Computer Repair</td>
                            <td className="py-3 px-4">65</td>
                            <td className="py-3 px-4">N$19,500</td>
                            <td className="py-3 px-4">4.5</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4">House Moving</td>
                            <td className="py-3 px-4">52</td>
                            <td className="py-3 px-4">N$26,000</td>
                            <td className="py-3 px-4">4.4</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="regional">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Regional Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={regionalData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
                        <Bar dataKey="customers" fill="#82ca9d" name="Customers" />
                        <Bar dataKey="providers" fill="#ffc658" name="Providers" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Regional Service Demand</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">REGION</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">TOP SERVICE</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">DEMAND GROWTH</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">PROVIDER RATIO</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4">Windhoek</td>
                          <td className="py-3 px-4">Home Cleaning</td>
                          <td className="py-3 px-4 text-green-600">+18%</td>
                          <td className="py-3 px-4">1:2.9</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Swakopmund</td>
                          <td className="py-3 px-4">Errand Running</td>
                          <td className="py-3 px-4 text-green-600">+22%</td>
                          <td className="py-3 px-4">1:2.7</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Walvis Bay</td>
                          <td className="py-3 px-4">Plumbing</td>
                          <td className="py-3 px-4 text-green-600">+15%</td>
                          <td className="py-3 px-4">1:2.8</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Oshakati</td>
                          <td className="py-3 px-4">House Moving</td>
                          <td className="py-3 px-4 text-green-600">+12%</td>
                          <td className="py-3 px-4">1:2.7</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4">Rundu</td>
                          <td className="py-3 px-4">Computer Repair</td>
                          <td className="py-3 px-4 text-green-600">+8%</td>
                          <td className="py-3 px-4">1:2.8</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="providers">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Performing Providers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">PROVIDER</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">BOOKINGS</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">EARNINGS</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">RATING</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">CUSTOMER RETENTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topProvidersData.map((provider, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">{provider.name}</td>
                            <td className="py-3 px-4">{provider.bookings}</td>
                            <td className="py-3 px-4">N${provider.earnings}</td>
                            <td className="py-3 px-4">{provider.rating}</td>
                            <td className="py-3 px-4">{75 + Math.floor(Math.random() * 15)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Provider Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topProvidersData}>
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="bookings" fill="#8884d8" name="Bookings" />
                        <Bar yAxisId="right" dataKey="earnings" fill="#82ca9d" name="Earnings (N$)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedAnalytics;
