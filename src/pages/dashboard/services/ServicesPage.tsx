import React, { useEffect, useState } from 'react';
import { useServiceStore } from '@/store/serviceStore';
import { useAuth } from '@/contexts/AuthContext';
import { Service } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Grid2X2, List, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ServiceCategoryEnum } from '@/types';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  asLink?: boolean;
  linkTo?: string;
  key?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, asLink = false, linkTo = '' }) => {
  const content = (
    <div className={cn("group cursor-pointer")}>
      <div className="aspect-video relative rounded-md overflow-hidden mb-3">
        {service.image ? (
          <img 
            src={service.image} 
            alt={service.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="bg-muted w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <span className="bg-background/80 text-foreground text-xs font-medium px-2 py-1 rounded-full">
            ${service.price.toFixed(2)}
          </span>
        </div>
      </div>
      <h3 className="font-medium text-md group-hover:text-primary transition-colors line-clamp-1">
        {service.title}
      </h3>
      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
        {service.description}
      </p>
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs">
          {service.category}
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          {service.rating ? (
            <>
              <span className="mr-1">★</span>
              <span>{service.rating.toFixed(1)}</span>
            </>
          ) : (
            <span>New</span>
          )}
        </div>
      </div>
    </div>
  );

  if (asLink && linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
};

const ServicesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [filteredServices, setFilteredServices] = useState<Service[]>(MOCK_SERVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof ServiceCategoryEnum>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest');
  
  const isAdmin = user?.role === 'admin';
  const isProvider = user?.role === 'provider';

  const categories: Record<keyof typeof ServiceCategoryEnum, string> = {
    HOME: 'Home Services',
    CLEANING: 'Cleaning',
    REPAIR: 'Repair',
    PLUMBING: 'Plumbing',
    ELECTRICAL: 'Electrical',
    MOVING: 'Moving',
    PAINTING: 'Painting',
    LANDSCAPING: 'Landscaping',
    TUTORING: 'Tutoring',
    ERRAND: 'Errands',
    PROFESSIONAL: 'Professional',
    FREELANCE: 'Freelance',
    TRANSPORT: 'Transport',
    HEALTH: 'Health',
    ALL: 'All Services'
  };

  useEffect(() => {
    filterServices();
  }, [searchTerm, selectedCategory, sortBy]);

  const filterServices = () => {
    let filtered = [...services];
    
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(term) || 
        service.description.toLowerCase().includes(term) ||
        service.providerName.toLowerCase().includes(term) ||
        service.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    
    setFilteredServices(filtered);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSortBy('newest');
  };

  const handleCreateServiceClick = () => {
    navigate('/provider/services/create');
  };

  const pageTitle = isProvider 
    ? "My Services" 
    : isAdmin 
      ? "Manage Services" 
      : "Browse Services";

  const pageDescription = isProvider 
    ? "Create and manage your service listings" 
    : isAdmin 
      ? "Admin panel for monitoring and managing service listings"
      : "Find and book services that you need";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
            <p className="text-muted-foreground">{pageDescription}</p>
          </div>
          
          {isProvider && (
            <Button onClick={handleCreateServiceClick} className="flex-shrink-0">
              <CirclePlus className="mr-2 h-4 w-4" />
              Create Service
            </Button>
          )}
          
          {isAdmin && (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/admin/category-management">
                  Manage Categories
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/services">
                  Service Controls
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search services..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as keyof typeof ServiceCategoryEnum)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(categories).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {categories[cat as keyof typeof ServiceCategoryEnum]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as typeof sortBy)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none rounded-l-md"
                  >
                    <Grid2X2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'} 
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="rounded-none rounded-r-md"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-sm text-muted-foreground">
          Showing {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'}
        </div>
        
        {filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-muted rounded-lg">
            <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="font-medium text-lg mb-1">No services found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search term</p>
            <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredServices.map((service) => (
              <ServiceCard 
                key={service.id}
                service={service}
                viewMode={viewMode}
                asLink={!isProvider || isAdmin}
                linkTo={
                  isAdmin 
                    ? `/admin/services/${service.id}`
                    : isProvider 
                      ? `/provider/services/${service.id}`
                      : `/customer/services/${service.id}`
                }
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ServicesPage;
