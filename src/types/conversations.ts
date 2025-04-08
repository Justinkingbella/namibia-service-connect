
import { Json } from './schema';

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt?: string;
  serviceId?: string;
  bookingId?: string;
  isActive?: boolean;
  // Add properties needed by UI components
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
  serviceName?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  is_system_message: boolean;
  attachments: string[];
  metadata?: Json;
  // Add properties needed by components
  conversationId?: string;
  senderId?: string;
  recipientId?: string;
  createdAt?: string;
  messageType?: string;
  isSystemMessage?: boolean;
}

export interface ConversationWithDetails extends Conversation {
  otherParticipant?: {
    id: string;
    name: string;
    avatarUrl?: string;
    role?: string;
  };
  service?: {
    id: string;
    title: string;
    image?: string;
  };
}
