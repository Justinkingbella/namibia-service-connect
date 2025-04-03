import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Download, Filter, RefreshCw } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { fetchProviderEarnings, generateEarningsReport } from '@/services/paymentService';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { DateRange } from 'react-day-picker';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function EarningsReport() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Get provider earnings
  const { data: earnings, isLoading, refetch } = useQuery({
    queryKey: ['providerEarnings', user?.id],
    queryFn: () => fetchProviderEarnings(user?.id || ''),
    enabled: !!user?.id
  });

  // Generate a new earnings report
  const handleGenerateReport = async () => {
    if (!user?.id || !dateRange?.from || !dateRange?.to) return;
    
    setIsGenerating(true);
    try {
      await generateEarningsReport(
        user.id,
        dateRange.from.toISOString().split('T')[0],
        dateRange.to.toISOString().split('T')[0]
      );
      refetch();
    } finally {
      setIsGenerating(false);
    }
  };

  // Export report to CSV
  const handleExportReport = (earning: ProviderEarnings) => {
    const headers = [
      'Period Start',
      'Period End',
      'Total Earnings',
      'Total Bookings',
      'Commission Paid',
      'Net Earnings',
      'Status'
    ];

    const data = [
      format(new Date(earning.periodStart), 'yyyy-MM-dd'),
      format(new Date(earning.periodEnd), 'yyyy-MM-dd'),
      earning.totalEarnings.toFixed(2),
      earning.totalBookings.toString(),
      earning.commissionPaid.toFixed(2),
      earning.netEarnings.toFixed(2),
      earning.payoutStatus
    ];

    const csvContent = [
      headers.join(','),
      data.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `earnings-report-${format(new Date(earning.periodStart), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Completed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Earnings Reports</CardTitle>
              <CardDescription>View your earnings and generate reports</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Select date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <Button 
                variant="default" 
                onClick={handleGenerateReport} 
                disabled={isGenerating || !dateRange?.from || !dateRange?.to}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>Generate Report</>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : earnings && earnings.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-7 gap-2 p-4 text-sm font-medium border-b bg-muted/50">
                <div>Period</div>
                <div>Bookings</div>
                <div>Total Earnings</div>
                <div>Commission</div>
                <div>Net Earnings</div>
                <div>Status</div>
                <div></div>
              </div>
              <div className="divide-y">
                {earnings.map((earning) => (
                  <div key={earning.id} className="grid grid-cols-7 gap-2 p-4 text-sm items-center">
                    <div className="font-medium">
                      {format(new Date(earning.periodStart), 'MMM d')} - {format(new Date(earning.periodEnd), 'MMM d, yyyy')}
                    </div>
                    <div>{earning.totalBookings}</div>
                    <div>N${earning.totalEarnings.toFixed(2)}</div>
                    <div>N${earning.commissionPaid.toFixed(2)}</div>
                    <div className="font-medium">N${earning.netEarnings.toFixed(2)}</div>
                    <div>{getStatusBadge(earning.payoutStatus)}</div>
                    <div className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleExportReport(earning)}
                        className="h-8 px-2"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Alert>
              <AlertTitle>No earnings reports found</AlertTitle>
              <AlertDescription>
                Generate a report to see your earnings for a specific period.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
