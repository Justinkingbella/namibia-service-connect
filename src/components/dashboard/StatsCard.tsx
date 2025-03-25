
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn(
      "bg-white p-6 rounded-xl border shadow-sm",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h4 className="text-2xl font-bold mt-1">{value}</h4>
          
          {trend && (
            <div className="flex items-center mt-1">
              <div className={cn(
                "flex items-center text-xs font-medium mr-2",
                trend.positive ? "text-green-600" : "text-red-600"
              )}>
                <svg 
                  className={cn(
                    "h-3 w-3 mr-1",
                    trend.positive ? "rotate-0" : "rotate-180"
                  )}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                {Math.abs(trend.value)}%
              </div>
              
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
          )}
          
          {!trend && description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
