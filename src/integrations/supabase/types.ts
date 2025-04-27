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
      blog_posts: {
        Row: {
          author_id: string | null
          categories: string[] | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          categories?: string[] | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          categories?: string[] | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          cancellation_date: string | null
          cancellation_reason: string | null
          cancelled_by: string | null
          commission: number
          created_at: string | null
          customer_id: string
          customer_notes: string | null
          date: string
          duration: number | null
          end_time: string | null
          feedback: string | null
          id: string
          is_urgent: boolean | null
          notes: string | null
          payment_method: string
          payment_receipt: string | null
          payment_status: string
          provider_id: string
          provider_notes: string | null
          rating: number | null
          refund_amount: number | null
          service_id: string
          start_time: string
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          cancellation_date?: string | null
          cancellation_reason?: string | null
          cancelled_by?: string | null
          commission: number
          created_at?: string | null
          customer_id: string
          customer_notes?: string | null
          date: string
          duration?: number | null
          end_time?: string | null
          feedback?: string | null
          id?: string
          is_urgent?: boolean | null
          notes?: string | null
          payment_method: string
          payment_receipt?: string | null
          payment_status?: string
          provider_id: string
          provider_notes?: string | null
          rating?: number | null
          refund_amount?: number | null
          service_id: string
          start_time: string
          status?: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          cancellation_date?: string | null
          cancellation_reason?: string | null
          cancelled_by?: string | null
          commission?: number
          created_at?: string | null
          customer_id?: string
          customer_notes?: string | null
          date?: string
          duration?: number | null
          end_time?: string | null
          feedback?: string | null
          id?: string
          is_urgent?: boolean | null
          notes?: string | null
          payment_method?: string
          payment_receipt?: string | null
          payment_status?: string
          provider_id?: string
          provider_notes?: string | null
          rating?: number | null
          refund_amount?: number | null
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
          is_active: boolean | null
          metadata: Json | null
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
          is_active?: boolean | null
          metadata?: Json | null
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
          is_active?: boolean | null
          metadata?: Json | null
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
          booking_id: string | null
          created_at: string | null
          id: string
          last_message: string | null
          last_message_date: string | null
          service_id: string | null
          status: string | null
          unread_count: number | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_date?: string | null
          service_id?: string | null
          status?: string | null
          unread_count?: number | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_date?: string | null
          service_id?: string | null
          status?: string | null
          unread_count?: number | null
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
      coupon_redemptions: {
        Row: {
          coupon_id: string
          created_at: string | null
          discount_amount: number
          id: string
          redeemed_at: string | null
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string | null
          discount_amount: number
          id?: string
          redeemed_at?: string | null
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string | null
          discount_amount?: number
          id?: string
          redeemed_at?: string | null
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          applicable_plans: string[] | null
          code: string
          created_at: string | null
          current_uses: number | null
          description: string | null
          discount_type: string
          discount_value: number
          expiry_date: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          applicable_plans?: string[] | null
          code: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type: string
          discount_value: number
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          applicable_plans?: string[] | null
          code?: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          id: string
          notification_preferences: Json | null
          preferred_categories: string[] | null
          saved_services: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          notification_preferences?: Json | null
          preferred_categories?: string[] | null
          saved_services?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notification_preferences?: Json | null
          preferred_categories?: string[] | null
          saved_services?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      disputes: {
        Row: {
          admin_assigned_to: string | null
          admin_notes: string | null
          booking_id: string | null
          created_at: string | null
          customer_id: string | null
          description: string
          evidence_urls: string[] | null
          id: string
          priority: string | null
          provider_id: string | null
          refund_amount: number | null
          resolution: string | null
          resolution_date: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          admin_assigned_to?: string | null
          admin_notes?: string | null
          booking_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description: string
          evidence_urls?: string[] | null
          id?: string
          priority?: string | null
          provider_id?: string | null
          refund_amount?: number | null
          resolution?: string | null
          resolution_date?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          admin_assigned_to?: string | null
          admin_notes?: string | null
          booking_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string
          evidence_urls?: string[] | null
          id?: string
          priority?: string | null
          provider_id?: string | null
          refund_amount?: number | null
          resolution?: string | null
          resolution_date?: string | null
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
      loyalty_points_transactions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          points: number
          reference_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          points: number
          reference_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          points?: number
          reference_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_transactions_user_id_fkey"
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
          conversation_id: string | null
          created_at: string | null
          id: string
          is_system_message: boolean | null
          message_type: string | null
          metadata: Json | null
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
          is_system_message?: boolean | null
          message_type?: string | null
          metadata?: Json | null
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
          is_system_message?: boolean | null
          message_type?: string | null
          metadata?: Json | null
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
      notifications: {
        Row: {
          action_url: string | null
          content: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          content: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          content?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
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
      page_sections: {
        Row: {
          buttons: Json | null
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          metadata: Json | null
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
          is_active?: boolean | null
          metadata?: Json | null
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
          is_active?: boolean | null
          metadata?: Json | null
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
          booking_id: string | null
          created_at: string
          currency: string
          description: string
          fee: number | null
          gateway: string
          gateway_response: Json | null
          id: string
          metadata: Json
          method: string
          net_amount: number | null
          payment_provider: string | null
          reference: string
          status: string
          transaction_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          description: string
          fee?: number | null
          gateway: string
          gateway_response?: Json | null
          id?: string
          metadata?: Json
          method: string
          net_amount?: number | null
          payment_provider?: string | null
          reference: string
          status: string
          transaction_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          description?: string
          fee?: number | null
          gateway?: string
          gateway_response?: Json | null
          id?: string
          metadata?: Json
          method?: string
          net_amount?: number | null
          payment_provider?: string | null
          reference?: string
          status?: string
          transaction_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_features: {
        Row: {
          created_at: string | null
          custom_properties: Json | null
          feature_id: string
          id: string
          included: boolean | null
          limit_value: number | null
          plan_id: string
        }
        Insert: {
          created_at?: string | null
          custom_properties?: Json | null
          feature_id: string
          id?: string
          included?: boolean | null
          limit_value?: number | null
          plan_id: string
        }
        Update: {
          created_at?: string | null
          custom_properties?: Json | null
          feature_id?: string
          id?: string
          included?: boolean | null
          limit_value?: number | null
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "subscription_features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_features_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
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
          email: string | null
          email_verified: boolean | null
          favorites: string[] | null
          first_name: string | null
          id: string
          last_active: string | null
          last_name: string | null
          loyalty_points: number | null
          phone_number: string | null
          preferred_language: string | null
          registration_completed: boolean | null
          role: string | null
          total_spent: number | null
          updated_at: string | null
          user_preferences: Json | null
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
          email?: string | null
          email_verified?: boolean | null
          favorites?: string[] | null
          first_name?: string | null
          id: string
          last_active?: string | null
          last_name?: string | null
          loyalty_points?: number | null
          phone_number?: string | null
          preferred_language?: string | null
          registration_completed?: boolean | null
          role?: string | null
          total_spent?: number | null
          updated_at?: string | null
          user_preferences?: Json | null
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
          email?: string | null
          email_verified?: boolean | null
          favorites?: string[] | null
          first_name?: string | null
          id?: string
          last_active?: string | null
          last_name?: string | null
          loyalty_points?: number | null
          phone_number?: string | null
          preferred_language?: string | null
          registration_completed?: boolean | null
          role?: string | null
          total_spent?: number | null
          updated_at?: string | null
          user_preferences?: Json | null
        }
        Relationships: []
      }
      provider_analytics: {
        Row: {
          avg_rating: number | null
          bookings_completed: number | null
          bookings_received: number | null
          created_at: string | null
          date: string
          id: string
          new_reviews: number | null
          profile_views: number | null
          provider_id: string
          total_earnings: number | null
        }
        Insert: {
          avg_rating?: number | null
          bookings_completed?: number | null
          bookings_received?: number | null
          created_at?: string | null
          date: string
          id?: string
          new_reviews?: number | null
          profile_views?: number | null
          provider_id: string
          total_earnings?: number | null
        }
        Update: {
          avg_rating?: number | null
          bookings_completed?: number | null
          bookings_received?: number | null
          created_at?: string | null
          date?: string
          id?: string
          new_reviews?: number | null
          profile_views?: number | null
          provider_id?: string
          total_earnings?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_analytics_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_earnings: {
        Row: {
          commission_paid: number
          created_at: string | null
          id: string
          net_earnings: number
          payout_date: string | null
          payout_reference: string | null
          payout_status: string
          period_end: string
          period_start: string
          provider_id: string
          total_bookings: number
          total_earnings: number
          updated_at: string | null
        }
        Insert: {
          commission_paid?: number
          created_at?: string | null
          id?: string
          net_earnings?: number
          payout_date?: string | null
          payout_reference?: string | null
          payout_status?: string
          period_end: string
          period_start: string
          provider_id: string
          total_bookings?: number
          total_earnings?: number
          updated_at?: string | null
        }
        Update: {
          commission_paid?: number
          created_at?: string | null
          id?: string
          net_earnings?: number
          payout_date?: string | null
          payout_reference?: string | null
          payout_status?: string
          period_end?: string
          period_start?: string
          provider_id?: string
          total_bookings?: number
          total_earnings?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_earnings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_payouts: {
        Row: {
          amount: number
          bank_account_details: Json | null
          created_at: string | null
          fee: number | null
          id: string
          mobile_payment_details: Json | null
          net_amount: number
          notes: string | null
          payment_method: string
          processed_at: string | null
          provider_id: string
          reference_number: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          bank_account_details?: Json | null
          created_at?: string | null
          fee?: number | null
          id?: string
          mobile_payment_details?: Json | null
          net_amount: number
          notes?: string | null
          payment_method: string
          processed_at?: string | null
          provider_id: string
          reference_number?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bank_account_details?: Json | null
          created_at?: string | null
          fee?: number | null
          id?: string
          mobile_payment_details?: Json | null
          net_amount?: number
          notes?: string | null
          payment_method?: string
          processed_at?: string | null
          provider_id?: string
          reference_number?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_payouts_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      review_votes: {
        Row: {
          created_at: string | null
          id: string
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_helpful?: boolean
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string | null
          customer_id: string
          helpfulness: number | null
          id: string
          is_published: boolean | null
          provider_id: string
          rating: number
          ratings: Json | null
          response: string | null
          response_date: string | null
          service_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id: string
          helpfulness?: number | null
          id?: string
          is_published?: boolean | null
          provider_id: string
          rating: number
          ratings?: Json | null
          response?: string | null
          response_date?: string | null
          service_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id?: string
          helpfulness?: number | null
          id?: string
          is_published?: boolean | null
          provider_id?: string
          rating?: number
          ratings?: Json | null
          response?: string | null
          response_date?: string | null
          service_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          points_used: number
          redemption_date: string | null
          reward_id: string
          status: string
          used: boolean | null
          used_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          points_used: number
          redemption_date?: string | null
          reward_id: string
          status?: string
          used?: boolean | null
          used_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          points_used?: number
          redemption_date?: string | null
          reward_id?: string
          status?: string
          used?: boolean | null
          used_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          created_at: string | null
          current_redemptions: number | null
          description: string
          end_date: string | null
          id: string
          is_active: boolean | null
          max_redemptions: number | null
          name: string
          points_required: number
          reward_type: string
          reward_value: Json
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_redemptions?: number | null
          description: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_redemptions?: number | null
          name: string
          points_required: number
          reward_type: string
          reward_value: Json
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_redemptions?: number | null
          description?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_redemptions?: number | null
          name?: string
          points_required?: number
          reward_type?: string
          reward_value?: Json
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      seo_metadata: {
        Row: {
          canonical_url: string | null
          created_at: string | null
          description: string
          id: string
          keywords: string[] | null
          og_image: string | null
          page_path: string
          title: string
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string | null
          description: string
          id?: string
          keywords?: string[] | null
          og_image?: string | null
          page_path: string
          title: string
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string | null
          description?: string
          id?: string
          keywords?: string[] | null
          og_image?: string | null
          page_path?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_analytics: {
        Row: {
          bookings: number | null
          conversion_rate: number | null
          created_at: string | null
          date: string
          favorites: number | null
          id: string
          service_id: string
          views: number | null
        }
        Insert: {
          bookings?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          date: string
          favorites?: number | null
          id?: string
          service_id: string
          views?: number | null
        }
        Update: {
          bookings?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          date?: string
          favorites?: number | null
          id?: string
          service_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_analytics_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string | null
          description: string | null
          featured: boolean | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
          parent_category_id: string | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
          parent_category_id?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          parent_category_id?: string | null
          slug?: string | null
          updated_at?: string | null
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
          is_active: boolean | null
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
          is_active?: boolean | null
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
          is_active?: boolean | null
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
          availability: Json | null
          category: string
          created_at: string | null
          description: string | null
          faqs: Json | null
          featured: boolean | null
          features: string[] | null
          id: string
          image: string | null
          is_active: boolean | null
          location: string | null
          price: number
          pricing_model: string
          provider_id: string | null
          slug: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          availability?: Json | null
          category: string
          created_at?: string | null
          description?: string | null
          faqs?: Json | null
          featured?: boolean | null
          features?: string[] | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          location?: string | null
          price: number
          pricing_model: string
          provider_id?: string | null
          slug?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          availability?: Json | null
          category?: string
          created_at?: string | null
          description?: string | null
          faqs?: Json | null
          featured?: boolean | null
          features?: string[] | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          location?: string | null
          price?: number
          pricing_model?: string
          provider_id?: string | null
          slug?: string | null
          tags?: string[] | null
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
      subscription_audit_logs: {
        Row: {
          admin_id: string | null
          created_at: string | null
          event_type: string
          id: string
          ip_address: string | null
          new_state: Json | null
          previous_state: Json | null
          subscription_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          new_state?: Json | null
          previous_state?: Json | null
          subscription_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          new_state?: Json | null
          previous_state?: Json | null
          subscription_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_audit_logs_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_credits: {
        Row: {
          created_at: string | null
          credits_amount: number
          description: string | null
          id: string
          reference_id: string | null
          subscription_id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credits_amount: number
          description?: string | null
          id?: string
          reference_id?: string | null
          subscription_id: string
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          credits_amount?: number
          description?: string | null
          id?: string
          reference_id?: string | null
          subscription_id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_credits_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_features: {
        Row: {
          created_at: string | null
          description: string | null
          feature_key: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feature_key: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feature_key?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_invoices: {
        Row: {
          amount: number
          billing_period_end: string | null
          billing_period_start: string | null
          created_at: string | null
          currency: string | null
          due_date: string | null
          id: string
          invoice_date: string | null
          invoice_number: string | null
          line_items: Json | null
          paid_date: string | null
          payment_method: string | null
          status: string
          stripe_invoice_id: string | null
          subscription_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          line_items?: Json | null
          paid_date?: string | null
          payment_method?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          line_items?: Json | null
          paid_date?: string | null
          payment_method?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          allowed_services: number | null
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
          sort_order: number | null
          stripe_price_id: string | null
          trial_period_days: number | null
          updated_at: string | null
          visible_to_roles: string[] | null
        }
        Insert: {
          allowed_services?: number | null
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
          sort_order?: number | null
          stripe_price_id?: string | null
          trial_period_days?: number | null
          updated_at?: string | null
          visible_to_roles?: string[] | null
        }
        Update: {
          allowed_services?: number | null
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
          sort_order?: number | null
          stripe_price_id?: string | null
          trial_period_days?: number | null
          updated_at?: string | null
          visible_to_roles?: string[] | null
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
      subscription_usage: {
        Row: {
          created_at: string | null
          id: string
          metric_name: string
          reference_id: string | null
          subscription_id: string
          usage_count: number | null
          usage_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_name: string
          reference_id?: string | null
          subscription_id: string
          usage_count?: number | null
          usage_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_name?: string
          reference_id?: string | null
          subscription_id?: string
          usage_count?: number | null
          usage_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_usage_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          sender_id: string
          ticket_id: string
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          sender_id: string
          ticket_id: string
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          sender_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string | null
          description: string
          id: string
          priority: string
          resolution: string | null
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          priority?: string
          resolution?: string | null
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          priority?: string
          resolution?: string | null
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          id: string
          language_preference: string | null
          notification_preferences: Json | null
          privacy_settings: Json | null
          theme_preference: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          language_preference?: string | null
          notification_preferences?: Json | null
          privacy_settings?: Json | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          language_preference?: string | null
          notification_preferences?: Json | null
          privacy_settings?: Json | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
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
          created_at: string | null
          credits_remaining: number | null
          credits_used: number | null
          end_date: string
          id: string
          payment_id: string | null
          payment_method: string
          start_date: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_plan_id: string
          trial_end_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          bookings_remaining?: number | null
          bookings_used?: number | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          created_at?: string | null
          credits_remaining?: number | null
          credits_used?: number | null
          end_date: string
          id?: string
          payment_id?: string | null
          payment_method: string
          start_date?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_plan_id: string
          trial_end_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          bookings_remaining?: number | null
          bookings_used?: number | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          created_at?: string | null
          credits_remaining?: number | null
          credits_used?: number | null
          end_date?: string
          id?: string
          payment_id?: string | null
          payment_method?: string
          start_date?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_plan_id?: string
          trial_end_date?: string | null
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
      user_wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          is_verified: boolean | null
          updated_at: string | null
          user_id: string
          verification_status: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          is_verified?: boolean | null
          updated_at?: string | null
          user_id: string
          verification_status?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          is_verified?: boolean | null
          updated_at?: string | null
          user_id?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_sign_in_at: string | null
          roles: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          is_active?: boolean
          last_sign_in_at?: string | null
          roles?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_sign_in_at?: string | null
          roles?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          status: string
          transaction_type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          status?: string
          transaction_type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          status?: string
          transaction_type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "user_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_verification_requests: {
        Row: {
          admin_comments: Json | null
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
          admin_comments?: Json | null
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
          admin_comments?: Json | null
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
      calculate_provider_rating: {
        Args: { provider_id: string }
        Returns: {
          avg_rating: number
          total_reviews: number
        }[]
      }
      can_perform_subscription_action: {
        Args: { p_user_id: string; p_action: string; p_quantity?: number }
        Returns: boolean
      }
      can_provider_respond_to_review: {
        Args: { provider_uuid: string; review_id: string }
        Returns: boolean
      }
      filter_by_timeframe: {
        Args: { date_column: string; timeframe: string }
        Returns: boolean
      }
      get_booking_stats: {
        Args: { user_id: string; user_type: string; timeframe?: string }
        Returns: {
          total_bookings: number
          pending_bookings: number
          confirmed_bookings: number
          completed_bookings: number
          cancelled_bookings: number
          total_earnings: number
          total_spent: number
        }[]
      }
      get_gateway_breakdown: {
        Args: Record<PropertyKey, never>
        Returns: {
          gateway: string
          count: number
          total_amount: number
        }[]
      }
      get_provider_earnings_report: {
        Args: { provider_id: string; timeframe?: string }
        Returns: {
          period: string
          total_earnings: number
          total_bookings: number
          completed_bookings: number
          commission_paid: number
          net_earnings: number
        }[]
      }
      is_admin: {
        Args: { uid: string }
        Returns: boolean
      }
      record_subscription_usage: {
        Args: {
          p_user_id: string
          p_metric_name: string
          p_count?: number
          p_reference_id?: string
        }
        Returns: boolean
      }
      search_services: {
        Args: { search_query: string }
        Returns: {
          availability: Json | null
          category: string
          created_at: string | null
          description: string | null
          faqs: Json | null
          featured: boolean | null
          features: string[] | null
          id: string
          image: string | null
          is_active: boolean | null
          location: string | null
          price: number
          pricing_model: string
          provider_id: string | null
          slug: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }[]
      }
      sum_payment_amounts: {
        Args: Record<PropertyKey, never>
        Returns: {
          sum: number
        }[]
      }
    }
    Enums: {
      client_type: "browser" | "native" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      client_type: ["browser", "native", "other"],
    },
  },
} as const
