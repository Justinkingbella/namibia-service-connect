export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          access_level: number | null
          admin_level: Database["public"]["Enums"]["admin_level"] | null
          created_at: string
          department: string | null
          id: string
          last_login: string | null
          permissions: string[] | null
          updated_at: string
        }
        Insert: {
          access_level?: number | null
          admin_level?: Database["public"]["Enums"]["admin_level"] | null
          created_at?: string
          department?: string | null
          id: string
          last_login?: string | null
          permissions?: string[] | null
          updated_at?: string
        }
        Update: {
          access_level?: number | null
          admin_level?: Database["public"]["Enums"]["admin_level"] | null
          created_at?: string
          department?: string | null
          id?: string
          last_login?: string | null
          permissions?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          cancellation_date: string | null
          cancellation_reason: string | null
          cancelled_by: string | null
          commission: number | null
          created_at: string
          customer_id: string
          customer_notes: string | null
          date: string
          duration: number | null
          end_time: string | null
          feedback: string | null
          id: string
          is_urgent: boolean | null
          notes: string | null
          payment_method: string | null
          payment_receipt: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          provider_id: string
          provider_notes: string | null
          rating: number | null
          refund_amount: number | null
          service_id: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          cancellation_date?: string | null
          cancellation_reason?: string | null
          cancelled_by?: string | null
          commission?: number | null
          created_at?: string
          customer_id: string
          customer_notes?: string | null
          date: string
          duration?: number | null
          end_time?: string | null
          feedback?: string | null
          id?: string
          is_urgent?: boolean | null
          notes?: string | null
          payment_method?: string | null
          payment_receipt?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          provider_id: string
          provider_notes?: string | null
          rating?: number | null
          refund_amount?: number | null
          service_id: string
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          cancellation_date?: string | null
          cancellation_reason?: string | null
          cancelled_by?: string | null
          commission?: number | null
          created_at?: string
          customer_id?: string
          customer_notes?: string | null
          date?: string
          duration?: number | null
          end_time?: string | null
          feedback?: string | null
          id?: string
          is_urgent?: boolean | null
          notes?: string | null
          payment_method?: string | null
          payment_receipt?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          provider_id?: string
          provider_notes?: string | null
          rating?: number | null
          refund_amount?: number | null
          service_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          is_active: boolean | null
          last_message: string | null
          last_message_date: string | null
          participants: string[]
          service_id: string | null
          unread_count: number | null
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_message?: string | null
          last_message_date?: string | null
          participants: string[]
          service_id?: string | null
          unread_count?: number | null
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_message?: string | null
          last_message_date?: string | null
          participants?: string[]
          service_id?: string | null
          unread_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          created_at: string
          id: string
          notification_preferences: Json | null
          preferred_categories: string[] | null
          saved_services: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          notification_preferences?: Json | null
          preferred_categories?: string[] | null
          saved_services?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_preferences?: Json | null
          preferred_categories?: string[] | null
          saved_services?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          admin_assigned_to: string | null
          admin_notes: string | null
          booking_id: string
          created_at: string
          customer_id: string
          description: string
          evidence_urls: string[] | null
          id: string
          priority: Database["public"]["Enums"]["dispute_priority"] | null
          provider_id: string
          refund_amount: number | null
          resolution: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["dispute_status"] | null
          subject: string
          updated_at: string
        }
        Insert: {
          admin_assigned_to?: string | null
          admin_notes?: string | null
          booking_id: string
          created_at?: string
          customer_id: string
          description: string
          evidence_urls?: string[] | null
          id?: string
          priority?: Database["public"]["Enums"]["dispute_priority"] | null
          provider_id: string
          refund_amount?: number | null
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["dispute_status"] | null
          subject: string
          updated_at?: string
        }
        Update: {
          admin_assigned_to?: string | null
          admin_notes?: string | null
          booking_id?: string
          created_at?: string
          customer_id?: string
          description?: string
          evidence_urls?: string[] | null
          id?: string
          priority?: Database["public"]["Enums"]["dispute_priority"] | null
          provider_id?: string
          refund_amount?: number | null
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["dispute_status"] | null
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_admin_assigned_to_fkey"
            columns: ["admin_assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          service_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          service_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          service_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: string[] | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_system_message: boolean | null
          message_type: Database["public"]["Enums"]["message_type"] | null
          metadata: Json | null
          read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          attachments?: string[] | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_system_message?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          metadata?: Json | null
          read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          attachments?: string[] | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_system_message?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          metadata?: Json | null
          read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          data: Json | null
          id: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string
          details: Json
          id: string
          is_default: boolean | null
          name: string
          type: Database["public"]["Enums"]["payment_method_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json
          id?: string
          is_default?: boolean | null
          name: string
          type: Database["public"]["Enums"]["payment_method_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json
          id?: string
          is_default?: boolean | null
          name?: string
          type?: Database["public"]["Enums"]["payment_method_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_records: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          description: string | null
          id: string
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_records_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          email_verified: boolean | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
      provider_earnings: {
        Row: {
          commission_paid: number | null
          created_at: string
          id: string
          net_earnings: number | null
          payout_date: string | null
          payout_reference: string | null
          payout_status: string | null
          period_end: string
          period_start: string
          provider_id: string
          total_bookings: number | null
          total_earnings: number | null
        }
        Insert: {
          commission_paid?: number | null
          created_at?: string
          id?: string
          net_earnings?: number | null
          payout_date?: string | null
          payout_reference?: string | null
          payout_status?: string | null
          period_end: string
          period_start: string
          provider_id: string
          total_bookings?: number | null
          total_earnings?: number | null
        }
        Update: {
          commission_paid?: number | null
          created_at?: string
          id?: string
          net_earnings?: number | null
          payout_date?: string | null
          payout_reference?: string | null
          payout_status?: string | null
          period_end?: string
          period_start?: string
          provider_id?: string
          total_bookings?: number | null
          total_earnings?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_earnings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_payouts: {
        Row: {
          amount: number
          bank_account_details: Json | null
          created_at: string
          fee: number | null
          id: string
          mobile_payment_details: Json | null
          net_amount: number
          notes: string | null
          payment_method: string
          processed_at: string | null
          provider_id: string
          reference_number: string | null
          status: string | null
        }
        Insert: {
          amount: number
          bank_account_details?: Json | null
          created_at?: string
          fee?: number | null
          id?: string
          mobile_payment_details?: Json | null
          net_amount: number
          notes?: string | null
          payment_method: string
          processed_at?: string | null
          provider_id: string
          reference_number?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          bank_account_details?: Json | null
          created_at?: string
          fee?: number | null
          id?: string
          mobile_payment_details?: Json | null
          net_amount?: number
          notes?: string | null
          payment_method?: string
          processed_at?: string | null
          provider_id?: string
          reference_number?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_payouts_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_profiles: {
        Row: {
          banner_url: string | null
          business_description: string | null
          business_name: string | null
          categories: string[] | null
          commission_rate: number | null
          completed_bookings: number | null
          created_at: string
          id: string
          rating: number | null
          rating_count: number | null
          services_count: number | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string
          verification_status:
            | Database["public"]["Enums"]["provider_verification_status"]
            | null
          verified_at: string | null
          verified_by: string | null
          website: string | null
        }
        Insert: {
          banner_url?: string | null
          business_description?: string | null
          business_name?: string | null
          categories?: string[] | null
          commission_rate?: number | null
          completed_bookings?: number | null
          created_at?: string
          id: string
          rating?: number | null
          rating_count?: number | null
          services_count?: number | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["provider_verification_status"]
            | null
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Update: {
          banner_url?: string | null
          business_description?: string | null
          business_name?: string | null
          categories?: string[] | null
          commission_rate?: number | null
          completed_bookings?: number | null
          created_at?: string
          id?: string
          rating?: number | null
          rating_count?: number | null
          services_count?: number | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["provider_verification_status"]
            | null
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_profiles_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          featured: boolean | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_category_id: string | null
          slug: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          featured?: boolean | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_category_id?: string | null
          slug?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          featured?: boolean | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_category_id?: string | null
          slug?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_reviews: {
        Row: {
          booking_id: string
          created_at: string
          customer_id: string
          id: string
          is_verified: boolean | null
          provider_id: string
          rating: number
          response: string | null
          response_date: string | null
          review: string | null
          service_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          customer_id: string
          id?: string
          is_verified?: boolean | null
          provider_id: string
          rating: number
          response?: string | null
          response_date?: string | null
          review?: string | null
          service_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          is_verified?: boolean | null
          provider_id?: string
          rating?: number
          response?: string | null
          response_date?: string | null
          review?: string | null
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          availability: Json | null
          category: Database["public"]["Enums"]["service_category_enum"]
          created_at: string
          description: string
          faqs: Json | null
          features: string[] | null
          id: string
          image: string | null
          is_active: boolean | null
          location: string | null
          price: number
          pricing_model: Database["public"]["Enums"]["pricing_model"]
          provider_id: string
          title: string
          updated_at: string
        }
        Insert: {
          availability?: Json | null
          category: Database["public"]["Enums"]["service_category_enum"]
          created_at?: string
          description: string
          faqs?: Json | null
          features?: string[] | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          location?: string | null
          price: number
          pricing_model: Database["public"]["Enums"]["pricing_model"]
          provider_id: string
          title: string
          updated_at?: string
        }
        Update: {
          availability?: Json | null
          category?: Database["public"]["Enums"]["service_category_enum"]
          created_at?: string
          description?: string
          faqs?: Json | null
          features?: string[] | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          location?: string | null
          price?: number
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          provider_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          allowed_services: number | null
          billing_cycle: string
          created_at: string
          credits: number | null
          description: string | null
          features: Json
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          max_bookings: number | null
          name: string
          price: number
          trial_period_days: number | null
          updated_at: string
        }
        Insert: {
          allowed_services?: number | null
          billing_cycle: string
          created_at?: string
          credits?: number | null
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          max_bookings?: number | null
          name: string
          price: number
          trial_period_days?: number | null
          updated_at?: string
        }
        Update: {
          allowed_services?: number | null
          billing_cycle?: string
          created_at?: string
          credits?: number | null
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          max_bookings?: number | null
          name?: string
          price?: number
          trial_period_days?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      subscription_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_id: string | null
          payment_method: string | null
          status: string | null
          subscription_plan_id: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          status?: string | null
          subscription_plan_id: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          status?: string | null
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
          {
            foreignKeyName: "subscription_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean | null
          name: string
          postal_code: string | null
          region: string | null
          street: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          country: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
          postal_code?: string | null
          region?: string | null
          street: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
          postal_code?: string | null
          region?: string | null
          street?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null
          bookings_remaining: number | null
          bookings_used: number | null
          cancellation_date: string | null
          cancellation_reason: string | null
          created_at: string
          credits_remaining: number | null
          credits_used: number | null
          end_date: string
          id: string
          payment_method: string | null
          start_date: string
          status: string | null
          subscription_plan_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          bookings_remaining?: number | null
          bookings_used?: number | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          created_at?: string
          credits_remaining?: number | null
          credits_used?: number | null
          end_date: string
          id?: string
          payment_method?: string | null
          start_date: string
          status?: string | null
          subscription_plan_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          bookings_remaining?: number | null
          bookings_used?: number | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          created_at?: string
          credits_remaining?: number | null
          credits_used?: number | null
          end_date?: string
          id?: string
          payment_method?: string | null
          start_date?: string
          status?: string | null
          subscription_plan_id?: string
          updated_at?: string
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
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_verifications: {
        Row: {
          admin_verified: boolean | null
          amount: number
          bank_used: string | null
          booking_id: string | null
          created_at: string
          customer_confirmed: boolean | null
          customer_id: string
          customer_phone: string | null
          date_submitted: string
          date_verified: string | null
          id: string
          mobile_operator: string | null
          notes: string | null
          payment_method: Database["public"]["Enums"]["wallet_payment_type"]
          provider_confirmed: boolean | null
          provider_id: string
          provider_phone: string | null
          receipt_image: string | null
          reference_number: string | null
          rejection_reason: string | null
          updated_at: string
          verification_status:
            | Database["public"]["Enums"]["wallet_verification_status"]
            | null
          verified_by: string | null
        }
        Insert: {
          admin_verified?: boolean | null
          amount: number
          bank_used?: string | null
          booking_id?: string | null
          created_at?: string
          customer_confirmed?: boolean | null
          customer_id: string
          customer_phone?: string | null
          date_submitted?: string
          date_verified?: string | null
          id?: string
          mobile_operator?: string | null
          notes?: string | null
          payment_method: Database["public"]["Enums"]["wallet_payment_type"]
          provider_confirmed?: boolean | null
          provider_id: string
          provider_phone?: string | null
          receipt_image?: string | null
          reference_number?: string | null
          rejection_reason?: string | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["wallet_verification_status"]
            | null
          verified_by?: string | null
        }
        Update: {
          admin_verified?: boolean | null
          amount?: number
          bank_used?: string | null
          booking_id?: string | null
          created_at?: string
          customer_confirmed?: boolean | null
          customer_id?: string
          customer_phone?: string | null
          date_submitted?: string
          date_verified?: string | null
          id?: string
          mobile_operator?: string | null
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["wallet_payment_type"]
          provider_confirmed?: boolean | null
          provider_id?: string
          provider_phone?: string | null
          receipt_image?: string | null
          reference_number?: string | null
          rejection_reason?: string | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["wallet_verification_status"]
            | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_verifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_verifications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_verifications_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_verifications_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      admin_level: "super" | "manager" | "support"
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "rejected"
        | "no_show"
        | "rescheduled"
        | "disputed"
      dispute_priority: "low" | "medium" | "high"
      dispute_status:
        | "pending"
        | "in_progress"
        | "in_review"
        | "resolved"
        | "rejected"
      message_type: "text" | "image" | "file" | "system"
      payment_method_type:
        | "credit_card"
        | "debit_card"
        | "bank_transfer"
        | "mobile_money"
        | "cash"
        | "wallet"
      payment_status:
        | "pending"
        | "paid"
        | "refunded"
        | "failed"
        | "cancelled"
        | "processing"
      pricing_model:
        | "HOURLY"
        | "FIXED"
        | "QUOTE"
        | "DAILY"
        | "WEEKLY"
        | "MONTHLY"
      provider_verification_status: "pending" | "verified" | "rejected"
      service_category_enum:
        | "CLEANING"
        | "PLUMBING"
        | "ELECTRICAL"
        | "CARPENTRY"
        | "GARDENING"
        | "IT_SUPPORT"
        | "TUTORING"
        | "FOOD_DELIVERY"
        | "TRANSPORTATION"
        | "MOVING"
        | "REPAIRS"
        | "CONSTRUCTION"
        | "EVENT_PLANNING"
        | "INTERIOR_DESIGN"
        | "OTHER"
      subscription_tier:
        | "free"
        | "basic"
        | "standard"
        | "premium"
        | "enterprise"
      user_role: "admin" | "provider" | "customer"
      wallet_payment_type: "e_wallet" | "easy_wallet" | "bank_transfer"
      wallet_verification_status:
        | "pending"
        | "verified"
        | "rejected"
        | "resubmitted"
        | "submitted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_level: ["super", "manager", "support"],
      booking_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "rejected",
        "no_show",
        "rescheduled",
        "disputed",
      ],
      dispute_priority: ["low", "medium", "high"],
      dispute_status: [
        "pending",
        "in_progress",
        "in_review",
        "resolved",
        "rejected",
      ],
      message_type: ["text", "image", "file", "system"],
      payment_method_type: [
        "credit_card",
        "debit_card",
        "bank_transfer",
        "mobile_money",
        "cash",
        "wallet",
      ],
      payment_status: [
        "pending",
        "paid",
        "refunded",
        "failed",
        "cancelled",
        "processing",
      ],
      pricing_model: ["HOURLY", "FIXED", "QUOTE", "DAILY", "WEEKLY", "MONTHLY"],
      provider_verification_status: ["pending", "verified", "rejected"],
      service_category_enum: [
        "CLEANING",
        "PLUMBING",
        "ELECTRICAL",
        "CARPENTRY",
        "GARDENING",
        "IT_SUPPORT",
        "TUTORING",
        "FOOD_DELIVERY",
        "TRANSPORTATION",
        "MOVING",
        "REPAIRS",
        "CONSTRUCTION",
        "EVENT_PLANNING",
        "INTERIOR_DESIGN",
        "OTHER",
      ],
      subscription_tier: ["free", "basic", "standard", "premium", "enterprise"],
      user_role: ["admin", "provider", "customer"],
      wallet_payment_type: ["e_wallet", "easy_wallet", "bank_transfer"],
      wallet_verification_status: [
        "pending",
        "verified",
        "rejected",
        "resubmitted",
        "submitted",
      ],
    },
  },
} as const
