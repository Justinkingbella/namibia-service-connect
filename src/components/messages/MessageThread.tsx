
import React, { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Message } from '@/types/conversations';
import { formatTime } from '@/lib/utils';

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

const MessageThread: React.FC<MessageThreadProps> = ({ messages, currentUserId, onSendMessage, isLoading = false }) => {
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group messages by date
  const groupedMessages = messages.reduce((groups: Record<string, Message[]>, message) => {
    const date = new Date(message.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const handleSendMessage = () => {
    if (messageInputRef.current?.value && messageInputRef.current.value.trim() !== '') {
      onSendMessage(messageInputRef.current.value);
      messageInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-3">
            <div className="flex justify-center">
              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">{date}</span>
            </div>

            {dateMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.senderId !== currentUserId && !message.isSystemMessage && (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] ${
                    message.isSystemMessage
                      ? 'bg-muted text-muted-foreground text-center w-full'
                      : message.senderId === currentUserId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  } rounded-lg p-3`}
                >
                  {message.content}
                  <div
                    className={`text-xs mt-1 ${
                      message.senderId === currentUserId
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {formatTime(message.createdAt)} {message.read && message.senderId === currentUserId && '• Read'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-3 flex">
        <input
          type="text"
          ref={messageInputRef}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          disabled={isLoading}
        />
        <Button
          type="button"
          size="icon"
          className="ml-2"
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageThread;
