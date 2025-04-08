import React, { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useFavorites } from '@/hooks/useFavorites';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, X, Loader2 } from 'lucide-react';

const FavoritesPage = () => {
  const { favorites, loading, fetchFavorites, removeFavorite } = useFavorites();

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemoveFavorite = async (serviceId: string) => {
    await removeFavorite(serviceId);
  };

  // In the render section where you're mapping over favorites
const renderFavorites = () => {
  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">You haven't added any services to your favorites yet.</p>
        <Link to="/services">
          <Button>Browse Services</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {favorites.map((favorite) => {
        // Make sure we have a service
        if (!favorite.service) return null;
        
        // Use service properties
        const service = favorite.service;
        
        return (
          <Card key={favorite.id} className="overflow-hidden flex flex-col h-full">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <img 
                  src={service.image || '/placeholder-service.jpg'} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 rounded-full" 
                  onClick={() => handleRemoveFavorite(favorite.service_id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove from favorites</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{service.category}</Badge>
                <div className="flex items-center text-sm">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{service.rating || 'New'}</span>
                  {service.reviewCount > 0 && (
                    <span className="ml-1 text-muted-foreground">({service.reviewCount})</span>
                  )}
                </div>
              </div>
              <Link to={`/services/${favorite.service_id}`}>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors">{service.title}</h3>
              </Link>
              <div className="text-muted-foreground mt-1 text-sm flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{service.location || 'Not specified'}</span>
              </div>
              <div className="mt-2 text-sm line-clamp-2">{service.description}</div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <div>
                <span className="font-bold">${service.price}</span>
                <span className="text-muted-foreground ml-1 text-xs">/ {service.pricingModel || 'service'}</span>
              </div>
              <Link to={`/services/${favorite.service_id}`}>
                <Button variant="default" size="sm">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Favorite Services</h1>
          <p className="text-muted-foreground mt-1">
            Here are the services you've saved for later.
          </p>
        </div>
        {renderFavorites()}
      </div>
    </DashboardLayout>
  );
};

export default FavoritesPage;
