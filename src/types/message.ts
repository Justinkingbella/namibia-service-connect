
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
  attachments: string[]; // Always defined as an array
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
