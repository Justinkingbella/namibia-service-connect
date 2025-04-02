
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation } from '@/types/message';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
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
          const { data: participants, error: participantsError } = await supabase
            .from('conversation_participants')
            .select(`
              user_id,
              profiles:user_id (
                first_name,
                last_name,
                avatar_url,
                role
              )
            `)
            .eq('conversation_id', conversation.id)
            .neq('user_id', user.id);

          if (participantsError) {
            console.error('Error fetching conversation participants:', participantsError);
            return {
              ...conversation,
              participants: []
            };
          }

          return {
            ...conversation,
            participants: participants || []
          };
        })
      );

      setConversations(enrichedConversations);
    } catch (err: any) {
      console.error('Error loading conversations:', err);
      setError(err.message || 'Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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
  }, [fetchConversations]);

  return { conversations, isLoading, error, refreshConversations: fetchConversations };
};
