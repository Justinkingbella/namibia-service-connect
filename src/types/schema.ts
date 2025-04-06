
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone_number?: string;
          avatar_url?: string;
          email_verified: boolean;
          role: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          notification_preferences: {
            email: boolean;
            sms: boolean;
            push: boolean;
          };
        };
      };
      services: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          category: string;
          provider_id: string;
          provider_name: string;
          image?: string;
          features?: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
          pricing_model: string;
          location?: string;
          rating?: number;
          review_count?: number;
          availability?: Json;
          featured?: boolean;
          faqs?: Json;
        };
      };
      // ... additional tables can be defined here
    };
  };
}

export type ServiceCategory = string;
export type PricingModel = string;
