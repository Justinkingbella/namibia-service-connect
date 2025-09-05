// Let's update imports and fix the subscription tier comparison
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export function ProfileSummary() {
  const { user, userProfile, userRole } = useAuth();

  if (!user) return null;

  // Get user initials for avatar fallback
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;

  // Format date for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return format(new Date(dateStr), 'PPP');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            {user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
            ) : (
              <AvatarFallback className="text-lg">
                {initials || '?'}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">
              {user.firstName} {user.lastName}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Badge variant="outline" className="mr-2">
                Free Plan
              </Badge>
              {user.email}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Last Login</p>
              <p>Today</p>
            </div>
          </div>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Member Since</p>
              <p>{userProfile?.createdAt ? formatDate(userProfile.createdAt) : 'N/A'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}