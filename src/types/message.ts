export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  content?: string; // Added to match profile service
  timestamp: Date;
  isRead: boolean;
  attachments: string[]; // Array of attachment URLs
  senderName?: string;
  senderAvatar?: string;
  sentAt?: Date;
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
  read: boolean; // Note: this field is "read" in the database, not "is_read"
  attachments: string[];
  recipient_id?: string;
}

export interface DbConversation {
  id: string;
  created_at: string;
  last_message: string;
  last_message_date: string;
  unread_count: number;
}

export interface DbConversationParticipant {
  id?: string;
  conversation_id: string;
  user_id: string;
  created_at?: string;
  user?: {
    id: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

// These interfaces define the raw structure of our Supabase database tables
// We'll use them to properly type-cast our Supabase queries
export interface DbTables {
  messages: DbMessage;
  conversations: DbConversation;
  conversation_participants: DbConversationParticipant;
}

// Type assertion helper for Supabase tables
export const tableNames = {
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
  CONVERSATION_PARTICIPANTS: 'conversation_participants'
} as const;

export type TableName = typeof tableNames[keyof typeof tableNames];
