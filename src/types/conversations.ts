
export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageDate?: Date;
  unreadCount?: number;
  createdAt: Date;
  bookingId?: string;
  serviceId?: string;
  status?: string;
  // For compatibility with API responses
  last_message?: string;
  last_message_date?: string;
  booking_id?: string;
  service_id?: string;
  created_at?: string;
  unread_count?: number;
  // For UI display
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
  attachments?: string[];
  recipientId?: string;
  // For compatibility with API responses
  read?: boolean;
  created_at?: string;
}
