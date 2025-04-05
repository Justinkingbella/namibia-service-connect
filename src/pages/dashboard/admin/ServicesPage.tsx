
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ServiceCard } from '@/components/dashboard/ServiceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Plus,
  Filter,
  Check,
  X,
  Settings,
  MoreHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

const mockServices = [
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
    isActive: true,
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
    isActive: true,
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
    isActive: false,
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
    isActive: true,
  },
];

const AdminServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.providerName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Services Management</h1>
            <p className="text-muted-foreground">
              Review, approve and manage all services on the platform
            </p>
          </div>

          <div className="flex flex-row gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode('list')}>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              List
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode('grid')}>
              <Settings className="mr-2 h-4 w-4" />
              Grid
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setSelectedCategory('all')}>
                  All Categories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('home')}>
                  Home Services
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('errand')}>
                  Errand Services
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('freelance')}>
                  Freelance Services
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}>
              Reset Filters
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Services</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Details</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-md overflow-hidden">
                              <img 
                                src={service.image} 
                                alt={service.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{service.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {service.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {service.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{service.providerName}</TableCell>
                        <TableCell>
                          N${service.price} 
                          <span className="text-xs text-muted-foreground">
                            /{service.pricingModel === 'hourly' ? 'hr' : 'fixed'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {service.isActive ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <Check className="h-3 w-3 mr-1" /> Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <X className="h-3 w-3 mr-1" /> Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Service</DropdownMenuItem>
                              <DropdownMenuItem>
                                {service.isActive ? 'Deactivate' : 'Activate'}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminServicesPage;
