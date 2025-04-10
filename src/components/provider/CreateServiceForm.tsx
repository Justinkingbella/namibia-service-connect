
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceData, ServiceCategoryEnum, PricingModelEnum } from '@/types';
import ServiceBasicInfoForm from './form/ServiceBasicInfoForm';
import ServiceFeaturesForm from './form/ServiceFeaturesForm';
import ServiceFormActions from './form/ServiceFormActions';

export interface CreateServiceFormProps {
  onSubmit: (data: Partial<ServiceData>) => Promise<void>;
  isSubmitting?: boolean;
  isLoading?: boolean;
}

const CreateServiceForm: React.FC<CreateServiceFormProps> = ({ onSubmit, isSubmitting = false, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState(ServiceCategoryEnum.CLEANING);
  const [pricingModel, setPricingModel] = useState(PricingModelEnum.FIXED);
  const [features, setFeatures] = useState<string[]>([]);

  // Use either isSubmitting or isLoading
  const loading = isSubmitting || isLoading;

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

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-4">
          <ServiceBasicInfoForm 
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            price={price}
            setPrice={setPrice}
            category={category}
            setCategory={setCategory}
            pricingModel={pricingModel}
            setPricingModel={setPricingModel}
          />
          
          <ServiceFeaturesForm 
            features={features}
            setFeatures={setFeatures}
          />
        </CardContent>
      </Card>
      
      <ServiceFormActions isSubmitting={loading} />
    </form>
  );
};

export default CreateServiceForm;
