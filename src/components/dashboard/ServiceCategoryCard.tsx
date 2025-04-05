
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceCategoryEnum } from '@/types';
import { 
  Hammer, 
  Lightbulb, 
  Droplets, 
  Home, 
  Truck, 
  Paintbrush2, 
  Sprout, 
  GraduationCap, 
  ShoppingBag, 
  Users2, 
  Briefcase, 
  Car, 
  Heart
} from 'lucide-react';

interface ServiceCategoryCardProps {
  category: string;
  count: number;
  onClick: () => void;
}

const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({ category, count, onClick }) => {
  const getIcon = () => {
    switch (category) {
      case ServiceCategoryEnum.repair:
        return <Hammer className="h-5 w-5 text-orange-600" />;
      case ServiceCategoryEnum.electrical:
        return <Lightbulb className="h-5 w-5 text-yellow-600" />;
      case ServiceCategoryEnum.plumbing:
        return <Droplets className="h-5 w-5 text-blue-600" />;
      case ServiceCategoryEnum.home:
        return <Home className="h-5 w-5 text-gray-600" />;
      case ServiceCategoryEnum.moving:
        return <Truck className="h-5 w-5 text-indigo-600" />;
      case ServiceCategoryEnum.painting:
        return <Paintbrush2 className="h-5 w-5 text-pink-600" />;
      case ServiceCategoryEnum.landscaping:
        return <Sprout className="h-5 w-5 text-green-600" />;
      case ServiceCategoryEnum.tutoring:
        return <GraduationCap className="h-5 w-5 text-purple-600" />;
      case ServiceCategoryEnum.errand:
        return <ShoppingBag className="h-5 w-5 text-red-600" />;
      case ServiceCategoryEnum.professional:
        return <Users2 className="h-5 w-5 text-slate-600" />;
      case ServiceCategoryEnum.freelance:
        return <Briefcase className="h-5 w-5 text-teal-600" />;
      case ServiceCategoryEnum.transport:
        return <Car className="h-5 w-5 text-cyan-600" />;
      case ServiceCategoryEnum.health:
        return <Heart className="h-5 w-5 text-rose-600" />;
      case ServiceCategoryEnum.cleaning:
      default:
        return <Home className="h-5 w-5 text-emerald-600" />;
    }
  };

  const getLabel = () => {
    // Format the category string to have proper capitalization
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-md">
            {getIcon()}
          </div>
          <div>
            <p className="font-medium">{getLabel()}</p>
            <p className="text-sm text-muted-foreground">{count} services</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCategoryCard;
