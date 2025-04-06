
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { DbCustomerProfile } from '@/types/auth';

const UserProfile = () => {
  const { user, userProfile, setUserProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    avatarUrl: '',
    birthDate: undefined as Date | undefined,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [date, setDate] = React.useState<Date>();

  useEffect(() => {
    if (userProfile && userProfile.role === 'customer') {
      const customerProfile = userProfile as DbCustomerProfile;
      setFormData({
        firstName: customerProfile?.first_name || '',
        lastName: customerProfile?.last_name || '',
        phoneNumber: customerProfile?.phone_number || '',
        avatarUrl: customerProfile?.avatar_url || '',
        birthDate: customerProfile?.birth_date ? new Date(customerProfile.birth_date) : undefined,
      });
      setDate(customerProfile?.birth_date ? new Date(customerProfile.birth_date) : undefined);
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to update your profile');
      navigate('/auth/sign-in');
      return;
    }

    setIsSaving(true);

    try {
      const updates = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        avatar_url: formData.avatarUrl,
        updated_at: new Date().toISOString(),
        birth_date: date ? date.toISOString() : null,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update the user context
      setUserProfile({
        ...userProfile,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        avatar_url: formData.avatarUrl,
        birth_date: date,
      });

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      {userProfile && userProfile.role === 'customer' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Avatar className="w-24 h-24">
              {formData.avatarUrl ? (
                <AvatarImage src={formData.avatarUrl} alt="Avatar" />
              ) : (
                <AvatarFallback>{formData.firstName?.[0]}{formData.lastName?.[0]}</AvatarFallback>
              )}
            </Avatar>
            <Input
              type="url"
              id="avatarUrl"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Birth Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="bottom">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={!isEditing}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-between">
            {isEditing ? (
              <div>
                <Button
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      firstName: userProfile.first_name || '',
                      lastName: userProfile.last_name || '',
                      phoneNumber: userProfile.phone_number || '',
                      avatarUrl: userProfile.avatar_url || '',
                      birthDate: userProfile.birth_date ? new Date(userProfile.birth_date) : undefined,
                    });
                    setDate(userProfile.birth_date ? new Date(userProfile.birth_date) : undefined);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default UserProfile;
