
import { Message } from '@/types/conversations';

// Mock messages for the conversation system
export const mockMessages: Message[] = [
  {
    id: 'msg1',
    conversationId: 'conv1',
    senderId: 'provider123',
    recipientId: 'user123',
    content: 'Hello! Im available to provide my cleaning services next week. When would be a good time?',
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    message_type: 'text',
    is_system_message: false,
    attachments: []
  },
  {
    id: 'msg2',
    conversationId: 'conv1',
    senderId: 'user123',
    recipientId: 'provider123',
    content: 'Hi Jane! Tuesday at 10am would be perfect if youre available.',
    read: true,
    created_at: new Date(Date.now() - 3400000).toISOString(), // 56 minutes ago
    message_type: 'text',
    is_system_message: false,
    attachments: []
  },
  {
    id: 'msg3',
    conversationId: 'conv1',
    senderId: 'provider123',
    recipientId: 'user123',
    content: 'Tuesday at 10am works for me. Ill be there! Do you have any specific cleaning products preferences?',
    read: true,
    created_at: new Date(Date.now() - 3200000).toISOString(), // 53 minutes ago
    message_type: 'text',
    is_system_message: false,
    attachments: []
  }
];

// Function to get user messages
export const getUserMessages = async (userId: string, conversationId?: string): Promise<Message[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  if (conversationId) {
    return mockMessages.filter(msg => 
      msg.conversationId === conversationId &&
      (msg.senderId === userId || msg.recipientId === userId)
    );
  }
  
  return mockMessages.filter(msg => 
    msg.senderId === userId || msg.recipientId === userId
  );
};
