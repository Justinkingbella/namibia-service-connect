
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ServiceCard from '@/components/dashboard/ServiceCard';
import { Search, Filter, MapPin } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceCategory, ServiceListItem } from '@/types';

// Mock data for services
const mockServices: ServiceListItem[] = [
  {
    id: '1',
    title: 'Professional Home Cleaning',
    category: 'home',
    pricingModel: 'hourly',
    price: 250,
    providerName: 'CleanHome Pro',
    providerId: '1',
    rating: 4.8,
    reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    location: 'Windhoek, Namibia'
  },
  {
    id: '2',
    title: 'Emergency Plumbing Services',
    category: 'home',
    pricingModel: 'fixed',
    price: 350,
    providerName: 'Plumb Perfect',
    providerId: '2',
    rating: 4.6,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1573600073955-f15b3b6caab7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    location: 'Windhoek, Namibia'
  },
  {
    id: '3',
    title: 'Errand Running & Delivery',
    category: 'errand',
    pricingModel: 'hourly',
    price: 150,
    providerName: 'Swift Errands',
    providerId: '3',
    rating: 4.9,
    reviewCount: 56,
    image: 'https://images.unsplash.com/photo-1568010567469-8622db8079bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    location: 'Windhoek, Namibia'
  },
  {
    id: '4',
    title: 'Graphic Design Services',
    category: 'freelance',
    pricingModel: 'fixed',
    price: 500,
    providerName: 'Creative Solutions',
    providerId: '4',
    rating: 4.7,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    location: 'Swakopmund, Namibia'
  },
  {
    id: '5',
    title: 'Personal Fitness Training',
    category: 'health',
    pricingModel: 'hourly',
    price: 300,
    providerName: 'FitLife Trainers',
    providerId: '5',
    rating: 4.9,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    location: 'Windhoek, Namibia'
  },
  {
    id: '6',
    title: 'Moving & Transportation',
    category: 'transport',
    pricingModel: 'fixed',
    price: 800,
    providerName: 'Quick Movers',
    providerId: '6',
    rating: 4.5,
    reviewCount: 65,
    image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    location: 'Walvis Bay, Namibia'
  }
];

// Categories for filtering
const categories: { value: ServiceCategory; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'home', label: 'Home Services' },
  { value: 'errand', label: 'Errands' },
  { value: 'professional', label: 'Professional Services' },
  { value: 'freelance', label: 'Freelance Services' },
  { value: 'transport', label: 'Transportation' },
  { value: 'health', label: 'Health & Wellness' }
];

const ServicesPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter services based on search, category, price range and location
  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.providerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    
    const matchesPrice = service.price >= priceRange.min && service.price <= priceRange.max;
    
    const matchesLocation = location === '' || 
      service.location.toLowerCase().includes(location.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesPrice && matchesLocation;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Browse Services</h1>
          <p className="text-muted-foreground mt-1">Find and book services in Namibia</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for services, providers..."
              className="block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button 
            className="md:w-auto"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </Button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory)}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price Range</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="w-full p-2 border rounded-lg"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                  min={0}
                />
                <span>-</span>
                <input 
                  type="number" 
                  placeholder="Max"
                  className="w-full p-2 border rounded-lg"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                  min={0}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Enter location" 
                  className="block w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.length > 0 ? (
            filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <div className="col-span-3 py-12 text-center">
              <p className="text-lg text-gray-500">No services found matching your criteria.</p>
              <Button 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange({ min: 0, max: 1000 });
                  setLocation('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServicesPage;
