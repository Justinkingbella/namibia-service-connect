
import React from 'react';
import { Settings, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SettingsCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const SettingsCard = ({ 
  title, 
  description, 
  icon = <Settings className="h-5 w-5" />, 
  onClick,
  className
}: SettingsCardProps) => {
  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <CardDescription className="text-xs">{description}</CardDescription>
        <div className="flex justify-end mt-4">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsCard;
