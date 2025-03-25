
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
}

export function Logo({ className, size = 'md', dark = false }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link to="/" className="flex items-center">
      <span
        className={cn(
          'font-bold tracking-tight',
          sizeClasses[size],
          dark ? 'text-white' : 'text-foreground',
          className
        )}
      >
        <span className="text-primary">Namibia</span>
        <span>Service</span>
        <span className="text-primary">Hub</span>
      </span>
    </Link>
  );
}

export default Logo;
