
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CreateServiceForm from './CreateServiceForm';
import { ServiceData } from '@/types/service';

const CreateService = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateService = async (serviceData: ServiceData) => {
    if (!user) {
      toast.error('You must be logged in to create a service');
      navigate('/auth/sign-in');
      return;
    }

    if (user.role !== 'provider' && user.role !== 'admin') {
      toast.error('Only providers can create services');
      return;
    }

    setIsLoading(true);

    try {
      // Ensure the provider_id is set to the current user's ID
      const dataToInsert = {
        ...serviceData,
        provider_id: user.id
      };

      const { data, error } = await supabase
        .from('services')
        .insert({
          ...dataToInsert,
          category: dataToInsert.category as any, // Cast to match Supabase enum
          pricing_model: dataToInsert.pricing_model as any // Cast to match Supabase enum
        })
        .select();

      if (error) {
        throw error;
      }

      toast.success('Service created successfully!');
      navigate(`/dashboard/services/${data[0].id}`);
    } catch (error: any) {
      console.error('Error creating service:', error);
      toast.error(error.message || 'Failed to create service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <CreateServiceForm 
        onSubmit={handleCreateService}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CreateService;
