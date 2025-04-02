
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ServiceCard } from '@/components/dashboard/ServiceCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ServiceCategory, ServiceListItem } from '@/types/service';
import { Search } from 'lucide-react';

const servicesList: ServiceListItem[] = [
  {
    id: '1',
    title: 'Professional Home Cleaning',
    description: 'Thorough cleaning services for your home by professionals',
    category: 'home',
    pricingModel: 'hourly',
    price: 250,
    providerName: 'CleanHome Pro',
    providerId: 'p1',
    rating: 4.8,
    reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1350',
    location: 'Windhoek, Namibia',
  },
  {
    id: '2',
    title: 'Emergency Plumbing Services',
    description: 'Quick response plumbing repairs available 24/7',
    category: 'home',
    pricingModel: 'fixed',
    price: 350,
    providerName: 'Plumb Perfect',
    providerId: 'p2',
    rating: 4.6,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1573600073955-f15b3b6caab7?q=80&w=1350',
    location: 'Windhoek, Namibia',
  },
  {
    id: '3',
    title: 'Errand Running & Delivery',
    description: 'Let us handle your errands while you focus on what matters',
    category: 'errand',
    pricingModel: 'hourly',
    price: 150,
    providerName: 'Swift Errands',
    providerId: 'p3',
    rating: 4.9,
    reviewCount: 56,
    image: 'https://images.unsplash.com/photo-1568010567469-8622db8079bf?q=80&w=1350',
    location: 'Windhoek, Namibia',
  },
  {
    id: '4',
    title: 'Graphic Design Services',
    description: 'Creative design solutions for your business needs',
    category: 'freelance',
    pricingModel: 'fixed',
    price: 500,
    providerName: 'Creative Minds',
    providerId: 'p4',
    rating: 4.7,
    reviewCount: 72,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1350',
    location: 'Windhoek, Namibia',
  },
  {
    id: '5',
    title: 'Medical Consultation',
    description: 'Online health consultations with licensed doctors',
    category: 'health',
    pricingModel: 'hourly',
    price: 400,
    providerName: 'HealthConnect',
    providerId: 'p5',
    rating: 4.9,
    reviewCount: 108,
    image: 'https://images.unsplash.com/photo-1666214277730-e9c7e7e7956a?q=80&w=1350',
    location: 'Windhoek, Namibia',
  },
  {
    id: '6',
    title: 'Airport Transportation',
    description: 'Reliable airport pickup and drop-off services',
    category: 'transport',
    pricingModel: 'fixed',
    price: 200,
    providerName: 'Reliable Rides',
    providerId: 'p6',
    rating: 4.8,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1613000632863-f0752c6342e9?q=80&w=1350',
    location: 'Windhoek, Namibia',
  },
];

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  all: 'All Categories',
  home: 'Home Services',
  errand: 'Errands',
  professional: 'Professional Services',
  freelance: 'Freelance',
  transport: 'Transportation',
  health: 'Health Services',
  cleaning: 'Cleaning',
  repair: 'Repairs',
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  moving: 'Moving',
  painting: 'Painting',
  landscaping: 'Landscaping',
  tutoring: 'Tutoring'
};

const ServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [filteredServices, setFilteredServices] = useState<ServiceListItem[]>(servicesList);

  useEffect(() => {
    let filtered = servicesList;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.providerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Browse and book services from our trusted providers
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="default"
            onClick={() => setSelectedCategory('all')}
          >
            View All
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ServiceCategory)}>
          <TabsList className="w-full h-auto flex-wrap justify-start">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <TabsTrigger key={key} value={key} className="mb-1">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No services found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search or browse a different category
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ServicesPage;
