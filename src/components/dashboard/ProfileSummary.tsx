
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Settings, MapPin, Briefcase, Package, ShoppingBag, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { SubscriptionTier } from '@/types';

const ProfileSummary: React.FC = () => {
  const { user, userProfile, userRole } = useAuth();
  const navigate = useNavigate();
  
  if (!user || !userProfile) {
    return <ProfileSummarySkeleton />;
  }

  const getSubscriptionBadgeStyle = (tier?: SubscriptionTier) => {
    switch (tier) {
      case 'pro':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  const getVerificationBadgeStyle = (status?: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'under_review':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  const navigateToProfile = () => {
    if (userRole === 'customer') {
      navigate('/dashboard/customer/profile');
    } else if (userRole === 'provider') {
      navigate('/dashboard/provider/profile');
    } else if (userRole === 'admin') {
      navigate('/dashboard/admin/profile');
    }
  };

  return (
    <Card className="border-none shadow-sm bg-gradient-to-r from-white to-slate-50">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
              <AvatarImage src={user.avatarUrl || ''} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-lg">
                {user.firstName ? user.firstName[0] : ''}
                {user.lastName ? user.lastName[0] : ''}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  {userRole === 'provider' 
                    ? (userProfile as any).businessName || `${user.firstName} ${user.lastName}` 
                    : `${user.firstName} ${user.lastName}`}
                </h1>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  {userRole === 'provider' && (userProfile as any).completedBookings !== undefined && (
                    <span className="flex items-center mr-2">
                      <Briefcase className="h-3.5 w-3.5 mr-1" /> 
                      {(userProfile as any).completedBookings || 0} Bookings completed
                    </span>
                  )}
                  
                  {user.email && (
                    <span className="flex items-center gap-1 ml-1">
                      {user.email}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                {userRole === 'provider' && (
                  <>
                    <Badge variant="outline" className={getVerificationBadgeStyle((userProfile as any).verificationStatus)}>
                      {(userProfile as any).verificationStatus || 'Unverified'}
                    </Badge>
                    
                    <Badge variant="outline" className={getSubscriptionBadgeStyle((userProfile as any).subscriptionTier)}>
                      {(userProfile as any).subscriptionTier || 'Free'} Plan
                    </Badge>
                  </>
                )}
                
                {userRole === 'customer' && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    <ShoppingBag className="h-3 w-3 mr-1" /> Customer
                  </Badge>
                )}
                
                {userRole === 'admin' && (
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    <Settings className="h-3 w-3 mr-1" /> Admin
                  </Badge>
                )}
                
                <Button variant="outline" size="sm" onClick={navigateToProfile}>
                  <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit Profile
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
              {(userProfile as any).servicesCount !== undefined && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Package className="h-4 w-4 mr-1.5 text-primary" />
                  <span><strong>{(userProfile as any).servicesCount || 0}</strong> Services</span>
                </div>
              )}
              
              {(userProfile as any).savedServices && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <ShoppingBag className="h-4 w-4 mr-1.5 text-primary" />
                  <span><strong>{(userProfile as any).savedServices.length || 0}</strong> Saved services</span>
                </div>
              )}
              
              {userRole === 'customer' && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1.5 text-primary" />
                  <span>Member since <strong>{new Date(user.createdAt).toLocaleDateString()}</strong></span>
                </div>
              )}
              
              {(userProfile as any).address && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1.5 text-primary" />
                  <span>{(userProfile as any).address || 'No address provided'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProfileSummarySkeleton = () => (
  <Card className="border-none shadow-sm">
    <CardContent className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1 space-y-4">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72 mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ProfileSummary;
