
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FavoriteService } from '@/types/favorites';
import { fetchUserFavorites, addFavorite, removeFavorite } from '@/services/mockProfileService';

export function useFavorites() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await fetchUserFavorites(user.id);
      setFavorites(data);
      setLoading(false);
    };

    loadFavorites();
  }, [user?.id]);

  const addToFavorites = async (serviceId: string) => {
    if (!user?.id) return false;

    setLoading(true);
    const success = await addFavorite(user.id, serviceId);
    
    if (success) {
      // Refresh favorites list
      const updatedFavorites = await fetchUserFavorites(user.id);
      setFavorites(updatedFavorites);
      
      toast({
        title: "Added to favorites",
        description: "The service has been added to your favorites."
      });
      setLoading(false);
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to add to favorites",
      description: "There was an error adding the service to your favorites. Please try again."
    });
    
    setLoading(false);
    return false;
  };

  const removeFromFavorites = async (serviceId: string) => {
    if (!user?.id) return false;

    setLoading(true);
    const success = await removeFavorite(user.id, serviceId);
    
    if (success) {
      setFavorites(prev => prev.filter(fav => fav.serviceId !== serviceId));
      
      toast({
        title: "Removed from favorites",
        description: "The service has been removed from your favorites."
      });
      setLoading(false);
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to remove from favorites",
      description: "There was an error removing the service from your favorites. Please try again."
    });
    
    setLoading(false);
    return false;
  };

  const isFavorite = (serviceId: string) => {
    return favorites.some(fav => fav.serviceId === serviceId);
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };
}
