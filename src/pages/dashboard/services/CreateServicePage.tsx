
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CreateServiceForm from '@/components/provider/CreateServiceForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ServiceData } from '@/types/service';
import { transformServiceData } from '@/services/serviceDataTransformer';

const CreateServicePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (serviceData: Partial<ServiceData>) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: 'You must be logged in to create a service',
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newService = {
        provider_id: user.id,
        provider_name: `${user.firstName} ${user.lastName}`,
        is_active: true,
        category: serviceData.category || '',
        price: serviceData.price || 0,
        title: serviceData.title || '',
        description: serviceData.description || '',
        pricing_model: serviceData.pricing_model || 'fixed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('services')
        .insert(newService)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: 'Service created successfully',
        variant: "default"
      });
      navigate(`/dashboard/services/${data.id}`);
    } catch (error: any) {
      console.error('Error creating service:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to create service',
        variant: "destructive"
      });
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
        />
      </div>
    </DashboardLayout>
  );
};

export default CreateServicePage;
