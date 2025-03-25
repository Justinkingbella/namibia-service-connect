
import React, { ElementType, ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// This type allows for the 'as' prop
type ButtonProps<T extends ElementType = 'button'> = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  circle?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function Button<T extends ElementType = 'button'>({
  children,
  className,
  variant = 'primary',
  size = 'md',
  circle = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  as,
  ...props
}: ButtonProps<T>) {
  const Component = as || 'button';

  const variantClasses = {
    primary: 'bg-primary text-white hover:opacity-90 shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizeClasses = {
    xs: circle ? 'h-6 w-6 text-xs' : 'h-6 px-2 text-xs',
    sm: circle ? 'h-8 w-8 text-sm' : 'h-8 px-3 text-sm',
    md: circle ? 'h-10 w-10 text-base' : 'h-10 px-4 text-base',
    lg: circle ? 'h-12 w-12 text-lg' : 'h-12 px-6 text-lg',
    xl: circle ? 'h-14 w-14 text-xl' : 'h-14 px-8 text-xl',
  };

  const circleClasses = circle ? 'flex items-center justify-center p-0 rounded-full' : 'rounded-lg';

  return (
    <Component
      className={cn(
        'relative inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        circleClasses,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      )}
      <span className={cn('flex items-center gap-2', loading ? 'opacity-0' : '')}>
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </span>
    </Component>
  );
}

export default Button;
