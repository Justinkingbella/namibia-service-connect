
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { Loader2, Heart, Star, MapPin, Calendar, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, loading, removeFavorite } = useFavorites();
  const { toast } = useToast();
  const [tab, setTab] = React.useState('all');

  const handleRemoveFavorite = async (serviceId: string) => {
    const success = await removeFavorite(serviceId);
    if (success) {
      toast({
        title: 'Removed from favorites',
        description: 'Service has been removed from your favorites'
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to remove service from favorites',
        variant: 'destructive'
      });
    }
  };

  const filteredFavorites = React.useMemo(() => {
    if (tab === 'all') return favorites;
    return favorites.filter(fav => {
      if (!fav.service) return false;
      return fav.service.category.toLowerCase() === tab;
    });
  }, [favorites, tab]);

  const categories = React.useMemo(() => {
    const uniqueCategories = new Set<string>();
    favorites.forEach(fav => {
      if (fav.service?.category) {
        uniqueCategories.add(fav.service.category.toLowerCase());
      }
    });
    return Array.from(uniqueCategories);
  }, [favorites]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Favorite Services</h1>
          <p className="text-muted-foreground">Services you've saved for easy access</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex justify-between mt-4">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No favorites yet</AlertTitle>
            <AlertDescription>
              You haven't added any services to your favorites yet. Browse our services to add some favorites.
            </AlertDescription>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/services')}
              className="mt-4"
            >
              Browse Services
            </Button>
          </Alert>
        ) : (
          <>
            <Tabs defaultValue="all" value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="overflow-x-auto flex-nowrap mb-6">
                <TabsTrigger value="all">All Categories</TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={tab} className="mt-0">
                {filteredFavorites.length === 0 ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No favorites in this category</AlertTitle>
                    <AlertDescription>
                      You don't have any favorites in this category.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFavorites.map((favorite) => (
                      <Card key={favorite.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        {favorite.service && (
                          <>
                            <div className="relative">
                              <div 
                                className="h-40 bg-cover bg-center" 
                                style={{ backgroundImage: `url(${favorite.service.image || 'https://via.placeholder.com/300x150'})` }}
                              />
                              <button 
                                onClick={() => handleRemoveFavorite(favorite.service_id)}
                                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-red-50"
                              >
                                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                              </button>
                              <Badge className="absolute top-2 left-2 bg-black/60 text-white">
                                {favorite.service.category}
                              </Badge>
                            </div>
                            
                            <CardContent className="p-4">
                              <h3 
                                className="font-semibold text-lg mb-1 hover:text-primary cursor-pointer truncate"
                                onClick={() => navigate(`/dashboard/services/${favorite.service_id}`)}
                              >
                                {favorite.service.title}
                              </h3>
                              
                              <p className="text-muted-foreground text-sm mb-2 truncate">
                                {favorite.service.providerName}
                              </p>
                              
                              <div className="flex items-center mb-3">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  <span className="ml-1 text-sm font-medium">{favorite.service.rating || 'New'}</span>
                                </div>
                                {favorite.service.reviewCount && (
                                  <span className="text-xs text-muted-foreground ml-1">
                                    ({favorite.service.reviewCount} reviews)
                                  </span>
                                )}
                                {favorite.service.location && (
                                  <div className="flex items-center ml-auto">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span className="ml-1 text-xs text-muted-foreground truncate max-w-[100px]">
                                      {favorite.service.location}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                            
                            <CardFooter className="p-4 pt-0 flex justify-between items-center border-t">
                              <div>
                                <span className="font-semibold">N${favorite.service.price}</span>
                                {favorite.service.pricingModel === 'HOURLY' && (
                                  <span className="text-xs text-muted-foreground">/hour</span>
                                )}
                              </div>
                              
                              <Button size="sm" onClick={() => navigate(`/dashboard/services/${favorite.service_id}`)}>
                                <Calendar className="mr-1 h-4 w-4" /> Book Now
                              </Button>
                            </CardFooter>
                          </>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FavoritesPage;
