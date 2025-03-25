
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  title: string;
  icon: React.ReactNode;
  description?: string;
  link?: string;
  className?: string;
}

export function CategoryCard({
  title,
  icon,
  description,
  link = '#',
  className,
}: CategoryCardProps) {
  const content = (
    <div className={cn(
      'group relative p-6 flex flex-col items-center justify-between text-center h-full overflow-hidden',
      'glass border border-gray-200 hover:border-primary/20 transition-all duration-300',
      'rounded-2xl subtle-shadow hover:shadow-lg transform hover:-translate-y-1',
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex flex-col items-center">
        <div className="text-primary p-3 mb-4 rounded-xl bg-primary/5 w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors duration-300">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      <div className="h-1 w-10 rounded-full bg-primary/30 mt-4 group-hover:w-16 transition-all duration-300"></div>
    </div>
  );

  if (link) {
    return <Link to={link} className="block h-full">{content}</Link>;
  }

  return content;
}

export default CategoryCard;
