
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation, Message } from '@/types';
import { getUserMessages } from '@/services/mockProfileService';

interface ConversationMap {
  [key: string]: Message[];
}

interface UseConversationsReturn {
  conversations: Conversation[];
  messages: ConversationMap;
  loading: boolean;
  activeConversation: string;
  setActiveConversation: (id: string) => void;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  createConversation: (recipientId: string, initialMessage: string) => Promise<void>;
}

export function useConversations(): UseConversationsReturn {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ConversationMap>({});
  const [loading, setLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState('');

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Mock conversations data
      const mockConversations: Conversation[] = [
        {
          id: 'conv1',
          participants: ['user123', 'provider123'],
          lastMessage: 'Tuesday at 10am works for me. Ill be there!',
          lastMessageDate: new Date(Date.now() - 3200000).toISOString(),
          unreadCount: 0,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          serviceId: 'service1',
          bookingId: 'book123',
          isActive: true,
          recipientId: 'provider123',
          recipientName: 'Jane Smith',
          recipientAvatar: 'https://i.pravatar.cc/150?img=2',
          serviceName: 'Home Cleaning'
        }
      ];

      setConversations(mockConversations);
      setLoading(false);
    };

    fetchConversations();
  }, [user]);

  // Fetch messages for active conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !activeConversation) return;

      try {
        const conversationMessages = await getUserMessages(user.id, activeConversation);
        setMessages(prev => ({
          ...prev,
          [activeConversation]: conversationMessages
        }));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (activeConversation) {
      fetchMessages();
    }
  }, [activeConversation, user]);

  // Send a message
  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    if (!user || !conversationId || !content.trim()) return;

    try {
      // Create new message
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversation_id: conversationId,
        sender_id: user.id,
        recipient_id: conversations.find(c => c.id === conversationId)?.recipientId || '',
        content,
        read: false,
        created_at: new Date().toISOString(),
        message_type: 'text',
        is_system_message: false,
        attachments: [],
        // Add mapped properties for components
        conversationId,
        senderId: user.id,
        recipientId: conversations.find(c => c.id === conversationId)?.recipientId || '',
        createdAt: new Date().toISOString()
      };

      // Update messages state
      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMessage]
      }));

      // Update conversation with new last message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage: content,
                lastMessageDate: new Date().toISOString()
              }
            : conv
        )
      );

      // In a real app, you'd send the message to the server here
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [user, conversations]);

  // Create a new conversation
  const createConversation = useCallback(async (recipientId: string, initialMessage: string) => {
    if (!user || !recipientId || !initialMessage.trim()) return;

    try {
      // Create new conversation
      const newConversationId = `conv-${Date.now()}`;
      const newConversation: Conversation = {
        id: newConversationId,
        participants: [user.id, recipientId],
        lastMessage: initialMessage,
        lastMessageDate: new Date().toISOString(),
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        isActive: true,
        recipientId,
        // You'd typically fetch these details from your user database
        recipientName: 'New Contact',
        recipientAvatar: ''
      };

      // Create initial message
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversation_id: newConversationId,
        sender_id: user.id,
        recipient_id: recipientId,
        content: initialMessage,
        read: false,
        created_at: new Date().toISOString(),
        message_type: 'text',
        is_system_message: false,
        attachments: [],
        // Add mapped properties for components
        conversationId: newConversationId,
        senderId: user.id,
        recipientId,
        createdAt: new Date().toISOString()
      };

      // Update state
      setConversations(prev => [newConversation, ...prev]);
      setMessages(prev => ({
        ...prev,
        [newConversationId]: [newMessage]
      }));
      setActiveConversation(newConversationId);

      // In a real app, you'd save the conversation and message to the server here
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  }, [user]);

  return {
    conversations,
    messages,
    loading,
    activeConversation,
    setActiveConversation,
    sendMessage,
    createConversation
  };
}
