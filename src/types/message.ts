
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: Date;
  messageType?: 'text' | 'image' | 'file';
}
