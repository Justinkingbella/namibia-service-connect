
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceCategoryEnum } from '@/types/service';
import { Home, Tools, Wrench, Zap, TruckMoving, Brush, Flower2, GraduationCap, ShoppingBag, Briefcase, Handshake, Car, Heart, Package, Grid3X3 } from 'lucide-react';

type ServiceCategoryCardProps = {
  category: string;
  count?: number;
  onClick?: (category: string) => void;
  selected?: boolean;
};

const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({ 
  category, 
  count = 0,
  onClick,
  selected = false
}) => {
  // Function to render the appropriate icon based on the category
  const getCategoryIcon = () => {
    // Using string comparison since ServiceCategoryEnum is a string enum
    switch (category) {
      case 'cleaning':
        return <Home className="h-6 w-6" />;
      case 'repair':
        return <Tools className="h-6 w-6" />;
      case 'plumbing':
        return <Wrench className="h-6 w-6" />;
      case 'electrical':
        return <Zap className="h-6 w-6" />;
      case 'moving':
        return <TruckMoving className="h-6 w-6" />;
      case 'painting':
        return <Brush className="h-6 w-6" />;
      case 'landscaping':
        return <Flower2 className="h-6 w-6" />;
      case 'tutoring':
        return <GraduationCap className="h-6 w-6" />;
      case 'home':
        return <Home className="h-6 w-6" />;
      case 'errand':
        return <ShoppingBag className="h-6 w-6" />;
      case 'professional':
        return <Briefcase className="h-6 w-6" />;
      case 'freelance':
        return <Handshake className="h-6 w-6" />;
      case 'transport':
        return <Car className="h-6 w-6" />;
      case 'health':
        return <Heart className="h-6 w-6" />;
      default:
        return <Grid3X3 className="h-6 w-6" />;
    }
  };

  const getCategoryName = () => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick(category);
    }
  };

  return (
    <Card
      onClick={handleClick}
      className={`cursor-pointer hover:border-primary transition-colors ${
        selected ? 'border-2 border-primary bg-primary/5' : ''
      }`}
    >
      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          selected ? 'bg-primary/10 text-primary' : 'bg-muted'
        } mb-2`}>
          {getCategoryIcon()}
        </div>
        <h3 className="font-medium">{getCategoryName()}</h3>
        {count > 0 && (
          <p className="text-sm text-muted-foreground">{count} services</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCategoryCard;
