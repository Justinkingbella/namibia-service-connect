import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProviderVerificationStatus, DbProviderProfile } from '@/types/auth';

const ProviderProfile = () => {
  const { user, userProfile, setUserProfile } = useAuth();
  const [providerData, setProviderData] = useState<Partial<DbProviderProfile>>({
    address: '',
    avatar_url: '',
    banner_url: '',
    business_description: '',
    business_name: '',
    city: '',
    commission_rate: 0,
    completed_bookings: 0,
    country: '',
    email: '',
    email_verified: false,
    id: '',
    is_active: false,
    phone_number: '',
    postal_code: '',
    rating: 0,
    rating_count: 0,
    rejection_reason: '',
    state: '',
    subscription_tier: 'free',
    website: '',
    verification_status: 'pending'
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviderData = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('service_providers')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching provider data:', error);
          toast.error('Failed to load provider profile.');
          return;
        }

        setProviderData({ ...providerData, verification_status: data.verification_status as ProviderVerificationStatus });

        setProviderData(data);
      } catch (error) {
        console.error('Error fetching provider data:', error);
        toast.error('Failed to load provider profile.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviderData();
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProviderData({ ...providerData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error('You must be logged in to update your profile.');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('service_providers')
        .update(providerData)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating provider data:', error);
        toast.error('Failed to update provider profile.');
        return;
      }

      // Update the user profile in the AuthContext
      if (userProfile && setUserProfile) {
        setUserProfile({
          ...userProfile,
          businessName: providerData.business_name || '',
          businessDescription: providerData.business_description || '',
        });
      }

      toast.success('Provider profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating provider data:', error);
      toast.error('Failed to update provider profile.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading provider profile...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Provider Profile</CardTitle>
        <CardDescription>
          Update your provider profile information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="business_name">Business Name</Label>
            <Input
              type="text"
              id="business_name"
              name="business_name"
              value={providerData.business_name || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="business_description">Business Description</Label>
            <Textarea
              id="business_description"
              name="business_description"
              value={providerData.business_description || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              type="url"
              id="website"
              name="website"
              value={providerData.website || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={providerData.address || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              type="text"
              id="city"
              name="city"
              value={providerData.city || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              type="text"
              id="state"
              name="state"
              value={providerData.state || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input
              type="text"
              id="postal_code"
              name="postal_code"
              value={providerData.postal_code || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              type="text"
              id="country"
              name="country"
              value={providerData.country || ''}
              onChange={handleInputChange}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProviderProfile;
