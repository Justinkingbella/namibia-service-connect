
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserDisputes, createDispute } from '@/services/mockProfileService';
import DisputeList from '@/components/dispute/DisputeList';
import DisputeForm from '@/components/dispute/DisputeForm';
import { Dispute } from '@/types/booking';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Plus } from 'lucide-react';

const CustomerDisputesPage: React.FC = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  
  const { data: disputes = [], isLoading, refetch } = useQuery({
    queryKey: ['customerDisputes', user?.id],
    queryFn: () => user ? fetchUserDisputes(user.id) : Promise.resolve([]),
    enabled: !!user
  });
  
  const handleCreateDispute = async (data: Partial<Dispute>) => {
    if (!user) return false;
    
    try {
      const success = await createDispute({
        ...data,
        customerId: user.id,
      });
      
      if (success) {
        refetch();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error creating dispute:', error);
      return false;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Disputes</h1>
            <p className="text-muted-foreground">Track and manage your dispute cases</p>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Dispute
            </Button>
          )}
        </div>
        
        {showForm ? (
          <DisputeForm 
            onSubmit={handleCreateDispute}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : disputes.length === 0 ? (
              <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
                <AlertCircle className="h-10 w-10 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No disputes found</h3>
                <p className="mt-2 text-muted-foreground">
                  You haven't created any disputes yet. If you have issues with a booking, 
                  you can create a new dispute for resolution.
                </p>
                <Button onClick={() => setShowForm(true)} className="mt-4">
                  Create Dispute
                </Button>
              </div>
            ) : (
              <DisputeList disputes={disputes} loading={isLoading} />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomerDisputesPage;
