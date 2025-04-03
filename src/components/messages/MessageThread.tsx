
import React from 'react';
import { Message } from '@/types/message';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MessageThreadProps {
  messages: Message[];
  currentUserId?: string;
}

const MessageThread: React.FC<MessageThreadProps> = ({ messages, currentUserId }) => {
  const sortedMessages = [...messages].sort(
    (a, b) => {
      const aTime = a.timestamp ? a.timestamp.getTime() : a.createdAt.getTime();
      const bTime = b.timestamp ? b.timestamp.getTime() : b.createdAt.getTime();
      return aTime - bTime;
    }
  );

  return (
    <div className="space-y-4">
      {sortedMessages.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No messages to display. Start the conversation!
        </div>
      ) : (
        sortedMessages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId;
          const displayTime = message.timestamp 
            ? format(message.timestamp, 'h:mm a')
            : format(message.createdAt, 'h:mm a');
          const messageText = message.text || message.content;
          
          return (
            <div
              key={message.id}
              className={cn(
                'flex',
                isCurrentUser ? 'justify-end' : 'justify-start'
              )}
            >
              {!isCurrentUser && (
                <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {message.senderId.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-[75%] px-4 py-3 rounded-lg',
                  isCurrentUser 
                    ? 'bg-primary text-primary-foreground rounded-br-none' 
                    : 'bg-muted rounded-bl-none'
                )}
              >
                <div className="mb-1">{messageText}</div>
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs underline"
                      >
                        Attachment {index + 1}
                      </a>
                    ))}
                  </div>
                )}
                <div 
                  className={cn(
                    'text-xs mt-1',
                    isCurrentUser ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  )}
                >
                  {displayTime}
                </div>
              </div>
              {isCurrentUser && (
                <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    ME
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageThread;
