
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceCategoryEnum, PricingModelEnum } from '@/types';

interface ServiceBasicInfoFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  price: number;
  setPrice: (value: number) => void;
  category: ServiceCategoryEnum;
  setCategory: (value: ServiceCategoryEnum) => void;
  pricingModel: PricingModelEnum;
  setPricingModel: (value: PricingModelEnum) => void;
}

export const ServiceBasicInfoForm: React.FC<ServiceBasicInfoFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  price,
  setPrice,
  category,
  setCategory,
  pricingModel,
  setPricingModel
}) => {
  return (
    <>
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
        <Select
          value={category}
          onValueChange={(value) => setCategory(value as ServiceCategoryEnum)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ServiceCategoryEnum)
              .filter(cat => cat !== 'all') // Skip the ALL category
              .map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase().replace('_', ' ')}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="pricingModel">Pricing Model</Label>
        <Select
          value={pricingModel}
          onValueChange={(value) => setPricingModel(value as PricingModelEnum)}
        >
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
    </>
  );
};

export default ServiceBasicInfoForm;
