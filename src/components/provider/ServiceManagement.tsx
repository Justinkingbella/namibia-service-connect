
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Star, ToggleLeft, MoreHorizontal, Eye } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { ServiceCategory, PricingModel } from '@/types/service';

interface ServiceItem {
  id: string;
  title: string;
  category: ServiceCategory;
  pricingModel: PricingModel;
  price: number;
  status: 'active' | 'inactive' | 'pending';
  bookingCount: number;
  rating: number;
  createdAt: string;
}

// Mock service data
const mockServices: ServiceItem[] = [
  {
    id: '1',
    title: 'Home Cleaning Service',
    category: 'home',
    pricingModel: 'hourly',
    price: 250,
    status: 'active',
    bookingCount: 45,
    rating: 4.8,
    createdAt: '2023-03-15',
  },
  {
    id: '2',
    title: 'Deep Cleaning',
    category: 'home',
    pricingModel: 'fixed',
    price: 1200,
    status: 'active',
    bookingCount: 28,
    rating: 4.6,
    createdAt: '2023-04-22',
  },
  {
    id: '3',
    title: 'Post-Construction Cleaning',
    category: 'home',
    pricingModel: 'fixed',
    price: 3000,
    status: 'inactive',
    bookingCount: 12,
    rating: 4.9,
    createdAt: '2023-05-10',
  },
];

const ServiceManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceItem[]>(mockServices);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);

  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(service => service.status === filter);

  const handleStatusToggle = (serviceId: string) => {
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === serviceId
          ? { 
              ...service, 
              status: service.status === 'active' ? 'inactive' : 'active' 
            }
          : service
      )
    );
    
    toast({
      title: "Status updated",
      description: "Service status has been updated successfully.",
    });
  };

  const handleDeleteService = () => {
    if (!serviceToDelete) return;
    
    setServices(prevServices => 
      prevServices.filter(service => service.id !== serviceToDelete.id)
    );
    
    toast({
      title: "Service deleted",
      description: "The service has been deleted successfully.",
      variant: "destructive",
    });
    
    setServiceToDelete(null);
  };

  const getCategoryLabel = (category: ServiceCategory) => {
    const labels: Record<ServiceCategory, string> = {
      all: 'All',
      home: 'Home Services',
      errand: 'Errands',
      professional: 'Professional',
      freelance: 'Freelance',
      transport: 'Transport',
      health: 'Health'
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Manage Services</h2>
          <p className="text-muted-foreground text-sm">Create and manage your service offerings</p>
        </div>
        
        <Button onClick={() => navigate('/dashboard/services/create')}>
          <Plus className="mr-2 h-4 w-4" /> 
          Add New Service
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          size="sm" 
          variant={filter === 'all' ? 'default' : 'outline'} 
          onClick={() => setFilter('all')}
        >
          All Services
        </Button>
        <Button 
          size="sm" 
          variant={filter === 'active' ? 'default' : 'outline'} 
          onClick={() => setFilter('active')}
        >
          Active
        </Button>
        <Button 
          size="sm" 
          variant={filter === 'inactive' ? 'default' : 'outline'} 
          onClick={() => setFilter('inactive')}
        >
          Inactive
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No services found. Create your first service to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="font-medium">{service.title}</div>
                      <div className="text-xs text-muted-foreground">Added {service.createdAt}</div>
                    </TableCell>
                    <TableCell>{getCategoryLabel(service.category)}</TableCell>
                    <TableCell>
                      N${service.price}
                      <span className="text-xs text-muted-foreground ml-1">
                        {service.pricingModel === 'hourly' ? '/hr' : ''}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          service.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{service.bookingCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span>{service.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/services/${service.id}`)}>
                            <Eye className="h-4 w-4 mr-2" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/services/edit/${service.id}`)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusToggle(service.id)}>
                            <ToggleLeft className="h-4 w-4 mr-2" />
                            {service.status === 'active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => setServiceToDelete(service)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this service?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the service 
              "{serviceToDelete?.title}" and remove its data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDeleteService}
            >
              Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceManagement;
