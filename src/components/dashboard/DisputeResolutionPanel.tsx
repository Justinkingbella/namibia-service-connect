
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle, XCircle, MessageSquare, ArrowRight } from 'lucide-react';
import { Booking } from '@/types';

interface DisputeResolutionPanelProps {
  role: 'admin' | 'provider' | 'customer';
}

const mockDisputes = [
  {
    id: 'disp-1',
    bookingId: '3',
    customerId: '2',
    providerId: '1',
    status: 'open',
    reason: 'Service not completed as described',
    description: 'The cleaning service didn't include the bathroom as was promised in the service description.',
    evidenceUrls: [],
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000 * 1) // 1 day ago
  },
  {
    id: 'disp-2',
    bookingId: '4',
    customerId: '1',
    providerId: '3',
    status: 'under_review',
    reason: 'Incorrect charges',
    description: 'I was charged for 3 hours but the service only took 2 hours to complete.',
    evidenceUrls: ['https://example.com/receipt.jpg'],
    createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
    updatedAt: new Date(Date.now() - 86400000 * 3) // 3 days ago
  },
  {
    id: 'disp-3',
    bookingId: '5',
    customerId: '3',
    providerId: '2',
    status: 'resolved',
    reason: 'Provider did not show up',
    description: 'The provider never arrived for the scheduled service.',
    evidenceUrls: [],
    resolution: 'Full refund processed',
    createdAt: new Date(Date.now() - 86400000 * 10), // 10 days ago
    updatedAt: new Date(Date.now() - 86400000 * 7) // 7 days ago
  }
];

export const DisputeResolutionPanel: React.FC<DisputeResolutionPanelProps> = ({ role }) => {
  const [activeTab, setActiveTab] = useState('open');
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" /> Open
          </Badge>
        );
      case 'under_review':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Under Review
          </Badge>
        );
      case 'resolved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Resolved
          </Badge>
        );
      case 'declined':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" /> Declined
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredDisputes = mockDisputes.filter(dispute => {
    if (activeTab === 'all') return true;
    return dispute.status === activeTab;
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispute Resolution</CardTitle>
        <CardDescription>
          {role === 'admin' 
            ? 'Review and resolve customer disputes' 
            : role === 'provider'
              ? 'View and respond to customer disputes'
              : 'Track the status of your reported issues'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="open" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="under_review">Under Review</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {filteredDisputes.length > 0 ? (
              <div className="space-y-4">
                {filteredDisputes.map((dispute) => (
                  <div key={dispute.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Dispute #{dispute.id}</h3>
                        <p className="text-sm text-muted-foreground">Booking #{dispute.bookingId}</p>
                      </div>
                      {getStatusBadge(dispute.status)}
                    </div>
                    
                    <div className="mb-2">
                      <h4 className="text-sm font-medium">Reason</h4>
                      <p className="text-sm">{dispute.reason}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium">Description</h4>
                      <p className="text-sm">{dispute.description}</p>
                    </div>
                    
                    {dispute.resolution && (
                      <div className="mb-4 p-2 bg-green-50 rounded">
                        <h4 className="text-sm font-medium text-green-800">Resolution</h4>
                        <p className="text-sm text-green-800">{dispute.resolution}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-2 mt-2">
                      {role === 'admin' && dispute.status !== 'resolved' && (
                        <>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" /> Contact Parties
                          </Button>
                          <Button size="sm">
                            Resolve Dispute <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </>
                      )}
                      
                      {role === 'provider' && dispute.status === 'open' && (
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" /> Respond
                        </Button>
                      )}
                      
                      {role === 'customer' && dispute.status === 'open' && (
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" /> Add Details
                        </Button>
                      )}
                      
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No disputes found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {activeTab === 'open' 
                    ? 'There are no open disputes at this time.' 
                    : activeTab === 'under_review'
                      ? 'There are no disputes under review at this time.'
                      : activeTab === 'resolved'
                        ? 'There are no resolved disputes to display.'
                        : 'There are no disputes to display.'
                  }
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DisputeResolutionPanel;
