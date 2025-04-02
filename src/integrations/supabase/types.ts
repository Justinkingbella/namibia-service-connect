export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json
          status: string
          type: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json
          status?: string
          type: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json
          status?: string
          type?: string
        }
        Relationships: []
      }
      admin_permissions: {
        Row: {
          created_at: string | null
          id: string
          permissions: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permissions?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permissions?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      booking_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      bookings: {
        Row: {
          commission: number
          created_at: string | null
          customer_id: string
          date: string
          duration: number | null
          end_time: string | null
          id: string
          is_urgent: boolean | null
          notes: string | null
          payment_method: string
          payment_status: string
          provider_id: string
          service_id: string
          start_time: string
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          commission: number
          created_at?: string | null
          customer_id: string
          date: string
          duration?: number | null
          end_time?: string | null
          id?: string
          is_urgent?: boolean | null
          notes?: string | null
          payment_method: string
          payment_status?: string
          provider_id: string
          service_id: string
          start_time: string
          status?: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          commission?: number
          created_at?: string | null
          customer_id?: string
          date?: string
          duration?: number | null
          end_time?: string | null
          id?: string
          is_urgent?: boolean | null
          notes?: string | null
          payment_method?: string
          payment_status?: string
          provider_id?: string
          service_id?: string
          start_time?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          block_name: string
          buttons: Json | null
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          order_index: number
          page_name: string
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          block_name: string
          buttons?: Json | null
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          order_index?: number
          page_name: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          block_name?: string
          buttons?: Json | null
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          order_index?: number
          page_name?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message: string | null
          last_message_date: string | null
          unread_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_date?: string | null
          unread_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_date?: string | null
          unread_count?: number | null
        }
        Relationships: []
      }
      disputes: {
        Row: {
          admin_notes: string | null
          booking_id: string | null
          created_at: string | null
          customer_id: string | null
          description: string
          id: string
          provider_id: string | null
          resolution: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          booking_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description: string
          id?: string
          provider_id?: string | null
          resolution?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          booking_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string
          id?: string
          provider_id?: string | null
          resolution?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disputes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_services: {
        Row: {
          created_at: string | null
          id: string
          service_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          service_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          service_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachments: string[] | null
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          read: boolean | null
          recipient_id: string | null
          sender_id: string | null
        }
        Insert: {
          attachments?: string[] | null
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Update: {
          attachments?: string[] | null
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      page_sections: {
        Row: {
          buttons: Json | null
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          order_index: number
          page_name: string
          section_name: string
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          buttons?: Json | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          order_index?: number
          page_name: string
          section_name: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          buttons?: Json | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          order_index?: number
          page_name?: string
          section_name?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          description: string
          id: string
          payment_method: string
          status: string
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          payment_method: string
          status: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          payment_method?: string
          status?: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_method_details: {
        Row: {
          created_at: string
          details: Json
          id: string
          is_default: boolean | null
          name: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details: Json
          id?: string
          is_default?: boolean | null
          name: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json
          id?: string
          is_default?: boolean | null
          name?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          created_at: string | null
          details: Json
          id: string
          is_default: boolean | null
          name: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details: Json
          id?: string
          is_default?: boolean | null
          name: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json
          id?: string
          is_default?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string
          gateway: string
          gateway_response: Json | null
          id: string
          metadata: Json
          method: string
          reference: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description: string
          gateway: string
          gateway_response?: Json | null
          id?: string
          metadata?: Json
          method: string
          reference: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string
          gateway?: string
          gateway_response?: Json | null
          id?: string
          metadata?: Json
          method?: string
          reference?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_analytics: {
        Row: {
          category_breakdown: Json | null
          created_at: string | null
          date: string
          id: string
          location_breakdown: Json | null
          new_providers: number
          new_users: number
          total_bookings: number
          total_commission: number
          total_providers: number
          total_revenue: number
          total_users: number
        }
        Insert: {
          category_breakdown?: Json | null
          created_at?: string | null
          date: string
          id?: string
          location_breakdown?: Json | null
          new_providers?: number
          new_users?: number
          total_bookings?: number
          total_commission?: number
          total_providers?: number
          total_revenue?: number
          total_users?: number
        }
        Update: {
          category_breakdown?: Json | null
          created_at?: string | null
          date?: string
          id?: string
          location_breakdown?: Json | null
          new_providers?: number
          new_users?: number
          total_bookings?: number
          total_commission?: number
          total_providers?: number
          total_revenue?: number
          total_users?: number
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active: boolean | null
          address: string | null
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          city: string | null
          country: string | null
          created_at: string | null
          favorites: string[] | null
          first_name: string | null
          id: string
          last_name: string | null
          loyalty_points: number | null
          phone_number: string | null
          preferred_language: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          favorites?: string[] | null
          first_name?: string | null
          id: string
          last_name?: string | null
          loyalty_points?: number | null
          phone_number?: string | null
          preferred_language?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          favorites?: string[] | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          loyalty_points?: number | null
          phone_number?: string | null
          preferred_language?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string | null
          customer_id: string
          id: string
          is_published: boolean | null
          provider_id: string
          rating: number
          response: string | null
          service_id: string
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id: string
          id?: string
          is_published?: boolean | null
          provider_id: string
          rating: number
          response?: string | null
          service_id: string
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id?: string
          id?: string
          is_published?: boolean | null
          provider_id?: string
          rating?: number
          response?: string | null
          service_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_providers: {
        Row: {
          address: string | null
          avatar_url: string | null
          banner_url: string | null
          business_description: string | null
          business_name: string | null
          city: string | null
          commission_rate: number | null
          completed_bookings: number | null
          country: string | null
          created_at: string | null
          email: string
          id: string
          phone_number: string | null
          rating: number | null
          rating_count: number | null
          services_count: number | null
          subscription_tier: string | null
          updated_at: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          business_description?: string | null
          business_name?: string | null
          city?: string | null
          commission_rate?: number | null
          completed_bookings?: number | null
          country?: string | null
          created_at?: string | null
          email: string
          id: string
          phone_number?: string | null
          rating?: number | null
          rating_count?: number | null
          services_count?: number | null
          subscription_tier?: string | null
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          business_description?: string | null
          business_name?: string | null
          city?: string | null
          commission_rate?: number | null
          completed_bookings?: number | null
          country?: string | null
          created_at?: string | null
          email?: string
          id?: string
          phone_number?: string | null
          rating?: number | null
          rating_count?: number | null
          services_count?: number | null
          subscription_tier?: string | null
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          is_active: boolean | null
          location: string | null
          price: number
          pricing_model: string
          provider_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          location?: string | null
          price: number
          pricing_model: string
          provider_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          location?: string | null
          price?: number
          pricing_model?: string
          provider_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          billing_cycle: string
          created_at: string | null
          credits: number
          description: string
          features: Json
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          max_bookings: number
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          billing_cycle: string
          created_at?: string | null
          credits: number
          description: string
          features?: Json
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          max_bookings: number
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: string
          created_at?: string | null
          credits?: number
          description?: string
          features?: Json
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          max_bookings?: number
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_id: string | null
          payment_method: string
          status: string
          subscription_plan_id: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_id?: string | null
          payment_method: string
          status: string
          subscription_plan_id: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string
          status?: string
          subscription_plan_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_transactions_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_2fa: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          secret: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          secret?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          secret?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          city: string
          country: string
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          postal_code: string | null
          region: string | null
          street: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          city: string
          country: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          postal_code?: string | null
          region?: string | null
          street: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          postal_code?: string | null
          region?: string | null
          street?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json
          status: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json
          status?: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          payment_id: string | null
          payment_method: string
          start_date: string
          status: string
          subscription_plan_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          payment_id?: string | null
          payment_method: string
          start_date?: string
          status?: string
          subscription_plan_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          payment_id?: string | null
          payment_method?: string
          start_date?: string
          status?: string
          subscription_plan_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_verification_requests: {
        Row: {
          admin_verified: boolean
          amount: number
          bank_used: string | null
          booking_id: string
          created_at: string
          customer_confirmed: boolean
          customer_id: string
          customer_phone: string
          date_submitted: string
          date_verified: string | null
          id: string
          mobile_operator: string | null
          notes: string | null
          payment_method: string
          proof_type: string
          provider_confirmed: boolean
          provider_id: string
          provider_phone: string | null
          receipt_image: string | null
          reference_number: string
          rejection_reason: string | null
          updated_at: string
          verification_status: string
          verified_by: string | null
        }
        Insert: {
          admin_verified?: boolean
          amount: number
          bank_used?: string | null
          booking_id: string
          created_at?: string
          customer_confirmed?: boolean
          customer_id: string
          customer_phone: string
          date_submitted?: string
          date_verified?: string | null
          id?: string
          mobile_operator?: string | null
          notes?: string | null
          payment_method: string
          proof_type: string
          provider_confirmed?: boolean
          provider_id: string
          provider_phone?: string | null
          receipt_image?: string | null
          reference_number: string
          rejection_reason?: string | null
          updated_at?: string
          verification_status?: string
          verified_by?: string | null
        }
        Update: {
          admin_verified?: boolean
          amount?: number
          bank_used?: string | null
          booking_id?: string
          created_at?: string
          customer_confirmed?: boolean
          customer_id?: string
          customer_phone?: string
          date_submitted?: string
          date_verified?: string | null
          id?: string
          mobile_operator?: string | null
          notes?: string | null
          payment_method?: string
          proof_type?: string
          provider_confirmed?: boolean
          provider_id?: string
          provider_phone?: string | null
          receipt_image?: string | null
          reference_number?: string
          rejection_reason?: string | null
          updated_at?: string
          verification_status?: string
          verified_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_provider_respond_to_review: {
        Args: {
          provider_uuid: string
          review_id: string
        }
        Returns: boolean
      }
      get_gateway_breakdown: {
        Args: Record<PropertyKey, never>
        Returns: {
          gateway: string
          count: number
          total_amount: number
        }[]
      }
      is_admin: {
        Args: {
          uid: string
        }
        Returns: boolean
      }
      sum_payment_amounts: {
        Args: Record<PropertyKey, never>
        Returns: {
          sum: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
