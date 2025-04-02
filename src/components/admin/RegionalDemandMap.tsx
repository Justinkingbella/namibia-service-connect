
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { MapPin, TrendingUp, Clock } from 'lucide-react';

// Mock data for regional demand
const regionalData = [
  { name: 'Windhoek', value: 65, growth: '+12%' },
  { name: 'Swakopmund', value: 45, growth: '+8%' },
  { name: 'Walvis Bay', value: 38, growth: '+5%' },
  { name: 'Otjiwarongo', value: 28, growth: '+15%' },
  { name: 'Keetmanshoop', value: 22, growth: '+3%' },
  { name: 'Oshakati', value: 18, growth: '+7%' },
  { name: 'Rundu', value: 15, growth: '+10%' },
  { name: 'Katima Mulilo', value: 12, growth: '+6%' },
];

// Mock data for service category demand
const categoryData = [
  { name: 'Home Services', value: 35, color: '#3b82f6' },
  { name: 'Transportation', value: 25, color: '#10b981' },
  { name: 'Professional', value: 20, color: '#f59e0b' },
  { name: 'Health & Wellness', value: 15, color: '#6366f1' },
  { name: 'Errands', value: 5, color: '#ec4899' },
];

// Mock data for demand by time
const timeData = [
  { name: '8-10 AM', value: 28 },
  { name: '10-12 PM', value: 35 },
  { name: '12-2 PM', value: 42 },
  { name: '2-4 PM', value: 38 },
  { name: '4-6 PM', value: 52 },
  { name: '6-8 PM', value: 45 },
  { name: '8-10 PM', value: 30 },
];

const RegionalDemandMap = () => {
  const [timeframe, setTimeframe] = useState('weekly');

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Regional Service Demand</CardTitle>
          <CardDescription>
            Analyze service demand across different regions of Namibia
          </CardDescription>
        </div>
        <Tabs defaultValue="weekly" value={timeframe} onValueChange={setTimeframe} className="w-[200px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Regional Chart */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Demand by Region</CardTitle>
              </div>
              <CardDescription>
                Service requests distribution across Namibian cities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={regionalData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip 
                      formatter={(value, name, props) => [`${value} requests`, props.payload.name]}
                      labelFormatter={() => 'Service Demand'}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                      {regionalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Chart */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Demand by Category</CardTitle>
              </div>
              <CardDescription>
                Service requests by category type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
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
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Time of Day Chart */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Demand by Time of Day</CardTitle>
              </div>
              <CardDescription>
                Service requests distribution throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionalDemandMap;
