import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

// Mock provider application data
interface ProviderApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  serviceCategory: string;
  documents: {
    id: string;
    name: string;
    url: string;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const mockApplications: ProviderApplication[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+264 81 123 4567',
    businessName: 'Doe Cleaning Services',
    serviceCategory: 'Home Services',
    documents: [
      { id: 'd1', name: 'Business Registration', url: '/documents/business-reg.pdf' },
      { id: 'd2', name: 'ID Document', url: '/documents/id-doc.pdf' },
      { id: 'd3', name: 'Proof of Address', url: '/documents/proof-address.pdf' },
    ],
    status: 'pending',
    submittedAt: '2023-05-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+264 81 765 4321',
    businessName: 'Smith Transport',
    serviceCategory: 'Transport',
    documents: [
      { id: 'd4', name: 'Business Registration', url: '/documents/business-reg.pdf' },
      { id: 'd5', name: 'ID Document', url: '/documents/id-doc.pdf' },
      { id: 'd6', name: 'Vehicle Registration', url: '/documents/vehicle-reg.pdf' },
    ],
    status: 'pending',
    submittedAt: '2023-05-17',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+264 81 987 6543',
    businessName: 'Johnson Electrical',
    serviceCategory: 'Home Services',
    documents: [
      { id: 'd7', name: 'Business Registration', url: '/documents/business-reg.pdf' },
      { id: 'd8', name: 'ID Document', url: '/documents/id-doc.pdf' },
      { id: 'd9', name: 'Electrical Certification', url: '/documents/electrical-cert.pdf' },
    ],
    status: 'approved',
    submittedAt: '2023-05-10',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '+264 81 543 2109',
    businessName: 'Sarah Beauty Salon',
    serviceCategory: 'Health & Wellness',
    documents: [
      { id: 'd10', name: 'Business Registration', url: '/documents/business-reg.pdf' },
      { id: 'd11', name: 'ID Document', url: '/documents/id-doc.pdf' },
      { id: 'd12', name: 'Health Certification', url: '/documents/health-cert.pdf' },
    ],
    status: 'rejected',
    submittedAt: '2023-05-11',
  },
];

const ProviderVerification: React.FC = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<ProviderApplication[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<ProviderApplication | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const handleApprove = (application: ProviderApplication) => {
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === application.id ? { ...app, status: 'approved' } : app
      )
    );
    
    setIsDetailsOpen(false);
    
    toast({
      title: "Application Approved",
      description: `${application.name}'s application has been approved successfully.`,
    });
  };

  const handleReject = (application: ProviderApplication) => {
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === application.id ? { ...app, status: 'rejected' } : app
      )
    );
    
    setIsDetailsOpen(false);
    
    toast({
      variant: "destructive",
      title: "Application Rejected",
      description: `${application.name}'s application has been rejected.`,
    });
  };

  const viewDetails = (application: ProviderApplication) => {
    setSelectedApplication(application);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status: ProviderApplication['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Service Provider Applications</CardTitle>
              <CardDescription>
                Review and verify service provider applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="font-medium">{application.name}</div>
                          <div className="text-xs text-muted-foreground">{application.email}</div>
                        </TableCell>
                        <TableCell>{application.businessName}</TableCell>
                        <TableCell>{application.serviceCategory}</TableCell>
                        <TableCell>{application.submittedAt}</TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => viewDetails(application)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Pending Applications</CardTitle>
              <CardDescription>
                Review pending service provider applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.filter(app => app.status === 'pending').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No pending applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.filter(app => app.status === 'pending').map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="font-medium">{application.name}</div>
                          <div className="text-xs text-muted-foreground">{application.email}</div>
                        </TableCell>
                        <TableCell>{application.businessName}</TableCell>
                        <TableCell>{application.serviceCategory}</TableCell>
                        <TableCell>{application.submittedAt}</TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => viewDetails(application)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approved" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Approved Applications</CardTitle>
              <CardDescription>
                View all approved service provider applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.filter(app => app.status === 'approved').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No approved applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.filter(app => app.status === 'approved').map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="font-medium">{application.name}</div>
                          <div className="text-xs text-muted-foreground">{application.email}</div>
                        </TableCell>
                        <TableCell>{application.businessName}</TableCell>
                        <TableCell>{application.serviceCategory}</TableCell>
                        <TableCell>{application.submittedAt}</TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => viewDetails(application)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Applications</CardTitle>
              <CardDescription>
                View all rejected service provider applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.filter(app => app.status === 'rejected').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No rejected applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.filter(app => app.status === 'rejected').map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="font-medium">{application.name}</div>
                          <div className="text-xs text-muted-foreground">{application.email}</div>
                        </TableCell>
                        <TableCell>{application.businessName}</TableCell>
                        <TableCell>{application.serviceCategory}</TableCell>
                        <TableCell>{application.submittedAt}</TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => viewDetails(application)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Application Details Dialog */}
      {selectedApplication && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Provider Application Details</DialogTitle>
              <DialogDescription>
                Review the details and documents submitted by the service provider
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Full Name:</span>
                    <p>{selectedApplication.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                    <p>{selectedApplication.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                    <p>{selectedApplication.phone}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Business Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Business Name:</span>
                    <p>{selectedApplication.businessName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Service Category:</span>
                    <p>{selectedApplication.serviceCategory}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Submitted On:</span>
                    <p>{selectedApplication.submittedAt}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="py-2">
              <h3 className="text-lg font-medium mb-3">Submitted Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {selectedApplication.documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-3">
                    <div className="text-sm font-medium">{doc.name}</div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 w-full"
                      onClick={() => window.open(doc.url, '_blank')}
                    >
                      View Document
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              {selectedApplication.status === 'pending' && (
                <>
                  <Button 
                    variant="outline"
                    onClick={() => handleReject(selectedApplication)}
                    className="w-full sm:w-auto"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleApprove(selectedApplication)}
                    className="w-full sm:w-auto"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </>
              )}
              {selectedApplication.status !== 'pending' && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProviderVerification;
