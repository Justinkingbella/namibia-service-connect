
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye, Check, X, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ServiceData } from '@/types/service';
import { Badge } from '@/components/ui/badge';

interface ServiceManagementProps {
  services: ServiceData[];
  onDeleteService?: (serviceId: string) => void;
  onEditService?: (service: ServiceData) => void;
  onViewService?: (serviceId: string) => void;
  onToggleServiceStatus?: (serviceId: string, isActive: boolean) => void;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({
  services,
  onDeleteService,
  onEditService,
  onViewService,
  onToggleServiceStatus,
}) => {
  const navigate = useNavigate();

  // Format category name for display (e.g. "home_cleaning" -> "Home Cleaning")
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Your Services</CardTitle>
        <Button 
          size="sm"
          onClick={() => navigate('/provider/services/create')}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Service
        </Button>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">You haven't added any services yet.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/provider/services/create')}
            >
              Create Your First Service
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div 
                key={service.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-md gap-4"
              >
                <div className="flex flex-row items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-md bg-muted overflow-hidden flex-shrink-0"
                    style={{
                      backgroundImage: service.image ? `url(${service.image})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!service.image && (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-base">{service.title}</h3>
                      <Badge variant={service.is_active ? "outline" : "secondary"}>
                        {service.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-1 mt-1">{service.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                        {formatCategory(service.category)}
                      </span>
                      <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                        ${service.price} ({service.pricing_model})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 sm:flex-none"
                    onClick={() => onViewService && onViewService(service.id!)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => onEditService && onEditService(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={service.is_active ? "destructive" : "default"}
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => onToggleServiceStatus && onToggleServiceStatus(service.id!, !service.is_active)}
                  >
                    {service.is_active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => onDeleteService && onDeleteService(service.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceManagement;
