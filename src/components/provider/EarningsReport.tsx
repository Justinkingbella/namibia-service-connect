
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DollarSign, FileText, Download, Calendar } from 'lucide-react';
import { ProviderEarnings } from '@/types/subscription';

interface EarningsReportProps {
  earnings?: ProviderEarnings[];
  isLoading?: boolean;
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
}

export const EarningsReport: React.FC<EarningsReportProps> = ({
  earnings = [],
  isLoading = false,
  dateRange = 'month',
  onDateRangeChange = () => {}
}) => {
  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.netEarnings, 0);
  const totalCommission = earnings.reduce((sum, earning) => sum + earning.commissionPaid, 0);
  const totalBookings = earnings.reduce((sum, earning) => sum + earning.totalBookings, 0);
  
  // Formatted earnings data for display
  const formattedEarnings = earnings.map(earning => ({
    ...earning,
    periodLabel: `${new Date(earning.periodStart).toLocaleDateString()} - ${new Date(earning.periodEnd).toLocaleDateString()}`,
    totalEarningsFormatted: formatCurrency(earning.totalEarnings),
    netEarningsFormatted: formatCurrency(earning.netEarnings),
    commissionPaidFormatted: formatCurrency(earning.commissionPaid),
    payoutDateFormatted: earning.payoutDate ? new Date(earning.payoutDate).toLocaleDateString() : 'Pending'
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Earnings Report</CardTitle>
            <CardDescription>View your earnings and payouts history</CardDescription>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Select value={dateRange} onValueChange={onDateRangeChange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded mt-6"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(totalEarnings)}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                      <p className="text-2xl font-bold mt-1">{totalBookings}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Platform Fees</p>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(totalCommission)}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="table">
              <TabsList className="mb-4">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="chart">Chart View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="table">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Bookings</TableHead>
                        <TableHead>Gross Earnings</TableHead>
                        <TableHead>Platform Fee</TableHead>
                        <TableHead>Net Earnings</TableHead>
                        <TableHead>Payout Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formattedEarnings.length > 0 ? (
                        formattedEarnings.map((earning) => (
                          <TableRow key={earning.id || earning.periodStart.toString()}>
                            <TableCell>{earning.periodLabel}</TableCell>
                            <TableCell>{earning.totalBookings}</TableCell>
                            <TableCell>{earning.totalEarningsFormatted}</TableCell>
                            <TableCell>{earning.commissionPaidFormatted}</TableCell>
                            <TableCell className="font-medium">{earning.netEarningsFormatted}</TableCell>
                            <TableCell>
                              <div className={`px-2 py-1 rounded-full text-xs inline-block font-medium
                                ${earning.payoutStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                                  earning.payoutStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-gray-100 text-gray-800'}
                              `}>
                                {earning.payoutStatus || 'Pending'}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            No earnings data available for the selected period
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="chart">
                <div className="h-80 flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Earnings chart will be shown here</p>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EarningsReport;
