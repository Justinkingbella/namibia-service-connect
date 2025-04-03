
export interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  conversationId?: string;
  createdAt: Date;
  isRead: boolean;
  attachments?: string[];
  // Add properties used in MessageThread component
  timestamp?: Date;
  text?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageDate?: Date;
  unreadCount: number;
  createdAt: Date;
  status: 'active' | 'archived' | 'deleted';
  // Add properties used in ConversationList
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
}
