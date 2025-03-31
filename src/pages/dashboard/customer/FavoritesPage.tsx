
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceCard } from '@/components/dashboard/ServiceCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceListItem } from '@/types/service';
import { Heart } from 'lucide-react';

// Mock data for favorites
const mockFavoriteServices: ServiceListItem[] = [
  {
    id: '1',
    title: 'House Cleaning',
    category: 'home',
    pricingModel: 'hourly',
    price: 25,
    providerName: 'CleanPro Services',
    providerId: 'prov1',
    rating: 4.8,
    reviewCount: 156,
    image: '/placeholder.svg',
    location: 'Windhoek',
    description: 'Professional house cleaning services for all your needs.',
  },
  {
    id: '2',
    title: 'Plumbing Repair',
    category: 'home',
    pricingModel: 'fixed',
    price: 80,
    providerName: 'Pipe Masters',
    providerId: 'prov2',
    rating: 4.6,
    reviewCount: 89,
    image: '/placeholder.svg',
    location: 'Windhoek',
    description: 'Expert plumbing repair services.',
  },
  {
    id: '3',
    title: 'Grocery Delivery',
    category: 'errand',
    pricingModel: 'fixed',
    price: 15,
    providerName: 'Quick Deliveries',
    providerId: 'prov3',
    rating: 4.9,
    reviewCount: 210,
    image: '/placeholder.svg',
    location: 'Swakopmund',
    description: 'Fast and reliable grocery delivery service.',
  },
];

const FavoritesPage = () => {
  // In a real app, we would fetch the user's favorites from an API
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => Promise.resolve(mockFavoriteServices),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
          <p className="text-muted-foreground">
            View and manage your favorite services
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Favorites</TabsTrigger>
            <TabsTrigger value="recent">Recently Used</TabsTrigger>
            <TabsTrigger value="home">Home Services</TabsTrigger>
            <TabsTrigger value="errand">Errands</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-0">
                      <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : favorites && favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center h-24">
                    <Heart size={48} className="text-gray-300" />
                  </div>
                  <CardTitle className="text-center">No favorites yet</CardTitle>
                  <CardDescription className="text-center">
                    Browse services and save your favorites for quick access later
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recently Used Services</CardTitle>
                <CardDescription>Services you've booked recently</CardDescription>
              </CardHeader>
              <CardContent>
                <p>You haven't used any services recently.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="home" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites?.filter(s => s.category === 'home').map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="errand" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites?.filter(s => s.category === 'errand').map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FavoritesPage;
