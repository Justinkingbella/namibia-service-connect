
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { FavoriteService } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Heart, Trash2, Loader2, Star, MapPin, Tag } from 'lucide-react';
import { toast } from 'sonner';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, loading, removeFavorite, refreshFavorites } = useFavorites();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemoveFavorite = async (serviceId: string) => {
    setRemovingId(serviceId);
    try {
      const result = await removeFavorite(serviceId);
      if (result) {
        toast.success('Service removed from favorites');
      } else {
        toast.error('Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('An error occurred while removing the service from favorites');
    } finally {
      setRemovingId(null);
    }
  };

  const handleServiceClick = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Favorites</h1>
          <p className="text-muted-foreground mt-1">Services you've saved for future reference</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Saved Services</CardTitle>
            <CardDescription>
              View and manage your favorite services
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mt-4">No favorites yet</h3>
                <p className="text-muted-foreground mt-1 mb-6">
                  Services you save will appear here for quick access
                </p>
                <Button onClick={() => navigate('/services')}>
                  Browse Services
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((favorite) => (
                  <Card key={favorite.id} className="overflow-hidden">
                    {favorite.service && (
                      <>
                        <div 
                          className="h-40 bg-cover bg-center cursor-pointer"
                          style={{ backgroundImage: `url(${favorite.service.image || '/placeholder.svg'})` }}
                          onClick={() => handleServiceClick(favorite.service?.id || '')}
                        ></div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg truncate">{favorite.service.title}</h3>
                          <p className="text-primary font-semibold my-1">{formatCurrency(favorite.service.price)}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Tag className="h-4 w-4 mr-1" />
                              {favorite.service.pricingModel || 'Fixed Price'}
                            </div>
                            <div className="flex items-center text-sm">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              {favorite.service.rating || 'N/A'} 
                              {favorite.service.reviewCount ? `(${favorite.service.reviewCount})` : ''}
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {favorite.service.location || 'Location not specified'}
                          </div>
                          
                          <div className="flex justify-between items-center mt-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleServiceClick(favorite.service?.id || '')}
                            >
                              View Details
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveFavorite(favorite.serviceId)}
                              disabled={removingId === favorite.serviceId}
                            >
                              {removingId === favorite.serviceId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FavoritesPage;
