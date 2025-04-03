
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Message, Conversation } from '@/types/message';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useConversations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  // Fetch user's conversations
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      try {
        // First get conversation participant entries for this user
        const { data: participantData, error: participantError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id);

        if (participantError) {
          console.error('Error fetching conversation participants:', participantError);
          toast({
            variant: 'destructive',
            title: 'Error loading conversations',
            description: 'Please try again later'
          });
          setLoading(false);
          return;
        }

        if (!participantData.length) {
          setConversations([]);
          setLoading(false);
          return;
        }

        // Get the conversation IDs
        const conversationIds = participantData.map(p => p.conversation_id);

        // Fetch the actual conversations
        const { data: conversationsData, error: conversationsError } = await supabase
          .from('conversations')
          .select('*')
          .in('id', conversationIds)
          .order('last_message_date', { ascending: false });

        if (conversationsError) {
          console.error('Error fetching conversations:', conversationsError);
          toast({
            variant: 'destructive',
            title: 'Error loading conversations',
            description: 'Please try again later'
          });
          setLoading(false);
          return;
        }

        // For each conversation, get the other participant
        const conversationsWithParticipants = await Promise.all(
          conversationsData.map(async (conversation) => {
            // Get all participants for this conversation
            const { data: participants, error: participantsError } = await supabase
              .from('conversation_participants')
              .select('user_id')
              .eq('conversation_id', conversation.id);

            if (participantsError) {
              console.error('Error fetching participants:', participantsError);
              return conversation;
            }

            // Filter out the current user
            const otherParticipantIds = participants
              .filter(p => p.user_id !== user.id)
              .map(p => p.user_id);

            // Get the other participant's profile info
            if (otherParticipantIds.length > 0) {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, avatar_url')
                .in('id', otherParticipantIds);

              if (profileError) {
                console.error('Error fetching participant profiles:', profileError);
                return conversation;
              }

              if (profileData.length > 0) {
                const otherUser = profileData[0];
                return {
                  ...conversation,
                  recipientId: otherUser.id,
                  recipientName: `${otherUser.first_name} ${otherUser.last_name}`.trim(),
                  recipientAvatar: otherUser.avatar_url
                };
              }
            }

            return conversation;
          })
        );

        setConversations(conversationsWithParticipants);
        setLoading(false);
      } catch (error) {
        console.error('Error in fetchConversations:', error);
        toast({
          variant: 'destructive',
          title: 'Error loading conversations',
          description: 'Please try again later'
        });
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user?.id, toast]);

  // When a conversation is selected, fetch its messages
  useEffect(() => {
    if (!activeConversation || !user?.id) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', activeConversation)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          toast({
            variant: 'destructive',
            title: 'Error loading messages',
            description: 'Please try again later'
          });
          return;
        }

        // Convert to Message type
        const formattedMessages: Message[] = data.map(msg => ({
          id: msg.id,
          conversationId: msg.conversation_id,
          senderId: msg.sender_id,
          recipientId: msg.recipient_id || '',
          content: msg.content,
          createdAt: new Date(msg.created_at),
          isRead: msg.read,
          attachments: msg.attachments || []
        }));

        setMessages(prev => ({
          ...prev,
          [activeConversation]: formattedMessages
        }));

        // Mark messages as read if they're from the other person
        const unreadMessages = formattedMessages.filter(
          msg => !msg.isRead && msg.senderId !== user.id
        );

        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));
        }
      } catch (error) {
        console.error('Error in fetchMessages:', error);
      }
    };

    fetchMessages();

    // Subscribe to new messages for this conversation
    const channel = supabase
      .channel(`conversation-${activeConversation}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConversation}`
        },
        async (payload) => {
          console.log('New message received:', payload);
          
          // Format the message
          const newMessage: Message = {
            id: payload.new.id,
            conversationId: payload.new.conversation_id,
            senderId: payload.new.sender_id,
            recipientId: payload.new.recipient_id || '',
            content: payload.new.content,
            text: payload.new.content,
            createdAt: new Date(payload.new.created_at),
            isRead: payload.new.read,
            attachments: payload.new.attachments || []
          };

          // Add to state
          setMessages(prev => ({
            ...prev,
            [activeConversation]: [...(prev[activeConversation] || []), newMessage]
          }));

          // Mark as read if not from current user
          if (newMessage.senderId !== user.id) {
            await supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMessage.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversation, user?.id, toast]);

  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    recipientId?: string,
    attachments: string[] = []
  ) => {
    if (!user?.id) return false;

    try {
      const messageData = {
        conversation_id: conversationId,
        sender_id: user.id,
        recipient_id: recipientId,
        content,
        attachments,
        read: false,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to send message',
          description: 'Please try again'
        });
        return false;
      }

      // Update last message in conversation
      await supabase
        .from('conversations')
        .update({
          last_message: content,
          last_message_date: new Date().toISOString()
        })
        .eq('id', conversationId);

      return true;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to send message',
        description: 'Please try again'
      });
      return false;
    }
  }, [user?.id, toast]);

  const createConversation = useCallback(async (
    recipientId: string,
    initialMessage: string
  ) => {
    if (!user?.id) return null;

    try {
      // Check if conversation already exists
      const { data: existingParticipations, error: participationError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (participationError) {
        console.error('Error checking existing conversations:', participationError);
        toast({
          variant: 'destructive',
          title: 'Failed to create conversation',
          description: 'Please try again'
        });
        return null;
      }

      if (existingParticipations.length > 0) {
        const conversationIds = existingParticipations.map(p => p.conversation_id);

        // Check if there's a conversation with the recipient
        const { data: recipientParticipations, error: recipientError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', recipientId)
          .in('conversation_id', conversationIds);

        if (recipientError) {
          console.error('Error checking recipient participation:', recipientError);
        } else if (recipientParticipations.length > 0) {
          // Conversation exists, use it
          const existingConversationId = recipientParticipations[0].conversation_id;
          await sendMessage(existingConversationId, initialMessage, recipientId);
          return existingConversationId;
        }
      }

      // Create new conversation
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .insert([{
          status: 'active',
          last_message: initialMessage,
          last_message_date: new Date().toISOString(),
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        toast({
          variant: 'destructive',
          title: 'Failed to create conversation',
          description: 'Please try again'
        });
        return null;
      }

      const conversationId = conversationData.id;

      // Add participants
      const participantsToAdd = [
        { conversation_id: conversationId, user_id: user.id },
        { conversation_id: conversationId, user_id: recipientId }
      ];

      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert(participantsToAdd);

      if (participantsError) {
        console.error('Error adding participants:', participantsError);
        toast({
          variant: 'destructive',
          title: 'Failed to create conversation',
          description: 'Please try again'
        });
        return null;
      }

      // Send initial message
      await sendMessage(conversationId, initialMessage, recipientId);

      return conversationId;
    } catch (error) {
      console.error('Error in createConversation:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to create conversation',
        description: 'Please try again'
      });
      return null;
    }
  }, [user?.id, sendMessage, toast]);

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
