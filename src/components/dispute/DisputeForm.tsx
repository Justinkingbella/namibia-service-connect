
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dispute } from '@/types/booking';
import { Loader2 } from 'lucide-react';

interface DisputeFormProps {
  onSubmit: (dispute: Partial<Dispute>) => Promise<boolean>;
  onCancel: () => void;
}

const DisputeForm: React.FC<DisputeFormProps> = ({ onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    bookingId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.description || !formData.bookingId) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields"
      });
      return;
    }
    
    setLoading(true);
    const success = await onSubmit(formData);
    setLoading(false);
    
    if (success) {
      toast({
        title: "Dispute submitted",
        description: "Your dispute has been submitted successfully"
      });
      onCancel();
    } else {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error submitting your dispute"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a Dispute</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label htmlFor="bookingId" className="block text-sm font-medium mb-1">
                Booking Reference
              </label>
              <Input
                id="bookingId"
                name="bookingId"
                value={formData.bookingId}
                onChange={handleChange}
                placeholder="Enter booking ID"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief description of the issue"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide details about your dispute"
                rows={5}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Dispute"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DisputeForm;
