
// Remove the import that's conflicting
// import { Message } from "./message";

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name?: string;
    avatar?: string;
  }[];
  lastMessage?: string;
  lastMessageDate?: Date;
  createdAt: Date;
  unreadCount: number;
  serviceId?: string;
  serviceName?: string;
  bookingId?: string;
  status?: 'active' | 'archived';
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
  lastSenderId?: string;
}

// Define the Message interface here to avoid conflict
export interface Message {
  id: string;
  conversationId: string; 
  senderId: string;
  recipientId?: string;
  content: string;
  createdAt: Date;
  read: boolean;
  messageType?: 'text' | 'image' | 'file' | 'system';
  attachments?: string[];
  isSystemMessage?: boolean;
}
