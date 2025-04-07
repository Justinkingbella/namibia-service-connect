
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
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  read: boolean;
  created_at: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  is_system_message: boolean;
  attachments: string[];
  metadata?: Json;
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
