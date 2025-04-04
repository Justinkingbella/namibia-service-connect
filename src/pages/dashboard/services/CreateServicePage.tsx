
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CreateServiceForm } from '@/components/services/CreateServiceForm';
import { ServiceData } from '@/types/service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const CreateServicePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (serviceData: Partial<ServiceData>) => {
    if (!user) {
      toast.error('You must be logged in to create a service');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const newService = {
        ...serviceData,
        provider_id: user.id,
        provider_name: `${user.firstName} ${user.lastName}`,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Submit to Supabase
      const { data, error } = await supabase
        .from('services')
        .insert(newService)
        .select()
        .single();

      if (error) throw error;

      toast.success('Service created successfully');
      navigate(`/dashboard/services/${data.id}`);
    } catch (error: any) {
      console.error('Error creating service:', error);
      toast.error(error.message || 'Failed to create service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create New Service</h1>
          <p className="text-muted-foreground mt-1">Add a new service that customers can book</p>
        </div>

        <CreateServiceForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
        />
      </div>
    </DashboardLayout>
  );
};

export default CreateServicePage;
