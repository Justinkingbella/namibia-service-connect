
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { Dispute } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchAllDisputes } from '@/services/mockProfileService';

export function AdminDisputesPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  const { data: disputes = [], isLoading } = useQuery({
    queryKey: ['adminDisputes'],
    queryFn: fetchAllDisputes
  });

  const filteredDisputes = disputes.filter(d => {
    if (activeTab === 'pending') return d.status === 'pending';
    if (activeTab === 'in_review') return d.status === 'in_review';
    if (activeTab === 'resolved') return d.status === 'resolved' || d.status === 'rejected';
    return true;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'in_review':
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
          <h1 className="text-2xl font-bold">Manage Disputes</h1>
          <p className="text-muted-foreground">Review and resolve customer disputes</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in_review">In Review</TabsTrigger>
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
                            {dispute.subject}
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
                    </div>
                  ))}
                </div>
                
                <div className="lg:col-span-2">
                  {selectedDispute ? (
                    <div className="bg-white rounded-xl border shadow-sm h-full p-6 space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">{selectedDispute.subject}</h3>
                          <p className="text-sm text-muted-foreground">Booking #{selectedDispute.bookingId}</p>
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
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm">{selectedDispute.description}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Priority</h4>
                            <p className="capitalize">{selectedDispute.priority}</p>
                          </div>
                          {selectedDispute.refundAmount && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Requested Refund</h4>
                              <p>{new Intl.NumberFormat('en-NA', { style: 'currency', currency: 'NAD' }).format(selectedDispute.refundAmount)}</p>
                            </div>
                          )}
                        </div>
                        
                        {selectedDispute.status === 'pending' && (
                          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => console.log('Accept dispute')}>
                              Start Review
                            </Button>
                            <Button onClick={() => console.log('Resolve dispute')}>
                              Resolve Dispute
                            </Button>
                          </div>
                        )}
                        
                        {selectedDispute.status === 'in_review' && (
                          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => console.log('Reject dispute')}>
                              Reject Dispute
                            </Button>
                            <Button onClick={() => console.log('Resolve dispute')}>
                              Resolve Dispute
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border shadow-sm h-full flex flex-col items-center justify-center p-8">
                      <AlertCircle className="h-10 w-10 text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium">No dispute selected</h3>
                      <p className="mt-2 text-sm text-muted-foreground text-center">
                        Select a dispute from the list to view its details
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
}

// For TypeScript compatibility
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default AdminDisputesPage;
