
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  percentage?: string;
  className?: string;
  icon?: React.ReactNode;
  positive?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  trend = 'neutral',
  percentage,
  className,
  icon,
  positive,
}) => {
  const renderTrendIcon = () => {
    if (trend === 'up' || positive) {
      return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    } else if (trend === 'down' && !positive) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (trend === 'up' || positive) {
      return 'text-emerald-500';
    } else if (trend === 'down' && !positive) {
      return 'text-red-500';
    }
    return 'text-gray-400';
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <h3 className="text-2xl font-bold mt-1">
              {value}
            </h3>
          </div>
          {icon && (
            <div className="bg-primary/10 p-2 rounded-full">
              {icon}
            </div>
          )}
        </div>
        
        {(description || percentage) && (
          <div className="flex items-center gap-1 mt-4">
            {renderTrendIcon()}
            {percentage && (
              <span className={cn("text-xs font-medium", getTrendColor())}>
                {percentage}
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground ml-1">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
