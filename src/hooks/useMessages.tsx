
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types/message';
import { fetchUserMessages, sendMessage, markMessageAsRead } from '@/services/mockProfileService';

export function useMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await fetchUserMessages(user.id);
      setMessages(data);
      setLoading(false);
    };

    loadMessages();
  }, [user?.id]);

  const sendNewMessage = async (recipientId: string, content: string, attachments?: string[]) => {
    if (!user?.id) return null;

    setLoading(true);
    const newMessage = await sendMessage({
      senderId: user.id,
      recipientId,
      content,
      attachments,
      isRead: false
    });
    
    if (newMessage) {
      setMessages(prev => [...prev, newMessage]);
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully."
      });
      
      setLoading(false);
      return newMessage;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to send message",
      description: "There was an error sending your message. Please try again."
    });
    
    setLoading(false);
    return null;
  };

  const markAsRead = async (messageId: string) => {
    setLoading(true);
    const success = await markMessageAsRead(messageId);
    
    if (success) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, isRead: true } 
            : msg
        )
      );
      
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  return {
    messages,
    loading,
    sendMessage: sendNewMessage,
    markAsRead
  };
}
