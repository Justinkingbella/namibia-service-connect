import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { fetchUserDisputes } from '@/services/mockProfileService';
import { Dispute } from '@/types/payments';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const DisputesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const loadDisputes = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const disputesData = await fetchUserDisputes(user.id);
        setDisputes(disputesData);
      } catch (error) {
        console.error('Failed to load disputes:', error);
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

  const filteredDisputes = activeTab === 'all' 
    ? disputes 
    : disputes.filter(d => d.status === activeTab);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dispute Management</h1>
          <p className="text-muted-foreground mt-1">Review and manage customer disputes</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Disputes</CardTitle>
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
                      There are no disputes matching the selected filter.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">ID</th>
                          <th className="text-left py-3 px-4">Customer</th>
                          <th className="text-left py-3 px-4">Provider</th>
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
                            <td className="py-3 px-4">{dispute.customerId.substring(0, 8)}</td>
                            <td className="py-3 px-4">{dispute.providerId?.substring(0, 8) || 'N/A'}</td>
                            <td className="py-3 px-4">{dispute.reason}</td>
                            <td className="py-3 px-4">{formatDate(dispute.createdAt)}</td>
                            <td className="py-3 px-4">{getStatusBadge(dispute.status)}</td>
                            <td className="py-3 px-4">
                              <Button size="sm">Review</Button>
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
    </DashboardLayout>
  );
};

export default DisputesPage;
