
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Clock, CheckCircle, Search, FileUp, XCircle } from 'lucide-react';
import { Dispute, Booking } from '@/types/booking';
import { toast } from 'sonner';

// Mock data for customer's bookings
const mockBookings: Booking[] = [
  {
    id: 'booking1234567',
    serviceId: 'service1',
    customerId: 'customer1',
    providerId: 'provider1',
    status: 'completed',
    date: new Date('2023-05-15'),
    startTime: '10:00',
    endTime: '12:00',
    duration: 2,
    totalAmount: 350.00,
    commission: 35.00,
    paymentMethod: 'e_wallet',
    paymentStatus: 'completed',
    notes: null,
    isUrgent: false,
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-15'),
    serviceName: 'House Cleaning',
    serviceImage: '/placeholder.svg'
  },
  {
    id: 'booking7654321',
    serviceId: 'service2',
    customerId: 'customer1',
    providerId: 'provider2',
    status: 'completed',
    date: new Date('2023-05-14'),
    startTime: '14:00',
    endTime: '15:00',
    duration: 1,
    totalAmount: 200.00,
    commission: 20.00,
    paymentMethod: 'cash',
    paymentStatus: 'completed',
    notes: null,
    isUrgent: false,
    createdAt: new Date('2023-05-12'),
    updatedAt: new Date('2023-05-14'),
    serviceName: 'Plumbing Service',
    serviceImage: '/placeholder.svg'
  }
];

// Mock data for customer's disputes
const mockDisputes: Dispute[] = [
  {
    id: 'disp1',
    bookingId: 'booking1234567',
    customerId: 'customer1',
    providerId: 'provider1',
    status: 'open',
    reason: 'Service not delivered as described',
    description: 'The cleaning service was supposed to include window cleaning but it was not done.',
    evidenceUrls: ['/placeholder.svg'],
    createdAt: new Date('2023-05-16T10:30:00'),
    updatedAt: new Date('2023-05-16T10:30:00')
  },
  {
    id: 'disp2',
    bookingId: 'booking7654321',
    customerId: 'customer1',
    providerId: 'provider2',
    status: 'resolved',
    reason: 'Incorrect pricing',
    description: 'I was charged more than the agreed amount.',
    evidenceUrls: ['/placeholder.svg'],
    resolution: 'Partial refund issued to the customer.',
    createdAt: new Date('2023-05-14T15:45:00'),
    updatedAt: new Date('2023-05-15T14:20:00')
  }
];

const CustomerDisputesPage = () => {
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // In a real app, we would fetch data from an API
  const { data: bookings, isLoading: loadingBookings } = useQuery({
    queryKey: ['customerBookings'],
    queryFn: async () => {
      // Simulate API call
      return mockBookings;
    },
    initialData: mockBookings
  });
  
  const { isLoading: loadingDisputes } = useQuery({
    queryKey: ['customerDisputes'],
    queryFn: async () => {
      // Simulate API call
      return mockDisputes;
    },
    initialData: mockDisputes
  });
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };
  
  const handleSubmitDispute = () => {
    if (!selectedBooking || !reason || !description) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // In a real app, we would send this to an API
    const newDispute: Dispute = {
      id: `disp${Math.random().toString(36).substring(2, 9)}`,
      bookingId: selectedBooking.id,
      customerId: 'customer1', // Use actual customer ID from context
      providerId: selectedBooking.providerId,
      status: 'open',
      reason,
      description,
      evidenceUrls: uploadedFiles.map(() => '/placeholder.svg'), // In a real app, we would upload files and get URLs
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setDisputes(prev => [...prev, newDispute]);
    setReason('');
    setDescription('');
    setSelectedBooking(null);
    setUploadedFiles([]);
    setIsDialogOpen(false);
    
    toast.success("Dispute submitted successfully");
  };
  
  const getStatusBadge = (status: Dispute['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700"><Clock className="h-3 w-3 mr-1" /> Open</Badge>;
      case 'under_review':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700"><Clock className="h-3 w-3 mr-1" /> Under Review</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Resolved</Badge>;
      case 'declined':
        return <Badge variant="outline" className="bg-red-50 text-red-700"><XCircle className="h-3 w-3 mr-1" /> Declined</Badge>;
      default:
        return null;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const filteredDisputes = disputes.filter(d => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      d.bookingId.toLowerCase().includes(query) ||
      d.reason.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query)
    );
  });
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Disputes</h1>
          <p className="text-muted-foreground">
            Manage your payment disputes with service providers
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search disputes"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <AlertCircle className="h-4 w-4 mr-2" />
                Submit New Dispute
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Submit Payment Dispute</DialogTitle>
                <DialogDescription>
                  Submit a dispute for a booking you believe has issues with payment.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="booking">Select Booking</Label>
                  <Select 
                    onValueChange={(value) => setSelectedBooking(bookings.find(b => b.id === value) || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a booking" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookings.map((booking) => (
                        <SelectItem key={booking.id} value={booking.id}>
                          {booking.serviceName} - {formatDate(booking.date)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedBooking && (
                  <div className="p-3 bg-muted/50 rounded-md">
                    <p className="text-sm font-medium">{selectedBooking.serviceName}</p>
                    <p className="text-xs text-muted-foreground">
                      Date: {formatDate(selectedBooking.date)} • Amount: N${selectedBooking.totalAmount.toFixed(2)}
                    </p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="reason">Reason for Dispute</Label>
                  <Select onValueChange={setReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Service not delivered as described">Service not delivered as described</SelectItem>
                      <SelectItem value="Incorrect pricing">Incorrect pricing</SelectItem>
                      <SelectItem value="Double charged">Double charged</SelectItem>
                      <SelectItem value="Payment made but not reflected">Payment made but not reflected</SelectItem>
                      <SelectItem value="Other payment issue">Other payment issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about your dispute..."
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="evidence">Upload Evidence (optional)</Label>
                  <div className="mt-1">
                    <Input
                      id="evidence" 
                      type="file"
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*,.pdf"
                    />
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Uploaded files:</p>
                      <ul className="text-xs space-y-1">
                        {uploadedFiles.map((file, index) => (
                          <li key={index} className="flex items-center">
                            <FileUp className="h-3 w-3 mr-1" />
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitDispute}
                  disabled={!selectedBooking || !reason || !description}
                >
                  Submit Dispute
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Disputes</CardTitle>
            <CardDescription>
              Track the status of your submitted payment disputes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingDisputes ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredDisputes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Booking</th>
                      <th className="text-left py-3 px-4">Reason</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Last Updated</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDisputes.map((dispute) => (
                      <tr key={dispute.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{formatDate(dispute.createdAt)}</td>
                        <td className="py-3 px-4">
                          #{dispute.bookingId.substring(0, 8)}
                          <div className="text-xs text-muted-foreground">
                            {bookings.find(b => b.id === dispute.bookingId)?.serviceName || 'Unknown Service'}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {dispute.reason}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(dispute.status)}
                        </td>
                        <td className="py-3 px-4">{formatDate(dispute.updatedAt)}</td>
                        <td className="py-3 px-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8">
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px]">
                              <DialogHeader>
                                <DialogTitle>Dispute Details</DialogTitle>
                                <DialogDescription>
                                  Booking #{dispute.bookingId.substring(0, 8)} • {formatDate(dispute.createdAt)}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4 mt-2">
                                <div>
                                  <Label>Status</Label>
                                  <div className="mt-1">
                                    {getStatusBadge(dispute.status)}
                                  </div>
                                </div>
                                
                                <div>
                                  <Label>Reason</Label>
                                  <div className="font-medium mt-1">{dispute.reason}</div>
                                </div>
                                
                                <div>
                                  <Label>Description</Label>
                                  <div className="mt-1 p-3 bg-muted/50 rounded-md text-sm whitespace-pre-line">
                                    {dispute.description}
                                  </div>
                                </div>
                                
                                {dispute.evidenceUrls && dispute.evidenceUrls.length > 0 && (
                                  <div>
                                    <Label>Evidence Provided</Label>
                                    <div className="mt-1 flex gap-2">
                                      {dispute.evidenceUrls.map((url, index) => (
                                        <img 
                                          key={index}
                                          src={url} 
                                          alt={`Evidence ${index + 1}`}
                                          className="h-20 w-20 object-cover rounded-md border"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {dispute.resolution && (
                                  <div>
                                    <Label>Resolution</Label>
                                    <div className="mt-1 p-3 bg-green-50 rounded-md text-sm text-green-800 whitespace-pre-line">
                                      {dispute.resolution}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <DialogFooter>
                                <Button>Close</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No disputes found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery ? 'Try adjusting your search' : 'You haven\'t submitted any payment disputes yet'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDisputesPage;
