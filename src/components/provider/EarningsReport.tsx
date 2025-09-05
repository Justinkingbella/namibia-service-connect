import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProviderEarnings } from "@/types/subscription";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import { CircleDollarSign, Calendar, Clock, TrendingUp } from 'lucide-react';
import { CardFooter } from '@/components/ui/card';

// Mock data for the earnings report
const MOCK_EARNINGS: ProviderEarnings = {
  totalEarnings: 15750,
  monthToDateEarnings: 3250,
  weekToDateEarnings: 750,
  pendingPayouts: 1200,
  completedBookings: 42,
  subscriptionCost: 299,
  subscriptionStatus: 'active',
  planName: 'Standard',
  nextPaymentDate: '2023-05-15',
  transactions: [
    {
      id: '1',
      date: '2023-04-12',
      amount: 450,
      description: 'Home Cleaning Service',
      status: 'completed',
    },
    {
      id: '2',
      date: '2023-04-10',
      amount: 300,
      description: 'Garden Maintenance',
      status: 'completed',
    },
    {
      id: '3',
      date: '2023-04-08',
      amount: 550,
      description: 'Plumbing Repair',
      status: 'pending',
    },
  ],
  monthlyBreakdown: [
    { month: 'Jan', earnings: 2100 },
    { month: 'Feb', earnings: 2400 },
    { month: 'Mar', earnings: 3200 },
    { month: 'Apr', earnings: 3250 },
    { month: 'May', earnings: 0 },
    { month: 'Jun', earnings: 0 },
    { month: 'Jul', earnings: 0 },
    { month: 'Aug', earnings: 0 },
    { month: 'Sep', earnings: 0 },
    { month: 'Oct', earnings: 0 },
    { month: 'Nov', earnings: 0 },
    { month: 'Dec', earnings: 0 },
  ],
};

interface EarningsReportProps {
  providerId?: string;
}

const EarningsReport: React.FC<EarningsReportProps> = ({ providerId }) => {
  const [earnings, setEarnings] = useState<ProviderEarnings | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setIsLoading(true);
        // In a real app, we would fetch from an API
        // For now, simulate a delay and use mock data
        await new Promise((resolve) => setTimeout(resolve, 800));
        setEarnings(MOCK_EARNINGS);
      } catch (error) {
        console.error('Failed to load earnings data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, [providerId, timeframe]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NA', { style: 'currency', currency: 'NAD' }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!earnings) {
    return <div>No earnings data available.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earnings.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Month to Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earnings.monthToDateEarnings)}</div>
            <p className="text-xs text-muted-foreground">This month's earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earnings.pendingPayouts)}</div>
            <p className="text-xs text-muted-foreground">To be paid out</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnings.completedBookings}</div>
            <p className="text-xs text-muted-foreground">Total completed bookings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
          <CardDescription>Your earnings breakdown over time</CardDescription>
          <div className="flex space-x-2 mt-2">
            <Button
              variant={timeframe === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe('week')}
            >
              Week
            </Button>
            <Button
              variant={timeframe === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe('month')}
            >
              Month
            </Button>
            <Button
              variant={timeframe === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe('year')}
            >
              Year
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earnings.monthlyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `N$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`N$${value}`, 'Earnings']}
                  labelFormatter={(label) => `${label} 2023`}
                />
                <Legend />
                <Bar dataKey="earnings" name="Earnings" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your most recent earnings transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {earnings.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('en-NA')}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`text-sm px-2 py-1 rounded-full ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </div>
                  <div className="font-bold">{formatCurrency(transaction.amount)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View All Transactions</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
          <CardDescription>Your current subscription information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Plan</div>
                <div className="font-medium">{earnings.planName}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className={`font-medium ${
                  earnings.subscriptionStatus === 'active' ? 'text-green-600' : 
                  earnings.subscriptionStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {earnings.subscriptionStatus.charAt(0).toUpperCase() + earnings.subscriptionStatus.slice(1)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Monthly Cost</div>
                <div className="font-medium">{formatCurrency(earnings.subscriptionCost)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Next Payment</div>
                <div className="font-medium">
                  {earnings.nextPaymentDate ? new Date(earnings.nextPaymentDate).toLocaleDateString('en-NA') : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">Manage Subscription</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EarningsReport;
