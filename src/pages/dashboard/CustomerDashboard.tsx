
// Fixing the mock service cards to include description
const serviceCards = [
  {
    id: '1',
    title: 'Home Cleaning',
    description: 'Professional home cleaning services',
    category: 'home' as ServiceCategory,
    pricingModel: 'hourly' as PricingModel,
    price: 25,
    providerName: 'CleanCo',
    providerId: 'prov1',
    rating: 4.8,
    reviewCount: 120,
    image: '/images/services/cleaning.jpg',
    location: 'Windhoek',
  },
  {
    id: '2',
    title: 'Furniture Assembly',
    description: 'Expert furniture assembly service',
    category: 'home' as ServiceCategory,
    pricingModel: 'fixed' as PricingModel,
    price: 100,
    providerName: 'BuildIt',
    providerId: 'prov2',
    rating: 4.6,
    reviewCount: 85,
    image: '/images/services/assembly.jpg',
    location: 'Windhoek',
  }
];
