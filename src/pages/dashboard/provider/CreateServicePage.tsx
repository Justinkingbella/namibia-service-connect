
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CreateService from '@/components/provider/CreateService';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const CreateServicePage = () => {
  const { user } = useAuth();

  // Check if user is a provider
  const isProvider = user?.role === 'provider';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create New Service</h1>
          <p className="text-muted-foreground mt-1">Add a new service to your provider portfolio</p>
        </div>
        
        {!isProvider && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Access Restricted</AlertTitle>
            <AlertDescription>
              Only service providers can create new services. Please contact support if you believe this is an error.
            </AlertDescription>
          </Alert>
        )}
        
        {isProvider && <CreateService />}
      </div>
    </DashboardLayout>
  );
};

export default CreateServicePage;
