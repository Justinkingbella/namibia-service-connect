
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface ServiceFormActionsProps {
  isSubmitting: boolean;
}

export const ServiceFormActions: React.FC<ServiceFormActionsProps> = ({ isSubmitting }) => {
  return (
    <div className="flex justify-end mt-6">
      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Create Service
          </>
        )}
      </Button>
    </div>
  );
};

export default ServiceFormActions;
