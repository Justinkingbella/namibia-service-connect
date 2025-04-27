
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Grid2X2, List, Search, Plus, CalendarIcon, Star, User, MoreVertical, Pencil, Eye, EyeOff, Trash2 } from 'lucide-react';
import { ServiceCard } from '@/components/dashboard/ServiceCard';
import { ServiceCategoryEnum, Service } from '@/types';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'House Cleaning Service',
    description: 'Complete house cleaning service for all size homes.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1350',
    provider_id: 'p1',
    provider_name: 'CleanHome Pro',
    providerId: 'p1',
    providerName: 'CleanHome Pro',
    category: 'cleaning',
    pricingModel: 'hourly',
    rating: 4.8,
    reviewCount: 124,
    location: 'Windhoek, Namibia',
    features: ['Deep cleaning', 'Kitchen', 'Bathroom'],
    isActive: true,
    createdAt: '2023-05-15',
    updatedAt: '2023-06-10',
    tags: ['cleaning', 'home']
  },
  {
    id: '2',
    title: 'Emergency Plumbing Service',
    description: 'Available 24/7 for all your plumbing emergencies.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1573600073955-f15b3b6caab7?q=80&w=1350',
    provider_id: 'p2',
    provider_name: 'PlumbRight',
    providerId: 'p2',
    providerName: 'PlumbRight',
    category: 'plumbing',
    pricingModel: 'fixed',
    rating: 4.6,
    reviewCount: 89,
    location: 'Windhoek, Namibia',
    features: ['Emergency', '24/7', 'Certified'],
    isActive: true,
    createdAt: '2023-06-20',
    updatedAt: '2023-06-25',
    tags: ['plumbing', 'emergency']
  }
];

const ServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [filteredServices, setFilteredServices] = useState<Service[]>(MOCK_SERVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(ServiceCategoryEnum.CLEANING);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest');
  const [categoryFilter, setCategoryFilter] = useState<string>(ServiceCategoryEnum.CLEANING);

  const isAdmin = true;
  const isProvider = false;

  const categories: Record<string, string> = {
    [ServiceCategoryEnum.CLEANING]: 'Cleaning',
    [ServiceCategoryEnum.PLUMBING]: 'Plumbing',
    [ServiceCategoryEnum.ELECTRICAL]: 'Electrical',
    [ServiceCategoryEnum.GARDENING]: 'Gardening',
    [ServiceCategoryEnum.MOVING]: 'Moving',
    [ServiceCategoryEnum.REPAIRS]: 'Repairs',
    [ServiceCategoryEnum.TUTORING]: 'Tutoring',
    [ServiceCategoryEnum.CONSTRUCTION]: 'Construction',
    [ServiceCategoryEnum.EVENT_PLANNING]: 'Event Planning',
    [ServiceCategoryEnum.INTERIOR_DESIGN]: 'Interior Design',
    [ServiceCategoryEnum.OTHER]: 'Other',
    'all': 'All Services'
  };

  useEffect(() => {
    filterServices();
  }, [searchTerm, selectedCategory, sortBy]);

  const filterServices = () => {
    let filtered = [...services];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(term) || 
        service.description.toLowerCase().includes(term) ||
        service.providerName.toLowerCase().includes(term) ||
        (service.tags && service.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
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
    setSelectedCategory(ServiceCategoryEnum.CLEANING);
    setSortBy('newest');
  };

  const handleCreateServiceClick = () => {
    navigate('/provider/services/create');
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
  };

  const renderCategoryBadge = (category: string) => {
    return (
      <Badge className="bg-blue-500 text-white">
        {categories[category]}
      </Badge>
    );
  };

  const renderServiceCard = (service: Service) => {
    return (
      <Card key={service.id} className="overflow-hidden">
        <div className="relative h-48">
          <img
            src={service.image || '/placeholder.svg'}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          {service.featured && (
            <Badge className="absolute top-2 right-2 bg-yellow-500">Featured</Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="text-sm text-gray-500 truncate">
                {service.location || 'Location not specified'}
              </p>
            </div>
            <Badge variant={service.isActive ? 'default' : 'secondary'}>
              {service.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          <div className="mb-2">{renderCategoryBadge(service.category)}</div>
          
          <p className="text-sm line-clamp-2 mb-3">{service.description}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{service.rating || 'No ratings'}</span>
              {service.reviewCount > 0 && (
                <span className="text-xs text-gray-500 ml-1">({service.reviewCount})</span>
              )}
            </div>
            <p className="font-bold">N${service.price}</p>
          </div>
          
          <div className="mt-3 text-sm text-gray-500 flex items-center">
            <User className="h-3 w-3 mr-1" />
            {service.providerName || 'Unknown Provider'}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => handleView(service.id)}
          >
            View Details
          </Button>
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(service.id)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleStatus(service.id, !service.isActive)}>
                  {service.isActive ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600" 
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardFooter>
      </Card>
    );
  };

  const handleView = (id: string) => {
    navigate(`/customer/services/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/provider/services/${id}/edit`);
  };

  const handleToggleStatus = (id: string, isActive: boolean) => {
    // Implement status toggle logic here
  };

  const handleDelete = (id: string) => {
    // Implement delete logic here
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
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
            <p className="text-muted-foreground">{pageDescription}</p>
          </div>
          
          {isProvider && (
            <Button onClick={handleCreateServiceClick} className="flex-shrink-0">
              <Plus className="mr-2 h-4 w-4" />
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
                  onValueChange={(value) => setSelectedCategory(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(categories).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {categories[cat]}
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
            <CalendarIcon className="h-10 w-10 text-muted-foreground mb-3" />
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
                service={{
                  id: service.id,
                  title: service.title,
                  description: service.description,
                  price: service.price,
                  image: service.image,
                  category: service.category,
                  rating: service.rating,
                  review_count: service.reviewCount,
                  provider_id: service.providerId || service.provider_id,
                  provider_name: service.providerName || service.provider_name,
                  location: service.location,
                  pricing_model: service.pricingModel,
                  is_active: service.isActive
                }}
                actionLink={
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
    </div>
  );
};

export default ServicesPage;
