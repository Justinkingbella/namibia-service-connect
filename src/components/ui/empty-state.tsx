
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  linkText?: string;
  link?: string;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  linkText,
  link,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center p-8 space-y-4', className)}>
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div>{action}</div>}
      {linkText && link && (
        <Button variant="outline" asChild>
          <Link to={link}>{linkText}</Link>
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
