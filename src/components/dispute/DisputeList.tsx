
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, AlertCircle, CheckCircle, Clock, HelpCircle } from 'lucide-react';
import { Dispute } from '@/types/booking';
import { formatDistanceToNow } from 'date-fns';

interface DisputeListProps {
  disputes: Dispute[];
  loading: boolean;
}

const DisputeStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    case 'in_review':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Review</Badge>;
    case 'resolved':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const DisputeIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return <AlertCircle className="h-10 w-10 text-yellow-500" />;
    case 'in_review':
      return <HelpCircle className="h-10 w-10 text-blue-500" />;
    case 'resolved':
      return <CheckCircle className="h-10 w-10 text-green-500" />;
    case 'rejected':
      return <Clock className="h-10 w-10 text-red-500" />;
    default:
      return <AlertCircle className="h-10 w-10 text-gray-500" />;
  }
};

const DisputeList: React.FC<DisputeListProps> = ({ disputes, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (disputes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="rounded-full bg-gray-100 p-3 mb-4">
            <AlertCircle className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-1">No Disputes Found</h3>
          <p className="text-sm text-gray-500 text-center">
            You haven't raised any disputes yet. If you encounter any issues with your bookings, you can create a new dispute.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {disputes.map((dispute) => (
        <Card key={dispute.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="mt-1">
                <DisputeIcon status={dispute.status} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{dispute.subject}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <DisputeStatusBadge status={dispute.status} />
                      <span className="text-sm text-muted-foreground">
                        Booking ID: {dispute.bookingId.substring(0, 8)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(dispute.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {dispute.description}
                </p>
                
                {dispute.resolution && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium">Resolution:</p>
                    <p className="text-sm text-gray-600">{dispute.resolution}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DisputeList;
