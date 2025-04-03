
// Update the form state initialization to use proper type
const [formData, setFormData] = useState<Partial<Service>>({
  title: '',
  description: '',
  price: 0,
  pricingModel: 'fixed' as PricingModel,
  category: 'all' as ServiceCategory,
  features: [],
  isActive: true,
});
