
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/message';
import { toast } from 'sonner';

export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        // Convert to Message type with proper field mapping
        const formattedMessages = data.map((msg: any): Message => ({
          id: msg.id,
          conversationId: msg.conversation_id,
          senderId: msg.sender_id,
          recipientId: msg.recipient_id || '',
          content: msg.content,
          createdAt: new Date(msg.created_at),
          read: msg.read,
          attachments: msg.attachments || [],
          messageType: msg.message_type || 'text',
          isSystemMessage: msg.is_system_message || false
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`messages-${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        const newMessage = payload.new as any;
        
        const formattedMessage: Message = {
          id: newMessage.id,
          conversationId: newMessage.conversation_id,
          senderId: newMessage.sender_id,
          recipientId: newMessage.recipient_id || '',
          content: newMessage.content,
          createdAt: new Date(newMessage.created_at),
          read: newMessage.read,
          attachments: newMessage.attachments || [],
          messageType: newMessage.message_type || 'text',
          isSystemMessage: newMessage.is_system_message || false
        };
        
        setMessages(prev => [...prev, formattedMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [conversationId]);

  const sendMessage = async (content: string, recipientId?: string, attachments: string[] = []) => {
    if (!conversationId || content.trim() === '') return;

    try {
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) throw new Error('User not authenticated');

      const messageData = {
        conversation_id: conversationId,
        sender_id: currentUser.id,
        recipient_id: recipientId || null,
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

      // No need to update state here - the realtime subscription will handle it
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return false;
    }
  };

  return { messages, loading, sendMessage };
}
