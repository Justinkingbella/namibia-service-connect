
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/badge';
import { FileText, Check, X, Eye, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProviderVerificationStatus } from '@/types/auth';

interface PendingProvider {
  id: string;
  name: string;
  email: string;
  businessName: string;
  dateApplied: string;
  categories: string[];
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  status: ProviderVerificationStatus;
}

const mockPendingProviders: PendingProvider[] = [
  {
    id: '1',
    name: 'Michael Johns',
    email: 'michael@plumbers.com',
    businessName: 'Michael Plumbers',
    dateApplied: '2023-06-15',
    categories: ['Home Services'],
    documents: [
      { id: 'd1', name: 'Business Registration', type: 'pdf', url: '#' },
      { id: 'd2', name: 'ID Document', type: 'pdf', url: '#' },
      { id: 'd3', name: 'Professional Certification', type: 'pdf', url: '#' },
    ],
    status: 'pending'
  },
  {
    id: '2',
    name: 'Sarah Swift',
    email: 'sarah@swifterrands.com',
    businessName: 'Swift Errands',
    dateApplied: '2023-06-14',
    categories: ['Errand Services'],
    documents: [
      { id: 'd4', name: 'Business Registration', type: 'pdf', url: '#' },
      { id: 'd5', name: 'ID Document', type: 'pdf', url: '#' },
    ],
    status: 'pending'
  },
  {
    id: '3',
    name: 'James Eagle',
    email: 'james@eaglesecurity.com',
    businessName: 'Eagle Security',
    dateApplied: '2023-06-13',
    categories: ['Professional Services'],
    documents: [
      { id: 'd6', name: 'Business Registration', type: 'pdf', url: '#' },
      { id: 'd7', name: 'ID Document', type: 'pdf', url: '#' },
      { id: 'd8', name: 'Security License', type: 'pdf', url: '#' },
      { id: 'd9', name: 'Insurance Certificate', type: 'pdf', url: '#' },
    ],
    status: 'pending'
  },
];

const ProviderVerification: React.FC = () => {
  const { toast } = useToast();
  const [providers, setProviders] = useState<PendingProvider[]>(mockPendingProviders);
  const [selectedProvider, setSelectedProvider] = useState<PendingProvider | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('info');

  const handleApprove = (providerId: string) => {
    setProviders(prev => 
      prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, status: 'verified' as ProviderVerificationStatus } 
          : provider
      )
    );
    
    toast({
      title: "Provider approved",
      description: "The service provider has been verified successfully.",
    });
    
    setDialogOpen(false);
  };

  const handleReject = (providerId: string) => {
    setProviders(prev => 
      prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, status: 'unverified' as ProviderVerificationStatus } 
          : provider
      )
    );
    
    toast({
      title: "Provider rejected",
      description: "The service provider verification has been rejected.",
      variant: "destructive",
    });
    
    setDialogOpen(false);
  };

  const openProviderDetails = (provider: PendingProvider) => {
    setSelectedProvider(provider);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Provider Verification</h2>
          <p className="text-muted-foreground text-sm">Verify and approve service provider applications</p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No pending verifications at this time.
                  </TableCell>
                </TableRow>
              ) : (
                providers.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <div className="font-medium">{provider.businessName}</div>
                      <div className="text-xs text-muted-foreground">{provider.email}</div>
                    </TableCell>
                    <TableCell>
                      {provider.categories.map((category, index) => (
                        <span key={index} className="inline-block mr-1">
                          {category}{index < provider.categories.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell>{provider.dateApplied}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-muted-foreground mr-1" />
                        <span>{provider.documents.length} files</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          provider.status === 'verified' 
                            ? 'bg-green-100 text-green-800' 
                            : provider.status === 'unverified'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        onClick={() => openProviderDetails(provider)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Provider Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Provider Application Review</DialogTitle>
            <DialogDescription>
              Review the provider's details and documents before approving or rejecting.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProvider && (
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Provider Info</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Business Name</p>
                    <p className="text-sm">{selectedProvider.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Owner Name</p>
                    <p className="text-sm">{selectedProvider.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm">{selectedProvider.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date Applied</p>
                    <p className="text-sm">{selectedProvider.dateApplied}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Categories</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedProvider.categories.map((category, index) => (
                        <Badge key={index} variant="secondary">{category}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="pt-4">
                <div className="space-y-3">
                  {selectedProvider.documents.map(doc => (
                    <div 
                      key={doc.id} 
                      className="flex items-center p-3 border rounded-md hover:bg-gray-50"
                    >
                      <FileText className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground uppercase">{doc.type}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="ml-auto"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="verification" className="pt-4">
                <div className="space-y-4">
                  <p className="text-sm">
                    Review all provider information and documents before making a decision.
                  </p>
                  
                  <div className="flex items-center p-4 bg-yellow-50 rounded-md">
                    <p className="text-sm text-yellow-800">
                      Ensuring providers meet our verification standards helps maintain quality 
                      and trust on our platform. Verification status can be changed later if needed.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter className="flex space-x-2 mt-6">
            <Button 
              variant="destructive" 
              onClick={() => selectedProvider && handleReject(selectedProvider.id)}
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button 
              onClick={() => selectedProvider && handleApprove(selectedProvider.id)}
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderVerification;
