
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ServiceData, ServiceCategoryEnum, PricingModelEnum } from '@/types';
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Loader2, Plus, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface CreateServiceFormProps {
  onSubmit: (data: Partial<ServiceData>) => Promise<void>;
  isSubmitting?: boolean;
  isLoading?: boolean; // Add isLoading for compatibility
}

const CreateServiceForm: React.FC<CreateServiceFormProps> = ({ onSubmit, isSubmitting = false, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState(ServiceCategoryEnum.HOME);
  const [pricingModel, setPricingModel] = useState(PricingModelEnum.FIXED);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData: Partial<ServiceData> = {
      title,
      description,
      price,
      category,
      pricing_model: pricingModel,
      features,
    };
    
    await onSubmit(serviceData);
  };

  const addFeature = () => {
    if (newFeature.trim() !== '') {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFeatures(features.filter(feature => feature !== featureToRemove));
  };

  // Use either isSubmitting or isLoading
  const loading = isSubmitting || isLoading;

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Service Title</Label>
            <Input
              id="title"
              placeholder="Enter service title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter service description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price (N$)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price"
              value={price === 0 ? '' : price.toString()}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ServiceCategoryEnum)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ServiceCategoryEnum).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="pricingModel">Pricing Model</Label>
            <Select value={pricingModel} onValueChange={(value) => setPricingModel(value as PricingModelEnum)}>
              <SelectTrigger>
                <SelectValue placeholder="Select pricing model" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PricingModelEnum).map((model) => (
                  <SelectItem key={model} value={model}>
                    {model.charAt(0).toUpperCase() + model.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Features</Label>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter a feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
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
        </CardContent>
      </Card>
      
      <div className="flex justify-end mt-6">
        <Button type="submit" disabled={loading} className="w-full md:w-auto">
          {loading ? (
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
    </form>
  );
};

export default CreateServiceForm;
