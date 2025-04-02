
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/common/Button';
import { Textarea } from '@/components/ui/textarea';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { Avatar } from '@/components/ui/avatar';
import { User, Key, MapPin, Phone, Mail, Briefcase, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DbUserProfile, DbProviderProfile } from '@/types/auth';
import { AvatarUpload } from '@/components/ui/avatar-upload';

const ProviderProfile: React.FC = () => {
  const { profile, loading, updateProfile } = useProfile();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [personalData, setPersonalData] = useState<Partial<DbUserProfile>>({});
  const [providerData, setProviderData] = useState<Partial<DbProviderProfile> | null>(null);
  const [loadingProvider, setLoadingProvider] = useState(true);
  const [stats, setStats] = useState({
    totalServices: 0,
    completedBookings: 0,
    totalEarnings: 0
  });

  // Fetch provider profile data
  useEffect(() => {
    const fetchProviderData = async () => {
      if (!profile?.id) return;
      
      try {
        setLoadingProvider(true);
        
        // Fetch provider data
        const { data, error } = await supabase
          .from('service_providers')
          .select('*')
          .eq('id', profile.id)
          .single();
          
        if (error) throw error;
        
        setProviderData(data);
        
        // Set statistics
        setStats({
          totalServices: data.services_count || 0,
          completedBookings: data.completed_bookings || 0,
          totalEarnings: 0 // You might want to calculate this from another table
        });
      } catch (error) {
        console.error('Error fetching provider data:', error);
        toast({
          variant: "destructive",
          title: "Failed to load provider data",
          description: "There was an error loading your provider profile."
        });
      } finally {
        setLoadingProvider(false);
      }
    };
    
    fetchProviderData();
  }, [profile?.id, toast]);

  useEffect(() => {
    if (profile && !isEditing) {
      setPersonalData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        email: profile.email || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
      });
    }
  }, [profile, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (url: string | null) => {
    if (!profile?.id) return;
    
    try {
      await updateProfile({ avatar_url: url });
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update profile data
      await updateProfile(personalData);
      
      // Update provider data if needed
      // This would require another function to update the service_providers table
      
      toast({
        title: "Profile updated",
        description: "Your provider profile has been updated successfully."
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating provider profile:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile."
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || loadingProvider) {
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
              <CardTitle>Provider Profile</CardTitle>
              <CardDescription>
                Manage your business profile and personal information
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
          {isEditing ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input 
                      name="first_name"
                      value={personalData.first_name || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input 
                      name="last_name"
                      value={personalData.last_name || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      name="email"
                      value={personalData.email || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input 
                      name="phone_number"
                      value={personalData.phone_number || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input 
                      name="address"
                      value={personalData.address || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input 
                      name="city"
                      value={personalData.city || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country</label>
                    <Input 
                      name="country"
                      value={personalData.country || ''}
                      onChange={handleInputChange}
                    />
                  </div>
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
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <AvatarUpload 
                    userId={profile?.id || ''}
                    currentAvatarUrl={profile?.avatar_url}
                    onAvatarChange={handleAvatarChange}
                  />
                  
                  <div className="mt-4 flex flex-col items-center">
                    <h3 className="font-medium text-lg">
                      {profile?.first_name || ''} {profile?.last_name || ''}
                    </h3>
                    <p className="text-sm text-muted-foreground">Service Provider</p>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p>{profile?.first_name || ''} {profile?.last_name || ''}</p>
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
                        <p>{profile?.phone_number || 'Not specified'}</p>
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
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Business Name</p>
                      <p>{providerData?.business_name || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Verification Status</p>
                      <p className="capitalize">{providerData?.verification_status || 'Pending'}</p>
                    </div>
                  </div>
                </div>
                
                {providerData?.business_description && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-1">Business Description</p>
                    <p className="text-sm">{providerData.business_description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-blue-100 rounded-full mb-3">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium">Services</h3>
              <p className="text-3xl font-bold mt-2">{stats.totalServices}</p>
              <p className="text-sm text-muted-foreground">Total services offered</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-green-100 rounded-full mb-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Bookings</h3>
              <p className="text-3xl font-bold mt-2">{stats.completedBookings}</p>
              <p className="text-sm text-muted-foreground">Completed bookings</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-purple-100 rounded-full mb-3">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium">Rating</h3>
              <p className="text-3xl font-bold mt-2">{providerData?.rating || '0.0'}</p>
              <p className="text-sm text-muted-foreground">Average customer rating</p>
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

export default ProviderProfile;
