
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Dispute } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, FileText, CheckCircle, XCircle, Clock, Plus, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    customerId: 'C1',
    providerId: 'P2',
    status: 'under_review',
    reason: 'Overcharge for services',
    description: 'I was charged more than the initially agreed amount without prior notification of any additional costs.',
    evidenceUrls: ['evidence2.jpg', 'evidence3.jpg'],
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000)
  },
];

// Mock bookings for the dropdown
const mockBookings = [
  { id: 'B1003', serviceName: 'Home Cleaning Service', providerName: 'CleanHome Pro', date: new Date(Date.now() - 86400000 * 1) },
  { id: 'B1004', serviceName: 'Plumbing Repair', providerName: 'Plumb Perfect', date: new Date(Date.now() - 86400000 * 3) },
  { id: 'B1005', serviceName: 'Lawn Mowing', providerName: 'Green Lawns', date: new Date(Date.now() - 86400000 * 5) },
];

// Mock service provider names for bookings
const mockBookingDetails = {
  'B1001': { serviceName: 'Home Cleaning Service', providerName: 'CleanHome Pro', date: new Date(Date.now() - 86400000 * 5) },
  'B1002': { serviceName: 'Deep Cleaning', providerName: 'SparkleClean', date: new Date(Date.now() - 86400000 * 7) },
};

// Mock fetch function
const fetchDisputes = async (): Promise<Dispute[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockDisputes;
};

const CustomerDisputesPage = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [isNewDisputeOpen, setIsNewDisputeOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  
  // New dispute form state
  const [newDispute, setNewDispute] = useState({
    bookingId: '',
    reason: '',
    description: '',
    evidenceFiles: [] as File[]
  });

  const { data: disputes = [], isLoading } = useQuery({
    queryKey: ['customerDisputes'],
    queryFn: fetchDisputes
  });

  const filteredDisputes = disputes.filter(d => {
    if (activeTab === 'open') return d.status === 'open';
    if (activeTab === 'under_review') return d.status === 'under_review';
    if (activeTab === 'resolved') return d.status === 'resolved' || d.status === 'declined';
    return true;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewDispute({
        ...newDispute,
        evidenceFiles: Array.from(e.target.files)
      });
    }
  };

  const handleSubmitNewDispute = () => {
    console.log('Submitting new dispute', newDispute);
    // In a real app, you would call an API to create a new dispute
    setIsNewDisputeOpen(false);
    // Reset form
    setNewDispute({
      bookingId: '',
      reason: '',
      description: '',
      evidenceFiles: []
    });
  };

  const handleSubmitResponse = () => {
    console.log('Submitting additional information:', responseText);
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">Payment Disputes</h1>
            <p className="text-muted-foreground">Submit and track disputes for your bookings.</p>
          </div>
          <Button onClick={() => setIsNewDisputeOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            File New Dispute
          </Button>
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
                <Button onClick={() => setIsNewDisputeOpen(true)} className="mt-4">
                  File New Dispute
                </Button>
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
                            {mockBookingDetails[dispute.bookingId]?.providerName || 'Unknown Provider'}
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
                          <span className="text-gray-500">Reason:</span>
                          <span className="truncate max-w-[150px]">{dispute.reason}</span>
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
                              {mockBookingDetails[selectedDispute.bookingId]?.providerName || 'Unknown Provider'}
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
                          <Label>Your Description</Label>
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
                        
                        {(selectedDispute.status === 'open' || selectedDispute.status === 'under_review') && (
                          <div className="pt-4">
                            <Label htmlFor="additional-info">Additional Information</Label>
                            <Textarea
                              id="additional-info"
                              placeholder="Provide any additional information about this dispute..."
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              className="mt-1 min-h-[120px]"
                            />
                          </div>
                        )}
                      </CardContent>
                      
                      {(selectedDispute.status === 'open' || selectedDispute.status === 'under_review') && (
                        <CardFooter className="flex justify-between border-t pt-4">
                          {selectedDispute.status === 'open' && (
                            <Button variant="outline" color="red">Cancel Dispute</Button>
                          )}
                          <Button 
                            onClick={handleSubmitResponse}
                            disabled={!responseText.trim()}
                          >
                            Submit Additional Information
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

      {/* New Dispute Dialog */}
      <Dialog open={isNewDisputeOpen} onOpenChange={setIsNewDisputeOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>File New Dispute</DialogTitle>
            <DialogDescription>
              Provide information about the issue with your booking to initiate a dispute.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="booking">Select Booking</Label>
              <Select 
                value={newDispute.bookingId} 
                onValueChange={(value) => setNewDispute({...newDispute, bookingId: value})}
              >
                <SelectTrigger id="booking">
                  <SelectValue placeholder="Select a booking" />
                </SelectTrigger>
                <SelectContent>
                  {mockBookings.map(booking => (
                    <SelectItem key={booking.id} value={booking.id}>
                      {booking.serviceName} - {booking.providerName} ({booking.date.toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="reason">Reason for Dispute</Label>
              <Input
                id="reason"
                placeholder="e.g., Service not completed, Quality issues, etc."
                value={newDispute.reason}
                onChange={(e) => setNewDispute({...newDispute, reason: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about the issue..."
                value={newDispute.description}
                onChange={(e) => setNewDispute({...newDispute, description: e.target.value})}
                className="min-h-[120px]"
              />
            </div>
            
            <div>
              <Label>Upload Evidence (Optional)</Label>
              <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, PDF (max 3 files, 2MB each)</p>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/png, image/jpeg, application/pdf"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
              {newDispute.evidenceFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{newDispute.evidenceFiles.length} file(s) selected</p>
                  <ul className="mt-1 text-xs text-gray-500">
                    {newDispute.evidenceFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDisputeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitNewDispute}>
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

// For TypeScript compatibility
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default CustomerDisputesPage;
