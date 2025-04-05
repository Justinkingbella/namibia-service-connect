import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProviderServices } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ServiceCategory, PricingModel, Service } from '@/types/service';
import { PlusCircle, Grid, Home, ShoppingBag, Briefcase, Code, Car, Heart, Trash, Wrench, Droplet, Zap, Truck, Palette, Flower, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ServiceManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { data: services = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['providerServices', user?.id],
    queryFn: () => user?.id ? fetchProviderServices(user.id) : Promise.resolve([]),
    enabled: !!user?.id
  });

  const formatPrice = (price: number, pricingModel: PricingModel) => {
    return new Intl.NumberFormat('en-NA', { style: 'currency', currency: 'NAD' }).format(price) + 
      (pricingModel === 'hourly' ? '/hr' : pricingModel === 'quote' ? ' (estimate)' : '');
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const categoryIcons: Record<string, string> = {
    'all': 'grid',
    'cleaning': 'trash',
    'repair': 'wrench',
    'plumbing': 'droplet',
    'electrical': 'zap',
    'moving': 'truck',
    'painting': 'palette',
    'landscaping': 'flower',
    'tutoring': 'book-open',
    'home': 'home',
    'errand': 'shopping-bag',
    'professional': 'briefcase',
    'freelance': 'code',
    'transport': 'car',
    'health': 'heart'
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'cleaning': return <Trash className="h-4 w-4" />;
      case 'repair': return <Wrench className="h-4 w-4" />;
      case 'plumbing': return <Droplet className="h-4 w-4" />;
      case 'electrical': return <Zap className="h-4 w-4" />;
      case 'moving': return <Truck className="h-4 w-4" />;
      case 'painting': return <Palette className="h-4 w-4" />;
      case 'landscaping': return <Flower className="h-4 w-4" />;
      case 'tutoring': return <BookOpen className="h-4 w-4" />;
      case 'home': return <Home className="h-4 w-4" />;
      case 'errand': return <ShoppingBag className="h-4 w-4" />;
      case 'professional': return <Briefcase className="h-4 w-4" />;
      case 'freelance': return <Code className="h-4 w-4" />;
      case 'transport': return <Car className="h-4 w-4" />;
      case 'health': return <Heart className="h-4 w-4" />;
      default: return <Grid className="h-4 w-4" />;
    }
  };

  const filteredServices = services
    .filter(service => 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(service => 
      categoryFilter === 'all' || service.category === categoryFilter
    );

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading services...</div>;
  }

  if (isError) {
    return <div className="text-center p-8 text-red-500">Error loading services. Please try again later.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Your Services</h2>
          <p className="text-muted-foreground">Manage the services you offer</p>
        </div>
        <Link to="/dashboard/provider/services/create">
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Service
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-1/3">
          <Select 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="moving">Moving</SelectItem>
              <SelectItem value="painting">Painting</SelectItem>
              <SelectItem value="landscaping">Landscaping</SelectItem>
              <SelectItem value="tutoring">Tutoring</SelectItem>
              <SelectItem value="home">Home Services</SelectItem>
              <SelectItem value="errand">Errands</SelectItem>
              <SelectItem value="professional">Professional Services</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="transport">Transportation</SelectItem>
              <SelectItem value="health">Health & Wellness</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredServices.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-xl">
          <p className="text-muted-foreground">No services found. Create your first service to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="overflow-hidden h-full flex flex-col">
              {service.image ? (
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    variant={service.isActive ? "default" : "secondary"}
                    className="absolute top-2 right-2"
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ) : (
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  <Badge 
                    variant={service.isActive ? "default" : "secondary"}
                    className="absolute top-2 right-2"
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {getCategoryIcon(service.category as string)}
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-1 mb-1">
                  {getCategoryIcon(service.category as string)}
                  <span className="text-xs text-muted-foreground">
                    {formatCategory(service.category as ServiceCategory)}
                  </span>
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="flex-grow pb-2">
                <p className="text-muted-foreground line-clamp-3 text-sm">
                  {service.description}
                </p>
                <p className="mt-3 font-semibold">
                  {formatPrice(service.price, service.pricingModel as PricingModel)}
                </p>
              </CardContent>
              
              <CardFooter className="pt-2 border-t">
                <div className="w-full flex justify-between">
                  <Link to={`/dashboard/services/${service.id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                  <Link to={`/dashboard/services/${service.id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
