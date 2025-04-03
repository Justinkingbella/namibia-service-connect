
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  text?: string; // Added for compatibility with existing code
  timestamp?: Date;
  createdAt: Date;
  isRead: boolean;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageDate?: Date;
  status: 'active' | 'archived' | 'deleted';
  createdAt: Date;
  unreadCount?: number;
  
  // Added for compatibility with existing code
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
}
