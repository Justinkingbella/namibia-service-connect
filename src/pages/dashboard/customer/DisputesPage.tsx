
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { fetchUserDisputes, createDispute } from '@/services/profileService';
import { Dispute } from '@/types/payments';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface Booking {
  id: string;
  providerId: string;
  serviceName: string;
  date: string;
  status: string;
}

const CustomerDisputesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isCreatingDispute, setIsCreatingDispute] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadDisputes = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const disputesData = await fetchUserDisputes(user.id);
        setDisputes(disputesData);

        // Also load bookings for creating new disputes
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('id, provider_id, service_id, date, status')
          .eq('customer_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });
          
        if (bookingsError) throw bookingsError;
        
        // Get service names for bookings
        if (bookingsData.length > 0) {
          const serviceIds = bookingsData.map(b => b.service_id);
          const { data: servicesData, error: servicesError } = await supabase
            .from('services')
            .select('id, title')
            .in('id', serviceIds);
            
          if (servicesError) throw servicesError;
          
          const serviceMap = new Map(servicesData.map(s => [s.id, s.title]));
          
          setBookings(bookingsData.map(b => ({
            id: b.id,
            providerId: b.provider_id,
            serviceName: serviceMap.get(b.service_id) || 'Unknown Service',
            date: new Date(b.date).toLocaleDateString(),
            status: b.status
          })));
        }
      } catch (error) {
        console.error('Failed to load disputes or bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load disputes",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadDisputes();
  }, [user, toast]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Open</Badge>;
      case 'under_review':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Under Review</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Resolved</Badge>;
      case 'declined':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Declined</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'under_review':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'declined':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleCreateDispute = async () => {
    if (!user?.id || !selectedBookingId || !reason || !description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get provider ID from the selected booking
      const booking = bookings.find(b => b.id === selectedBookingId);
      if (!booking) throw new Error("Selected booking not found");
      
      const newDispute = await createDispute({
        bookingId: selectedBookingId,
        customerId: user.id,
        providerId: booking.providerId,
        reason: reason,
        description: description,
        status: 'open',
        evidenceUrls: [] // Add the missing property
      });
      
      if (newDispute) {
        setDisputes(prev => [newDispute, ...prev]);
        setIsCreatingDispute(false);
        setSelectedBookingId('');
        setReason('');
        setDescription('');
        
        toast({
          title: "Success",
          description: "Dispute created successfully",
        });
      }
    } catch (error) {
      console.error('Failed to create dispute:', error);
      toast({
        title: "Error",
        description: "Failed to create dispute",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDisputes = activeTab === 'all' 
    ? disputes 
    : disputes.filter(d => d.status === activeTab);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Disputes</h1>
            <p className="text-muted-foreground mt-1">Track and manage your service disputes</p>
          </div>
          <Button onClick={() => setIsCreatingDispute(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Dispute
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="under_review">Under Review</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
                <TabsTrigger value="declined">Declined</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : filteredDisputes.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium">No disputes found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      You haven't filed any disputes that match the selected filter.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">ID</th>
                          <th className="text-left py-3 px-4">Booking ID</th>
                          <th className="text-left py-3 px-4">Reason</th>
                          <th className="text-left py-3 px-4">Created</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDisputes.map((dispute) => (
                          <tr key={dispute.id} className="border-b hover:bg-slate-50">
                            <td className="py-3 px-4">{dispute.id.substring(0, 8)}</td>
                            <td className="py-3 px-4">{dispute.bookingId ? dispute.bookingId.substring(0, 8) : 'N/A'}</td>
                            <td className="py-3 px-4">{dispute.reason}</td>
                            <td className="py-3 px-4">{formatDate(dispute.createdAt)}</td>
                            <td className="py-3 px-4">{getStatusBadge(dispute.status)}</td>
                            <td className="py-3 px-4">
                              <Button size="sm">View Details</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Create Dispute Dialog */}
      <Dialog open={isCreatingDispute} onOpenChange={setIsCreatingDispute}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Dispute</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="booking">Select Booking</Label>
              <Select value={selectedBookingId} onValueChange={setSelectedBookingId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a booking" />
                </SelectTrigger>
                <SelectContent>
                  {bookings.map(booking => (
                    <SelectItem key={booking.id} value={booking.id}>
                      {booking.serviceName} - {booking.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Dispute Reason</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Service not completed, Quality issue"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about your dispute..."
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingDispute(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateDispute} 
              disabled={isSubmitting || !selectedBookingId || !reason || !description}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CustomerDisputesPage;
