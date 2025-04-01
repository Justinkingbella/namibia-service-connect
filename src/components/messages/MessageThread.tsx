
import React from 'react';
import { Message } from '@/types/message';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MessageThreadProps {
  messages: Message[];
  currentUserId?: string;
}

const MessageThread: React.FC<MessageThreadProps> = ({ messages, currentUserId }) => {
  const sortedMessages = [...messages].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
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
          return (
            <div
              key={message.id}
              className={cn(
                'flex',
                isCurrentUser ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[75%] px-4 py-3 rounded-lg',
                  isCurrentUser 
                    ? 'bg-primary text-primary-foreground rounded-br-none' 
                    : 'bg-muted rounded-bl-none'
                )}
              >
                <div className="mb-1">{message.text}</div>
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
                  {format(message.timestamp, 'h:mm a')}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageThread;
