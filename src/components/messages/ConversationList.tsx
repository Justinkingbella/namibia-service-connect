
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { Conversation } from '@/types/message';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
}) => {
  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No conversations found.
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelect(conversation.id)}
          className={cn(
            'w-full text-left p-4 hover:bg-muted/30 transition-colors duration-200',
            selectedId === conversation.id && 'bg-primary/5 hover:bg-primary/10'
          )}
        >
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              {conversation.recipientAvatar ? (
                <img src={conversation.recipientAvatar} alt={conversation.recipientName} />
              ) : (
                <User className="h-6 w-6" />
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium truncate">{conversation.recipientName}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {formatDistanceToNow(conversation.lastMessageDate, { addSuffix: true })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground truncate pr-2">
                  {conversation.lastMessage}
                </p>
                {conversation.unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ConversationList;
