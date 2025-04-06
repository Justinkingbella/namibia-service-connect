
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/common/Button';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { Avatar } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { User, Key, Settings, Shield, Users, FileText, BarChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DbUserProfile } from '@/types/auth';
import { AvatarUpload } from '@/components/ui/avatar-upload';

const AdminProfile: React.FC = () => {
  const { profile, loading, updateProfile } = useProfile();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [personalData, setPersonalData] = useState<Partial<DbUserProfile>>({});
  const [adminPermissions, setAdminPermissions] = useState<string[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  // Fetch admin permissions
  useEffect(() => {
    const fetchAdminPermissions = async () => {
      if (!profile?.id) return;
      
      try {
        setLoadingPermissions(true);
        const { data, error } = await supabase
          .from('admin_permissions')
          .select('permissions')
          .eq('user_id', profile.id)
          .single();
          
        if (error) throw error;
        setAdminPermissions(data?.permissions || []);
      } catch (error) {
        console.error('Error fetching admin permissions:', error);
        toast({
          variant: "destructive",
          title: "Failed to load permissions",
          description: "There was an error loading your admin permissions."
        });
      } finally {
        setLoadingPermissions(false);
      }
    };
    
    fetchAdminPermissions();
  }, [profile?.id, toast]);

  useEffect(() => {
    if (profile && !isEditing) {
      setPersonalData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        email: profile.email || '',
        // These properties might not exist in DbUserProfile, so we're not setting them
      });
    }
  }, [profile, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleAvatarChange = async (url: string | null) => {
    if (!profile?.id) return;
    
    try {
      await updateProfile({ avatar_url: url });
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      await updateProfile(personalData);
      toast({
        title: "Profile updated",
        description: "Your admin profile has been updated successfully."
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating admin profile:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile."
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || loadingPermissions) {
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
              <CardTitle>Admin Profile</CardTitle>
              <CardDescription>
                Manage your admin account information
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
                    <p className="text-sm text-muted-foreground">Administrator</p>
                    <Badge className="mt-2 bg-purple-100 text-purple-800">
                      System Admin
                    </Badge>
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
                      <User className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{profile?.email || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>{profile?.phone_number || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Admin Permissions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {adminPermissions.includes('all') && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-purple-500" />
                        <p className="font-medium">All Permissions</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Full system access</p>
                    </div>
                  )}
                  
                  {adminPermissions.includes('user_management') && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        <p className="font-medium">User Management</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Manage platform users</p>
                    </div>
                  )}
                  
                  {adminPermissions.includes('provider_verification') && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-center space-x-2">
                        <Settings className="h-5 w-5 text-green-500" />
                        <p className="font-medium">Provider Verification</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Verify service providers</p>
                    </div>
                  )}
                  
                  {adminPermissions.includes('dispute_resolution') && (
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-amber-500" />
                        <p className="font-medium">Dispute Resolution</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Resolve user disputes</p>
                    </div>
                  )}
                  
                  {adminPermissions.includes('analytics') && (
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                      <div className="flex items-center space-x-2">
                        <BarChart className="h-5 w-5 text-indigo-500" />
                        <p className="font-medium">Analytics Access</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">View platform analytics</p>
                    </div>
                  )}
                </div>
                
                {adminPermissions.length === 0 && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-gray-500">No specific permissions assigned.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
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

export default AdminProfile;

