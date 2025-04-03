
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';
import { useProviderProfile } from '@/hooks/useProviderProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Edit, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ProfileSummary() {
  const { user } = useAuth();
  const { customerData, loading: customerLoading } = useCustomerProfile();
  const { providerData, loading: providerLoading } = useProviderProfile();
  
  const loading = user?.role === 'provider' ? providerLoading : customerLoading;
  
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please sign in to view your profile.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const avatarUrl = user.role === 'provider' 
    ? providerData?.business_logo || user.avatarUrl 
    : user.avatarUrl;
    
  const displayName = user.role === 'provider'
    ? providerData?.business_name || `${user.firstName} ${user.lastName}`
    : `${user.firstName} ${user.lastName}`;
    
  const profilePath = user.role === 'provider' 
    ? '/dashboard/provider/profile' 
    : '/dashboard/customer/profile';
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Profile Summary</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to={profilePath}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{displayName}</h3>
            <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            {user.role === 'provider' && providerData?.verification_status && (
              <div className="mt-1">
                <span className={`text-xs px-2 py-1 rounded ${
                  providerData.verification_status === 'verified' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {providerData.verification_status === 'verified' ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {user.role === 'customer' && customerData && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Favorites</p>
                <p className="font-medium">{customerData.saved_services?.length || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Loyalty Points</p>
                <p className="font-medium">{user.loyaltyPoints || 0}</p>
              </div>
            </div>
          </div>
        )}
        
        {user.role === 'provider' && providerData && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Rating</p>
                <p className="font-medium">{providerData.rating?.toFixed(1) || 'No ratings'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Service Categories</p>
                <p className="font-medium">{providerData.categories?.length || 0}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
