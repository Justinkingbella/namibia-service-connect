
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
  attachments: string[]; // Array of attachment URLs
}

export interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  lastMessage: string;
  lastMessageDate: Date;
  unreadCount: number;
}

// Interfaces for Supabase data
export interface DbMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  attachments: string[];
  recipient_id?: string;
}

export interface DbConversation {
  id: string;
  created_at: string;
  updated_at: string;
  last_message: string;
  last_message_date: string;
  unread_count: number;
  participants?: {
    user_id: string;
    user?: {
      id: string;
      email?: string;
      raw_user_meta_data?: {
        name?: string;
      };
    };
  }[];
}
