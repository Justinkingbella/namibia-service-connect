
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: Date;
  read: boolean;
  messageType?: 'text' | 'image' | 'file' | 'system';
  attachments?: string[];
  isSystemMessage?: boolean;
}
