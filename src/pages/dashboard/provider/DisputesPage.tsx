
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Clock, CheckCircle, Search, Download, XCircle } from 'lucide-react';
import { Dispute } from '@/types/booking';
import { toast } from 'sonner';

// Mock data for provider's payment disputes
const mockDisputes: Dispute[] = [
  {
    id: 'disp1',
    bookingId: 'booking1234567',
    customerId: 'cust1',
    providerId: 'prov1',
    status: 'open',
    reason: 'Service not delivered as described',
    description: 'The cleaning service was supposed to include window cleaning but it was not done.',
    evidenceUrls: ['/placeholder.svg'],
    createdAt: new Date('2023-05-15T10:30:00'),
    updatedAt: new Date('2023-05-15T10:30:00')
  },
  {
    id: 'disp2',
    bookingId: 'booking7654321',
    customerId: 'cust2',
    providerId: 'prov1',
    status: 'under_review',
    reason: 'Delayed service',
    description: 'Service was provided 2 hours later than scheduled without prior notice.',
    evidenceUrls: ['/placeholder.svg', '/placeholder.svg'],
    createdAt: new Date('2023-05-14T15:45:00'),
    updatedAt: new Date('2023-05-14T16:30:00')
  },
  {
    id: 'disp3',
    bookingId: 'booking9876543',
    customerId: 'cust3',
    providerId: 'prov1',
    status: 'resolved',
    reason: 'Incorrect pricing',
    description: 'I was charged more than the agreed amount.',
    evidenceUrls: ['/placeholder.svg'],
    resolution: 'Partial refund issued to the customer.',
    createdAt: new Date('2023-05-13T09:15:00'),
    updatedAt: new Date('2023-05-13T14:20:00')
  }
];

const ProviderDisputesPage = () => {
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [responseText, setResponseText] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // In a real app, we would fetch data from an API
  const { isLoading } = useQuery({
    queryKey: ['providerDisputes'],
    queryFn: async () => {
      // Simulate API call
      return mockDisputes;
    },
    initialData: mockDisputes
  });
  
  const handleResponseSubmit = () => {
    if (!selectedDispute || !responseText.trim()) return;
    
    // Update the dispute with the response
    const updatedDisputes = disputes.map(dispute => {
      if (dispute.id === selectedDispute.id) {
        return {
          ...dispute,
          status: 'under_review' as const,
          description: dispute.description + `\n\nProvider Response: ${responseText}`,
          updatedAt: new Date()
        };
      }
      return dispute;
    });
    
    setDisputes(updatedDisputes);
    setResponseText('');
    setIsDialogOpen(false);
    toast.success("Response submitted successfully");
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
            Manage and respond to payment disputes from customers
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle>Active Disputes</CardTitle>
                <CardDescription>
                  Review and respond to customer disputes
                </CardDescription>
              </div>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search disputes"
                    className="pl-10 max-w-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredDisputes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Booking ID</th>
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
                        <td className="py-3 px-4">#{dispute.bookingId.substring(0, 8)}</td>
                        <td className="py-3 px-4 font-medium" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {dispute.reason}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(dispute.status)}
                        </td>
                        <td className="py-3 px-4">{formatDate(dispute.updatedAt)}</td>
                        <td className="py-3 px-4">
                          <Dialog open={isDialogOpen && selectedDispute?.id === dispute.id} onOpenChange={(open) => {
                            setIsDialogOpen(open);
                            if (open) {
                              setSelectedDispute(dispute);
                            } else {
                              setResponseText('');
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                disabled={dispute.status === 'resolved' || dispute.status === 'declined'}
                                onClick={() => setSelectedDispute(dispute)}
                              >
                                {dispute.status === 'open' ? 'Respond' : 'View Details'}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px]">
                              <DialogHeader>
                                <DialogTitle>{dispute.status === 'open' ? 'Respond to Dispute' : 'Dispute Details'}</DialogTitle>
                                <DialogDescription>
                                  Booking #{dispute.bookingId.substring(0, 8)} • {formatDate(dispute.createdAt)}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4 mt-2">
                                <div>
                                  <Label>Reason</Label>
                                  <div className="font-medium mt-1">{dispute.reason}</div>
                                </div>
                                
                                <div>
                                  <Label>Customer Description</Label>
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
                                
                                {dispute.status === 'open' && (
                                  <div>
                                    <Label htmlFor="response">Your Response</Label>
                                    <Textarea 
                                      id="response"
                                      value={responseText}
                                      onChange={(e) => setResponseText(e.target.value)}
                                      placeholder="Provide your response to this dispute..."
                                      className="mt-1"
                                      rows={5}
                                    />
                                  </div>
                                )}
                              </div>
                              
                              <DialogFooter>
                                {dispute.status === 'open' ? (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setIsDialogOpen(false)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      onClick={handleResponseSubmit}
                                      disabled={!responseText.trim()}
                                    >
                                      Submit Response
                                    </Button>
                                  </>
                                ) : (
                                  <Button 
                                    onClick={() => setIsDialogOpen(false)}
                                  >
                                    Close
                                  </Button>
                                )}
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
                <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No disputes found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery ? 'Try adjusting your search' : 'You don\'t have any active payment disputes'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// SearchIcon component
const SearchIcon = Search;

export default ProviderDisputesPage;
