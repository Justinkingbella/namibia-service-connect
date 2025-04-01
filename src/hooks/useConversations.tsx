
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Conversation, Message, DbMessage, tableNames, TableName } from '@/types/message';

// This type assertion helper is needed to work around TypeScript limitations
// with the Supabase client when accessing tables not in the auto-generated types
const from = <T extends TableName>(table: T) => {
  return supabase.from(table as any);
};

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);

  // Load user's conversations
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const loadConversations = async () => {
      setLoading(true);
      try {
        // Using our type assertion helper to specify the table
        const { data, error } = await from(tableNames.CONVERSATION_PARTICIPANTS)
          .select(`
            conversation_id,
            conversation:${tableNames.CONVERSATIONS} (
              id,
              created_at,
              last_message,
              last_message_date,
              unread_count
            ),
            otherParticipants:${tableNames.CONVERSATION_PARTICIPANTS} (
              user_id,
              user:profiles (
                id,
                first_name,
                last_name,
                avatar_url
              )
            )
          `)
          .eq('user_id', user.id)
          .order('conversation:conversations.last_message_date', { ascending: false });

        if (error) throw error;

        // Transform the data into our expected format
        const transformedConversations: Conversation[] = data.map((item: any) => {
          const otherParticipant = item.otherParticipants.find(
            (p: any) => p.user_id !== user.id
          )?.user;
          
          return {
            id: item.conversation_id,
            recipientId: otherParticipant?.id || '',
            recipientName: otherParticipant ? 
              `${otherParticipant.first_name || ''} ${otherParticipant.last_name || ''}`.trim() : 
              'Unknown User',
            recipientAvatar: otherParticipant?.avatar_url,
            lastMessage: item.conversation.last_message || '',
            lastMessageDate: new Date(item.conversation.last_message_date),
            unreadCount: item.conversation.unread_count || 0,
          };
        });

        setConversations(transformedConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast({
          variant: "destructive",
          title: "Failed to load conversations",
          description: "There was an error loading your conversations. Please try again."
        });
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
    
    // Subscribe to real-time updates
    const conversationsSubscription = supabase
      .channel('public:conversations')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: tableNames.CONVERSATIONS
      }, () => {
        loadConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsSubscription);
    };
  }, [user?.id]);

  // Load messages for current conversation
  useEffect(() => {
    if (!currentConversation || !user?.id) return;

    const loadMessages = async () => {
      try {
        const { data, error } = await from(tableNames.MESSAGES)
          .select('*')
          .eq('conversation_id', currentConversation)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Convert DB format to our app format
        const formattedMessages: Message[] = (data as DbMessage[]).map(msg => ({
          id: msg.id,
          conversationId: msg.conversation_id,
          senderId: msg.sender_id,
          text: msg.content,
          timestamp: new Date(msg.created_at),
          isRead: msg.read, // Using "read" field from DB
          attachments: msg.attachments || [],
        }));

        setMessages(prev => ({
          ...prev,
          [currentConversation]: formattedMessages
        }));

        // Mark unread messages as read
        const unreadMessages = formattedMessages.filter(
          msg => !msg.isRead && msg.senderId !== user.id
        );
        
        if (unreadMessages.length > 0) {
          await Promise.all(unreadMessages.map(msg => 
            from(tableNames.MESSAGES)
              .update({ read: true }) // Use "read" instead of "is_read"
              .eq('id', msg.id)
          ));
          
          // Update local state to reflect read status
          setMessages(prev => ({
            ...prev,
            [currentConversation]: prev[currentConversation].map(msg => ({
              ...msg,
              isRead: msg.senderId === user.id ? msg.isRead : true
            }))
          }));
          
          // Update conversation unread count
          const convo = conversations.find(c => c.id === currentConversation);
          if (convo && convo.unreadCount > 0) {
            setConversations(prev => 
              prev.map(c => 
                c.id === currentConversation ? { ...c, unreadCount: 0 } : c
              )
            );
          }
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        toast({
          variant: "destructive",
          title: "Failed to load messages",
          description: "There was an error loading messages. Please try again."
        });
      }
    };

    loadMessages();
    
    // Subscribe to real-time updates for messages
    const messagesSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: tableNames.MESSAGES,
        filter: `conversation_id=eq.${currentConversation}`
      }, (payload) => {
        const newMsg = payload.new as any;
        
        // Add the new message to state
        const formattedMsg: Message = {
          id: newMsg.id,
          conversationId: newMsg.conversation_id,
          senderId: newMsg.sender_id,
          text: newMsg.content,
          timestamp: new Date(newMsg.created_at),
          isRead: newMsg.read, // Using "read" instead of "is_read"
          attachments: newMsg.attachments || [],
        };
        
        setMessages(prev => ({
          ...prev,
          [currentConversation]: [...(prev[currentConversation] || []), formattedMsg]
        }));
        
        // Mark as read if it's from someone else
        if (newMsg.sender_id !== user.id) {
          from(tableNames.MESSAGES)
            .update({ read: true }) // Using "read" instead of "is_read"
            .eq('id', newMsg.id)
            .then();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [currentConversation, user?.id, conversations]);

  const sendMessage = async (conversationId: string, text: string) => {
    if (!user?.id) return false;
    
    try {
      const { data, error } = await from(tableNames.MESSAGES)
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: text,
          read: false, 
          attachments: []
        })
        .select()
        .single();

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again."
      });
      return false;
    }
  };

  const createConversation = async (recipientId: string, initialMessage: string) => {
    if (!user?.id || recipientId === user.id) return null;
    
    try {
      // Check if conversation already exists
      const { data: existingConvos } = await from(tableNames.CONVERSATION_PARTICIPANTS)
        .select('conversation_id')
        .eq('user_id', user.id);
        
      if (existingConvos && existingConvos.length > 0) {
        const convoIds = existingConvos.map((c: any) => c.conversation_id);
        
        const { data: sharedConvos } = await from(tableNames.CONVERSATION_PARTICIPANTS)
          .select('conversation_id')
          .eq('user_id', recipientId)
          .in('conversation_id', convoIds);
          
        if (sharedConvos && sharedConvos.length > 0) {
          // Conversation exists, use the first one
          const existingConvoId = sharedConvos[0].conversation_id;
          await sendMessage(existingConvoId, initialMessage);
          return existingConvoId;
        }
      }
      
      // Create new conversation
      const { data: newConvo, error: convoError } = await from(tableNames.CONVERSATIONS)
        .insert({
          last_message: initialMessage,
          last_message_date: new Date().toISOString()
        })
        .select()
        .single();
        
      if (convoError) throw convoError;
      
      // Add participants
      await from(tableNames.CONVERSATION_PARTICIPANTS)
        .insert([
          { conversation_id: newConvo.id, user_id: user.id },
          { conversation_id: newConvo.id, user_id: recipientId }
        ]);
        
      // Send initial message
      await sendMessage(newConvo.id, initialMessage);
      
      return newConvo.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        variant: "destructive",
        title: "Failed to create conversation",
        description: "There was an error creating the conversation. Please try again."
      });
      return null;
    }
  };

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    setCurrentConversation,
    sendMessage,
    createConversation
  };
}
