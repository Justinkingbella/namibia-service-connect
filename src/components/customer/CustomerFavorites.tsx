
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Heart, Star, Calendar, MapPin, Clock } from 'lucide-react';
import { ServiceCategory } from '@/types/service';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface FavoriteService {
  id: string;
  title: string;
  providerName: string;
  providerId: string;
  category: ServiceCategory;
  rating: number;
  reviewCount: number;
  price: number;
  pricingModel: 'hourly' | 'fixed';
  location: string;
  image: string;
}

const mockFavorites: FavoriteService[] = [
  {
    id: '1',
    title: 'Professional Home Cleaning',
    providerName: 'CleanHome Pro',
    providerId: 'p1',
    category: 'cleaning',
    rating: 4.8,
    reviewCount: 124,
    price: 250,
    pricingModel: 'hourly',
    location: 'Windhoek, Namibia',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1350',
  },
  {
    id: '2',
    title: 'Emergency Plumbing Services',
    providerName: 'Plumb Perfect',
    providerId: 'p2',
    category: 'plumbing',
    rating: 4.6,
    reviewCount: 89,
    price: 350,
    pricingModel: 'fixed',
    location: 'Windhoek, Namibia',
    image: 'https://images.unsplash.com/photo-1573600073955-f15b3b6caab7?q=80&w=1350',
  },
  {
    id: '3',
    title: 'Errand Running & Delivery',
    providerName: 'Swift Errands',
    providerId: 'p3',
    category: 'errand',
    rating: 4.9,
    reviewCount: 56,
    price: 150,
    pricingModel: 'hourly',
    location: 'Windhoek, Namibia',
    image: 'https://images.unsplash.com/photo-1568010567469-8622db8079bf?q=80&w=1350',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  cleaning: 'Cleaning',
  plumbing: 'Plumbing',
  errand: 'Errands',
  professional: 'Professional',
  freelance: 'Freelance',
  transport: 'Transport',
  health: 'Health',
  home: 'Home Services',
  repair: 'Repairs',
  electrical: 'Electrical',
  moving: 'Moving',
  painting: 'Painting',
  landscaping: 'Landscaping',
  tutoring: 'Tutoring',
  all: 'All Categories'
};

const CustomerFavorites: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = React.useState<FavoriteService[]>(mockFavorites);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
    toast({
      title: "Removed from favorites",
      description: "Service has been removed from your favorites",
    });
  };

  const bookService = (id: string) => {
    navigate(`/dashboard/services/${id}`);
  };

  if (favorites.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <Heart className="h-10 w-10 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">No favorites yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You haven't added any services to your favorites yet. Browse services to find and save your favorites.
        </p>
        <Button as="a" href="/dashboard/services" className="mt-4">
          Browse Services
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((service) => (
          <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <div style={{ 
                backgroundImage: `url(${service.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '160px'
              }} className="w-full">
              </div>
              <button 
                className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm"
                onClick={() => removeFavorite(service.id)}
              >
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
              </button>
              <Badge className="absolute top-2 left-2 bg-white/80 text-black">
                {CATEGORY_LABELS[service.category] || service.category}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1 hover:text-primary cursor-pointer"
                onClick={() => navigate(`/dashboard/services/${service.id}`)}
              >
                {service.title}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-2">
                {service.providerName}
              </p>
              
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{service.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground ml-1">
                  ({service.reviewCount} reviews)
                </span>
                <div className="flex items-center ml-auto">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="ml-1 text-xs text-muted-foreground">{service.location}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">N${service.price}</span>
                  {service.pricingModel === 'hourly' && (
                    <span className="text-xs text-muted-foreground">/hour</span>
                  )}
                </div>
                
                <Button size="sm" onClick={() => bookService(service.id)}>
                  <Calendar className="mr-1 h-4 w-4" /> Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerFavorites;
