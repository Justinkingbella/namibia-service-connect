
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { Link } from 'react-router-dom';
import { User, Building2, ShieldCheck, AlertTriangle, Star, Calendar, Clock, DollarSign } from 'lucide-react';

const ProfileSummary = () => {
  const { user, userProfile, userRole } = useAuth();
  const { status: subscriptionStatus, isActive } = useSubscriptionStatus();

  if (!user || !userProfile) {
    return null;
  }

  const getVerificationBadge = () => {
    if (userRole === 'provider') {
      const provider = userProfile as any;
      if (provider.isVerified) {
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Verified
          </Badge>
        );
      } else {
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Pending Verification
          </Badge>
        );
      }
    }
    return null;
  };

  const getSubscriptionBadge = () => {
    if (userRole === 'provider') {
      return (
        <Badge variant={isActive ? "outline" : "outline"} className={isActive ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}>
          {(userProfile as any).subscriptionTier || 'Free'}
        </Badge>
      );
    }
    return null;
  };

  const getProviderMetrics = () => {
    if (userRole === 'provider') {
      const provider = userProfile as any;
      return (
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col items-center">
            <div className="p-2 bg-blue-50 rounded-full">
              <Star className="h-4 w-4 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground mt-1">Rating</span>
            <span className="font-medium">{provider.rating?.toFixed(1) || 'N/A'} ({provider.reviewCount || 0})</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-2 bg-green-50 rounded-full">
              <Calendar className="h-4 w-4 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground mt-1">Completed</span>
            <span className="font-medium">{provider.completedBookings || 0}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-2 bg-purple-50 rounded-full">
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
            <span className="text-sm text-muted-foreground mt-1">Response Time</span>
            <span className="font-medium">1h</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const getCustomerMetrics = () => {
    if (userRole === 'customer') {
      const customer = userProfile as any;
      return (
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col items-center">
            <div className="p-2 bg-blue-50 rounded-full">
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground mt-1">Bookings</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-2 bg-green-50 rounded-full">
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground mt-1">Points</span>
            <span className="font-medium">{customer.loyaltyPoints || 0}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-2 bg-purple-50 rounded-full">
              <Star className="h-4 w-4 text-purple-500" />
            </div>
            <span className="text-sm text-muted-foreground mt-1">Reviews</span>
            <span className="font-medium">0</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary/10">
            <AvatarImage src={user.avatarUrl || ''} alt={user.firstName} />
            <AvatarFallback className="text-xl">
              {user.firstName?.charAt(0) || ''}
              {user.lastName?.charAt(0) || ''}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="text-xl font-bold">
                {userRole === 'provider' ? (userProfile as any).businessName : `${user.firstName} ${user.lastName}`}
              </h2>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {getVerificationBadge()}
                {getSubscriptionBadge()}
                
                <Badge variant="outline" className="flex items-center gap-1">
                  {userRole === 'provider' ? (
                    <>
                      <Building2 className="h-3 w-3" />
                      Provider
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3" />
                      Customer
                    </>
                  )}
                </Badge>
              </div>
            </div>
            
            {userRole === 'provider' && (
              <p className="text-muted-foreground mt-1 text-sm line-clamp-2">
                {(userProfile as any).businessDescription || 'No description available'}
              </p>
            )}
            
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={userRole === 'provider' ? '/dashboard/provider/profile' : '/dashboard/profile'}>
                  View Profile
                </Link>
              </Button>
              
              {userRole === 'provider' && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/services/create">
                    Create Service
                  </Link>
                </Button>
              )}
            </div>
            
            {getProviderMetrics()}
            {getCustomerMetrics()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSummary;
