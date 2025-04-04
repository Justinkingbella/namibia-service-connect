
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/types/conversations';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState('');
  const [messages, setMessages] = useState<Record<string, any[]>>({});

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch conversations where user is a participant
      const { data: participations, error: participationsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);
        
      if (participationsError) throw participationsError;
      
      if (!participations.length) {
        setConversations([]);
        setLoading(false);
        return;
      }
      
      const conversationIds = participations.map(p => p.conversation_id);
      
      // Fetch the actual conversations
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('last_message_date', { ascending: false });
        
      if (error) throw error;
      
      // We need to map the raw data to our Conversation interface
      // This requires fetching additional data like participants
      const conversationsPromises = data.map(async (conv) => {
        // Fetch participants for each conversation
        const { data: participants, error: participantsError } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', conv.id);
          
        if (participantsError) throw participantsError;
        
        // Fetch recipient details if needed
        const recipientIds = participants
          .filter(p => p.user_id !== user.id)
          .map(p => p.user_id);
          
        let recipientDetails = null;
        if (recipientIds.length > 0) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url')
            .in('id', recipientIds)
            .limit(1)
            .single();
            
          recipientDetails = profileData;
        }
        
        // Map to our Conversation type
        return {
          id: conv.id,
          participants: participants.map(p => ({ id: p.user_id })),
          lastMessage: conv.last_message,
          lastMessageDate: new Date(conv.last_message_date),
          unreadCount: conv.unread_count || 0,
          createdAt: new Date(conv.created_at),
          serviceId: conv.service_id,
          bookingId: conv.booking_id,
          status: conv.status,
          recipientId: recipientDetails?.id,
          recipientName: recipientDetails ? 
            `${recipientDetails.first_name} ${recipientDetails.last_name}` : 
            'Unknown User',
          recipientAvatar: recipientDetails?.avatar_url
        } as Conversation;
      });
      
      const formattedConversations = await Promise.all(conversationsPromises);
      setConversations(formattedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
    
    // Set up real-time subscription for new conversations
    if (user) {
      const conversationsSubscription = supabase
        .channel('conversations-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'conversations'
        }, (payload) => {
          console.log('Conversation change detected:', payload);
          fetchConversations();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(conversationsSubscription);
      };
    }
  }, [user, fetchConversations]);

  // Function to send a message
  const sendMessage = async (conversationId: string, content: string, recipientId?: string, attachments: string[] = []) => {
    if (!user) return false;
    
    try {
      const messageData = {
        conversation_id: conversationId,
        sender_id: user.id,
        recipient_id: recipientId,
        content,
        attachments,
        message_type: 'text',
        read: false,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('messages')
        .insert(messageData);
        
      if (error) throw error;
      
      // Update the conversation's last message
      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          last_message: content,
          last_message_date: new Date().toISOString()
        })
        .eq('id', conversationId);
        
      if (updateError) throw updateError;
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return false;
    }
  };

  // Function to create a new conversation
  const createConversation = async (recipientId: string, initialMessage: string, serviceId?: string, bookingId?: string) => {
    if (!user) return null;
    
    try {
      // First, check if a conversation already exists between these users
      const { data: existingParticipations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);
        
      const userConversationIds = existingParticipations?.map(p => p.conversation_id) || [];
      
      if (userConversationIds.length > 0) {
        const { data: recipientParticipations } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', recipientId)
          .in('conversation_id', userConversationIds);
          
        if (recipientParticipations && recipientParticipations.length > 0) {
          // Conversation already exists, just send the message
          const existingConvId = recipientParticipations[0].conversation_id;
          await sendMessage(existingConvId, initialMessage, recipientId);
          return existingConvId;
        }
      }
      
      // Create a new conversation
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          last_message: initialMessage,
          last_message_date: new Date().toISOString(),
          service_id: serviceId,
          booking_id: bookingId,
          status: 'active'
        })
        .select()
        .single();
        
      if (conversationError) throw conversationError;
      
      // Add participants
      const participants = [
        { user_id: user.id, conversation_id: conversationData.id },
        { user_id: recipientId, conversation_id: conversationData.id }
      ];
      
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert(participants);
        
      if (participantsError) throw participantsError;
      
      // Send initial message
      await sendMessage(conversationData.id, initialMessage, recipientId);
      
      // Refresh conversations
      fetchConversations();
      
      return conversationData.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to create conversation');
      return null;
    }
  };

  return { 
    conversations, 
    messages, 
    loading, 
    activeConversation, 
    setActiveConversation, 
    sendMessage, 
    createConversation,
    refreshConversations: fetchConversations
  };
}
