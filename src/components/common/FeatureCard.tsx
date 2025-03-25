
import React from 'react';
import { cn } from '@/lib/utils';
import FadeIn from '../animations/FadeIn';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index?: number;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  index = 0,
  className,
}: FeatureCardProps) {
  return (
    <FadeIn
      delay={index * 100}
      direction="up"
      className={cn(
        'p-6 flex flex-col h-full',
        'rounded-2xl border border-border hover:border-primary/30 transition-all duration-300',
        'bg-white hover:bg-gray-50/50 subtle-shadow',
        className
      )}
    >
      <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 text-primary mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm flex-1">{description}</p>
    </FadeIn>
  );
}

export default FeatureCard;
