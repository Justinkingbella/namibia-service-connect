
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, CirclePlus, Filter, Grid, LayoutGrid, List, Search, SortDesc } from 'lucide-react';
import { ServiceCategoryEnum, Service, ServiceData } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ServiceCard from '@/components/dashboard/ServiceCard';
import { useAuth } from '@/contexts/AuthContext';

// Sample services data
const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Professional House Cleaning',
    description: 'Complete house cleaning service including all rooms and bathrooms.',
    price: 450,
    category: 'CLEANING',
    providerId: 'p1',
    providerName: 'CleanPro Namibia',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80',
    features: ['Deep cleaning', 'Eco-friendly products', 'Same-day service'],
    isActive: true,
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-03-20T14:45:00Z',
    pricingModel: 'FIXED',
    location: 'Windhoek',
    rating: 4.8,
    reviewCount: 125,
    tags: ['cleaning', 'house', 'professional']
  },
  {
    id: '2',
    title: 'Plumbing Repair Services',
    description: 'Professional plumbing repair services for residential and commercial properties.',
    price: 350,
    category: 'PLUMBING',
    providerId: 'p2',
    providerName: 'FixIt Pro Plumbers',
    image: 'https://images.unsplash.com/photo-1606274016746-2da05ca37127?auto=format&fit=crop&q=80',
    features: ['Emergency service', '1-year warranty', 'Free estimates'],
    isActive: true,
    createdAt: '2023-02-10T08:20:00Z',
    updatedAt: '2023-04-05T11:30:00Z',
    pricingModel: 'HOURLY',
    location: 'Walvis Bay',
    rating: 4.6,
    reviewCount: 89,
    tags: ['plumbing', 'repair', 'emergency']
  },
  {
    id: '3',
    title: 'Electrical Installation',
    description: 'Complete electrical installation and repair services for homes and businesses.',
    price: 575,
    category: 'ELECTRICAL',
    providerId: 'p3',
    providerName: 'ElectroPro Services',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45249f78a?auto=format&fit=crop&q=80',
    features: ['Licensed electricians', '24/7 emergency service', 'Safety certified'],
    isActive: true,
    createdAt: '2023-01-25T12:15:00Z',
    updatedAt: '2023-03-18T09:40:00Z',
    pricingModel: 'FIXED',
    location: 'Swakopmund',
    rating: 4.9,
    reviewCount: 78,
    tags: ['electrical', 'installation', 'repair']
  },
  {
    id: '4',
    title: 'Professional Moving Services',
    description: 'Full-service moving company for local and long-distance relocations.',
    price: 1200,
    category: 'MOVING',
    providerId: 'p4',
    providerName: 'Swift Movers Namibia',
    image: 'https://images.unsplash.com/photo-1600518858246-6219bb1838ea?auto=format&fit=crop&q=80',
    features: ['Packing services', 'Furniture assembly', 'Insurance coverage'],
    isActive: true,
    createdAt: '2023-02-05T14:20:00Z',
    updatedAt: '2023-04-10T10:15:00Z',
    pricingModel: 'FIXED',
    location: 'Windhoek',
    rating: 4.7,
    reviewCount: 56,
    tags: ['moving', 'relocation', 'transport']
  }
];

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

  // Categories with labels
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
    
    // Apply category filter
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(term) || 
        service.description.toLowerCase().includes(term) ||
        service.providerName.toLowerCase().includes(term) ||
        service.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
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
        {/* Page Header */}
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
        
        {/* Filters and Search */}
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
                    <Grid className="h-4 w-4" />
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
        
        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'}
        </div>
        
        {/* Services List */}
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
