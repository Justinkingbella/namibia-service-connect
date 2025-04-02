
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceCard } from '@/components/dashboard/ServiceCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceListItem, ServiceCategory } from '@/types/service';
import { Heart, Loader2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

const FavoritesPage = () => {
  const { favorites, loading } = useFavorites();
  
  // Transform favorites to ServiceListItem for the ServiceCard component
  const favoriteServices: ServiceListItem[] = favorites.map(fav => {
    if (!fav.service) {
      // Fallback for favorites without service data
      return {
        id: fav.serviceId,
        title: 'Unknown Service',
        description: '',
        category: 'other' as ServiceCategory,
        pricingModel: 'fixed',
        price: 0,
        providerName: 'Unknown Provider',
        providerId: '',
        rating: 0,
        reviewCount: 0,
        image: '/placeholder.svg',
        location: '',
      };
    }
    
    // Map service data to ServiceListItem
    return {
      id: fav.service.id,
      title: fav.service.title,
      description: fav.service.description || '',
      category: fav.service.category,
      pricingModel: fav.service.pricingModel,
      price: fav.service.price,
      providerName: fav.service.providerName || '',
      providerId: fav.service.providerId,
      rating: fav.service.rating || 0,
      reviewCount: fav.service.reviewCount || 0,
      image: fav.service.image || '/placeholder.svg',
      location: fav.service.location || 'Unknown Location',
    };
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
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading favorites...</span>
              </div>
            ) : favoriteServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteServices.map((service) => (
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
              {loading ? (
                <div className="flex justify-center items-center p-12 col-span-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading favorites...</span>
                </div>
              ) : favoriteServices.filter(s => s.category === 'home' || s.category === 'cleaning' || s.category === 'repair').length > 0 ? (
                favoriteServices.filter(s => s.category === 'home' || s.category === 'cleaning' || s.category === 'repair').map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))
              ) : (
                <div className="col-span-full">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">No home services in favorites</CardTitle>
                      <CardDescription className="text-center">
                        Browse home services and add some to your favorites
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="errand" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="flex justify-center items-center p-12 col-span-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading favorites...</span>
                </div>
              ) : favoriteServices.filter(s => s.category === 'errand' || s.category === 'moving' || s.category === 'transport').length > 0 ? (
                favoriteServices.filter(s => s.category === 'errand' || s.category === 'moving' || s.category === 'transport').map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))
              ) : (
                <div className="col-span-full">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">No errand services in favorites</CardTitle>
                      <CardDescription className="text-center">
                        Browse errand services and add some to your favorites
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FavoritesPage;
