
export interface ContentBlock {
  id: string;
  page_name: string;
  block_name: string;
  title: string;
  subtitle: string;
  content: string;
  order_index: number;
  image_url: string;
  buttons: any[];
  created_at: string;
  updated_at: string;
}

// Mock data getter function - would be replaced with API call in production
export const getPageContent = async (pageName: string): Promise<ContentBlock[]> => {
  // This is mock data. In a real implementation, this would be fetched from an API
  const mockContentBlocks: ContentBlock[] = [
    {
      id: '1',
      page_name: 'home',
      block_name: 'hero',
      title: 'Namibia Service Hub',
      subtitle: 'Find trusted service providers in your area',
      content: 'Connect with skilled professionals and businesses for all your service needs. From home services to professional help, we've got you covered.',
      order_index: 1,
      image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2340&auto=format&fit=crop',
      buttons: [
        { label: 'Find Services', url: '/services', variant: 'primary' },
        { label: 'Become a Provider', url: '/auth/sign-up', variant: 'outline' }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      page_name: 'home',
      block_name: 'features',
      title: 'Why Choose Us',
      subtitle: 'Features that make us stand out',
      content: 'Easy booking, secure payments, and verified providers. We make finding and booking services simple and reliable.',
      order_index: 2,
      image_url: '',
      buttons: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      page_name: 'about',
      block_name: 'mission',
      title: 'Our Mission',
      subtitle: 'Connecting Namibians with quality services',
      content: 'We aim to revolutionize how services are discovered and booked in Namibia, creating opportunities for service providers and convenience for customers.',
      order_index: 1,
      image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2342&auto=format&fit=crop',
      buttons: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Filter content blocks by page name
  return mockContentBlocks.filter(block => block.page_name === pageName);
};

// Function to get single content block by page name and block name
export const getContentBlock = async (pageName: string, blockName: string): Promise<ContentBlock | null> => {
  const pageContent = await getPageContent(pageName);
  return pageContent.find(block => block.block_name === blockName) || null;
};

// Update content block (mock implementation)
export const updateContentBlock = async (blockId: string, updates: Partial<ContentBlock>): Promise<ContentBlock> => {
  // In a real implementation, this would update via an API
  console.log('Updating content block:', blockId, updates);
  // Mock return - in a real implementation, this would return the updated block from the API
  return {
    id: blockId,
    page_name: 'updated-page',
    block_name: 'updated-block',
    title: updates.title || 'Updated Title',
    subtitle: updates.subtitle || 'Updated Subtitle',
    content: updates.content || 'Updated content text',
    order_index: 1,
    image_url: updates.image_url || '',
    buttons: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

// Upload content image (mock implementation)
export const uploadContentImage = async (file: File, path?: string): Promise<string> => {
  // In a real implementation, this would upload to a storage service
  console.log('Uploading image:', file.name, path || 'default-path');
  return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2342&auto=format&fit=crop';
};

// Upload general image (mock implementation)
export const uploadImage = async (file: File, path?: string): Promise<string> => {
  // This is just an alias for uploadContentImage for now
  return uploadContentImage(file, path);
};

// Save content block (mock implementation)
export const saveContentBlock = async (block: ContentBlock): Promise<ContentBlock> => {
  // In a real implementation, this would save to an API
  console.log('Saving content block:', block);
  return block;
};

// Delete content block (mock implementation)
export const deleteContentBlock = async (blockId: string): Promise<boolean> => {
  // In a real implementation, this would delete via an API
  console.log('Deleting content block:', blockId);
  return true;
};

// Get sections by name (mock implementation)
export const getSectionsByName = async (pageName: string, sectionName: string): Promise<PageSection | null> => {
  const sections = mockPageSections.filter(section => 
    section.page_name === pageName && section.section_name === sectionName
  );
  return sections.length > 0 ? sections[0] : null;
};

// Update page section (mock implementation)
export const updatePageSection = async (sectionId: string, updates: Partial<PageSection>): Promise<PageSection> => {
  // In a real implementation, this would update via an API
  console.log('Updating page section:', sectionId, updates);
  // Mock return - in a real implementation, this would return the updated section from the API
  return {
    id: sectionId,
    page_name: 'updated-page',
    section_name: 'updated-section',
    title: updates.title || 'Updated Title',
    subtitle: updates.subtitle || 'Updated Subtitle',
    content: updates.content || 'Updated content text',
    image_url: updates.image_url || '',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

// Get site settings (mock implementation)
export const getSiteSettings = async (): Promise<Record<string, any>> => {
  // Mock site settings
  return {
    site_name: 'Namibia Service Hub',
    site_description: 'Find trusted service providers in Namibia',
    primary_color: '#3b82f6',
    secondary_color: '#10b981',
    contact_email: 'info@namibiaservicehub.com',
    contact_phone: '+264 61 123 4567',
    facebook_url: 'https://facebook.com/namibiaservicehub',
    instagram_url: 'https://instagram.com/namibiaservicehub',
    twitter_url: 'https://twitter.com/namibiaservices',
    terms_url: '/terms',
    privacy_url: '/privacy',
    logo_url: '/logo.png',
    favicon_url: '/favicon.ico',
    currency: 'N$',
    default_lang: 'en'
  };
};

// Get service categories (mock implementation)
export const getServiceCategories = async (): Promise<any[]> => {
  // Mock service categories
  return [
    {
      id: '1',
      name: 'Home Services',
      slug: 'home-services',
      description: 'Services for your home including cleaning, repairs, and maintenance',
      icon: 'home',
      image_url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=2340&auto=format&fit=crop',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subcategories: [
        { id: '11', name: 'Cleaning', slug: 'cleaning' },
        { id: '12', name: 'Plumbing', slug: 'plumbing' },
        { id: '13', name: 'Electrical', slug: 'electrical' }
      ]
    },
    {
      id: '2',
      name: 'Transportation',
      slug: 'transportation',
      description: 'Transportation services including cab services, moving, and deliveries',
      icon: 'car',
      image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2340&auto=format&fit=crop',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subcategories: [
        { id: '21', name: 'Cab Service', slug: 'cab-service' },
        { id: '22', name: 'Moving', slug: 'moving' },
        { id: '23', name: 'Delivery', slug: 'delivery' }
      ]
    },
    {
      id: '3',
      name: 'Professional Services',
      slug: 'professional',
      description: 'Professional services including tutoring, consulting, and legal assistance',
      icon: 'briefcase',
      image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2340&auto=format&fit=crop',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subcategories: [
        { id: '31', name: 'Tutoring', slug: 'tutoring' },
        { id: '32', name: 'Legal', slug: 'legal' },
        { id: '33', name: 'Consulting', slug: 'consulting' }
      ]
    }
  ];
};

// PageSection interface for section-based content
export interface PageSection {
  id: string;
  page_name: string;
  section_name: string;
  title: string;
  subtitle: string;
  content: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Mock page sections data
const mockPageSections: PageSection[] = [
  {
    id: '1',
    page_name: 'home',
    section_name: 'hero',
    title: 'Your One-Stop Shop for Services in Namibia',
    subtitle: 'Connect with trusted professionals in your area',
    content: 'Whether you need home services, professional help, or errands - we connect you with the best service providers in Namibia.',
    image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2340&auto=format&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    page_name: 'about',
    section_name: 'company',
    title: 'About Namibia Service Hub',
    subtitle: 'Our journey to connect Namibians with quality services',
    content: 'Founded in 2023, Namibia Service Hub aims to revolutionize how services are discovered and booked throughout the country. We believe in creating opportunities for local businesses while making it easier for customers to find reliable help.',
    image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2342&auto=format&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
