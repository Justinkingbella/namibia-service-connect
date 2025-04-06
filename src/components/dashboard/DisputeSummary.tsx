
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDisputes } from '@/hooks/useDisputes';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function DisputeSummary() {
  const { user } = useAuth();
  const { disputes, loading } = useDisputes();
  
  if (!user) {
    return null;
  }
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Disputes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const pendingCount = disputes.filter(d => d.status === 'pending' || d.status === 'in_progress' || d.status === 'in_review').length;
  const resolvedCount = disputes.filter(d => d.status === 'resolved').length;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Dispute Status</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/dashboard/${user.role}/disputes`}>
              View All
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {disputes.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No disputes found</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg">
              <Clock className="h-6 w-6 text-amber-500 mb-2" />
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-xl font-bold">{pendingCount}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-xl font-bold">{resolvedCount}</p>
            </div>
          </div>
        )}
        
        {disputes.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Recent Disputes</h4>
            <div className="space-y-2">
              {disputes.slice(0, 2).map(dispute => (
                <div 
                  key={dispute.id} 
                  className="p-3 border rounded-md text-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{dispute.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(dispute.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      dispute.status === 'resolved' 
                        ? 'bg-green-100 text-green-700' 
                        : dispute.status === 'in_progress' || dispute.status === 'in_review'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {dispute.status === 'in_review' ? 'In Review' : 
                       dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
