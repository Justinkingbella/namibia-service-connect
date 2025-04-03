
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Dispute } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileText, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data
const mockDisputes: Dispute[] = [
  {
    id: '1',
    bookingId: 'B1001',
    customerId: 'C1',
    providerId: 'P1',
    status: 'open',
    reason: 'Service not completed as described',
    description: 'The service was not completed according to the agreed scope. Several areas were left untouched.',
    evidenceUrls: ['evidence1.jpg'],
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 86400000 * 2)
  },
  {
    id: '2',
    bookingId: 'B1002',
    customerId: 'C2',
    providerId: 'P1',
    status: 'under_review',
    reason: 'Overcharge for services',
    description: 'I was charged more than the initially agreed amount without prior notification of any additional costs.',
    evidenceUrls: ['evidence2.jpg', 'evidence3.jpg'],
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000)
  },
  {
    id: '3',
    bookingId: 'B1003',
    customerId: 'C3',
    providerId: 'P1',
    status: 'resolved',
    reason: 'Service quality issues',
    description: 'The quality of the service was below standard. Had to hire another provider to fix the issues.',
    evidenceUrls: [],
    resolution: 'Partial refund processed.',
    createdAt: new Date(Date.now() - 86400000 * 10),
    updatedAt: new Date(Date.now() - 86400000 * 7)
  }
];

// Mock service names for bookings
const mockBookingDetails = {
  'B1001': { serviceName: 'Home Cleaning Service', date: new Date(Date.now() - 86400000 * 5) },
  'B1002': { serviceName: 'Deep Cleaning', date: new Date(Date.now() - 86400000 * 7) },
  'B1003': { serviceName: 'Post-Construction Cleaning', date: new Date(Date.now() - 86400000 * 12) }
};

// Mock customers
const mockCustomers = {
  'C1': { name: 'Sarah Johnson', avatar: null },
  'C2': { name: 'Michael Brown', avatar: null },
  'C3': { name: 'Emma Wilson', avatar: null }
};

// Mock fetch function
const fetchDisputes = async (): Promise<Dispute[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockDisputes;
};

const DisputesPage = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [responseText, setResponseText] = useState('');

  const { data: disputes = [], isLoading } = useQuery({
    queryKey: ['providerDisputes'],
    queryFn: fetchDisputes
  });

  const filteredDisputes = disputes.filter(d => {
    if (activeTab === 'open') return d.status === 'open';
    if (activeTab === 'under_review') return d.status === 'under_review';
    if (activeTab === 'resolved') return d.status === 'resolved' || d.status === 'declined';
    return true;
  });

  const handleSubmitResponse = () => {
    console.log('Submitting response:', responseText);
    // In a real app, you would call an API to submit the response
    setResponseText('');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'open':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'under_review':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const formatDisputeStatus = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payment Disputes</h1>
          <p className="text-muted-foreground">Manage and respond to customer disputes for your services.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="under_review">Under Review</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="all">All Disputes</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
                <AlertCircle className="h-10 w-10 mx-auto text-gray-400 animate-pulse" />
                <h3 className="mt-4 text-lg font-medium">Loading disputes...</h3>
              </div>
            ) : filteredDisputes.length === 0 ? (
              <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
                <CheckCircle className="h-10 w-10 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No disputes found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No {activeTab === 'all' ? '' : activeTab} disputes at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 space-y-4">
                  {filteredDisputes.map((dispute) => (
                    <div 
                      key={dispute.id}
                      className={cn(
                        "bg-white rounded-xl border p-4 cursor-pointer hover:border-primary/50 transition-colors",
                        selectedDispute?.id === dispute.id && "border-primary/50 shadow-sm"
                      )}
                      onClick={() => setSelectedDispute(dispute)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium">
                            {mockBookingDetails[dispute.bookingId]?.serviceName || 'Unknown Service'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Booking #{dispute.bookingId}
                          </div>
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                          getStatusBadgeClass(dispute.status)
                        )}>
                          {getStatusIcon(dispute.status)}
                          <span>
                            {formatDisputeStatus(dispute.status)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Customer:</span>
                          <span>{mockCustomers[dispute.customerId]?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Created:</span>
                          <span>{dispute.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="lg:col-span-2">
                  {selectedDispute ? (
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>Dispute Details</CardTitle>
                            <CardDescription>
                              {mockBookingDetails[selectedDispute.bookingId]?.serviceName || 'Unknown Service'} - 
                              Booking #{selectedDispute.bookingId}
                            </CardDescription>
                          </div>
                          <div className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                            getStatusBadgeClass(selectedDispute.status)
                          )}>
                            {getStatusIcon(selectedDispute.status)}
                            <span>
                              {formatDisputeStatus(selectedDispute.status)}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Reason for Dispute</Label>
                          <div className="mt-1 font-medium">{selectedDispute.reason}</div>
                        </div>
                        
                        <div>
                          <Label>Customer Description</Label>
                          <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                            {selectedDispute.description}
                          </div>
                        </div>
                        
                        {selectedDispute.evidenceUrls.length > 0 && (
                          <div>
                            <Label>Evidence Provided</Label>
                            <div className="mt-1 grid grid-cols-3 gap-2">
                              {selectedDispute.evidenceUrls.map((url, index) => (
                                <div key={index} className="h-20 bg-gray-100 rounded-md flex items-center justify-center">
                                  <p className="text-xs text-gray-500">(Evidence image)</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedDispute.resolution && (
                          <div>
                            <Label>Resolution</Label>
                            <div className="mt-1 p-3 bg-green-50 rounded-md text-sm">
                              {selectedDispute.resolution}
                            </div>
                          </div>
                        )}
                        
                        {selectedDispute.status === 'open' && (
                          <div className="pt-4">
                            <Label htmlFor="response">Your Response</Label>
                            <Textarea
                              id="response"
                              placeholder="Provide your response to this dispute..."
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              className="mt-1 min-h-[120px]"
                            />
                          </div>
                        )}
                      </CardContent>
                      
                      {selectedDispute.status === 'open' && (
                        <CardFooter className="flex justify-between border-t pt-4">
                          <Button variant="outline">Request Mediation</Button>
                          <Button 
                            onClick={handleSubmitResponse}
                            disabled={!responseText.trim()}
                          >
                            Submit Response
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  ) : (
                    <div className="bg-white rounded-xl border shadow-sm p-8 text-center h-full flex flex-col items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium">No dispute selected</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Select a dispute from the list to view details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// For TypeScript compatibility
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default DisputesPage;
