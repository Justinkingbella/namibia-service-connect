
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CreateServiceForm from '@/components/provider/CreateServiceForm';

const CreateServicePage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create New Service</h1>
          <p className="text-muted-foreground mt-1">
            Create a new service to offer to customers
          </p>
        </div>
        
        <CreateServiceForm />
      </div>
    </DashboardLayout>
  );
};

export default CreateServicePage;
