
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface ServiceFeaturesFormProps {
  features: string[];
  setFeatures: (features: string[]) => void;
}

export const ServiceFeaturesForm: React.FC<ServiceFeaturesFormProps> = ({
  features,
  setFeatures
}) => {
  const [newFeature, setNewFeature] = useState('');

  const addFeature = () => {
    if (newFeature.trim() !== '') {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFeatures(features.filter(feature => feature !== featureToRemove));
  };

  return (
    <div>
      <Label>Features</Label>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter a feature"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addFeature();
            }
          }}
        />
        <Button type="button" size="sm" onClick={addFeature}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
      {features.length > 0 && (
        <div className="mt-2">
          {features.map((feature, index) => (
            <Badge key={index} className="mr-2 mb-2">
              {feature}
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 -mr-1 h-4 w-4"
                onClick={() => removeFeature(feature)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceFeaturesForm;
