
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

    // Check if already in favorites
    if (favorites.some(fav => fav.serviceId === serviceId)) {
      toast({
        title: "Already favorited",
        description: "This service is already in your favorites."
      });
      return true;
    }

    setLoading(true);
    const newFavorite = await addFavorite(user.id, serviceId);
    
    if (newFavorite) {
      setFavorites(prev => [...prev, newFavorite]);
      
      toast({
        title: "Added to favorites",
        description: "Service has been added to your favorites."
      });
      
      setLoading(false);
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to add favorite",
      description: "There was an error adding this service to your favorites."
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
        description: "Service has been removed from your favorites."
      });
      
      setLoading(false);
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to remove favorite",
      description: "There was an error removing this service from your favorites."
    });
    
    setLoading(false);
    return false;
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites
  };
}
