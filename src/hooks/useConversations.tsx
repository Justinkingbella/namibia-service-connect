
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation, Message } from '@/types/message';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, get the conversation IDs the user is part of
      const { data: participantData, error: participantError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (participantError) {
        throw participantError;
      }

      if (!participantData || participantData.length === 0) {
        setConversations([]);
        setIsLoading(false);
        return;
      }

      const conversationIds = participantData.map(p => p.conversation_id);
      
      // Then get the conversation details
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('last_message_date', { ascending: false });

      if (conversationsError) {
        throw conversationsError;
      }

      // For each conversation, get the other participants
      const enrichedConversations = await Promise.all(
        conversationsData.map(async (conversation) => {
          // First get the participant user_ids
          const { data: participants, error: participantsError } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conversation.id)
            .neq('user_id', user.id);

          if (participantsError) {
            console.error('Error fetching conversation participants:', participantsError);
            return null;
          }

          if (!participants || participants.length === 0) {
            console.warn('No other participants found for conversation:', conversation.id);
            return null;
          }

          // Now fetch the profile data for the first participant
          const otherUserId = participants[0].user_id;
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url')
            .eq('id', otherUserId)
            .single();

          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            return null;
          }

          return {
            id: conversation.id,
            recipientId: profileData.id,
            recipientName: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Unknown User',
            recipientAvatar: profileData.avatar_url,
            lastMessage: conversation.last_message || '',
            lastMessageDate: new Date(conversation.last_message_date),
            unreadCount: conversation.unread_count || 0
          } as Conversation;
        })
      );

      // Filter out any null values from failed participant queries
      const validConversations = enrichedConversations.filter(
        conversation => conversation !== null
      ) as Conversation[];

      setConversations(validConversations);
    } catch (err: any) {
      console.error('Error loading conversations:', err);
      setError(err.message || 'Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          conversationId: msg.conversation_id,
          senderId: msg.sender_id,
          text: msg.content,
          timestamp: new Date(msg.created_at),
          isRead: msg.read,
          attachments: msg.attachments || []
        }));

        setMessages(prev => ({
          ...prev,
          [conversationId]: formattedMessages
        }));
      }
    } catch (err: any) {
      console.error('Error fetching messages:', err);
    }
  }, [user]);

  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation);
    }
  }, [currentConversation, fetchMessages]);

  useEffect(() => {
    fetchConversations();

    // Set up realtime subscription for new messages
    const channel = supabase
      .channel('conversation-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          // Refresh conversations when messages change
          fetchConversations();
          if (currentConversation) {
            fetchMessages(currentConversation);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          // Refresh conversations when conversation data changes
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchConversations, fetchMessages, currentConversation]);

  const sendMessage = async (conversationId: string, text: string) => {
    if (!user) return false;

    try {
      // First get the recipient id
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return false;

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: conversation.recipientId,
          content: text,
          read: false,
          attachments: []
        });

      if (error) throw error;

      // Update local messages
      fetchMessages(conversationId);
      fetchConversations();
      
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      return false;
    }
  };

  return {
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    isLoading,
    error,
    refreshConversations: fetchConversations,
    sendMessage
  };
};
