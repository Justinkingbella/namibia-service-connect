
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Image, Paperclip, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation, Message } from '@/types';
import { formatDate } from '@/lib/utils';

interface MessageThreadProps {
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  conversation,
  messages,
  onSendMessage,
  isLoading
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Formats like "Today at 10:30 AM" or "Mar 15 at 3:45 PM"
  const formatMessageTime = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return `Today at ${messageDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${messageDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return `${messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${messageDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (!conversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
        <Info className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-medium">No conversation selected</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={conversation.recipientAvatar} />
            <AvatarFallback>
              {(conversation.recipientName?.[0] || '?').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{conversation.recipientName || 'Unknown User'}</h3>
            {conversation.serviceName && (
              <p className="text-xs text-muted-foreground">
                Re: {conversation.serviceName}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isUser = msg.sender_id === user?.id || msg.senderId === user?.id;
            const showDate = index === 0 || 
              new Date(messages[index-1].created_at || messages[index-1].createdAt || '').toDateString() !== 
              new Date(msg.created_at || msg.createdAt || '').toDateString();
              
            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <div className="text-center my-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                      {formatDate(msg.created_at || msg.createdAt || '')}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`}>
                    {!isUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={conversation.recipientAvatar} />
                        <AvatarFallback>
                          {(conversation.recipientName?.[0] || '?').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div>
                      <div className={`p-3 rounded-lg ${
                        isUser 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p>{msg.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatMessageTime(new Date(msg.created_at || msg.createdAt || ''))}
                      </p>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <div className="flex gap-2 mt-2">
              <Button type="button" size="sm" variant="ghost">
                <Image className="h-4 w-4" />
              </Button>
              <Button type="button" size="sm" variant="ghost">
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button type="submit" size="icon" disabled={!message.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MessageThread;
