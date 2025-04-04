
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Calendar, Star, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { Customer, Provider } from '@/types/auth';

const ProfileSummary = () => {
  const { user, userProfile, userRole } = useAuth();
  const { status: subscriptionStatus, isActive } = useSubscriptionStatus();

  // Early return if no user data
  if (!user || !userProfile) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your profile summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render specific content based on user role
  const renderRoleSpecificContent = () => {
    switch (userRole) {
      case 'provider':
        const providerProfile = userProfile as Provider;
        return (
          <>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-primary/10 p-2 rounded-md">
                <div className="text-xs text-muted-foreground">Rating</div>
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">
                    {providerProfile.rating?.toFixed(1) || '0.0'} 
                    <span className="text-xs text-muted-foreground ml-1">
                      ({providerProfile.reviewCount || 0})
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="bg-primary/10 p-2 rounded-md">
                <div className="text-xs text-muted-foreground">Bookings</div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 text-primary mr-1" />
                  <span className="text-sm font-medium">
                    {providerProfile.completedBookings || 0} completed
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs text-muted-foreground">Subscription</div>
                <Badge variant={isActive ? "outline" : "secondary"} className="text-xs">
                  {subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="text-sm font-medium">
                {providerProfile.subscriptionTier 
                  ? providerProfile.subscriptionTier.charAt(0).toUpperCase() + providerProfile.subscriptionTier.slice(1) 
                  : 'Free'} Plan
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-xs text-muted-foreground mb-1">Account Status</div>
              <div className="flex items-center">
                <Badge variant={providerProfile.verificationStatus === 'verified' ? "success" : "warning"} className="text-xs">
                  {providerProfile.verificationStatus.charAt(0).toUpperCase() + providerProfile.verificationStatus.slice(1)}
                </Badge>
              </div>
            </div>
          </>
        );
        
      case 'customer':
        const customerProfile = userProfile as Customer;
        return (
          <>
            <div className="mt-4">
              <div className="text-xs text-muted-foreground mb-1">Loyalty Points</div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{customerProfile.loyaltyPoints || 0} pts</span>
                <span className="text-xs text-muted-foreground">Next tier: 500 pts</span>
              </div>
              <Progress value={(customerProfile.loyaltyPoints || 0) / 5} className="h-1.5" />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-primary/10 p-2 rounded-md">
                <div className="text-xs text-muted-foreground">Bookings</div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 text-primary mr-1" />
                  <span className="text-sm font-medium">
                    {/* We can add actual booking count here in future */}
                    0 total
                  </span>
                </div>
              </div>
              
              <div className="bg-primary/10 p-2 rounded-md">
                <div className="text-xs text-muted-foreground">Saved Services</div>
                <div className="flex items-center">
                  <Heart className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-sm font-medium">
                    {customerProfile.savedServices?.length || 0} services
                  </span>
                </div>
              </div>
            </div>
          </>
        );
        
      case 'admin':
        return (
          <>
            <div className="mt-4">
              <div className="text-xs text-muted-foreground mb-1">Admin Access</div>
              <Badge variant="outline" className="text-xs">Full Access</Badge>
            </div>
            
            <div className="mt-4">
              <div className="text-xs text-muted-foreground mb-1">System Status</div>
              <Badge variant="success" className="text-xs">Online</Badge>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your profile summary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatarUrl} alt={user.firstName} />
            <AvatarFallback>{`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.firstName} {user.lastName}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
        
        {renderRoleSpecificContent()}
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            <span>Need help? Contact admin support</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSummary;
