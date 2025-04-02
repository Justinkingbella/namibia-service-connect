
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DisputeForm from '@/components/dispute/DisputeForm';
import DisputeList from '@/components/dispute/DisputeList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useDisputes } from '@/hooks/useDisputes';
import { fetchUserDisputes, createDispute } from '@/services/mockProfileService';

const DisputesPage: React.FC = () => {
  const { disputes, loading, submitDispute } = useDisputes();
  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Disputes & Resolution</h1>
            <p className="text-muted-foreground">
              Manage and resolve issues with your bookings
            </p>
          </div>
          
          <Button onClick={handleToggleForm}>
            {showForm ? (
              'Cancel'
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> 
                New Dispute
              </>
            )}
          </Button>
        </div>
        
        {showForm && (
          <DisputeForm 
            onSubmit={submitDispute} 
            onCancel={() => setShowForm(false)}
          />
        )}
        
        <DisputeList 
          disputes={disputes} 
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default DisputesPage;
