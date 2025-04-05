
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/common/Button';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { DbUserProfile } from '@/types/auth';
import { Avatar } from '@/components/ui/avatar';
import { User, Key, Calendar, Heart, CreditCard, MapPin, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const CustomerProfile: React.FC = () => {
  const { profile, loading, updateProfile } = useProfile();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<DbUserProfile>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({
    bookings: 0,
    favorites: 0,
    loyaltyPoints: 0
  });

  // Fetch additional customer data
  React.useEffect(() => {
    const fetchCustomerStats = async () => {
      if (!profile?.id) return;
      
      try {
        // Get booking count
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('customer_id', profile.id);
          
        if (bookingsError) throw bookingsError;
        
        // Get favorites count
        const { count: favoritesCount, error: favoritesError } = await supabase
          .from('favorite_services')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id);
          
        if (favoritesError) throw favoritesError;
        
        setStats({
          bookings: bookingsCount || 0,
          favorites: favoritesCount || 0,
          loyaltyPoints: profile.loyaltyPoints || 0
        });
      } catch (error) {
        console.error('Error fetching customer stats:', error);
      }
    };
    
    fetchCustomerStats();
  }, [profile?.id, profile?.loyaltyPoints]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phoneNumber: profile?.phoneNumber || '',
      address: profile?.address || '',
      city: profile?.city || '',
      country: profile?.country || '',
      birthDate: profile?.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : '',
      preferredLanguage: profile?.preferredLanguage || '',
    });
    setIsEditing(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Customer Profile</CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={handleEdit} variant="outline">
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Profile" />
                ) : (
                  <div className="bg-primary text-white w-full h-full flex items-center justify-center text-3xl">
                    {profile?.firstName?.charAt(0) || 'C'}
                  </div>
                )}
              </Avatar>
              <div className="mt-4 flex flex-col items-center">
                <h3 className="font-medium text-lg">
                  {profile?.firstName || ''} {profile?.lastName || ''}
                </h3>
                <p className="text-sm text-muted-foreground">Customer</p>
                <Button size="sm" variant="outline" className="mt-3">Change Avatar</Button>
              </div>
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <Input 
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <Input 
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input 
                        name="phoneNumber"
                        value={formData.phoneNumber || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Birth Date</label>
                      <Input 
                        name="birthDate"
                        type="date"
                        value={formData.birthDate ? String(formData.birthDate) : ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address</label>
                      <Input 
                        name="address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input 
                        name="city"
                        value={formData.city || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Country</label>
                      <Input 
                        name="country"
                        value={formData.country || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preferred Language</label>
                      <Input 
                        name="preferredLanguage"
                        value={formData.preferredLanguage || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave} 
                      loading={isSaving}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p>{profile?.firstName || ''} {profile?.lastName || ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{profile?.email || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>{profile?.phoneNumber || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Birth Date</p>
                        <p>
                          {profile?.birthDate 
                            ? new Date(profile.birthDate).toLocaleDateString() 
                            : 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p>{profile?.address || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p>
                          {profile?.city && profile?.country 
                            ? `${profile.city}, ${profile.country}` 
                            : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-blue-100 rounded-full mb-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium">Bookings</h3>
              <p className="text-3xl font-bold mt-2">{stats.bookings}</p>
              <p className="text-sm text-muted-foreground">Total bookings made</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-pink-100 rounded-full mb-3">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-medium">Favorites</h3>
              <p className="text-3xl font-bold mt-2">{stats.favorites}</p>
              <p className="text-sm text-muted-foreground">Saved services</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-green-100 rounded-full mb-3">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Loyalty Points</h3>
              <p className="text-3xl font-bold mt-2">{stats.loyaltyPoints}</p>
              <p className="text-sm text-muted-foreground">Points earned</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your account security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerProfile;
