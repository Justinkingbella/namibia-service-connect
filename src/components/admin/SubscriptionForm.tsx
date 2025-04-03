import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash, Plus } from "lucide-react";

export interface SubscriptionPlan {
  id?: string;
  name: string;
  description: string;
  price: number;
  billingCycle: string;
  features: {
    name: string;
    included: boolean;
    limit?: number;
  }[];
  isActive: boolean;
  isPopular: boolean;
}

interface SubscriptionFormProps {
  plan?: SubscriptionPlan;
  onSubmit: (plan: SubscriptionPlan) => void;
  onCancel: () => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ 
  plan, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<SubscriptionPlan>(
    plan || {
      name: '',
      description: '',
      price: 0,
      billingCycle: 'monthly',
      features: [
        { name: 'Max Services', included: true, limit: 1 },
        { name: 'Featured Services', included: false },
        { name: 'Priority Support', included: false },
      ],
      isActive: true,
      isPopular: false,
    }
  );

  const handleChange = (field: keyof SubscriptionPlan, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index: number, field: string, value: any) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setFormData(prev => ({ ...prev, features: updatedFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { name: '', included: false }]
    }));
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData(prev => ({ ...prev, features: updatedFeatures }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{plan?.id ? 'Edit Plan' : 'Create New Plan'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price (NAD)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleChange('price', parseFloat(e.target.value))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="billingCycle">Billing Cycle</Label>
            <select
              id="billingCycle"
              className="w-full px-3 py-2 border rounded"
              value={formData.billingCycle}
              onChange={(e) => handleChange('billingCycle', e.target.value)}
              required
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label>Features</Label>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 border p-3 rounded">
                  <div className="flex-grow">
                    <Input
                      placeholder="Feature name"
                      value={feature.name}
                      onChange={(e) => handleFeatureChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  
                  {feature.name.toLowerCase().includes('max') && (
                    <div className="w-20">
                      <Input
                        type="number"
                        min="1"
                        placeholder="Limit"
                        value={feature.limit || ''}
                        onChange={(e) => handleFeatureChange(index, 'limit', parseInt(e.target.value))}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={feature.included}
                      onCheckedChange={(checked) => handleFeatureChange(index, 'included', checked)}
                    />
                    <span className="text-sm">Included</span>
                  </div>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isPopular"
              checked={formData.isPopular}
              onCheckedChange={(checked) => handleChange('isPopular', checked)}
            />
            <Label htmlFor="isPopular">Mark as Popular</Label>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {plan?.id ? 'Update Plan' : 'Create Plan'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default SubscriptionForm;
