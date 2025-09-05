
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
import { ProviderVerificationStatus } from '@/types/auth';

const ProviderProfile = () => {
  const { user, userProfile } = useAuth();
  const [providerData, setProviderData] = useState({
    business_name: '',
    business_description: '',
    banner_url: '',
    website: '',
    commission_rate: 0,
    verification_status: 'pending' as ProviderVerificationStatus,
    completed_bookings: 0,
    email: '',
    email_verified: false,
    id: '',
    is_active: false,
    phone_number: '',
    rating: 0,
    rating_count: 0,
    rejection_reason: '',
    subscription_tier: 'free',
    // Address fields
    address: '',
    city: '',
    country: '',
    state: '',
    postal_code: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviderData = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('provider_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching provider data:', error);
          toast.error('Failed to load provider profile.');
          return;
        }

        setProviderData({
          ...providerData,
          ...data,
          verification_status: data.verification_status as ProviderVerificationStatus
        });
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
        .from('provider_profiles')
        .update({
          business_name: providerData.business_name,
          business_description: providerData.business_description,
          website: providerData.website
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating provider data:', error);
        toast.error('Failed to update provider profile.');
        return;
      }

      // Profile updated successfully

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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProviderProfile;
