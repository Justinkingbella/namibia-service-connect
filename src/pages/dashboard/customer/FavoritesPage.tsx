
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Heart, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { formatCurrency } from '@/lib/formatters';

const FavoritesPage: React.FC = () => {
  const { favorites, loading, removeFavorite } = useFavorites();
  const navigate = useNavigate();
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const handleViewService = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  const handleRemoveFavorite = async (service_id: string) => {
    setRemovingIds(prev => new Set(prev).add(service_id));
    await removeFavorite(service_id);
    setRemovingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(service_id);
      return newSet;
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">My Favorites</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse h-64">
                <CardContent className="h-full p-0 flex flex-col">
                  <div className="h-1/2 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Favorites</h1>
        
        {favorites.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-4">You haven't added any services to your favorites</p>
            <Button onClick={() => navigate('/services')}>Browse Services</Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => {
              // Make sure we have the service object
              if (!favorite.service) return null;
              
              // Make the service props work with camelCase or snake_case
              const service = favorite.service;
              const serviceCategory = service.category || "Unknown";
              const servicePricingModel = service.pricingModel || service.pricing_model || "Fixed";
              const servicePrice = service.price;
              const serviceProviderName = service.providerName || service.provider_name || "Unknown Provider";
              const serviceProviderId = service.providerId || service.provider_id || "";
              const serviceRating = service.rating || 0;
              const serviceReviewCount = service.reviewCount || service.review_count || 0;
              const serviceImage = service.image;
              const serviceLocation = service.location || "Not specified";
              
              const isRemoving = removingIds.has(favorite.service_id);
              
              return (
                <Card key={favorite.id} className="overflow-hidden border hover:border-primary transition-colors">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative">
                      <div 
                        className="h-40 bg-cover bg-center w-full" 
                        style={{ backgroundImage: `url(${serviceImage || '/placeholder-service.jpg'})` }}
                      />
                      <div className="absolute top-2 right-2">
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFavorite(favorite.service_id);
                          }}
                          disabled={isRemoving}
                          className="h-8 w-8 rounded-full"
                        >
                          {isRemoving ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="space-y-1 mb-2">
                        <h3 className="font-medium line-clamp-1">{service.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium">{formatCurrency(servicePrice)}</span>
                          <span className="text-xs text-muted-foreground">{serviceCategory}</span>
                        </div>
                        
                        <Button 
                          variant="default" 
                          className="w-full"
                          onClick={() => handleViewService(service.id)}
                        >
                          View Service
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FavoritesPage;
