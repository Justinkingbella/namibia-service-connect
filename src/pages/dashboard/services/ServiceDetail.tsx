// First 30 lines or so - we'll need to update the imports for Tab components
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  AlertCircle, CheckCircle, MapPin, DollarSign, Tag, Edit, Trash, Clock 
} from 'lucide-react';
import { Service, ServiceData } from '@/types/service';
import { useServiceStore } from '@/store/serviceStore';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { transformServiceData } from '@/services/serviceDataTransformer';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedService, fetchServiceById, deleteService, toggleServiceActive } = useServiceStore();
  const [service, setService] = useState<ServiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const loadService = async () => {
      if (id) {
        setIsLoading(true);
        const fetchedService = await fetchServiceById(id);
        if (fetchedService) {
          // Transform the fetched service to ServiceData
          const transformedServiceData: ServiceData = {
            id: fetchedService.id,
            title: fetchedService.title,
            description: fetchedService.description,
            price: fetchedService.price,
            pricing_model: fetchedService.pricingModel,
            category: fetchedService.category,
            provider_id: fetchedService.providerId,
            provider_name: fetchedService.providerName,
            image: fetchedService.image,
            features: fetchedService.features,
            is_active: fetchedService.isActive,
            location: fetchedService.location,
            rating: fetchedService.rating,
            review_count: fetchedService.reviewCount,
            created_at: fetchedService.createdAt?.toISOString(),
            updated_at: fetchedService.updatedAt?.toISOString(),
          };
          setService(transformedServiceData);
        }
        setIsLoading(false);
      }
    };

    loadService();
  }, [id, fetchServiceById]);

  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      const success = await deleteService(id);
      if (success) {
        toast.success('Service deleted successfully');
        // Redirect to services page or dashboard
      } else {
        toast.error('Failed to delete service');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async () => {
    if (!id || !service) return;

    setIsToggling(true);
    try {
      const success = await toggleServiceActive(id, !service.is_active);
      if (success) {
        toast.success(`Service ${service.is_active ? 'deactivated' : 'activated'} successfully`);
        // Update the local state to reflect the change
        setService(prevService => prevService ? { ...prevService, is_active: !prevService.is_active } : null);
      } else {
        toast.error('Failed to toggle service status');
      }
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return <p>Loading service details...</p>;
  }

  if (!service) {
    return <p>Service not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{service.title}</CardTitle>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                <Trash className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
          <CardDescription>{service.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge>{service.category}</Badge>
            <Badge variant="secondary">
              <DollarSign className="h-4 w-4 mr-1" />
              {service.price} ({service.pricing_model})
            </Badge>
            {service.location && (
              <Badge variant="outline">
                <MapPin className="h-4 w-4 mr-1" />
                {service.location}
              </Badge>
            )}
            <Button variant="ghost" size="icon" onClick={handleToggleActive} disabled={isToggling}>
              {service.is_active ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </Button>
            <span>{service.is_active ? 'Active' : 'Inactive'}</span>
          </div>
          {service.features && service.features.length > 0 && (
            <div>
              <h4 className="text-sm font-medium">Features:</h4>
              <ul className="list-disc pl-5">
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          {service.tags && service.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium">Tags:</h4>
              <div className="flex space-x-2">
                {service.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-2">
          <Card>
            <CardContent>
              <p>Service details and description go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="availability">
          <Card>
            <CardContent>
              <p>Service availability and scheduling options.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card>
            <CardContent>
              <p>Customer reviews and ratings.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceDetail;
