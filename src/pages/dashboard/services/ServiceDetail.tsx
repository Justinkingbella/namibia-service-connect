
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useServiceStore } from '@/store/serviceStore';
import { useAuthStore } from '@/store/authStore';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ChevronLeft, Edit, Star, MapPin, DollarSign, Clock, Users, Check, X } from 'lucide-react';

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { fetchServiceById, selectedService, isLoading, toggleServiceActive, deleteService } = useServiceStore();
  const { user } = useAuthStore();
  
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchServiceById(id);
    }
  }, [id, fetchServiceById]);

  const handleStatusToggle = async () => {
    if (!selectedService || !id) return;
    
    const newStatus = !selectedService.isActive;
    const success = await toggleServiceActive(id, newStatus);
    
    if (success) {
      toast.success(`Service ${newStatus ? 'activated' : 'deactivated'} successfully`);
    }
  };

  const handleEdit = () => {
    navigate(`/provider/services/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteService(id);
      if (success) {
        toast.success('Service deleted successfully');
        navigate('/provider/services');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPricingModel = (model: string) => {
    switch (model.toLowerCase()) {
      case 'hourly':
        return 'per hour';
      case 'daily':
        return 'per day';
      case 'fixed':
        return 'fixed price';
      case 'project':
        return 'per project';
      default:
        return model;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!selectedService) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <h2 className="text-2xl font-bold">Service Not Found</h2>
          <p className="text-muted-foreground">The service you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/provider/services')}>Back to Services</Button>
        </div>
      </DashboardLayout>
    );
  }

  const isProvider = user?.role === 'provider' && user?.id === selectedService.providerId;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Service Details</h1>
        </div>

        {/* Service status banner */}
        {!selectedService.isActive && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This service is currently inactive and not visible to customers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service image and details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                {selectedService.image ? (
                  <div className="relative h-64 w-full">
                    <img 
                      src={selectedService.image} 
                      alt={selectedService.title} 
                      className="h-full w-full object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Badge variant={selectedService.isActive ? "success" : "secondary"}>
                        {selectedService.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge>{selectedService.category}</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 w-full bg-muted flex items-center justify-center rounded-t-lg">
                    <p className="text-muted-foreground">No image available</p>
                  </div>
                )}
                
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedService.title}</h2>
                    {selectedService.rating !== undefined && (
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm font-medium">{selectedService.rating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground ml-1">
                          ({selectedService.reviewCount || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground">{selectedService.description}</p>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="font-medium">
                        N${selectedService.price} {formatPricingModel(selectedService.pricingModel)}
                      </span>
                    </div>
                    
                    {selectedService.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                        <span>{selectedService.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features section */}
            {selectedService.features && selectedService.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedService.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar with provider info and actions */}
          <div className="space-y-6">
            {/* Provider info */}
            <Card>
              <CardHeader>
                <CardTitle>Provider</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{selectedService.providerName}</p>
                  <p className="text-sm text-muted-foreground">Since {selectedService.createdAt.toLocaleDateString()}</p>
                </div>

                {selectedService.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">{selectedService.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions for providers */}
            {isProvider && (
              <Card>
                <CardHeader>
                  <CardTitle>Manage Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full"
                    variant="outline" 
                    onClick={handleEdit}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Service
                  </Button>
                  
                  <Button 
                    className="w-full"
                    variant={selectedService.isActive ? "destructive" : "default"}
                    onClick={handleStatusToggle}
                  >
                    {selectedService.isActive ? (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Activate
                      </>
                    )}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full" variant="destructive">
                        Delete Service
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this service and remove it from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          disabled={isDeleting}
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            )}

            {/* Book now button for customers */}
            {user?.role === 'customer' && selectedService.isActive && (
              <Card>
                <CardHeader>
                  <CardTitle>Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(`/customer/book/${selectedService.id}`)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServiceDetail;
